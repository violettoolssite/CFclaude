import { BLOCK_TYPES } from "./getBlockType.js";
export class BlockDuplicationDetector {
    records;
    constructor() {
        this.records = new Map();
        for (const blockType of BLOCK_TYPES) {
            this.records.set(blockType, new Set());
        }
    }
    isRuleDuplicated(rule) {
        if (typeof rule === "string") {
            return this.check(rule, "rules");
        }
        else {
            return this.check(rule.name, "rules");
        }
    }
    isContextDuplicated(context) {
        return this.check(context.provider, "context");
    }
    isCommonBlockDuplicated(block, blockType) {
        return this.check(block.name, blockType);
    }
    check(identifier, blockType) {
        if (this.records.get(blockType).has(identifier)) {
            return true;
        }
        else {
            this.records.get(blockType).add(identifier);
            return false;
        }
    }
    // Check if the name is duplicated within the same blockType
    isDuplicated(block, blockType) {
        // Not checking any null or undefined object
        if (block === null || block === undefined) {
            return false;
        }
        switch (blockType) {
            case "rules":
                if (this.isRuleDuplicated(block)) {
                    return true;
                }
                return false;
            case "context":
                if (this.isContextDuplicated(block)) {
                    return true;
                }
                return false;
            default:
                if (this.isCommonBlockDuplicated(block, blockType)) {
                    return true;
                }
                return false;
        }
    }
}
//# sourceMappingURL=blockDuplicationDetector.js.map