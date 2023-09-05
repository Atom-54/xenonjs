/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

({
async update({stream}, state, tools) {
  if (stream) {
    state.streamInfo = await this.updateStreamInfo(stream, tools.service);
  }
},
async updateStreamInfo(stream, service) {
  return service({msg: 'getStreamInfo', data: stream});
},
async onCloseClick({stream}, state, {service}) {
  return service({msg: 'closeStream', data: stream});
},
// render({stream}, {}, tools) {
//   log(stream);
//   return {stream};
// },
template: html`
<style>
  :host {
    /* flex: none !important; */
    display: flex;
    flex-direction: column;
    border: 3px solid brown;
    font-family: sans-serif;
    background-color: black;
    /* width: 320px; */
    /* 4/3 */
    /* height: calc(240px + 30px); */
    /* 9/7 */
    /* height: calc(180px + 30px); */
  }
  [header] {
    color: white;
    background-color: brown;
    padding: 2px 3px 1;
    font-size: 0.50rem;
  }
  video {
    flex: 1;
    overflow: hidden;
    margin: 4px;
    border: 1px solid #666;
  }
</style>
<div header toolbar>
  <icon on-click="onCloseClick">close</icon>
  <span>{{stream}}</span>
</div>
<!-- <video srcObject="{{stream}}" autoplay></video> -->
<video-view stream="{{stream}}"></video-view>
`
});
