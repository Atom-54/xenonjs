/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../../Dom/Xen/xen-async.js';
import '../../../third-party/chartjs/chart.js';

const {Chart} = globalThis;

const template = Xen.Template.html`
<style>
  :host {
    display: flex;
    flex-direction: column;
  }
</style>

<div>
  <canvas></canvas>
</div>
`;

export class AwesomeChart extends Xen.Async {
  static get observedAttributes() {
    // setting these properties/attributes will automatically trigger `update(inputs)`
    // these are the names of fields in `inputs`
    return ['type', 'data', 'options'];
  }
  get template() {
    return template;
  }
  update({type, data, options}, state) {
    if (state.type !== type) {
      state.type = type;
      state.chart?.destroy();
      state.chart = null;
    }
    if (type && !state.chart) {
      const ctx = this.shadowRoot.querySelector('canvas');

      state.chart = new Chart(ctx, {
        type, // 'bar', 'doughnut', ...
        data: data ?? {},
        options: options ?? {
          scales: {
            y: {
              beginAtZero: true,
            }
          }
        }
      });    
    }

    if (state.chart) {
      if ((data && JSON.stringify(data) !== JSON.stringify(state.data)) ||
          (options && JSON.stringify(options) !== JSON.stringify(state.options))) {
        state.chart.data = state.data = data;
        state.chart.options = state.options = options;
        state.chart.update();
      }
    }
  }
}

customElements.define('awesome-chart', AwesomeChart);
