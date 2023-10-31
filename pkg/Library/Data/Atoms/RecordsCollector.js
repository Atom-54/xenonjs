export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

initialize(inputs, state) {
  state.auto = {records: [], numRequested: 5, shouldAdd: false, shouldProcess: false};
},

// TODO: show indication when `data` is dirty.
update(inputs, state, tools) {
  const {data, event, schema, record, records} = inputs;
  const {output, isDirty} = tools;
  if (isDirty('event')) {
    state.event = event;
    if (event?.kind !== 'done') {
      return this.handleEvent(inputs, state, tools);
    }
  }
  // TODO: factor everything auto-generation related to a separate Atom/Node.
  this.handleAutoGeneration(inputs, state, tools);
  if (records && isDirty('records')) {
    state.records = records;
    output({records});
  }
  if (schema && (!data || isDirty('record') || isDirty('schema'))) {
    state.record = record;
    return {
      data: this.dataInspectorAdaptor(record, schema)
    };
  }
},
dataInspectorAdaptor(record, schema) {
  const names = new Set(schema.props?.map(({name}) => name));
  const props = schema.props?.filter(({name}) => names.has(name))??[];
  const formatRange = ({min, max, step}) => (min !== undefined && max !== undefined && step != undefined) ? {min, max, step} : {};
  return {
    key: ' ',
    title: schema.name,
    props: props.map(prop => ({
      // TODO: atm 'uid' property is implied and invisible; needs to be generalized!
      visible: prop.name !== 'uid',
      name: prop.name,
      store: {
        type: prop.type,
        values: prop.values,
        value: prop.value,
        range: formatRange(prop)
      },
      value: record?.[prop.name]
    }))
  };
},
handleEvent(inputs, state, tools) {
  let output = {event: {kind: 'done'}};
  const {event} = inputs;
  switch (event?.kind) {
    case 'save':
      assign(output, {
        records: this.saveRecord(inputs)
      });
      break;
    case 'clear':
      assign(output, {record: null});
      break;
    case 'check':
      assign(state, {checked: event.checked});
      break;
    case 'select':
      assign(output, this.selectRecord(inputs));
      break;
    case 'delete':
      assign(output, this.deleteRecords(inputs, state));
      break;
    case 'autocreate':
      assign(output, this.autoCreateRecord(inputs, state, tools));
      break;
  }
  state.records = output.records ?? state.records;
  return output;
},

saveRecord({data, schema, records}) {
  records ??= [];
  const record = this.formatRecord(data, schema);
  if (!record.uid) {
    record.uid = this.generateUniqueId(records);
  }
  const index = records.findIndex(({uid}) => uid === record.uid);
  if (index >= 0) {
    records[index] = record;
  } else {
    (records ??= []).push(record);
  }
  return records;
},

generateUniqueId(records) {
  const random = () => (Math.random() + 1).toString(36).substring(2);
  let uid = random();
  while (records?.find(r => r.uid === uid)) {
    uid = random();
  }
  return uid;
},

selectRecord({event, records}) {
  const {record} = event;
  if (record) {
    return {
      record: records.find(({uid}) => uid === record.uid)
    };
  }
},

formatDataFromRecord(record, schema) {
  const data = {...schema, props: []};
  schema.props.forEach(prop => {
    data.props.push({...prop, value: record[prop.name]});
  });
  return data;
},

deleteRecords(inputs, state) {
  const {event} = inputs;
  if (event.record) {
    return this.deleteRecord(event.record, inputs);
  }
  let output = {};
  state.checked?.forEach(record => {
    output = this.deleteRecord(record, inputs);
  })
  return output;
},

deleteRecord(uid, {records, record}) {
  const index = records.findIndex(r => r.uid === uid);
  if (index >= 0) {
    records.splice(index, 1);
  }
  return {
    records,
    ...(record?.uid === uid && {record: null})
  };
},

