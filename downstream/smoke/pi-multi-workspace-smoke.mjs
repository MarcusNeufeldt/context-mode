// Run `pnpm run build` first; this smoke intentionally exercises build/ output.
import { strict as assert } from "node:assert";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..", "..");
const root = mkdtempSync(join(tmpdir(), "context-mode-pi-workspaces-"));
const storageRoot = join(root, "storage");
const workspaceA = join(root, "workspace-a");
const workspaceB = join(root, "workspace-b");
process.env.CONTEXT_MODE_DATA_DIR = storageRoot;
process.env.CONTEXT_MODE_DISABLE_VERSION_CHECK = "1";
delete process.env.PI_SUBAGENT_CHILD;

const { default: registerExtension } = await import(
  new URL(`../../build/adapters/pi/extension.js?smoke=${Date.now()}`, import.meta.url)
);
const { hashProjectDirCanonical } = await import("../../build/session/db.js");

function createPi() {
  const handlers = new Map();
  const tools = new Map();
  return {
    on(event, handler) {
      const list = handlers.get(event) ?? [];
      list.push(handler);
      handlers.set(event, list);
    },
    registerCommand() {},
    registerTool(tool) { tools.set(tool.name, tool); },
    sendMessage() {},
    logger: { debug() {}, warn() {}, error() {} },
    async trigger(event, ...args) {
      for (const handler of handlers.get(event) ?? []) await handler(...args);
    },
    tools,
  };
}

async function start(workspace, name) {
  const pi = createPi();
  const sessionFile = join(workspace, `${name}.jsonl`);
  const ctx = {
    cwd: workspace,
    hasUI: false,
    sessionManager: { getSessionFile: () => sessionFile },
  };
  registerExtension(pi);
  await pi.trigger("session_start", { reason: "startup" }, ctx);
  await pi.trigger(
    "before_agent_start",
    { prompt: "smoke", systemPrompt: "", systemPromptOptions: { cwd: workspace } },
    ctx,
  );
  assert(pi.tools.has("ctx_execute"), `${name}: ctx_execute not registered`);
  return { pi, ctx };
}

async function call(instance, name, args) {
  const tool = instance.pi.tools.get(name);
  assert(tool, `missing tool ${name}`);
  return tool.execute(`${name}-${Date.now()}`, args, undefined, undefined, instance.ctx);
}

function text(result) {
  return (result.content ?? [])
    .filter((item) => item.type === "text")
    .map((item) => item.text ?? "")
    .join("\n");
}

const instances = [];
try {
  mkdirSync(workspaceA, { recursive: true });
  mkdirSync(workspaceB, { recursive: true });
  writeFileSync(join(workspaceA, "probe.txt"), "workspace-a", { flag: "wx" });
  writeFileSync(join(workspaceB, "probe.txt"), "workspace-b", { flag: "wx" });

  const a = await start(workspaceA, "a-primary");
  const b = await start(workspaceB, "b-primary");
  instances.push(a, b);

  const cwdA = text(await call(a, "ctx_execute", {
    language: "javascript",
    code: "console.log(process.cwd())",
    timeout: 10_000,
  }));
  const cwdB = text(await call(b, "ctx_execute", {
    language: "javascript",
    code: "console.log(process.cwd())",
    timeout: 10_000,
  }));
  assert(cwdA.toLowerCase().includes(workspaceA.toLowerCase()), cwdA);
  assert(cwdB.toLowerCase().includes(workspaceB.toLowerCase()), cwdB);

  const marker = `pi-shared-db-${Date.now()}`;
  await call(a, "ctx_index", { content: marker, source: "pi-workspace-smoke-a" });
  await call(b, "ctx_index", { content: `workspace-b-${marker}`, source: "pi-workspace-smoke-b" });

  for (let cycle = 0; cycle < 5; cycle++) {
    const sibling = await start(workspaceA, `a-sibling-${cycle}`);
    instances.push(sibling);
    await call(sibling, "ctx_search", { queries: [marker], limit: 3 });
    await sibling.pi.trigger("session_shutdown", { reason: "quit" }, sibling.ctx);

    const search = text(await call(a, "ctx_search", { queries: [marker], limit: 3 }));
    assert(search.includes(marker), `marker lost after sibling close cycle ${cycle}`);
  }

  let escaped = false;
  try {
    await call(a, "ctx_execute_file", {
      path: join(workspaceB, "probe.txt"),
      language: "javascript",
      code: "console.log(FILE_CONTENT)",
    });
  } catch {
    escaped = true;
  }
  assert(escaped, "workspace A was allowed to read workspace B through ctx_execute_file");

  const contentDir = join(storageRoot, "context-mode", "content");
  const dbA = join(contentDir, `${hashProjectDirCanonical(workspaceA)}.db`);
  const dbB = join(contentDir, `${hashProjectDirCanonical(workspaceB)}.db`);
  assert.notEqual(dbA, dbB);
  assert(existsSync(dbA), `missing workspace A content DB: ${dbA}`);
  assert(existsSync(dbB), `missing workspace B content DB: ${dbB}`);

  process.stdout.write(`${JSON.stringify({
    status: "passed",
    workspaces: 2,
    siblingCloseCycles: 5,
    distinctContentDatabases: true,
    cwdIsolation: true,
    fileBoundaryIsolation: true,
  })}\n`);
} finally {
  for (const instance of instances.reverse()) {
    await instance.pi.trigger("session_shutdown", { reason: "quit" }, instance.ctx).catch(() => {});
  }
  await new Promise((resolve) => setTimeout(resolve, 1000));
  rmSync(root, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });
}
