import { Ingester } from "../ingester.js";
import RSSParser from "rss-parser";
const stripHtml = function (str) {
    str = str.replace(/([^\n])<\/?(h|br|p|ul|ol|li|blockquote|section|table|tr|div)(?:.|\n)*?>([^\n])/gm, "$1\n$3");
    str = str.replace(/<(?:.|\n)*?>/gm, "");
    return str;
};
export default class RSS extends Ingester {
    constructor(options) {
        super(options);
    }
    async *getStringsFromSource(source) {
        if (!source) {
            throw new Error("RSS source is not defined");
        }
        const feed = await new RSSParser().parseURL(source);
        for (const item of feed.items) {
            const content = item["content:encoded"] || item.contentSnippet || "";
            const cleanContent = stripHtml(content);
            yield {
                text: cleanContent,
                info: {
                    url: item.link || "",
                    title: item.title || "",
                },
            };
        }
    }
}
