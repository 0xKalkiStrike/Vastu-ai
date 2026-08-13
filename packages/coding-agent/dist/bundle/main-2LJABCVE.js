import { createRequire as __piBundleCreateRequire } from 'node:module'; const require = __piBundleCreateRequire(import.meta.url);
import {
  PUBLIC_COMMAND_NAMES,
  REMOVED_COMMAND_NAMES,
  StaleDaemonError,
  ensureInteractiveDaemonRunning,
  findCommandSuggestion,
  formatCommandHelp,
  formatTopLevelHelp,
  getChildCommandSpecs,
  getCommandSpec,
  installOwnedSessionRecoveryTracking,
  isDaemonSessionSummary,
  isHelpCommandRequest,
  isOwnedSessionWorkerProcess,
  isSessionBusy,
  listActiveDaemonSessionSummaries,
  probeRunningDaemonSessions,
  shutdownConnectedDaemonAndWait,
  shutdownDaemonAndWait
} from "./chunk-BZDGQ63S.js";
import {
  AuthStorage,
  ClientPromptStashStore,
  DAEMON_UPDATE_RESTART_COORDINATOR_FLAG,
  DAEMON_UPDATE_RESTART_ORIGIN_FLAG,
  DAEMON_UPDATE_RESTART_STATUS_FLAG,
  DaemonAgentConnection,
  DaemonUpdateRestartCoordinatorAlreadyRunningError,
  DaemonUpdateRestartStatusWriter,
  DefaultPackageManager,
  DynamicBorder,
  ExtensionSelectorComponent,
  INTERNAL_RUNTIME_COMMAND_MARKER,
  InProcessAgentConnection,
  InteractiveMode,
  KeybindingsManager,
  MissingSessionCwdError,
  SessionSelectorError,
  SessionSelectorNotFoundError,
  SettingsManager,
  acquireDaemonShutdownAdmission,
  acquireDaemonUpdateRestartCoordinator,
  buildDaemonUpdateRestartReport,
  createAgentSessionFromServices,
  createAgentSessionRuntime,
  createAgentSessionServices,
  createInteractiveModeLocalSessionHost,
  createInteractiveModeUiServicesFromServices,
  deserializeDaemonError,
  findInitialModel,
  formatDimensionNote,
  formatMissingSessionCwdPrompt,
  formatSessionDisplayId,
  getLatestPiRelease,
  getMissingSessionCwdIssue,
  isDaemonCatalogProcess,
  isNewerPackageVersion,
  isTelemetryEnabled,
  isValidThinkingLevel,
  launchDaemonUpdateRestartCoordinator,
  looksLikeSessionPath,
  matchesSessionIdSuffix,
  mergeAgentSessionRuntimeConfig,
  mergeAutonomousConfig,
  migrateKeybindingsConfig,
  parseArgs,
  persistDaemonStartupFenceFromOwner,
  printTimings,
  registerBuiltinMcpOAuthProviders,
  resetTimings,
  resizeImage,
  resolveCliModel,
  resolveModelScope,
  resolveSessionPath,
  restoreStdout,
  runAcpMode,
  runAcpModeWithConnection,
  runAgentsViewMode,
  runDaemonCatalogProcess,
  runDaemonMode,
  runDaemonSupervisorMode,
  runPrintMode,
  runPrintModeWithConnection,
  runRpcMode,
  runRpcModeWithConnection,
  shouldRunOnboarding,
  takeOverStdout,
  time,
  waitForActiveDaemonUpdateRestartCoordinator,
  waitForDaemonStartupFence
} from "./chunk-GPHRHRRD.js";
import {
  APP_NAME,
  CONFIG_DIR_NAME,
  Container,
  DAEMON_PROTOCOL_VERSION,
  DAEMON_SCHEMA_ID,
  DAEMON_UPDATE_RESTART_FORMAT_VERSION,
  DAEMON_WORKER_ACTIVE_SESSION_ID_ENV,
  DAEMON_WORKER_SUPERVISOR_SOCKET_ENV,
  DaemonCapabilityUnavailableError,
  DaemonClient,
  Input,
  PACKAGE_NAME,
  ProcessTerminal,
  SELF_UPDATE_INTERACTIVE_CHILD_ENV,
  SELF_UPDATE_NOT_ATTEMPTED_EXIT_CODE,
  SESSION_ACTION_RECOVERY_FORMAT_VERSION,
  SessionAlreadyActiveError,
  SessionManager,
  Spacer,
  TUI,
  VERSION,
  appendRotatingLog,
  canonicalSessionPath,
  collectDaemonClientEnv,
  collectDaemonLaunchEnv,
  defaultDaemonSocketDir,
  defaultDaemonSocketPath,
  detectSupportedImageMimeTypeFromFile,
  expandTildePath,
  exportFromFile,
  formatAgentCronJob,
  formatNoModelsAvailableMessage,
  fuzzyFilter,
  getAgentDir,
  getAgentLogPath,
  getBinDir,
  getDaemonUpdateRestartManifestPath,
  getKeybindings,
  getLegacyDaemonUpdateRestartManifestPath,
  getProcessStartId,
  getSelfUpdateCommand,
  getSelfUpdateUnavailableInstruction,
  getSessionDirEnvOverride,
  getSessionsDir,
  initTheme,
  isDaemonWorkerProcess,
  isLocalPath,
  isOrphanProcessIdentityCurrent,
  isSessionSlashCommand,
  isUnknownDaemonCommandError,
  matchesKey,
  preloadCodeHighlighter,
  rawKeyHint,
  readActiveOrphanProcesses,
  readFirstLineSync,
  requireDaemonWorkerAuthenticationToken,
  resolveAttachModelFallbackMessage,
  resolveReadPath,
  setKeybindings,
  shouldUseWindowsShell,
  signalProcessGroupOrProcess,
  source_default,
  stopThemeWatcher,
  theme,
  truncateToWidth,
  visibleWidth,
  waitForDaemonWorkerStartupGate
} from "./chunk-AN7FDQCZ.js";
import "./chunk-LYHRSAMD.js";
import "./chunk-5QCJ5DQU.js";
import "./chunk-SJRJPSXP.js";
import "./chunk-2T7M7VJ4.js";
import "./chunk-ZE5IALUH.js";
import "./chunk-6GUVYK6P.js";
import {
  setLogSink,
  stringifyLogEntry
} from "./chunk-UPDAFKL5.js";
import {
  modelsAreEqual
} from "./chunk-JM6I4LOJ.js";
import "./chunk-BAWSWWEU.js";

// dist/main.js
import { join as join4, resolve as resolve5 } from "node:path";
import { createInterface as createInterface3 } from "node:readline";

// dist/cli/daemon-stop-confirm.js
import { createInterface } from "node:readline";
function promptYesNo(message) {
  return new Promise((resolve6) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    rl.question(`${message} [y/N] `, (answer) => {
      rl.close();
      const normalized = answer.trim().toLowerCase();
      resolve6(normalized === "y" || normalized === "yes");
    });
  });
}
function pluralizeSessions(count) {
  return count === 1 ? { noun: "session", pronoun: "it" } : { noun: "sessions", pronoun: "them" };
}
async function confirmDaemonSessionLoss(probe, options) {
  const { force, copy } = options;
  if (!probe.reachable || force) {
    return true;
  }
  let detail;
  if (probe.activeSessions === void 0) {
    detail = copy.unlistableDetail;
  } else {
    const busySessionCount = probe.activeSessions.filter(isSessionBusy).length + (probe.busyClientOwnedSessionCount ?? 0);
    if (busySessionCount === 0) {
      return true;
    }
    detail = copy.busyDetail(busySessionCount);
  }
  if (!process.stdin.isTTY) {
    console.error(source_default.red(`${detail} ${copy.nonTtyHint}`));
    return false;
  }
  return promptYesNo(`${detail} ${copy.question}`);
}

// dist/cli/file-processor.js
import { access, readFile, stat } from "node:fs/promises";
import { resolve } from "path";
async function processFileArguments(fileArgs, options) {
  const autoResizeImages = options?.autoResizeImages ?? true;
  let text = "";
  const images = [];
  for (const fileArg of fileArgs) {
    const absolutePath = resolve(resolveReadPath(fileArg, process.cwd()));
    try {
      await access(absolutePath);
    } catch {
      console.error(source_default.red(`Error: File not found: ${absolutePath}`));
      process.exit(1);
    }
    const stats = await stat(absolutePath);
    if (stats.size === 0) {
      continue;
    }
    const mimeType = await detectSupportedImageMimeTypeFromFile(absolutePath);
    if (mimeType) {
      const content = await readFile(absolutePath);
      const base64Content = content.toString("base64");
      let attachment;
      let dimensionNote;
      if (autoResizeImages) {
        const resized = await resizeImage({ type: "image", data: base64Content, mimeType });
        if (!resized) {
          text += `<file name="${absolutePath}">[Image omitted: could not be resized below the inline image size limit.]</file>
`;
          continue;
        }
        dimensionNote = formatDimensionNote(resized);
        attachment = {
          type: "image",
          mimeType: resized.mimeType,
          data: resized.data
        };
      } else {
        attachment = {
          type: "image",
          mimeType,
          data: base64Content
        };
      }
      images.push(attachment);
      if (dimensionNote) {
        text += `<file name="${absolutePath}">${dimensionNote}</file>
`;
      } else {
        text += `<file name="${absolutePath}"></file>
`;
      }
    } else {
      try {
        const content = await readFile(absolutePath, "utf-8");
        text += `<file name="${absolutePath}">
${content}
</file>
`;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(source_default.red(`Error: Could not read file ${absolutePath}: ${message}`));
        process.exit(1);
      }
    }
  }
  return { text, images };
}

// dist/cli/initial-message.js
function buildInitialMessage({ parsed, fileText, fileImages, stdinContent }) {
  const parts = [];
  if (stdinContent !== void 0) {
    parts.push(stdinContent);
  }
  if (fileText) {
    parts.push(fileText);
  }
  if (parsed.messages.length > 0) {
    parts.push(parsed.messages[0]);
    parsed.messages.shift();
  }
  return {
    initialMessage: parts.length > 0 ? parts.join("") : void 0,
    initialImages: fileImages && fileImages.length > 0 ? fileImages : void 0
  };
}

// dist/cli/list-models.js
function formatTokenCount(count) {
  if (count >= 1e6) {
    const millions = count / 1e6;
    return millions % 1 === 0 ? `${millions}M` : `${millions.toFixed(1)}M`;
  }
  if (count >= 1e3) {
    const thousands = count / 1e3;
    return thousands % 1 === 0 ? `${thousands}K` : `${thousands.toFixed(1)}K`;
  }
  return count.toString();
}
async function listModels(modelRegistry, searchPattern) {
  const loadError = modelRegistry.getError();
  if (loadError) {
    console.error(source_default.yellow(`Warning: errors loading models.json:
${loadError}`));
  }
  const models = await modelRegistry.refreshAvailableModels();
  if (models.length === 0) {
    console.log(formatNoModelsAvailableMessage());
    return;
  }
  let filteredModels = models;
  if (searchPattern) {
    filteredModels = fuzzyFilter(models, searchPattern, (m) => `${m.provider} ${m.id}`);
  }
  if (filteredModels.length === 0) {
    console.log(`No models matching "${searchPattern}"`);
    return;
  }
  filteredModels.sort((a, b) => {
    const providerCmp = a.provider.localeCompare(b.provider);
    if (providerCmp !== 0)
      return providerCmp;
    return a.id.localeCompare(b.id);
  });
  const rows = filteredModels.map((m) => ({
    provider: m.provider,
    model: m.id,
    context: formatTokenCount(m.contextWindow),
    maxOut: formatTokenCount(m.maxTokens),
    thinking: m.reasoning ? "yes" : "no",
    images: m.input.includes("image") ? "yes" : "no"
  }));
  const headers = {
    provider: "provider",
    model: "model",
    context: "context",
    maxOut: "max-out",
    thinking: "thinking",
    images: "images"
  };
  const widths = {
    provider: Math.max(headers.provider.length, ...rows.map((r) => r.provider.length)),
    model: Math.max(headers.model.length, ...rows.map((r) => r.model.length)),
    context: Math.max(headers.context.length, ...rows.map((r) => r.context.length)),
    maxOut: Math.max(headers.maxOut.length, ...rows.map((r) => r.maxOut.length)),
    thinking: Math.max(headers.thinking.length, ...rows.map((r) => r.thinking.length)),
    images: Math.max(headers.images.length, ...rows.map((r) => r.images.length))
  };
  const headerLine = [
    headers.provider.padEnd(widths.provider),
    headers.model.padEnd(widths.model),
    headers.context.padEnd(widths.context),
    headers.maxOut.padEnd(widths.maxOut),
    headers.thinking.padEnd(widths.thinking),
    headers.images.padEnd(widths.images)
  ].join("  ");
  console.log(headerLine);
  for (const row of rows) {
    const line = [
      row.provider.padEnd(widths.provider),
      row.model.padEnd(widths.model),
      row.context.padEnd(widths.context),
      row.maxOut.padEnd(widths.maxOut),
      row.thinking.padEnd(widths.thinking),
      row.images.padEnd(widths.images)
    ].join("  ");
    console.log(line);
  }
}

// dist/package-manager-cli.js
import { spawn } from "child_process";
import { readFileSync, rmSync, statSync } from "fs";
import { resolve as resolve2, sep } from "path";

// dist/modes/interactive/components/config-selector.js
import { basename, dirname, join, relative } from "node:path";
var RESOURCE_TYPE_LABELS = {
  extensions: "Extensions",
  skills: "Skills",
  prompts: "Prompts",
  themes: "Themes"
};
function getGroupLabel(metadata) {
  if (metadata.origin === "package") {
    return `${metadata.source} (${metadata.scope})`;
  }
  if (metadata.source === "builtin") {
    return "Built-in";
  }
  if (metadata.source === "auto") {
    return metadata.scope === "user" ? `User (~/${CONFIG_DIR_NAME}/)` : `Project (${CONFIG_DIR_NAME}/)`;
  }
  return metadata.scope === "user" ? "User settings" : "Project settings";
}
function buildGroups(resolved) {
  const groupMap = /* @__PURE__ */ new Map();
  const addToGroup = (resources, resourceType) => {
    for (const res of resources) {
      const { path, enabled, metadata } = res;
      const groupKey = `${metadata.origin}:${metadata.scope}:${metadata.source}`;
      if (!groupMap.has(groupKey)) {
        groupMap.set(groupKey, {
          key: groupKey,
          label: getGroupLabel(metadata),
          scope: metadata.scope,
          origin: metadata.origin,
          source: metadata.source,
          subgroups: []
        });
      }
      const group = groupMap.get(groupKey);
      const subgroupKey = `${groupKey}:${resourceType}`;
      let subgroup = group.subgroups.find((sg) => sg.type === resourceType);
      if (!subgroup) {
        subgroup = {
          type: resourceType,
          label: RESOURCE_TYPE_LABELS[resourceType],
          items: []
        };
        group.subgroups.push(subgroup);
      }
      const fileName = basename(path);
      const parentFolder = basename(dirname(path));
      let displayName;
      if (resourceType === "extensions" && parentFolder !== "extensions") {
        displayName = `${parentFolder}/${fileName}`;
      } else if (resourceType === "skills" && fileName === "SKILL.md") {
        displayName = parentFolder;
      } else {
        displayName = fileName;
      }
      subgroup.items.push({
        path,
        enabled,
        metadata,
        resourceType,
        displayName,
        groupKey,
        subgroupKey
      });
    }
  };
  addToGroup(resolved.extensions, "extensions");
  addToGroup(resolved.skills, "skills");
  addToGroup(resolved.prompts, "prompts");
  addToGroup(resolved.themes, "themes");
  const groups = Array.from(groupMap.values());
  groups.sort((a, b) => {
    if (a.origin !== b.origin) {
      return a.origin === "package" ? -1 : 1;
    }
    if (a.scope !== b.scope) {
      return a.scope === "user" ? -1 : 1;
    }
    return a.source.localeCompare(b.source);
  });
  const typeOrder = { extensions: 0, skills: 1, prompts: 2, themes: 3 };
  for (const group of groups) {
    group.subgroups.sort((a, b) => typeOrder[a.type] - typeOrder[b.type]);
    for (const subgroup of group.subgroups) {
      subgroup.items.sort((a, b) => a.displayName.localeCompare(b.displayName));
    }
  }
  return groups;
}
var ConfigSelectorHeader = class {
  invalidate() {
  }
  render(width) {
    const title = theme.bold("Resource Configuration");
    const sep2 = theme.fg("muted", " \xB7 ");
    const hint = rawKeyHint("space", "toggle") + sep2 + rawKeyHint("esc", "close");
    const hintWidth = visibleWidth(hint);
    const titleWidth = visibleWidth(title);
    const spacing = Math.max(1, width - titleWidth - hintWidth);
    return [
      truncateToWidth(`${title}${" ".repeat(spacing)}${hint}`, width, ""),
      theme.fg("muted", "Type to filter resources")
    ];
  }
};
var ResourceList = class {
  get focused() {
    return this._focused;
  }
  set focused(value) {
    this._focused = value;
    this.searchInput.focused = value;
  }
  constructor(groups, settingsManager, cwd, agentDir) {
    this.flatItems = [];
    this.filteredItems = [];
    this.selectedIndex = 0;
    this.maxVisible = 15;
    this._focused = false;
    this.groups = groups;
    this.settingsManager = settingsManager;
    this.cwd = cwd;
    this.agentDir = agentDir;
    this.searchInput = new Input();
    this.buildFlatList();
    this.filteredItems = [...this.flatItems];
  }
  buildFlatList() {
    this.flatItems = [];
    for (const group of this.groups) {
      this.flatItems.push({ type: "group", group });
      for (const subgroup of group.subgroups) {
        this.flatItems.push({ type: "subgroup", subgroup, group });
        for (const item of subgroup.items) {
          this.flatItems.push({ type: "item", item });
        }
      }
    }
    this.selectedIndex = this.flatItems.findIndex((e) => e.type === "item");
    if (this.selectedIndex < 0)
      this.selectedIndex = 0;
  }
  findNextItem(fromIndex, direction) {
    let idx = fromIndex + direction;
    while (idx >= 0 && idx < this.filteredItems.length) {
      if (this.filteredItems[idx].type === "item") {
        return idx;
      }
      idx += direction;
    }
    return fromIndex;
  }
  filterItems(query) {
    if (!query.trim()) {
      this.filteredItems = [...this.flatItems];
      this.selectFirstItem();
      return;
    }
    const lowerQuery = query.toLowerCase();
    const matchingItems = /* @__PURE__ */ new Set();
    const matchingSubgroups = /* @__PURE__ */ new Set();
    const matchingGroups = /* @__PURE__ */ new Set();
    for (const entry of this.flatItems) {
      if (entry.type === "item") {
        const item = entry.item;
        if (item.displayName.toLowerCase().includes(lowerQuery) || item.resourceType.toLowerCase().includes(lowerQuery) || item.path.toLowerCase().includes(lowerQuery)) {
          matchingItems.add(item);
        }
      }
    }
    for (const group of this.groups) {
      for (const subgroup of group.subgroups) {
        for (const item of subgroup.items) {
          if (matchingItems.has(item)) {
            matchingSubgroups.add(subgroup);
            matchingGroups.add(group);
          }
        }
      }
    }
    this.filteredItems = [];
    for (const entry of this.flatItems) {
      if (entry.type === "group" && matchingGroups.has(entry.group)) {
        this.filteredItems.push(entry);
      } else if (entry.type === "subgroup" && matchingSubgroups.has(entry.subgroup)) {
        this.filteredItems.push(entry);
      } else if (entry.type === "item" && matchingItems.has(entry.item)) {
        this.filteredItems.push(entry);
      }
    }
    this.selectFirstItem();
  }
  selectFirstItem() {
    const firstItemIndex = this.filteredItems.findIndex((e) => e.type === "item");
    this.selectedIndex = firstItemIndex >= 0 ? firstItemIndex : 0;
  }
  updateItem(item, enabled) {
    item.enabled = enabled;
    for (const group of this.groups) {
      for (const subgroup of group.subgroups) {
        const found = subgroup.items.find((i) => i.path === item.path && i.resourceType === item.resourceType);
        if (found) {
          found.enabled = enabled;
          return;
        }
      }
    }
  }
  invalidate() {
  }
  render(width) {
    const lines = [];
    lines.push(...this.searchInput.render(width));
    lines.push("");
    if (this.filteredItems.length === 0) {
      lines.push(theme.fg("muted", "  No resources found"));
      return lines;
    }
    const startIndex = Math.max(0, Math.min(this.selectedIndex - Math.floor(this.maxVisible / 2), this.filteredItems.length - this.maxVisible));
    const endIndex = Math.min(startIndex + this.maxVisible, this.filteredItems.length);
    for (let i = startIndex; i < endIndex; i++) {
      const entry = this.filteredItems[i];
      const isSelected = i === this.selectedIndex;
      if (entry.type === "group") {
        const groupLine = theme.fg("accent", theme.bold(entry.group.label));
        lines.push(truncateToWidth(`  ${groupLine}`, width, ""));
      } else if (entry.type === "subgroup") {
        const subgroupLine = theme.fg("muted", entry.subgroup.label);
        lines.push(truncateToWidth(`    ${subgroupLine}`, width, ""));
      } else {
        const item = entry.item;
        const cursor = isSelected ? "> " : "  ";
        const checkbox = item.enabled ? theme.fg("success", "[x]") : theme.fg("dim", "[ ]");
        const name = isSelected ? theme.bold(item.displayName) : item.displayName;
        lines.push(truncateToWidth(`${cursor}    ${checkbox} ${name}`, width, "..."));
      }
    }
    if (startIndex > 0 || endIndex < this.filteredItems.length) {
      const itemCount = this.filteredItems.filter((e) => e.type === "item").length;
      const currentItemIndex = this.filteredItems.slice(0, this.selectedIndex).filter((e) => e.type === "item").length + 1;
      lines.push(theme.fg("dim", `  (${currentItemIndex}/${itemCount})`));
    }
    return lines;
  }
  handleInput(data) {
    const kb = getKeybindings();
    if (kb.matches(data, "tui.select.up")) {
      this.selectedIndex = this.findNextItem(this.selectedIndex, -1);
      return;
    }
    if (kb.matches(data, "tui.select.down")) {
      this.selectedIndex = this.findNextItem(this.selectedIndex, 1);
      return;
    }
    if (kb.matches(data, "tui.select.pageUp")) {
      let target = Math.max(0, this.selectedIndex - this.maxVisible);
      while (target < this.filteredItems.length && this.filteredItems[target].type !== "item") {
        target++;
      }
      if (target < this.filteredItems.length) {
        this.selectedIndex = target;
      }
      return;
    }
    if (kb.matches(data, "tui.select.pageDown")) {
      let target = Math.min(this.filteredItems.length - 1, this.selectedIndex + this.maxVisible);
      while (target >= 0 && this.filteredItems[target].type !== "item") {
        target--;
      }
      if (target >= 0) {
        this.selectedIndex = target;
      }
      return;
    }
    if (kb.matches(data, "tui.select.cancel")) {
      this.onCancel?.();
      return;
    }
    if (matchesKey(data, "ctrl+c")) {
      this.onExit?.();
      return;
    }
    if (data === " " || kb.matches(data, "tui.select.confirm")) {
      const entry = this.filteredItems[this.selectedIndex];
      if (entry?.type === "item") {
        const newEnabled = !entry.item.enabled;
        this.toggleResource(entry.item, newEnabled);
        this.updateItem(entry.item, newEnabled);
        this.onToggle?.(entry.item, newEnabled);
      }
      return;
    }
    this.searchInput.handleInput(data);
    this.filterItems(this.searchInput.getValue());
  }
  toggleResource(item, enabled) {
    if (item.metadata.origin === "top-level") {
      this.toggleTopLevelResource(item, enabled);
    } else {
      this.togglePackageResource(item, enabled);
    }
  }
  toggleTopLevelResource(item, enabled) {
    const scope = item.metadata.scope;
    const settings = scope === "project" ? this.settingsManager.getProjectSettings() : this.settingsManager.getGlobalSettings();
    const arrayKey = item.resourceType;
    const current = settings[arrayKey] ?? [];
    const pattern = this.getResourcePattern(item);
    const disablePattern = `-${pattern}`;
    const enablePattern = `+${pattern}`;
    const updated = current.filter((p) => {
      const stripped = p.startsWith("!") || p.startsWith("+") || p.startsWith("-") ? p.slice(1) : p;
      return stripped !== pattern;
    });
    if (enabled) {
      updated.push(enablePattern);
    } else {
      updated.push(disablePattern);
    }
    if (scope === "project") {
      if (arrayKey === "extensions") {
        this.settingsManager.setProjectExtensionPaths(updated);
      } else if (arrayKey === "skills") {
        this.settingsManager.setProjectSkillPaths(updated);
      } else if (arrayKey === "prompts") {
        this.settingsManager.setProjectPromptTemplatePaths(updated);
      } else if (arrayKey === "themes") {
        this.settingsManager.setProjectThemePaths(updated);
      }
    } else {
      if (arrayKey === "extensions") {
        this.settingsManager.setExtensionPaths(updated);
      } else if (arrayKey === "skills") {
        this.settingsManager.setSkillPaths(updated);
      } else if (arrayKey === "prompts") {
        this.settingsManager.setPromptTemplatePaths(updated);
      } else if (arrayKey === "themes") {
        this.settingsManager.setThemePaths(updated);
      }
    }
  }
  togglePackageResource(item, enabled) {
    const scope = item.metadata.scope;
    const settings = scope === "project" ? this.settingsManager.getProjectSettings() : this.settingsManager.getGlobalSettings();
    const packages = [...settings.packages ?? []];
    const pkgIndex = packages.findIndex((pkg2) => {
      const source = typeof pkg2 === "string" ? pkg2 : pkg2.source;
      return source === item.metadata.source;
    });
    if (pkgIndex === -1)
      return;
    let pkg = packages[pkgIndex];
    if (typeof pkg === "string") {
      pkg = { source: pkg };
      packages[pkgIndex] = pkg;
    }
    const arrayKey = item.resourceType;
    const current = pkg[arrayKey] ?? [];
    const pattern = this.getPackageResourcePattern(item);
    const disablePattern = `-${pattern}`;
    const enablePattern = `+${pattern}`;
    const updated = current.filter((p) => {
      const stripped = p.startsWith("!") || p.startsWith("+") || p.startsWith("-") ? p.slice(1) : p;
      return stripped !== pattern;
    });
    if (enabled) {
      updated.push(enablePattern);
    } else {
      updated.push(disablePattern);
    }
    pkg[arrayKey] = updated.length > 0 ? updated : void 0;
    const hasFilters = ["extensions", "skills", "prompts", "themes"].some((k) => pkg[k] !== void 0);
    if (!hasFilters) {
      packages[pkgIndex] = pkg.source;
    }
    if (scope === "project") {
      this.settingsManager.setProjectPackages(packages);
    } else {
      this.settingsManager.setPackages(packages);
    }
  }
  getTopLevelBaseDir(scope) {
    return scope === "project" ? join(this.cwd, CONFIG_DIR_NAME) : this.agentDir;
  }
  getResourcePattern(item) {
    if (item.metadata.source === "builtin" && item.metadata.baseDir) {
      return relative(item.metadata.baseDir, item.path);
    }
    const scope = item.metadata.scope;
    const baseDir = this.getTopLevelBaseDir(scope);
    return relative(baseDir, item.path);
  }
  getPackageResourcePattern(item) {
    const baseDir = item.metadata.baseDir ?? dirname(item.path);
    return relative(baseDir, item.path);
  }
};
var ConfigSelectorComponent = class extends Container {
  get focused() {
    return this._focused;
  }
  set focused(value) {
    this._focused = value;
    this.resourceList.focused = value;
  }
  constructor(resolvedPaths, settingsManager, cwd, agentDir, onClose, onExit, requestRender) {
    super();
    this._focused = false;
    const groups = buildGroups(resolvedPaths);
    this.addChild(new Spacer(1));
    this.addChild(new DynamicBorder());
    this.addChild(new Spacer(1));
    this.addChild(new ConfigSelectorHeader());
    this.addChild(new Spacer(1));
    this.resourceList = new ResourceList(groups, settingsManager, cwd, agentDir);
    this.resourceList.onCancel = onClose;
    this.resourceList.onExit = onExit;
    this.resourceList.onToggle = () => requestRender();
    this.addChild(this.resourceList);
    this.addChild(new Spacer(1));
    this.addChild(new DynamicBorder());
  }
  getResourceList() {
    return this.resourceList;
  }
};

