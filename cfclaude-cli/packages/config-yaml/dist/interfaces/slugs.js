function getProcessEnv() {
    if (typeof process !== "undefined" &&
        process &&
        typeof process === "object") {
        return process.env;
    }
    if (typeof globalThis !== "undefined") {
        const maybeProcess = globalThis.process;
        return maybeProcess?.env;
    }
    return undefined;
}
function getHomeDirectory() {
    const env = getProcessEnv();
    const fromHome = env?.HOME?.trim();
    if (fromHome) {
        return fromHome;
    }
    const fromUserProfile = env?.USERPROFILE?.trim();
    if (fromUserProfile) {
        return fromUserProfile;
    }
    return undefined;
}
function expandLeadingTilde(identifier) {
    const homeDirectory = getHomeDirectory();
    if (!homeDirectory) {
        return identifier;
    }
    // Only replace a leading ~ so relative paths like ../~file stay untouched
    return homeDirectory + identifier.slice(1);
}
export function packageIdentifierToDisplayName(id) {
    switch (id.uriType) {
        case "file":
            return id.fileUri;
        case "slug":
            return id.fullSlug.packageSlug;
    }
}
export function encodePackageIdentifier(identifier) {
    switch (identifier.uriType) {
        case "slug":
            return encodeFullSlug(identifier.fullSlug);
        case "file":
            // For file paths, just return the path directly without a prefix
            return identifier.fileUri;
        default:
            throw new Error(`Unknown URI type: ${identifier.uriType}`);
    }
}
export function decodePackageIdentifier(identifier) {
    // Shorthand: if it starts with . or /, then it's a path
    if (identifier.startsWith(".") || identifier.startsWith("/")) {
        return {
            uriType: "file",
            fileUri: identifier,
        };
    }
    // Keep support for explicit file:// protocol
    else if (identifier.startsWith("file://")) {
        return {
            uriType: "file",
            fileUri: identifier.substring(7),
        };
    }
    // support ~ by replacing with home directory
    else if (identifier.startsWith("~")) {
        return {
            uriType: "file",
            fileUri: expandLeadingTilde(identifier),
        };
    }
    // Otherwise, it's a slug
    return {
        uriType: "slug",
        fullSlug: decodeFullSlug(identifier),
    };
}
export var VirtualTags;
(function (VirtualTags) {
    VirtualTags["Latest"] = "latest";
})(VirtualTags || (VirtualTags = {}));
export function encodePackageSlug(packageSlug) {
    return `${packageSlug.ownerSlug}/${packageSlug.packageSlug}`;
}
export function decodePackageSlug(pkgSlug) {
    const [ownerSlug, packageSlug] = pkgSlug.split("/");
    return {
        ownerSlug,
        packageSlug,
    };
}
export function encodeFullSlug(fullSlug) {
    return `${fullSlug.ownerSlug}/${fullSlug.packageSlug}@${fullSlug.versionSlug}`;
}
export function packageSlugsEqual(pkgSlug1, pkgSlug2) {
    return (pkgSlug1.ownerSlug === pkgSlug2.ownerSlug &&
        pkgSlug1.packageSlug === pkgSlug2.packageSlug);
}
export function decodeFullSlug(fullSlug) {
    const [ownerSlug, packageSlug, versionSlug] = fullSlug.split(/[/@]/);
    return {
        ownerSlug,
        packageSlug,
        versionSlug: versionSlug || VirtualTags.Latest,
    };
}
export function encodeFQSN(fqsn) {
    const parts = [...fqsn.packageSlugs.map(encodePackageSlug), fqsn.secretName];
    return parts.join("/");
}
export function decodeFQSN(fqsn) {
    const parts = fqsn.split("/");
    const secretName = parts.pop();
    const packageSlugs = [];
    // Process parts two at a time to decode package slugs
    for (let i = 0; i < parts.length; i += 2) {
        if (i + 1 >= parts.length) {
            throw new Error("Invalid FQSN format: package slug must have two parts");
        }
        packageSlugs.push({
            ownerSlug: parts[i],
            packageSlug: parts[i + 1],
        });
    }
    return { packageSlugs, secretName };
}
//# sourceMappingURL=slugs.js.map