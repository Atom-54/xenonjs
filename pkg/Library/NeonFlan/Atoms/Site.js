export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async update(inputs, state) {
},
render() {
  return {
    demo1: resolve('$library/NeonFlan/Assets/demo1.png'),
    demo2: resolve('$library/NeonFlan/Assets/demo2.png'),
    sections: [
      {title: 'one', contents: 'one one one'},
      {title: 'two', contents: '2 2 2 2 2 2 2'}
    ]
  }
},
template: html`
<style>
  :host {
    display: flex;
    flex-direction: column;
  }
  [page] {
    overflow: scroll;
    padding: 1em 3em;
  }
  [demos] {
    width: 200px;
  }
  [demo-div] {
    height: 50%;
  }
  [demo-image] { 
    border: 1px solid purple;
    /* width: 100%; */
    text-align: center;
    /* min-height: 400px; */
  }
</style>
<weightless-pages flex x-selected="Mission" on-selected="onPageSelected" tabs="Home,Mission,Capabilities,Architecture,Team,Contribute">
  <div page>
    <h1>Realize modern augmented media and reality interfaces</h1>
    <h2>Focus on your creativity</h2>
    <weightless-pages x-demos x-vertical="true" tabs="One,Two,Three">
      <div>
        <div demo-div>
          <img demo-image referrerpolicy="no-referrer" src="{{demo1}}">
        </div>
        <div bar>
          <div flex></div>
          <wl-button raised>Try it!</wl-button>
          <wl-button disabled>Customize (coming soon)</wl-button>
        </div>
      </div>
      <div>
        <div demo-div>
          <img demo-image referrerpolicy="no-referrer" src="{{demo2}}">
        </div>
        <div bar>
          <div flex></div>
          <wl-button raised>Try it!</wl-button>
          <wl-button disabled>Customize (coming soon)</wl-button>
        </div>
      </div>
      <div>DEMO THREE</div>
    </weightless-pages>
  </div>
  <div page>
  <h1>Platforms built for Humans, Technology and for the Future</h1>
<h2>For HUMANS</h2>

We don't say “a supermarket user bought a carton of milk”. <br>
We don't say “a refrigerator user opened a door and put the milk inside”. <br>
We don't say “a Verizon user made a phone call”. <br><br>

We, as humans, have ownership over our actions and objects and this is expressed in our language. We say “I bought milk” and “someone put it inside the refrigerator”, and “they made a phone call”.<br>

The recency of software becoming an integral part of our life is a likely reason why we refer to a human as a user. In the early computer days, user was a title one held proudly. However in saying “Youtube users watch videos” and “Facebook users write posts” - human ownership of the virtual entities and action is not reflected. People who use software are treated as guests in the corporations' virtual space. <br>

In XenonJs paradigm this model is reversed. We, the humans being served by the software, regain our autonomy, authority and sovereignty. All our data belongs to us, and the software adjusts and morphs to shapes, matching the exact momentary personal need.<br><br>
<h2>For TECHNOLOGY</h2>

XenonJs is a modular and adaptive computing paradigm.<br>
It empowers innovation.<br>
XenonJs is suitable for any creator - from ones with no coding skills at all to an expert software engineer.<br>
XenonJs is applicable to any task - from a quick experiment or an individual feature, to a complex and scalable application or platform. <br><br>

XenonJs is highly modular and composable. All its components are interoperable, allowing assemblers to develop new solutions, leveraging the rich and varied ecosystem of existing components. See [AIClock + Build DEMO] / [Build HOW TO] / [Architecture-Composables layer].<br><br>

XenonJs components are durable and adaptive. It allows crafters (developers) only ever to write truly new innovative code, focusing on their area of expertise and leveraging the reusable and maintainable components.<br><br>

<h2>For the FUTURE</h2>

XenonJs based platforms promote and compliment innovation. XenonJs mission is to accelerate the iterations from invention of new technology to its global availability. <br>
By virtue of its multi-layered and adaptive architecture [LINK TO ARCHITECTURE] XenonJs based software is built to incorporate latest scientific breakthroughs whenever and in whatever shape they occur. <br><br>

AI is a good example of this. Due to its modular nature, XenonJs can best leverage AI by presenting it with diverse well-defined subtasks, complimenting them with non-AI programmatic solutions where appropriate, and composing all into a coherent experience. XenonJs amplifies the AI strengths, and is well-positioned to accommodate and govern as much of AI participation, as is considered safe and optimal for the task in hand [LINK TO XENON and AI].<br><br>

XenonJs isn't only future-proof, it is future-salutatory. <br><br>


  </div>
  <div page capabilities>
    <h1>Component capabilities</h1>
    <weightless-accordion sections="Durable and Maintainable,Interoperable,Composable and Collaborative,Adaptable,Efficient and Robust,Privacy preserving,Secure">
    <p slot="Durable and Maintainable">
Starting a new coding task isn't hard, but any code requires ongoing maintenance, and maintenance is hard and costly.<br><br>
Previously, when starting anew, little to none of the preexisting code is reusable.<br><br>
With XenonJs, the code is structured in modular code units that are highly durable and reusable. These units are abstracted in such a way that each part is transparently interchangeable, while the rest of the system remains operational.<br><br>
It makes maintenance easily attainable, and reduces engineering time and costs.<br><br>
      </p>
      <p slot="Interoperable">
XenonJs components are [lacking their own free will] and purely data-driven, thus any component is interoperable with any other component as long as the shape of their inputs and outputs match. In a way, proper encapsulation and interoperability feed into each other, resulting in well designed, robust systems.<br><br>
XenonJs components are pure JavaScript objects and hence can run in any JavaScript container. Each component itself is device agnostic, subsequently any XenonJs based composed experience can run on any device, or multi-device. <br><br>
      </p>
      <p slot="Composable and Collaborative">
Global availability of innovation is often confined by the individuals' technical expertise. Modern software is complex and multiform, and the need for an end-to-end solution is often the barrier for deploying a new technology publicly. <br><br>
In XenonJs however, every experience is composed of independent self sustained components. Each component can be authored by a different developer, no coordination required.<br><br>
Each experience is expressed by a pure Javascript object, and can be shared and customized.<br><br>
The composability and adaptivity of the platform facilitates leveraging others' work and encourages collaboration. <br><br>
      </p>
      <p slot="Adaptable">
Whether you want to build a new system from scratch, or add features or capabilities to an existing system, XenonJs based platform adapts to your needs. Any XenonJs code component or a whole experience can embed, be embedded, or interoperate with a traditional programming system.<br><br>
Depending on your specific requirements and areas of interest, any subset of XenonJs layers and capabilities can be included.<br><br>
      </p>
      <p slot="Efficient and Robust">
XenonJs core library is lightweight. 
The data driven nature allows for execution on demand. The componentization and interoperability make distributed execution possible.<br><br>
XenonJs architecture relies on multi-layering and abstractions. This architecture motivates proper encapsulation and separation of concerns.<br><br>
All spots with opinions are optional or pluggable.<br><br>
And finally, the collaborative quality of the system allows reusing the best available solutions for each problem space.<br><br>
      </p>
      <p slot="Privacy preserving">
XenonJs follows the “code comes to data” paradigm, and all data is owned by the user, and it is the user who decides how and where the data is to be stored, and what code is to run on it when. <br><br>
XenonJs code components have no direct access to data, are stateless and cannot communicate with each other. Their inputs and outputs are managed by configuration, hence the data flow is fully analyzable and governable.<br><br>
      </p>
      <p slot="Secure">
Depending on the execution environment (web, browser extension, server API, etc), different security/isolation solutions can be selected.<br><br>
Each code component is a pure JavaScript object and is sanitized and frozen at load time.<br><br>
Each component can be executed in a sandbox.<br><br>
      </p>
    </weightless-accordion>
  </div>
  <div page architecture>
    <weightless-accordion sections="Experiences,Composables,Ecosystem,Core">
      <div slot="Experiences">
XenonJs-based Ready-to-Use Experiences for Humans (products, apps, features…) are frictionless and seamless experiences.<br>
They span across application boundaries, adjustable to your momentary task in hand.<br>
XenonJs based Experiences are highly collaborative - easy to share with your friends and engage with them.<br><br>
They can run on any device (work in any JavaScript container), and on multiple devices.<br><br>
The experiences can leverage any technology, but only instantiate what you use them, so are lightweight and efficient.<br><br>
XenonJs-based experiences can support any use case, span across a wide variety of technologies, and facilitates and empowers AI.<br><br>
[LINK TO DEMOS]
      </div>
      <div slot="Composables">
XenonJs Composables layer for assembling experiences from the variety of XenonJs ecosystem’s interoperable components.<br>
The Composable layer is suitable for Assemblers: it allows anyone with no coding knowledge to create an whole new experience, or customize an existing one.<br><br>
Once assembled, the newly created experience can be run on any device, shared with friends, published to the XenonJs community, or used to solve a business task.<br><br>
The experience is expressed by composable configuration (aka Graph) that is a pure Javascript object, with no dependencies.<br><br>
XenonJs offers a XenonJs-built IDE (yes, we use our infrastructure to build all our software) as a convenient tool for assembling Graphs: [link to Build/ HowTo page]<br><br>
      </div>
      <div slot="Ecosystem">
Atom is the basic code unit in XenonJs ecosystem. An Atom is a durable, portable, standalone, platform agnostic implementation module. <br><br>
An Atom is a pure Javascript object, with no dependencies and no essential APIs.<br><br>
It is data driven and is governed by XenonJs core. <br>
The Atom doesn’t have direct access to data or other Atoms. It is handed its inputs (pure JSON) from XenonJs core, and returns its outputs (pure JSON). <br>
It does not need to set itself up, or wire to data, or handle its execution environment, this is taken care of by the Core. The Atom is only responsible for its essential functionality.<br>
An Atom is data driven - it only runs when at least one of its inputs have changed.<br>
Optionally, it can provide rendering information. It doesn’t have direct access to rendering surfaces either, the Core passes the rendering information to an abstracted, pluggable composer system.<br><br>
All Atoms are interoperable. Any Atoms performing a notionally similar task are interchangeable.<br><br>
      </div>
      <div slot="Core">
XenonJs core is the engine.<br>
It is a tiny (< 50K) pure vanilla JS (no dependencies) runtime that can run in any environment / OS (that can run Javascript; or it can be compiled into WASM and run anywhere at all).<br>
Depending on the execution environment (web, browser extension, server API, etc), different security/isolation solutions can be selected.<br>
      </div>
    </weightless-accordion>
  </div>
  <div page>TODO: TEAM</div>
  <div page>TODO: CONTRIBUTE</div>
</weightless-pages>
`

});
