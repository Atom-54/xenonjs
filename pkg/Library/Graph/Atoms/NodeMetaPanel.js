export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
render({meta}) {
  if (meta) {
    const inputs = [];
    const outputs = [];
    entries(meta).forEach(([key, {inputs: ins, outputs: outs}]) => {
      if (!['state'].includes(key)) {
        ins?.forEach(name => inputs.push(this.renderBinding(key, name, meta)));
        outs?.forEach(name => outputs.push(this.renderBinding(key, name, meta)));
      }
    });
    return {
      title: meta.title ?? meta.type.split('/').pop(),
      description: meta.description,
      showDescription: String(meta.description?.length > 0),
      inputs,
      showInputs: String(inputs.length > 0),
      outputs,
      showOutputs: String(outputs.length > 0)
    };
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
    --shadow: 6px 6px 12px var(--xcolor-two), -6px -6px 12px var(--xcolor-one);
  }
  [panel] {
    background-color: var(--xcolor-two);
    color: var(--xcolor-four);
    font-size: 12px;
    border-radius: 31px;
    padding: 20px;
  }
  [title] {
    font-size: 1.2em;
    font-weight: bold;
    /* padding-top: 20px; */
    text-align: center;
    white-space: break-spaces;
  }
  [subtitle] {
    color: var(--xcolor-three);
    font-style: italic;
    text-align: left;
    padding: 10px 10px 0 10px;    
  }
  [description] {
    color: var(--xcolor-three);
    font-style: italic;
    text-align: left;
    padding: 0 10px;
  }
  [info] {
    padding: 10px;
  }
  [io] {
    line-height: 22px;
    padding: 0px;
  }
  [label] {
    font-size: 1.1em;
    font-weight: bold; 
    padding-right: 4px;
    vertical-align: top;
    width: 60px;
  }
  [name] {
    padding-right: 20px;
    min-width: 80px;
    max-width: 150px;
  }
  [type] {
    color: var(--xcolor-three);
    padding-right: 20px;
    min-width: 80px;
    max-width: 150px;
  }
  [inputs] {
    /* border: 1px solid var(--xcolor-three); */
  }
  [inputs][outputs="true"] {
    margin-bottom: 8px;
  }
  [shadow] {
    pointer-events: none;
    position: absolute;
    inset: 0;
    opacity: 80%;
    box-shadow: var(--shadow);
    border-radius: 31px;
    overflow: hidden;
    border: 1px solid violet;
  }
</style>

<div panel flex>
  <div title>{{title}}</div>
  <div subtitle display$="{{showDescription}}">{{description}}</div>
  <div info>
    <div io label display$="{{showInputs}}">Inputs</div>
    <div inputs outputs$="{{showOutputs}}" display$="{{showInputs}}" repeat="io">{{inputs}}</div>
    <div io label display$="{{showOutputs}}">Outputs</div>
    <div inputs display$="{{showOutputs}}" repeat="io">{{outputs}}</div>
  </div>
  <div shadow></div>
</div>

<template io>
  <div bar>
    <div io name>{{name}}</div>
    <div io type>{{type}}</div>
    <div io flex description display$="{{showDescription}}">{{description}}</div>
  </div>
</template>
`
});
