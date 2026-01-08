import express from 'express';
import { JSONRPCServer } from 'json-rpc-2.0';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { toolSchemas, toolImplementations } from './core/tools';

// --- HTTP Server Implementation ---
function startHttpServer() {
  const app = express();
  app.use(express.json());
  const PORT = process.env.PORT || 3000;
  
  const rpcServer = new JSONRPCServer();
  for (const schema of toolSchemas) {
    const toolName = schema.name;
    if (toolImplementations[toolName]) {
      rpcServer.addMethod(toolName, toolImplementations[toolName]);
    }
  }
  rpcServer.addMethod('mcp.discover', () => toolSchemas);

  app.post('/mcp', (req, res) => {
    const jsonRPCRequest = req.body;
    rpcServer.receive(jsonRPCRequest).then((jsonRPCResponse) => {
      if (jsonRPCResponse) {
        res.json(jsonRPCResponse);
      } else {
        res.sendStatus(204);
      }
    });
  });

  app.listen(PORT, () => {
    console.error(`MCP HTTP Server listening on port ${PORT}`);
  });
}

// --- Stdio Server Implementation ---
async function startStdioServer() {
  console.error('Starting MCP server in stdio mode...');
  
  // Create MCP server using official SDK
  const server = new Server(
    {
      name: 'agent-context-sync',
      version: '1.1.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );
  
  // Register tools/call handler (single handler for all tools)
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const toolName = request.params.name;
    const args = request.params.arguments || {};
    
    console.error(`Executing tool: ${toolName}`, request.params);
    
    if (!toolName || !toolImplementations[toolName]) {
      throw new Error(`Tool '${toolName}' not found`);
    }
    
    try {
      const result = await toolImplementations[toolName](args);
      
      return {
        content: [
          {
            type: 'text',
            text: typeof result === 'string' ? result : JSON.stringify(result, null, 2),
          },
        ],
        isError: false,
      };
    } catch (error) {
      console.error(`Error executing tool '${toolName}':`, error);
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  });
  
  // Register tools/list handler
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    console.error('Handling tools/list request');
    return {
      tools: toolSchemas.map(schema => ({
        name: schema.name,
        description: schema.description,
        inputSchema: schema.inputSchema,
      })),
    };
  });
  
  // Connect to stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error('MCP server connected and listening for requests...');
}

// --- Main Export ---
export async function startServer(options: { stdio?: boolean }) {
  if (options.stdio) {
    await startStdioServer();
  } else {
    startHttpServer();
  }
}