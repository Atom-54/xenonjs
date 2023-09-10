# XenonJs Ecosystem

## Atoms

<i>"Why can you not trust atoms? Because they make up everything." (The Big Bang Theory)</i>

Similarly to the universe, in XenonJs Atoms make up everything as well.

`Atom` is a basic implementation unit.
On one hand, it is a pure Javascript object, with no dependencies or essential APIs. As code, it can be used even outside of the XenonJs universe.

On the other hand, the `Atom` is shaped in a certain way which grants it important properties.  
An `Atom` is data-driven. It has no direct access to data storage or other `Atoms`, instead it is governed by the XenonJs Core.  
The Atom's `update` method is being called when one or more of its inputs change, and it returns a map of its outputs.

For example:
```
({
  update(inputs) {
    const {firstName, lastName} = inputs;
    return {
      greeting: `Hello ${firstName} ${lastName}!`
    };
  }
});
```

An `Atom` can also render UI. Similarly to how it is decopled from data storage, an `Atom` doesn't have access to the rendering surface (e.g. DOM) either. Instead it emits a rendering template and a model, which the Core passes then to the appropriate rendering surface(s).

For example:
```
({
  template: `
    <div>Hello <span>{{name}}</span>!</div>
  `,

  render() {
    return {name: 'Atomicity'};
  }
})
```

Here is an example [TextField](https://github.com/NeonFlan/xenonjs/blob/main/pkg/Library/Fields/Atoms/TextField.js) atom that receives a `label` and an initial `value` as inputs, renders an input text and outputs a `value` that is being entered by the user. 


<i>Note: in this example the template is DOM, but it doesn't have to be.</i>  
  
<i>Also note: we are using our very own Xen templating engine. You can learn more about Xen in the [xen-explainer](https://xenon-js.web.app/0.6/Library/Dom/Xen/xen-explainer.html). If you prefer, you can use another templating engine, it is pluggable.</i>  

For more information see [Atom.md](./Atom.md).

## Nodes
Node is a possible declaration (or instructions) of how the an Atom (or Atoms) could be reified and used in a Graph.
Node is expressed as a simple JSON object.

Referencing the `TextField` example above, here is a corresponding [TextFieldNode](https://github.com/NeonFlan/xenonjs/blob/main/pkg/Library/Fields/Nodes/TextFieldNode.js):
```
{
  field: {
    type: '$library/Fields/Atoms/TextField',
    inputs: ['label', 'value'],
    outputs: ['value']
  }
};
```
The "field" key is just a unique identifier of an `Atom` inside a `Node`.

Same `Atom` could be used in multiple `Nodes`. A `Node` may contain multiple `Atoms`.  
In the following example, the "TextField" `Atom` is used twice, to create a `Node` that makes a full name editing form:
```
{
  first: {
    type: '$library/Fields/Atoms/TextField',
    inputs: ['label', 'value'],
    outputs: ['value']
  },
  last: {
    type: '$library/Fields/Atoms/TextField',
    inputs: ['label', 'value'],
    outputs: ['value']
  },
  state: {
    first$label: 'First Name',
    last$label: 'Last Name',
  }
}
```
The `state` is a special keyword, and it allows to configure data values of Atoms' inputs.

For more information see [Node.md](./Node.md).

## Node Types

`Node` contains all the information required for XenonJs Core to reify the `Node` in a `Graph`.
`Node Type` references a particular `Node` and adds information that is needed to present the `Node` in the [Build/](../Build/README.md#node-types) IDE.
It adds a general description and specifies the data types and descriptions of the inputs and outputs.  
For example:
```
TextField: {
  description: 'Displays a text input field',
  types: {
    field$label: 'String',
    field$value: 'String',
  },
  type: '$library/Fields/Nodes/TextFieldNode'
}
```
More examples [here](https://github.com/NeonFlan/xenonjs/blob/main/pkg/Library/Fields/FieldsNodeTypes.js).

For more information see [NodeType.md](./NodeType.md).

## Graphs

Graph is purely declarative and semantic. It consists of a set of Nodes, their state data, and connection information, and metadata.  
The Graph contains all information needed to reify the experience.

We use JSON format to serialize graphs. For example, the Demo graph above looks something like this:
```
{
  meta: {
    id: "DemoGraph",
    owner: "neonflan@xenonjs.com",
    ...
  },
  nodes: {
    Hello: {
      type: "$library/EchoNode"
    },
    TextField: {
      type: "$library/Fields/Nodes/TextFieldNode"
    }
  },
  state: {
    TextField$label:"Enter text:",
    ...
  },
  connections: {
    Hello$html: "TextField$field$value"
  }
}
```

<i>to be continued...</i>

---
  
  
This documentation is incomplete (yet!). If you have any questions, ideas or feedback, please, don't hesitate to reach out, either by filing an [issue](https://github.com/NeonFlan/xenonjs/issues/new), joining our [discord](https://discord.gg/PFsHCJHJdN) or via email: [info@xenonjs.com](mailto:info@xenonjs.com).
