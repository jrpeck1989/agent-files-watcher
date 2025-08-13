import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";
import { runBuild } from "./builder";
import { z } from "zod";

// Simplified schema for tools - we only need the directory paths
const ToolsConfigSchema = z.object({
  partialsDir: z.string(),
  templatesDir: z.string(),
});

// Function to get config paths
function getConfigPaths(): { partialsDir: string; templatesDir: string } {
  const rootDir = process.cwd();
  const configPath = path.join(rootDir, ".agent-instructions.yaml");

  if (!fs.existsSync(configPath)) {
    // Fallback to default if config doesn't exist
    console.warn(
      "Warning: .agent-instructions.yaml not found. Using default 'docs' directory."
    );
    return {
      partialsDir: path.join(rootDir, "docs/agent-partials"),
      templatesDir: path.join(rootDir, "docs/agent-templates"),
    };
  }

  try {
    const config = yaml.load(fs.readFileSync(configPath, "utf8"));
    const validatedConfig = ToolsConfigSchema.parse(config);
    return {
      partialsDir: path.join(rootDir, validatedConfig.partialsDir),
      templatesDir: path.join(rootDir, validatedConfig.templatesDir),
    };
  } catch (error) {
    console.warn(
      `Warning: Error reading config file: ${
        error instanceof Error ? error.message : "Unknown error"
      }. Using default 'docs' directory.`
    );
    return {
      partialsDir: path.join(rootDir, "docs/agent-partials"),
      templatesDir: path.join(rootDir, "docs/agent-templates"),
    };
  }
}

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
        partial_name: {
          type: "string",
          description: "The name of the partial to read.",
        },
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
        partial_name: {
          type: "string",
          description: "The name of the partial to update.",
        },
        new_content: {
          type: "string",
          description: "The new, complete content for the partial.",
        },
      },
      required: ["partial_name", "new_content"],
    },
  },
  {
    name: "build_context_files",
    description:
      "Triggers the build process to regenerate all physical agent files from the partials.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "create_new_partial",
    description: "Creates a new partial file.",
    inputSchema: {
      type: "object",
      properties: {
        partial_name: {
          type: "string",
          description: "The name of the partial to create.",
        },
        content: {
          type: "string",
          description: "The content of the partial to create.",
        },
      },
      required: ["partial_name", "content"],
    },
  },
  {
    name: "list_templates",
    description: "Lists all available templates.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "read_template",
    description: "Reads the content of a specific template.",
    inputSchema: {
      type: "object",
      properties: {
        template_name: {
          type: "string",
          description: "The name of the template to read.",
        },
      },
      required: ["template_name"],
    },
  },
  {
    name: "update_template",
    description: "Overwrites the content of a specific template file.",
    inputSchema: {
      type: "object",
      properties: {
        template_name: {
          type: "string",
          description: "The name of the template to update.",
        },
        new_content: {
          type: "string",
          description: "The new, complete content for the template.",
        },
      },
      required: ["template_name", "new_content"],
    },
  },
];

interface ToolImplementations {
  [key: string]: (...args: any[]) => any;
}

export const toolImplementations: ToolImplementations = {
  list_partials: () => {
    const { partialsDir } = getConfigPaths();
    return fs.readdirSync(partialsDir);
  },
  read_partial: ({ partial_name }: { partial_name: string }) => {
    const { partialsDir } = getConfigPaths();
    const partialPath = path.join(partialsDir, partial_name);
    return fs.readFileSync(partialPath, "utf8");
  },
  update_partial: ({
    partial_name,
    new_content,
  }: {
    partial_name: string;
    new_content: string;
  }) => {
    const { partialsDir } = getConfigPaths();
    const partialPath = path.join(partialsDir, partial_name);
    fs.writeFileSync(partialPath, new_content);
    return { success: true };
  },
  build_context_files: async () => {
    // Run build in current working directory
    await runBuild();
    return { success: true };
  },
  create_new_partial: ({
    partial_name,
    content,
  }: {
    partial_name: string;
    content: string;
  }) => {
    const { partialsDir } = getConfigPaths();
    const partialPath = path.join(partialsDir, partial_name);
    fs.writeFileSync(partialPath, content);
    return { success: true };
  },
  list_templates: () => {
    const { templatesDir } = getConfigPaths();
    return fs.readdirSync(templatesDir);
  },
  read_template: ({ template_name }: { template_name: string }) => {
    const { templatesDir } = getConfigPaths();
    const templatePath = path.join(templatesDir, template_name);
    return fs.readFileSync(templatePath, "utf8");
  },
  update_template: ({
    template_name,
    new_content,
  }: {
    template_name: string;
    new_content: string;
  }) => {
    const { templatesDir } = getConfigPaths();
    const templatePath = path.join(templatesDir, template_name);
    fs.writeFileSync(templatePath, new_content);
    return { success: true };
  },
};