// dist/cli/config-selector.js
async function selectConfig(options) {
  initTheme(options.settingsManager.getTheme(), true);
  return new Promise((resolve6) => {
    const ui = new TUI(new ProcessTerminal());
    let resolved = false;
    const selector = new ConfigSelectorComponent(options.resolvedPaths, options.settingsManager, options.cwd, options.agentDir, () => {
      if (!resolved) {
        resolved = true;
        ui.stop();
        stopThemeWatcher();
        resolve6();
      }
    }, () => {
      ui.stop();
      stopThemeWatcher();
      process.exit(0);
    }, () => ui.requestRender());
    ui.addChild(selector);
    ui.setFocus(selector.getResourceList());
    ui.start();
  });
}

// dist/package-manager-cli.js
var UPDATE_RESTART_PREDECESSOR_FENCE_TIMEOUT_MS = 6e4;
function isSelfUpdateSource(source) {
  return source === "self" || source === "pi" || source === APP_NAME;
}
function reportSettingsErrors(settingsManager, context2) {
  const errors = settingsManager.drainErrors();
  for (const { scope, error } of errors) {
    console.error(source_default.yellow(`Warning (${context2}, ${scope} settings): ${error.message}`));
    if (error.stack) {
      console.error(source_default.dim(error.stack));
    }
  }
}
function getPackageCommandUsage(command) {
  switch (command) {
    case "install":
      return `${APP_NAME} package install <source> [--local]`;
    case "remove":
      return `${APP_NAME} package remove <source> [--local]`;
    case "update":
      return `${APP_NAME} update [--force] or ${APP_NAME} package update [source]`;
    case "list":
      return `${APP_NAME} package list`;
  }
}
function printPackageCommandHelp(command) {
  switch (command) {
    case "install":
      console.log(`${source_default.bold("Usage:")}
  ${getPackageCommandUsage("install")}

Install a package and add it to settings.

Options:
  --local    Install project-locally (${CONFIG_DIR_NAME}/settings.json)

Examples:
  ${APP_NAME} package install npm:@foo/bar
  ${APP_NAME} package install git:github.com/user/repo
  ${APP_NAME} package install git:git@github.com:user/repo
  ${APP_NAME} package install https://github.com/user/repo
  ${APP_NAME} package install ssh://git@github.com/user/repo
  ${APP_NAME} package install ./local/path
`);
      return;
    case "remove":
      console.log(`${source_default.bold("Usage:")}
  ${getPackageCommandUsage("remove")}

Remove a package and its source from settings.

Options:
  --local    Remove from project settings (${CONFIG_DIR_NAME}/settings.json)

Examples:
  ${APP_NAME} package remove npm:@foo/bar
`);
      return;
    case "update":
      console.log(`${source_default.bold("Usage:")}
  ${getPackageCommandUsage("update")}

Update ${APP_NAME} or installed packages.

Options:
  --self                  Update ${APP_NAME} only
  --extensions            Update installed packages only
  --extension <source>    Update one package only
  --force                 Reinstall ${APP_NAME} even if the current version is latest
  --daemon-socket <path>  Restart the daemon listening on this exact socket

Commands:
  ${APP_NAME} update                Update ${APP_NAME}
  ${APP_NAME} package update        Update installed packages
  ${APP_NAME} package update <source> Update one package
`);
      return;
    case "list":
      console.log(`${source_default.bold("Usage:")}
  ${getPackageCommandUsage("list")}

List installed packages from user and project settings.
`);
      return;
  }
}
function parsePackageCommand(args) {
  const [rawCommand, ...rest] = args;
  let command;
  if (rawCommand === "uninstall") {
    command = "remove";
  } else if (rawCommand === "install" || rawCommand === "remove" || rawCommand === "update" || rawCommand === "list") {
    command = rawCommand;
  }
  if (!command) {
    return void 0;
  }
  let local = false;
  let force = false;
  let help = false;
  let invalidOption;
  let invalidArgument;
  let missingOptionValue;
  let conflictingOptions;
  let source;
  let selfFlag = false;
  let extensionsFlag = false;
  let extensionFlagSource;
  let daemonSocketPath;
  let restartCoordinator = false;
  let restartStatusPath;
  let restartOriginActiveSessionId;
  for (let index = 0; index < rest.length; index++) {
    const arg = rest[index];
    if (arg === "-h" || arg === "--help") {
      help = true;
      continue;
    }
    if (arg === "--local") {
      if (command === "install" || command === "remove") {
        local = true;
      } else {
        invalidOption = invalidOption ?? arg;
      }
      continue;
    }
    if (arg === "--self") {
      if (command === "update") {
        selfFlag = true;
      } else {
        invalidOption = invalidOption ?? arg;
      }
      continue;
    }
    if (arg === "--extensions") {
      if (command === "update") {
        extensionsFlag = true;
      } else {
        invalidOption = invalidOption ?? arg;
      }
      continue;
    }
    if (arg === "--force") {
      if (command === "update") {
        force = true;
      } else {
        invalidOption = invalidOption ?? arg;
      }
      continue;
    }
    if (arg === "--daemon-socket") {
      if (command !== "update") {
        invalidOption = invalidOption ?? arg;
        continue;
      }
      const value = rest[index + 1];
      if (!value || value.startsWith("-")) {
        missingOptionValue = missingOptionValue ?? arg;
      } else if (daemonSocketPath) {
        conflictingOptions = conflictingOptions ?? "--daemon-socket can only be provided once";
        index++;
      } else {
        daemonSocketPath = value;
        index++;
      }
      continue;
    }
    if (arg === DAEMON_UPDATE_RESTART_COORDINATOR_FLAG) {
      if (command === "update") {
        restartCoordinator = true;
      } else {
        invalidOption = invalidOption ?? arg;
      }
      continue;
    }
    if (arg === DAEMON_UPDATE_RESTART_STATUS_FLAG || arg === DAEMON_UPDATE_RESTART_ORIGIN_FLAG) {
      if (command !== "update") {
        invalidOption = invalidOption ?? arg;
        continue;
      }
      const value = rest[index + 1];
      if (!value || value.startsWith("-")) {
        missingOptionValue = missingOptionValue ?? arg;
        continue;
      }
      if (arg === DAEMON_UPDATE_RESTART_STATUS_FLAG) {
        restartStatusPath = value;
      } else {
        restartOriginActiveSessionId = value;
      }
      index++;
      continue;
    }
    if (arg === "--extension") {
      if (command !== "update") {
        invalidOption = invalidOption ?? arg;
        continue;
      }
      const value = rest[index + 1];
      if (!value || value.startsWith("-")) {
        missingOptionValue = missingOptionValue ?? arg;
      } else if (extensionFlagSource) {
        conflictingOptions = conflictingOptions ?? "--extension can only be provided once";
        index++;
      } else {
        extensionFlagSource = value;
        index++;
      }
      continue;
    }
    if (arg.startsWith("-")) {
      invalidOption = invalidOption ?? arg;
      continue;
    }
    if (!source) {
      source = arg;
    } else {
      invalidArgument = invalidArgument ?? arg;
    }
  }
  let updateTarget;
  if (command === "update") {
    if (extensionFlagSource) {
      if (selfFlag || extensionsFlag) {
        conflictingOptions = conflictingOptions ?? "--extension cannot be combined with --self or --extensions";
      }
      if (source) {
        conflictingOptions = conflictingOptions ?? "--extension cannot be combined with a positional source";
      }
      updateTarget = { type: "extensions", source: extensionFlagSource };
    } else if (source) {
      const sourceIsSelf = isSelfUpdateSource(source);
      if (sourceIsSelf) {
        updateTarget = extensionsFlag ? { type: "all" } : { type: "self" };
      } else {
        if (extensionsFlag || selfFlag) {
          conflictingOptions = conflictingOptions ?? "positional update targets cannot be combined with --self or --extensions";
        }
        updateTarget = { type: "extensions", source };
      }
    } else if (selfFlag && extensionsFlag) {
      updateTarget = { type: "all" };
    } else if (selfFlag) {
      updateTarget = { type: "self" };
    } else if (extensionsFlag) {
      updateTarget = { type: "extensions" };
    } else {
      updateTarget = { type: "all" };
    }
  }
  return {
    command,
    source,
    updateTarget,
    local,
    force,
    help,
    daemonSocketPath,
    restartCoordinator,
    restartStatusPath,
    restartOriginActiveSessionId,
    invalidOption,
    invalidArgument,
    missingOptionValue,
    conflictingOptions
  };
}
function updateTargetIncludesSelf(target) {
  return target.type === "all" || target.type === "self";
}
function updateTargetIncludesExtensions(target) {
  return target.type === "all" || target.type === "extensions";
}
function resolveUpdateDaemonSocketPath(explicitSocketPath) {
  return explicitSocketPath ?? process.env[DAEMON_WORKER_SUPERVISOR_SOCKET_ENV] ?? defaultDaemonSocketPath();
}
function reportDaemonUpdateRestartStatus(status) {
  const report = buildDaemonUpdateRestartReport(status);
  for (const message of report.info) {
    console.log(source_default.green(message));
  }
  for (const warning of report.warnings) {
    console.error(source_default.yellow(`Warning: ${warning}`));
  }
}
function printSelfUpdateUnavailable(npmCommand, updateSpec = PACKAGE_NAME, updatePackageName = updateSpec) {
  console.error(`error: ${APP_NAME} cannot self-update this installation.`);
  console.error(getSelfUpdateUnavailableInstruction(PACKAGE_NAME, npmCommand, updateSpec, updatePackageName));
  const entrypoint = process.argv[1];
  if (entrypoint) {
    console.error("");
    console.error(`Location of pi executable: ${entrypoint}`);
  }
}
function printSelfUpdateFallback(command) {
  console.error(source_default.dim(`If this keeps failing, run this command yourself: ${command.display}`));
}
function setSelfUpdateNoChangeExitCode() {
  process.exitCode = process.env[SELF_UPDATE_INTERACTIVE_CHILD_ENV] === "1" ? SELF_UPDATE_NOT_ATTEMPTED_EXIT_CODE : void 0;
}
async function getSelfUpdatePlan(force) {
  try {
    const latestRelease = await getLatestPiRelease(VERSION);
    const packageName = latestRelease?.packageName ?? PACKAGE_NAME;
    const installSpec = latestRelease?.installSpec ?? packageName;
    const packageRenameRequiresUpdate = !latestRelease?.installSpec && packageName !== PACKAGE_NAME;
    if (force || !latestRelease || packageRenameRequiresUpdate || isNewerPackageVersion(latestRelease.version, VERSION)) {
      return { installSpec, packageName, shouldRun: true, targetVersion: latestRelease?.version };
    }
  } catch {
    return { installSpec: PACKAGE_NAME, packageName: PACKAGE_NAME, shouldRun: true };
  }
  console.log(source_default.green(`${APP_NAME} is already up to date (v${VERSION})`));
  return { installSpec: PACKAGE_NAME, packageName: PACKAGE_NAME, shouldRun: false };
}
async function runSelfUpdate(command) {
  console.log(source_default.dim(`Updating ${APP_NAME} with ${command.display}...`));
  for (const step of command.steps ?? [command]) {
    await new Promise((resolve6, reject) => {
      const child = spawn(step.command, step.args, {
        stdio: "inherit",
        shell: shouldUseWindowsShell(step.command)
      });
      child.on("error", (error) => {
        reject(error);
      });
      child.on("close", (code, signal) => {
        if (code === 0) {
          resolve6();
        } else if (signal) {
          reject(new Error(`${step.display} terminated by signal ${signal}`));
        } else {
          reject(new Error(`${step.display} exited with code ${code ?? "unknown"}`));
        }
      });
    });
  }
}
var UPDATE_RESTART_CONTINUATION_PROMPT = "Prime Agent restarted after an update. Continue the interrupted task from the saved transcript and restored tool/kernel state. Inspect current state before retrying commands when needed.";
var UPDATE_SESSION_LOSS_COPY = {
  busyDetail(count) {
    const { noun, pronoun } = pluralizeSessions(count);
    return `Prime Agent has ${count} busy ${noun}. After the update installs, it will stop ${pronoun}, restart its background service, and resume interrupted work.`;
  },
  unlistableDetail: "Running agents could not be listed. After the update installs, Prime Agent will stop resident agents, restart its background service, and resume interrupted work where possible.",
  question: "Continue?",
  nonTtyHint: "Re-run with --force to proceed."
};
function confirmDaemonSessionLossBeforeUpdate(probe, force) {
  return confirmDaemonSessionLoss(probe, { force, copy: UPDATE_SESSION_LOSS_COPY });
}
function daemonProbeMayHaveBusySessions(probe) {
  return probe.reachable && (probe.activeSessions === void 0 || (probe.busyClientOwnedSessionCount ?? 0) > 0 || probe.activeSessions.some(isSessionBusy));
}
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isStringEnum(value, allowed) {
  return typeof value === "string" && allowed.includes(value);
}
function readString(value, fieldName) {
  if (typeof value !== "string") {
    throw new Error(`Daemon update restart response is missing ${fieldName}`);
  }
  return value;
}
function readOptionalString(value, fieldName) {
  if (value === void 0) {
    return void 0;
  }
  if (typeof value !== "string") {
    throw new Error(`Daemon update restart response is missing ${fieldName}`);
  }
  return value;
}
function readBoolean(value, fieldName) {
  if (typeof value !== "boolean") {
    throw new Error(`Daemon update restart response is missing ${fieldName}`);
  }
  return value;
}
function readNumber(value, fieldName) {
  if (typeof value !== "number") {
    throw new Error(`Daemon update restart response is missing ${fieldName}`);
  }
  return value;
}
function readOptionalStringRecord(value, fieldName) {
  if (value === void 0) {
    return void 0;
  }
  if (!isRecord(value) || !Object.values(value).every((entry) => typeof entry === "string")) {
    throw new Error(`Daemon update restart response is missing ${fieldName}`);
  }
  return value;
}
function isMessageContentBlock(value) {
  return isRecord(value) && (value.type === "text" && typeof value.text === "string" || value.type === "image" && typeof value.data === "string" && typeof value.mimeType === "string");
}
function isImageContent(value) {
  return isMessageContentBlock(value) && value.type === "image";
}
function isCustomMessage(value) {
  return isRecord(value) && value.role === "custom" && typeof value.customType === "string" && (typeof value.content === "string" || Array.isArray(value.content) && value.content.every(isMessageContentBlock)) && typeof value.display === "boolean" && typeof value.timestamp === "number";
}
function isUserMessage(value) {
  return isRecord(value) && value.role === "user" && (typeof value.content === "string" || Array.isArray(value.content) && value.content.every(isMessageContentBlock)) && typeof value.timestamp === "number";
}
function isQueuedAgentMessage(value) {
  return isUserMessage(value) || isCustomMessage(value);
}
function readCustomMessages(value, fieldName) {
  if (value === void 0)
    return [];
  if (!Array.isArray(value) || !value.every(isCustomMessage)) {
    throw new Error(`Daemon update restart response is missing ${fieldName}`);
  }
  return value;
}
function isSessionActionRecoveryAction(value) {
  if (!isRecord(value) || typeof value.id !== "string" || typeof value.source !== "string" || value.delivery !== "next_turn_boundary" && value.delivery !== "when_run_idle" || value.wake !== "immediate" && value.wake !== "on_lower_boundary" && value.wake !== "external_resume" || !isRecord(value.payload) || typeof value.payload.text !== "string" || value.payload.images !== void 0 && (!Array.isArray(value.payload.images) || !value.payload.images.every(isImageContent))) {
    return false;
  }
  if (value.payload.kind === "session_command")
    return isSessionSlashCommand(value.payload.command);
  return value.payload.kind === "turn" && Array.isArray(value.payload.records) && value.payload.records.filter((record) => isRecord(record) && record.role === "primary").length === 1 && value.payload.records.every((record) => isRecord(record) && typeof record.id === "string" && (record.role === "primary" || record.role === "prefix" || record.role === "next_turn") && record.ownerActionId === value.id && isQueuedAgentMessage(record.message)) && (value.payload.content === void 0 || Array.isArray(value.payload.content) && value.payload.content.every(isMessageContentBlock)) && (value.payload.customMessage === void 0 || isCustomMessage(value.payload.customMessage)) && isRecord(value.payload.executionPolicy) && isRecord(value.payload.executionPolicy.preparation) && isStringEnum(value.payload.executionPolicy.preparation.initialRefineBarrier, ["always", "ifInFlight", "skip"]) && typeof value.payload.executionPolicy.preparation.flushPendingBashBeforeValidation === "boolean" && typeof value.payload.executionPolicy.preparation.validateModelAndAuth === "boolean" && typeof value.payload.executionPolicy.preparation.awaitPendingModelSelection === "boolean" && isStringEnum(value.payload.executionPolicy.preparation.preTurnCompaction, [
    "beforeModelSelection",
    "afterModelSelection",
    "skip"
  ]) && isStringEnum(value.payload.executionPolicy.preparation.finalRefineBarrier, ["always", "ifInFlight", "skip"]) && typeof value.payload.executionPolicy.runBeforeAgentStart === "boolean" && isStringEnum(value.payload.executionPolicy.nextTurnContextTiming, ["preparation", "commit", "skip"]) && typeof value.payload.executionPolicy.preserveEmptyExtensionPrompt === "boolean" && typeof value.payload.executionPolicy.completionIncludesRetryChain === "boolean" && typeof value.payload.queueVisible === "boolean" && typeof value.payload.acceptedAgentMessage === "boolean" && typeof value.payload.acceptedBeforeCompletion === "boolean";
}
function parseSessionActionRecoverySnapshot(value) {
  if (!isRecord(value))
    throw new Error("Daemon update restart response contains invalid session actions");
  if (value.formatVersion !== SESSION_ACTION_RECOVERY_FORMAT_VERSION) {
    throw new Error(`Unsupported session action recovery format version: ${String(value.formatVersion)}`);
  }
  if (!Array.isArray(value.actions) || !value.actions.every(isSessionActionRecoveryAction)) {
    throw new Error("Daemon update restart response is missing session actions");
  }
  return {
    formatVersion: SESSION_ACTION_RECOVERY_FORMAT_VERSION,
    actions: value.actions
  };
}
function parseDaemonUpdateRestartRuntimeMetadata(value) {
  if (value === void 0) {
    return void 0;
  }
  if (!isRecord(value)) {
    throw new Error("Daemon update restart response contains invalid runtime metadata");
  }
  const kind = readString(value.kind, "runtimeMetadata.kind");
  if (kind !== "top-level" && kind !== "subagent") {
    throw new Error("Daemon update restart response contains invalid runtime metadata kind");
  }
  const parentActiveSessionId = readOptionalString(value.parentActiveSessionId, "runtimeMetadata.parentActiveSessionId");
  const parentSessionId = readOptionalString(value.parentSessionId, "runtimeMetadata.parentSessionId");
  const parentSessionFile = readOptionalString(value.parentSessionFile, "runtimeMetadata.parentSessionFile");
  const rlmChildId = readOptionalString(value.rlmChildId, "runtimeMetadata.rlmChildId");
  const rlmParentNodeId = readOptionalString(value.rlmParentNodeId, "runtimeMetadata.rlmParentNodeId");
  const prompt = readOptionalString(value.prompt, "runtimeMetadata.prompt");
  const spawnCode = readOptionalString(value.spawnCode, "runtimeMetadata.spawnCode");
  const sessionDir = readOptionalString(value.sessionDir, "runtimeMetadata.sessionDir");
  return {
    kind,
    createdAt: readNumber(value.createdAt, "runtimeMetadata.createdAt"),
    ...parentActiveSessionId ? { parentActiveSessionId } : {},
    ...parentSessionId ? { parentSessionId } : {},
    ...parentSessionFile ? { parentSessionFile } : {},
    ...rlmChildId ? { rlmChildId } : {},
    ...rlmParentNodeId ? { rlmParentNodeId } : {},
    ...prompt ? { prompt } : {},
    ...spawnCode ? { spawnCode } : {},
    ...sessionDir ? { sessionDir } : {}
  };
}
function parseDaemonUpdateRestartSession(value) {
  if (!isRecord(value)) {
    throw new Error("Daemon update restart response contains an invalid session");
  }
  const queue = value.queue;
  if (!isRecord(queue)) {
    throw new Error("Daemon update restart response contains an invalid queue");
  }
  const config = value.config;
  if (!isRecord(config)) {
    throw new Error("Daemon update restart response contains an invalid session config");
  }
  const clientEnv = readOptionalStringRecord(value.clientEnv, "clientEnv");
  const runtimeMetadata = parseDaemonUpdateRestartRuntimeMetadata(value.runtimeMetadata);
  return {
    activeSessionId: readString(value.activeSessionId, "activeSessionId"),
    sessionId: readString(value.sessionId, "sessionId"),
    sessionFile: readString(value.sessionFile, "sessionFile"),
    cwd: readString(value.cwd, "cwd"),
    config,
    ...runtimeMetadata ? { runtimeMetadata } : {},
    ...clientEnv ? { clientEnv } : {},
    queue: {
      actions: parseSessionActionRecoverySnapshot(queue.actions),
      nextTurn: readCustomMessages(queue.nextTurn, "queue.nextTurn")
    },
    shouldResume: readBoolean(value.shouldResume, "shouldResume"),
    wasStreaming: readBoolean(value.wasStreaming, "wasStreaming"),
    wasCompacting: readBoolean(value.wasCompacting, "wasCompacting"),
    wasBashRunning: readBoolean(value.wasBashRunning, "wasBashRunning"),
    hadRunningRlmChildren: readBoolean(value.hadRunningRlmChildren, "hadRunningRlmChildren"),
    wasRetrying: readBoolean(value.wasRetrying, "wasRetrying"),
    hadAcceptedPromptInFlight: readBoolean(value.hadAcceptedPromptInFlight, "hadAcceptedPromptInFlight")
  };
}
function parseDaemonUpdateRestartManifest(value) {
  if (!isRecord(value)) {
    throw new Error("Daemon update restart response is invalid");
  }
  if (value.formatVersion !== DAEMON_UPDATE_RESTART_FORMAT_VERSION) {
    throw new Error(`Unsupported daemon update restart format version: ${String(value.formatVersion)}`);
  }
  const sessions = value.sessions;
  if (!Array.isArray(sessions)) {
    throw new Error("Daemon update restart response is missing sessions");
  }
  return {
    formatVersion: DAEMON_UPDATE_RESTART_FORMAT_VERSION,
    createdAt: readString(value.createdAt, "createdAt"),
    sessions: sessions.map(parseDaemonUpdateRestartSession)
  };
}
function clearPreparedDaemonUpdateRestartManifest(socketPath, agentDir) {
  for (const manifestPath of [
    getDaemonUpdateRestartManifestPath(socketPath, agentDir),
    getLegacyDaemonUpdateRestartManifestPath(agentDir)
  ]) {
    try {
      rmSync(manifestPath, { force: true });
    } catch {
    }
  }
}
function readPreparedDaemonUpdateRestartManifest(socketPath, agentDir, notBeforeMs) {
  for (const manifestPath of [
    getDaemonUpdateRestartManifestPath(socketPath, agentDir),
    getLegacyDaemonUpdateRestartManifestPath(agentDir)
  ]) {
    let modifiedAt;
    try {
      modifiedAt = statSync(manifestPath).mtimeMs;
    } catch {
      continue;
    }
    if (notBeforeMs !== void 0 && modifiedAt < notBeforeMs - 1e3) {
      continue;
    }
    const parsed = JSON.parse(readFileSync(manifestPath, "utf-8"));
    return parseDaemonUpdateRestartManifest(parsed);
  }
  return void 0;
}
function tryReadPreparedDaemonUpdateRestartManifest(socketPath, agentDir) {
  try {
    return readPreparedDaemonUpdateRestartManifest(socketPath, agentDir);
  } catch {
    clearPreparedDaemonUpdateRestartManifest(socketPath, agentDir);
    return void 0;
  }
}
function hasRestorableDaemonUpdateRestart(manifest) {
  return manifest !== void 0 && manifest.sessions.length > 0;
}
function responseHasActiveDaemonSessions(data) {
  if (!isRecord(data) || !Array.isArray(data.sessions)) {
    return true;
  }
  return data.sessions.length > 0;
}
function hasFixedDaemonSupervisorOwnerIdentity(value) {
  if (!isRecord(value)) {
    return false;
  }
  return typeof value.supervisorGeneration === "string" && typeof value.supervisorOwnerToken === "string" && Number.isInteger(value.supervisorPid) && value.supervisorPid > 0 && typeof value.supervisorProcessStartId === "string" && typeof value.supervisorSocketPath === "string";
}
async function prepareConnectedDaemonUpdateRestart(client, socketPath, agentDir, hello) {
  const pendingManifest = tryReadPreparedDaemonUpdateRestartManifest(socketPath, agentDir);
  let startedAt;
  let fixedOwnerIdentity;
  let fencePersistenceStarted = false;
  const persistPreparedRestartFence = async () => {
    const currentHello = client.hello;
    if (hasFixedDaemonSupervisorOwnerIdentity(currentHello)) {
      fixedOwnerIdentity = currentHello;
    }
    if (!fixedOwnerIdentity) {
      return;
    }
    fencePersistenceStarted = true;
    await persistDaemonStartupFenceFromOwner(socketPath, fixedOwnerIdentity);
  };
  try {
    if (hasFixedDaemonSupervisorOwnerIdentity(hello)) {
      fixedOwnerIdentity = hello;
    }
    if (pendingManifest && pendingManifest.sessions.length > 0) {
      const listResponse = await client.request({ type: "list" }, 3e4);
      if (listResponse.success && !responseHasActiveDaemonSessions(listResponse.data)) {
        await persistPreparedRestartFence();
        return pendingManifest;
      }
    }
    clearPreparedDaemonUpdateRestartManifest(socketPath, agentDir);
    startedAt = Date.now();
    const response = await client.request({ type: "prepare_update_restart" }, 12e4);
    if (!response.success) {
      throw new Error(response.error);
    }
    const manifest = parseDaemonUpdateRestartManifest(response.data);
    await persistPreparedRestartFence();
    return manifest;
  } catch (error) {
    if (fencePersistenceStarted) {
      throw error;
    }
    if (startedAt !== void 0) {
      const fallback = readPreparedDaemonUpdateRestartManifest(socketPath, agentDir, startedAt);
      if (fallback) {
        await persistPreparedRestartFence();
        return fallback;
      }
    }
    throw error;
  }
}
function readCreatedActiveSessionId(value) {
  if (!isDaemonSessionSummary(value) || typeof value.activeSessionId !== "string") {
    throw new Error("Daemon returned an invalid session create response");
  }
  return value.activeSessionId;
}
async function restoreNextTurnMessages(client, activeSessionId, sessionFile, messages) {
  if (messages.length === 0) {
    return true;
  }
  const response = await client.request({ type: "restore_next_turn", activeSessionId, messages: [...messages] }, 3e4);
  if (!response.success) {
    console.error(source_default.yellow(`Warning: could not restore pending context for ${sessionFile}: ${response.error}`));
    return false;
  }
  return true;
}
function remapDaemonUpdateRestartRuntimeMetadata(session, restoredActiveSessionIds) {
  const metadata = session.runtimeMetadata;
  if (!metadata) {
    return void 0;
  }
  if (metadata.kind !== "subagent") {
    return metadata;
  }
  const { parentActiveSessionId: oldParentActiveSessionId, ...runtimeMetadata } = metadata;
  const parentActiveSessionId = oldParentActiveSessionId ? restoredActiveSessionIds.get(oldParentActiveSessionId) : void 0;
  return {
    ...runtimeMetadata,
    ...parentActiveSessionId ? { parentActiveSessionId } : {}
  };
}
async function restoreDaemonUpdateRestartSession(client, session, restoredActiveSessionIds, restartOriginActiveSessionId) {
  const runtimeMetadata = remapDaemonUpdateRestartRuntimeMetadata(session, restoredActiveSessionIds);
  const createResponse = await client.request({
    type: "create",
    sessionPath: session.sessionFile,
    config: session.config,
    ...runtimeMetadata ? { runtimeMetadata } : {},
    ...session.clientEnv ? { env: session.clientEnv } : {}
  }, 12e4);
  if (!createResponse.success) {
    console.error(source_default.yellow(`Warning: could not restore ${session.sessionFile}: ${createResponse.error}`));
    return { restored: false, resumed: false, failureMessage: createResponse.error };
  }
  const activeSessionId = readCreatedActiveSessionId(createResponse.data);
  restoredActiveSessionIds.set(session.activeSessionId, activeSessionId);
  if (session.activeSessionId === restartOriginActiveSessionId) {
    try {
      const noticeResponse = await client.request({
        type: "append_custom_message",
        activeSessionId,
        message: {
          customType: "prime-agent.update_complete",
          content: `Prime Agent updated to v${VERSION}. This daemon session was restored after the update.`,
          display: true,
          details: { version: VERSION }
        }
      }, 3e4);
      if (!noticeResponse.success) {
        console.error(source_default.yellow(`Warning: could not record update completion in ${session.sessionFile}: ${noticeResponse.error}`));
      }
    } catch (error) {
      console.error(source_default.yellow(`Warning: could not record update completion in ${session.sessionFile}: ${formatUnknownError(error)}`));
    }
  }
  await restoreNextTurnMessages(client, activeSessionId, session.sessionFile, session.queue.nextTurn);
  if (!session.shouldResume)
    return { restored: true, resumed: false };
  const needsContinuationPrompt = session.wasStreaming || session.wasCompacting || session.wasBashRunning || session.hadRunningRlmChildren || session.wasRetrying || session.hadAcceptedPromptInFlight;
  let resumedSession = false;
  let restoredQueuedWork = false;
  if (session.queue.actions.actions.length > 0) {
    const response = await client.request({ type: "restore_actions", activeSessionId, snapshot: session.queue.actions }, 3e4);
    if (response.success) {
      restoredQueuedWork = true;
    } else {
      console.error(source_default.yellow(`Warning: could not restore queued actions for ${session.sessionFile}: ${response.error}`));
    }
  }
  const restoredAcceptedTurn = restoredQueuedWork && session.queue.actions.actions.some((action) => action.payload.kind === "turn" && !action.payload.queueVisible && action.payload.acceptedBeforeCompletion);
  if (needsContinuationPrompt && !restoredAcceptedTurn) {
    const promptResponse = await client.request({
      type: "prompt",
      activeSessionId,
      message: UPDATE_RESTART_CONTINUATION_PROMPT,
      expandPromptTemplates: false
    }, 12e4);
    if (!promptResponse.success) {
      console.error(source_default.yellow(`Warning: could not resume ${session.sessionFile}: ${promptResponse.error}`));
    } else {
      resumedSession = true;
    }
  }
  if (!resumedSession && restoredQueuedWork) {
    const response = await client.request({ type: "resume_queue", activeSessionId }, 3e4);
    if (response.success) {
      resumedSession = true;
    } else {
      console.error(source_default.yellow(`Warning: could not resume queued work for ${session.sessionFile}: ${response.error}`));
    }
  }
  return { restored: true, resumed: resumedSession };
}
async function restoreDaemonUpdateRestart(socketPath, manifest, restartOriginActiveSessionId, onProgress) {
  const restoredActiveSessionIds = /* @__PURE__ */ new Map();
  if (manifest.sessions.length === 0) {
    return { total: 0, restored: 0, resumed: 0, failed: 0, failures: [] };
  }
  const client = new DaemonClient(socketPath);
  let restored = 0;
  let resumed = 0;
  const failures = [];
  try {
    await client.connect(1e4);
    for (const session of manifest.sessions) {
      try {
        const result = await restoreDaemonUpdateRestartSession(client, session, restoredActiveSessionIds, restartOriginActiveSessionId);
        if (result.restored) {
          restored++;
        }
        if (result.resumed) {
          resumed++;
        }
        if (!result.restored) {
          failures.push({
            sessionFile: session.sessionFile,
            message: result.failureMessage ?? "unknown restore error"
          });
        }
      } catch (error) {
        const message = formatUnknownError(error);
        console.error(source_default.yellow(`Warning: could not restore ${session.sessionFile}: ${message}`));
        failures.push({ sessionFile: session.sessionFile, message });
      }
      onProgress?.({
        total: manifest.sessions.length,
        restored,
        resumed,
        failed: failures.length,
        failures: [...failures]
      });
    }
  } finally {
    client.close();
  }
  console.log(source_default.green(`Restored ${restored} agent session${restored === 1 ? "" : "s"}`));
  if (resumed > 0) {
    console.log(source_default.green(`Resumed ${resumed} interrupted session${resumed === 1 ? "" : "s"}`));
  }
  return {
    total: manifest.sessions.length,
    restored,
    resumed,
    failed: manifest.sessions.length - restored,
    failures
  };
}
function formatUnknownError(error) {
  return error instanceof Error ? error.message : String(error);
}
function processIdentityFromDaemonHello(hello) {
  if (!hello?.supervisorPid || !Number.isInteger(hello.supervisorPid) || hello.supervisorPid <= 0) {
    return void 0;
  }
  return {
    pid: hello.supervisorPid,
    ...hello.supervisorProcessStartId ? { processStartId: hello.supervisorProcessStartId } : {},
    ...hello.supervisorGeneration ? { supervisorGeneration: hello.supervisorGeneration } : {},
    ...hello.supervisorOwnerToken ? { supervisorOwnerToken: hello.supervisorOwnerToken } : {}
  };
}
function normalizedSocketPath(socketPath) {
  return process.platform === "win32" ? socketPath.toLowerCase() : resolve2(socketPath);
}
function validateReplacementDaemon(socketPath, hello, predecessor) {
  if (hello.protocol.version !== DAEMON_PROTOCOL_VERSION || hello.schemaId !== DAEMON_SCHEMA_ID || hello.appVersion !== VERSION) {
    throw new Error(`Replacement daemon is v${hello.appVersion}/proto${hello.protocol.version}/schema ${hello.schemaId ?? "legacy"}, expected v${VERSION}/proto${DAEMON_PROTOCOL_VERSION}/schema ${DAEMON_SCHEMA_ID}`);
  }
  if (!hello.supervisorSocketPath || normalizedSocketPath(hello.supervisorSocketPath) !== normalizedSocketPath(socketPath)) {
    throw new Error(`Replacement daemon identity does not match ${socketPath}`);
  }
  const successor = processIdentityFromDaemonHello(hello);
  if (!successor?.supervisorGeneration || !successor.supervisorOwnerToken) {
    throw new Error(`Replacement daemon on ${socketPath} did not provide an identity fence`);
  }
  if (predecessor && (predecessor.supervisorGeneration !== void 0 && successor.supervisorGeneration === predecessor.supervisorGeneration || predecessor.supervisorOwnerToken !== void 0 && successor.supervisorOwnerToken === predecessor.supervisorOwnerToken || successor.pid === predecessor.pid && predecessor.processStartId !== void 0 && successor.processStartId === predecessor.processStartId)) {
    throw new Error(`Replacement daemon on ${socketPath} still has the predecessor identity`);
  }
  return successor;
}
async function runDaemonUpdateRestartCoordinator(options) {
  const statusWriter = new DaemonUpdateRestartStatusWriter(options.statusPath, `${process.pid}-${Date.now()}`, options.socketPath);
  const stopStatusHeartbeat = statusWriter.startHeartbeat();
  let lease;
  let shutdownAdmission;
  let connectedClient;
  let manifest;
  try {
    try {
      lease = await acquireDaemonUpdateRestartCoordinator({
        requestId: statusWriter.current().requestId,
        socketPath: options.socketPath,
        statusPath: options.statusPath
      });
    } catch (error) {
      if (!(error instanceof DaemonUpdateRestartCoordinatorAlreadyRunningError)) {
        throw error;
      }
      const activeStatus = await waitForActiveDaemonUpdateRestartCoordinator(error.record);
      statusWriter.update({
        phase: activeStatus.phase,
        counts: activeStatus.counts,
        ...activeStatus.predecessor ? { predecessor: activeStatus.predecessor } : {},
        ...activeStatus.successor ? { successor: activeStatus.successor } : {},
        ...activeStatus.failures ? { failures: activeStatus.failures } : {},
        ...activeStatus.message ? { message: activeStatus.message } : {}
      });
      return statusWriter.current();
    }
    shutdownAdmission = await acquireDaemonShutdownAdmission();
    const daemonProbe = await probeRunningDaemonSessions(options.socketPath);
    const reportRestoreProgress = (progress) => {
      const { failures: failures2, ...counts2 } = progress;
      statusWriter.update({ counts: counts2, failures: failures2 });
    };
    let predecessor;
    if (daemonProbe.reachable) {
      connectedClient = new DaemonClient(options.socketPath);
      await connectedClient.connect(1e3);
      const hello = await connectedClient.waitForHello(2e3);
      predecessor = processIdentityFromDaemonHello(hello);
      statusWriter.update({ phase: "preparing", ...predecessor ? { predecessor } : {} });
      try {
        manifest = await prepareConnectedDaemonUpdateRestart(connectedClient, options.socketPath, options.agentDir, hello);
      } catch (error) {
        const daemonLacksPrepareCommand = isUnknownDaemonCommandError(error, "prepare_update_restart");
        if (daemonProbeMayHaveBusySessions(daemonProbe) || !daemonLacksPrepareCommand) {
          throw new Error(`Could not prepare daemon sessions for automatic resume; the previous daemon is still running (${formatUnknownError(error)})`);
        }
      }
      statusWriter.update({
        phase: "stopping",
        counts: {
          total: manifest?.sessions.length ?? 0,
          restored: 0,
          resumed: 0,
          failed: 0
        }
      });
      await shutdownAdmission.assertOrRenew();
      const stopped = await shutdownConnectedDaemonAndWait(connectedClient, options.socketPath, 1e4, hello);
      connectedClient = void 0;
      if (!stopped) {
        const remainingDaemon = await probeRunningDaemonSessions(options.socketPath);
        if (remainingDaemon.reachable) {
          if (manifest) {
            try {
              const restoreResult = await restoreDaemonUpdateRestart(options.socketPath, manifest, options.originActiveSessionId, reportRestoreProgress);
              const { failures: restoreFailures, ...counts2 } = restoreResult;
              clearPreparedDaemonUpdateRestartManifest(options.socketPath, options.agentDir);
              statusWriter.update({
                counts: counts2,
                ...restoreFailures.length > 0 ? { failures: restoreFailures } : {}
              });
            } catch {
            }
          }
          throw new Error(`Could not stop the predecessor daemon on ${options.socketPath}`);
        }
      }
    } else {
      manifest = tryReadPreparedDaemonUpdateRestartManifest(options.socketPath, options.agentDir);
      if (!hasRestorableDaemonUpdateRestart(manifest)) {
        statusWriter.update({ phase: "skipped", message: "No running daemon needed to be restarted" });
        return statusWriter.current();
      }
    }
    statusWriter.update({ phase: "starting_daemon" });
    await waitForDaemonStartupFence(options.socketPath, UPDATE_RESTART_PREDECESSOR_FENCE_TIMEOUT_MS);
    await shutdownAdmission.assertOrRenew();
    await shutdownAdmission.release();
    shutdownAdmission = void 0;
    await ensureInteractiveDaemonRunning(options.socketPath);
    const successorClient = new DaemonClient(options.socketPath);
    let successor;
    try {
      await successorClient.connect(1e3);
      const successorHello = await successorClient.waitForHello(6e4);
      successor = validateReplacementDaemon(options.socketPath, successorHello, predecessor);
    } finally {
      successorClient.close();
    }
    statusWriter.update({ phase: "restoring", successor });
    let counts = { total: 0, restored: 0, resumed: 0, failed: 0 };
    let failures = [];
    if (manifest) {
      const restoreResult = await restoreDaemonUpdateRestart(options.socketPath, manifest, options.originActiveSessionId, reportRestoreProgress);
      counts = {
        total: restoreResult.total,
        restored: restoreResult.restored,
        resumed: restoreResult.resumed,
        failed: restoreResult.failed
      };
      failures = restoreResult.failures;
      clearPreparedDaemonUpdateRestartManifest(options.socketPath, options.agentDir);
    }
    statusWriter.update({
      phase: "complete",
      counts,
      ...failures.length > 0 ? { failures } : {},
      message: counts.failed > 0 ? `Restarted the daemon with ${counts.failed} session restore failure${counts.failed === 1 ? "" : "s"}` : "Restarted the daemon after the update"
    });
  } catch (error) {
    statusWriter.update({ phase: "failed", message: formatUnknownError(error) });
  } finally {
    stopStatusHeartbeat();
    connectedClient?.close();
    await shutdownAdmission?.release();
    await lease?.release();
  }
  return statusWriter.current();
}
async function handleConfigCommand(args) {
  if (args[0] !== "config") {
    return false;
  }
  const cwd = process.cwd();
  const agentDir = getAgentDir();
  const settingsManager = SettingsManager.create(cwd, agentDir);
  reportSettingsErrors(settingsManager, "config command");
  const packageManager = new DefaultPackageManager({ cwd, agentDir, settingsManager });
  const resolvedPaths = await packageManager.resolve();
  await selectConfig({
    resolvedPaths,
    settingsManager,
    cwd,
    agentDir
  });
  process.exit(0);
}
async function handlePackageCommand(args) {
  const options = parsePackageCommand(args);
  if (!options) {
    return false;
  }
  if (options.help) {
    printPackageCommandHelp(options.command);
    return true;
  }
  if (options.invalidOption) {
    if (options.invalidOption === "-l" && (options.command === "install" || options.command === "remove")) {
      console.error(source_default.red('Option -l was removed. Use "--local".'));
      process.exitCode = 1;
      return true;
    }
    console.error(source_default.red(`Unknown option ${options.invalidOption} for "${options.command}".`));
    console.error(source_default.dim(`Use "${APP_NAME} --help" or "${getPackageCommandUsage(options.command)}".`));
    process.exitCode = 1;
    return true;
  }
  if (options.missingOptionValue) {
    console.error(source_default.red(`Missing value for ${options.missingOptionValue}.`));
    console.error(source_default.dim(`Usage: ${getPackageCommandUsage(options.command)}`));
    process.exitCode = 1;
    return true;
  }
  if (options.invalidArgument) {
    console.error(source_default.red(`Unexpected argument ${options.invalidArgument}.`));
    console.error(source_default.dim(`Usage: ${getPackageCommandUsage(options.command)}`));
    process.exitCode = 1;
    return true;
  }
  if (options.conflictingOptions) {
    console.error(source_default.red(options.conflictingOptions));
    console.error(source_default.dim(`Usage: ${getPackageCommandUsage(options.command)}`));
    process.exitCode = 1;
    return true;
  }
  if (options.restartCoordinator) {
    const agentDir2 = getAgentDir();
    const statusPath = options.restartStatusPath;
    const daemonSocketPath = options.daemonSocketPath;
    const restartDirectory = resolve2(agentDir2, "update-restarts");
    if (!statusPath || !daemonSocketPath || !resolve2(statusPath).startsWith(`${restartDirectory}${sep}`)) {
      console.error(source_default.red("Invalid daemon update restart coordinator invocation."));
      process.exitCode = 1;
      return true;
    }
    const status = await runDaemonUpdateRestartCoordinator({
      socketPath: daemonSocketPath,
      agentDir: agentDir2,
      statusPath,
      originActiveSessionId: options.restartOriginActiveSessionId
    });
    if (status.phase === "failed") {
      process.exitCode = 1;
    }
    return true;
  }
  if (options.restartStatusPath || options.restartOriginActiveSessionId) {
    console.error(source_default.red("Invalid daemon update restart coordinator invocation."));
    process.exitCode = 1;
    return true;
  }
  const source = options.source;
  if ((options.command === "install" || options.command === "remove") && !source) {
    console.error(source_default.red(`Missing ${options.command} source.`));
    console.error(source_default.dim(`Usage: ${getPackageCommandUsage(options.command)}`));
    process.exitCode = 1;
    return true;
  }
  const cwd = process.cwd();
  const agentDir = getAgentDir();
  const settingsManager = SettingsManager.create(cwd, agentDir);
  reportSettingsErrors(settingsManager, "package command");
  const selfUpdateNpmCommand = settingsManager.getGlobalSettings().npmCommand;
  const packageManager = new DefaultPackageManager({ cwd, agentDir, settingsManager });
  packageManager.setProgressCallback((event) => {
    if (event.type === "start") {
      process.stdout.write(source_default.dim(`${event.message}
`));
    }
  });
  try {
    switch (options.command) {
      case "install":
        await packageManager.installAndPersist(source, { local: options.local });
        console.log(source_default.green(`Installed ${source}`));
        return true;
      case "remove": {
        const removed = await packageManager.removeAndPersist(source, { local: options.local });
        if (!removed) {
          console.error(source_default.red(`No matching package found for ${source}`));
          process.exitCode = 1;
          return true;
        }
        console.log(source_default.green(`Removed ${source}`));
        return true;
      }
      case "list": {
        const configuredPackages = packageManager.listConfiguredPackages();
        const userPackages = configuredPackages.filter((pkg) => pkg.scope === "user");
        const projectPackages = configuredPackages.filter((pkg) => pkg.scope === "project");
        if (configuredPackages.length === 0) {
          console.log(source_default.dim("No packages installed."));
          return true;
        }
        const formatPackage = (pkg) => {
          const display = pkg.filtered ? `${pkg.source} (filtered)` : pkg.source;
          console.log(`  ${display}`);
          if (pkg.installedPath) {
            console.log(source_default.dim(`    ${pkg.installedPath}`));
          }
        };
        if (userPackages.length > 0) {
          console.log(source_default.bold("User packages:"));
          for (const pkg of userPackages) {
            formatPackage(pkg);
          }
        }
        if (projectPackages.length > 0) {
          if (userPackages.length > 0)
            console.log();
          console.log(source_default.bold("Project packages:"));
          for (const pkg of projectPackages) {
            formatPackage(pkg);
          }
        }
        return true;
      }
      case "update": {
        const target = options.updateTarget ?? { type: "all" };
        if (updateTargetIncludesExtensions(target)) {
          const updateSource = target.type === "extensions" ? target.source : void 0;
          await packageManager.update(updateSource);
          if (updateSource) {
            console.log(source_default.green(`Updated ${updateSource}`));
          } else {
            console.log(source_default.green("Updated packages"));
          }
        }
        if (updateTargetIncludesSelf(target)) {
          const selfUpdatePlan = await getSelfUpdatePlan(options.force);
          if (!selfUpdatePlan.shouldRun) {
            setSelfUpdateNoChangeExitCode();
            return true;
          }
          const selfUpdateCommand = getSelfUpdateCommand(PACKAGE_NAME, selfUpdateNpmCommand, selfUpdatePlan.installSpec, selfUpdatePlan.packageName);
          if (!selfUpdateCommand) {
            printSelfUpdateUnavailable(selfUpdateNpmCommand, selfUpdatePlan.installSpec, selfUpdatePlan.packageName);
            process.exitCode = 1;
            return true;
          }
          const daemonSocketPath = resolveUpdateDaemonSocketPath(options.daemonSocketPath);
          const daemonProbe = await probeRunningDaemonSessions(daemonSocketPath);
          if (!await confirmDaemonSessionLossBeforeUpdate(daemonProbe, options.force)) {
            if (process.stdin.isTTY) {
              console.log(source_default.dim("Update cancelled."));
            }
            process.exitCode = 1;
            return true;
          }
          try {
            await runSelfUpdate(selfUpdateCommand);
          } catch (error) {
            const message = error instanceof Error ? error.message : "Unknown package command error";
            console.error(source_default.red(`Error: ${message}`));
            printSelfUpdateFallback(selfUpdateCommand);
            process.exitCode = 1;
            return true;
          }
          const versionChange = selfUpdatePlan.targetVersion ? ` from v${VERSION} to v${selfUpdatePlan.targetVersion}` : "";
          console.log(source_default.green(`Updated ${APP_NAME}${versionChange}`));
          if (process.env[SELF_UPDATE_INTERACTIVE_CHILD_ENV] === "1") {
            return true;
          }
          try {
            const status = await launchDaemonUpdateRestartCoordinator({
              socketPath: daemonSocketPath,
              agentDir,
              cwd,
              originActiveSessionId: process.env[DAEMON_WORKER_ACTIVE_SESSION_ID_ENV]
            });
            reportDaemonUpdateRestartStatus(status);
          } catch (error) {
            console.error(source_default.yellow(`Warning: updated, but could not coordinate the daemon restart (${formatUnknownError(error)}).`));
          }
        }
        return true;
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown package command error";
    console.error(source_default.red(`Error: ${message}`));
    process.exitCode = 1;
    return true;
  }
}

// dist/cli/daemon-command.js
import { resolve as resolve4 } from "node:path";
import { clearLine, createInterface as createInterface2, cursorTo } from "node:readline";
import { setTimeout as delay2 } from "node:timers/promises";
import { spawn as spawn2 } from "child_process";

// dist/cli/daemon-list-format.js
var LIST_STATUS_ORDER = {
  working: 0,
  idle: 1,
  archived: 2
};
function listStatusForSummary(summary) {
  if (summary.lifecycle === "archived") {
    return "archived";
  }
  return summary.activity === "working" ? "working" : "idle";
}
function formatSessionListTable(sessions, nowMs = Date.now()) {
  const rows = sortSessionsForList(sessions).map((session) => ({
    name: session.sessionName ?? "",
    id: formatSessionDisplayId(session.id),
    status: listStatusForSummary(session),
    age: formatSessionAge(session.modified, nowMs),
    model: formatSessionModel(session.model),
    messages: String(session.messageCount),
    clients: String(session.attachedClients)
  }));
  return formatTable(["name", "id", "status", "age", "model", "messages", "clients"], rows, formatListCell);
}
function sortSessionsForList(sessions) {
  return sessions.map((session, index) => ({ session, index })).sort((left, right) => {
    const statusDelta = LIST_STATUS_ORDER[listStatusForSummary(left.session)] - LIST_STATUS_ORDER[listStatusForSummary(right.session)];
    return statusDelta || left.index - right.index;
  }).map(({ session }) => session);
}
function formatListCell(row, column, value) {
  if (column !== "status") {
    return value;
  }
  switch (row.status) {
    case "working":
      return source_default.red(value);
    case "idle":
      return source_default.blue(value);
    case "archived":
      return source_default.dim(value);
  }
}
function formatSessionAge(modified, nowMs) {
  if (!modified) {
    return "";
  }
  const modifiedMs = new Date(modified).getTime();
  if (Number.isNaN(modifiedMs)) {
    return "";
  }
  const ageSeconds = Math.max(0, Math.floor((nowMs - modifiedMs) / 1e3));
  if (ageSeconds < 60) {
    return `${ageSeconds}s`;
  }
  const ageMinutes = Math.floor(ageSeconds / 60);
  if (ageMinutes < 60) {
    return `${ageMinutes}m`;
  }
  const ageHours = Math.floor(ageMinutes / 60);
  if (ageHours < 24) {
    return `${ageHours}h`;
  }
  const ageDays = Math.floor(ageHours / 24);
  if (ageDays < 7) {
    return `${ageDays}d`;
  }
  const ageWeeks = Math.floor(ageDays / 7);
  if (ageWeeks < 52) {
    return `${ageWeeks}w`;
  }
  return `${Math.floor(ageWeeks / 52)}y`;
}
function formatSessionModel(model) {
  return model ? `${model.provider}/${model.id}` : "";
}
function formatTable(columns, rows, formatCell) {
  const widths = columns.map((column) => Math.max(String(column).length, ...rows.map((row) => String(row[column]).length)));
  const lines = [columns.map((column, index) => String(column).padEnd(widths[index])).join("  ")];
  for (const row of rows) {
    const line = columns.map((column, index) => {
      const value = String(row[column]).padEnd(widths[index]);
      return formatCell ? formatCell(row, column, value) : value;
    }).join("  ");
    lines.push(line);
  }
  return lines.join("\n");
}

// dist/cli/daemon-ps.js
import { spawnSync } from "node:child_process";
import { existsSync, lstatSync, readdirSync, readFileSync as readFileSync2, rmSync as rmSync2, unlinkSync } from "node:fs";
import { basename as basename2, dirname as dirname2, join as join2, resolve as resolve3 } from "node:path";

// dist/cli/daemon-ps-format.js
function formatDaemonListTable(daemons) {
  const rows = daemons.map((daemon) => ({
    socket: daemon.isDefault ? `${daemon.socketPath} *` : daemon.socketPath,
    pid: daemon.pid !== void 0 ? String(daemon.pid) : "",
    version: daemon.version ?? "",
    status: daemon.status,
    sessions: daemon.sessionCount !== void 0 ? String(daemon.sessionCount) : "",
    uptime: formatUptime(daemon.uptimeSeconds)
  }));
  const table = formatTable2(["socket", "pid", "version", "status", "sessions", "uptime"], rows, formatDaemonCell);
  return daemons.some((daemon) => daemon.isDefault) ? `${table}

${source_default.dim("* default background service")}` : table;
}
function formatDaemonCell(_row, column, value) {
  if (column !== "status") {
    return value;
  }
  return colorStatus(value.trim(), value);
}
function colorStatus(status, value) {
  switch (status) {
    case "current":
      return source_default.green(value);
    case "stale":
      return source_default.yellow(value);
    case "unreachable":
      return source_default.red(value);
    case "orphan-file":
      return source_default.dim(value);
  }
}
function formatUptime(uptimeSeconds) {
  if (uptimeSeconds === void 0 || !Number.isFinite(uptimeSeconds)) {
    return "";
  }
  const seconds = Math.max(0, Math.floor(uptimeSeconds));
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h`;
  }
  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days}d`;
  }
  return `${Math.floor(days / 7)}w`;
}
function formatTable2(columns, rows, formatCell) {
  const widths = columns.map((column) => Math.max(String(column).length, ...rows.map((row) => String(row[column]).length)));
  const lines = [columns.map((column, index) => String(column).padEnd(widths[index])).join("  ")];
  for (const row of rows) {
    const line = columns.map((column, index) => {
      const value = String(row[column]).padEnd(widths[index]);
      return formatCell ? formatCell(row, column, value) : value;
    }).join("  ");
    lines.push(line);
  }
  return lines.join("\n");
}

// dist/cli/daemon-ps.js
var STATUS_ORDER = {
  current: 0,
  stale: 1,
  unreachable: 2,
  "orphan-file": 3
};
var SHUTDOWN_QUIET_PERIOD_MS = 1e3;
var SHUTDOWN_CONVERGENCE_TIMEOUT_MS = 1e4;
function evaluateShutdownQuietPeriod(now, quietSince) {
  if (quietSince !== void 0 && now - quietSince >= SHUTDOWN_QUIET_PERIOD_MS) {
    return "complete";
  }
  return "waiting";
}
var MAX_COMM_LENGTH = 15;
function normalizeSocketPath(socketPath) {
  if (process.platform === "win32") {
    return socketPath;
  }
  return resolve3(socketPath);
}
function processNameMatches(name, appName) {
  return name === appName || appName.slice(0, MAX_COMM_LENGTH) === name;
}
function parseSsListeners(stdout, appName) {
  const daemons = [];
  for (const line of stdout.split("\n")) {
    const fields = line.trim().split(/\s+/);
    if (fields[1] !== "LISTEN") {
      continue;
    }
    const socketPath = fields[4];
    if (!socketPath?.startsWith("/")) {
      continue;
    }
    const owner = line.match(/users:\(\("([^"]+)",pid=(\d+)/);
    if (!owner || !processNameMatches(owner[1], appName)) {
      continue;
    }
    daemons.push({ pid: Number.parseInt(owner[2], 10), socketPath: normalizeSocketPath(socketPath) });
  }
  return daemons;
}
function parseLsofListeners(stdout) {
  const daemons = [];
  const seen = /* @__PURE__ */ new Set();
  let pid;
  for (const line of stdout.split("\n")) {
    const field = line[0];
    const value = line.slice(1);
    if (field === "p") {
      pid = Number.parseInt(value, 10);
    } else if (field === "n" && pid !== void 0 && value.startsWith("/")) {
      const socketPath = normalizeSocketPath(value);
      const key = `${pid}:${socketPath}`;
      if (!seen.has(key)) {
        seen.add(key);
        daemons.push({ pid, socketPath });
      }
    }
  }
  return daemons;
}
function parsePrimeAgentProcessIds(stdout, appName) {
  const pids = [];
  for (const line of stdout.split("\n")) {
    const match = line.trim().match(/^(\d+)\s+(\S+)(?:\s+(.*))?$/);
    if (!match) {
      continue;
    }
    const command = basename2(match[2]);
    const argv0 = basename2(match[3]?.trim().split(/\s+/, 1)[0] ?? "");
    if (processNameMatches(command, appName) || processNameMatches(argv0, appName)) {
      pids.push(Number.parseInt(match[1], 10));
    }
  }
  return pids;
}
function mergeDiscoveredDaemonProcesses(...groups) {
  const byIdentity = /* @__PURE__ */ new Map();
  for (const group of groups) {
    for (const daemon of group) {
      byIdentity.set(`${daemon.pid}:${daemon.socketPath}`, daemon);
    }
  }
  return [...byIdentity.values()];
}
function parsePsEtimes(stdout) {
  const uptimes = /* @__PURE__ */ new Map();
  for (const line of stdout.split("\n")) {
    const match = line.trim().match(/^(\d+)\s+(\d+)$/);
    if (match) {
      uptimes.set(Number.parseInt(match[1], 10), Number.parseInt(match[2], 10));
    }
  }
  return uptimes;
}
function scanListeningDaemons() {
  if (process.platform === "win32") {
    return [];
  }
  const ss = spawnSync("ss", ["-lxp"], { encoding: "utf8" });
  if (!ss.error && ss.status === 0 && typeof ss.stdout === "string") {
    return enrichUptimes(parseSsListeners(ss.stdout, APP_NAME));
  }
  const lsof = spawnSync("lsof", ["-nP", "-F", "pn", "-U", "-a", "-c", APP_NAME], { encoding: "utf8" });
  const byName = !lsof.error && typeof lsof.stdout === "string" ? parseLsofListeners(lsof.stdout) : [];
  let byPid = [];
  const ps = spawnSync("ps", ["-axo", "pid=,comm=,args="], { encoding: "utf8" });
  if (!ps.error && ps.status === 0 && typeof ps.stdout === "string") {
    const pids = parsePrimeAgentProcessIds(ps.stdout, APP_NAME);
    if (pids.length > 0) {
      const lsofByPid = spawnSync("lsof", ["-nP", "-F", "pn", "-U", "-a", "-p", pids.join(",")], {
        encoding: "utf8"
      });
      if (!lsofByPid.error && typeof lsofByPid.stdout === "string") {
        byPid = parseLsofListeners(lsofByPid.stdout);
      }
    }
  }
  return enrichUptimes(mergeDiscoveredDaemonProcesses(byName, byPid));
}
function isDaemonProcessListening(pid, socketPath) {
  const target = normalizeSocketPath(socketPath);
  return scanListeningDaemons().some((daemon) => daemon.pid === pid && daemon.socketPath === target);
}
function enrichUptimes(daemons) {
  const pids = daemons.map((daemon) => daemon.pid);
  if (pids.length === 0) {
    return daemons;
  }
  const ps = spawnSync("ps", ["-o", "pid=,etimes=", "-p", pids.join(",")], { encoding: "utf8" });
  if (ps.error || typeof ps.stdout !== "string") {
    return daemons;
  }
  const uptimes = parsePsEtimes(ps.stdout);
  return daemons.map((daemon) => ({ ...daemon, uptimeSeconds: uptimes.get(daemon.pid) }));
}
function scanSocketDir() {
  if (process.platform === "win32") {
    return [];
  }
  const dir = defaultDaemonSocketDir();
  if (!existsSync(dir)) {
    return [];
  }
  const sockets = [];
  for (const entry of readdirSync(dir)) {
    const socketPath = join2(dir, entry);
    try {
      if (lstatSync(socketPath).isSocket()) {
        sockets.push(normalizeSocketPath(socketPath));
      }
    } catch {
    }
  }
  return sockets;
}
async function probeDaemon(socketPath) {
  const client = new DaemonClient(socketPath);
  try {
    await client.connect(300);
  } catch {
    client.close();
    return { reachable: false };
  }
  try {
    let version;
    let protocolVersion;
    let schemaId;
    let runtime;
    let supervisorPid;
    let supervisorProcessStartId;
    let greeted = false;
    try {
      const hello = await client.waitForHello(1500);
      version = hello.appVersion;
      protocolVersion = hello.protocol.version;
      schemaId = hello.schemaId;
      runtime = hello.runtime;
      supervisorPid = hello.supervisorPid;
      supervisorProcessStartId = hello.supervisorProcessStartId;
      greeted = true;
    } catch {
    }
    let sessionCount;
    try {
      const response = await client.request({ type: "list" }, greeted ? 3e4 : 1500);
      if (response.success) {
        const sessions = response.data?.sessions;
        if (Array.isArray(sessions)) {
          sessionCount = sessions.length;
        }
      }
    } catch {
    }
    return {
      version,
      protocolVersion,
      schemaId,
      runtime,
      sessionCount,
      supervisorPid,
      supervisorProcessStartId,
      reachable: true
    };
  } finally {
    client.close();
  }
}
function classifyReachable(probe) {
  if (probe.protocolVersion === DAEMON_PROTOCOL_VERSION && probe.schemaId === DAEMON_SCHEMA_ID && probe.version === VERSION) {
    return "current";
  }
  return "stale";
}
function verifyHelloSupervisorPid(pid, expectedProcessStartId) {
  if (!Number.isInteger(pid) || pid === void 0 || pid <= 0) {
    return void 0;
  }
  try {
    process.kill(pid, 0);
  } catch (error) {
    if (error.code !== "EPERM") {
      return void 0;
    }
  }
  if (expectedProcessStartId) {
    const observedStartId = getProcessStartId(pid);
    if (observedStartId !== expectedProcessStartId) {
      return void 0;
    }
  }
  return pid;
}
async function discoverDaemons() {
  const processBySocket = /* @__PURE__ */ new Map();
  for (const daemon of scanListeningDaemons()) {
    if (isWorkerSocketPath(daemon.socketPath)) {
      continue;
    }
    processBySocket.set(daemon.socketPath, daemon);
  }
  const workerSockets = new Set(findAllTrackedWorkers().map((worker) => normalizeSocketPath(worker.descriptor.supervisorSocketPath)));
  const sockets = /* @__PURE__ */ new Set([
    ...processBySocket.keys(),
    ...scanSocketDir().filter((socketPath) => !isWorkerSocketPath(socketPath)),
    ...workerSockets
  ]);
  const defaultSocket = normalizeSocketPath(defaultDaemonSocketPath());
  const infos = await Promise.all([...sockets].map(async (socketPath) => {
    const proc = processBySocket.get(socketPath);
    const probe = await probeDaemon(socketPath);
    const pid = proc?.pid ?? verifyHelloSupervisorPid(probe.supervisorPid, probe.supervisorProcessStartId);
    const hasTrackedWorkers = workerSockets.has(socketPath);
    const status = probe.reachable ? classifyReachable(probe) : proc || hasTrackedWorkers ? "unreachable" : "orphan-file";
    return {
      socketPath,
      pid,
      uptimeSeconds: proc?.uptimeSeconds,
      version: probe.version,
      protocolVersion: probe.protocolVersion,
      schemaId: probe.schemaId,
      buildId: probe.runtime?.buildId,
      executablePath: probe.runtime?.launcherPath ?? probe.runtime?.entrypointPath ?? probe.runtime?.executablePath,
      ...pid !== void 0 ? { pidSource: proc ? "listener" : "hello" } : {},
      sessionCount: probe.sessionCount,
      status,
      isDefault: socketPath === defaultSocket,
      ...hasTrackedWorkers ? { hasTrackedWorkers: true } : {}
    };
  }));
  return sortDaemons(infos);
}
function sortDaemons(infos) {
  return [...infos].sort((left, right) => {
    if (left.isDefault !== right.isDefault) {
      return left.isDefault ? -1 : 1;
    }
    const statusDelta = STATUS_ORDER[left.status] - STATUS_ORDER[right.status];
    return statusDelta || left.socketPath.localeCompare(right.socketPath);
  });
}
async function runPs(json) {
  const daemons = await discoverDaemons();
  if (json) {
    console.log(JSON.stringify(daemons, null, 2));
    return;
  }
  if (daemons.length === 0) {
    console.log("No background services found.");
    return;
  }
  console.log(formatDaemonListTable(daemons));
}
function planReap(daemons, force) {
  const pidCounts = /* @__PURE__ */ new Map();
  for (const daemon of daemons) {
    if (daemon.pid !== void 0) {
      pidCounts.set(daemon.pid, (pidCounts.get(daemon.pid) ?? 0) + 1);
    }
  }
  return daemons.map((daemon) => {
    if (daemon.status === "orphan-file") {
      return { kind: "remove-file", daemon };
    }
    if (daemon.isDefault) {
      return { kind: "skip", daemon, reason: "default background service" };
    }
    if (daemon.status === "unreachable") {
      if (!force || daemon.pid === void 0) {
        return { kind: "skip", daemon, reason: 'unreachable; use "prime-agent shutdown --force" to stop it' };
      }
      if ((pidCounts.get(daemon.pid) ?? 0) > 1) {
        return {
          kind: "skip",
          daemon,
          reason: `unreachable; pid ${daemon.pid} also backs another daemon, not killing`
        };
      }
      return { kind: "kill", daemon };
    }
    if (daemon.sessionCount !== 0) {
      return { kind: "skip", daemon, reason: `has ${daemon.sessionCount ?? "unknown"} session(s)` };
    }
    return { kind: "shutdown", daemon };
  });
}
function planShutdownAll(daemons, force) {
  return daemons.map((daemon) => {
    if (daemon.status === "orphan-file") {
      return { kind: "remove-file", daemon };
    }
    if (daemon.status === "unreachable") {
      if (daemon.pid === void 0) {
        return force || !daemon.hasTrackedWorkers ? { kind: "remove-file", daemon } : { kind: "skip", daemon, reason: "has unreachable workers; use --force to kill" };
      }
      return force ? { kind: "kill", daemon } : { kind: "skip", daemon, reason: "unreachable; use --force to kill" };
    }
    return { kind: "shutdown", daemon };
  });
}
var SHUTDOWN_ALL_ACTION_ORDER = {
  shutdown: 0,
  "remove-file": 1,
  kill: 2,
  skip: 3
};
function planShutdownConfirmation(daemonCount, json, force, stdinIsTTY) {
  if (daemonCount === 0 || force)
    return "none";
  if (json)
    return "json-error";
  return stdinIsTTY ? "prompt" : "tty-error";
}
async function runShutdownAll(json, force) {
  const daemons = await discoverDaemons();
  switch (planShutdownConfirmation(daemons.length, json, force, process.stdin.isTTY)) {
    case "json-error":
      process.exitCode = 1;
      console.log(JSON.stringify({
        stopped: [],
        failed: daemons.map(({ socketPath }) => ({
          socketPath,
          reason: 'confirmation required; use "prime-agent shutdown --force --json"'
        }))
      }, null, 2));
      return;
    case "tty-error":
      throw new Error('Shutdown requires confirmation in an interactive terminal. Use "prime-agent shutdown --force".');
    case "prompt": {
      const confirmed = await promptYesNo("Stop every agent and background service? Active work will be interrupted.");
      if (!confirmed) {
        console.log(source_default.dim("Shutdown cancelled."));
        return;
      }
      break;
    }
    case "none":
      break;
  }
  const admission = await acquireDaemonShutdownAdmission();
  try {
    await runShutdownAllConverging(json, force, () => admission.assertOrRenew());
  } finally {
    await admission.release();
  }
}
async function runShutdownAllConverging(json, force, assertAdmission) {
  const stopped = [];
  const failed = [];
  const handledPids = /* @__PURE__ */ new Set();
  const reportedFailures = /* @__PURE__ */ new Set();
  if (force) {
    await stopHiddenSupervisors(stopped, failed, handledPids, reportedFailures, assertAdmission);
  }
  const daemons = (await discoverDaemons()).filter((daemon) => !isWorkerSocketPath(daemon.socketPath));
  const actions = [...planShutdownAll(daemons, force)].sort((left, right) => SHUTDOWN_ALL_ACTION_ORDER[left.kind] - SHUTDOWN_ALL_ACTION_ORDER[right.kind]);
  for (const action of actions) {
    const { socketPath, pid } = action.daemon;
    if (pid !== void 0 && handledPids.has(pid)) {
      await assertAdmission();
      removeSocketFile(socketPath);
      stopped.push({ socketPath, action: `background service already stopped (pid ${pid})` });
      if (force) {
        failed.push(...(await forceStopTrackedWorkers(socketPath, assertAdmission)).map((reason) => ({
          socketPath,
          reason
        })));
      }
      continue;
    }
    switch (action.kind) {
      case "remove-file": {
        if ((await probeDaemon(socketPath)).reachable) {
          apply(await stopBackgroundService(socketPath, pid, handledPids, force, assertAdmission), socketPath, stopped, failed);
        } else {
          await assertAdmission();
          if (removeSocketFile(socketPath)) {
            stopped.push({ socketPath, action: "removed stale socket file" });
          } else {
            failed.push({ socketPath, reason: "could not remove socket file" });
          }
        }
        break;
      }
      case "kill": {
        if ((await probeDaemon(socketPath)).reachable) {
          apply(await stopBackgroundService(socketPath, pid, handledPids, force, assertAdmission), socketPath, stopped, failed);
        } else if (isDaemonProcessListening(pid, socketPath)) {
          await assertAdmission();
          await forceKillDaemon(pid);
          handledPids.add(pid);
          await assertAdmission();
          removeSocketFile(socketPath);
          stopped.push({ socketPath, action: `killed unreachable background service (pid ${pid})` });
        } else {
          await assertAdmission();
          removeSocketFile(socketPath);
          stopped.push({ socketPath, action: "background service already stopped" });
        }
        break;
      }
      case "shutdown":
        apply(await stopBackgroundService(socketPath, pid, handledPids, force, assertAdmission), socketPath, stopped, failed);
        break;
      case "skip":
        failed.push({ socketPath, reason: action.reason });
        break;
    }
    if (force && action.kind !== "skip") {
      failed.push(...(await forceStopTrackedWorkers(socketPath, assertAdmission)).map((reason) => ({ socketPath, reason })));
    }
  }
  if (force) {
    await terminateVerifiedResiduals(stopped, failed, handledPids, reportedFailures, assertAdmission);
  }
  if (json) {
    if (failed.length > 0) {
      process.exitCode = 1;
    }
    console.log(JSON.stringify({ stopped, failed }, null, 2));
    return;
  }
  if (stopped.length === 0 && failed.length === 0) {
    console.log("No background services found.");
    return;
  }
  for (const entry of stopped) {
    console.log(source_default.green(`stopped ${entry.socketPath}: ${entry.action}`));
  }
  for (const entry of failed) {
    console.log(source_default.red(`failed  ${entry.socketPath}: ${entry.reason}`));
  }
  if (failed.length > 0) {
    process.exitCode = 1;
  }
}
async function stopHiddenSupervisors(stopped, failed, handledPids, reportedFailures, assertAdmission) {
  while (true) {
    const listeners = scanListeningDaemons().filter((listener) => !isWorkerSocketPath(listener.socketPath));
    const bySocket = /* @__PURE__ */ new Map();
    for (const listener of listeners) {
      const group = bySocket.get(listener.socketPath) ?? [];
      group.push(listener);
      bySocket.set(listener.socketPath, group);
    }
    const hidden = [];
    for (const [socketPath, group] of bySocket) {
      if (new Set(group.map((listener) => listener.pid)).size < 2) {
        continue;
      }
      const currentPid = (await probeDaemon(socketPath)).supervisorPid;
      if (currentPid === void 0 || !group.some((listener) => listener.pid === currentPid)) {
        recordShutdownFailure(failed, reportedFailures, socketPath, "could not identify the current same-path daemon");
        continue;
      }
      hidden.push(...group.filter((listener) => listener.pid !== currentPid));
    }
    if (hidden.length === 0) {
      return;
    }
    const before = daemonListenerSignature(hidden);
    for (const listener of hidden) {
      if (await terminateVerifiedListener(listener, failed, reportedFailures, assertAdmission)) {
        handledPids.add(listener.pid);
        stopped.push({ socketPath: listener.socketPath, action: `stopped hidden daemon (pid ${listener.pid})` });
      }
    }
    const afterHidden = scanListeningDaemons().filter((listener) => !isWorkerSocketPath(listener.socketPath) && hidden.some((candidate) => candidate.pid === listener.pid && candidate.socketPath === listener.socketPath));
    if (afterHidden.length === 0 || daemonListenerSignature(afterHidden) === before) {
      return;
    }
  }
}
async function terminateVerifiedResiduals(stopped, failed, handledPids, reportedFailures, assertAdmission) {
  let previousSignature;
  let quietSince;
  const deadline = Date.now() + SHUTDOWN_CONVERGENCE_TIMEOUT_MS;
  while (true) {
    await assertAdmission();
    const listeners = scanListeningDaemons();
    const now = Date.now();
    if (listeners.length === 0) {
      previousSignature = void 0;
      quietSince ??= now;
      const quietPeriod = evaluateShutdownQuietPeriod(now, quietSince);
      if (quietPeriod === "complete") {
        return;
      }
      await delay(100);
      continue;
    }
    quietSince = void 0;
    const signature = daemonListenerSignature(listeners);
    if (now >= deadline) {
      recordResidualListenerFailures(listeners, failed, reportedFailures, "kept respawning during shutdown");
      return;
    }
    if (signature === previousSignature) {
      recordResidualListenerFailures(listeners, failed, reportedFailures, "remained after shutdown");
      return;
    }
    previousSignature = signature;
    const seenPids = /* @__PURE__ */ new Set();
    for (const listener of listeners) {
      if (seenPids.has(listener.pid)) {
        continue;
      }
      seenPids.add(listener.pid);
      const alreadyReported = handledPids.has(listener.pid);
      if (await terminateVerifiedListener(listener, failed, reportedFailures, assertAdmission)) {
        handledPids.add(listener.pid);
        if (!alreadyReported) {
          stopped.push({
            socketPath: listener.socketPath,
            action: `stopped residual daemon process (pid ${listener.pid})`
          });
        }
      }
    }
  }
}
function recordResidualListenerFailures(listeners, failed, reportedFailures, reason) {
  for (const listener of listeners) {
    const processStartId = getProcessStartId(listener.pid);
    const identity = processStartId ? `pid ${listener.pid}, start ${processStartId}` : `pid ${listener.pid}, process identity unavailable`;
    recordShutdownFailure(failed, reportedFailures, listener.socketPath, `daemon ${reason} (${identity})${describeDaemonParent(listener.pid)}`);
  }
}
function describeDaemonParent(pid) {
  const result = spawnSync("ps", ["-o", "ppid=,tty=,command=", "-p", String(pid)], { encoding: "utf8" });
  if (result.error || result.status !== 0 || typeof result.stdout !== "string") {
    return "";
  }
  const match = result.stdout.trim().match(/^(\d+)\s+(\S+)\s+(.+)$/);
  if (!match) {
    return "";
  }
  return `; close parent PID ${match[1]} on ${match[2]} (${match[3]}) and retry shutdown`;
}
async function terminateVerifiedListener(listener, failed, reportedFailures, assertAdmission) {
  const processStartId = getProcessStartId(listener.pid);
  if (!processStartId) {
    recordShutdownFailure(failed, reportedFailures, listener.socketPath, `could not verify daemon process identity (pid ${listener.pid})`);
    return false;
  }
  if (getProcessStartId(listener.pid) !== processStartId) {
    return false;
  }
  await assertAdmission();
  if (getProcessStartId(listener.pid) !== processStartId) {
    return false;
  }
  killDaemon(listener.pid);
  const deadline = Date.now() + 1e3;
  while (getProcessStartId(listener.pid) === processStartId && Date.now() < deadline) {
    await delay(50);
  }
  if (getProcessStartId(listener.pid) === processStartId) {
    await assertAdmission();
    if (getProcessStartId(listener.pid) !== processStartId) {
      return false;
    }
    try {
      process.kill(listener.pid, "SIGKILL");
    } catch {
    }
  }
  return getProcessStartId(listener.pid) !== processStartId;
}
function daemonListenerSignature(listeners) {
  return listeners.map((listener) => `${listener.pid}:${getProcessStartId(listener.pid) ?? "unknown"}:${listener.socketPath}`).sort().join("\n");
}
function recordShutdownFailure(failed, reportedFailures, socketPath, reason) {
  const key = `${socketPath}\0${reason}`;
  if (reportedFailures.has(key)) {
    return;
  }
  reportedFailures.add(key);
  failed.push({ socketPath, reason });
}
function isWorkerSocketPath(socketPath) {
  return process.platform !== "win32" && resolve3(dirname2(socketPath)) === resolve3(defaultDaemonSocketDir()) && basename2(socketPath).startsWith("worker-") && basename2(socketPath).endsWith(".sock");
}
async function stopBackgroundService(socketPath, pid, handledPids, force, assertAdmission) {
  await assertAdmission();
  if (await shutdownDaemon(socketPath, force)) {
    if (pid !== void 0) {
      handledPids.add(pid);
    }
    return { reaped: `stopped background service${pid ? ` (pid ${pid})` : ""}` };
  }
  if (!await canConnectToSocket(socketPath, 250)) {
    await assertAdmission();
    removeSocketFile(socketPath);
    return { reaped: "background service already stopped" };
  }
  if (pid === void 0) {
    return { skipped: "still listening but no pid to kill" };
  }
  if (!force) {
    return { skipped: "did not stop gracefully; retry with --force" };
  }
  await assertAdmission();
  await forceKillDaemon(pid);
  handledPids.add(pid);
  await assertAdmission();
  removeSocketFile(socketPath);
  return { reaped: `force-killed unresponsive background service (pid ${pid})` };
}
async function forceStopTrackedWorkers(supervisorSocketPath, assertAdmission) {
  const failures = [];
  for (const worker of findTrackedWorkers(supervisorSocketPath)) {
    const { descriptor } = worker;
    let cleanupWorkerRecords = await stopTrackedProcess(descriptor.pid, descriptor.processStartId, assertAdmission);
    if (!cleanupWorkerRecords) {
      failures.push(`could not safely stop worker ${descriptor.workerId} (pid ${descriptor.pid})`);
    }
    if (descriptor.orphanProcessJournalPath) {
      let orphans = [];
      try {
        orphans = readActiveOrphanProcesses(descriptor.orphanProcessJournalPath, descriptor.pid);
      } catch (error) {
        failures.push(`could not read child process records for worker ${descriptor.workerId}: ${String(error)}`);
      }
      for (const orphan of orphans) {
        if (!isOrphanProcessIdentityCurrent(orphan)) {
          continue;
        }
        if (!await stopTrackedProcess(orphan.pid, orphan.processStartId, assertAdmission)) {
          cleanupWorkerRecords = false;
          failures.push(`could not stop child process ${orphan.pid} for worker ${descriptor.workerId}`);
        }
      }
    }
    if (cleanupWorkerRecords) {
      try {
        removeSocketFile(descriptor.socketPath);
        rmSync2(worker.descriptorPath, { force: true });
        rmSync2(descriptor.recoveryJournalPath, { force: true });
        if (descriptor.orphanProcessJournalPath) {
          rmSync2(descriptor.orphanProcessJournalPath, { force: true });
        }
      } catch (error) {
        failures.push(`could not clean up worker ${descriptor.workerId}: ${String(error)}`);
      }
    }
  }
  return failures;
}
function findTrackedWorkers(supervisorSocketPath) {
  return findAllTrackedWorkers().filter((worker) => normalizeSocketPath(worker.descriptor.supervisorSocketPath) === normalizeSocketPath(supervisorSocketPath));
}
function findAllTrackedWorkers() {
  const root = join2(getAgentDir(), "daemon-workers");
  if (!existsSync(root)) {
    return [];
  }
  const workers = [];
  let directoryNames;
  try {
    directoryNames = readdirSync(root);
  } catch {
    return [];
  }
  for (const directoryName of directoryNames) {
    const directory = join2(root, directoryName);
    try {
      if (!lstatSync(directory).isDirectory()) {
        continue;
      }
    } catch {
      continue;
    }
    let fileNames;
    try {
      fileNames = readdirSync(directory);
    } catch {
      continue;
    }
    for (const fileName of fileNames) {
      if (!fileName.endsWith(".json")) {
        continue;
      }
      const descriptorPath = join2(directory, fileName);
      try {
        const value = JSON.parse(readFileSync2(descriptorPath, "utf8"));
        if (isTrackedWorkerDescriptor(value)) {
          workers.push({ descriptor: value, descriptorPath });
        }
      } catch {
      }
    }
  }
  return workers;
}
function isTrackedWorkerDescriptor(value) {
  if (!value || typeof value !== "object") {
    return false;
  }
  const descriptor = value;
  return descriptor.version === 1 && typeof descriptor.supervisorSocketPath === "string" && typeof descriptor.workerId === "string" && Number.isInteger(descriptor.pid) && (descriptor.pid ?? 0) > 0 && (descriptor.processStartId === void 0 || typeof descriptor.processStartId === "string") && typeof descriptor.socketPath === "string" && typeof descriptor.recoveryJournalPath === "string";
}
async function stopTrackedProcess(pid, expectedStartId, assertAdmission) {
  if (!isProcessAlive(pid)) {
    return true;
  }
  if (!expectedStartId || getProcessStartId(pid) !== expectedStartId) {
    return false;
  }
  await assertAdmission();
  if (getProcessStartId(pid) !== expectedStartId) {
    return false;
  }
  signalProcessGroupOrProcess(pid, "SIGTERM");
  let deadline = Date.now() + 500;
  while (isProcessAlive(pid) && Date.now() < deadline) {
    await delay(25);
  }
  if (!isProcessAlive(pid)) {
    return true;
  }
  await assertAdmission();
  if (getProcessStartId(pid) !== expectedStartId) {
    return false;
  }
  signalProcessGroupOrProcess(pid, "SIGKILL");
  deadline = Date.now() + 1e3;
  while (isProcessAlive(pid) && Date.now() < deadline) {
    await delay(25);
  }
  return !isProcessAlive(pid);
}
async function runReap(json, force) {
  const daemons = await discoverDaemons();
  const reaped = [];
  const skipped = [];
  for (const action of planReap(daemons, force)) {
    const { socketPath, pid } = action.daemon;
    switch (action.kind) {
      case "skip":
        skipped.push({ socketPath, reason: action.reason });
        break;
      case "remove-file": {
        if ((await probeDaemon(socketPath)).reachable) {
          skipped.push({ socketPath, reason: "now reachable; not removing socket file" });
        } else if (removeSocketFile(socketPath)) {
          reaped.push({ socketPath, action: "removed stale socket file" });
        } else {
          skipped.push({ socketPath, reason: "could not remove socket file" });
        }
        break;
      }
      case "kill": {
        const recheck = await probeDaemon(socketPath);
        if (!recheck.reachable) {
          killDaemon(pid);
          removeSocketFile(socketPath);
          reaped.push({ socketPath, action: `killed unreachable daemon (pid ${pid})` });
        } else {
          apply(await reapReachableDaemon(socketPath, pid), socketPath, reaped, skipped);
        }
        break;
      }
      case "shutdown":
        apply(await reapReachableDaemon(socketPath, pid), socketPath, reaped, skipped);
        break;
    }
  }
  if (json) {
    console.log(JSON.stringify({ reaped, skipped }, null, 2));
    return;
  }
  if (reaped.length === 0 && skipped.length === 0) {
    console.log("No background services found.");
    return;
  }
  for (const entry of reaped) {
    console.log(source_default.green(`reaped ${entry.socketPath}: ${entry.action}`));
  }
  for (const entry of skipped) {
    console.log(source_default.dim(`kept   ${entry.socketPath}: ${entry.reason}`));
  }
}
function apply(outcome, socketPath, reaped, skipped) {
  if ("reaped" in outcome) {
    reaped.push({ socketPath, action: outcome.reaped });
  } else {
    skipped.push({ socketPath, reason: outcome.skipped });
  }
}
async function reapReachableDaemon(socketPath, pid) {
  const probe = await probeDaemon(socketPath);
  if (!probe.reachable) {
    return { skipped: "no longer reachable" };
  }
  if (probe.sessionCount !== 0) {
    return { skipped: `now has ${probe.sessionCount ?? "unknown"} session(s)` };
  }
  return await shutdownDaemon(socketPath, false) ? { reaped: `stopped idle background service${pid ? ` (pid ${pid})` : ""}` } : { skipped: "shutdown request failed" };
}
function removeSocketFile(socketPath) {
  try {
    if (existsSync(socketPath)) {
      unlinkSync(socketPath);
    }
    return true;
  } catch {
    return false;
  }
}
function killDaemon(pid) {
  try {
    process.kill(pid, "SIGTERM");
  } catch {
  }
}
async function forceKillDaemon(pid) {
  killDaemon(pid);
  const deadline = Date.now() + 1e3;
  while (Date.now() < deadline) {
    if (!isProcessAlive(pid)) {
      return;
    }
    await delay(50);
  }
  try {
    process.kill(pid, "SIGKILL");
  } catch {
  }
}
function isProcessAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error.code === "EPERM";
  }
}
function delay(ms) {
  return new Promise((resolve6) => setTimeout(resolve6, ms));
}
async function canConnectToSocket(socketPath, timeoutMs) {
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
async function shutdownDaemon(socketPath, force) {
  const client = new DaemonClient(socketPath);
  try {
    await client.connect(1e3);
  } catch {
    client.close();
    return false;
  }
  try {
    await client.request({ type: "shutdown", force }, 1500);
  } catch {
  } finally {
    client.close();
  }
  const deadline = Date.now() + 5e3;
  while (Date.now() < deadline) {
    if (!await canConnectToSocket(socketPath, 250)) {
      return true;
    }
    await delay(50);
  }
  return false;
}

// dist/cli/daemon-command.js
var DAEMON_CLIENT_COMMANDS = /* @__PURE__ */ new Set([
  "start",
  "ps",
  "list",
  "create",
  "attach",
  "detach",
  "kill",
  "rename",
  "prompt",
  "send",
  "agent-messages",
  "steer",
  "follow-up",
  "state",
  "messages",
  "stats",
  "commands",
  "cron",
  "retry",
  "restart",
  "shutdown"
]);
async function handleDaemonCommand(args) {
  if (args[0] !== "daemon") {
    return false;
  }
  try {
    const parsed = parseDaemonClientCommand(args.slice(1));
    await runDaemonClientCommand(parsed);
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(source_default.red(`Error: ${message}`));
    process.exitCode = 1;
    return true;
  }
}
function parseDaemonClientCommand(args) {
  let socketPath = defaultDaemonSocketPath();
  let json = false;
  const positionals = [];
  let passthrough = false;
  let command;
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (passthrough) {
      positionals.push(arg);
      continue;
    }
    if (arg === "--" && (command === "cron" || command === "send")) {
      positionals.push(arg);
      passthrough = true;
      continue;
    }
    if (arg === "--") {
      passthrough = true;
      continue;
    }
    if (arg === "--help" || arg === "-h") {
      if (!command) {
        command = "help";
      } else {
        positionals.push("help");
      }
      continue;
    }
    if (arg === "--socket" || arg === "--daemon-socket") {
      const value = args[index + 1];
      if (!value) {
        throw new Error(`${arg} requires a value`);
      }
      socketPath = value;
      index++;
      continue;
    }
    if (arg === "--json") {
      json = true;
      continue;
    }
    if (!command && DAEMON_CLIENT_COMMANDS.has(arg)) {
      command = arg;
      continue;
    }
    positionals.push(arg);
  }
  command = command ?? "open";
  return { command, socketPath, json, positionals };
}
async function runDaemonClientCommand(parsed) {
  if (parsed.command === "open") {
    await runOpen(parsed);
    return;
  }
  if (parsed.command === "start") {
    await runStart(parsed);
    return;
  }
  if (parsed.command === "ps") {
    await runPsCommand(parsed);
    return;
  }
  const client = new DaemonClient(parsed.socketPath);
  await client.connect();
  try {
    switch (parsed.command) {
      case "list":
        await runList(client, parsed.positionals, parsed.json);
        return;
      case "create":
        await runCreate(client, parsed.positionals, parsed.json);
        return;
      case "attach":
        if (parsed.json) {
          await runJsonAttach(client, requireActiveSessionId(parsed.positionals));
        } else {
          await runAttach(client, requireActiveSessionId(parsed.positionals));
        }
        return;
      case "detach":
        await printResponseData(client, parsed.positionals[0] ? { type: "detach", activeSessionId: parsed.positionals[0] } : { type: "detach" }, parsed.json);
        return;
      case "kill":
        await printResponseData(client, { type: "kill", activeSessionId: requireActiveSessionId(parsed.positionals) }, parsed.json);
        return;
      case "rename":
        await runRename(client, parsed.positionals, parsed.json);
        return;
      case "prompt":
        await runPrompt(client, parsed.positionals);
        return;
      case "send":
        await runSend(client, parsed.positionals, parsed.json);
        return;
      case "agent-messages":
        await runAgentMessages(client, parsed.positionals, parsed.json);
        return;
      case "steer":
        await runMessageCommand(client, "steer", parsed.positionals, parsed.json);
        return;
      case "follow-up":
        await runMessageCommand(client, "follow_up", parsed.positionals, parsed.json);
        return;
      case "state":
        await printResponseData(client, { type: "get_state", activeSessionId: requireActiveSessionId(parsed.positionals) }, true);
        return;
      case "messages":
        await printResponseData(client, { type: "get_messages", activeSessionId: requireActiveSessionId(parsed.positionals) }, true);
        return;
      case "stats":
        await printResponseData(client, { type: "get_session_stats", activeSessionId: requireActiveSessionId(parsed.positionals) }, true);
        return;
      case "commands":
        await printResponseData(client, { type: "get_commands", activeSessionId: requireActiveSessionId(parsed.positionals) }, true);
        return;
      case "cron":
        await runCron(client, parsed.positionals, parsed.json);
        return;
      case "retry":
        if (parsed.positionals.length !== 1) {
          throw new Error("Usage: daemon retry <session>");
        }
        await printResponseData(client, { type: "retry_worker", activeSessionId: parsed.positionals[0] }, parsed.json);
        return;
      case "restart":
        if (parsed.positionals.length !== 0) {
          throw new Error("Usage: daemon restart");
        }
        await printResponseData(client, { type: "restart" }, parsed.json);
        return;
      case "shutdown":
        await runShutdown(client, parsed.positionals, parsed.json);
        return;
    }
  } finally {
    client.close();
  }
}
async function runShutdown(client, args, json) {
  let force = false;
  for (const arg of args) {
    if (arg === "--force" || arg === "-f") {
      force = true;
      continue;
    }
    throw new Error(`Unknown shutdown option: ${arg}`);
  }
  await printResponseData(client, { type: "shutdown", force }, json);
}
async function runOpen(parsed) {
  const sessionArgs = parseSessionArgs(parsed.positionals);
  if (!await canConnectToDaemon(parsed.socketPath, 250)) {
    await runStart({ ...parsed, command: "start", positionals: sessionArgs.daemonArgs });
  }
  const client = new DaemonClient(parsed.socketPath);
  await client.connect();
  try {
    const autoName = sessionArgs.name === void 0;
    const sessions = await getLiveSessions(client, autoName);
    let sessionName = sessionArgs.name ?? nextDefaultSessionName(sessions);
    let response;
    while (true) {
      response = await client.request({
        type: "create",
        name: sessionName,
        config: sessionArgs.config,
        sessionPath: sessionArgs.sessionPath,
        continueRecent: sessionArgs.continueRecent
      });
      if (response.success || !autoName || !response.error.includes(`Agent name "${sessionName}" is unavailable`)) {
        break;
      }
      sessions.push({ sessionName });
      sessionName = nextDefaultSessionName(sessions);
    }
    const data = requireSuccess(response);
    if (!isLiveSessionSummary(data)) {
      throw new Error("Daemon returned an invalid create response");
    }
    await runAttach(client, data.activeSessionId);
  } finally {
    client.close();
  }
}
var SESSION_BOOLEAN_FLAGS = /* @__PURE__ */ new Set([
  "--continue",
  "-c",
  "--no-session",
  "--no-tools",
  "-nt",
  "--no-builtin-tools",
  "-nbt",
  "--no-extensions",
  "-ne",
  "--no-skills",
  "-ns",
  "--no-prompt-templates",
  "-np",
  "--no-themes",
  "--no-context-files",
  "-nc",
  "--verbose",
  "--offline",
  "--foreground",
  "--no-detach",
  "--background",
  "-d"
]);
function parseSessionArgs(args) {
  const daemonArgs = [];
  const nameParts = [];
  const config = {};
  const pathBaseCwd = findSessionCwdArg(args) ?? process.cwd();
  let sessionPath;
  let continueRecent;
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === "--") {
      nameParts.push(...args.slice(index + 1));
      break;
    }
    if (arg === "--name") {
      const value = args[index + 1];
      if (!value) {
        throw new Error("--name requires a value");
      }
      nameParts.push(value);
      index++;
      continue;
    }
    if (arg === "--cwd") {
      config.cwd = resolve4(expandTildePath(requireOptionValue(args, index, arg)));
      index++;
      continue;
    }
    if (arg.startsWith("-")) {
      const parsedOption = parseSessionOption(args, index, config, pathBaseCwd);
      if (!parsedOption) {
        nameParts.push(arg);
        continue;
      }
      if (parsedOption.daemonArg) {
        daemonArgs.push(parsedOption.daemonArg);
        if (parsedOption.value !== void 0) {
          daemonArgs.push(parsedOption.value);
        }
      }
      if (parsedOption.sessionPath !== void 0) {
        sessionPath = parsedOption.sessionPath;
      }
      if (parsedOption.continueRecent !== void 0) {
        continueRecent = parsedOption.continueRecent;
      }
      index += parsedOption.consumed;
      continue;
    }
    nameParts.push(arg);
  }
  const name = nameParts.join(" ").trim();
  if (config.initialGoal?.tokenBudget !== void 0 && !config.initialGoal.objective) {
    throw new Error("--goal-token-budget requires --goal");
  }
  return {
    daemonArgs,
    name: name || void 0,
    config: Object.keys(config).length > 0 ? config : void 0,
    sessionPath,
    continueRecent
  };
}
function parseSessionOption(args, index, config, pathBaseCwd) {
  const arg = args[index];
  if (!arg?.startsWith("-")) {
    return void 0;
  }
  const readValue = (optionName = arg) => requireOptionValue(args, index, optionName);
  const withValue = (daemonArg = arg, value = readValue()) => ({ consumed: 1, daemonArg, value });
  const withParsedValue = (daemonArg, apply2) => {
    const value = readValue(daemonArg);
    apply2(value);
    return withValue(daemonArg, value);
  };
  const withSessionSelector = (value, consumed) => {
    if (!value) {
      throw new Error(`${arg.split("=")[0]} requires a value`);
    }
    return {
      consumed,
      sessionPath: looksLikeSessionPath2(value) ? resolvePathOption(value, config.cwd ?? pathBaseCwd) : value
    };
  };
  const boolean = (daemonArg = arg) => ({ consumed: 0, daemonArg });
  if (arg.startsWith("--resume=")) {
    return withSessionSelector(arg.slice("--resume=".length), 0);
  }
  switch (arg) {
    case "--continue":
    case "-c":
      return { consumed: 0, continueRecent: true };
    case "--resume":
    case "-r":
      return withSessionSelector(readValue(), 1);
    case "--session-dir":
      return withParsedValue(arg, (value) => {
        config.sessionDir = expandTildePath(value);
      });
    case "--provider":
      return withParsedValue(arg, (value) => {
        config.provider = value;
      });
    case "--model":
      return withParsedValue(arg, (value) => {
        config.model = value;
      });
    case "--api-key":
      return withParsedValue(arg, (value) => {
        config.apiKey = value;
      });
    case "--system-prompt":
      return withParsedValue(arg, (value) => {
        config.systemPrompt = value;
      });
    case "--append-system-prompt":
      return withParsedValue(arg, (value) => {
        config.appendSystemPrompt = [...config.appendSystemPrompt ?? [], value];
      });
    case "--models": {
      const value = readValue();
      config.models = parseCsvValue(value);
      return withValue(arg, value);
    }
    case "--tools":
    case "-t": {
      const value = readValue();
      config.tools = parseCsvValue(value);
      return withValue(arg, value);
    }
    case "--thinking": {
      const level = readValue();
      if (!isValidThinkingLevel(level)) {
        throw new Error(`Invalid thinking level "${level}"`);
      }
      config.thinking = level;
      return withValue(arg);
    }
    case "--extension":
    case "-e":
      return withParsedValue(arg, (value) => {
        config.extensions = [...config.extensions ?? [], resolvePathOption(value, config.cwd ?? pathBaseCwd)];
      });
    case "--skill":
      return withParsedValue(arg, (value) => {
        config.skills = [...config.skills ?? [], resolvePathOption(value, config.cwd ?? pathBaseCwd)];
      });
    case "--prompt-template":
      return withParsedValue(arg, (value) => {
        config.promptTemplates = [
          ...config.promptTemplates ?? [],
          resolvePathOption(value, config.cwd ?? pathBaseCwd)
        ];
      });
    case "--theme":
      return withParsedValue(arg, (value) => {
        config.themes = [...config.themes ?? [], resolvePathOption(value, config.cwd ?? pathBaseCwd)];
      });
    case "--no-tools":
    case "-nt":
      config.noTools = true;
      return boolean(arg);
    case "--no-builtin-tools":
    case "-nbt":
      config.noBuiltinTools = true;
      return boolean(arg);
    case "--no-extensions":
    case "-ne":
      config.noExtensions = true;
      return boolean(arg);
    case "--no-skills":
    case "-ns":
      config.noSkills = true;
      return boolean(arg);
    case "--no-prompt-templates":
    case "-np":
      config.noPromptTemplates = true;
      return boolean(arg);
    case "--no-themes":
      config.noThemes = true;
      return boolean(arg);
    case "--no-context-files":
    case "-nc":
      config.noContextFiles = true;
      return boolean(arg);
    case "--goal": {
      const value = readValue(arg);
      if (!value.trim()) {
        throw new Error("--goal requires a non-empty objective");
      }
      config.initialGoal = { objective: value, tokenBudget: config.initialGoal?.tokenBudget };
      return { consumed: 1 };
    }
    case "--goal-token-budget": {
      const value = readValue(arg);
      const budget = Number(value);
      if (!Number.isInteger(budget) || budget <= 0) {
        throw new Error("--goal-token-budget must be a positive integer");
      }
      config.initialGoal = {
        objective: config.initialGoal?.objective ?? "",
        tokenBudget: budget
      };
      return { consumed: 1 };
    }
    case "--foreground":
    case "--no-detach":
    case "--background":
    case "-d":
    case "--verbose":
    case "--offline":
      return SESSION_BOOLEAN_FLAGS.has(arg) ? boolean(arg) : void 0;
    case "--no-session":
      throw new Error("--no-session is not supported for daemon sessions; daemon-owned sessions are always persisted");
    default:
      if (!arg.startsWith("--")) {
        return void 0;
      }
      return parseExtensionFlagOption(args, index, config);
  }
}
function parseCsvValue(value) {
  return value.split(",").map((part) => part.trim()).filter((part) => part.length > 0);
}
function findSessionCwdArg(args) {
  for (let index = 0; index < args.length; index++) {
    if (args[index] === "--") {
      return void 0;
    }
    if (args[index] === "--cwd") {
      return resolve4(expandTildePath(requireOptionValue(args, index, "--cwd")));
    }
  }
  return void 0;
}
function parseExtensionFlagOption(args, index, config) {
  const arg = args[index];
  const eqIndex = arg.indexOf("=");
  config.extensionFlagValues = config.extensionFlagValues ?? {};
  if (eqIndex !== -1) {
    config.extensionFlagValues[arg.slice(2, eqIndex)] = arg.slice(eqIndex + 1);
    return { consumed: 0, daemonArg: arg };
  }
  const name = arg.slice(2);
  config.extensionFlagValues[name] = true;
  return { consumed: 0, daemonArg: arg };
}
function looksLikeSessionPath2(value) {
  return value.includes("/") || value.includes("\\") || value.endsWith(".jsonl");
}
function requireOptionValue(args, index, option) {
  const value = args[index + 1];
  if (!value) {
    throw new Error(`${option} requires a value`);
  }
  return value;
}
function resolvePathOption(value, cwd) {
  const expanded = expandTildePath(value);
  return isLocalPath(expanded) ? resolve4(cwd, expanded) : expanded;
}
async function getLiveSessions(client, all = false) {
  const response = await client.request({ type: "list", ...all ? { all: true } : {} });
  const data = requireSuccess(response);
  const sessions = getSessionSummaries(data);
  if (!sessions) {
    throw new Error("Daemon returned an invalid list response");
  }
  return sessions;
}
function nextDefaultSessionName(sessions) {
  const existingNames = new Set(sessions.map((session) => session.sessionName).filter((name) => !!name));
  const numericNames = [...existingNames].map((name) => Number.parseInt(name, 10)).filter((value) => Number.isSafeInteger(value) && value > 0);
  let next = numericNames.length > 0 ? Math.max(...numericNames) + 1 : 1;
  while (Number.isSafeInteger(next)) {
    if (!existingNames.has(String(next))) {
      return String(next);
    }
    next++;
  }
  let fallback = "session";
  while (existingNames.has(fallback)) {
    fallback += "-";
  }
  return fallback;
}
async function runStart(parsed) {
  if (await canConnectToDaemon(parsed.socketPath, 250)) {
    console.log(`Daemon already running on ${parsed.socketPath}`);
    return;
  }
  const entrypoint = process.argv[1];
  if (!entrypoint) {
    throw new Error("Cannot determine current CLI entrypoint for daemon launch");
  }
  const sessionArgs = parseSessionArgs(parsed.positionals);
  const daemonArgs = [
    ...process.execArgv,
    entrypoint,
    "--mode",
    "daemon",
    "--daemon-socket",
    parsed.socketPath,
    ...sessionArgs.daemonArgs.filter((arg) => arg !== "--background" && arg !== "-d")
  ];
  const child = spawn2(process.execPath, daemonArgs, {
    cwd: sessionArgs.config?.cwd ?? process.cwd(),
    detached: true,
    env: process.env,
    stdio: "ignore"
  });
  child.unref();
  const deadline = Date.now() + 1e4;
  while (Date.now() < deadline) {
    if (await canConnectToDaemon(parsed.socketPath, 250)) {
      console.log(`Daemon started on ${parsed.socketPath} (pid ${child.pid})`);
      return;
    }
    await delay2(25);
  }
  throw new Error(`Timed out waiting for daemon to start on ${parsed.socketPath}`);
}
async function runPsCommand(parsed) {
  let reap = false;
  let force = false;
  for (const arg of parsed.positionals) {
    if (arg === "--reap" || arg === "reap") {
      reap = true;
    } else if (arg === "--force" || arg === "-f") {
      force = true;
    } else {
      throw new Error(`Unknown ps option: ${arg}`);
    }
  }
  if (reap) {
    await runReap(parsed.json, force);
    return;
  }
  await runPs(parsed.json);
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
async function runList(client, args, json) {
  const { all } = parseListArgs(args);
  const response = await client.request({ type: "list", all });
  const data = requireSuccess(response);
  if (json) {
    printJson(data);
    return;
  }
  const sessions = getSessionSummaries(data);
  if (!sessions) {
    printJson(data);
    return;
  }
  if (sessions.length === 0) {
    console.log(all ? "No agents." : "No active agents.");
    return;
  }
  console.log(formatSessionListTable(sessions));
}
function parseListArgs(args) {
  let all = false;
  for (const arg of args) {
    if (arg === "-a" || arg === "--all") {
      all = true;
      continue;
    }
    throw new Error(`Unknown list option: ${arg}`);
  }
  return { all };
}
async function runCreate(client, args, json) {
  const sessionArgs = parseSessionArgs(args);
  const response = await client.request({
    type: "create",
    name: sessionArgs.name,
    config: sessionArgs.config,
    sessionPath: sessionArgs.sessionPath,
    continueRecent: sessionArgs.continueRecent
  });
  const data = requireSuccess(response);
  if (json) {
    printJson(data);
    return;
  }
  if (isLiveSessionSummary(data)) {
    console.log(`Created ${data.activeSessionId}${data.sessionName ? ` (${data.sessionName})` : ""}`);
    return;
  }
  printJson(data);
}
async function runAttach(client, activeSessionId) {
  const terminal = new DaemonAttachTerminal(client, activeSessionId);
  await terminal.run();
}
async function runJsonAttach(client, activeSessionId) {
  const unsubscribeOutput = client.onMessage(printJsonLine);
  const sessionClosed = waitForSessionClose(client, activeSessionId);
  const interrupted = waitUntilInterrupted();
  try {
    await requireSuccessAsync(client.request({ type: "attach", activeSessionId }));
    await Promise.race([sessionClosed.promise, interrupted.promise]);
  } finally {
    unsubscribeOutput();
    sessionClosed.cancel();
    interrupted.cancel();
  }
}
async function runRename(client, args, json) {
  const activeSessionId = requireActiveSessionId(args);
  const name = args.slice(1).join(" ").trim();
  if (!name) {
    throw new Error("Usage: prime-agent rename <agent> <name>");
  }
  const response = await client.request({ type: "rename", activeSessionId, name });
  const data = requireSuccess(response);
  if (json) {
    printJson(data);
    return;
  }
  if (isLiveSessionSummary(data)) {
    console.log(`Renamed ${data.activeSessionId} to ${data.sessionName ?? name}`);
    return;
  }
  printJson(data);
}
async function runPrompt(client, args) {
  const activeSessionId = requireActiveSessionId(args);
  const message = args.slice(1).join(" ").trim();
  if (!message) {
    throw new Error("Usage: daemon prompt <session> <message>");
  }
  let promptAcknowledged = false;
  const finished = waitForSessionEnd(client, activeSessionId, () => promptAcknowledged);
  const unsubscribeOutput = client.onMessage(printJsonLine);
  try {
    await requireSuccessAsync(client.request({ type: "attach", activeSessionId }));
    await requireSuccessAsync(client.request({ type: "prompt", activeSessionId, message }));
    promptAcknowledged = true;
    await finished.promise;
  } finally {
    unsubscribeOutput();
    finished.cancel();
  }
}
async function runAgentMessages(client, args, json) {
  const subcommand = args[0];
  switch (subcommand) {
    case "status":
      requireNoExtraArgs(args, "daemon agent-messages status");
      await printResponseData(client, { type: "agent_messages_status" }, json);
      return;
    case "pause":
      requireNoExtraArgs(args, "daemon agent-messages pause");
      await printResponseData(client, { type: "agent_messages_pause" }, json);
      return;
    case "resume":
      requireNoExtraArgs(args, "daemon agent-messages resume");
      await printResponseData(client, { type: "agent_messages_resume" }, json);
      return;
    case "clear": {
      const activeSessionId = args[1];
      if (!activeSessionId || args.length !== 2) {
        throw new Error("Usage: daemon agent-messages clear <session>");
      }
      await printResponseData(client, { type: "agent_messages_clear", activeSessionId }, json);
      return;
    }
    default:
      throw new Error("Usage: daemon agent-messages <status|pause|resume|clear>");
  }
}
function requireNoExtraArgs(args, usage) {
  if (args.length > 1) {
    throw new Error(`Usage: ${usage}`);
  }
}
async function runSend(client, args, json) {
  const parsed = parseSendArgs(args);
  const response = await client.request({
    type: "send_message",
    targetActiveSessionId: parsed.targetActiveSessionId,
    fromActiveSessionId: parsed.fromActiveSessionId,
    message: parsed.message
  });
  const data = requireSuccess(response);
  if (json) {
    printJson(data);
    return;
  }
  if (isAgentMessageReceipt(data)) {
    const target = data.target.sessionName ?? data.target.activeSessionId;
    console.log(data.deliveryStatus === "queued" ? `Queued for ${target}` : `Sent to ${target}`);
    return;
  }
  console.log("ok");
}
function parseSendArgs(args) {
  let fromActiveSessionId;
  let targetActiveSessionId;
  let explicitMessage;
  const messageParts = [];
  let parseOptions = true;
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (parseOptions && arg === "--") {
      parseOptions = false;
      continue;
    }
    if (parseOptions && arg === "--from") {
      const value = args[index + 1];
      if (!value) {
        throw new Error("--from requires a session id or name");
      }
      fromActiveSessionId = value;
      index++;
      continue;
    }
    if (parseOptions && arg === "--message") {
      if (!targetActiveSessionId) {
        throw new Error("--message must appear after the target session");
      }
      const value = args[index + 1];
      if (!value) {
        throw new Error("--message requires message text");
      }
      explicitMessage = value;
      index++;
      parseOptions = false;
      continue;
    }
    if (parseOptions && arg.startsWith("--")) {
      throw new Error(`Unknown option for send: ${arg} (use -- before message text starting with --)`);
    }
    if (!targetActiveSessionId) {
      targetActiveSessionId = arg;
      continue;
    }
    messageParts.push(arg);
  }
  if (explicitMessage !== void 0 && messageParts.length > 0) {
    throw new Error("Usage: prime-agent send [--from <agent>] <agent> [--message <message>|<message>]");
  }
  const message = (explicitMessage ?? messageParts.join(" ")).trim();
  if (!targetActiveSessionId || !message) {
    throw new Error("Usage: prime-agent send [--from <agent>] <agent> [--message <message>|<message>]");
  }
  return {
    targetActiveSessionId,
    fromActiveSessionId,
    message
  };
}
async function runMessageCommand(client, type, args, json) {
  const activeSessionId = requireActiveSessionId(args);
  const message = args.slice(1).join(" ").trim();
  if (!message) {
    const command = type === "follow_up" ? "follow-up" : type;
    throw new Error(`Usage: daemon ${command} <session> <message>`);
  }
  await printResponseData(client, { type, activeSessionId, message }, json);
}
async function runCron(client, args, json) {
  const subcommand = args[0] ?? "list";
  if (subcommand === "list") {
    const includeInactive = args.includes("--all") || args.includes("-a");
    const selector = args.find((arg) => !arg.startsWith("-") && arg !== "list");
    const activeSessionId = selector ? await resolveLiveSessionSelector(client, selector) : void 0;
    const response = await client.request({ type: "cron_list", activeSessionId, includeInactive });
    const data = requireSuccess(response);
    if (json) {
      printJson(data);
      return;
    }
    const jobs = getCronJobs(data);
    if (!jobs) {
      printJson(data);
      return;
    }
    if (jobs.length === 0) {
      console.log("No scheduled prompts.");
      return;
    }
    for (const job of jobs) {
      console.log(formatAgentCronJob(job));
    }
    return;
  }
  if (subcommand === "add" || subcommand === "schedule") {
    const separator = args.indexOf("--");
    if (separator < 0) {
      throw new Error("Usage: prime-agent schedule add <agent> <schedule> -- <message>");
    }
    const activeSessionId = args[1];
    if (!activeSessionId) {
      throw new Error("Usage: prime-agent schedule add <agent> <schedule> -- <message>");
    }
    const schedule = args.slice(2, separator).join(" ").trim();
    const message = args.slice(separator + 1).join(" ").trim();
    if (!schedule || !message) {
      throw new Error("Usage: prime-agent schedule add <agent> <schedule> -- <message>");
    }
    const response = await client.request({ type: "cron_add", activeSessionId, schedule, prompt: message });
    const data = requireSuccess(response);
    if (json) {
      printJson(data);
      return;
    }
    const job = getCronJob(data);
    console.log(job ? `Scheduled ${job.id} next=${job.nextRunAt ?? "-"}` : "Scheduled prompt.");
    return;
  }
  if (subcommand === "cancel" || subcommand === "delete" || subcommand === "remove") {
    const jobId = args[1];
    if (!jobId) {
      throw new Error("Usage: prime-agent schedule cancel <job-id>");
    }
    const response = await client.request({ type: "cron_cancel", jobId });
    const data = requireSuccess(response);
    if (json) {
      printJson(data);
      return;
    }
    const job = getCronJob(data);
    console.log(job ? `Cancelled ${job.id}` : "Cancelled cron job.");
    return;
  }
  throw new Error(`Unknown schedule command: ${subcommand}`);
}
async function resolveLiveSessionSelector(client, selector) {
  const sessions = (await getLiveSessions(client)).filter((session) => typeof session.activeSessionId === "string");
  const exact = sessions.filter((session) => session.activeSessionId === selector || session.sessionId === selector || session.sessionName === selector);
  const suffix = sessions.filter((session) => matchesSessionIdSuffix(session.activeSessionId, selector) || matchesSessionIdSuffix(session.sessionId, selector));
  const matches = exact.length > 0 ? exact : suffix;
  if (matches.length === 1) {
    return matches[0].activeSessionId;
  }
  if (matches.length > 1) {
    throw new Error(`Ambiguous active session "${selector}"`);
  }
  throw new Error(`Unknown active session: ${selector}`);
}
async function printResponseData(client, command, json) {
  const response = await client.request(command);
  const data = requireSuccess(response);
  if (json || data !== void 0) {
    printJson(data ?? response);
    return;
  }
  console.log("ok");
}
function requireActiveSessionId(args) {
  const activeSessionId = args[0];
  if (!activeSessionId) {
    throw new Error("Missing agent id or name");
  }
  return activeSessionId;
}
function requireSuccess(response) {
  if (!response.success) {
    throw new Error(response.error);
  }
  return "data" in response ? response.data : void 0;
}
async function requireSuccessAsync(responsePromise) {
  return requireSuccess(await responsePromise);
}
function createDaemonMessageWaiter(client, shouldResolveOnMessage) {
  let unsubscribeMessages = () => {
  };
  let unsubscribeClose = () => {
  };
  let settled = false;
  let resolveWait;
  let rejectWait;
  const cleanup = () => {
    unsubscribeMessages();
    unsubscribeClose();
  };
  const resolveOnce = () => {
    if (settled) {
      return;
    }
    settled = true;
    cleanup();
    resolveWait();
  };
  const rejectOnce = (error) => {
    if (settled) {
      return;
    }
    settled = true;
    cleanup();
    rejectWait(error);
  };
  const promise = new Promise((resolve6, reject) => {
    resolveWait = resolve6;
    rejectWait = reject;
  });
  unsubscribeMessages = client.onMessage((message) => {
    if (shouldResolveOnMessage(message)) {
      resolveOnce();
    }
  });
  unsubscribeClose = client.onClose((error) => {
    rejectOnce(error);
  });
  return { promise, cancel: resolveOnce };
}
function waitForSessionEnd(client, activeSessionId, isPromptAcknowledged) {
  let observedAgentStart = false;
  return createDaemonMessageWaiter(client, (message) => {
    if (message.type === "session_closed" && message.activeSessionId === activeSessionId) {
      return true;
    }
    if (message.type !== "session_event" || message.activeSessionId !== activeSessionId) {
      return false;
    }
    if (message.event.type === "agent_start") {
      observedAgentStart = true;
      return false;
    }
    return message.event.type === "agent_end" && (observedAgentStart || (isPromptAcknowledged?.() ?? false));
  });
}
function waitForSessionClose(client, activeSessionId) {
  return createDaemonMessageWaiter(client, (message) => message.type === "session_closed" && message.activeSessionId === activeSessionId);
}
function waitUntilInterrupted() {
  let settled = false;
  let resolveWait;
  const cleanup = () => {
    process.off("SIGINT", onSigint);
    process.off("SIGTERM", onSigterm);
  };
  const resolveOnce = () => {
    if (settled) {
      return;
    }
    settled = true;
    cleanup();
    resolveWait();
  };
  const onSigint = () => {
    resolveOnce();
  };
  const onSigterm = () => {
    resolveOnce();
  };
  const promise = new Promise((resolve6) => {
    resolveWait = resolve6;
  });
  process.once("SIGINT", onSigint);
  process.once("SIGTERM", onSigterm);
  return { promise, cancel: resolveOnce };
}
function printJson(value) {
  console.log(JSON.stringify(value, null, 2));
}
var printJsonLine = (value) => {
  console.log(JSON.stringify(value));
};
var DaemonAttachTerminal = class {
  constructor(client, activeSessionId) {
    this.client = client;
    this.activeSessionId = activeSessionId;
    this.isStreaming = false;
    this.prompt = source_default.green("prime-agent> ");
  }
  async run() {
    this.rl = createInterface2({
      input: process.stdin,
      output: process.stdout,
      terminal: true
    });
    this.rl.setPrompt(this.prompt);
    const unsubscribe = this.client.onMessage((message) => this.handleMessage(message));
    this.rl.on("line", (line) => {
      void this.handleInput(line).catch((error) => {
        this.writeLine(source_default.red(error instanceof Error ? error.message : String(error)));
      });
    });
    this.rl.on("SIGINT", () => {
      this.rl?.close();
    });
    const closePromise = new Promise((resolve6) => {
      this.rl?.once("close", resolve6);
    });
    try {
      await requireSuccessAsync(this.client.request({ type: "attach", activeSessionId: this.activeSessionId }));
      await closePromise;
    } finally {
      unsubscribe();
      this.rl?.removeAllListeners();
      this.rl = void 0;
      await this.client.request({ type: "detach", activeSessionId: this.activeSessionId }).catch(() => void 0);
      process.stdin.pause();
      process.stdout.write(`${source_default.dim("Detached.")}
`);
    }
  }
  async handleInput(line) {
    const input = line.trim();
    if (!input) {
      this.rl?.prompt();
      return;
    }
    if (input === "/quit" || input === "/exit" || input === "/detach") {
      this.rl?.close();
      return;
    }
    if (input === "/help") {
      this.printHelp();
      this.rl?.prompt();
      return;
    }
    if (input === "/abort") {
      requireSuccess(await this.client.request({ type: "abort", activeSessionId: this.activeSessionId }));
      this.writeLine(source_default.dim("Abort requested."));
      return;
    }
    if (input === "/state") {
      const response = await this.client.request({ type: "get_state", activeSessionId: this.activeSessionId });
      this.writeLine(JSON.stringify(requireSuccess(response), null, 2));
      return;
    }
    if (input === "/messages") {
      const response = await this.client.request({ type: "get_messages", activeSessionId: this.activeSessionId });
      const data = requireSuccess(response);
      if (isMessagesData(data)) {
        this.writeLine(source_default.bold("Transcript"));
        this.printTranscript(data.messages);
      } else {
        this.writeLine(JSON.stringify(data, null, 2));
      }
      return;
    }
    if (this.isStreaming) {
      requireSuccess(await this.client.request({ type: "follow_up", activeSessionId: this.activeSessionId, message: input }));
      this.writeLine(source_default.dim("Queued follow-up."));
      return;
    }
    requireSuccess(await this.client.request({ type: "prompt", activeSessionId: this.activeSessionId, message: input }));
  }
  handleMessage(message) {
    switch (message.type) {
      case "daemon_hello":
        return;
      case "session_attached":
        this.isStreaming = message.state.isStreaming;
        this.writeLine(source_default.bold(`Attached to ${message.state.sessionName ?? message.activeSessionId}`));
        if (message.state.model) {
          this.writeLine(source_default.dim(`Model: ${message.state.model.provider}/${message.state.model.id}`));
        }
        if (message.state.sessionFile) {
          this.writeLine(source_default.dim(`Session: ${message.state.sessionFile}`));
        }
        this.printHelp();
        if (message.messages.length > 0) {
          this.writeLine(source_default.bold("Transcript"));
          this.printTranscript(message.messages);
        }
        this.rl?.prompt();
        return;
      case "session_event":
        if (message.event.type !== "refine_complete") {
          this.handleSessionEvent(message.event);
        }
        return;
      case "session_replaced":
        this.isStreaming = message.state.isStreaming;
        this.writeLine(source_default.dim(`Session replaced: ${message.state.sessionName ?? message.activeSessionId}`));
        if (message.messages.length > 0) {
          this.writeLine(source_default.bold("Transcript"));
          this.printTranscript(message.messages);
        }
        this.rl?.prompt();
        return;
      case "session_resynced":
        this.isStreaming = message.snapshot.state.isStreaming;
        this.writeLine(source_default.dim(`Session resynchronized: ${message.snapshot.state.sessionName ?? message.activeSessionId}`));
        if (message.snapshot.messages.length > 0) {
          this.writeLine(source_default.bold("Transcript"));
          this.printTranscript(message.snapshot.messages);
        }
        this.rl?.prompt();
        return;
      case "session_detached":
        return;
      case "session_closed":
        this.writeLine(source_default.yellow(`Session closed: ${message.reason}`));
        this.rl?.close();
        return;
      case "extension_ui_request":
        this.writeLine(source_default.dim(`Extension UI request: ${message.method}`));
        return;
      case "extension_error":
        this.writeLine(source_default.red(`Extension error (${message.extensionPath}, ${message.event}): ${message.error}`));
        return;
      case "response":
        if (!message.success) {
          this.writeLine(source_default.red(message.error));
        }
        return;
    }
  }
  handleSessionEvent(event) {
    switch (event.type) {
      case "agent_start":
        this.isStreaming = true;
        this.writeLine(source_default.dim("Agent started."));
        return;
      case "agent_end":
        this.isStreaming = false;
        this.writeLine(source_default.dim("Agent idle."));
        return;
      case "message_end":
        this.printMessage(event.message);
        return;
      case "message_update":
        if (event.assistantMessageEvent.type === "toolcall_end") {
          this.writeLine(source_default.dim(`Tool call: ${event.assistantMessageEvent.toolCall.name}`));
        }
        return;
      case "tool_execution_start":
        this.writeLine(source_default.dim(`Tool started: ${event.toolName}`));
        return;
      case "tool_execution_end":
        this.writeLine(source_default.dim(`Tool ${event.isError ? "failed" : "finished"}: ${event.toolName}`));
        return;
      case "session_action_update":
        if (event.actions.queuedCount > 0) {
          this.writeLine(source_default.dim(`Queued: ${event.actions.steering.length} steering, ${event.actions.followUps.length} follow-up`));
        }
        return;
      case "session_info_changed":
        this.writeLine(source_default.dim(`Session name: ${event.name ?? "(unnamed)"}`));
        return;
      case "thinking_level_changed":
        this.writeLine(source_default.dim(`Thinking: ${event.level}`));
        return;
      case "compaction_start":
        this.writeLine(source_default.dim(`Compaction started: ${event.reason}`));
        return;
      case "compaction_end":
        this.writeLine(source_default.dim(`Compaction ${event.aborted ? "aborted" : "finished"}: ${event.reason}`));
        return;
      case "auto_retry_start":
        this.writeLine(source_default.dim(`Retry ${event.attempt}/${event.maxAttempts}: ${event.errorMessage}`));
        return;
      case "auto_retry_end":
        this.writeLine(source_default.dim(event.success ? "Retry succeeded." : `Retry failed: ${event.finalError ?? ""}`));
        return;
      case "rlm_child_update":
        this.writeLine(source_default.dim(`Subagent ${event.child.label}: ${event.child.status}`));
        return;
      case "goal_update":
        this.writeLine(source_default.dim(`Goal: ${event.goal.status}`));
        return;
      case "refine_failed":
        this.writeLine(source_default.red(`Refinement failed: ${event.error}`));
        return;
      case "refine_complete":
        return;
      case "turn_start":
      case "turn_end":
      case "message_start":
      case "tool_execution_update":
      case "auth_stale":
        return;
    }
  }
  printTranscript(messages) {
    for (const message of messages) {
      this.printMessage(message);
    }
  }
  printMessage(message) {
    const role = getMessageRole(message);
    const body = getMessageText(message).trim();
    const label = formatRole(role);
    this.writeLine(body ? `${label}
${indent(body)}` : `${label} ${source_default.dim("[no text content]")}`);
  }
  printHelp() {
    this.writeLine(source_default.dim("Type a message and press Enter. Commands: /help /state /messages /abort /detach"));
  }
  writeLine(text) {
    if (this.rl && process.stdout.isTTY) {
      clearLine(process.stdout, 0);
      cursorTo(process.stdout, 0);
    }
    process.stdout.write(`${text}
`);
    this.rl?.prompt(true);
  }
};
function isMessagesData(value) {
  if (!value || typeof value !== "object") {
    return false;
  }
  return Array.isArray(value.messages);
}
function getMessageRole(message) {
  if (!message || typeof message !== "object" || !("role" in message) || typeof message.role !== "string") {
    return "message";
  }
  return message.role;
}
function getMessageText(message) {
  if (!message || typeof message !== "object" || !("content" in message)) {
    return JSON.stringify(message);
  }
  return formatContent(message.content);
}
function formatContent(content) {
  if (typeof content === "string") {
    return content;
  }
  if (Array.isArray(content)) {
    return content.map(formatContentBlock).filter((text) => text.length > 0).join("\n");
  }
  if (content === void 0 || content === null) {
    return "";
  }
  return JSON.stringify(content);
}
function formatContentBlock(block) {
  if (!block || typeof block !== "object" || !("type" in block) || typeof block.type !== "string") {
    return JSON.stringify(block);
  }
  switch (block.type) {
    case "text":
      return getStringProperty(block, "text");
    case "thinking": {
      const thinking = getStringProperty(block, "thinking");
      return thinking ? `[thinking]
${thinking}` : "[thinking]";
    }
    case "image": {
      const mimeType = getStringProperty(block, "mimeType");
      return mimeType ? `[image: ${mimeType}]` : "[image]";
    }
    case "toolCall": {
      const name = getStringProperty(block, "name");
      const args = getUnknownProperty(block, "arguments");
      const argsText = args === void 0 ? "" : ` ${JSON.stringify(args)}`;
      return `[tool call: ${name || "unknown"}${argsText}]`;
    }
    default:
      return JSON.stringify(block);
  }
}
function getStringProperty(value, key) {
  const record = value;
  const property = record[key];
  return typeof property === "string" ? property : "";
}
function getUnknownProperty(value, key) {
  return value[key];
}
function formatRole(role) {
  switch (role) {
    case "user":
      return source_default.blue.bold("user:");
    case "assistant":
      return source_default.green.bold("assistant:");
    case "toolResult":
      return source_default.magenta.bold("tool:");
    default:
      return source_default.bold(`${role}:`);
  }
}
function indent(text) {
  return text.split("\n").map((line) => `  ${line}`).join("\n");
}
function getSessionSummaries(value) {
  if (!value || typeof value !== "object") {
    return void 0;
  }
  const sessions = value.sessions;
  if (!Array.isArray(sessions)) {
    return void 0;
  }
  const entries = [];
  for (const session of sessions) {
    if (isSessionSummary(session)) {
      entries.push(session);
      continue;
    }
    return void 0;
  }
  return entries;
}
function isSessionSummary(value) {
  if (!value || typeof value !== "object") {
    return false;
  }
  const candidate = value;
  return typeof candidate.id === "string" && typeof candidate.sessionId === "string" && typeof candidate.cwd === "string" && typeof candidate.lifecycle === "string" && typeof candidate.activity === "string" && typeof candidate.isSessionActive === "boolean" && typeof candidate.isStreaming === "boolean" && typeof candidate.isCompacting === "boolean" && typeof candidate.attachedClients === "number" && typeof candidate.messageCount === "number" && (candidate.unfinishedActionCount === void 0 || typeof candidate.unfinishedActionCount === "number") && typeof candidate.sessionActions === "object" && candidate.sessionActions !== null && typeof candidate.sessionActions.queuedCount === "number" && Array.isArray(candidate.sessionActions.steering) && Array.isArray(candidate.sessionActions.followUps);
}
function isLiveSessionSummary(value) {
  return isSessionSummary(value) && typeof value.activeSessionId === "string";
}
function getCronJobs(value) {
  if (!value || typeof value !== "object") {
    return void 0;
  }
  const jobs = value.jobs;
  return Array.isArray(jobs) ? jobs : void 0;
}
function getCronJob(value) {
  if (!value || typeof value !== "object") {
    return void 0;
  }
  const job = value.job;
  if (!job || typeof job !== "object" || typeof job.id !== "string") {
    return void 0;
  }
  const candidate = job;
  return { id: candidate.id, ...typeof candidate.nextRunAt === "string" ? { nextRunAt: candidate.nextRunAt } : {} };
}
function isAgentMessageReceipt(value) {
  if (!value || typeof value !== "object") {
    return false;
  }
  const target = value.target;
  return !!target && typeof target === "object" && typeof target.activeSessionId === "string";
}

