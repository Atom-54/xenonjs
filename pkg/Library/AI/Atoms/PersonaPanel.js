export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({profile}, state) {
  const {persona} = profile ?? {persona: `Helpful and polite.`};
  return {context: `${persona}\n\n`};
},
render({profile}, state) {
  const {persona, name, avatar} = profile ?? {};
  const photoURL = (avatar && resolve(avatar)) || resolve('$library/AI/Assets/delmer.png');
  return {
    photoURL,
    displayName: name ?? 'Bot',
    persona: persona || ''
  };
},

template: html`
<style>
  :host {
    /* flex: 1; */
    display: flex;
    flex-direction: column;
    color: var(--theme-color-fg-0);
    background-color: var(--theme-color-bg-0);
    overflow: hidden;
    padding: 0.4em;
    box-sizing: border-box;
  }
  mwc-textfield {
    text-align: center;
    --mdc-text-field-fill-color: var(--theme-color-bg-0);
    --mdc-typography-subtitle1-font-size: 1.2em;
    padding: 4px;
  }
  [relative] {
    position: relative;
  }
  [spacer] {
    padding: 4px;
  }
  [square] {
    /* constrain height in a manner compatible with aspect-ratio */
    height: 100%;
    /* keep it square */
    ${'aspect-ratio'}: 1/1;
  }
  [pad6] {
    padding: 6px;
  }
  idiotar {
    /* position: absolute; */
    display: inline-block;
    /* maximum */
    border-radius: 50%;
    /* circle clipping */
    overflow: hidden;
  }
  idiotar > img {
    width: 100%;
  }
  [device] {
    font-size: 22px;
    margin-top: -40px;
    min-height: 40px;
    transform: translateY(-20px);
  }
</style>

<div flex column center>
  <idiotar square>
    <img src="{{photoURL}}">
  </idiotar>
  <div device row>
    <slot name="Container"></slot>
  </div>
</div> 
<div center row><b>{{displayName}}</b></div>
`
});
