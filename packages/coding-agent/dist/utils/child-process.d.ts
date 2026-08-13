import type { ChildProcess } from "node:child_process";
export declare function shouldUseWindowsShell(command: string): boolean;
export declare function signalProcessGroupOrProcess(pid: number, signal: NodeJS.Signals): void;
export declare function waitForChildProcess(child: ChildProcess): Promise<number | null>;
//# sourceMappingURL=child-process.d.ts.map