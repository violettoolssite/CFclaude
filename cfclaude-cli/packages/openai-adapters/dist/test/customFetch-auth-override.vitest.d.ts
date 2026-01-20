export {};
/**
 * Note: Full integration testing of the header override logic requires
 * mocking the entire fetch stack (@continuedev/fetch package) which is
 * complex. The above tests verify the function structure and basic behavior.
 *
 * The actual header removal logic is tested end-to-end by:
 * - Manual testing with MITRE AIP endpoints
 * - Real-world usage showing duplicate headers are resolved
 *
 * Related issues:
 * - #7047: Duplicate headers bug
 * - #8684: Authorization header fix (this extends it)
 */
