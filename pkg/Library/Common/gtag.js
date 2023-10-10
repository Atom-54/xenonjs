/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

(async () => {
  await import('https://www.googletagmanager.com/gtag/js?id=G-KXNNFC60KV');

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-KXNNFC60KV');
})();
