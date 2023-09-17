import {Polymath} from './client/main.js';
import {apiKey} from '../../../other/agents/cloudflare/src/key.js';

console.log(Polymath);

let p = new Polymath({
   apiKey,
   libraryFiles: ['./libraries/knowledge-string.json'],
   debug: true
});

let r = await p.ask("How long is a piece of string?");
console.log("Context: ", r.context());