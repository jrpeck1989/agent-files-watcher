# Project Architecture

## Directory Structure

```
agent-files-watcher/
├── docs/
│   ├── agent-partials/          # Source markdown partials
│   │   ├── overview.md
│   │   ├── project-architecture.md
│   │   └── how-to-update.md
│   └── agent-templates/         # Mustache templates for agent files
│       ├── agents.md.tmpl
│       ├── claude.md.tmpl
│       └── gemini.md.tmpl
├── src/
│   ├── commands/               # CLI command implementations
│   │   ├── build.ts
│   │   ├── init.ts
│   │   ├── serve.ts
│   │   ├── validate.ts
│   │   └── watch.ts
│   ├── core/                  # Core functionality
│   │   ├── builder.ts         # Build system logic
│   │   └── tools.ts           # MCP tool definitions and implementations
│   ├── index.ts              # CLI entry point
│   └── server.ts             # MCP server implementation
├── .agent-instructions.yaml   # Configuration file
├── package.json
└── README.md
```

## Core Components

### 1. CLI Interface (`src/index.ts`)
The main entry point provides five commands:
- `init`: Scaffolds new project structure
- `build`: Generates agent files from partials and templates
- `watch`: Monitors changes and auto-rebuilds
- `serve`: Starts MCP server (HTTP or stdio mode)
- `validate`: Checks if generated files are in sync

### 2. Build System (`src/core/builder.ts`)
- Reads configuration from `.agent-instructions.yaml`
- Loads all partials from `docs/agent-partials/`
- Renders Mustache templates with partials as context
- Outputs agent-specific files (e.g., `GEMINI.md`, `CLAUDE.md`)

### 3. MCP Server (`src/server.ts`)
Dual-mode server supporting:
- **HTTP Mode**: JSON-RPC over HTTP for testing (default port 3000)
- **Stdio Mode**: Standard MCP protocol for direct integration with agents

### 4. MCP Tools (`src/core/tools.ts`)
Four tools exposed to agents:
- `list_partials`: Lists available content partials
- `read_partial`: Reads content of a specific partial
- `update_partial`: Overwrites a partial file
- `build_context_files`: Triggers rebuild of all agent files

## Configuration Schema

The `.agent-instructions.yaml` file defines:
```yaml
schema: 1
partialsDir: docs/agent-partials
templatesDir: docs/agent-templates
output:
  - agent: gemini
    template: gemini.md.tmpl
    outFile: GEMINI.md
  # ... more agent configurations
```

## Data Flow

1. **Development**: Content creators write/edit partials in `docs/agent-partials/`
2. **Build**: Templates combine partials into agent-specific files
3. **Serve**: MCP server exposes tools for programmatic updates
4. **Update**: Agents use MCP tools to update partials and rebuild files
5. **Sync**: All agent files stay synchronized from single source of truth