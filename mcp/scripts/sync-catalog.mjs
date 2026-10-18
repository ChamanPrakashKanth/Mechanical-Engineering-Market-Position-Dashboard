import { readFile, writeFile } from "node:fs/promises";
import vm from "node:vm";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const source = await readFile(path.join(root, "app.js"), "utf8");

function extractLiteral(name, opener) {
    const marker = `const ${name} = `;
    const start = source.indexOf(marker);
    if (start < 0) throw new Error(`Could not find ${name} in app.js`);
    const literalStart = start + marker.length;
    let depth = 0, quote = null, escaped = false;
    for (let index = literalStart; index < source.length; index++) {
        const char = source[index];
        if (quote) {
            if (escaped) escaped = false;
            else if (char === "\\") escaped = true;
            else if (char === quote) quote = null;
            continue;
        }
        if (char === "\"" || char === "'" || char === "`") { quote = char; continue; }
        if (char === opener) depth++;
        else if (char === (opener === "{" ? "}" : "]")) {
            depth--;
            if (depth === 0) return vm.runInNewContext(`(${source.slice(literalStart, index + 1)})`);
        }
    }
    throw new Error(`Could not parse ${name} from app.js`);
}

const catalog = {
    domains: extractLiteral("DOMAINS_CATALOG", "{"),
    roles: extractLiteral("LINKEDIN_JOB_ROLES", "[")
};
await writeFile(path.join(root, "mcp", "data", "career-catalog.json"), `${JSON.stringify(catalog, null, 2)}\n`);
console.log(`Synced ${Object.keys(catalog.domains).length} domains and ${catalog.roles.length} role definitions from app.js.`);