// dist/cli/public-command.js
var HANDLED = { handled: true, args: [], explicitAgentsView: false };
async function handlePublicCommand(args) {
  try {
    return await runPublicCommand(args);
  } catch (error) {
    return fail(error instanceof Error ? error.message : String(error));
  }
}
async function runPublicCommand(args) {
  args = normalizeLeadingDaemonSocketOption(args);
  if (args[0] === "help" && isHelpCommandRequest(args.slice(1))) {
    return printRequestedHelp(args.slice(1));
  }
  const command = args[0];
  if (!command) {
    return continueWith(args);
  }
  if (REMOVED_COMMAND_NAMES.has(command)) {
    return rejectRemovedCommand(args);
  }
  if (!PUBLIC_COMMAND_NAMES.has(command)) {
    return continueWith(args);
  }
  if (command === "update" && process.env[SELF_UPDATE_INTERACTIVE_CHILD_ENV] === "1") {
    await handlePackageCommand(args);
    return HANDLED;
  }
  if (command === "update" && args.includes(DAEMON_UPDATE_RESTART_COORDINATOR_FLAG)) {
    await handlePackageCommand(args);
    return HANDLED;
  }
  const separatorIndex = args.indexOf("--");
  const helpIndex = args.findIndex((arg, index) => index > 0 && (separatorIndex === -1 || index < separatorIndex) && (arg === "--help" || arg === "-h"));
  if (helpIndex !== -1) {
    return printRequestedHelp(getCommandPath(args.slice(0, helpIndex)));
  }
  switch (command) {
    case "agents":
      return { handled: false, args: args.slice(1), explicitAgentsView: true };
    case "list":
      return runInternalAgentCommand("list", args.slice(1));
    case "attach": {
      const rest = args.slice(1);
      const agent = rest[0];
      const options = rest.slice(1);
      if (!agent || agent.startsWith("-") || hasPositionalArguments(options)) {
        return fail(`Usage: ${APP_NAME} ${getCommandSpec(["attach"]).usage}`);
      }
      if (hasConflictingAttachOption(options)) {
        return fail("attach cannot be combined with --resume, --continue, or --fork.");
      }
      return {
        handled: false,
        args: ["--resume", agent, ...options],
        explicitAgentsView: false,
        attachAgent: agent
      };
    }
    case "stop":
      if (!requireOperandCount(args.slice(1), 1, 1, "stop"))
        return HANDLED;
      return runInternalAgentCommand("kill", args.slice(1));
    case "rename":
      if (!requireOperandCount(args.slice(1), 2, void 0, "rename"))
        return HANDLED;
      return runInternalAgentCommand("rename", args.slice(1));
    case "send":
      return runInternalAgentCommand("send", args.slice(1));
    case "schedule":
      return runNestedAgentCommand("schedule", "cron", args.slice(1));
    case "status":
      return runStatus(args.slice(1));
    case "doctor":
      return runDoctor(args.slice(1));
    case "shutdown":
      return runShutdown2(args.slice(1));
    case "package":
      return runPackage(args.slice(1));
    case "update": {
      const rest = args.slice(1);
      const hasLegacySelfTarget = rest.some((arg) => arg === "--self" || isSelfUpdateSource(arg));
      const hasLegacyPackageTarget = rest.some((arg) => arg === "--extensions" || arg === "--extension" || !arg.startsWith("-") && !isSelfUpdateSource(arg));
      if (hasLegacySelfTarget && hasLegacyPackageTarget) {
        return fail("Prime Agent and package updates are now separate.", `Run "${APP_NAME} update [--force]" and "${APP_NAME} package update [source]" separately.`);
      }
      if (hasLegacySelfTarget) {
        return fail("An update target is no longer needed.", `Use "${APP_NAME} update [--force]".`);
      }
      if (hasLegacyPackageTarget) {
        return fail("Package updates moved to the package command.", `Use "${APP_NAME} package update [source]".`);
      }
      const options = parseBooleanOptions(rest, /* @__PURE__ */ new Set(["--force"]), "update");
      if (!options)
        return HANDLED;
      await handlePackageCommand(["update", "--self", ...options]);
      return HANDLED;
    }
    case "model":
      return rewriteNestedCommand("model", "list", "--list-models", args.slice(1));
    case "session":
      return rewriteNestedCommand("session", "export", "--export", args.slice(1));
    case "config":
      if (!requireArgumentCount(args.slice(1), 0, "config"))
        return HANDLED;
      return continueWith(args);
    default:
      return continueWith(args);
  }
}
function normalizeLeadingDaemonSocketOption(args) {
  const option = args[0];
  if (option !== "--daemon-socket") {
    return args;
  }
  const socketPath = args[1];
  const command = args[2];
  if (socketPath === void 0 || command !== "stop" && command !== "rename") {
    return args;
  }
  return [command, ...args.slice(3), option, socketPath];
}
function continueWith(args) {
  return { handled: false, args, explicitAgentsView: false };
}
function printRequestedHelp(path) {
  if (path.length === 0) {
    console.log(formatTopLevelHelp());
    return HANDLED;
  }
  if (REMOVED_COMMAND_NAMES.has(path[0])) {
    return rejectRemovedCommand(path);
  }
  const help = formatCommandHelp(path);
  if (help) {
    console.log(help);
    return HANDLED;
  }
  const parent = path.slice(0, -1);
  const candidates = getChildCommandSpecs(parent).map((spec) => spec.path.at(-1));
  const suggestion = findCommandSuggestion(path.at(-1), candidates);
  return fail(`Unknown command: ${path.join(" ")}`, suggestion ? `Did you mean "${APP_NAME} help ${[...parent, suggestion].join(" ")}"?` : void 0);
}
function getCommandPath(args) {
  const path = [];
  for (const arg of args) {
    if (!getCommandSpec([...path, arg])) {
      break;
    }
    path.push(arg);
  }
  return path;
}
function rejectRemovedCommand(args) {
  const [command, subcommand] = args;
  let replacement;
  if (command === "daemon") {
    replacement = 'Run "prime-agent help" to see the agent commands.';
  } else if (command === "app" && subcommand === "update") {
    replacement = 'Use "prime-agent update".';
  } else if (command === "install") {
    replacement = 'Use "prime-agent package install".';
  } else if (command === "remove" || command === "uninstall") {
    replacement = 'Use "prime-agent package remove".';
  } else if (command === "manage") {
    replacement = 'Use "prime-agent agents".';
  }
  return fail(`Unknown command: ${args.slice(0, 2).join(" ")}`, replacement);
}
async function runInternalAgentCommand(command, args) {
  await handleDaemonCommand(["daemon", command, ...args]);
  return HANDLED;
}
async function runNestedAgentCommand(parent, internalCommand, args) {
  const subcommand = args[0];
  const children = getChildCommandSpecs([parent]).map((spec) => spec.path.at(-1));
  if (!subcommand || !children.includes(subcommand)) {
    const suggestion = subcommand ? findCommandSuggestion(subcommand, children) : void 0;
    return fail(subcommand ? `Unknown ${parent} command: ${subcommand}` : `Missing ${parent} command.`, suggestion ? `Did you mean "${APP_NAME} ${parent} ${suggestion}"?` : `Run "${APP_NAME} help ${parent}" for usage.`);
  }
  if (parent === "schedule" && !validateScheduleArgs(args)) {
    return HANDLED;
  }
  await handleDaemonCommand(["daemon", internalCommand, ...args]);
  return HANDLED;
}
async function runStatus(args) {
  const options = parseBooleanOptions(args, /* @__PURE__ */ new Set(["--json"]), "status");
  if (!options)
    return HANDLED;
  await runPs(options.has("--json"));
  return HANDLED;
}
async function runDoctor(args) {
  const options = parseBooleanOptions(args, /* @__PURE__ */ new Set(["--fix", "--json"]), "doctor");
  if (!options)
    return HANDLED;
  if (options.has("--fix")) {
    await runReap(options.has("--json"), false);
  } else {
    await runPs(options.has("--json"));
  }
  return HANDLED;
}
async function runShutdown2(args) {
  const options = parseBooleanOptions(args, /* @__PURE__ */ new Set(["--force", "--json"]), "shutdown");
  if (!options)
    return HANDLED;
  await runShutdownAll(options.has("--json"), options.has("--force"));
  return HANDLED;
}
async function runPackage(args) {
  const subcommand = args[0];
  if (subcommand === "uninstall") {
    return fail("Unknown package command: uninstall", `Use "${APP_NAME} package remove".`);
  }
  const children = getChildCommandSpecs(["package"]).map((spec) => spec.path.at(-1));
  if (!subcommand || !children.includes(subcommand)) {
    const suggestion = subcommand ? findCommandSuggestion(subcommand, children) : void 0;
    return fail(subcommand ? `Unknown package command: ${subcommand}` : "Missing package command.", suggestion ? `Did you mean "${APP_NAME} package ${suggestion}"?` : `Run "${APP_NAME} help package" for usage.`);
  }
  const rest = args.slice(1);
  if (subcommand === "list" && rest.length > 0) {
    return fail(`Usage: ${APP_NAME} package list`);
  }
  if (subcommand === "update") {
    if (rest.some((arg) => arg === "--self" || arg === "--extensions" || arg === "--extension" || arg === "--force")) {
      return fail('Package updates accept only an optional source. Use "prime-agent update --force" to update Prime Agent.');
    }
    if (rest.length > 1) {
      return fail(`Usage: ${APP_NAME} package update [source]`);
    }
    if (rest[0] && isSelfUpdateSource(rest[0])) {
      return fail('Use "prime-agent update" to update Prime Agent.');
    }
    await handlePackageCommand(["update", ...rest.length === 0 ? ["--extensions"] : rest]);
    return HANDLED;
  }
  await handlePackageCommand([subcommand, ...rest]);
  return HANDLED;
}
function rewriteNestedCommand(parent, subcommand, flag, args) {
  if (args[0] !== subcommand) {
    const candidate = args[0];
    const suggestion = candidate ? findCommandSuggestion(candidate, [subcommand]) : void 0;
    return fail(candidate ? `Unknown ${parent} command: ${candidate}` : `Missing ${parent} command.`, suggestion ? `Did you mean "${APP_NAME} ${parent} ${suggestion}"?` : `Run "${APP_NAME} help ${parent}" for usage.`);
  }
  const splitArgs = splitOperandsAndOptions(args.slice(1));
  if (!splitArgs) {
    return fail(`Usage: ${APP_NAME} ${getCommandSpec([parent, subcommand])?.usage ?? `${parent} ${subcommand}`}`);
  }
  const { operands, options } = splitArgs;
  const validCount = parent === "model" ? operands.length <= 1 : operands.length >= 1 && operands.length <= 2;
  if (!validCount) {
    return fail(`Usage: ${APP_NAME} ${getCommandSpec([parent, subcommand])?.usage ?? `${parent} ${subcommand}`}`);
  }
  return continueWith([INTERNAL_RUNTIME_COMMAND_MARKER, flag, ...operands, ...options]);
}
function parseBooleanOptions(args, allowed, command) {
  const options = /* @__PURE__ */ new Set();
  for (const arg of args) {
    if (!allowed.has(arg)) {
      fail(`Unknown option for ${command}: ${arg}`, `Run "${APP_NAME} help ${command}" for usage.`);
      return void 0;
    }
    options.add(arg);
  }
  return options;
}
function requireArgumentCount(args, count, command) {
  if (args.length === count) {
    return true;
  }
  fail(`Usage: ${APP_NAME} ${getCommandSpec([command])?.usage ?? command}`);
  return false;
}
function hasPositionalArguments(args) {
  const parsed = parseArgs(args);
  return parsed.messages.length > 0 || parsed.fileArgs.length > 0;
}
function hasConflictingAttachOption(args) {
  return args.some((arg) => arg === "--resume" || arg === "-r" || arg.startsWith("--resume=") || arg === "--continue" || arg === "-c" || arg === "--fork");
}
function splitOperandsAndOptions(args) {
  const optionsStart = args.findIndex((arg) => arg.startsWith("-"));
  if (optionsStart === -1) {
    return { operands: args, options: [] };
  }
  const options = args.slice(optionsStart);
  if (hasPositionalArguments(options)) {
    return void 0;
  }
  return { operands: args.slice(0, optionsStart), options };
}
function requireOperandCount(args, minimum, maximum, command) {
  const operands = [];
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === "--json") {
      continue;
    }
    if (arg === "--socket" || arg === "--daemon-socket") {
      index++;
      continue;
    }
    if (arg.startsWith("-")) {
      fail(`Usage: ${APP_NAME} ${getCommandSpec([command])?.usage ?? command}`);
      return false;
    }
    operands.push(arg);
  }
  if (operands.length >= minimum && (maximum === void 0 || operands.length <= maximum)) {
    return true;
  }
  fail(`Usage: ${APP_NAME} ${getCommandSpec([command])?.usage ?? command}`);
  return false;
}
function validateScheduleArgs(args) {
  const subcommand = args[0];
  if (subcommand === "list") {
    let agentCount = 0;
    for (const arg of args.slice(1)) {
      if (arg === "--all" || arg === "-a" || arg === "--json") {
        continue;
      }
      if (arg.startsWith("-") || ++agentCount > 1) {
        fail(`Usage: ${APP_NAME} schedule list [--all] [agent] [--json]`);
        return false;
      }
    }
    return true;
  }
  if (subcommand === "cancel") {
    const operands = args.slice(1).filter((arg) => arg !== "--json");
    if (operands.length === 1 && !operands[0].startsWith("-")) {
      return true;
    }
    fail(`Usage: ${APP_NAME} ${getCommandSpec(["schedule", "cancel"]).usage}`);
    return false;
  }
  return true;
}
function fail(message, hint) {
  console.error(source_default.red(`Error: ${message}`));
  if (hint) {
    console.error(source_default.dim(hint));
  }
  process.exitCode = 1;
  return HANDLED;
}

