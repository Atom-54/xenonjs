export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

update({records, schema}, state) {
  if (schema && records?.length > 0) {
    if (!state.fields) {
      const names = new Set(schema.props?.map(p => p.name).filter(name => name !== 'uid'));
      const types = new Set(['String', 'Number', 'Boolean', 'MultilineText']);
      state.fields = schema.props?.filter(({name, type}) => names.has(name) && types.has(type))??[];
      if (state.fields.length > 0) {
        state.fields.splice(0, 0, {name: '', type: ''});
      }
    }
    state.field ??= state.fields?.[0]?.name;
    if (state.field) {
      return this.formatChat(state.field, records, schema);
    }
  }
},

formatChat(field, records, schema) {
  const prop = schema.props?.find(prop => prop.name === field);
  if (prop) {
    const type = prop.type === 'Number'
      ? 'line'
      : prop.values?.length > 0 
        ? 'doughnut': 'bar';
    const labelsSet = new Set();
    const counts = {};
    records.forEach(record => {
      const value = record[field];
      labelsSet.add(value);
      counts[value] = (counts[value]??0) + 1;
    });
    let labels = [...labelsSet];
    if (prop.type === 'Number') {
      labels = labels.sort((n1, n2) => n1 - n2);
    }
    const data = {
      labels,
      datasets: [{
        label: type === 'doughnut' ? '' : `count by '${field}'`,
        data: labels.map(label => counts[label]),
        borderWidth: 2
      }]
    };
    const options = {
      indexAxis: 'x',
      scales: {
        x: {
          title: {display: true, text: field},
        },
        y: {
          title: {display: true, text: 'total'},
          beginAtZero: true,
          ticks: {stepSize: 1}
        }
      }
    };
    return {type, data, options};
  }
},

render({}, state) {
  return {
    fields: state.fields?.map(({name}) => name) ?? [],
    field: state.field
  }
},

onFieldChange({eventlet: {value}}, state, {invalidate}) {
  if (value !== state.field) {
    state.field = value;
    invalidate();
  }
},

template: html`
<style>
:host {
  flex-direction: column;
  overflow: auto !important;
}
[label] {
  font-size: 0.8em;
  text-align: left;
  padding-right: 10px;
}
[bar] {
  padding: 10px 40px 10px 20px;
}
</style>

<div bar columns>
  <div label>select field:</div>
  <multi-select flex options="{{fields}}" selected="{{field}}" on-change="onFieldChange"></multi-select>
</div>

<slot name="chart"></slot>
`
});
