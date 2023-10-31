export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
initialize(inputs, state) {
  state.flexes = ['', 'none', '1', '2', '3', '4'];
  // state.flairs = ['', 'None', 'Alpha', 'Beta', 'Gamma', 'Delta'];
  state.fontSizes = [
    '',
    {value: 'inherit', name: 'Inherit'},
    {value: 'var(--font-size-00)', name: 'DoubleZero'},
    {value: 'var(--font-size-0)', name: 'Zero'},
    {value: 'var(--font-size-1)', name: 'One'},
    {value: 'var(--font-size-2)', name: 'Two'},
    {value: 'var(--font-size-3)', name: 'Three'},
    {value: 'var(--font-size-4)', name: 'Four'},
    {value: 'var(--font-size-5)', name: 'Five'},
    {value: 'var(--font-size-6)', name: 'Six'},
    {value: 'var(--font-size-7)', name: 'Seven'},
    {value: 'var(--font-size-8)', name: 'Eight'},
  ];
  state.borderWidths = [
    '',
    {value: '0', name: 'None'},
    {value: 'var(--border-size-1)', name: 'One'},
    {value: 'var(--border-size-2)', name: 'Two'},
    {value: 'var(--border-size-3)', name: 'Three'},
    {value: 'var(--border-size-4)', name: 'Four'},
    {value: 'var(--border-size-5)', name: 'Five'},
  ];
  state.borderRadiuses = [
    '',
    {value: 'none', name: 'None'},
    {value: 'var(--radius-1)', name: 'One'},
    {value: 'var(--radius-2)', name: 'Two'},
    {value: 'var(--radius-3)', name: 'Three'},
    {value: 'var(--radius-4)', name: 'Four'},
    {value: 'var(--radius-5)', name: 'Five'},
    {value: 'var(--radius-round)', name: 'Round'},
    {value: 'var(--radius-blob-1)', name: 'Blob One'},
    {value: 'var(--radius-blob-2)', name: 'Blob Two'},
    {value: 'var(--radius-blob-3)', name: 'Blob Three'},
    {value: 'var(--radius-blob-4)', name: 'Blob Four'},
    {value: 'var(--radius-blob-5)', name: 'Blob Five'},
  ];
  state.paddings = [
    '',
    {value: 'none', name: 'None'},
    {value: 'var(--size-00)', name: 'Half'},
    {value: 'var(--size-1)', name: 'One'},
    {value: 'var(--size-2)', name: 'Two'},
    {value: 'var(--size-3)', name: 'Three'},
    {value: 'var(--size-4)', name: 'Four'},
    {value: 'var(--size-5)', name: 'Five'},
    {value: 'var(--size-6)', name: 'Six'},
    {value: 'var(--size-7)', name: 'Seven'},
    {value: 'var(--size-8)', name: 'Eight'},
    {value: 'var(--size-9)', name: 'Nine'},
    {value: 'var(--size-10)', name: 'Ten'},
  ];
  state.margins = [...state.paddings];
  state.orders = [
    '',
    {name: 'default', value: 'default'},
    {name: '1', value: '1'},
    {name: '2', value: '2'},
    {name: '3', value: '3'},
    {name: '4', value: '4'},
    {name: '5', value: '5'},
    {name: '6', value: '6'},
    {name: '7', value: '7'},
    {name: '8', value: '8'},
    {name: '9', value: '9'},
  ];
  state.colors = [
    '',
    {name: 'default', value: 'default'},
    {name: 'white', value: 'white'},
    {name: 'black', value: 'black'},
    {name: 'Color 1', value: 'var(--xcolor-one)'},
    {name: 'Color 2', value: 'var(--xcolor-two)'},
    {name: 'Color 3', value: 'var(--xcolor-three)'},
    {name: 'Color 4', value: 'var(--xcolor-four)'},
    {name: 'Brand', value: 'violet'},
  ];
  state.backgrounds = [...state.colors];
  state.positions = ['', 'static', 'absolute', 'fixed', 'relative'];
  state.displays = ['', 'block', 'flex', 'inline-block', 'inline-flex', 'none'];
  state.justifyContents = ['', 'start', 'center', 'end'];
  state.alignItems = ['', 'start', 'center', 'end'];
  state.shadows = [
    {name: '', value: ''},
    {name: 'none', value: ''},
    {name: 'one', value: 'var(--shadow-1)'},
    {name: 'two', value: 'var(--shadow-2)'},
    {name: 'three', value: 'var(--shadow-3)'},
    {name: 'four', value: 'var(--shadow-4)'}
  ];
  state.overflows = [
    {name: '', value: ''},
    {name: 'visible', value: 'visible'},
    {name: 'hidden', value: 'hidden'},
    {name: 'auto', value: 'auto'},
    {name: 'scroll', value: 'scroll'}
  ];
},
shouldUpdate({data, key}) {
  return (data && key);
},
shouldRender({data, key}) {
  return (data && key);
},
render({data, propName}, state) {
  const prop = this.propByName(data.props, propName)
  if (prop?.value) {
    const {flex, fontSize, borderWidth, borderRadius, overflow, position, margin, padding, height, width, order, color, backgroundColor, display, alignItems, boxShadow} = prop.value;
    return {
      flexes: this.renderOptions(state.flexes, flex),
      fontSizes: this.renderOptions(state.fontSizes, fontSize),
      overflows: this.renderOptions(state.overflows, overflow),
      paddings: this.renderOptions(state.paddings, padding),
      margins: this.renderOptions(state.margins, margin),
      borderWidths: this.renderOptions(state.borderWidths, borderWidth),
      borderRadiuses: this.renderOptions(state.borderRadiuses, borderRadius),
      positions: this.renderOptions(state.positions, position),
      orders: this.renderOptions(state.orders, order),
      colors: this.renderOptions(state.colors, color),
      backgrounds: this.renderOptions(state.backgrounds, backgroundColor),
      displays: this.renderOptions(state.displays, display),
      //justifyContents: this.renderOptions(state.justifyContents, justifyContent),
      alignItems: this.renderOptions(state.alignItems, alignItems),
      shadows: this.renderOptions(state.shadows, boxShadow),
      height,
      width
    };
  }
},
renderOptions(options, selected) {
  return options.map(option => {
    let {name, value} = option;
    if (typeof option === 'string') {
      name = value = option;
    }
    return {
      name,
      value,
      selected: selected === value
    };
  });
},
// onFlairChange({eventlet: {key, value}, data, propName, flairs}, _, {service}) {
//   return this.updateValue(data, propName, {
//     [key]: value,
//     ...flairs?.[value]
//   }, service);
// },
onToggleAuto({eventlet: {key}, data, propName}, _, {service}) {
  const oldValue = (this.propByName(data.props, propName))?.value?.[key];
  return this.updateValue(data, propName, {[key]: oldValue === 'auto' ? null : 'auto'}, service);
},
onPropChange({eventlet: {key, value}, data, propName}, _, {service}) {
  return this.updateValue(data, propName, {[key]: value}, service);
},
updateValue(data, propName, newValue, service) {
  propName ??= 'CssStyle';
  data ??= {
    props: [{
      name: propName,
      value: {}
    }]
  };
  // find prop with 'name'
  const prop = this.propByName(data.props, propName);
  prop.value = {...prop.value, ...newValue};
  service('DesignService', 'UpdateProp', prop);
  return {data};
},
propByName(props, name) {
  return props?.find(p => p.name === name);
},
template: html`
<style>
  :host {
    --xcolor-hi-one: rgb(212, 13, 242);
    --cell-pad: 0;
    --cell-margin: 0px 18px 0 0;
  }
  [grid] {
    padding-bottom: 2px;
  }
  [cell] {
    min-width: 7em;
  }
  [label] {
    font-size: 0.7em;
    padding: 4px 0;
    font-weight: bold;
  }
  [row] > span {
    color: var(--xcolor-hi-one);
  }
  label > span {
    padding-left: 8px;
  }
  input, select {
    box-sizing: border-box;
    color: var(--xcolor-hi-one);
    background: var(--xcolor-two);
    border-radius: 8px;
    padding: 4px;
    border: none;
    width: 100%;
    font-size: 0.7em;
    margin-left: 1px;
    margin-right: 0;
  }
  input {
    margin-top: 3px;
  }
  input[type="checkbox"] {
    width: auto;
  }
  i {
    font-size: 0.6em;
  }
</style>

<div style="padding-bottom: 8px;">Styles</div>

<div grid>
  <div cell>
    <div label>Flex</div>
    <select repeat="option_t" on-change="onPropChange" key="flex">{{flexes}}</select>
  </div>

  <!-- <div cell>
    <div label>Flair</div>
    <select repeat="option_t" on-change="onFlairChange" key="flair">{{flairs}}</select>
  </div> -->

  <div cell>
    <div label>Position</div>
    <select repeat="option_t" on-change="onPropChange" key="position">{{positions}}</select>
  </div>

  <div cell>
    <div label>Width</div>
    <label row><input key="width" type="checkbox" on-change="onToggleAuto" checked="{{width}}"><span>auto</span></label>
  </div>

  <div cell>
    <div label>Height</div>
    <label row><input key="height" type="checkbox" on-change="onToggleAuto" checked="{{height}}"><span>auto</span></label>
  </div>

  <div cell>
    <div label>Padding</div>
    <select repeat="option_t" on-change="onPropChange" key="padding">{{paddings}}</select>
  </div>

  <div cell>
    <div label>Margin</div>
    <select repeat="option_t" on-change="onPropChange" key="margin">{{margins}}</select>
  </div>

  <div cell>
    <div label>Overflow</div>
    <select repeat="option_t" on-change="onPropChange" key="overflow">{{overflows}}</select>
  </div>

  <div cell>
    <div label>Font Size</div>
    <select repeat="option_t" on-change="onPropChange" key="fontSize">{{fontSizes}}</select>
  </div>

  <div cell>
    <div label>Border</div>
    <select repeat="option_t" on-change="onPropChange" key="borderWidth">{{borderWidths}}</select>
  </div>

  <div cell>
    <div label>Border Radius</div>
    <select repeat="option_t" on-change="onPropChange" key="borderRadius">{{borderRadiuses}}</select>
  </div>

  <div cell>
    <div label>Color</div>
    <select repeat="option_t" on-change="onPropChange" key="color">{{colors}}</select>
  </div>

  <div cell>
    <div label>Background Color</div>
    <select repeat="option_t" on-change="onPropChange" key="backgroundColor">{{backgrounds}}</select>
  </div>

  <div cell>
    <div label>Order</div>
    <select repeat="option_t" on-change="onPropChange" key="order">{{orders}}</select>
  </div>

  <div cell>
    <div label>Display</div>
    <select repeat="option_t" on-change="onPropChange" key="display">{{displays}}</select>
  </div>

  <!-- 
  <div cell>  
    <div label>Justify</div>
    <select repeat="option_t" on-change="onPropChange" key="justifyContent">{{justifyContents}}</select>
  </div> 
  -->

  <div cell>
    <div label>Align</div>
    <select repeat="option_t" on-change="onPropChange" key="alignItems">{{alignItems}}</select>
  </div>

  <div cell>
    <div label>Shadow</div>
    <select repeat="option_t" on-change="onPropChange" key="boxShadow">{{shadows}}</select>
  </div>

</div>

<template option_t>
  <option value="{{value}}" selected="{{selected}}">{{name}}</option>
</template>
`
});
