export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
render(inputs) {
  return {
    ...inputs,
    imageSrc: inputs.imageSrc && resolve(inputs.imageSrc)
  }
},
template: html`
<sp-card size="{{size}}" variant="{{variant}}" heading="{{heading}}" subheading="{{subheading}}" href="{{link}}" asset="{{asset}}" horizontal="{{horizontal}}">
  <img alt="{{altText}}" slot="cover-photo" src="{{imageSrc}}">
  <!-- <div slot="description">{{description}}</div> -->
  <!-- <div slot="footer">{{footer}}</div> -->
  <sp-action-menu slot="actions" placement="bottom-end" quiet>
    <sp-menu-item>Deselect</sp-menu-item>
    <sp-menu-item>Select Inverse</sp-menu-item>
    <sp-menu-item>Feather...</sp-menu-item>
    <sp-menu-item>Select and Mask...</sp-menu-item>
    <sp-menu-divider></sp-menu-divider>
    <sp-menu-item>Save Selection</sp-menu-item>
    <sp-menu-item disabled>Make Work Path</sp-menu-item>
  </sp-action-menu>
</sp-card>
`
});