// dist/core/logging.js
var AGENT_LOG_MAX_BYTES = 20 * 1024 * 1024;
var context = {};
function setLogContext(fields) {
  Object.assign(context, fields);
}
function installFileLogSink(fields) {
  context = { pid: process.pid, ...fields };
  setLogSink((entry) => {
    appendRotatingLog(getAgentLogPath(), stringifyLogEntry({ ...entry, ...context }), AGENT_LOG_MAX_BYTES);
  });
}

// dist/migrations.js
import { existsSync as existsSync2, mkdirSync, readdirSync as readdirSync2, readFileSync as readFileSync3, renameSync, rmdirSync, rmSync as rmSync3, statSync as statSync2, writeFileSync } from "fs";
import { basename as basename3, dirname as dirname3, join as join3 } from "path";
var MIGRATION_GUIDE_URL = "https://github.com/earendil-works/pi-mono/blob/main/packages/coding-agent/CHANGELOG.md#extensions-migration";
var EXTENSIONS_DOC_URL = "https://github.com/earendil-works/pi-mono/blob/main/packages/coding-agent/docs/extensions.md";
function migrateAuthToAuthJson() {
  const agentDir = getAgentDir();
  const authPath = join3(agentDir, "auth.json");
  const oauthPath = join3(agentDir, "oauth.json");
  const settingsPath = join3(agentDir, "settings.json");
  if (existsSync2(authPath))
    return [];
  const migrated = {};
  const providers = [];
  if (existsSync2(oauthPath)) {
    try {
      const oauth = JSON.parse(readFileSync3(oauthPath, "utf-8"));
      for (const [provider, cred] of Object.entries(oauth)) {
        migrated[provider] = { type: "oauth", ...cred };
        providers.push(provider);
      }
      renameSync(oauthPath, `${oauthPath}.migrated`);
    } catch {
    }
  }
  if (existsSync2(settingsPath)) {
    try {
      const content = readFileSync3(settingsPath, "utf-8");
      const settings = JSON.parse(content);
      if (settings.apiKeys && typeof settings.apiKeys === "object") {
        for (const [provider, key] of Object.entries(settings.apiKeys)) {
          if (!migrated[provider] && typeof key === "string") {
            migrated[provider] = { type: "api_key", key };
            providers.push(provider);
          }
        }
        delete settings.apiKeys;
        writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
      }
    } catch {
    }
  }
  if (Object.keys(migrated).length > 0) {
    mkdirSync(dirname3(authPath), { recursive: true });
    writeFileSync(authPath, JSON.stringify(migrated, null, 2), { mode: 384 });
  }
  return providers;
}
function migrateSessionsFromAgentRoot() {
  const agentDir = getAgentDir();
  let files;
  try {
    files = readdirSync2(agentDir).filter((f) => f.endsWith(".jsonl")).map((f) => join3(agentDir, f));
  } catch {
    return;
  }
  if (files.length === 0)
    return;
  for (const file of files) {
    try {
      const firstLine = readFirstLineSync(file);
      if (!firstLine?.trim())
        continue;
      const header = JSON.parse(firstLine);
      if (header.type !== "session")
        continue;
      const correctDir = getSessionsDir(agentDir);
      if (!existsSync2(correctDir)) {
        mkdirSync(correctDir, { recursive: true });
      }
      const newPath = join3(correctDir, basename3(file));
      if (existsSync2(newPath))
        continue;
      renameSync(file, newPath);
    } catch {
    }
  }
}
function isSessionJsonlFile(filePath) {
  try {
    const firstLine = readFirstLineSync(filePath);
    if (!firstLine?.trim()) {
      return false;
    }
    const header = JSON.parse(firstLine);
    return header.type === "session" && typeof header.id === "string";
  } catch {
    return false;
  }
}
function isLegacySessionDirName(name) {
  return /^--.+--$/.test(name);
}
function migrateLegacySessionDirsToSessionRoot() {
  const agentDir = getAgentDir();
  const sessionsDir = getSessionsDir(agentDir);
  let entries;
  try {
    entries = readdirSync2(sessionsDir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (!entry.isDirectory() || !isLegacySessionDirName(entry.name)) {
      continue;
    }
    const legacyDir = join3(sessionsDir, entry.name);
    let files;
    try {
      files = readdirSync2(legacyDir).filter((file) => file.endsWith(".jsonl"));
    } catch {
      continue;
    }
    for (const file of files) {
      const oldPath = join3(legacyDir, file);
      let newPath = join3(sessionsDir, file);
      if (!isSessionJsonlFile(oldPath)) {
        continue;
      }
      if (existsSync2(newPath)) {
        if (filesHaveSameContent(oldPath, newPath)) {
          continue;
        }
        newPath = uniqueSessionRootPath(sessionsDir, file);
      }
      try {
        renameSync(oldPath, newPath);
      } catch {
      }
    }
    try {
      if (readdirSync2(legacyDir).length === 0) {
        rmdirSync(legacyDir);
      }
    } catch {
    }
  }
}
function filesHaveSameContent(a, b) {
  try {
    if (statSync2(a).size !== statSync2(b).size) {
      return false;
    }
    return readFileSync3(a, "utf-8") === readFileSync3(b, "utf-8");
  } catch {
    return false;
  }
}
function uniqueSessionRootPath(sessionsDir, file) {
  const base = file.endsWith(".jsonl") ? file.slice(0, -".jsonl".length) : file;
  for (let n = 1; ; n++) {
    const candidate = join3(sessionsDir, `${base}-${n}.jsonl`);
    if (!existsSync2(candidate)) {
      return candidate;
    }
  }
}
function migrateCommandsToPrompts(baseDir, label) {
  const commandsDir = join3(baseDir, "commands");
  const promptsDir = join3(baseDir, "prompts");
  if (existsSync2(commandsDir) && !existsSync2(promptsDir)) {
    try {
      renameSync(commandsDir, promptsDir);
      console.log(source_default.green(`Migrated ${label} commands/ \u2192 prompts/`));
      return true;
    } catch (err) {
      console.log(source_default.yellow(`Warning: Could not migrate ${label} commands/ to prompts/: ${err instanceof Error ? err.message : err}`));
    }
  }
  return false;
}
function migrateKeybindingsConfigFile() {
  const configPath = join3(getAgentDir(), "keybindings.json");
  if (!existsSync2(configPath))
    return;
  try {
    const parsed = JSON.parse(readFileSync3(configPath, "utf-8"));
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return;
    }
    const { config, migrated } = migrateKeybindingsConfig(parsed);
    if (!migrated)
      return;
    writeFileSync(configPath, `${JSON.stringify(config, null, 2)}
`, "utf-8");
  } catch {
  }
}
function migrateToolsToBin() {
  const agentDir = getAgentDir();
  const toolsDir = join3(agentDir, "tools");
  const binDir = getBinDir();
  if (!existsSync2(toolsDir))
    return;
  const binaries = ["fd", "rg", "fd.exe", "rg.exe"];
  let movedAny = false;
  for (const bin of binaries) {
    const oldPath = join3(toolsDir, bin);
    const newPath = join3(binDir, bin);
    if (existsSync2(oldPath)) {
      if (!existsSync2(binDir)) {
        mkdirSync(binDir, { recursive: true });
      }
      if (!existsSync2(newPath)) {
        try {
          renameSync(oldPath, newPath);
          movedAny = true;
        } catch {
        }
      } else {
        try {
          rmSync3?.(oldPath, { force: true });
        } catch {
        }
      }
    }
  }
  if (movedAny) {
    console.log(source_default.green(`Migrated managed binaries tools/ \u2192 bin/`));
  }
}
function checkDeprecatedExtensionDirs(baseDir, label) {
  const hooksDir = join3(baseDir, "hooks");
  const toolsDir = join3(baseDir, "tools");
  const warnings = [];
  if (existsSync2(hooksDir)) {
    warnings.push(`${label} hooks/ directory found. Hooks have been renamed to extensions.`);
  }
  if (existsSync2(toolsDir)) {
    try {
      const entries = readdirSync2(toolsDir);
      const customTools = entries.filter((e) => {
        const lower = e.toLowerCase();
        return lower !== "fd" && lower !== "rg" && lower !== "fd.exe" && lower !== "rg.exe" && !e.startsWith(".");
      });
      if (customTools.length > 0) {
        warnings.push(`${label} tools/ directory contains custom tools. Custom tools have been merged into extensions.`);
      }
    } catch {
    }
  }
  return warnings;
}
function migrateExtensionSystem(cwd) {
  const agentDir = getAgentDir();
  const projectDir = join3(cwd, CONFIG_DIR_NAME);
  migrateCommandsToPrompts(agentDir, "Global");
  migrateCommandsToPrompts(projectDir, "Project");
  const warnings = [
    ...checkDeprecatedExtensionDirs(agentDir, "Global"),
    ...checkDeprecatedExtensionDirs(projectDir, "Project")
  ];
  return warnings;
}
async function showDeprecationWarnings(warnings) {
  if (warnings.length === 0)
    return;
  for (const warning of warnings) {
    console.log(source_default.yellow(`Warning: ${warning}`));
  }
  console.log(source_default.yellow(`
Move your extensions to the extensions/ directory.`));
  console.log(source_default.yellow(`Migration guide: ${MIGRATION_GUIDE_URL}`));
  console.log(source_default.yellow(`Documentation: ${EXTENSIONS_DOC_URL}`));
  console.log(source_default.dim(`
Press any key to continue...`));
  await new Promise((resolve6) => {
    process.stdin.setRawMode?.(true);
    process.stdin.resume();
    process.stdin.once("data", () => {
      process.stdin.setRawMode?.(false);
      process.stdin.pause();
      resolve6();
    });
  });
  console.log();
}
function runMigrations(cwd) {
  const migratedAuthProviders = migrateAuthToAuthJson();
  migrateSessionsFromAgentRoot();
  migrateLegacySessionDirsToSessionRoot();
  migrateToolsToBin();
  migrateKeybindingsConfigFile();
  const deprecationWarnings = migrateExtensionSystem(cwd);
  return { migratedAuthProviders, deprecationWarnings };
}

