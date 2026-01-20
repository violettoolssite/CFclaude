import * as YAML from "yaml";
import { packageIdentifierToDisplayName, } from "../browser.js";
/**
 * Parses markdown content with YAML frontmatter
 */
export function parseMarkdownRule(content) {
    // Normalize line endings to \n
    const normalizedContent = content.replace(/\r\n/g, "\n");
    // More reliable frontmatter detection
    const parts = normalizedContent.split(/^---\s*$/m);
    // If we have at least 3 parts (before ---, frontmatter, after ---), we have frontmatter
    if (parts.length >= 3) {
        const frontmatterStr = parts[1];
        // Join the remaining parts back together (in case there are more --- in the markdown)
        const markdownContent = parts.slice(2).join("---");
        try {
            // Parse YAML frontmatter
            const frontmatter = YAML.parse(frontmatterStr) || {}; // Handle empty frontmatter
            return { frontmatter, markdown: markdownContent.trim() };
        }
        catch (e) {
            // Error parsing frontmatter, treat as markdown only
            console.warn("Error parsing markdown frontmatter:", e);
            return { frontmatter: {}, markdown: normalizedContent };
        }
    }
    // No frontmatter found
    return { frontmatter: {}, markdown: normalizedContent };
}
export function getRuleName(frontmatter, id) {
    if (frontmatter.name) {
        return frontmatter.name;
    }
    const displayName = packageIdentifierToDisplayName(id);
    // If it's a file identifier, extract the last two parts of the file path
    if (id.uriType === "file") {
        // Handle both forward slashes and backslashes, get the last two segments
        const segments = displayName.split(/[/\\]/);
        const lastTwoParts = segments.slice(-2);
        return lastTwoParts.filter(Boolean).join("/");
    }
    // Otherwise return the display name as-is (for slug identifiers)
    return displayName;
}
function getGlobPattern(globs, relativeDir) {
    if (relativeDir === undefined) {
        return globs;
    }
    if (relativeDir.includes(".continue")) {
        return globs;
    }
    if (!relativeDir.endsWith("/")) {
        relativeDir = relativeDir.concat("/");
    }
    const prependDirAndApplyGlobstar = (glob) => {
        if (glob.startsWith("**")) {
            return relativeDir.concat(glob);
        }
        return relativeDir.concat("**/", glob);
    };
    if (!globs) {
        return relativeDir.concat("**/*");
    }
    if (Array.isArray(globs)) {
        return globs.map(prependDirAndApplyGlobstar);
    }
    return prependDirAndApplyGlobstar(globs);
}
export function markdownToRule(rule, id, relativePathForGlobs) {
    const { frontmatter, markdown } = parseMarkdownRule(rule);
    return {
        name: getRuleName(frontmatter, id),
        rule: markdown,
        globs: getGlobPattern(frontmatter.globs, relativePathForGlobs),
        regex: frontmatter.regex,
        description: frontmatter.description,
        alwaysApply: frontmatter.alwaysApply,
        invokable: frontmatter.invokable,
        sourceFile: id.uriType === "file" ? id.fileUri : undefined,
    };
}
//# sourceMappingURL=markdownToRule.js.map