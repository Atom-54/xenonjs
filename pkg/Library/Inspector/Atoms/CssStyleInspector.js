export const atom = (log, resolve) => ({

/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
shouldRender({data, key}) {
  return (data && key);
},
onFlairChange({eventlet: {key, value}, data, propName, flairs}) {
  const style = flairs?.[value];
  if (style) {
    return this.updateValue(data, propName, style);    
  }
},
onPropChange({eventlet: {key, value}, data, propName}) {
  return this.updateValue(data, propName, {[key]: value});
},
updateValue(data, propName, newValue) {
  if (!propName) {
    propName = 'CssStyle';
  }
  if (!data) {
    data = {
      props: [{
        name: propName,
        value: {}
      }]
    };
  };
  // find index of prop with 'name'
  const prop = this.propByName(data.props, propName);
  prop.value = {...prop.value, ...newValue};
  return {data};
},
propByName(props, name) {
  return props?.find(p => p.name === name);
},
template: html`
<style>
  [cell] {
    width: 7em;
    padding: 2px 12px; 
  }
  [label] {
    /* color: var(--xcolor-three); */
    font-size: 0.6em;
    /* margin-bottom: -2px; */
  }
  input, select {
    color: var(--xcolor-four);
    background: var(--xcolor-two);
    border-radius: 8px;
    padding: 0px 2px;
    border: none;
    width: 100%;
    font-size: 0.6em;
    font-weight: bold;
    height: 2em;
    margin: 0;
  }
  input {
    margin-top: 3px;
  }
</style>

<div style="padding-bottom: 8px;">CssStyle</div>

<div grid>
  <div cell>
    <div label>Flair</div>
    <select key="flair" on-change="onFlairChange">
      <option></option>
      <option>None</option>
      <option>Alpha</option>
      <option>Beta</option>
      <option>Gamma</option>
      <option>Delta</option>
    </select>
  </div>

  <div cell>
    <div label>Font Size</div>
    <select key="fontSize" on-change="onPropChange">
      <option></option>
      <option value="0.5em">tiny</option>
      <option value="0.8em">small</option>
      <option value="1.1em">medium</option>
      <option value="2.5em">large</option>
    </select>
  </div>

  <div cell>
    <div label>Border</div>
    <select key="border" on-change="onPropChange">
      <option></option>
      <option value="none">None</option>
      <option value="1px solid var(--xcolor-two)">Simple</option>
      <option value="1px solid var(--xcolor-four)">Simple Bold</option>
      <option value="1px dotted var(--xcolor-two)">Dotted</option>
      <option value="4px solid var(--xcolor-two)">Medium</option>
      <option value="8px solid var(--xcolor-two)">Thick</option>
    </select>
  </div>


  <div cell>
    <div label>Flex</div>
    <select key="flex" on-change="onPropChange">
      <option></option>
      <option>none</option>
      <option>1</option>
      <option>2</option>
      <option>3</option>
      <option>4</option>
    </select>
  </div>

  <div cell>
    <div label>Display</div>
    <select key="display" on-change="onPropChange">
      <option></option>
      <option>block</option>
      <option>flex</option>
      <option>inline-block</option>
      <option>inline-flex</option>
    </select>
  </div>

  <!-- <div cell>
    <div label>Bg</div>
    <input type="color">
  </div>

  <div cell>
    <div label>Fg</div>
    <input type="color">
  </div>

  <div cell>
    <div label>Shape</div>
    <select>
      <option>none</option>
      <option>column</option>
      <option>row</option>
    </select>
  </div>

  <div cell>
    <div label>Align</div>
    <select>
      <option>start</option>
      <option>center</option>
      <option>end</option>
    </select>
  </div>

  <div cell>
    <div label>Justify</div>
    <select>
      <option>start</option>
      <option>center</option>
      <option>end</option>
    </select>
  </div>

  <div cell>
    <div label>Border</div>
    <input type="range">
  </div>

  <div cell>
    <div label>Padding</div>
    <input type="range">
  </div> -->

</div>
`
  });
