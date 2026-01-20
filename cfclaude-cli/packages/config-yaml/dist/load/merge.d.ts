import { RequestOptions } from "../browser.js";
import { AssistantUnrolled, ConfigYaml } from "../schemas/index.js";
export declare function mergePackages(current: ConfigYaml, incoming: ConfigYaml): ConfigYaml;
export declare function mergeUnrolledAssistants(current: AssistantUnrolled, incoming: AssistantUnrolled): AssistantUnrolled;
export declare function mergeConfigYamlRequestOptions(base: RequestOptions | undefined, global: RequestOptions | undefined): RequestOptions | undefined;
