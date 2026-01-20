export interface PromptFrontmatter {
    name?: string;
    description?: string;
    invokable?: boolean;
}
/**
 * Creates markdown content with YAML frontmatter for prompts
 */
export declare function createMarkdownWithPromptFrontmatter(frontmatter: PromptFrontmatter, prompt: string): string;
/**
 * Creates a prompt markdown file content from prompt components
 */
export declare function createPromptMarkdown(name: string, promptContent: string, options?: {
    description?: string;
    invokable?: boolean;
}): string;
