import { Ingester } from "../ingester.js";
import { convert } from "html-to-text";
export default class HTML extends Ingester {
    constructor(options) {
        super(options);
    }
    async *getStringsFromSource(source) {
        if (!source) {
            throw new Error("HTML source is not defined");
        }
        const html = await (await fetch(source)).text();
        // We need to strip some stuff, like images.
        // Title and description parsing are naieve
        const titleMatch = html.match(/<title>(.*?)<\/title>/);
        const title = titleMatch ? titleMatch[1] : "";
        const descriptionMatch = html.match(/<meta name="description" content="(.*?)"/);
        const description = descriptionMatch ? descriptionMatch[1] : "";
        const text = convert(html, {});
        yield {
            text,
            info: {
                url: source,
                description,
                title,
            },
        };
    }
}
