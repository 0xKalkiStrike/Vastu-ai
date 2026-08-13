import { createRequire as __piBundleCreateRequire } from 'node:module'; const require = __piBundleCreateRequire(import.meta.url);
import {
  closeOwnedSessionWorkerOwnerWatch,
  installOwnedSessionWorkerOwnerWatch,
  isOwnedSessionWorkerProcess,
  maybeRunOwnedSessionWorkerFrontend,
  maybeStartDaemonEarly
} from "./chunk-BZDGQ63S.js";
import {
  APP_NAME
} from "./chunk-AN7FDQCZ.js";
import "./chunk-5QCJ5DQU.js";
import "./chunk-SJRJPSXP.js";
import "./chunk-2T7M7VJ4.js";
import "./chunk-ZE5IALUH.js";
import "./chunk-6GUVYK6P.js";
import "./chunk-UPDAFKL5.js";
import "./chunk-JM6I4LOJ.js";
import "./chunk-BAWSWWEU.js";

// dist/cli-main.js
import { enableCompileCache } from "node:module";
async function runCli() {
  try {
    enableCompileCache?.();
  } catch {
  }
  process.title = APP_NAME;
  process.env.PI_CODING_AGENT = "true";
  process.emitWarning = (() => {
  });
  installOwnedSessionWorkerOwnerWatch();
  const args = process.argv.slice(2);
  const handledByOwnedWorker = await maybeRunOwnedSessionWorkerFrontend(args);
  if (!handledByOwnedWorker) {
    if (!isOwnedSessionWorkerProcess()) {
      maybeStartDaemonEarly(process.argv.slice(2));
    }
    const [{ EnvHttpProxyAgent, setGlobalDispatcher }, { main }] = await Promise.all([
      import("undici"),
      import("./main-2LJABCVE.js")
    ]);
    setGlobalDispatcher(new EnvHttpProxyAgent({ bodyTimeout: 0, headersTimeout: 0 }));
    try {
      await main(process.argv.slice(2));
    } finally {
      closeOwnedSessionWorkerOwnerWatch();
    }
  }
}
export {
  runCli
};
