# XenonJs Build/ IDE

`Build/` is a tool for constructing XenonJs Graphs from the existing collection of Nodes.
We use `Build/` to construct all Graphs we make and use, including all demo Graphs.
With `Build/` you can create new experiences without writing a single line of code.

`Build/` is available for you at: [XenonJs/Build](https://xenon-js.web.app/0.3/NeonFlan/Apps/Build/)  
or you can run it locally, as described in [How to run XenonJs locally](../../README.md#local).

## How to

Build/ UI features the following:
* **Preview panel**: where you can see and interact with your Graph in realtime
* **Node Graph structure panel**: demonstrates how the Nodes in the Graph connect to each other
* **Individual Node Inspector panel**: let's you configure the data and layout of selected node
* **Rendering structure panel**: let's you view and re-arrange the UI rendering hierarchy

![Empty graph](./assets/readme/empty-graph.png)

<i>Note: we require google-login so that Graphs that you create are annotated with your name. Our multi-user collaborative experience of sharing and co-editing graphs is in the works.</i>


### Here is a simple example of a "Hello world" Graph:
![Hello world](./assets/readme/hello-world-graph.png)

To read a more detailed `Build/` tutorial, please, take a look at [Build HowTo](https://docs.google.com/presentation/d/1UbfIxy5RaawlqpX4s04EUrB79Yoium-iYEkV1hk0IgA/edit#slide=id.p).

### Node types
To add a new node, or to morph an existing one, you will select a node type:

![Node types](./assets/readme/node-types.png)

The XenonJs engine supports running arbitrary Nodes (no compilation or registration steps involved). Today the UX supports selecting a Node type for the existing collection only.
If you would like to add custom Nodes, refer to this [sample PR](https://github.com/NeonFlan/xenonjs/pull/114), and read the Nodes types [readme](../Library/README.md).

### Graph structure

Graph is purely declarative and semantic.  
We use JSON format to serialize graphs.  
For example, the Demo graph above looks something like this:
```
{
  meta: {
    id: "DemoGraph",
    owner: "maria@xenonjs.com",
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

**Fun fact**: the Build/ app is a XenonJs [Graph](https://github.com/NeonFlan/xenonjs/blob/main/pkg/Graphs/Build.js), and can be edited inside itself!
  
  
---
  
  
This documentation is incomplete (yet!). If you have any questions, ideas or feedback, please, don't hesitate to reach out, either by filing an [issue](https://github.com/NeonFlan/xenonjs/issues/new) or via email: [info@xenonjs.com](mailto:info@xenonjs.com).
