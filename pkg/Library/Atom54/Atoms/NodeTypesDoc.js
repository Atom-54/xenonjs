export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async update(inputs, state, {service}) {
  state.info = await service('GraphService', 'getNodeTypeMetas');
},
render(inputs, {info}) {
  return {
    categories: keys(info).map(name => ({
      name,
      metas: entries(info[name]).map(([id, meta]) => this.renderMeta(id, meta))
    }))
  }
},
renderMeta(id, meta) {
  const inputs = [];
  const outputs = [];
  entries(meta).forEach(([key, {inputs: ins, outputs: outs}]) => {
    if (!['state'].includes(key)) {
      ins?.forEach(name => inputs.push(this.renderBinding(key, name, meta)));
      outs?.forEach(name => outputs.push(this.renderBinding(key, name, meta)));
    }
  });
  return {
    title: id,
    description: meta.description ?? '// TODO: please, add description for this awesome node!',
    inputs,
    showInputs: String(inputs.length > 0),
    outputs,
    showOutputs: String(outputs.length > 0)
  }
},
renderBinding(key, name, meta) {
  const propName = `${key}$${name}`;
  return {
    name,
    type: meta.types?.[propName] || 'Pojo',
    description: meta?.types?.[`${propName}Description`],
    showDescription: String(meta?.types?.[`${propName}Description`]?.length > 0)
  }
},
template: html`
<style>
  :host {
    display: flex;
    flex-direction: column;
  }
  [categories] {
    overflow: scroll;
    /* padding: 10px; */
  }
  [category-name] {
    color: var(--xcolor-one);
    background-color: var(--xcolor-four);
    font-size: 1.2em;
    font-weight: bold;
    padding: 20px;
    text-transform: uppercase;
  }
  [meta] {
    padding-bottom: 20px;
  }
  [title] {
    color: var(--xcolor-brand);
    background-color: var(--xcolor-two);
    padding: 20px;
  }
  [description] {
    color: var(--xcolor-three);
    font-style: italic;
    padding-left: 20px;
  }
  [inputs] {
    padding-left: 20px;
  }
  [io] {
    line-height: 22px;
    padding: 0px;
  }
  [label] {
    font-size: 1.1em;
    font-weight: bold; 
    padding-left: 20px;
    padding-right: 4px;
    text-decoration: underline;
    vertical-align: top;
    width: 60px;
  }
  [io-name] {
    padding-right: 20px;
    min-width: 80px;
    max-width: 150px;
  }
  [io-type] {
    color: var(--xcolor-three);
    padding-right: 20px;
    min-width: 80px;
    max-width: 150px;
  }

</style>
<h1>All XenonJs and Atom54 node types information:</h1>

<div categories repeat="category_t">{{categories}}</div>

<template category_t>
  <div>
    <div category-name>{{name}}</div>
    <div repeat="meta_t">{{metas}}</div>
  </div>
</template>

<template meta_t>
  <div meta>
    <div title>{{title}}</div>
    <div description>{{description}}</div>
    <div info>
      <div io label display$="{{showInputs}}">Inputs</div>
      <div inputs outputs$="{{showOutputs}}" display$="{{showInputs}}" repeat="io">{{inputs}}</div>
      <div io label display$="{{showOutputs}}">Outputs</div>
      <div inputs display$="{{showOutputs}}" repeat="io">{{outputs}}</div>
    </div>
  </div>
</template>

<template io>
  <div bar io-bar>
    <div io io-name>{{name}}</div>
    <div io io-type>{{type}}</div>
    <div io flex description display$="{{showDescription}}">{{description}}</div>
  </div>
</template>

`
});