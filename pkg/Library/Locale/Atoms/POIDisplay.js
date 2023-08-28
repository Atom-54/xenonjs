export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

render({location}) {
  if (location) {
    const concatParts = (p1, p2, delim) => [p1, p2].filter(p => p).join(delim);
    const formatAddress = ({house_number, road, city}) => `${concatParts(concatParts(house_number, road, ' '), city, ', ')}`;
    return {
      name: location.name,
      distance: location.dist ? `(${(location.dist/1000).toFixed(1)}km away)`: ``,
      address: formatAddress(location.address??{}),
      image: location.preview?.source,
      imgStyle: {height: location.preview?.height, width: location.preview?.width},
      url: location.url,
      wiki: location.wikipedia,
      details: location.wikipedia_extracts?.html??location.wikipedia_extracts?.text
    }
  }
},

template: html`
<style>
  :host {
    overflow: auto !important;
  }
  [preview] {
    line-height: 2em;
    padding: 0 20px;
    overflow: auto
  }
  [name] {
    font-weight: bold;
    font-size: 1.2em;
  }
  [details] {
    line-height: 1em;
    font-size: 0.8em;
  }
  [address] {
    font-size: 0.8em;
    color: var(--xcolor-three);
  }
</style>

<div preview>
  <div name>{{name}}</div>
  <div address><span>{{address}}</span> <span>{{distance}}</span></div>
  <div details unsafe-html="{{details}}"></div>
  <div link><a href="{{url}}">{{url}}</a></div>
  <div link><a href="{{wiki}}">{{wiki}}</a></div>
  <img xen:style="{{imgStyle}}" src="{{image}}"/>
</div>
`

});
