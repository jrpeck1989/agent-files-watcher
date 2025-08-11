# Agent Context Sync & Serve Tool

This project provides a CLI tool and server to manage and serve context for AI agents in a consistent and automated way.

## The Problem

Different AI agents often look for different context files in a project root (e.g., `GEMINI.md`, `CLAUDE.md`). Keeping these files in sync manually is error-prone and tedious. Furthermore, as agents modify a codebase, this context quickly becomes stale.

## The Solution

This tool provides a robust, hybrid solution:

1.  **Single Source of Truth:** All context is defined in small, manageable "partial" markdown files in the `docs/agent-partials` directory.
2.  **File Generation:** A `build` command uses templates to assemble these partials into the final agent-specific files (e.g., `GEMINI.md`). This ensures consistency and provides a reliable fallback for any agent.
3.  **Interactive MCP Server:** An optional `serve` command starts a Model Context Protocol (MCP) compliant server. This server not only provides the context to agents over an API but also exposes a set of tools for agents to programmatically update the context after they perform work.

This creates a closed-loop system where agents can keep their own instructions up-to-date.

## Getting Started

1.  **Installation:**
    ```bash
    pnpm install
    ```

2.  **Initialization:**
    ```bash
    pnpm dev init
    ```
    This will create the necessary directories (`docs/agent-partials`, `docs/agent-templates`) and a default `.agent-instructions.yaml` configuration file.

## CLI Commands

*   `pnpm dev init`: Scaffolds a new project.
*   `pnpm dev build`: Generates the physical agent files from partials.
*   `pnpm dev watch`: Watches for changes in partials and templates and automatically rebuilds the agent files.
*   `pnpm dev serve`: Starts the interactive MCP server (defaults to port 3000).
*   `pnpm dev validate`: Checks if the generated files are in sync with the source partials. Designed for use in CI pipelines.

---

## Testing the MCP Server

To test the server and its tools, first start the server:

```bash
pnpm dev serve
```

The server will be available at `http://localhost:3000` with a single `/mcp` endpoint for all JSON-RPC requests.

### 1. Testing Tool Discovery

To see the tools the server offers, call the `mcp.discover` method.

**Command:**
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"mcp.discover","id":1}' \
  http://localhost:3000/mcp
```

**Expected Output:**
A JSON object containing the schemas for all available tools.

### 2. Testing Tool Execution

To execute a tool, call it by its name. For example, to test the `list_partials` tool:

**Command:**
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"list_partials","id":2}' \
  http://localhost:3000/mcp
```

**Expected Output:**
A JSON array containing the names of the files in your `docs/agent-partials` directory.