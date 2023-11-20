/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const gtag = new URL(import.meta.url).searchParams.get('gtag');
(async () => {
  await import(`https://www.googletagmanager.com/gtag/js?id=${gtag}`);
  window.dataLayer = [
    ...window.dataLayer || [],
    ['js', new Date()],
    ['config', gtag]
  ];
})();
