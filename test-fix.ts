
import { parseVless } from './lib/backend/parsers/vless';
import { buildNodeUrl } from './lib/backend/url-builder';

// URL from User (Reality, Secure)
const targetUrl = "vless://28149cfe-2fae-47e9-8af4-a81a34890d2c@160.191.29.51:64760?encryption=none&flow=xtls-rprx-vision&security=reality&sni=apple.com&fp=chrome&pbk=N14RTyjxj34hx8hqmuJFSwfbFvcWuwomgIND39gcFwo&sid=b38c62c2&type=tcp&headerType=none#IN-Host";

console.log("--- VLESS Rebuild Test ---");
console.log("Original: " + targetUrl);

const node = parseVless(targetUrl);

if (node) {
    // 1. Force remove originalUrl trigger full rebuild
    delete (node as any).originalUrl;
    // 2. Rename to prevent 'name match' logic if originalUrl was somehow kept
    node.name = "TEST_REBUILD";

    // Check internal state
    console.log("Node TLS State:", JSON.stringify(node.tls, null, 2));

    const rebuilt = buildNodeUrl(node);
    console.log("\nRebuilt : " + rebuilt);

    // Assertions
    const hasAllowInsecure = rebuilt.includes("allowInsecure");
    const hasInsecure = rebuilt.includes("insecure=") || rebuilt.includes("&insecure"); // exclude 'allowInsecure' match

    console.log("\n--- Verification ---");
    console.log(`Contains 'allowInsecure'? ${hasAllowInsecure ? "YES (Fail if unexpected)" : "NO (Pass)"}`);
    console.log(`Contains 'insecure='?      ${hasInsecure ? "YES (Fail)" : "NO (Pass)"}`);
}
