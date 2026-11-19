name: Bug Report
description: Create a report to help us fix a bug or issue in VeriCourse AI
title: "[BUG] "
labels: ["bug", "triage"]
body:
  - type: markdown
    attributes:
      value: |
        Thank you for submitting a bug report for VeriCourse AI. Please provide as much detail as possible.
  - type: textarea
    id: description
    attributes:
      label: Bug Description
      description: A clear and concise description of what the bug is.
      placeholder: "e.g., Verification orchestrator hangs when analyzing courses with empty syllabi."
    validations:
      required: true
  - type: dropdown
    id: component
    attributes:
      label: Affected Component
      options:
        - "Backend (FastAPI / AI Agents)"
        - "Frontend (React 18 / Vite / 3D Canvas)"
        - "Database (PostgreSQL / Alembic)"
        - "DevOps / CI/CD (Docker / GitHub Actions)"
        - "Documentation / Other"
    validations:
      required: true
  - type: textarea
    id: reproduction
    attributes:
      label: Steps to Reproduce
      description: Steps to reproduce the behavior.
      placeholder: |
        1. Go to '/courses/submit'
        2. Enter course URL '...'
        3. Click 'Run Verification'
        4. See error
    validations:
      required: true
  - type: textarea
    id: expected
    attributes:
      label: Expected Behavior
      description: What you expected to happen.
    validations:
      required: true
  - type: textarea
    id: environment
    attributes:
      label: Environment Details
      description: OS, browser, Python/Node versions.
      placeholder: "macOS 14, Node 20, Python 3.10, PostgreSQL 16"
    validations:
      required: false
