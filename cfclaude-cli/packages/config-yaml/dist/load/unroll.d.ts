import { RequestOptions } from "../browser.js";
import { PlatformClient, Registry } from "../interfaces/index.js";
import { PackageIdentifier, PackageSlug } from "../interfaces/slugs.js";
import { AssistantUnrolled, Block, ConfigYaml } from "../schemas/index.js";
import { ConfigResult } from "../validation.js";
export declare function parseConfigYaml(configYaml: string): ConfigYaml;
export declare function parseAssistantUnrolled(configYaml: string): AssistantUnrolled;
export declare function parseBlock(configYaml: string): Block;
export declare const TEMPLATE_VAR_REGEX: RegExp;
export declare function getTemplateVariables(templatedYaml: string): string[];
export declare function fillTemplateVariables(templatedYaml: string, data: {
    [key: string]: string;
}): string;
export interface TemplateData {
    inputs: Record<string, string> | undefined;
    secrets: Record<string, string> | undefined;
    continue: {};
}
export interface BaseUnrollAssistantOptions {
    renderSecrets: boolean;
    injectBlocks?: PackageIdentifier[];
    allowlistedBlocks?: PackageSlug[];
    blocklistedBlocks?: PackageSlug[];
    injectRequestOptions?: RequestOptions;
}
export interface DoNotRenderSecretsUnrollAssistantOptions extends BaseUnrollAssistantOptions {
    renderSecrets: false;
}
export interface RenderSecretsUnrollAssistantOptions extends BaseUnrollAssistantOptions {
    renderSecrets: true;
    orgScopeId: string | null;
    currentUserSlug: string;
    platformClient: PlatformClient;
    onPremProxyUrl: string | null;
    alwaysUseProxy?: boolean;
}
export type UnrollAssistantOptions = DoNotRenderSecretsUnrollAssistantOptions | RenderSecretsUnrollAssistantOptions;
export declare function unrollAssistant(id: PackageIdentifier, registry: Registry, options: UnrollAssistantOptions): Promise<ConfigResult<AssistantUnrolled>>;
export declare function replaceInputsWithSecrets(yamlContent: string): string;
export declare function unrollAssistantFromContent(id: PackageIdentifier, rawYaml: string, registry: Registry, options: UnrollAssistantOptions): Promise<ConfigResult<AssistantUnrolled>>;
export declare function unrollBlocks(assistant: ConfigYaml, registry: Registry, injectBlocks: PackageIdentifier[] | undefined, allowlistedBlocks?: PackageSlug[], blocklistedBlocks?: PackageSlug[], injectRequestOptions?: RequestOptions): Promise<ConfigResult<AssistantUnrolled>>;
export declare function resolveBlock(id: PackageIdentifier, inputs: Record<string, string | undefined> | undefined, registry: Registry): Promise<AssistantUnrolled>;
export declare function parseMarkdownRuleOrAssistantUnrolled(content: string, id: PackageIdentifier): AssistantUnrolled;
export declare function mergeOverrides<T extends Record<string, any>>(block: T, overrides: Partial<T>): T;
