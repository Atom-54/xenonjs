/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../../Dom/Xen/xen-async.js';
//import {deepEqual, deepCopy} from '../../CoreXenon/Reactor/Atomic/js/utils/object.js';
import {css as themeCss} from '../../../third-party/gridjs/mermaid.min.css.js';
import * as gridjs from '../../../third-party/gridjs/gridjs.mjs';

const template = Xen.Template.html`
<style>
  :host {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  #grid {
    flex: 1;
  }
  ${themeCss}
</style>
<div flex id="grid"></div>
`;

export class GridJs extends Xen.Async {
  static get observedAttributes() {
    // setting these properties will automatically trigger `update(inputs)`
    // these are the names of fields in `inputs`
    return ['columns', 'options', 'data'/*, 'columnid'*/];
  }
  get template() {
    return template;
  }
  _didMount() {
    this.gridEl = this.shadowRoot.querySelector('#grid');
   //   const onresize = () => requestAnimationFrame(() => this.doresize());
  //   this.resizeObserver = new ResizeObserver(onresize);
  //   this.resizeObserver.observe(this);
  //   setTimeout(() => this.doresize(), 250);
  }
  // doresize() {
  //   const {grid} = this.state;
  //   grid?.setHeight(this.clientHeight - 1);
  //   grid?.refreshLayout();
  // }
  _shouldUpdate({columns}) {
    return columns;
  }
  async update({columns, options, data, columnid}, state) {
    const simpleColumns = columns.map(c => (typeof c === 'string') ? c : c?.name);
    const simpleData = !data ? [] : data.map(r => Array.isArray(r) ? r : Object.values(r));
    const config = {
      columns: simpleColumns, 
      data: simpleData
    };
    if (!state.gridjs) {
      state.gridjs = new gridjs.Grid(config);
      state.gridjs.render(this.gridEl);
    } else {
      state.gridjs.updateConfig(config)
    }
    // this.id = columnid ?? 'uid';
    // if (Array.isArray(columns) && !deepEqual(columns, state.columns)) {
    //   // Note: `deepCopy` is needed for future comparison of inputs and state,
    //   // because `setColumns` (and `resetData` below) modify its arguments.
    //   state.columns = deepCopy(columns);
    //   if (state.grid) {
    //     state.grid.setColumns(columns);
    //   } else {
    //     state.grid = this.initGrid(columns, options, []);
    //   }   
    //   this.doresize();
    // }
    // if (state.grid) {
    //   if (!deepEqual(data, state.data)) {
    //     const checkedIds = new Set(state.grid.getCheckedRows().map(({[this.id]: id}) => id));
    //     state.data = deepCopy(data);
    //     state.grid.resetData(data??[]);
    //     data?.forEach(({[this.id]: id}, index) => {
    //       if (checkedIds.has(id)) {
    //         state.grid.check(index);
    //       }
    //     });
    //     this.doresize();
    //   }
    // }
  }
  // initGrid(columns, options, data) {
  //   const grid = new Grid({
  //     el: this.shadowRoot.querySelector('#grid'),
  //     columnOptions: {
  //       resizable: true,
  //       //frozenCount: 1
  //     },
  //     //bodyHeight: 'fitToParent',
  //     scrollX: true,
  //     scrollY: true,
  //     ...options,
  //     columns,
  //     data
  //   });
  //   //Grid.applyTheme('striped');
  //   grid.on('check', ev => {
  //     this.doCheck([this.state.data[ev.rowKey][this.id]], true);
  //   });
  //   grid.on('uncheck', ev => {
  //     this.doCheck([this.state.data[ev.rowKey][this.id]], false);
  //   });
  //   grid.on('checkAll', ev => {
  //     this.doCheck(this.state.data.map(({[this.id]:id}) => id), true);
  //   });
  //   grid.on('uncheckAll', ev => {
  //     this.doCheck(this.state.data.map(({[this.id]:id}) => id), false);
  //   });
  //   grid.on('click', ev => {
  //     ev.nativeEvent.stopPropagation();
  //     if (ev.columnName !== '_checked') {
  //       this.key = this.state.data?.[ev.rowKey]?.[this.id];
  //       if (this.key) {
  //         this.fire('selected');
  //       }
  //     }
  //   });
  //   return grid;
  // }
  // doCheck(ids, value) {
  //   this.value ??= {};
  //   if (value) {
  //     ids.forEach(id => this.value[id] = true);
  //   } else {
  //     ids.forEach(id => delete this.value[id]);
  //   }
  //   this.fire('checked-changed');
  // }
}

customElements.define('grid-js', GridJs);
