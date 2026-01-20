import { CACHING_STRATEGIES, } from "./AnthropicCachingStrategies.js";
import { addCacheControlToLastTwoUserMessages, openaiToolToAnthropicTool, } from "./AnthropicUtils.js";
const convertContentToBlocks = (content) => {
    if (typeof content === "string" || typeof content === "number") {
        const text = String(content);
        return {
            blocks: [
                {
                    type: "text",
                    text,
                },
            ],
            textPartIndices: [null],
            wasString: true,
        };
    }
    if (!Array.isArray(content)) {
        return {
            blocks: [],
            textPartIndices: [],
            wasString: false,
        };
    }
    const blocks = [];
    const textPartIndices = [];
    content.forEach((part, idx) => {
        if (part?.type === "text") {
            blocks.push({
                type: "text",
                text: part.text ?? "",
            });
            textPartIndices.push(idx);
        }
        else {
            blocks.push({ ...(part ?? {}) });
            textPartIndices.push(null);
        }
    });
    return {
        blocks,
        textPartIndices,
        wasString: false,
    };
};
const convertToAnthropic = (body) => {
    const systemBlocks = [];
    const systemMappings = [];
    const messages = [];
    const messageMappings = [];
    let systemOffset = 0;
    body.messages.forEach((message, index) => {
        const { blocks, textPartIndices, wasString } = convertContentToBlocks(message.content);
        if (message.role === "system") {
            const length = blocks.length;
            systemMappings.push({
                openaiIndex: index,
                start: systemOffset,
                length,
                wasString,
                originalContent: message.content,
                textPartIndices,
            });
            systemBlocks.push(...blocks);
            systemOffset += length;
        }
        else {
            messages.push({
                role: message.role,
                content: blocks,
            });
            messageMappings.push({
                openaiIndex: index,
                anthropicIndex: messages.length - 1,
                role: message.role,
                wasString,
                originalContent: message.content,
                textPartIndices,
            });
        }
    });
    const tools = body.tools
        ?.filter((tool) => tool.type === "function")
        .map((tool) => openaiToolToAnthropicTool(tool));
    const anthropicBody = {
        model: body.model,
        messages,
        max_tokens: body.max_tokens ?? 1,
        system: systemBlocks.length > 0 ? systemBlocks : undefined,
        tools,
    };
    return { anthropicBody, systemMappings, messageMappings };
};
export const applyAnthropicCachingToOpenRouterBody = (body, strategy) => {
    const { anthropicBody, systemMappings, messageMappings } = convertToAnthropic(body);
    const cachingStrategy = CACHING_STRATEGIES[strategy] ?? CACHING_STRATEGIES.systemAndTools;
    const cachedBody = cachingStrategy({ ...anthropicBody });
    cachedBody.messages = cachedBody.messages ?? [];
    addCacheControlToLastTwoUserMessages(cachedBody.messages);
    const cachedSystem = Array.isArray(cachedBody.system)
        ? cachedBody.system
        : [];
    systemMappings.forEach((mapping) => {
        const openaiMessage = body.messages[mapping.openaiIndex];
        if (!openaiMessage) {
            return;
        }
        const slice = cachedSystem.slice(mapping.start, mapping.start + mapping.length);
        const hasCache = slice.some((block) => block?.cache_control);
        if (!hasCache) {
            openaiMessage.content = mapping.originalContent;
            return;
        }
        if (mapping.wasString) {
            openaiMessage.content = slice.map((block) => ({
                type: "text",
                text: block?.text ?? "",
                ...(block?.cache_control ? { cache_control: block.cache_control } : {}),
            }));
            return;
        }
        if (Array.isArray(mapping.originalContent)) {
            const newParts = mapping.originalContent.map((part) => ({
                ...part,
            }));
            slice.forEach((block, idx) => {
                const originalIndex = mapping.textPartIndices[idx];
                if (originalIndex === null ||
                    originalIndex === undefined ||
                    !block?.cache_control) {
                    return;
                }
                newParts[originalIndex] = {
                    ...newParts[originalIndex],
                    cache_control: block.cache_control,
                    ...(block.text !== undefined ? { text: block.text } : {}),
                };
            });
            openaiMessage.content = newParts;
        }
    });
    const cachedMessages = cachedBody.messages ?? [];
    messageMappings.forEach((mapping) => {
        const openaiMessage = body.messages[mapping.openaiIndex];
        const cachedMessage = cachedMessages[mapping.anthropicIndex];
        if (!openaiMessage || !cachedMessage) {
            return;
        }
        if (cachedMessage.role !== "user") {
            openaiMessage.content = mapping.originalContent;
            return;
        }
        const contentArray = Array.isArray(cachedMessage.content)
            ? cachedMessage.content
            : [];
        const hasCache = contentArray.some((block) => block?.cache_control);
        if (!hasCache) {
            openaiMessage.content = mapping.originalContent;
            return;
        }
        if (mapping.wasString) {
            openaiMessage.content = contentArray.map((block) => ({
                type: "text",
                text: block?.text ?? "",
                ...(block?.cache_control ? { cache_control: block.cache_control } : {}),
            }));
            return;
        }
        if (Array.isArray(mapping.originalContent)) {
            const newParts = mapping.originalContent.map((part) => ({
                ...part,
            }));
            contentArray.forEach((block, idx) => {
                const originalIndex = mapping.textPartIndices[idx];
                if (originalIndex === null ||
                    originalIndex === undefined ||
                    !block?.cache_control) {
                    return;
                }
                newParts[originalIndex] = {
                    ...newParts[originalIndex],
                    cache_control: block.cache_control,
                    ...(block.text !== undefined ? { text: block.text } : {}),
                };
            });
            openaiMessage.content = newParts;
        }
    });
    if (body.tools?.length && cachedBody.tools?.length) {
        body.tools = body.tools.map((tool, idx) => {
            const cachedTool = (cachedBody.tools ?? [])[idx];
            if (!cachedTool?.cache_control) {
                return tool;
            }
            return {
                ...tool,
                cache_control: cachedTool.cache_control,
            };
        });
    }
};
//# sourceMappingURL=OpenRouterCaching.js.map