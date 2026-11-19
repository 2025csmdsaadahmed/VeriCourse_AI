name: Feature Request
description: Suggest an idea or new capability for VeriCourse AI
title: "[FEATURE] "
labels: ["enhancement"]
body:
  - type: markdown
    attributes:
      value: |
        Suggest an improvement or new feature for the VeriCourse AI verification platform.
  - type: textarea
    id: problem
    attributes:
      label: Is your feature request related to a problem?
      description: A clear description of what the problem is.
      placeholder: "e.g., I'm always frustrated when..."
    validations:
      required: true
  - type: textarea
    id: solution
    attributes:
      label: Describe the Solution You'd Like
      description: A clear and concise description of what you want to happen.
    validations:
      required: true
  - type: textarea
    id: alternatives
    attributes:
      label: Describe Alternatives You've Considered
      description: Any alternative solutions or features considered.
    validations:
      required: false
  - type: dropdown
    id: subsystem
    attributes:
      label: Target Subsystem
      options:
        - "Multi-Agent Verification Pipeline"
        - "Course Discovery & Search"
        - "Student Experience Crowdsourcing"
        - "Admin Credibility Moderation"
        - "DevOps / Infrastructure"
    validations:
      required: true
