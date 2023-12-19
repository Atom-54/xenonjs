/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../Xen/xen-async.js';

const template = Xen.Template.html`
<style>
  :host {
    display: block;
    cursor: grab;
    user-select: none;
  }
  [container] {
    display: flex;
    align-items: center;
    padding: 6px;
  }
  [container][draggable="true"]:hover {
    background: var(--theme-color-bg-4);
  }
  [container][draggable="true"]:hover icon {
    display: inline-flex;
  }
  icon {
    display: inline-flex;
    align-items: center;
    font-family: "Material Symbols Outlined";
    font-style: normal;
    font-feature-settings: "liga";
    -webkit-font-feature-settings: "liga";
    -webkit-font-smoothing: antialiased;
  }
  [label] {
    /* flex: 1; */
    font-size: 0.9em;
  }
</style>

<div container draggable="{{draggable}}" on-mouseenter="onEnter" on-mouseleave="onLeave" on-dragstart="onDragStart">
  <icon>{{icon}}</icon>
  &nbsp;
  <div label on-click="onItemClick">{{name}}</div>
  <slot></slot>
</div>

`;

/**
 * A simple wrapper around a item label that is draggable.
 *
 * It reacts to "dragstart" event and sets the data payload to be the key of
 * the item.
 *
 * Attributes:
 *   - key: the key of the item.
 *   - name: the name of the item.
 *
 * Events:
 *   - item-clicked:
 *       fired when a item is clicked.
 */
export class DraggableItem extends Xen.Async {
  static get observedAttributes() {
    return ['key', 'name', 'disabled', 'icon'];
  }
  get template() {
    return template;
  }
  render({name, icon, disabled}) {
    return {
      icon: icon || 'build_circle',
      name,
      draggable: !disabled
    };
  }
  onItemClick(e) {
    this.fire('item-clicked');
  }
  onDragStart(e) {
    // This will hide the popup panel for the hovered item.
    this.fire('leave');
    //e.dataTransfer.setData('xenon/drag', this.key);
    e.dataTransfer.setData('text/plain', this.key);
  }
  onEnter(e) {
    // Get the distance between the item element and the top of the main
    // app container. This value will be used to position the popup panel that
    // shows the info the hovered item.
    const {top, left, width} = this.host.host.getBoundingClientRect();
    this.value = {top, left: left + width};
    this.fire('enter');
  }
  onLeave(e) {
    this.fire('leave');
  }
}
customElements.define('draggable-item', DraggableItem);