formatRecord(data, schema) {
 return schema.props.reduce((record, p) => {
    record[p.name] = data.props.find(({name})=> name === p.name)?.value;
    return record;
  }, create(null));
},

autoCreateRecord(inputs, state, {invalidate}) {
  state.auto.shouldAdd = true;
  invalidate();
},

handleAutoGeneration({schema, records, response}, {auto}, {output}) {
  if (auto.shouldProcess) {
    if (response?.length > 0 && !response.startsWith(`a moment...`) && auto.response !== response) {
      assign(auto, {
        shouldProcess: false,
        response,
        records: this.parseRecords(response, schema)
      });
      log(`Auto-generated ${auto.records.length} records.`);
      if (!auto.records.length) {
        log(`Failed parsing records for response: ${response}`);
      }
    }
  }
  if (auto.records.length === 0) {
    // Needs to add a records, and hasn't requested some yet.
    if (auto.shouldAdd && !auto.shouldProcess) {
      assign(auto, {shouldRequest: false, shouldProcess: true});
      // Increasing the number of requested records, so that the `request` output change.
      output({request: this.constructAutoRecordsRequest(schema, records, auto.numRequested)});
      auto.numRequested = auto.numRequested >= 10 ? 5 : (auto.numRequested + 1);
    }
  }
  if (auto.shouldAdd && (auto.records.length > 0)) {
    auto.shouldAdd = false;
    const newRecord = auto.records.shift();
    newRecord.uid = this.generateUniqueId(records);
    (records ??= []).push(newRecord);
    output({records});
  }
},

constructAutoRecordsRequest(schema, records, numRequested) {
  // sample prompt:
  // Please, generate 3 records containing Pet information: 
  //   name, age, type of the Pet.
  //   Reply with 3 lines, each containing the pet information.
  //   Do not enumerate the lines.
  //   Each line should contain exactly comma separated name, age, type.
  //   name is String; age is Number; type is String, its values can be one of: cat, dog, fish, hamster, rabbit, turtle, other.
  //   For example: Zuko,3,cat

  const propNames = schema.aiGen?.join(', ');
  const names = new Set(schema.aiGen);
  const props = schema.props.filter(({name}) => names.has(name));
  const propDetails = props.map(prop => this.formatPropertyDetails(prop)).join('; ');    
  const example = this.generateExample(props, records?.[0]);
  return `Please, generate ${numRequested} records containing ${schema.name} information: 
    ${propNames} of the ${schema.name}.
    Reply with ${numRequested} lines, each containing the ${schema.name} information.
    Do not enumerate the lines.
    Each line should contain exactly comma separated ${propNames}.
    ${propDetails}.
    ${example ? `For example: ${example}` : ''}
  `;
},

formatPropertyDetails({name, type, values}) {
  const results = [];
  if (type) {
    results.push(`${name} is ${type}`);
  }
  if (values?.length > 0) {
    results.push(`its values can be one of: ${values.join(', ')}`);
  }
  return results.join(', ');
},

generateExample(props, record) {
  if (record) {
    const result = [];
    props.forEach(prop => {
      result.push(record[prop.name] || prop.value);
    });
    return result.join(',');
  }
},

parseRecords(text, schema) {
  const records = [];
  const names = new Set(schema.aiGen);
  const props = schema.props.filter(({name}) => names.has(name));
  text.split('\n').forEach(line => {
    records.push(this.parseRecord(line.split(','), props));
  });
  return records.filter(r => !!r);
},

parseRecord(values, props) {
  const record = {};
  for (let index = 0; index < values?.length; ++index) {
    if (index < props.length) {
      const prop = props[index];
      const value = this.validatePropValue(values[index].trim(), prop);
      if (!value) {
        return;
      }
      record[prop.name] = value;
    }
  }
  return record;
},

validatePropValue(value, {type, values}) {
  if (type === 'Number') {
    return isNaN(value) ? null : Number(value);
  }
  if (values?.length > 0) {
    return values.some(v => v === value) ? value : null;
  }
  return value;
}

});
