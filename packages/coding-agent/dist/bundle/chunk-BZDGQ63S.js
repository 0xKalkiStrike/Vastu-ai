import { createRequire as __piBundleCreateRequire } from 'node:module'; const require = __piBundleCreateRequire(import.meta.url);
import {
  APP_NAME,
  DAEMON_PROTOCOL_VERSION,
  DAEMON_SCHEMA_ID,
  DAEMON_WORKER_ACTIVE_SESSION_ID_ENV,
  DAEMON_WORKER_RECOVERY_JOURNAL_ENV,
  DAEMON_WORKER_ROLE_ENV,
  DAEMON_WORKER_SUPERVISOR_SOCKET_ENV,
  DAEMON_WORKER_TOKEN_ENV,
  DaemonClient,
  ORPHAN_PROCESS_JOURNAL_ENV,
  SESSION_LEASES_ENABLED_ENV,
  SESSION_LEASE_OWNER_ID_ENV,
  VERSION,
  appendRotatingLog,
  attachJsonlLineReader,
  clearOrphanProcessJournal,
  createCliSubprocessEnv,
  createCliSubprocessLaunchSpec,
  defaultDaemonSocketPath,
  expandTildePath,
  formatCurrentCliCommand,
  getClientErrorLogPath,
  getDaemonLogPath,
  getDaemonRuntimeIdentity,
  getProcessStartId,
  isOrphanProcessIdentityCurrent,
  isSessionSummaryBusy,
  readActiveOrphanProcesses,
  serializeJsonLine
} from "./chunk-AN7FDQCZ.js";

