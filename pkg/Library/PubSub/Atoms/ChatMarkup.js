export const atom = (log) => ({
  /**
   * @license
   * Copyright 2023 NeonFlan LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  async update({messages_0, messages_1, messages_2, messages_3}, state, {isDirty}) {
    const messages = [messages_0, messages_1, messages_2, messages_3].reduce((all, msgs) => (msgs?.length && all.push(...msgs), all), []);
    return {
      markup: this.composeMarkup(messages)
    };
  },
  composeMarkup(messages) {
    const bubblify = (color, name) => `<span style="background-color: ${color};">${name}</span>`;
    const color = ['#5d96be', '#be855d', '#855dbe', '#b65dbe', '#96be5d', '#5d66be'];
    const styles = {};
    const markup = messages?.filter(({role, name, msg}) => role && name && msg).map(({role, name, msg}) => {
      const style = styles[name] ??= color[keys(styles).length % 6];
      return `<div bubbly>${bubblify(style, name)}${msg}</div>`
    }).join('');
    return `
<style>
  div[bubbly] {
    display: flex;
    align-items: center;
    margin-bottom: 0.3em;
  }
  [bubbly] > span {
    display: inline-block; 
    font-weight: bold; 
    font-size: 0.8em; 
    padding: 0px 7px 1px; 
    margin-right: 16px; 
    border-radius: 8px; 
    color: white;
    width: 10em;
    text-align: center;
  }
</style>
${markup || ''}
    `
  },
  // buildColorChart(personas) {
  //   const color = ['#5d96be', '#be855d', '#855dbe', '#b65dbe', '#96be5d', '#5d66be'];
  //   // make an object with keys from `personas` matched with colors from list above (this is the 'ColorChart', c.f. "Call Me")
  //   return keys(personas).reduce((chart, p, i) => {
  //     chart[p] = color[i%6];
  //     return chart;
  //   }, create(null));
  // }
  });
  