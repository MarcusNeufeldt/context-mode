import { strict as assert } from "node:assert";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..", "..");
const storageRoot = mkdtempSync(join(tmpdir(), "context-mode-fork-smoke-"));
const marker = `fork-smoke-${Date.now()}`;
const inheritedEnv = Object.fromEntries(
  Object.entries(process.env).filter((entry) => typeof entry[1] === "string"),
);

const transport = new StdioClientTransport({
  command: process.execPath,
  args: [join(repoRoot, "server.bundle.mjs")],
  cwd: repoRoot,
  env: {
    ...inheritedEnv,
    CONTEXT_MODE_DIR: storageRoot,
    CONTEXT_MODE_PLATFORM: "codex",
    CONTEXT_MODE_DISABLE_VERSION_CHECK: "1",
  },
  stderr: "pipe",
  maxBufferSize: 2 * 1024 * 1024,
});
const stderr = [];
transport.stderr?.on("data", (chunk) => stderr.push(String(chunk)));

const client = new Client(
  { name: "codex-cli", version: "fork-smoke" },
  { capabilities: {} },
);

try {
  await client.connect(transport);

  const listed = await client.listTools();
  const toolNames = listed.tools.map((tool) => tool.name);
  for (const required of [
    "ctx_batch_execute",
    "ctx_execute",
    "ctx_forget",
    "ctx_search",
    "ctx_stats",
  ]) {
    assert(toolNames.includes(required), `missing MCP tool: ${required}`);
  }

  const batch = await client.callTool({
    name: "ctx_batch_execute",
    arguments: {
      commands: [{
        label: "oversized-runtime-smoke",
        command:
          `node -e "process.stdout.write('${marker}\\n' + 'x'.repeat(${9 * 1024 * 1024}))"`,
      }],
      queries: [marker],
      concurrency: 1,
      timeout: 30_000,
    },
  });
  const batchText = (batch.content ?? [])
    .filter((item) => item.type === "text")
    .map((item) => item.text ?? "")
    .join("\n");
  const indexing = batch.structuredContent?.indexing;

  assert.equal(batch.isError, undefined, batchText);
  assert.equal(indexing?.status, "partial");
  assert.equal(indexing?.indexed_bytes, 8 * 1024 * 1024);
  assert(indexing?.dropped_bytes > 0);
  assert(Buffer.byteLength(batchText, "utf8") < 64 * 1024);
  assert(batchText.includes(marker));

  const search = await client.callTool({
    name: "ctx_search",
    arguments: { queries: [marker], limit: 3 },
  });
  const searchText = (search.content ?? [])
    .filter((item) => item.type === "text")
    .map((item) => item.text ?? "")
    .join("\n");
  assert.equal(search.isError, undefined, searchText);
  assert(searchText.includes(marker));

  const stats = await client.callTool({ name: "ctx_stats", arguments: {} });
  assert.notEqual(stats.isError, true);

  process.stdout.write(`${JSON.stringify({
    status: "passed",
    server: "server.bundle.mjs",
    platform: "codex",
    toolCount: toolNames.length,
    indexedBytes: indexing.indexed_bytes,
    droppedBytes: indexing.dropped_bytes,
    batchResponseBytes: Buffer.byteLength(batchText, "utf8"),
    searchRetrievedMarker: true,
  })}\n`);
} catch (error) {
  const serverStderr = stderr.join("").trim();
  if (serverStderr) process.stderr.write(`server stderr:\n${serverStderr}\n`);
  throw error;
} finally {
  await client.close().catch(() => {});
  rmSync(storageRoot, { recursive: true, force: true });
}
