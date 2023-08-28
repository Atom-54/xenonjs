export const atom = (log, resolve) => ({
  /**
   * @license
   * Copyright 2023 NeonFlan LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  initialize(inputs, state, {service}) {
    // TODO(sjmiles): shouldn't be hardcoded, um, obvs
    const server = 'https://carrier-sjmiles.vercel.app/api/imap.js';
    //const server = 'http://localhost:3000/api/imap.js';
    const post = (url, body) => fetch(url, {method: 'POST', body: JSON.stringify(body)});
    state.fetchMail = options => post(server, options);
  },
  shouldUpdate({host, user, password, config}) {
    return (config && config.host && config.user && config.password) || (host && user && password);
  },
  async update({config, ...manual}, state) {
    const host = config?.host ?? manual.host;
    const user = config?.user ?? manual.user;
    const password = config?.password ?? manual.password;
    if (!state.fetched) {
      const response = await state.fetchMail({host, user, password});
      const envelope = await response.json();     
      const fullMessages = envelope.messages;
      const messages = map(fullMessages, (key, {body: {date, subject, from, to}}) => {
        return {
          date: new Date(date[0]).toISOString(),
          subject: subject[0],
          from: from[0].replace(/</g, '&lt;'),
          to: to[0].replace(/</g, '&lt;'),
        };
      });
      messages.sort((a, b) => (new Date(b.date)).getTime() - (new Date(a.date)).getTime());
      log(messages);
      state.fetched = messages;
      return {messages};
    }
  }
  });
    