// dist/main.js
async function readPipedStdin() {
  if (process.stdin.isTTY) {
    return void 0;
  }
  return new Promise((resolve6) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => {
      resolve6(data.trim() || void 0);
    });
    process.stdin.resume();
  });
}
function collectSettingsDiagnostics(settingsManager, context2) {
  return settingsManager.drainErrors().map(({ scope, error }) => ({
    type: "warning",
    message: `(${context2}, ${scope} settings) ${error.message}`
  }));
}
function reportDiagnostics(diagnostics) {
  for (const diagnostic of diagnostics) {
    const color = diagnostic.type === "error" ? source_default.red : diagnostic.type === "warning" ? source_default.yellow : source_default.dim;
    const prefix = diagnostic.type === "error" ? "Error: " : diagnostic.type === "warning" ? "Warning: " : "";
    console.error(color(`${prefix}${diagnostic.message}`));
  }
}
function isTruthyEnvFlag(value) {
  if (!value)
    return false;
  return value === "1" || value.toLowerCase() === "true" || value.toLowerCase() === "yes";
}
function shouldRejectNonInteractiveAttach(attachAgent, appMode) {
  return attachAgent !== void 0 && appMode !== "interactive";
}
function shouldRejectBareResume(resume) {
  return resume === true;
}
function resolveAppMode(parsed, stdinIsTTY) {
  if (parsed.mode === "daemon") {
    return "daemon";
  }
  if (parsed.mode === "rpc") {
    return "rpc";
  }
  if (parsed.mode === "acp") {
    return "acp";
  }
  if (parsed.mode === "json") {
    return "json";
  }
  if (parsed.print || !stdinIsTTY) {
    return "print";
  }
  return "interactive";
}
function toPrintOutputMode(appMode) {
  return appMode === "json" ? "json" : "text";
}
function parseAgentsViewCommand(args) {
  if (args[0] === "agents") {
    return { explicitAgentsView: true, args: args.slice(1) };
  }
  return { explicitAgentsView: false, args };
}
function shouldUseDaemonInteractive(options) {
  return options.appMode === "interactive" && !options.startupBenchmark && !options.noSession && options.listModels === void 0;
}
function shouldUseDaemonClient(options) {
  return options.appMode !== "daemon" && !options.startupBenchmark && !options.help && options.listModels === void 0;
}
function shouldUseDaemonClientRuntime(options) {
  return shouldUseDaemonClient(options) && !options.ownedSessionWorker && !options.hasProcessLocalExtensionFactories;
}
function shouldEnsureInteractiveDaemonForStartup(useDaemonInteractive, attachAgent) {
  return useDaemonInteractive && attachAgent === void 0;
}
function shouldOpenAgentsViewForDaemonInteractive(options) {
  return options.useDaemonInteractive && // `prime-agent` opens a new chat by default; the unified agents view is reached via
  // left-arrow from a session or requested explicitly (`agents`).
  !!options.explicitAgentsView && !options.needsOnboarding && // A resume selector resolves and opens its target directly.
  typeof options.resume !== "string" && !options.continue && !options.fork;
}
function shouldUseEphemeralSessionManagerForDaemonInteractive(options) {
  return !options.hasActiveDaemonSession && options.resume === void 0 && !options.continue && !options.fork;
}
function shouldEnsureDaemonBeforeActiveSessionLookup(options) {
  return options.useDaemonInteractive && options.resumeSelector !== void 0 && (options.explicitAttach || !looksLikeSessionPath(options.resumeSelector));
}
async function findActiveDaemonSessionSummaryForInteractiveStartup(socketPath, selector, options = {}) {
  try {
    return await (options.lookup ?? findActiveDaemonSessionSummary)(socketPath, selector);
  } catch (error) {
    if (options.fallbackOnError === false) {
      throw error;
    }
    return void 0;
  }
}
async function prepareInitialMessage(parsed, autoResizeImages, stdinContent) {
  if (parsed.fileArgs.length === 0) {
    return buildInitialMessage({ parsed, stdinContent });
  }
  const { text, images } = await processFileArguments(parsed.fileArgs, { autoResizeImages });
  return buildInitialMessage({
    parsed,
    fileText: text,
    fileImages: images,
    stdinContent
  });
}
async function promptConfirm(message) {
  return new Promise((resolve6) => {
    const rl = createInterface3({
      input: process.stdin,
      output: process.stdout
    });
    rl.question(`${message} [y/N] `, (answer) => {
      rl.close();
      resolve6(answer.toLowerCase() === "y" || answer.toLowerCase() === "yes");
    });
  });
}
var STARTUP_SESSION_LOSS_COPY = {
  busyDetail(count) {
    const { noun, pronoun } = pluralizeSessions(count);
    return `A background service from a different Prime Agent version is running with ${count} busy ${noun}. Stopping it will terminate ${pronoun}.`;
  },
  unlistableDetail: "A background service from a different Prime Agent version is running and its sessions could not be listed. Stopping it may terminate active sessions.",
  question: "Stop it and continue?",
  nonTtyHint: 'Run "prime-agent shutdown" to stop it, then retry.'
};
async function takeOverStaleDaemonOrExit(socketPath) {
  const probe = await probeRunningDaemonSessions(socketPath);
  const confirmed = await confirmDaemonSessionLoss(probe, { force: false, copy: STARTUP_SESSION_LOSS_COPY });
  if (!confirmed) {
    if (process.stdin.isTTY) {
      console.error(source_default.dim("Cancelled."));
    }
    process.exit(1);
  }
  if (!await shutdownDaemonAndWait(socketPath)) {
    console.error(source_default.red(`Could not stop the background service on ${socketPath}. Run "prime-agent shutdown" and retry.`));
    process.exit(1);
  }
  const ready = ensureInteractiveDaemonRunning(socketPath);
  try {
    await ready;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(source_default.red(`Could not start the background service: ${message}`));
    process.exit(1);
  }
  return { ready };
}
async function awaitDaemonReady(daemonReady) {
  if (!daemonReady) {
    return { ready: daemonReady };
  }
  try {
    await daemonReady;
    return { ready: daemonReady };
  } catch (error) {
    if (error instanceof StaleDaemonError) {
      return takeOverStaleDaemonOrExit(error.socketPath);
    }
    throw error;
  }
}
function validateForkFlags(parsed) {
  if (!parsed.fork)
    return;
  const conflictingFlags = [
    parsed.continue ? "--continue" : void 0,
    parsed.resume ? "--resume" : void 0,
    parsed.noSession ? "--no-session" : void 0
  ].filter((flag) => flag !== void 0);
  if (conflictingFlags.length > 0) {
    console.error(source_default.red(`Error: --fork cannot be combined with ${conflictingFlags.join(", ")}`));
    process.exit(1);
  }
}
function forkSessionOrExit(sourcePath, cwd, sessionDir) {
  try {
    return SessionManager.forkFrom(sourcePath, cwd, sessionDir);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(source_default.red(`Error: ${message}`));
    process.exit(1);
  }
}
function getResumeSelector(parsed) {
  return typeof parsed.resume === "string" ? parsed.resume : void 0;
}
async function createSessionManager(parsed, cwd, sessionDir) {
  const explicitCwdOverride = parsed.cwd ? cwd : void 0;
  if (parsed.noSession) {
    return SessionManager.inMemory();
  }
  if (parsed.fork) {
    const resolved = await resolveSessionPath(parsed.fork, cwd, sessionDir);
    switch (resolved.type) {
      case "path":
      case "local":
      case "global":
        return forkSessionOrExit(resolved.path, cwd, sessionDir);
    }
  }
  const resumeSelector = getResumeSelector(parsed);
  if (resumeSelector) {
    const resolved = await resolveSessionPath(resumeSelector, cwd, sessionDir);
    switch (resolved.type) {
      case "path":
      case "local":
        return SessionManager.open(resolved.path, sessionDir, explicitCwdOverride);
      case "global": {
        console.log(source_default.yellow(`Session found in different project: ${resolved.cwd}`));
        const shouldFork = await promptConfirm("Fork this session into current directory?");
        if (!shouldFork) {
          console.log(source_default.dim("Aborted."));
          process.exit(0);
        }
        return forkSessionOrExit(resolved.path, cwd, sessionDir);
      }
    }
  }
  if (parsed.continue) {
    return SessionManager.continueRecent(cwd, sessionDir);
  }
  return SessionManager.create(cwd, sessionDir);
}
function buildSessionOptions(config, scopedModels, hasExistingSession, modelRegistry, settingsManager) {
  const options = {};
  const diagnostics = [];
  let cliThinkingFromModel = false;
  if (config.model) {
    const resolved = resolveCliModel({
      cliProvider: config.provider,
      cliModel: config.model,
      modelRegistry
    });
    if (resolved.warning) {
      diagnostics.push({ type: "warning", message: resolved.warning });
    }
    if (resolved.error) {
      diagnostics.push({ type: "error", message: resolved.error });
    }
    if (resolved.model) {
      options.model = resolved.model;
      if (!config.thinking && resolved.thinkingLevel) {
        options.thinkingLevel = resolved.thinkingLevel;
        cliThinkingFromModel = true;
      }
    }
  }
  if (!options.model && scopedModels.length > 0 && !hasExistingSession) {
    const savedProvider = settingsManager.getDefaultProvider();
    const savedModelId = settingsManager.getDefaultModel();
    const savedModel = savedProvider && savedModelId ? modelRegistry.find(savedProvider, savedModelId) : void 0;
    const savedInScope = savedModel ? scopedModels.find((sm) => modelsAreEqual(sm.model, savedModel)) : void 0;
    if (savedInScope) {
      options.model = savedInScope.model;
      if (!config.thinking && savedInScope.thinkingLevel) {
        options.thinkingLevel = savedInScope.thinkingLevel;
      }
    } else {
      options.model = scopedModels[0].model;
      if (!config.thinking && scopedModels[0].thinkingLevel) {
        options.thinkingLevel = scopedModels[0].thinkingLevel;
      }
    }
  }
  if (config.thinking) {
    options.thinkingLevel = config.thinking;
  }
  if (scopedModels.length > 0) {
    options.scopedModels = scopedModels.map((sm) => ({
      model: sm.model,
      thinkingLevel: sm.thinkingLevel
    }));
  }
  if (config.noTools) {
    options.noTools = "all";
  } else if (config.noBuiltinTools) {
    options.noTools = "builtin";
  }
  if (config.tools) {
    options.tools = [...config.tools];
  }
  if (config.autonomous) {
    options.autonomous = mergeAutonomousConfig(void 0, config.autonomous);
  }
  return { options, cliThinkingFromModel, diagnostics };
}
function resolveCliPaths(cwd, paths) {
  return paths?.map((value) => isLocalPath(value) ? resolve5(cwd, value) : value);
}
function runtimeAutonomousConfigFromArgs(parsed) {
  const hasAutonomousOptions = parsed.autonomous === true || parsed.autonomousGates !== void 0 || parsed.autonomousGateRetries !== void 0 || parsed.autonomousGateTimeoutMs !== void 0 || parsed.autonomousMaxContinuations !== void 0 || parsed.autonomousMaxTurns !== void 0 || parsed.autonomousMaxTokens !== void 0 || parsed.autonomousTimeoutMs !== void 0;
  if (!hasAutonomousOptions) {
    return void 0;
  }
  const hasGateOptions = parsed.autonomousGates !== void 0 || parsed.autonomousGateRetries !== void 0 || parsed.autonomousGateTimeoutMs !== void 0;
  return {
    enabled: true,
    maxContinuations: parsed.autonomousMaxContinuations,
    maxTurns: parsed.autonomousMaxTurns,
    maxTokens: parsed.autonomousMaxTokens,
    timeoutMs: parsed.autonomousTimeoutMs,
    gates: hasGateOptions ? {
      commands: parsed.autonomousGates,
      maxRetries: parsed.autonomousGateRetries,
      timeoutMs: parsed.autonomousGateTimeoutMs
    } : void 0
  };
}
function runtimeConfigFromArgs(parsed, cwd, agentDir, sessionDir, appMode, telemetryDisabled) {
  return {
    cwd,
    agentDir,
    sessionDir,
    provider: parsed.provider,
    model: parsed.model,
    apiKey: parsed.apiKey,
    systemPrompt: parsed.systemPrompt,
    appendSystemPrompt: parsed.appendSystemPrompt,
    thinking: parsed.thinking,
    models: parsed.models,
    tools: parsed.tools,
    noTools: parsed.noTools,
    noBuiltinTools: parsed.noBuiltinTools,
    extensions: resolveCliPaths(cwd, parsed.extensions),
    noExtensions: parsed.noExtensions,
    skills: resolveCliPaths(cwd, parsed.skills),
    noSkills: parsed.noSkills,
    promptTemplates: resolveCliPaths(cwd, parsed.promptTemplates),
    noPromptTemplates: parsed.noPromptTemplates,
    themes: resolveCliPaths(cwd, parsed.themes),
    noThemes: parsed.noThemes,
    noContextFiles: parsed.noContextFiles,
    autonomous: runtimeAutonomousConfigFromArgs(parsed),
    extensionFlagValues: parsed.unknownFlags.size > 0 ? Object.fromEntries(parsed.unknownFlags.entries()) : void 0,
    executionMode: appMode === "daemon" ? void 0 : appMode,
    telemetryDisabled,
    // Serialized refine for print/json/rpc: the client's appMode is NOT
    // "daemon" here — it's "print", "json", or "rpc". The daemon worker
    // receives this flag via AgentSessionRuntimeConfig and uses it
    // instead of its own appMode="daemon".
    serializedRefine: appMode !== "interactive" && appMode !== "daemon",
    initialGoal: parsed.goal ? { objective: parsed.goal, tokenBudget: parsed.goalTokenBudget } : void 0
  };
}
function daemonServerDefaultSessionConfig(config) {
  return { ...config, initialGoal: void 0 };
}
function resolveRuntimeSessionOptions(sessionOptions, runtimeSessionOptions) {
  return {
    model: runtimeSessionOptions?.model ?? sessionOptions.model,
    thinkingLevel: runtimeSessionOptions?.thinkingLevel ?? sessionOptions.thinkingLevel,
    serviceTier: runtimeSessionOptions?.serviceTier ?? sessionOptions.serviceTier,
    scopedModels: runtimeSessionOptions?.scopedModels ?? sessionOptions.scopedModels,
    tools: runtimeSessionOptions?.tools ?? sessionOptions.tools,
    noTools: runtimeSessionOptions?.noTools ?? sessionOptions.noTools,
    customTools: runtimeSessionOptions?.customTools ?? sessionOptions.customTools,
    initialActiveToolNames: runtimeSessionOptions?.initialActiveToolNames,
    allowedToolNames: runtimeSessionOptions?.allowedToolNames,
    includeGoals: runtimeSessionOptions?.includeGoals,
    includeCompactSkill: runtimeSessionOptions?.includeCompactSkill,
    rlmHeartbeatController: runtimeSessionOptions?.rlmHeartbeatController,
    agentMessageController: runtimeSessionOptions?.agentMessageController,
    agentObserveController: runtimeSessionOptions?.agentObserveController,
    autonomous: (runtimeSessionOptions?.rlmDepth ?? 0) > 0 ? mergeAutonomousConfig(sessionOptions.autonomous, { ...runtimeSessionOptions?.autonomous, enabled: false }) : mergeAutonomousConfig(sessionOptions.autonomous, runtimeSessionOptions?.autonomous),
    rlmDepth: runtimeSessionOptions?.rlmDepth,
    rlmMaxDepth: runtimeSessionOptions?.rlmMaxDepth,
    rlmSessionDir: runtimeSessionOptions?.rlmSessionDir,
    rlmParentNodeId: runtimeSessionOptions?.rlmParentNodeId,
    rlmParentAgent: runtimeSessionOptions?.rlmParentAgent,
    subagentRuntimeHost: runtimeSessionOptions?.subagentRuntimeHost
  };
}
async function prepareRuntimeServices(options) {
  const { config, sessionManager } = options;
  const effectiveAgentDir = config.agentDir ?? options.agentDir;
  const authStorage = AuthStorage.create(join4(effectiveAgentDir, "auth.json"), {
    usePrimeCliConfig: effectiveAgentDir === options.agentDir
  });
  const services = await createAgentSessionServices({
    cwd: options.cwd,
    agentDir: effectiveAgentDir,
    authStorage,
    extensionFlagValues: new Map(Object.entries(config.extensionFlagValues ?? {})),
    // Subagents share the parent's Herdr pane; their own reporter would race
    // the parent's and a subagent quit would release the still-active pane.
    noBuiltinHerdrReporter: (options.sessionOptionsOverride?.rlmDepth ?? 0) > 0,
    telemetryDisabled: config.telemetryDisabled,
    resourceLoaderOptions: {
      additionalExtensionPaths: config.extensions,
      additionalSkillPaths: config.skills,
      additionalPromptTemplatePaths: config.promptTemplates,
      additionalThemePaths: config.themes,
      noExtensions: config.noExtensions,
      noSkills: config.noSkills,
      noPromptTemplates: config.noPromptTemplates,
      noThemes: config.noThemes,
      noContextFiles: config.noContextFiles,
      systemPrompt: config.systemPrompt,
      appendSystemPrompt: config.appendSystemPrompt,
      extensionFactories: options.extensionFactories
    }
  });
  const { settingsManager, modelRegistry, resourceLoader } = services;
  const diagnostics = [
    ...services.diagnostics,
    ...collectSettingsDiagnostics(settingsManager, "runtime creation"),
    ...resourceLoader.getExtensions().errors.map(({ path, error }) => ({
      type: "error",
      message: `Failed to load extension "${path}": ${error}`
    }))
  ];
  const modelPatterns = config.models ?? settingsManager.getEnabledModels();
  const scopedModels = modelPatterns && modelPatterns.length > 0 ? await resolveModelScope(modelPatterns, modelRegistry) : [];
  const { options: sessionOptions, cliThinkingFromModel, diagnostics: sessionOptionDiagnostics } = buildSessionOptions(config, scopedModels, sessionManager.buildSessionContext().messages.length > 0, modelRegistry, settingsManager);
  diagnostics.push(...sessionOptionDiagnostics);
  const effectiveSessionModel = options.sessionOptionsOverride?.model ?? sessionOptions.model;
  if (config.apiKey) {
    if (!effectiveSessionModel) {
      diagnostics.push({
        type: "error",
        message: "--api-key requires a model to be specified via --model, --provider/--model, or --models"
      });
    } else {
      authStorage.setRuntimeApiKey(effectiveSessionModel.provider, config.apiKey);
    }
  }
  return {
    services,
    scopedModels,
    sessionOptions,
    cliThinkingFromModel,
    diagnostics
  };
}
async function resolvePreparedStartupModel(options) {
  const { prepared, sessionManager } = options;
  const { modelRegistry, settingsManager } = prepared.services;
  const existingSession = sessionManager.buildSessionContext();
  const hasExistingSession = existingSession.messages.length > 0;
  let model = prepared.sessionOptions.model;
  let modelFallbackMessage;
  if (!model && hasExistingSession && existingSession.model) {
    const restoredModel = modelRegistry.find(existingSession.model.provider, existingSession.model.modelId);
    if (restoredModel && modelRegistry.hasConfiguredAuth(restoredModel)) {
      model = restoredModel;
    }
    if (!model) {
      modelFallbackMessage = `Could not restore model ${existingSession.model.provider}/${existingSession.model.modelId}`;
    }
  }
  if (!model) {
    const result = await findInitialModel({
      scopedModels: prepared.scopedModels,
      isContinuing: hasExistingSession,
      defaultProvider: settingsManager.getDefaultProvider(),
      defaultModelId: settingsManager.getDefaultModel(),
      defaultThinkingLevel: settingsManager.getDefaultThinkingLevel(),
      modelRegistry
    });
    model = result.model;
    if (!model) {
      modelFallbackMessage = formatNoModelsAvailableMessage();
    } else if (modelFallbackMessage) {
      modelFallbackMessage += `. Using ${model.provider}/${model.id}`;
    }
  }
  return { model, modelFallbackMessage };
}
async function promptForMissingSessionCwd(issue, settingsManager) {
  initTheme(settingsManager.getTheme());
  setKeybindings(KeybindingsManager.create());
  return new Promise((resolve6) => {
    const ui = new TUI(new ProcessTerminal(), settingsManager.getShowHardwareCursor());
    ui.setClearOnShrink(settingsManager.getClearOnShrink());
    let settled = false;
    const finish = (result) => {
      if (settled) {
        return;
      }
      settled = true;
      ui.stop();
      resolve6(result);
    };
    const selector = new ExtensionSelectorComponent(formatMissingSessionCwdPrompt(issue), ["Continue", "Cancel"], (option) => finish(option === "Continue" ? issue.fallbackCwd : void 0), () => finish(void 0), { tui: ui });
    ui.addChild(selector);
    ui.setFocus(selector);
    ui.start();
  });
}
function getDaemonSummaryActiveSessionId(summary) {
  return summary.activeSessionId ?? summary.id;
}
function isUnknownActiveSessionError(message) {
  return message.startsWith("Unknown active session:");
}
async function findActiveDaemonSessionSummary(socketPath, selector) {
  const client = new DaemonClient(socketPath);
  await client.connect(250);
  try {
    const response = await client.request({ type: "get_state", activeSessionId: selector }, 3e3);
    if (!response.success) {
      if (isUnknownActiveSessionError(response.error)) {
        return void 0;
      }
      throw new Error(response.error);
    }
    if (!isDaemonSessionSummary(response.data)) {
      throw new Error("Daemon returned an invalid active session summary");
    }
    return response.data;
  } finally {
    client.close();
  }
}
function createSessionManagerForActiveDaemonSummary(summary, fallbackCwd) {
  const cwd = summary.cwd || fallbackCwd;
  if (summary.sessionFile) {
    try {
      return SessionManager.open(summary.sessionFile, void 0, cwd);
    } catch {
      return SessionManager.inMemory(cwd);
    }
  }
  return SessionManager.inMemory(cwd);
}
function getInteractiveDaemonSessionPath(parsed, sessionManager) {
  if (!parsed.resume && !parsed.continue && !parsed.fork) {
    return void 0;
  }
  return sessionManager.getSessionFile();
}
function findActiveDaemonSessionSummaryForSessionFile(summaries, sessionPath) {
  const resolvedSessionPath = canonicalSessionPath(sessionPath);
  return summaries.find((summary) => summary.activeSessionId !== void 0 && summary.sessionFile !== void 0 && canonicalSessionPath(summary.sessionFile) === resolvedSessionPath);
}
async function createDaemonClientConnection(options) {
  const client = new DaemonClient(options.socketPath);
  await client.connect();
  try {
    const attach = async (summary2) => {
      const connection = await DaemonAgentConnection.attach(client, getDaemonSummaryActiveSessionId(summary2), {
        closeClientOnDispose: true,
        sendClientEnv: true,
        ownedSession: options.clientOwned,
        supportsExtensionUi: options.supportsExtensionUi,
        recoverDaemon: () => ensureInteractiveDaemonRunning(options.socketPath),
        telemetryDisabled: options.config.telemetryDisabled
      });
      return { connection, summary: summary2 };
    };
    if (options.activeSessionId) {
      const summary2 = await findAttachedDaemonSessionSummary(client, options.activeSessionId);
      return await attach(summary2);
    }
    if (options.sessionPath && !options.clientOwned) {
      const activeSummary = findActiveDaemonSessionSummaryForSessionFile(await listActiveDaemonSessionSummaries(client), options.sessionPath);
      if (activeSummary) {
        return await attach(activeSummary);
      }
    }
    if (options.clientOwned) {
      await client.waitForHello();
      if (!client.supportsServerCapability("client_owned_sessions")) {
        throw new DaemonCapabilityUnavailableError("create", "client_owned_sessions");
      }
    }
    const response = await client.request({
      type: "create",
      config: options.config,
      sessionPath: options.sessionPath,
      continueRecent: options.continueRecent,
      noSession: options.noSession,
      env: collectDaemonClientEnv(),
      lifecycle: options.clientOwned ? "client_owned" : "resident",
      launchEnv: options.clientOwned ? collectDaemonLaunchEnv() : void 0
    });
    if (!response.success) {
      throw deserializeDaemonError(response);
    }
    if (!isDaemonSessionSummary(response.data)) {
      throw new Error("Daemon returned an invalid create response");
    }
    const summary = response.data;
    return await attach(summary);
  } catch (error) {
    client.close();
    throw error;
  }
}
async function findAttachedDaemonSessionSummary(client, activeSessionId) {
  const response = await client.request({ type: "get_state", activeSessionId });
  if (!response.success) {
    throw new Error(response.error);
  }
  if (!isDaemonSessionSummary(response.data)) {
    throw new Error("Daemon returned an invalid active session summary");
  }
  return response.data;
}
async function main(args, options) {
  resetTimings();
  if (isDaemonWorkerProcess()) {
    waitForDaemonWorkerStartupGate();
  }
  installFileLogSink();
  if (isDaemonCatalogProcess()) {
    await runDaemonCatalogProcess();
    return;
  }
  registerBuiltinMcpOAuthProviders();
  const offlineMode = args.includes("--offline") || isTruthyEnvFlag(process.env.PI_OFFLINE);
  if (offlineMode) {
    process.env.PI_OFFLINE = "1";
    process.env.PI_SKIP_VERSION_CHECK = "1";
  }
  const publicCommand = await handlePublicCommand(args);
  if (publicCommand.handled) {
    return;
  }
  args = publicCommand.args;
  if (await handleConfigCommand(args)) {
    return;
  }
  const explicitAgentsView = publicCommand.explicitAgentsView;
  const parsed = parseArgs(args);
  if (parsed.diagnostics.length > 0) {
    for (const d of parsed.diagnostics) {
      const color = d.type === "error" ? source_default.red : source_default.yellow;
      console.error(color(`${d.type === "error" ? "Error" : "Warning"}: ${d.message}`));
    }
    if (parsed.diagnostics.some((d) => d.type === "error")) {
      process.exit(1);
    }
  }
  time("parseArgs");
  const appMode = resolveAppMode(parsed, process.stdin.isTTY);
  if (shouldRejectNonInteractiveAttach(publicCommand.attachAgent, appMode)) {
    console.error(source_default.red("Error: attach requires an interactive terminal"));
    process.exit(1);
  }
  if (shouldRejectBareResume(parsed.resume)) {
    console.error(source_default.red("Error: --resume requires a session id or path; browse sessions with left-arrow from a chat"));
    process.exit(1);
  }
  setLogContext({ mode: appMode });
  const shouldTakeOverStdout = appMode !== "interactive";
  if (shouldTakeOverStdout) {
    takeOverStdout();
  }
  if (parsed.version) {
    console.log(VERSION);
    process.exit(0);
  }
  if (parsed.help) {
    console.log(formatTopLevelHelp());
    process.exit(0);
  }
  if (parsed.export) {
    let result;
    try {
      const outputPath = parsed.messages.length > 0 ? parsed.messages[0] : void 0;
      result = await exportFromFile(parsed.export, outputPath);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to export session";
      console.error(source_default.red(`Error: ${message}`));
      process.exit(1);
    }
    console.log(`Exported to: ${result}`);
    process.exit(0);
  }
  if ((parsed.mode === "rpc" || parsed.mode === "daemon") && parsed.fileArgs.length > 0) {
    console.error(source_default.red("Error: @file arguments are not supported in RPC or daemon mode"));
    process.exit(1);
  }
  validateForkFlags(parsed);
  const cwd = parsed.cwd ? resolve5(expandTildePath(parsed.cwd)) : process.cwd();
  if (parsed.cwd) {
    try {
      process.chdir(cwd);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(source_default.red(`Error: Cannot use cwd ${cwd}: ${message}`));
      process.exit(1);
    }
  }
  const { migratedAuthProviders: migratedProviders, deprecationWarnings } = runMigrations(cwd);
  time("runMigrations");
  const agentDir = getAgentDir();
  const startupSettingsManager = SettingsManager.create(cwd, agentDir);
  reportDiagnostics(collectSettingsDiagnostics(startupSettingsManager, "startup session lookup"));
  const startupBenchmark = isTruthyEnvFlag(process.env.PI_STARTUP_BENCHMARK);
  if (startupBenchmark && appMode !== "interactive") {
    console.error(source_default.red("Error: PI_STARTUP_BENCHMARK only supports interactive mode"));
    process.exit(1);
  }
  const hasProcessLocalExtensionFactories = (options?.extensionFactories?.length ?? 0) > 0;
  const useDaemonClient = shouldUseDaemonClientRuntime({
    appMode,
    startupBenchmark,
    noSession: parsed.noSession,
    listModels: parsed.listModels,
    ownedSessionWorker: isOwnedSessionWorkerProcess(),
    hasProcessLocalExtensionFactories
  });
  const useDaemonInteractive = useDaemonClient && appMode === "interactive";
  const sessionDir = (parsed.sessionDir ? expandTildePath(parsed.sessionDir) : void 0) ?? getSessionDirEnvOverride() ?? startupSettingsManager.getSessionDir();
  const daemonSocketPath = parsed.daemonSocket ?? defaultDaemonSocketPath();
  let daemonReady = shouldEnsureInteractiveDaemonForStartup(useDaemonClient, publicCommand.attachAgent) ? ensureInteractiveDaemonRunning(daemonSocketPath) : void 0;
  daemonReady?.catch(() => {
  });
  const resumeSelector = getResumeSelector(parsed);
  const shouldLookupDaemonActiveSession = shouldEnsureDaemonBeforeActiveSessionLookup({
    useDaemonInteractive,
    resumeSelector,
    explicitAttach: publicCommand.attachAgent !== void 0
  });
  if (shouldLookupDaemonActiveSession && daemonReady) {
    daemonReady = (await awaitDaemonReady(daemonReady)).ready;
  }
  let activeDaemonSessionSummary;
  if (shouldLookupDaemonActiveSession && resumeSelector) {
    try {
      activeDaemonSessionSummary = await findActiveDaemonSessionSummaryForInteractiveStartup(daemonSocketPath, resumeSelector, { fallbackOnError: !publicCommand.attachAgent });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(source_default.red(`Error: Could not look up active agent '${resumeSelector}': ${message}`));
      process.exit(1);
    }
  }
  if (publicCommand.attachAgent && !activeDaemonSessionSummary) {
    console.error(source_default.red(`Error: No active agent found matching '${publicCommand.attachAgent}'`));
    process.exit(1);
  }
  let sessionManager;
  if (activeDaemonSessionSummary) {
    sessionManager = createSessionManagerForActiveDaemonSummary(activeDaemonSessionSummary, cwd);
  } else if (useDaemonInteractive && shouldUseEphemeralSessionManagerForDaemonInteractive({
    resume: parsed.resume,
    continue: parsed.continue,
    fork: parsed.fork
  })) {
    sessionManager = SessionManager.inMemory(cwd);
  } else {
    try {
      sessionManager = await createSessionManager(parsed, cwd, sessionDir);
    } catch (error) {
      if (!(error instanceof SessionSelectorError)) {
        throw error;
      }
      const suggestion = error instanceof SessionSelectorNotFoundError && error.suggestion ? ` Did you mean '${error.suggestion}'?` : "";
      console.error(source_default.red(`Error: ${error.message}.${suggestion}`));
      console.error(source_default.dim(`Open ${APP_NAME} and press left-arrow to browse sessions.`));
      process.exit(1);
    }
  }
  const missingSessionCwdIssue = getMissingSessionCwdIssue(sessionManager, cwd);
  if (missingSessionCwdIssue) {
    if (appMode === "interactive") {
      const selectedCwd = await promptForMissingSessionCwd(missingSessionCwdIssue, startupSettingsManager);
      if (!selectedCwd) {
        process.exit(0);
      }
      sessionManager = SessionManager.open(missingSessionCwdIssue.sessionFile, sessionDir, selectedCwd);
    } else {
      console.error(source_default.red(new MissingSessionCwdError(missingSessionCwdIssue).message));
      process.exit(1);
    }
  }
  time("createSessionManager");
  const telemetrySettingsManager = sessionManager.getCwd() === cwd ? startupSettingsManager : SettingsManager.create(sessionManager.getCwd(), agentDir);
  const telemetryDisabled = isTelemetryEnabled(telemetrySettingsManager) ? void 0 : true;
  const defaultSessionConfig = runtimeConfigFromArgs(parsed, sessionManager.getCwd(), agentDir, sessionDir, appMode, telemetryDisabled);
  const daemonDefaultSessionConfig = daemonServerDefaultSessionConfig(defaultSessionConfig);
  const runtimeDefaultSessionConfig = appMode === "daemon" ? daemonDefaultSessionConfig : defaultSessionConfig;
  const createRuntime = async ({ cwd: cwd2, agentDir: agentDir2, sessionManager: sessionManager2, sessionStartEvent, sessionConfig, sessionOptions: runtimeSessionOptions }) => {
    const config = mergeAgentSessionRuntimeConfig(runtimeDefaultSessionConfig, sessionConfig);
    const prepared = await prepareRuntimeServices({
      config,
      cwd: cwd2,
      agentDir: agentDir2,
      sessionManager: sessionManager2,
      extensionFactories: options?.extensionFactories,
      sessionOptionsOverride: runtimeSessionOptions
    });
    const { services: services2, sessionOptions, diagnostics } = prepared;
    const resolvedSessionOptions = resolveRuntimeSessionOptions(sessionOptions, runtimeSessionOptions);
    const created = await createAgentSessionFromServices({
      services: services2,
      sessionManager: sessionManager2,
      sessionStartEvent,
      ...resolvedSessionOptions,
      // Main agents boot their kernel in the background at session creation;
      // subagent sessions (rlmDepth > 0) keep the lazy first-call start.
      prewarmIpythonKernel: true,
      // Read serializedRefine from the merged runtime config (passed
      // from the JSON/print client through AgentSessionRuntimeConfig)
      // so it survives the daemon worker's appMode="daemon" context.
      serializedRefine: config.serializedRefine ?? false,
      executionMode: config.executionMode,
      telemetryDisabled: config.telemetryDisabled,
      // Only seed initial goal for top-level sessions (rlmDepth 0).
      initialGoal: (runtimeSessionOptions?.rlmDepth ?? 0) === 0 ? config.initialGoal : void 0
    });
    const cliThinkingOverride = config.thinking !== void 0 || prepared.cliThinkingFromModel;
    if (created.session.model && cliThinkingOverride) {
      created.session.setThinkingLevel(created.session.thinkingLevel);
    }
    return {
      ...created,
      services: services2,
      diagnostics
    };
  };
  time("createRuntime");
  if (appMode === "daemon" && parsed.listModels === void 0) {
    printTimings();
    if (isDaemonWorkerProcess()) {
      await runDaemonMode({
        socketPath: parsed.daemonSocket,
        defaultSessionConfig: daemonDefaultSessionConfig,
        createRuntime,
        worker: {
          authenticationToken: requireDaemonWorkerAuthenticationToken(),
          restoreActiveSessionId: process.env[DAEMON_WORKER_ACTIVE_SESSION_ID_ENV]
        }
      });
    } else {
      await runDaemonSupervisorMode({
        socketPath: parsed.daemonSocket,
        defaultSessionConfig: daemonDefaultSessionConfig
      });
    }
    return;
  }
  if (useDaemonInteractive) {
    const prepared = await prepareRuntimeServices({
      config: defaultSessionConfig,
      cwd: sessionManager.getCwd(),
      agentDir,
      sessionManager,
      extensionFactories: options?.extensionFactories
    });
    const { services: services2, scopedModels: scopedModels2 } = prepared;
    const { settingsManager: settingsManager2 } = services2;
    const startupModel = await resolvePreparedStartupModel({ prepared, sessionManager });
    const stdinContent2 = await readPipedStdin();
    time("readPipedStdin");
    const { initialMessage: initialMessage2, initialImages: initialImages2 } = await prepareInitialMessage(parsed, settingsManager2.getImageAutoResize(), stdinContent2);
    time("prepareInitialMessage");
    initTheme(settingsManager2.getTheme(), true);
    time("initTheme");
    if (deprecationWarnings.length > 0) {
      await showDeprecationWarnings(deprecationWarnings);
    }
    reportDiagnostics(prepared.diagnostics);
    if (prepared.diagnostics.some((diagnostic) => diagnostic.type === "error")) {
      process.exit(1);
    }
    time("prepareInteractiveServices");
    if (scopedModels2.length > 0 && (parsed.verbose || !settingsManager2.getQuietStartup())) {
      const modelList = scopedModels2.map((sm) => {
        const thinkingStr = sm.thinkingLevel ? `:${sm.thinkingLevel}` : "";
        return `${sm.model.id}${thinkingStr}`;
      }).join(", ");
      console.log(source_default.dim(`Model scope: ${modelList} ${source_default.gray("(Ctrl+P to cycle)")}`));
    }
    const promptStashStore = new ClientPromptStashStore();
    const daemonUiServices = createInteractiveModeUiServicesFromServices({
      services: services2,
      sessionManager
    });
    const launchAgentsView = async (initialSession, initialScopeKey2) => {
      await runAgentsViewMode({
        socketPath: daemonSocketPath,
        config: defaultSessionConfig,
        uiServices: daemonUiServices,
        recoverDaemon: () => ensureInteractiveDaemonRunning(daemonSocketPath),
        createUiServicesForSession: async (summary2) => {
          const attachedSessionManager = createSessionManagerForActiveDaemonSummary(summary2, sessionManager.getCwd());
          const attachedPrepared = await prepareRuntimeServices({
            config: mergeAgentSessionRuntimeConfig(defaultSessionConfig, {
              cwd: attachedSessionManager.getCwd()
            }),
            cwd: attachedSessionManager.getCwd(),
            agentDir,
            sessionManager: attachedSessionManager,
            extensionFactories: options?.extensionFactories
          });
          return createInteractiveModeUiServicesFromServices({
            services: attachedPrepared.services,
            sessionManager: attachedSessionManager
          });
        },
        migratedProviders,
        modelFallbackMessage: startupModel.modelFallbackMessage,
        promptStashStore,
        startupModelId: startupModel.model?.id,
        initialSession,
        initialScopeKey: initialScopeKey2,
        verbose: parsed.verbose
      });
    };
    if (shouldOpenAgentsViewForDaemonInteractive({
      useDaemonInteractive: useDaemonInteractive && !parsed.noSession,
      explicitAgentsView,
      needsOnboarding: shouldRunOnboarding({
        settingsManager: settingsManager2,
        modelRegistry: services2.modelRegistry,
        model: startupModel.model
      }),
      resume: parsed.resume,
      continue: parsed.continue,
      fork: parsed.fork
    })) {
      daemonReady = (await awaitDaemonReady(daemonReady)).ready;
      await preloadCodeHighlighter();
      printTimings();
      await launchAgentsView();
      return;
    }
    daemonReady = (await awaitDaemonReady(daemonReady)).ready;
    const isFreshDefaultSession = !activeDaemonSessionSummary && !getInteractiveDaemonSessionPath(parsed, sessionManager);
    const { connection, summary } = await createDaemonClientConnection({
      socketPath: daemonSocketPath,
      config: defaultSessionConfig,
      activeSessionId: activeDaemonSessionSummary ? getDaemonSummaryActiveSessionId(activeDaemonSessionSummary) : void 0,
      sessionPath: getInteractiveDaemonSessionPath(parsed, sessionManager),
      clientOwned: parsed.noSession,
      noSession: parsed.noSession,
      supportsExtensionUi: true
    });
    const agentConnection = connection;
    const attachModelFallbackMessage = isFreshDefaultSession ? startupModel.modelFallbackMessage : resolveAttachModelFallbackMessage(summary, startupModel.modelFallbackMessage);
    const interactiveMode = new InteractiveMode({
      agentConnection,
      daemonSocketPath,
      uiServices: daemonUiServices,
      promptStashStore,
      promptStashSessionId: summary.sessionId,
      bindLocalSessionExtensions: false,
      migratedProviders,
      modelFallbackMessage: attachModelFallbackMessage,
      initialMessage: initialMessage2,
      initialImages: initialImages2,
      initialMessages: parsed.messages,
      verbose: parsed.verbose,
      // Resumed/attached daemon sessions are part of the same fleet; left
      // arrow takes them to the agents view like any other session. The agents
      // view was not rendered here, so we intentionally leave
      // agentsViewOwnsStartupNotices unset and let the in-session fallback run.
      returnToAgentsView: !parsed.noSession,
      sessionDepth: summary.rlmDepth,
      // Direct launch has only the attached summary; the live+passive+saved
      // unified catalog index is not built until the agents view opens. Retained
      // child snapshots augment this running-child fallback inside chat.
      sessionHasChildren: summary.hasRunningRlmChildren === true
    });
    await preloadCodeHighlighter();
    printTimings();
    const interactiveResult = await interactiveMode.run();
    if (parsed.noSession) {
      return;
    }
    const returnedSummary = {
      ...summary,
      ...interactiveResult.source,
      id: interactiveResult.source.activeSessionId ?? summary.id
    };
    const initialScopeKey = interactiveResult.type === "scoped_agents_view" ? {
      sessionId: interactiveResult.source.sessionId,
      activeSessionId: interactiveResult.source.activeSessionId
    } : void 0;
    await launchAgentsView(returnedSummary, initialScopeKey);
    return;
  }
  if (useDaemonClient) {
    const settingsManager2 = SettingsManager.create(sessionManager.getCwd(), agentDir);
    let stdinContent2;
    if (appMode !== "rpc" && appMode !== "acp") {
      stdinContent2 = await readPipedStdin();
    }
    time("readPipedStdin");
    const { initialMessage: initialMessage2, initialImages: initialImages2 } = await prepareInitialMessage(parsed, settingsManager2.getImageAutoResize(), stdinContent2);
    time("prepareInitialMessage");
    initTheme(settingsManager2.getTheme(), false);
    time("initTheme");
    daemonReady = (await awaitDaemonReady(daemonReady)).ready;
    let connection;
    let summary;
    try {
      ({ connection, summary } = await createDaemonClientConnection({
        socketPath: daemonSocketPath,
        config: defaultSessionConfig,
        sessionPath: parsed.noSession ? void 0 : sessionManager.getSessionFile(),
        continueRecent: parsed.continue,
        clientOwned: true,
        noSession: parsed.noSession,
        supportsExtensionUi: appMode === "rpc"
      }));
    } catch (error) {
      if (error instanceof SessionAlreadyActiveError) {
        console.error(source_default.red(`Error: ${error.message}`));
        process.exit(1);
      }
      throw error;
    }
    const diagnostics = summary.diagnostics ?? [];
    reportDiagnostics(diagnostics);
    if (diagnostics.some((diagnostic) => diagnostic.type === "error")) {
      await connection.dispose();
      process.exit(1);
    }
    if (!summary.model) {
      console.error(source_default.red(summary.modelFallbackMessage ?? formatNoModelsAvailableMessage()));
      await connection.dispose();
      process.exit(1);
    }
    printTimings();
    if (appMode === "rpc") {
      return await runRpcModeWithConnection(connection);
    }
    if (appMode === "acp") {
      return await runAcpModeWithConnection(connection);
    }
    const exitCode = await runPrintModeWithConnection(connection, {
      mode: toPrintOutputMode(appMode),
      messages: parsed.messages,
      initialMessage: initialMessage2,
      initialImages: initialImages2
    });
    stopThemeWatcher();
    restoreStdout();
    if (exitCode !== 0) {
      process.exitCode = exitCode;
    }
    return;
  }
  let runtime;
  try {
    runtime = await createAgentSessionRuntime(createRuntime, {
      cwd: sessionManager.getCwd(),
      agentDir,
      sessionManager,
      sessionConfig: defaultSessionConfig
    });
  } catch (error) {
    if (error instanceof SessionAlreadyActiveError) {
      console.error(source_default.red(`Error: ${error.message}`));
      process.exit(1);
    }
    throw error;
  }
  const { services, session, modelFallbackMessage } = runtime;
  installOwnedSessionRecoveryTracking(runtime);
  const { settingsManager, modelRegistry } = services;
  if (parsed.listModels !== void 0) {
    const searchPattern = typeof parsed.listModels === "string" ? parsed.listModels : void 0;
    await listModels(modelRegistry, searchPattern);
    process.exit(0);
  }
  let stdinContent;
  if (appMode !== "rpc" && appMode !== "acp" && appMode !== "daemon") {
    stdinContent = await readPipedStdin();
  }
  time("readPipedStdin");
  const { initialMessage, initialImages } = await prepareInitialMessage(parsed, settingsManager.getImageAutoResize(), stdinContent);
  time("prepareInitialMessage");
  initTheme(settingsManager.getTheme(), appMode === "interactive");
  time("initTheme");
  if (appMode === "interactive" && deprecationWarnings.length > 0) {
    await showDeprecationWarnings(deprecationWarnings);
  }
  const scopedModels = [...session.scopedModels];
  time("resolveModelScope");
  reportDiagnostics(runtime.diagnostics);
  if (runtime.diagnostics.some((diagnostic) => diagnostic.type === "error")) {
    process.exit(1);
  }
  time("createAgentSession");
  if (appMode !== "interactive" && appMode !== "daemon" && !session.model) {
    console.error(source_default.red(formatNoModelsAvailableMessage()));
    process.exit(1);
  }
  if (appMode === "rpc") {
    printTimings();
    await runRpcMode(runtime);
  } else if (appMode === "acp") {
    printTimings();
    await runAcpMode(runtime);
  } else if (appMode === "interactive") {
    if (explicitAgentsView) {
      console.error(source_default.yellow("Warning: the agents view needs the daemon; opening a normal chat instead"));
    }
    if (scopedModels.length > 0 && (parsed.verbose || !settingsManager.getQuietStartup())) {
      const modelList = scopedModels.map((sm) => {
        const thinkingStr = sm.thinkingLevel ? `:${sm.thinkingLevel}` : "";
        return `${sm.model.id}${thinkingStr}`;
      }).join(", ");
      console.log(source_default.dim(`Model scope: ${modelList} ${source_default.gray("(Ctrl+P to cycle)")}`));
    }
    const interactiveMode = new InteractiveMode({
      agentConnection: new InProcessAgentConnection(runtime),
      localSessionHost: createInteractiveModeLocalSessionHost(runtime),
      promptStashStore: new ClientPromptStashStore(),
      promptStashSessionId: session.sessionId,
      bindLocalSessionExtensions: true,
      migratedProviders,
      modelFallbackMessage,
      initialMessage,
      initialImages,
      initialMessages: parsed.messages,
      verbose: parsed.verbose
    });
    if (startupBenchmark) {
      await interactiveMode.init();
      time("interactiveMode.init");
      printTimings();
      interactiveMode.stop();
      stopThemeWatcher();
      if (process.stdout.writableLength > 0) {
        await new Promise((resolve6) => process.stdout.once("drain", resolve6));
      }
      if (process.stderr.writableLength > 0) {
        await new Promise((resolve6) => process.stderr.once("drain", resolve6));
      }
      return;
    }
    await preloadCodeHighlighter();
    printTimings();
    await interactiveMode.run();
  } else {
    printTimings();
    const exitCode = await runPrintMode(runtime, {
      mode: toPrintOutputMode(appMode),
      messages: parsed.messages,
      initialMessage,
      initialImages
    });
    stopThemeWatcher();
    restoreStdout();
    if (exitCode !== 0) {
      process.exitCode = exitCode;
    }
    return;
  }
}
export {
  createSessionManager,
  daemonServerDefaultSessionConfig,
  findActiveDaemonSessionSummaryForInteractiveStartup,
  findActiveDaemonSessionSummaryForSessionFile,
  main,
  parseAgentsViewCommand,
  resolveRuntimeSessionOptions,
  shouldEnsureDaemonBeforeActiveSessionLookup,
  shouldEnsureInteractiveDaemonForStartup,
  shouldOpenAgentsViewForDaemonInteractive,
  shouldRejectBareResume,
  shouldRejectNonInteractiveAttach,
  shouldUseDaemonClient,
  shouldUseDaemonClientRuntime,
  shouldUseDaemonInteractive,
  shouldUseEphemeralSessionManagerForDaemonInteractive
};
