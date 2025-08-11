# Project Overview: Agent Context Sync & Serve Tool

The **agent-files-watcher** project is a comprehensive CLI tool and MCP (Model Context Protocol) server designed to solve critical problems in AI agent documentation management. The tool creates a unified, automated system for keeping agent context files synchronized and up-to-date.

## The Problems It Solves

### 1. **Multi-Agent File Synchronization**
Different AI agents often require their own instruction files (e.g., `CLAUDE.md`, `GEMINI.md`). Maintaining these files manually leads to:
- Content drift between agent files
- Inconsistent information across agents
- Time-consuming manual updates
- Documentation falling out of sync with codebase changes

### 2. **Static Documentation Challenge**
Traditional documentation becomes stale as codebases evolve. This tool enables **living documentation** where AI agents can programmatically update their own context after performing work.

## Core Solution

The tool implements a **partials-to-templates** architecture with MCP integration:

### **Single Source of Truth**
All content lives in small, manageable markdown partials in `docs/agent-partials/`. This ensures consistency and makes updates atomic.

### **Template-Based Generation**
Mustache templates in `docs/agent-templates/` define how partials are assembled into agent-specific files. This allows for:
- Agent-specific formatting and structure
- Selective inclusion of content per agent
- Consistent branding and tone

### **Interactive MCP Server**
The server provides a programmatic interface for agents to:
- Discover available tools (`list_partials`)
- Read current content (`read_partial`)
- Update documentation (`update_partial`) 
- Trigger regeneration (`build_context_files`)

### **Dual Transport Support**
- **HTTP Mode**: JSON-RPC server for testing and HTTP-based integrations
- **Stdio Mode**: Native MCP protocol for direct agent integration (e.g., Cursor, Claude Desktop)

## Key Features

- **🔄 Auto-Sync**: Watch mode automatically rebuilds when partials change
- **🛠️ MCP Tools**: Four core tools for programmatic content management
- **📋 Template System**: Flexible Mustache templates for agent-specific output
- **✅ Validation**: Built-in validation to ensure generated files stay in sync
- **🚀 Zero Setup**: Simple `init` command scaffolds complete project structure
- **🔌 Integration Ready**: Works with any MCP-compatible agent or tool

## Workflow

1. **Initialize**: `pnpm dev init` creates project structure
2. **Develop**: Write/edit content in `docs/agent-partials/`
3. **Build**: `pnpm dev build` generates agent files from partials + templates
4. **Serve**: `pnpm dev serve` starts MCP server for agent interactions
5. **Update**: Agents use MCP tools to update partials programmatically
6. **Validate**: `pnpm dev validate` ensures everything stays in sync

This creates a **closed-loop system** where both humans and AI agents can contribute to keeping documentation accurate and current.