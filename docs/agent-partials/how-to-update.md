# How to Update These Instructions

**IMPORTANT:** This document is auto-generated. Do not edit it directly. Your changes will be overwritten.

To make changes, you must use the tools provided by the MCP server.

## Workflow

1.  **List Partials:** Use the `list_partials` tool to see the available content partials.
2.  **Read Partial:** Use the `read_partial` tool to read the content of the partial you want to edit.
3.  **Update Partial:** Use the `update_partial` tool to update the content of the partial.
4.  **Build Context Files:** Use the `build_context_files` tool to regenerate this file and all other agent guideline files.

## Cursor Rule Files

This project now also generates Cursor rule `.mdc` files in `.cursor/rules/` directory. These files provide AI guidance to Cursor editor:

- **coding-standards.mdc** - TypeScript/Node.js coding standards and best practices
- **best-practices.mdc** - Development best practices for testing, performance, and security
- **file-organization.mdc** - File and directory organization standards for maintainable codebases

The `.mdc` files are generated from the same partials system and follow the Cursor rule format with YAML frontmatter and markdown body content. They will be automatically rebuilt when you use the `build_context_files` tool.
