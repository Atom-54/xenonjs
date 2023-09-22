//import { Ingester } from "../ingester.js";
//import { convert } from "html-to-text";

const convert = (html, opts) => {
  const {content} = Object.assign(document.createElement('template'), {innerHTML: `<div>${html}</div>`});
  Array.from(content.querySelectorAll('script, link, svg, img, style, head, a[role="button"]')).forEach(n => n.remove());
  const body = content.querySelector('#bodyContent') || content.firstElementChild;
  const text = body.innerText;
  console.log(text);
  return text;
};

// export default class HTML extends Ingester {
//   constructor(options) {
//     super(options);
//   }

async function *getStringsFromSource(source) {
  if (!source) {
    throw new Error("HTML source is not defined");
  }
  const html = this.options.html || await (await fetch(source)).text();
  // Title and description parsing are naieve
  const titleMatch = html.match(/<title>(.*?)<\/title>/);
  const title = titleMatch ? titleMatch[1] : "";
  const descriptionMatch = html.match(/<meta name="description" content="(.*?)"/);
  const description = descriptionMatch ? descriptionMatch[1] : "";
  // We need to strip some stuff, like images.
  const text = convert(html, {});
  yield {
    text,
    info: {
      url: source,
      description,
      title
    }
  };
}