// dist/cli/command-registry.js
var COMMAND_SPECS = [
  {
    path: ["help"],
    usage: "help [command]",
    summary: "Show command help"
  },
  {
    path: ["agents"],
    usage: "agents",
    summary: "Search and open sessions"
  },
  {
    path: ["list"],
    usage: "list [--all] [--json]",
    summary: "List agents",
    options: ["-a, --all  Include saved agents", "--json      Print JSON"]
  },
  {
    path: ["attach"],
    usage: "attach <agent>",
    summary: "Attach the interactive UI to an agent"
  },
  {
    path: ["stop"],
    usage: "stop <agent> [--json]",
    summary: "Stop an agent"
  },
  {
    path: ["rename"],
    usage: "rename <agent> <name> [--json]",
    summary: "Rename an agent"
  },
  {
    path: ["send"],
    usage: "send [--from <agent>] <agent> <message>",
    summary: "Send a message to an agent",
    options: [
      "--from <agent>  Identify the sending agent",
      "--steer         Deliver as steering when the agent is busy",
      "--follow-up     Queue the message after the current turn",
      "--json          Print JSON"
    ]
  },
  {
    path: ["schedule"],
    usage: "schedule <list|add|cancel>",
    summary: "Manage prompts that run later or on a recurring schedule"
  },
  {
    path: ["schedule", "list"],
    usage: "schedule list [--all] [agent] [--json]",
    summary: "List scheduled prompts"
  },
  {
    path: ["schedule", "add"],
    usage: "schedule add <agent> <schedule> -- <message>",
    summary: "Schedule a prompt",
    description: "The schedule may be a cron expression or a supported one-time schedule.",
    examples: [`schedule add worker "0 9 * * 1-5" -- "Check open work"`]
  },
  {
    path: ["schedule", "cancel"],
    usage: "schedule cancel <job-id>",
    summary: "Cancel a scheduled prompt"
  },
  {
    path: ["status"],
    usage: "status [--json]",
    summary: "Show background service status"
  },
  {
    path: ["doctor"],
    usage: "doctor [--fix] [--json]",
    summary: "Inspect and safely clean up background services",
    options: ["--fix   Remove stale sockets and stop idle orphaned services", "--json  Print JSON"]
  },
  {
    path: ["shutdown"],
    usage: "shutdown [--force] [--json]",
    summary: "Stop every agent and background service",
    description: "Without --force, an interactive confirmation is required. --force also kills unresponsive workers.",
    options: ["--force  Skip confirmation and kill unresponsive processes", "--json   Print JSON"]
  },
  {
    path: ["package"],
    usage: "package <install|remove|list|update>",
    summary: "Manage capability packages",
    description: "Packages can provide extensions, skills, prompts, and themes."
  },
  {
    path: ["package", "install"],
    usage: "package install <source> [--local]",
    summary: "Install a capability package",
    options: ["--local  Install into the current project instead of the user configuration"]
  },
  {
    path: ["package", "remove"],
    usage: "package remove <source> [--local]",
    summary: "Remove a capability package",
    options: ["--local  Remove from the current project configuration"]
  },
  {
    path: ["package", "list"],
    usage: "package list",
    summary: "List installed capability packages"
  },
  {
    path: ["package", "update"],
    usage: "package update [source]",
    summary: "Update capability packages"
  },
  {
    path: ["update"],
    usage: "update [--force]",
    summary: "Update Prime Agent"
  },
  {
    path: ["model"],
    usage: "model list [search]",
    summary: "Inspect available models"
  },
  {
    path: ["model", "list"],
    usage: "model list [search]",
    summary: "List available models"
  },
  {
    path: ["session"],
    usage: "session export <file> [output]",
    summary: "Manage saved sessions"
  },
  {
    path: ["session", "export"],
    usage: "session export <file> [output]",
    summary: "Export a saved session to HTML"
  },
  {
    path: ["config"],
    usage: "config",
    summary: "Configure package resources"
  }
];
var PUBLIC_COMMAND_NAMES = new Set(COMMAND_SPECS.filter((spec) => spec.path.length === 1).map((spec) => spec.path[0]));
var REMOVED_COMMAND_NAMES = /* @__PURE__ */ new Set(["app", "daemon", "install", "manage", "remove", "uninstall"]);
var TOP_LEVEL_OPTION_GROUPS = [
  {
    heading: "Run options",
    options: [
      ["-p, --print", "Print a response and exit"],
      ["--mode <text|json|rpc|acp|daemon>", "Select the output mode (default: text)"],
      ["--cwd <dir>", "Use a specific working directory"],
      ["--offline", "Disable startup network operations"],
      ["--verbose", "Force verbose startup"],
      ["--daemon-socket <path>", "Use a specific daemon socket"]
    ]
  },
  {
    heading: "Model options",
    options: [
      ["--provider <name>", "Select a model provider"],
      ["--model <id>", "Select a model"],
      ["--api-key <key>", "Use an API key for this run"],
      ["--models <patterns>", "Set comma-separated models for cycling"],
      ["--thinking <level>", "Set reasoning: off, minimal, low, medium, high, xhigh, max"]
    ]
  },
  {
    heading: "Session options",
    options: [
      ["-c, --continue", "Continue the previous session"],
      ["-r, --resume <path|id>", "Resume a saved session"],
      ["--fork <path|id>", "Fork a saved session into a new session"],
      ["--session-dir <dir>", "Use a custom session directory"],
      ["--no-session", "Do not save the session"],
      ["--goal <objective>", "Seed a persistent goal for a new root session"],
      ["--goal-token-budget <n>", "Set a positive token budget for --goal"]
    ]
  },
  {
    heading: "Tool and resource options",
    options: [
      ["-t, --tools <list>", "Allowlist comma-separated tool names"],
      ["-nt, --no-tools", "Disable all tools by default"],
      ["-nbt, --no-builtin-tools", "Disable built-in tools by default"],
      ["-e, --extension <source>", "Load an extension (repeatable)"],
      ["-ne, --no-extensions", "Disable extension discovery"],
      ["--skill <path>", "Load a skill (repeatable)"],
      ["-ns, --no-skills", "Disable skill discovery"],
      ["--prompt-template <path>", "Load a prompt template (repeatable)"],
      ["-np, --no-prompt-templates", "Disable prompt template discovery"],
      ["--theme <path>", "Load a theme (repeatable)"],
      ["--no-themes", "Disable theme discovery"],
      ["-nc, --no-context-files", "Disable AGENTS.md and CLAUDE.md discovery"]
    ]
  },
  {
    heading: "Prompt options",
    options: [
      ["--system-prompt <text>", "Replace the default system prompt"],
      ["--append-system-prompt <text>", "Append to the system prompt (repeatable)"],
      ["--", "Treat all following arguments as messages"]
    ]
  },
  {
    heading: "Autonomous options",
    options: [
      ["--autonomous", "Continue until gates pass or a limit is reached"],
      ["--autonomous-gate <command>", "Run a completion gate (repeatable)"],
      ["--autonomous-gate-retries <n>", "Set positive retries per failed gate (default: 3)"],
      ["--autonomous-gate-timeout-ms <n>", "Set positive per-gate timeout in ms (default: 300000)"],
      ["--autonomous-max-continuations <n>", "Set positive follow-up limit (default: 3)"],
      ["--autonomous-max-turns <n>", "Set positive assistant-turn limit (default: 12)"],
      ["--autonomous-max-tokens <n>", "Set positive token limit (default: 80000)"],
      ["--autonomous-timeout-ms <n>", "Set positive wall-clock limit in ms (default: 1800000)"]
    ]
  },
  {
    heading: "Help",
    options: [
      ["-v, --version", "Show version and exit"],
      ["-h, --help", "Show this help"]
    ]
  }
];
function getCommandSpec(path) {
  return COMMAND_SPECS.find((spec) => spec.path.length === path.length && spec.path.every((segment, index) => segment === path[index]));
}
function getChildCommandSpecs(path) {
  return COMMAND_SPECS.filter((spec) => spec.path.length === path.length + 1 && path.every((segment, index) => segment === spec.path[index]));
}
function isHelpCommandRequest(path) {
  if (path.length === 0 || getCommandSpec(path)) {
    return true;
  }
  if (REMOVED_COMMAND_NAMES.has(path[0])) {
    return true;
  }
  if (getCommandSpec(path.slice(0, 1))) {
    return true;
  }
  const parent = path.slice(0, -1);
  const candidates = getChildCommandSpecs(parent).map((spec) => spec.path.at(-1));
  return findCommandSuggestion(path.at(-1), candidates) !== void 0;
}
function findCommandSuggestion(input, candidates) {
  let closest;
  for (const candidate of candidates) {
    const distance = editDistance(input, candidate);
    if (!closest || distance < closest.distance) {
      closest = { candidate, distance };
    }
  }
  if (!closest || closest.distance > Math.max(2, Math.floor(input.length / 3))) {
    return void 0;
  }
  return closest.candidate;
}
function formatTopLevelHelp() {
  const commands = COMMAND_SPECS.filter((spec) => spec.path.length === 1);
  const commandWidth = Math.max(...commands.map((spec) => spec.path[0].length));
  const options = TOP_LEVEL_OPTION_GROUPS.map((group) => formatOptionGroup(group.heading, group.options)).join("\n\n");
  return `${APP_NAME} - AI coding assistant with an IPython tool

Usage:
  ${APP_NAME} [options] [@files...] [message...]
  ${APP_NAME} <command> [args...]

Options:
${options}

Commands:
${commands.map((spec) => `  ${spec.path[0].padEnd(commandWidth)}  ${spec.summary}`).join("\n")}

Run "${APP_NAME} help <command>" for command details.`;
}
function formatOptionGroup(heading, options) {
  const width = Math.max(...options.map(([option]) => option.length));
  return `${heading}:
${options.map(([option, summary]) => `  ${option.padEnd(width)}  ${summary}`).join("\n")}`;
}
function formatCommandHelp(path) {
  const spec = getCommandSpec(path);
  if (!spec) {
    return void 0;
  }
  const children = getChildCommandSpecs(path);
  const sections = [`Usage:
  ${APP_NAME} ${spec.usage}`, "", `${spec.summary}.`];
  if (spec.description) {
    sections.push("", spec.description);
  }
  if (children.length > 0) {
    const width = Math.max(...children.map((child) => child.path.at(-1).length));
    sections.push("", "Commands:", ...children.map((child) => `  ${child.path.at(-1).padEnd(width)}  ${child.summary}`));
  }
  if (spec.options && spec.options.length > 0) {
    sections.push("", "Options:", ...spec.options.map((option) => `  ${option}`));
  }
  if (spec.examples && spec.examples.length > 0) {
    sections.push("", "Examples:", ...spec.examples.map((example) => `  ${APP_NAME} ${example}`));
  }
  return sections.join("\n");
}
function editDistance(left, right) {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let leftIndex = 1; leftIndex <= left.length; leftIndex++) {
    let diagonal = previous[0];
    previous[0] = leftIndex;
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex++) {
      const above = previous[rightIndex];
      previous[rightIndex] = Math.min(previous[rightIndex] + 1, previous[rightIndex - 1] + 1, diagonal + (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1));
      diagonal = above;
    }
  }
  return previous[right.length];
}

