import * as fs from 'fs';
import * as path from 'path';
import { runBuild } from './builder';

// Get the project root directory (assuming the compiled JS is in dist/)
const projectRoot = path.join(__dirname, '../..');
const partialsDir = path.join(projectRoot, 'docs/agent-partials');

export const toolSchemas = [
  {
    name: "list_partials",
    description: "Lists all available content partials.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "read_partial",
    description: "Reads the content of a specific partial.",
    inputSchema: {
      type: "object",
      properties: {
        partial_name: { type: "string", description: "The name of the partial to read." },
      },
      required: ["partial_name"],
    },
  },
  {
    name: "update_partial",
    description: "Overwrites the content of a specific partial file.",
    inputSchema: {
      type: "object",
      properties: {
        partial_name: { type: "string", description: "The name of the partial to update." },
        new_content: { type: "string", description: "The new, complete content for the partial." },
      },
      required: ["partial_name", "new_content"],
    },
  },
  {
    name: "build_context_files",
    description: "Triggers the build process to regenerate all physical agent files from the partials.",
    inputSchema: { type: "object", properties: {} },
  },
];

interface ToolImplementations {
  [key: string]: (...args: any[]) => any;
}

export const toolImplementations: ToolImplementations = {
  list_partials: () => {
    return fs.readdirSync(partialsDir);
  },
  read_partial: ({ partial_name }: { partial_name: string }) => {
    const partialPath = path.join(partialsDir, partial_name);
    return fs.readFileSync(partialPath, 'utf8');
  },
  update_partial: ({ partial_name, new_content }: { partial_name: string; new_content: string }) => {
    const partialPath = path.join(partialsDir, partial_name);
    fs.writeFileSync(partialPath, new_content);
    return { success: true };
  },
  build_context_files: async () => {
    // Change to project root before running build
    const originalCwd = process.cwd();
    try {
      process.chdir(projectRoot);
      await runBuild();
      return { success: true };
    } finally {
      process.chdir(originalCwd);
    }
  },
};
