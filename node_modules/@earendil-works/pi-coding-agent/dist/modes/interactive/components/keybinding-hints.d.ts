/**
 * Utilities for formatting keybinding hints in the UI.
 */
import { type Keybinding } from "@earendil-works/pi-tui";
export interface KeyTextOptions {
    primaryOnly?: boolean;
}
export declare function formatKeyText(key: string, platform?: NodeJS.Platform): string;
export declare function keyText(keybinding: Keybinding, options?: KeyTextOptions): string;
export declare function keyHint(keybinding: Keybinding, description: string, options?: KeyTextOptions): string;
export declare function rawKeyHint(key: string, description: string): string;
//# sourceMappingURL=keybinding-hints.d.ts.map