import { Container, Markdown, Spacer, Text } from "@earendil-works/pi-tui";
import { LOGIN_RECOVERY_MESSAGE } from "../../../core/auth-guidance.js";
import { getMarkdownTheme, theme } from "../theme/theme.js";
import { CollapsibleErrorComponent, normalizeErrorDetails, shouldCollapseErrorDetails, summarizeErrorDetails, } from "./collapsible-error.js";
const OSC133_ZONE_START = "\x1b]133;A\x07";
const OSC133_ZONE_END = "\x1b]133;B\x07";
const OSC133_ZONE_FINAL = "\x1b]133;C\x07";
const LOGIN_RECOVERY_SUFFIX = `\n\n${LOGIN_RECOVERY_MESSAGE}`;
function getThinkingMarkdownTheme(baseTheme) {
    const quiet = (text) => theme.fg("thinkingText", text);
    return {
        ...baseTheme,
        heading: quiet,
        link: quiet,
        linkUrl: quiet,
        code: quiet,
        codeBlock: quiet,
        codeBlockBorder: quiet,
        quote: quiet,
        quoteBorder: quiet,
        hr: quiet,
        listBullet: quiet,
        highlightCode: (code) => code.split("\n").map((line) => quiet(line)),
    };
}
function formatInlineLoginRecoveryMessage(message) {
    const normalized = normalizeErrorDetails(message);
    if (!normalized.endsWith(LOGIN_RECOVERY_SUFFIX)) {
        return undefined;
    }
    const base = normalized.slice(0, -LOGIN_RECOVERY_SUFFIX.length).trimEnd();
    if (!base || shouldCollapseErrorDetails(base)) {
        return undefined;
    }
    return `${base} · ${LOGIN_RECOVERY_MESSAGE}`;
}
/**
 * Component that renders a complete assistant message.
 *
 * Streaming sends one updateContent() per token, so content updates are
 * reconciled lazily at render time (at most once per frame): when the block
 * structure is unchanged, only the text of changed blocks is updated in place,
 * preserving each Markdown child's render cache instead of rebuilding the tree.
 */
