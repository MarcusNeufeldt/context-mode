import { strict as assert } from "node:assert";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..", "..");
const storageRoot = mkdtempSync(join(tmpdir(), "context-mode-request-log-smoke-"));
const secret = `SECRET_REQUEST_PAYLOAD_${Date.now()}`;
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
    CONTEXT_MODE_PLATFORM: "pi",
    CONTEXT_MODE_DISABLE_VERSION_CHECK: "1",
    CONTEXT_MODE_REQUEST_LOG: "1",
  },
  stderr: "pipe",
});
const stderr = [];
transport.stderr?.on("data", (chunk) => stderr.push(String(chunk)));
const client = new Client({ name: "pi-request-log-smoke", version: "1" }, { capabilities: {} });

try {
  await client.connect(transport);
  const result = await client.callTool({
    name: "ctx_execute",
    arguments: { language: "javascript", code: `console.log(${JSON.stringify(secret)})` },
  });
  assert.notEqual(result.isError, true);
  await new Promise((resolveDelay) => setTimeout(resolveDelay, 25));
  const log = stderr.join("");
  assert.match(log, /"phase":"received"/);
  assert.match(log, /"phase":"handler_start"/);
  assert.match(log, /"phase":"handler_end"/);
  assert.match(log, /"tool":"ctx_execute"/);
  assert.doesNotMatch(log, new RegExp(secret));
  assert.doesNotMatch(log, /"code"|console\.log/);
  process.stdout.write(`${JSON.stringify({ status: "passed", phases: 3, payloadRedacted: true })}\n`);
} finally {
  await client.close().catch(() => {});
  rmSync(storageRoot, { recursive: true, force: true });
}
