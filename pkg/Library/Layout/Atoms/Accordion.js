export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
render({sections}) {
  return {
    sectionsNames: sections?.join(','),
    sections: sections?.map((section, i) => ({section, container: `Container${i}`}))
  }
},

template: html`
<style>
:host {
}
</style>

<weightless-accordion sections="{{sectionsNames}}" repeat="section_t">{{sections}}</weightless-accordion>

<template section_t>
  <slot name="{{container}}" slot="{{section}}"></slot>
</template
`
});
