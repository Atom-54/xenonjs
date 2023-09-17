//import { join } from "path";
//import { createHash } from "crypto";
import { Polymath } from "../client/index.js";
//import chalk from "chalk";
import { Ingester } from "./ingester.js";
import { encodeEmbedding } from "./utils.js";
// const error = (...args) => console.error(chalk.red("ERROR:", ...args));
// const log = (msg, ...args) => console.log(chalk.green(`\n${msg}`), chalk.bold(...args));
const error = (...args) => console.error("ERROR:", ...args);
const log = (msg, ...args) => console.log(`\n${msg}`, ...args);
const generateId = (input) => Math.random(); //createHash("md5").update(input).digest("hex");
const join = (...args) => args.join('/');

// The importer is an API that can be used by any tool (e.g, the CLI.)
export class Ingest {
    async *run(args) {
        const importerArg = args.importer;
        const source = args.source;
        const debug = args.options?.debug;
        const apiKey = args.options?.apiKey;
        let ingester;
        if (!importerArg) {
            error("Please configure an importer");
            throw new Error("Please configure an importer");
        }
        if (importerArg instanceof Ingester) {
            ingester = importerArg;
        }
        else {
            ingester = await createIngesterInstance(importerArg, args.options);
        }
        if (apiKey == null) {
            error("Please provide an OpenAI API key");
            throw new Error("Please provide an OpenAI API key");
        }
        const polymath = new Polymath({ apiKey, debug });
        for await (const chunk of ingester.generateChunks(source)) {
            log(`Importing chunk ${chunk.info?.url}`);
            if (chunk.text == null) {
                continue;
            }
            const id = generateId(source.trim() + "\n" + chunk.text.trim());
            log(`Id: ${id}`);
            const tokenCount = polymath.getPromptTokenCount(chunk.text);
            chunk.id = id;
            chunk.token_count = tokenCount;
            chunk.embedding = encodeEmbedding(await polymath.generateEmbedding(chunk.text));
            log(`Token count: ${tokenCount}`);
            yield chunk;
        }
        log("\nDone importing\n\n");
    }
}
async function createIngesterInstance(importerArg, options) {
    let loadedImporter;
    if (!importerArg.startsWith("../") && !importerArg.startsWith("./")) {
        log(`Loading built-in importer: ${importerArg}`);
        loadedImporter = await Ingester.load(join("builtin-importers", `${importerArg}.js`));
    }
    else {
        log(`Loading external importer: ${importerArg}`);
        // We should probably do some validations.
        loadedImporter = await Ingester.load(importerArg);
    }
    if (!loadedImporter) {
        error(`Importer ${importerArg} not found`);
        throw new Error(`Importer ${importerArg} not found`);
    }
    // <any> is needed here because the typescript compiler doesn't like it when we use the `new` keyword on a dynamic import.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const importer = new loadedImporter(options);
    return importer;
}
export { Ingester };
