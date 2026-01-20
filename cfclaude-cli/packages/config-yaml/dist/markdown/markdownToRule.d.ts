import { PackageIdentifier } from "../browser.js";
import { RuleObject } from "../schemas/index.js";
export interface RuleFrontmatter {
    globs?: RuleObject["globs"];
    regex?: RuleObject["regex"];
    name?: RuleObject["name"];
    description?: RuleObject["description"];
    alwaysApply?: RuleObject["alwaysApply"];
    invokable?: RuleObject["invokable"];
}
/**
 * Parses markdown content with YAML frontmatter
 */
export declare function parseMarkdownRule(content: string): {
    frontmatter: RuleFrontmatter;
    markdown: string;
};
export declare function getRuleName(frontmatter: RuleFrontmatter, id: PackageIdentifier): string;
export declare function markdownToRule(rule: string, id: PackageIdentifier, relativePathForGlobs?: string): RuleObject;
