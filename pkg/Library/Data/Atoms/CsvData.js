export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
shouldUpdate({csv, url}) {
  return url || (typeof csv === 'string');
},
async update({csv, url}) {
  if (url) {
    csv = await (await fetch(url)).text();
  }
  return {lines: this.parseCsv(csv)};
},
parseCsv(csvText) {
  csvText.replace('\r', '');
  const lines = [];
  let values = [];
  let value = '';
  let inQuote = false;
  for (let i=0; i<csvText.length; i++) {
    const code = csvText[i];
    if (code === '"') {
      if (inQuote && csvText[i+1] === '"') {
        i++;
      } else {
        inQuote = !inQuote;
      }
    } else if (inQuote) {
      value += code;
    } else if (code === '\n') {       
      values.push(value);
      value = '';
      lines.push(values);
      values = [];
    } else if (code === ',') {
      values.push(value);
      value = '';
    } else {
      value += code;
    }
  }
  return lines;
}
});