// dist/cli/daemon-launch.js
import { spawn } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
var DAEMON_STARTUP_TIMEOUT_MS = 3e4;
var DAEMON_STARTUP_LOG_TAIL_BYTES = 4 * 1024;
var DAEMON_STARTUP_EXIT_GRACE_MS = 2e3;
function isDaemonSessionSummary(value) {
  if (!value || typeof value !== "object") {
    return false;
  }
  const summary = value;
  return typeof summary.activeSessionId === "string" || typeof summary.id === "string";
}
function delay(ms) {
  return new Promise((resolve2) => setTimeout(resolve2, ms));
}
function logDaemonLaunch(message) {
  appendRotatingLog(getClientErrorLogPath(), `[${(/* @__PURE__ */ new Date()).toISOString()}] daemon-launch: ${message}`);
}
async function canConnectToDaemon(socketPath, timeoutMs) {
  const client = new DaemonClient(socketPath);
  try {
    await client.connect(timeoutMs);
    return true;
  } catch {
    return false;
  } finally {
    client.close();
  }
}
async function probeDaemonVersion(socketPath) {
  let client;
  for (const timeoutMs of [250, 2e3]) {
    const candidate = new DaemonClient(socketPath);
    try {
      await candidate.connect(timeoutMs);
      client = candidate;
      break;
    } catch {
      candidate.close();
    }
  }
  if (!client) {
    return { status: "absent" };
  }
  try {
    const hello = await client.waitForHello(2e3);
    const current = hello.protocol.version === DAEMON_PROTOCOL_VERSION && hello.schemaId === DAEMON_SCHEMA_ID && hello.appVersion === VERSION;
    if (!current) {
      logDaemonLaunch(`running daemon on ${socketPath} is stale: daemon v${hello.appVersion}/proto${hello.protocol.version}/schema ${hello.schemaId ?? "legacy"}/build ${hello.runtime?.buildId ?? "unknown"} vs client v${VERSION}/proto${DAEMON_PROTOCOL_VERSION}/schema ${DAEMON_SCHEMA_ID}/build ${getDaemonRuntimeIdentity().buildId}`);
    }
    if (current) {
      return { status: "current", hello };
    }
    return { status: "stale", hello };
  } catch {
    logDaemonLaunch(`running daemon on ${socketPath} sent no recognizable hello; treating as stale`);
    return { status: "stale" };
  } finally {
    client.close();
  }
}
async function listActiveDaemonSessionSummaries(client, options = {}) {
  return (await queryActiveDaemonSessions(client, options)).sessions;
}
async function queryActiveDaemonSessions(client, options = {}) {
  const response = await client.request({ type: "list", includeClientOwned: options.includeClientOwned });
  if (!response.success) {
    throw new Error(response.error);
  }
  const data = response.data;
  if (!data || typeof data !== "object" || !("sessions" in data)) {
    throw new Error("Daemon returned an invalid session list response");
  }
  const sessions = data.sessions;
  if (!Array.isArray(sessions)) {
    throw new Error("Daemon returned an invalid session list response");
  }
  if (!sessions.every(isDaemonSessionSummary)) {
    throw new Error("Daemon returned an invalid session list response");
  }
  const busyClientOwnedSessionCount = data.busyClientOwnedSessionCount;
  if (busyClientOwnedSessionCount !== void 0 && (typeof busyClientOwnedSessionCount !== "number" || !Number.isInteger(busyClientOwnedSessionCount) || busyClientOwnedSessionCount < 0)) {
    throw new Error("Daemon returned an invalid client-owned session count");
  }
  return { sessions, busyClientOwnedSessionCount: busyClientOwnedSessionCount ?? 0 };
}
var StaleDaemonError = class extends Error {
  constructor(socketPath, hello) {
    const daemonIdentity = hello ? `Daemon: v${hello.appVersion ?? "unknown"}, protocol ${hello.protocol.version}, schema ${hello.schemaId ?? "legacy"}, build ${hello.runtime?.buildId ?? "unknown"}, PID ${hello.supervisorPid ?? "unknown"}, executable ${hello.runtime?.launcherPath ?? hello.runtime?.entrypointPath ?? hello.runtime?.executablePath ?? "unknown"}` : `Daemon: unknown build on ${socketPath}`;
    const client = getDaemonRuntimeIdentity();
    super(`An incompatible Prime Agent daemon is running.

${daemonIdentity}
Client: v${VERSION}, protocol ${DAEMON_PROTOCOL_VERSION}, schema ${DAEMON_SCHEMA_ID}, build ${client.buildId}, executable ${client.launcherPath ?? client.entrypointPath ?? client.executablePath}

Run:
${formatCurrentCliCommand(["shutdown", "--force"])}

Then retry the original command.`);
    this.socketPath = socketPath;
    this.name = "StaleDaemonError";
  }
};
var PROCESS_START_ID_POLL_INTERVAL_MS = 1e3;
function hasProcessIdentityExited(identity, verifyProcessStartId = true) {
  if (!identity) {
    return true;
  }
  try {
    process.kill(identity.pid, 0);
  } catch (error) {
    return error.code === "ESRCH";
  }
  if (!identity.processStartId || !verifyProcessStartId) {
    return false;
  }
  const currentStartId = getProcessStartId(identity.pid);
  return currentStartId !== void 0 && currentStartId !== identity.processStartId;
}
async function waitForDaemonGone(socketPath, timeoutMs = 5e3, requireSocketCleanup = false, expectedIdentity) {
  const deadline = Date.now() + timeoutMs;
  let nextProcessStartIdPollAt = 0;
  const hasExpectedProcessExited = (forceStartIdPoll = false) => {
    const now = Date.now();
    const verifyProcessStartId = forceStartIdPoll || now >= nextProcessStartIdPollAt;
    if (verifyProcessStartId) {
      nextProcessStartIdPollAt = now + PROCESS_START_ID_POLL_INTERVAL_MS;
    }
    return hasProcessIdentityExited(expectedIdentity, verifyProcessStartId);
  };
  while (Date.now() < deadline) {
    if (!await canConnectToDaemon(socketPath, 250) && (!requireSocketCleanup || process.platform === "win32" || !existsSync(socketPath)) && hasExpectedProcessExited()) {
      return true;
    }
    await delay(25);
  }
  return requireSocketCleanup && !await canConnectToDaemon(socketPath, 250) && hasExpectedProcessExited(true);
}
function processIdentityFromDaemonHello(hello) {
  if (!hello?.supervisorPid || !Number.isInteger(hello.supervisorPid) || hello.supervisorPid <= 0) {
    return void 0;
  }
  const processStartId = hello.supervisorProcessStartId ?? getProcessStartId(hello.supervisorPid);
  return {
    pid: hello.supervisorPid,
    ...processStartId ? { processStartId } : {}
  };
}
async function shutdownConnectedDaemonAndWait(client, socketPath, timeoutMs = 5e3, hello = client.hello) {
  let shutdownAccepted = false;
  const expectedIdentity = processIdentityFromDaemonHello(hello);
  try {
    const response = await client.request({ type: "shutdown" }).catch(() => void 0);
    shutdownAccepted = response?.success === true;
  } catch {
  } finally {
    client.close();
  }
  return waitForDaemonGone(socketPath, timeoutMs, shutdownAccepted, expectedIdentity);
}
async function shutdownDaemonAndWait(socketPath, timeoutMs = 5e3) {
  const client = new DaemonClient(socketPath);
  try {
    await client.connect(1e3);
    const hello = await client.waitForHello(2e3).catch(() => void 0);
    return shutdownConnectedDaemonAndWait(client, socketPath, timeoutMs, hello);
  } catch {
    client.close();
    return waitForDaemonGone(socketPath, timeoutMs);
  }
}
function isSessionBusy(summary) {
  return isSessionSummaryBusy(summary);
}
async function probeRunningDaemonSessions(socketPath) {
  const client = new DaemonClient(socketPath);
  try {
    await client.connect(1e3);
  } catch {
    client.close();
    return { reachable: false };
  }
  try {
    const result = await queryActiveDaemonSessions(client, { includeClientOwned: true });
    return {
      reachable: true,
      activeSessions: result.sessions.filter((summary) => summary.activeSessionId !== void 0),
      ...result.busyClientOwnedSessionCount > 0 ? { busyClientOwnedSessionCount: result.busyClientOwnedSessionCount } : {}
    };
  } catch {
    return { reachable: true };
  } finally {
    client.close();
  }
}
async function shutdownStaleDaemonIfNotBusy(socketPath) {
  const client = new DaemonClient(socketPath);
  let connected = false;
  let hasBusySessions = false;
  let loadedSessionCount = 0;
  try {
    await client.connect(1e3);
    connected = true;
    try {
      const result = await queryActiveDaemonSessions(client, { includeClientOwned: true });
      loadedSessionCount = result.sessions.length;
      hasBusySessions = result.busyClientOwnedSessionCount !== 0 || result.sessions.some((summary) => isSessionBusy(summary));
    } catch {
      hasBusySessions = true;
    }
  } catch {
  } finally {
    client.close();
  }
  if (!connected) {
    return waitForDaemonGone(socketPath);
  }
  if (hasBusySessions) {
    logDaemonLaunch(`refusing to replace stale daemon on ${socketPath}: busy session(s) present`);
    return false;
  }
  logDaemonLaunch(`replacing stale daemon on ${socketPath} (idle): ${loadedSessionCount} loaded session(s) will reload`);
  return shutdownDaemonAndWait(socketPath);
}
async function ensureDaemonRunning(socketPath, spawnCwd) {
  const probe = await probeDaemonVersion(socketPath);
  if (probe.status === "current") {
    return;
  }
  if (probe.status === "stale") {
    const stopped = await shutdownStaleDaemonIfNotBusy(socketPath);
    if (!stopped)
      throw new StaleDaemonError(socketPath, probe.hello);
  }
  const entrypoint = process.argv[1];
  if (!entrypoint) {
    throw new Error("Cannot determine current CLI entrypoint for daemon launch");
  }
  const env = createCliSubprocessEnv();
  delete env[DAEMON_WORKER_ROLE_ENV];
  delete env[DAEMON_WORKER_TOKEN_ENV];
  delete env[DAEMON_WORKER_ACTIVE_SESSION_ID_ENV];
  delete env[DAEMON_WORKER_RECOVERY_JOURNAL_ENV];
  delete env[DAEMON_WORKER_SUPERVISOR_SOCKET_ENV];
  delete env[ORPHAN_PROCESS_JOURNAL_ENV];
  delete env[SESSION_LEASES_ENABLED_ENV];
  delete env[SESSION_LEASE_OWNER_ID_ENV];
  const logOffset = currentDaemonLogSize(socketPath);
  const child = spawn(process.execPath, [...process.execArgv, entrypoint, "--mode", "daemon", "--daemon-socket", socketPath], {
    cwd: spawnCwd ?? process.cwd(),
    detached: true,
    env,
    // A pipe would tie the daemon's stderr to this short-lived CLI
    // (EPIPE once it exits); crash details come from the daemon log,
    // which the supervisor writes to before rethrowing startup errors.
    stdio: "ignore"
  });
  let childFailure;
  child.once("error", (error) => {
    childFailure ??= { type: "error", error };
  });
  child.once("exit", (code, signal) => {
    childFailure ??= { type: "exit", code, signal };
  });
  child.unref();
  const throwIfFailed = () => {
    if (!childFailure) {
      return;
    }
    const logTail = readDaemonLogTail(socketPath, logOffset);
    if (childFailure.type === "error") {
      throw new Error(`Failed to spawn Prime Agent daemon: ${childFailure.error.message}.${logTail}`);
    }
    const signal = childFailure.signal ? `, signal ${childFailure.signal}` : "";
    throw new Error(`Prime Agent daemon exited during startup (code ${childFailure.code ?? "unknown"}${signal}).${logTail}`);
  };
  const deadline = Date.now() + DAEMON_STARTUP_TIMEOUT_MS;
  let exitDeadline;
  while (Date.now() < Math.min(deadline, exitDeadline ?? Number.POSITIVE_INFINITY)) {
    const started = await probeDaemonVersion(socketPath);
    if (started.status === "current") {
      return;
    }
    if (childFailure) {
      exitDeadline ??= Date.now() + DAEMON_STARTUP_EXIT_GRACE_MS;
    }
    await delay(25);
  }
  throwIfFailed();
  throw new Error(`Timed out waiting for daemon to start on ${socketPath}.${readDaemonLogTail(socketPath, logOffset)}`);
}
function currentDaemonLogSize(socketPath) {
  try {
    return statSync(getDaemonLogPath(socketPath)).size;
  } catch {
    return 0;
  }
}
function readDaemonLogTail(socketPath, offset) {
  const logPath = getDaemonLogPath(socketPath);
  let tail = "";
  try {
    const content = readFileSync(logPath);
    tail = content.subarray(content.length < offset ? 0 : offset).subarray(-DAEMON_STARTUP_LOG_TAIL_BYTES).toString("utf8").trim();
  } catch {
  }
  return tail ? ` Recent daemon log (${logPath}):
${tail}` : ` The daemon wrote nothing to its log (${logPath}).`;
}
var ensurePromises = /* @__PURE__ */ new Map();
function ensureInteractiveDaemonRunning(socketPath, spawnCwd) {
  let promise = ensurePromises.get(socketPath);
  if (!promise) {
    promise = ensureDaemonRunning(socketPath, spawnCwd);
    ensurePromises.set(socketPath, promise);
    const clear = () => {
      if (ensurePromises.get(socketPath) === promise) {
        ensurePromises.delete(socketPath);
      }
    };
    promise.then(clear, clear);
  }
  return promise;
}
var EARLY_LAUNCH_EXCLUDED_FLAGS = /* @__PURE__ */ new Set(["--help", "-h", "--version", "-v", "--list-models", "--export"]);
var EARLY_LAUNCH_VALUE_FLAGS = /* @__PURE__ */ new Set([
  "--mode",
  "--daemon-socket",
  "--provider",
  "--model",
  "--api-key",
  "--cwd",
  "--system-prompt",
  "--append-system-prompt",
  "--fork",
  "--session-dir",
  "--models",
  "--tools",
  "-t",
  "--thinking",
  "--extension",
  "-e",
  "--skill",
  "--prompt-template",
  "--theme",
  "--autonomous-gate",
  "--autonomous-gate-retries",
  "--autonomous-gate-timeout-ms",
  "--autonomous-max-continuations",
  "--autonomous-max-turns",
  "--autonomous-max-tokens",
  "--autonomous-timeout-ms",
  "--goal",
  "--goal-token-budget"
]);
function findFirstEarlyLaunchPositional(args) {
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === "--") {
      return args[index + 1] === void 0 ? void 0 : { index: index + 1, value: args[index + 1] };
    }
    if (EARLY_LAUNCH_VALUE_FLAGS.has(arg)) {
      index++;
      continue;
    }
    if (arg === "--resume" || arg === "-r") {
      if (args[index + 1] && !args[index + 1].startsWith("-")) {
        index++;
      }
      continue;
    }
    if (!arg.startsWith("-")) {
      return { index, value: arg };
    }
  }
  return void 0;
}
function shouldStartDaemonEarly(args, startupBenchmark) {
  if (startupBenchmark) {
    return false;
  }
  const modeIndex = args.indexOf("--mode");
  if (modeIndex !== -1 && args[modeIndex + 1] === "daemon") {
    return false;
  }
  if (args.some((arg) => EARLY_LAUNCH_EXCLUDED_FLAGS.has(arg))) {
    return false;
  }
  if (args.includes("--print") || args.includes("-p")) {
    return true;
  }
  const firstPositional = findFirstEarlyLaunchPositional(args);
  const isHelpCommand = firstPositional?.value === "help" && isHelpCommandRequest(args.slice(firstPositional.index + 1));
  if (firstPositional && (REMOVED_COMMAND_NAMES.has(firstPositional.value) || PUBLIC_COMMAND_NAMES.has(firstPositional.value) && firstPositional.value !== "agents" && (firstPositional.value !== "help" || isHelpCommand))) {
    return false;
  }
  return true;
}
function maybeStartDaemonEarly(args) {
  const benchmarkFlag = (process.env.PI_STARTUP_BENCHMARK ?? "").toLowerCase();
  const startupBenchmark = benchmarkFlag === "1" || benchmarkFlag === "true" || benchmarkFlag === "yes";
  if (!shouldStartDaemonEarly(args, startupBenchmark)) {
    return;
  }
  const socketIndex = args.indexOf("--daemon-socket");
  const socketPath = socketIndex !== -1 && args[socketIndex + 1] ? args[socketIndex + 1] : defaultDaemonSocketPath();
  const cwdIndex = args.indexOf("--cwd");
  const cwdArg = cwdIndex !== -1 ? args[cwdIndex + 1] : void 0;
  const spawnCwd = cwdArg ? resolve(expandTildePath(cwdArg)) : void 0;
  if (spawnCwd && !existsSync(spawnCwd)) {
    return;
  }
  void ensureInteractiveDaemonRunning(socketPath, spawnCwd);
}

