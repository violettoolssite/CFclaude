import { BlockType } from "./getBlockType.js";
export declare class BlockDuplicationDetector {
    private records;
    constructor();
    private isRuleDuplicated;
    private isContextDuplicated;
    private isCommonBlockDuplicated;
    private check;
    isDuplicated(block: any, blockType: BlockType): boolean;
}
