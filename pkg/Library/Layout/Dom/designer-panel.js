/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen, debounce} from '../../Dom/Xen/xen-async.js';
import {DragDrop} from '../../Dom/Common/drag-drop.js';
import {IconsCss} from '../../Dom/Material/material-icon-font/icons.css.js';

const log = logf('DOM: designer-panel', '#black', 'orange');

const GRID_SIZE = 16;

const {assign, entries, create} = Object;

export class DesignerPanel extends DragDrop {
  static get observedAttributes() {
    return [
      'readonly',
      'selected',
      'layout'
    ];
  }
  _didMount() {
    this.boxer = this._dom.$('[boxer]');
    this.boxer.hidden = true;
    // observe size changes to keep selectors in-place
    this.resizeObserver = new ResizeObserver(() => this.structureChanged());
    //this.resizeObserver.observe(this);
    // if children appear we must notice them
    this.mutationObserver = new MutationObserver(() => this.structureChanged());
    this.mutationObserver.observe(this.parentNode.host, {childList: true, subtree: true});
    // hrm, make sure there's a focus
    this.tabIndex = -1;
    window.addEventListener('keydown', e => {
      //log('keydown', e);
      if (e.key === 'Escape') {
        this.selectParent();
      }
    });
  }
  update({selected, layout, readonly}, state) {
    state.layer = this.getRootNode().host.id.split('_')[0];
    // TODO(sjmiles): readonly should be on 'this' and in 'inputs', but it's not?
    state.disabled = this.disabled = readonly; //this.hasAttribute('readonly');
    // '' is true for attributes
    //this.readonly = (readonly === '' || readonly);
    state.layout = layout;
    this.updateAtomLayout(layout);
    if (this.disabled) {
      this.boxer.hidden = true;
    }
    this.select(selected);
  }
  updateAtomLayout(layout) {
    // log('updateAtomLayout');
    entries(layout || Object).forEach(([id, value]) => {
      const atom = this.querySlotById(id);
      if (atom) {
        this.applyStyleToAtom(atom, value)
      } else {
        //log('no atom for layout key', id);
      }
    });
  }
  structureChanged() {
    if (!this.dragging) {
      const task = () => {
        log('structureChanged');
        const selected = this.lastSelected;
        this.lastSelected = null;
        this.updateAtomLayout(this.state.layout);
        this.select(selected);
      };
      this.structureDebounce = debounce(this.structureDebounce, task, 100);
    }
  }
  select(selected) {
    if (!this.disabled && selected && this.lastSelected !== selected) {
      // TODO(sjmiles): sometimes there's an atom name on the end :(
      if (selected.split('$').length === 2) {
        // remove atom name
        selected = this.getObjectId(selected);
      }
      // the "Slot" here is the designer-panel main slot, where all the 
      // designable bits are 
      // selected must work when prefixed by $ (_)
      // (so no layerId)
      const elt = this.querySlotById(selected);
      //
      if (elt) {
        this.target = elt;
        this.updateSelectionBox(elt);
        this.updateObserved(elt);
      } else {
        this.target = null;
        this.boxer.hidden = true;
      }
    } else if (!selected) {
      this.target = null;
      this.boxer.hidden = true;
    }
    this.lastSelected = selected;
  }
  // onSlotChange() {
  //   this.forceUpdate();
  // }
  onTargetDrop(e) {
    if (!this.disabled) {
      const ct = e.currentTarget;
      this.key = ct.key;
      this.value = this.findClosestSlot(ct.trigger);
      log(this.key, 'was dropped in slot: ', this.value);
      this.fire('contain');
    }
  }
  findClosestSlot(trigger) {
    let id = null;
    let slotName = null;
    for (let i = 0; i < trigger.composedPath().length; ++i) {
      const deepTarget = trigger.composedPath()[i];
      if (!slotName) {
        slotName = deepTarget.querySelector('slot')?.assignedElements()?.[0]?.name
          || deepTarget.shadowRoot?.querySelector('slot')?.name
          || deepTarget.querySelector('slot')?.name;
      }
      if (slotName) {
        id = deepTarget.id;
        if (id) {
          break;
        }
      }
    }
    if (id && slotName) {
      return `${id}#${slotName}`
    }
  }
  applyStyleToAtom(atom, {l, t, h, w, ...style}) {
    // order of operations here is important
    this.setBoxShape(atom, {l, t, h, w});
    // non-null style overrides shape
    if (style) {
      entries(style).forEach(([key, value]) => {
        if (value != null) {
          if (typeof value === 'object') {
            log('applyStyleToAtom: non-concrete style value', key, value);
          } else {
            atom.style[key] = value;
          }
        }
      })
    }
  }
  getObjectId(id) {
    return id?.split('$').slice(0, -1).join('$');
  }
  selectParent() {
    const objectId = this.selected; //this.getObjectId(this.selected);
    if (!this.parentNode.host.id.startsWith(`${objectId}_`)) {
      let elt = this.querySlotById(objectId);
      if (elt) {
        while (elt.parentElement.id.startsWith(`${objectId}_`)) {
          elt = elt.parentElement;
        }
        const parent = elt.parentElement;
        if (parent) {
          this.doSelect(parent);
        }
      }
    } else {
      this.doSelect(null);
    }
  }
  updateObserved(observed) {
    if (this.lastObserved !== observed) {
      if (this.lastObserved) {
        this.resizeObserver.unobserve(this.lastObserved);
      }
      // log('now observing ', observed);
      if (observed) {
        this.resizeObserver.observe(observed);
      }
      this.lastObserved = observed;
    }
  }
  updateSelectionBox(target) {
    this.setBoxShape(this.boxer, this.getLocalRect(this, target));
    this.boxer.hidden = false;
  }
  // implement drag-drop handlers
  // TODO(sjmiles): DragDrop should implement optional doMethods
  // that are invoked from the caller's onMethods, instead of the
  // other way around.
  doDown(e) {
    // not dragging yet
    this.dragStarted = false;
    if (this.disabled) {
      return false;
    }
    // the target is in our light dom sub-tree
    let t = e.target;
    // ascend tree until we are above any descendent designers
    const ancestorDesigner = elt => {
      do {
        elt = elt?.parentElement;
      } while (elt && !elt.id.endsWith('designer'));
      return elt;
    };
    while (true) {
      const designer = ancestorDesigner(t);
      if (!designer || designer === this.parentNode.host) {
        break;
      }
      t = designer.parentElement;
    }
    // TODO(sjmiles): document id conventions
    // in this case: [<misc>_nodeName]_atomName
    // almost same as getObjectId
    const nodeId = t.id.split('_').slice(0, -1).join('_');
    if (nodeId) {
      // TODO(sjmiles): why not event.composedPath?
      // ascend until our parent-element's id does not start with nodeId
      while (t.parentElement.id.startsWith(`${nodeId}_`)) {
        t = t.parentElement;
      }
      // don't select our own chrome
      // TODO(sjmiles): ad hoc
      if (e.target.id.startsWith('_AtomToolbar_')) {
        return;
      }
      // t is the topmost node of our Graph Object
      if (this.target !== t) {
        this.doSelect(t); 
      }
    }
    if (this.target) {
      // get rect used to position selection box
      this.dragRect = this.getLocalRect(this, this.target);
      // figure out if we're dragging a corner, edge, etc.
      this.identifyDragKind(e);
      // if we found a new target (t), or we are resizing the current target, do the things
      if ((t && nodeId) || (this.target && this.dragKind==='resize')) {
        // get rect used to position target box
        this.targetRect = this.getLocalRect(this.getReferenceFrame(this.target), this.target);
      }
    }
    //log('dragRect', this.dragRect);
  }
  doSelect(target) {
    this.target = target;
    // remove layerId and atomId to get objectId
    this.value = target?.atomId.split('$').slice(1, -1).join('$');
    this.fire('select');
  }
  doMove(dx, dy) {
    // moving with a target is dragging
    this.dragStarted = this.dragStarted || Boolean(this.dragRect && dx && dy);
    // give up if no target rect
    if (this.dragRect) {
      //
      // ... tricky
      const offsetRect = this.calculateDragOffsets(dx, dy, this.dragKind, this.dragFrom);
      //
      // TODO(sjmiles): the snapping has to account for this.dragFrom/Kind
      //
      let dr = this.addOffsetRect(this.dragRect, offsetRect);
      const {l: dl, t: dt} = DragDrop.snap(dr, GRID_SIZE);
      dr = {l: dl, t: dt, w: dr.w, h: dr.h};
      //
      let tr = this.addOffsetRect(this.targetRect, offsetRect);
      const {l: tl, t: tt} = DragDrop.snap(tr, GRID_SIZE);
      tr = {l: tl, t: tt, w: tr.w, h: tr.h};
      //
      this.setBoxShape(this.boxer, dr);
      this.setBoxShape(this.target, tr);
    }
  }
  doUp() {
    if (!this.disabled) {
      //log(this.target, this.dragStarted, this.dragRect);
      if (this.target && this.dragStarted && this.dragRect) {
        this.dragStarted = false;
        this.commitRect();
      }
      this.dragRect = null;
      if (this.target) {
        this.updateSelectionBox(this.target);
      }
    }
  }
  commitRect() {
    //log('commitRect');
    const nob = () => Object.create(null);
    const id = this.target.id.split('_').slice(1, -1).join('_');
    const rules = ((this.state.layout ??= nob())[id]) ??= nob();
    const rect = this.getLocalRect(this.getReferenceFrame(this.target), this.target);
    assign(rules, rect);
    this.value = this.state.layout;
    this.fire('layout');
  }
  calculateDragOffsets(dx, dy, dragKind, dragFrom) {
    let dl = 0, dt = 0, dw = 0, dh = 0;
    if (dragKind === 'move') {
      return {dl: dx, dt: dy, dw, dh};
    } else if (dragKind === 'resize') {
      if (dragFrom.includes('top')) {
        dt = dy;
        dh = -dy;
      }
      if (dragFrom.includes('bottom')) {
        dh = dy;
      }
      if (dragFrom.includes('left')) {
        dl = dx;
        dw = -dx;
      }
      if (dragFrom.includes('right')) {
        dw = dx;
      }
    }
    return {dl, dt, dw, dh};
  }
  querySlotById(id) {
    const sid = id?.replace(/[$)(:]/g, '_');
    const selector = `[id*="${this.state.layer}_${sid}_"]`;
    const elts = this.shadowRoot.querySelector('slot').assignedElements({flatten: true});
    let child = null;
    if (elts) {    
      // any assigned elements match selector directly?
      child = elts.find(elt => elt.matches(selector));
      if (!child) {
        // if not, look in the subtree of each assigned element
        elts.some(elt => child = elt.querySelector(selector));
      }
    }
    // const selector = `[id*="_${sid}_"]`;
    // // the elements assigned to our slot
    // const elts = this.shadowRoot.querySelector('slot').assignedElements({flatten: true});
    // if (elts) {    
    //   // any assigned elements match selector directly?
    //   child = elts.find(elt => elt.matches(selector));
    //   if (!child) {
    //     // if not, look in the subtree of each assigned element
    //     elts.some(elt => child = elt.querySelector(selector));
    //   }
    // }
    // if (child !== child0) {
    //   console.warn(child, child0);
    // }
    //log(child, sid, elts);
    return child;
  }
  identifyDragKind(e) {
    // dom target
    const attrs = e.target.attributes;
    const edges = ['top', 'right', 'bottom', 'left'];
    const from = edges.map(e => attrs[e]?.name).join(':');
    if (from === ':::') {
      // not on the box itself
      if (!e.ctrlKey && !e.metaKey) {
        const top = e.path?.[0];
        // no dragging in things marked 'nodrag'
        if (top?.hasAttribute?.('nodrag')) {
          return;
        }
        // no dragging in common input thingies
        if (['input', 'button', 'textarea'].includes(top?.localName)) {
          return;
        }
      }
      // component target
      this.dragKind = 'move';
    } else {
      // resize target
      this.dragKind = 'resize';
      this.dragFrom = from;
    }
    // we're consuming it
    e.stopPropagation();
  }
  getReferenceFrame(here) {
    return here.parentElement; //offsetParent;
  }
  getOrigin(here) {
    const {left: l, top: t} = here.getBoundingClientRect();
    return {l, t};
  }
  addOffsetRect({l, t, w, h}, {dl, dt, dw, dh}) {
    return {l: l+dl, t: t+dt, w: w+dw, h: h+dh};
  }
  getBoundingRect(here) {
    // get origin in viewport coordinates
    const {l,t} = this.getOrigin(here);
    // use outer-dimensions as calculated by DOM
    return {l, t, w: here.offsetWidth, h: here.offsetHeight};
  }
  getClientRect(here) {
    // get origin in viewport coordinates
    const {l,t} = this.getOrigin(here);
    // use inner-dimensions as calculated by DOM
    const {clientWidth: w, clientHeight: h} = here;
    // we have to calculate the inner origin ourselves
    // the full margin is the differenece between offset and 
    // client (pad/border) margins
    const dx = here.offsetWidth - w, dy = here.offsetHeight - h;
    // apply half-margin to origin (full-margin is accounted for already in w/h)
    return {l: l+dx/2, t: t+dy/2, w, h};
  }
  getLocalRect(here, there) {
    // get there's rect in the here's frame
    const localFrame = this.getClientRect(here);
    const targetFrame = this.getBoundingRect(there);
    return this.convertFrame(localFrame, targetFrame);
  }
  convertFrame(here, {l, t, w, h}) {
    return {l: l - here.l, t: t - here.t, w, h};
  }
  setBoxShape(elt, {l, t, w, h}) {
    if (elt && (l || t || w || h)) {
      const px = o => o>0 ? `${o}px` : 0;
      // TODO(sjmiles): left, top are convenient but transform is possibly more performant
      // transform is inconvenient, because the same property has other independent values
      // (rotation, scale)
      // we could crack transform and manipulate, but I decided to try left/top first
      //const xforms = (elt.style.transform ?? '').split(' ');
      const [wpx, hpx] = [px(w), px(h)];
      assign(elt.style, {
        boxSizing: 'border-box',
        top: px(t),
        left: px(l),
        //transform: `translate(${px(l)}, ${px(t)})`,
        width: wpx,
        height: hpx,
        visibility: (w===0 && h===0) ? 'hidden' : 'visible'
      });
    }
  }
  get template() {
    return Xen.Template.html`
<style>
  ${IconsCss}
  :host {
    /* outside */
    position: relative;
    flex: 1;
    /* inside */
    display: flex;
    user-select: none;
    overflow: hidden;
    /* handles */
    --size: 9px;
  }
  :host slot::slotted(*) {
    transform: none !important;
    width: auto !important;
    height: auto !important;
    top: 0 !important;
    left: 0 !important;
  }
  * {
    box-sizing: border-box;
  }
  [container] {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  [boxer] {
    pointer-events: none;
    position: absolute;
    background-color: transparent;
    box-sizing: border-box;
    left: 1000em;
    /* transform: translate(-1000px, 0); */
    z-index: 100;
  }
  [corner] {
    pointer-events: all;
    position: absolute;
    width: var(--size);
    height: var(--size);
    border: var(--xdesign-border, 2px solid var(--xcolor-four));
    /* border: 2px solid var(--xcolor-four); */
    background-color: var(--xcolor-one);
  }
  [left][corner] {
    left: 0;
  }
  [right] {
    right: 0;
  }
  [top][corner] {
    top: 0;
  }
  [bottom] {
    bottom: 0;
  }
  [top][left], [bottom][right] {
    cursor: nwse-resize;
  }
  [bottom][left], [top][right] {
    cursor: nesw-resize;
  }
  [edge] {
    pointer-events: all;
    position: absolute;
    border: var(--xdesign-border, 2px solid var(--xcolor-four));
  }
  [top][edge], [bottom][edge] {
    left: 0;
    right: 0;
    height: 2px;
    cursor: ns-resize;
  }
  [left][edge], [right][edge] {
    top: 0;
    bottom: 0;
    width: 2px;
    cursor: ew-resize;
  }
  [popdown] {
    border-radius: 8px;
    background-color: var(--xcolor-two);
    padding: 8px;
    font-size: 16px;
    pointer-events: all;
    position: absolute;
    top: -36px;
    right: 12px;
    /* left: 40%; */
    opacity: 0;
    transition: opacity 100ms ease-in-out;
  }
  [popdown]:hover {
    opacity: 1;
  }
</style>

<drop-target container on-pointerdown="onDown" on-target-drop="onTargetDrop">
  <slot on-pointerdown="onDown" on-pointerup="onUp"></slot>
</drop-target>

<div boxer on-pointerdown="onDown">
  <div top edge></div>
  <div right edge></div>
  <div bottom edge></div>
  <div left edge></div>
  <div top right corner></div>
  <div bottom right corner></div>
  <div bottom left corner></div>
  <div top left corner></div>
  <div popdown><slot name="toolbar"></slot></div>
</div>
`;
  }
}

customElements.define('designer-panel', DesignerPanel);
