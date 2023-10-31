/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const log = logf('Composer', '#c36834');

export class Composer {
  constructor() {
    this.slots = {};
    this.pendingPackets = [];
  }
  processPendingPackets() {
    const packets = this.pendingPackets;
    if (packets.length) {
      this.pendingPackets = [];
      packets.forEach(packet => {
        packet.pendCount = (packet.pendCount || 0) + 1;
        this.render(packet);
      });
    }
  }
  render(packet) {
    const {id, container, content: {model, template}} = packet;
    log({id, container, model})
    const cacheId = id;
    if (model?.$clear) {
      this._clearSlot(cacheId);
    } else if (template) {
      let slot = this.slots[cacheId];
      if (slot && slot.container !== container) {
        this._clearSlot(cacheId);
        slot = null;
      }
      if (!slot) {
        slot = this.maybeGenerateSlot(packet);
      }
      if (slot) {
        this.renderSlot(slot, packet);
      }
    }
  }
  renderSlot(slot, {container, content: {model}}) {
    this.maybeReattachSlot(slot, container);
    slot.set(model);
    this.processPendingPackets();
  }
  maybeGenerateSlot(packet) {
    const {id, container, content: {template}} = packet;
    const cacheId = id;
    // slot has a parent container
    const parent = this.findContainer(container);
    if (parent) {
      // generate a slot `id` for `container` in `template` under `parent`
      const slot = this.generateSlot(id, container, template, parent);
      // memoize the container
      slot.container = container;
      // retain
      this.slots[cacheId] = slot;
      // return
      return slot;
    }
    // packet has no slot (yet)
    this.pendingPackets.push(packet);
    log(`container [${container}] unavailable for slot [${cacheId}]`);
    // if ((++packet['pendCount'] % 1e4) === 0) {
    //   log.warn(`container [${container}] unavailable for slot [${cacheId}] (x1e4)`);
    // }
  }
  _clearSlot(id) {
    const slot = this.slots[id];
    if (slot) {
      this.processPendingPackets();
      this.slots[id] = null;
      this.clearSlot(slot);
    }
  }
  clearSlot(slot) {
  }
  findContainer(container) {
    return null;
  }
  generateSlot(id, template, parent) {
    return null;
  }
  onevent(pid, eventlet) {
    log(`[${pid}] sent [${eventlet.handler}] event`);
  }
  requestFontFamily(fontFamily) {
    return false;
  }
}