// dist/cli/owned-session-worker.js
import { spawn as spawn2 } from "node:child_process";
import { randomUUID } from "node:crypto";
import { chmodSync, readFileSync as readFileSync2, renameSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
var OWNED_WORKER_ENV = "PRIME_AGENT_INTERNAL_OWNED_WORKER";
var OWNED_RECOVERY_DESCRIPTOR_ENV = "PRIME_AGENT_INTERNAL_OWNED_RECOVERY_DESCRIPTOR";
var OWNED_PROFILE_ENV = "PRIME_AGENT_INTERNAL_OWNED_PROFILE";
var closeOwnerWatch;
function isOwnedSessionWorkerProcess(environment = process.env) {
  return environment[OWNED_WORKER_ENV] === "1";
}
var NON_SESSION_FLAGS = /* @__PURE__ */ new Set(["--help", "-h", "--version", "-v", "--list-models", "--export"]);
var NON_SESSION_COMMANDS = /* @__PURE__ */ new Set([...PUBLIC_COMMAND_NAMES, ...REMOVED_COMMAND_NAMES]);
function valueAfter(args, flag) {
  const index = args.indexOf(flag);
  return index === -1 ? void 0 : args[index + 1];
}
function hasNonSessionOperation(args) {
  if (args.some((arg) => NON_SESSION_FLAGS.has(arg) || arg.startsWith("--export="))) {
    return true;
  }
  const first = args[0];
  if (first === "help") {
    return isHelpCommandRequest(args.slice(1));
  }
  return first !== void 0 && NON_SESSION_COMMANDS.has(first);
}
function isStartupBenchmark(environment) {
  const value = environment.PI_STARTUP_BENCHMARK?.toLowerCase();
  return value === "1" || value === "true" || value === "yes";
}
function classifyOwnedSessionWorkerInvocation(args, stdinIsTTY, environment = process.env) {
  if (isOwnedSessionWorkerProcess(environment) || hasNonSessionOperation(args)) {
    return void 0;
  }
  const mode = valueAfter(args, "--mode");
  if (mode === "daemon") {
    return void 0;
  }
  if (mode === "rpc") {
    return "rpc";
  }
  if (mode === "json") {
    return "json";
  }
  if (args.includes("--print") || args.includes("-p") || stdinIsTTY === false) {
    return "print";
  }
  if (args.includes("--no-session") || isStartupBenchmark(environment)) {
    return "interactive-ephemeral";
  }
  return void 0;
}
function createOwnedWorkerLaunchSpec(args, executable = process.execPath, execArgs = process.execArgv, entrypoint = process.argv[1]) {
  return createCliSubprocessLaunchSpec(args, executable, execArgs, entrypoint);
}
function readOwnedRecoveryDescriptor(path) {
  try {
    const value = JSON.parse(readFileSync2(path, "utf8"));
    if (value.version === 1 && typeof value.sessionId === "string" && typeof value.cwd === "string" && (value.sessionFile === void 0 || typeof value.sessionFile === "string")) {
      return value;
    }
  } catch {
  }
  return void 0;
}
function writeOwnedRecoveryDescriptor(path, profile, session) {
  const descriptor = {
    version: 1,
    profile,
    sessionId: session.sessionId,
    ...session.sessionFile ? { sessionFile: session.sessionFile } : {},
    cwd: session.sessionManager.getCwd(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  const tempPath = `${path}.${process.pid}.tmp`;
  writeFileSync(tempPath, `${JSON.stringify(descriptor)}
`, { mode: 384 });
  chmodSync(tempPath, 384);
  renameSync(tempPath, path);
}
function installOwnedSessionRecoveryTracking(runtime) {
  const path = process.env[OWNED_RECOVERY_DESCRIPTOR_ENV];
  const profile = process.env[OWNED_PROFILE_ENV];
  if (!path || !profile) {
    return;
  }
  let unsubscribeSession;
  const bind = (session) => {
    unsubscribeSession?.();
    writeOwnedRecoveryDescriptor(path, profile, session);
    let lastSessionFile = session.sessionFile;
    unsubscribeSession = session.subscribe((event) => {
      if (event.type !== "message_start" && event.type !== "session_info_changed") {
        return;
      }
      if (session.sessionFile !== lastSessionFile) {
        lastSessionFile = session.sessionFile;
        writeOwnedRecoveryDescriptor(path, profile, session);
      }
    });
  };
  bind(runtime.session);
  runtime.onSessionReplaced(bind);
}
function createRpcRecoveryArgs(args, sessionPath) {
  const recovered = [];
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === "--resume" || arg === "-r" || arg === "--fork") {
      index++;
      continue;
    }
    if (arg.startsWith("--resume=")) {
      continue;
    }
    if (arg === "--continue" || arg === "-c") {
      continue;
    }
    recovered.push(arg);
  }
  return [...recovered, "--resume", sessionPath];
}
function exitCodeForSignal(signal) {
  if (signal === "SIGHUP") {
    return 129;
  }
  if (signal === "SIGINT") {
    return 130;
  }
  if (signal === "SIGTERM") {
    return 143;
  }
  return 1;
}
function forwardSignal(child, signal) {
  if (child.exitCode === null && child.signalCode === null) {
    child.kill(signal);
  }
}
async function runOwnedSessionWorkerFrontend(args, profile) {
  const interactive = profile === "interactive-ephemeral";
  const recoveryDescriptorPath = join(tmpdir(), `prime-agent-owned-${process.pid}-${randomUUID().slice(0, 12)}.json`);
  const orphanProcessJournalPath = `${recoveryDescriptorPath}.orphans.jsonl`;
  let currentChild;
  let terminating = false;
  let terminationSignal;
  let stdinEnded = false;
  let currentRpcInput;
  let currentRpcOutput;
  let rpcStdoutPaused = false;
  let detachRpcInput;
  let detachRpcOutput;
  const bufferedRpcInput = [];
  const pendingRpcCommands = /* @__PURE__ */ new Map();
  const anonymousRpcIdPrefix = `prime-agent-owned-${randomUUID()}`;
  let anonymousRpcCommandId = 0;
  const prepareRpcInput = (line) => {
    try {
      const command = JSON.parse(line);
      if (!command || Array.isArray(command) || typeof command.type !== "string" || command.type === "extension_ui_response" || command.type === "ack_result") {
        return `${line}
`;
      }
      const publicId = typeof command.id === "string" ? command.id : void 0;
      const internalId = publicId ?? `${anonymousRpcIdPrefix}-${++anonymousRpcCommandId}`;
      pendingRpcCommands.set(internalId, { publicId, command: command.type });
      return publicId !== void 0 ? `${line}
` : serializeJsonLine({ ...command, id: internalId });
    } catch {
      return `${line}
`;
    }
  };
  const observeRpcOutput = (line) => {
    let parsed;
    try {
      parsed = JSON.parse(line);
    } catch {
      return;
    }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return;
    }
    const response = parsed;
    const id = typeof response.id === "string" ? response.id : void 0;
    const pending = id !== void 0 ? pendingRpcCommands.get(id) : void 0;
    let framed = `${line}
`;
    if (response.type === "response" && pending?.publicId === void 0) {
      const { id: _internalId, ...publicResponse } = response;
      framed = serializeJsonLine(publicResponse);
    }
    if (!process.stdout.write(framed) && !rpcStdoutPaused) {
      rpcStdoutPaused = true;
      currentRpcOutput?.pause();
      process.stdout.once("drain", () => {
        rpcStdoutPaused = false;
        currentRpcOutput?.resume();
      });
    }
    if (response.type !== "response" || typeof response.command !== "string") {
      return;
    }
    if (id !== void 0 && pending?.command === response.command) {
      pendingRpcCommands.delete(id);
    }
  };
  const failPendingRpcCommands = () => {
    for (const pending of pendingRpcCommands.values()) {
      process.stdout.write(serializeJsonLine({
        ...pending.publicId !== void 0 ? { id: pending.publicId } : {},
        type: "response",
        command: pending.command,
        success: false,
        error: "The isolated session worker stopped during this command; its result is uncertain and was not replayed"
      }));
    }
    pendingRpcCommands.clear();
  };
  const reapWorkerResources = (workerPid) => {
    if (!workerPid) {
      return;
    }
    if (process.platform !== "win32") {
      try {
        process.kill(-workerPid, "SIGKILL");
      } catch {
      }
    }
    for (const orphan of readActiveOrphanProcesses(orphanProcessJournalPath, workerPid)) {
      if (!isOrphanProcessIdentityCurrent(orphan)) {
        continue;
      }
      const { pid } = orphan;
      try {
        process.kill(process.platform === "win32" ? pid : -pid, "SIGKILL");
      } catch {
        try {
          process.kill(pid, "SIGKILL");
        } catch {
        }
      }
    }
    clearOrphanProcessJournal(orphanProcessJournalPath);
  };
  if (profile === "rpc") {
    detachRpcInput = attachJsonlLineReader(process.stdin, (line) => {
      const framed = prepareRpcInput(line);
      const input = currentRpcInput;
      if (input?.writable) {
        if (!input.write(framed)) {
          process.stdin.pause();
          input.once("drain", () => {
            if (currentRpcInput === input && !stdinEnded) {
              process.stdin.resume();
            }
          });
        }
      } else {
        bufferedRpcInput.push(framed);
      }
    });
    process.stdin.once("end", () => {
      stdinEnded = true;
      currentRpcInput?.end();
    });
  }
  const spawnWorker = (workerArgs) => {
    const launch = createOwnedWorkerLaunchSpec(workerArgs);
    const bridgeStdin = profile === "rpc" || process.stdin.isTTY !== true;
    const stdio = interactive ? ["inherit", "inherit", "inherit", "ipc"] : [bridgeStdin ? "pipe" : "inherit", "pipe", "pipe", "ipc"];
    const child = spawn2(launch.command, launch.args, {
      cwd: process.cwd(),
      detached: process.platform !== "win32",
      env: {
        ...process.env,
        [OWNED_WORKER_ENV]: "1",
        [OWNED_RECOVERY_DESCRIPTOR_ENV]: recoveryDescriptorPath,
        [OWNED_PROFILE_ENV]: profile,
        [ORPHAN_PROCESS_JOURNAL_ENV]: orphanProcessJournalPath,
        [SESSION_LEASES_ENABLED_ENV]: "1",
        [SESSION_LEASE_OWNER_ID_ENV]: `owned-${randomUUID()}`
      },
      stdio
    });
    currentChild = child;
    if (!interactive) {
      const childInput = child.stdin ?? void 0;
      const childOutput = child.stdout ?? void 0;
      const childError = child.stderr ?? void 0;
      if (bridgeStdin && !childInput || !childOutput || !childError) {
        child.kill("SIGTERM");
        throw new Error("Owned session worker did not expose bridged stdio");
      }
      childError.pipe(process.stderr, { end: false });
      if (profile === "rpc") {
        if (!childInput) {
          throw new Error("Owned RPC worker did not expose stdin");
        }
        currentRpcInput = childInput;
        currentRpcOutput = childOutput;
        if (rpcStdoutPaused) {
          childOutput.pause();
        }
        detachRpcOutput = attachJsonlLineReader(childOutput, observeRpcOutput);
        for (const buffered of bufferedRpcInput.splice(0)) {
          childInput.write(buffered);
        }
        if (stdinEnded) {
          childInput.end();
        }
      } else {
        if (childInput) {
          process.stdin.pipe(childInput);
        }
        childOutput.pipe(process.stdout, { end: false });
      }
    }
    return child;
  };
  const signals = ["SIGINT", "SIGTERM"];
  if (process.platform !== "win32") {
    signals.push("SIGHUP");
  }
  const signalHandlers = signals.map((signal) => {
    const handler = () => {
      terminating = true;
      terminationSignal ??= signal;
      if (currentChild) {
        forwardSignal(currentChild, signal);
      }
    };
    process.on(signal, handler);
    return { signal, handler };
  });
  try {
    let workerArgs = [...args];
    let recoveryAttempt = 0;
    while (true) {
      if (terminating) {
        return exitCodeForSignal(terminationSignal ?? null);
      }
      const workerStartedAt = Date.now();
      const child = spawnWorker(workerArgs);
      const workerPid = child.pid;
      const exit = await new Promise((resolveExit, reject) => {
        child.once("error", reject);
        child.once("close", (code, signal) => resolveExit({ code: code ?? exitCodeForSignal(signal), signal }));
      });
      currentChild = void 0;
      currentRpcInput = void 0;
      currentRpcOutput = void 0;
      if (profile === "rpc" && !stdinEnded) {
        process.stdin.resume();
      }
      detachRpcOutput?.();
      detachRpcOutput = void 0;
      if (!interactive && profile !== "rpc" && child.stdin) {
        process.stdin.unpipe(child.stdin);
      }
      if (child.connected) {
        child.disconnect();
      }
      reapWorkerResources(workerPid);
      const rpcCrashed = profile === "rpc" && !terminating && (exit.code !== 0 || exit.signal !== null || pendingRpcCommands.size > 0);
      const workerExitCode = rpcCrashed && exit.code === 0 ? 1 : exit.code;
      if (Date.now() - workerStartedAt >= 6e4) {
        recoveryAttempt = 0;
      }
      if (rpcCrashed) {
        failPendingRpcCommands();
      }
      const shouldRecover = rpcCrashed && !stdinEnded && recoveryAttempt < 3;
      if (!shouldRecover) {
        return terminationSignal ? exitCodeForSignal(terminationSignal) : workerExitCode;
      }
      const descriptor = readOwnedRecoveryDescriptor(recoveryDescriptorPath);
      if (!descriptor?.sessionFile) {
        return terminationSignal ? exitCodeForSignal(terminationSignal) : workerExitCode;
      }
      workerArgs = createRpcRecoveryArgs(args, descriptor.sessionFile);
      const retryDelay = [250, 1e3, 5e3][recoveryAttempt] ?? 5e3;
      recoveryAttempt++;
      await new Promise((resolveDelay) => setTimeout(resolveDelay, retryDelay));
      if (terminating) {
        return exitCodeForSignal(terminationSignal ?? null);
      }
    }
  } finally {
    for (const { signal, handler } of signalHandlers) {
      process.off(signal, handler);
    }
    detachRpcInput?.();
    detachRpcOutput?.();
    rmSync(recoveryDescriptorPath, { force: true });
    clearOrphanProcessJournal(orphanProcessJournalPath);
  }
}
async function maybeRunOwnedSessionWorkerFrontend(args, forceLegacyFrontend = false) {
  if (!forceLegacyFrontend && process.env.PRIME_AGENT_INTERNAL_LEGACY_OWNED_WORKER_FRONTEND !== "1") {
    return false;
  }
  const profile = classifyOwnedSessionWorkerInvocation(args, process.stdin.isTTY);
  if (!profile) {
    return false;
  }
  process.exitCode = await runOwnedSessionWorkerFrontend(args, profile);
  return true;
}
function installOwnedSessionWorkerOwnerWatch() {
  if (!isOwnedSessionWorkerProcess()) {
    return;
  }
  if (!process.channel) {
    throw new Error("Owned session worker is missing its owner channel");
  }
  let ownerGone = false;
  const terminate = () => {
    if (ownerGone) {
      return;
    }
    ownerGone = true;
    closeOwnerWatch = void 0;
    const forceTimer = setTimeout(() => {
      if (process.platform !== "win32") {
        try {
          process.kill(-process.pid, "SIGKILL");
          return;
        } catch {
        }
      }
      process.exit(143);
    }, 5e3);
    forceTimer.unref();
    process.kill(process.pid, "SIGTERM");
  };
  process.once("disconnect", terminate);
  process.channel.unref();
  closeOwnerWatch = () => {
    if (ownerGone) {
      return;
    }
    ownerGone = true;
    process.off("disconnect", terminate);
    if (process.connected) {
      process.disconnect();
    }
    closeOwnerWatch = void 0;
  };
}
function closeOwnedSessionWorkerOwnerWatch() {
  closeOwnerWatch?.();
}

export {
  PUBLIC_COMMAND_NAMES,
  REMOVED_COMMAND_NAMES,
  getCommandSpec,
  getChildCommandSpecs,
  isHelpCommandRequest,
  findCommandSuggestion,
  formatTopLevelHelp,
  formatCommandHelp,
  isDaemonSessionSummary,
  listActiveDaemonSessionSummaries,
  StaleDaemonError,
  shutdownConnectedDaemonAndWait,
  shutdownDaemonAndWait,
  isSessionBusy,
  probeRunningDaemonSessions,
  ensureInteractiveDaemonRunning,
  maybeStartDaemonEarly,
  isOwnedSessionWorkerProcess,
  installOwnedSessionRecoveryTracking,
  maybeRunOwnedSessionWorkerFrontend,
  installOwnedSessionWorkerOwnerWatch,
  closeOwnedSessionWorkerOwnerWatch
};