export class AssistantMessageComponent extends Container {
    constructor(message, hideThinkingBlock = false, markdownTheme = getMarkdownTheme(), hiddenThinkingLabel = "Thinking...", options = {}) {
        super();
        this.hasToolCalls = false;
        this.expanded = false;
        this.dirty = false;
        this.blockMarkdowns = new Map();
        this.lastBlockTexts = new Map();
        this.hideThinkingBlock = hideThinkingBlock;
        this.markdownTheme = markdownTheme;
        this.hiddenThinkingLabel = hiddenThinkingLabel;
        this.expanded = options.expanded ?? false;
        this.precededByToolActivity = options.precededByToolActivity ?? false;
        // Container for text/thinking content
        this.contentContainer = new Container();
        this.addChild(this.contentContainer);
        if (message) {
            this.updateContent(message);
        }
    }
    invalidate() {
        super.invalidate();
        // Force a full rebuild so theme-dependent children are recreated.
        this.lastSignature = undefined;
        this.dirty = true;
    }
    setHideThinkingBlock(hide) {
        this.hideThinkingBlock = hide;
        this.dirty = true;
    }
    setHiddenThinkingLabel(label) {
        this.hiddenThinkingLabel = label;
        this.dirty = true;
    }
    setExpanded(expanded) {
        if (this.expanded !== expanded) {
            this.expanded = expanded;
            this.dirty = true;
        }
    }
    render(width) {
        if (this.dirty) {
            if (this.lastMessage) {
                this.reconcile(this.lastMessage);
            }
            this.dirty = false;
        }
        const lines = super.render(width);
        if (this.hasToolCalls || lines.length === 0) {
            return lines;
        }
        lines[0] = OSC133_ZONE_START + lines[0];
        lines[lines.length - 1] = OSC133_ZONE_END + OSC133_ZONE_FINAL + lines[lines.length - 1];
        return lines;
    }
    updateContent(message) {
        this.lastMessage = message;
        this.dirty = true;
    }
    /**
     * Everything that affects child component identity/order, but not the text
     * inside a block. While the signature is stable, updates reduce to setText()
     * on changed blocks; any structural change triggers a full rebuild.
     */
    computeSignature(message) {
        const parts = [];
        for (let i = 0; i < message.content.length; i++) {
            const content = message.content[i];
            if (content.type === "text") {
                parts.push(`${i}:text:${content.text.trim() ? 1 : 0}`);
            }
            else if (content.type === "thinking") {
                parts.push(`${i}:thinking:${content.thinking.trim() ? 1 : 0}`);
            }
            else {
                parts.push(`${i}:${content.type}`);
            }
        }
        parts.push(`hide:${this.hideThinkingBlock}`, `label:${this.hiddenThinkingLabel}`, `expanded:${this.expanded}`, `stop:${message.stopReason ?? ""}`, `error:${message.errorMessage ?? ""}`);
        return parts.join("|");
    }
    reconcile(message) {
        const signature = this.computeSignature(message);
        if (signature !== this.lastSignature) {
            this.lastSignature = signature;
            this.rebuild(message);
            return;
        }
        // Structure unchanged: update only blocks whose text changed (during
        // streaming that is just the final block).
        for (let i = 0; i < message.content.length; i++) {
            const markdown = this.blockMarkdowns.get(i);
            if (!markdown) {
                continue;
            }
            const content = message.content[i];
            const text = content.type === "text" ? content.text.trim() : content.type === "thinking" ? content.thinking.trim() : "";
            if (this.lastBlockTexts.get(i) !== text) {
                markdown.setText(text);
                this.lastBlockTexts.set(i, text);
            }
        }
    }
    rebuild(message) {
        // Clear content container
        this.contentContainer.clear();
        this.blockMarkdowns.clear();
        this.lastBlockTexts.clear();
        const hasVisibleContent = message.content.some((c) => (c.type === "text" && c.text.trim()) || (c.type === "thinking" && c.thinking.trim()));
        if (hasVisibleContent) {
            this.contentContainer.addChild(new Spacer(1));
        }
        // Render content in order
        for (let i = 0; i < message.content.length; i++) {
            const content = message.content[i];
            if (content.type === "text" && content.text.trim()) {
                // Assistant text messages with no background - trim the text
                // Set paddingY=0 to avoid extra spacing before tool executions
                const markdown = new Markdown(content.text.trim(), 1, 0, this.markdownTheme);
                this.blockMarkdowns.set(i, markdown);
                this.lastBlockTexts.set(i, content.text.trim());
                this.contentContainer.addChild(markdown);
            }
            else if (content.type === "thinking" && content.thinking.trim()) {
                // Add spacing only when another visible assistant content block follows.
                // This avoids a superfluous blank line before separately-rendered tool execution blocks.
                const hasVisibleContentAfter = message.content
                    .slice(i + 1)
                    .some((c) => (c.type === "text" && c.text.trim()) || (c.type === "thinking" && c.thinking.trim()));
                if (this.hideThinkingBlock) {
                    // Show static thinking label when hidden
                    this.contentContainer.addChild(new Text(theme.italic(theme.fg("thinkingText", this.hiddenThinkingLabel)), 1, 0));
                    if (hasVisibleContentAfter) {
                        this.contentContainer.addChild(new Spacer(1));
                    }
                }
                else {
                    // Thinking traces keep Markdown structure but stay visually quiet.
                    const markdown = new Markdown(content.thinking.trim(), 1, 0, getThinkingMarkdownTheme(this.markdownTheme), {
                        color: (text) => theme.fg("thinkingText", text),
                    });
                    this.blockMarkdowns.set(i, markdown);
                    this.lastBlockTexts.set(i, content.thinking.trim());
                    this.contentContainer.addChild(markdown);
                    if (hasVisibleContentAfter) {
                        this.contentContainer.addChild(new Spacer(1));
                    }
                }
            }
        }
        const hasToolCalls = message.content.some((c) => c.type === "toolCall");
        this.hasToolCalls = hasToolCalls;
        if (message.stopReason === "aborted") {
            const abortMessage = message.errorMessage && message.errorMessage !== "Request was aborted"
                ? message.errorMessage
                : "Operation aborted";
            this.contentContainer.addChild(new Spacer(1));
            this.contentContainer.addChild(this.createErrorComponent(abortMessage));
        }
        else if (!hasToolCalls && message.stopReason === "error") {
            const errorMsg = message.errorMessage || "Unknown error";
            this.contentContainer.addChild(new Spacer(1));
            this.contentContainer.addChild(this.createErrorComponent(errorMsg, "Error"));
        }
        if (hasToolCalls && (hasVisibleContent || message.stopReason === "aborted" || !this.precededByToolActivity)) {
            this.contentContainer.addChild(new Spacer(1));
        }
    }
    createErrorComponent(message, prefix) {
        const inlineLoginRecovery = formatInlineLoginRecoveryMessage(message);
        if (inlineLoginRecovery) {
            const text = prefix ? `${prefix}: ${inlineLoginRecovery}` : inlineLoginRecovery;
            return new Text(theme.fg("error", text), 1, 0);
        }
        if (!shouldCollapseErrorDetails(message)) {
            const text = prefix ? `${prefix}: ${message}` : message;
            return new Text(theme.fg("error", text), 1, 0);
        }
        const text = prefix ? `${prefix}: ${message}` : message;
        const summary = prefix ? `${prefix}: ${summarizeErrorDetails(message)}` : summarizeErrorDetails(message);
        return new CollapsibleErrorComponent({
            text,
            summary,
            expanded: this.expanded,
        });
    }
}
//# sourceMappingURL=assistant-message.js.map