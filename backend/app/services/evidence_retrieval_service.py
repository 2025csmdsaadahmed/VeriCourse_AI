import hashlib
import ipaddress
import socket
from datetime import datetime, timezone
from html.parser import HTMLParser
from urllib.parse import urljoin, urlparse

import httpx


class VisibleTextParser(HTMLParser):
    """Extract readable text while ignoring scripts and styles."""

    def __init__(self):
        super().__init__()
        self.text_parts = []
        self.ignore_content = False

    def handle_starttag(self, tag, attrs):
        if tag.lower() in {"script", "style", "noscript", "svg"}:
            self.ignore_content = True

    def handle_endtag(self, tag):
        if tag.lower() in {"script", "style", "noscript", "svg"}:
            self.ignore_content = False

    def handle_data(self, data):
        if not self.ignore_content:
            cleaned = data.strip()
            if cleaned:
                self.text_parts.append(cleaned)


class EvidenceRetrievalService:

    MAX_CONTENT_SIZE = 1_000_000
    MAX_REDIRECTS = 3
    TIMEOUT_SECONDS = 15

    def _validate_url(self, url: str):
        parsed = urlparse(url)

        if parsed.scheme not in {"http", "https"}:
            raise ValueError("Only HTTP and HTTPS URLs are allowed.")

        if not parsed.hostname:
            raise ValueError("Invalid source URL.")

        if parsed.username or parsed.password:
            raise ValueError("URLs containing credentials are not allowed.")

        hostname = parsed.hostname.lower()

        if hostname in {"localhost", "localhost.localdomain"}:
            raise ValueError("Local URLs are not allowed.")

        try:
            ip_addresses = socket.getaddrinfo(
                hostname,
                None,
                type=socket.SOCK_STREAM
            )
        except socket.gaierror:
            raise ValueError("Unable to resolve the source hostname.")

        for address in ip_addresses:
            ip = ipaddress.ip_address(address[4][0])

            if not ip.is_global:
                raise ValueError("Private or non-public source addresses are not allowed.")

        return parsed

    def retrieve_source(self, source_url: str) -> dict:

        current_url = source_url

        headers = {
            "User-Agent": "VeriCourseAI-EvidenceBot/1.0",
            "Accept": "text/html,text/plain"
        }

        try:
            with httpx.Client(
                timeout=self.TIMEOUT_SECONDS,
                follow_redirects=False,
                headers=headers
            ) as client:

                for redirect_count in range(self.MAX_REDIRECTS + 1):

                    self._validate_url(current_url)

                    with client.stream("GET", current_url) as response:

                        if response.status_code in {301, 302, 303, 307, 308}:
                            location = response.headers.get("location")

                            if not location:
                                raise ValueError("Redirect location is missing.")

                            if redirect_count == self.MAX_REDIRECTS:
                                raise ValueError("Too many redirects.")

                            current_url = urljoin(current_url, location)
                            continue

                        response.raise_for_status()

                        content_type = response.headers.get(
                            "content-type", ""
                        ).lower()

                        if not (
                            "text/html" in content_type
                            or "text/plain" in content_type
                        ):
                            raise ValueError(
                                "Unsupported source format. HTML or plain text is required."
                            )

                        content_length = response.headers.get("content-length")

                        if content_length and int(content_length) > self.MAX_CONTENT_SIZE:
                            raise ValueError("Source content is too large.")

                        chunks = []
                        total_size = 0

                        for chunk in response.iter_bytes():
                            total_size += len(chunk)

                            if total_size > self.MAX_CONTENT_SIZE:
                                raise ValueError("Source content is too large.")

                            chunks.append(chunk)

                        raw_content = b"".join(chunks)
                        content = raw_content.decode(
                            response.encoding or "utf-8",
                            errors="replace"
                        )

                        if "text/html" in content_type:
                            parser = VisibleTextParser()
                            parser.feed(content)
                            extracted_text = " ".join(parser.text_parts)
                        else:
                            extracted_text = content.strip()

                        if not extracted_text:
                            raise ValueError("No readable content was found.")

                        return {
                            "source_url": str(response.url),
                            "page_title": self._extract_title(content, content_type),
                            "content": extracted_text,
                            "content_hash": hashlib.sha256(
                                raw_content
                            ).hexdigest(),
                            "fetched_at": datetime.now(
                                timezone.utc
                            ).isoformat(),
                            "retrieval_status": "success"
                        }

        except (httpx.HTTPError, UnicodeError) as error:
            raise RuntimeError(
                f"Source retrieval failed: {error}"
            ) from error

        raise RuntimeError("Source retrieval did not complete.")

    def _extract_title(self, content: str, content_type: str) -> str:

        if "text/html" not in content_type:
            return "Plain text source"

        class TitleParser(HTMLParser):
            def __init__(self):
                super().__init__()
                self.in_title = False
                self.title = ""

            def handle_starttag(self, tag, attrs):
                if tag.lower() == "title":
                    self.in_title = True

            def handle_endtag(self, tag):
                if tag.lower() == "title":
                    self.in_title = False

            def handle_data(self, data):
                if self.in_title:
                    self.title += data

        parser = TitleParser()
        parser.feed(content)

        return parser.title.strip() or "Untitled source"


evidence_retrieval_service = EvidenceRetrievalService()