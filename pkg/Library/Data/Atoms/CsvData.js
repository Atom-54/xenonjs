export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
shouldUpdate({csv, url}) {
  return url || (typeof csv === 'string');
},
async update({csv, url}, state, {isDirty}) {
  let csvText = null;
  if (url && isDirty('url')) {
    csvText = await (await fetch(url)).text();
  } else if (isDirty('csv')) {
    csvText = csv;
  }
  if (csvText) {
    return {lines: this.parseCsv(csvText)};
  }
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
