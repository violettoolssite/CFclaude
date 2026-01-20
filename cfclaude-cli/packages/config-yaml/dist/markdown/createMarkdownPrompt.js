import * as YAML from "yaml";
/**
 * Creates markdown content with YAML frontmatter for prompts
 */
export function createMarkdownWithPromptFrontmatter(frontmatter, prompt) {
    const frontmatterStr = YAML.stringify(frontmatter).trim();
    return `---\n${frontmatterStr}\n---\n\n${prompt}`;
}
/**
 * Creates a prompt markdown file content from prompt components
 */
export function createPromptMarkdown(name, promptContent, options = {}) {
    const frontmatter = {
        name: name.trim(),
    };
    if (options.description) {
        frontmatter.description = options.description.trim();
    }
    if (options.invokable !== undefined) {
        frontmatter.invokable = options.invokable;
    }
    return createMarkdownWithPromptFrontmatter(frontmatter, promptContent);
}
//# sourceMappingURL=createMarkdownPrompt.js.map