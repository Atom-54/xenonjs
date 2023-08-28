// DEPRECATED by POIFinder and POIDisplay.
export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

async update({geolocation, categories, radius, pageLength, selected}, state, {service, output}) {
  const latitude = geolocation?.latitude?.toFixed(2);
  const longitude = geolocation?.longitude?.toFixed(2);
  if (latitude && longitude && radius &&
      ((state.latitude !== latitude) || (state.longitude !== longitude) || (state.radius !== radius) || (pageLength && pageLength !== state.pageLength) || categories && categories !== state.categories)) {
    assign(state, {latitude, longitude, categories, radius, pageLength});
    state.locations = await service('POIService', 'listPOIs', {
      latitude,
      longitude,
      categories: this.chooseCategories(categories),
      radius,
      pageLength
    });
    state.selected = selected = null;
    output({locations: state.locations, selected: null});
  }
  if (state.locations?.length && (!state.selected || selected !== state.selected?.xid)) {
    const xid = selected ?? state.locations[0].xid;
    state.selected = (state.details??={})[xid] ??= await service('POIService', 'getDetails', {xid});
    output({selected: state.selected?.xid});
  }
},

chooseCategories(categories) {
  switch(categories.toLowerCase()) {
    case 'family friendly':
      return {
        include: 'amusements,children_museums,beaches,view_points,sport,interesting_places'.split(','),
        exclude: 'adult,nude_beaches'.split(',')
      };
    case 'sports and outdoors':
      return {
        include: 'sport,natural,urban_environment,bridges,towers'.split(',')
      };
    case 'museums':
      return {
        include: ['museums']
      };
    case 'history and religion':
      return {
        include: 'historic,historic_object,historic_architecture,historic_house_museums,history_museums,religion'.split(',')
      };
    default:
      return {};
  }
},

render(inputs, {locations, selected}) {
  const selectedRender = this.renderSelected(locations, selected);
  return {
    locations: this.renderLocations(locations, selected),
    selected: selectedRender ? [selectedRender] : []
  }
},

renderLocations(locations, selected) {
  return locations?.map(location => ({...location, selected: location.xid === selected?.xid}));
},

renderSelected(locations, selected) {
  const location = locations?.find(({xid}) => xid === selected?.xid);
  if (location && selected) {
    const concatParts = (p1, p2, delim) => [p1, p2].filter(p => p).join(delim);
    const formatAddress = ({house_number, road, city}) => `${concatParts(concatParts(house_number, road, ' '), city, ', ')}`;
    return {
      name: selected.name,
      distance: `(${(location.dist/1000).toFixed(1)}km away)`,
      address: formatAddress(selected.address),
      image: selected.preview?.source,
      imgStyle: {height: selected.preview?.height, width: selected.preview?.width},
      url: selected.url,
      wiki: selected.wikipedia,
      details: selected.wikipedia_extracts?.html??selected.wikipedia_extracts?.text
    }
  }
},

async onSelect({eventlet: {key: xid}}, state, {service}) {
  state.selected = null;
  return {selected: xid};
},

template: html`
<style>
  :host {
    overflow: auto !important;
  }
  [locations] {
    border-right: 1px solid var(--xcolor-two);
    overflow: auto;
  }
  [selected-location] {
    overflow: auto;
  }
  [location] {
    cursor: pointer;
    font-size: 0.8em;
    line-height: 1.2em;
    padding: 5px 0;
  }
  [location]:hover {
    text-decoration: underline;
  }
  [selected] {
    color: var(--xcolor-brand);
    font-weight: bold;
    text-decoration: underline;
  }
  [preview] {
    line-height: 2em;
    padding: 0 20px;
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

<div flex columns>
  <div repeat="name_t" flex locations>{{locations}}</div>
  <div flex x2 selected-location>
    <div repeat="details_t">{{selected}}</div>
  </div>
</div>

<template name_t>
  <div location key="{{xid}}" on-click="onSelect" selected$="{{selected}}">{{name}}</div>
</template>

<template details_t>
  <div preview>
    <div name>{{name}}</div>
    <div address><span>{{address}}</span> <span>{{distance}}</span></div>
    <div details unsafe-html="{{details}}"></div>
    <div link><a href="{{url}}">{{url}}</a></div>
    <div link><a href="{{wiki}}">{{wiki}}</a></div>
    <img xen:style="{{imgStyle}}" src="{{image}}"/>
  </div>
</template>
`

});
