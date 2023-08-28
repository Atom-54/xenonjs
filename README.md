# XenonJs
XenonJs implements a user-sovereign, AI-powered, semantic framework, and an ecosystem of durable, interoperable components.

## Who and what is it good for?
Whether you are prototyping an experiment, or building a production ready customer facing product -  
XenonJs is suitable for you.

Whether you are building from scratch, or looking to expand functionality of an existing project,  
XenonJs is suitable for you.

Whether you are a software guru, or have no coding experience at all -  
XenonJs is suitable for you.

"A picture is worth a thousand words", but a video has 24 frames per second, so every one minute of a video is worth one million and fourty four hundreds of thousands of words. Watch our demos at: [XenonJs demos](https://www.youtube.com/watch?v=2cdu7H4v3s0&list=PLJFylhBdojdclwfZ3sVukECTffulcPr8d&ab_channel=MariaKleiner).

## Getting started

### Run Graphs

Try using XenonJs Graphs:  
* [Knowledge Space](https://xenon-js.web.app/0.5/Run/?graph=KnowledgeSpace)
* [Video effects](https://xenon-js.web.app/0.5/Run/?graph=VideoRain)
* [Image completion](https://xenon-js.web.app/0.5/Run/?graph=ImageCompletion)
* [Translation](https://xenon-js.web.app/0.5/Run/?graph=TranslateWithAudio)
* [Weather forecast](https://xenon-js.web.app/0.5/Run/?graph=LocalWeather)

You can find more example graphs on our website: [xenonjs.com](https://xenon-js.web.app/#demos)

### Build and run your own Graphs

You can also build your very own XenonJs Graphs from the collection of XenonJs Nodes.  
Try out our [Build/](https://xenon-js.web.app/0.5/Build) IDE.  
Here you can find details on how to use it: [Build/ guide](./pkg/Build/README.md).

### Local

Clone the repo:
```
$ git clone https://github.com/NeonFlan/xenonjs.git -b 0.5
$ cd xenonjs
```

At the very first time:
```
$ npm install
```

Run the server:
```
$ npm run serve
```

To construct a XenonJs Graph, open the Build/ IDE in a browser: [localhost:9871/Build/](http://localhost:9871/Build/)

To run a Graph, open the `Run` app at: [localhost:9871/Run/](http://localhost:9871/Run/).
By default, the Graph that was last open in `Build/` will be run. To choose a different graph, add a URL param:
```
http://localhost:9871/Run/?graph=local$[graph-name]
```

## Get in touch

We spend most of our time writing code and, unfortunately, this means that our documentation is incomplete or lags behind. We are working on it!  
In the meantime, if you have any questions, ideas or feedback, please, don't hesitate to reach out, either by filing an [issue](https://github.com/NeonFlan/xenonjs/issues/new) or via email: [info@xenonjs.com](mailto:info@xenonjs.com).


## Overview

### In the Small

XenonJs is modular.

Components are simple, dependency-free, and designed to interoperate with current technology.
Components are composable, and compositions are composable. Re-use is first-class.
The low-cost of components make them applicable to a wide spectrum of tasks - from quick experiments or individual features, to complex and scalable applications or platforms.

<img src="./assets/small.png" alt="small" width="500px">

### In the Large

XenonJs Graphs are solution blueprints.

Graphs are declarative and semantic: amenable to coherent reasoning by humans and LLMs.
Graphs leverage AI on multiple layers: for interpreting user-context and intention, composing modules into experiences, authoring new modules, and inside modules themselves for data processing and generation.

<img src="./assets/large.png" alt="large" width="500px">

### Finally

Reality interfaces (cameras, screens, touch devices, speaker, mics, and so on) are decoupled from core computation, supporting federation of devices and execution contexts.
We allow for user's data to be available only via keys they hold.
Computation ideally occurs locally, and data egress is constrained.

<img src="./assets/finally.png" alt="finally" width="500px">
