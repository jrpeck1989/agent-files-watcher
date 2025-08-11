# Project Overview: Agent Context Sync & Serve Tool

This project, named `agent-context`, is a command-line tool and server designed to solve two primary problems related to managing context for AI agents:

1.  **Consistency:** It ensures that multiple agent instruction files (e.g., `GEMINI.md`, `CLAUDE.md`) are kept in sync by generating them from a single source of truth.
2.  **Dynamic Updates:** It allows AI agents to programmatically update the project's context after they perform work, ensuring the documentation is always a living, up-to-date reflection of the codebase.

## Core Features

-   **Partials System:** All documentation is written in small, manageable Markdown files called "partials" located in the `docs/agent-partials/` directory.

-   **File Generation:** The `build` command assembles these partials using templates to generate the final, agent-specific files (e.g., `GEMINI.md`).

-   **Interactive MCP Server:** The `serve` command launches a Model Context Protocol (MCP) compliant server. This server has two functions:
    1.  **Tool Discovery:** It advertises a set of tools to MCP clients (like Cursor), allowing them to discover what actions they can perform.
    2.  **Tool Execution:** It provides tools for agents to read, list, and update the partial files, and to trigger the build process, all programmatically.

-   **Dual-Mode Transport:** The server can communicate over standard HTTP (for testing) or `stdio` (for compliant clients like Cursor).