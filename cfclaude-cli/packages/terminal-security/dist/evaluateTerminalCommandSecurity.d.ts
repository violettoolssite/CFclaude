import { ToolPolicy } from "./types.js";
/**
 * Evaluates the security policy for a terminal command.
 *
 * This function uses shell-quote for proper tokenization, then implements
 * defense-in-depth security validation for terminal commands.
 *
 * @param basePolicy The base policy configured for the tool
 * @param command The command string to evaluate
 * @returns The security policy to apply: 'disabled', 'allowedWithPermission', or 'allowedWithoutPermission'
 */
export declare function evaluateTerminalCommandSecurity(basePolicy: ToolPolicy, command: string | null | undefined): ToolPolicy;
//# sourceMappingURL=evaluateTerminalCommandSecurity.d.ts.map