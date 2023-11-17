export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

async update(inputs, state, tools) {
    await this.maybeFetchLocations(inputs, state, tools);
    await this.maybeFilterLocations(inputs, state, tools);
    await this.maybeUpdateSelected(inputs, state, tools);
  },

  async maybeFetchLocations({geolocation, radius}, state, {service}) {
    const latitude = geolocation?.latitude?.toFixed(2);
    const longitude = geolocation?.longitude?.toFixed(2);
    const coordsInitialized = latitude && longitude && (radius > 0);
    const coordsChangeed = (state.latitude !== latitude) || (state.longitude !== longitude) || (state.radius !== radius);
    if (coordsInitialized && coordsChangeed) {
      assign(state, {latitude, longitude, radius, filter: ''});
      state.locations = await service('POIService', 'listPOIs', {
        latitude, longitude, radius,
        categories: {} // this.chooseCategories(filter),
      }) ?? [];
    }
  },

  async maybeFilterLocations(inputs, state, tools) {
    const {filter, result} = inputs;
    if (state.locations?.length && (filter !== state.filter)) {
      state.filter = filter;
      if (filter === '*') {
        assign(state, {pending: null, selected: null});
        await tools.output({locations: state.locations, location: {}});
      } else {
        await this.requestFiltering(filter, state, tools);
      }
    }
    if (result && state.result !== result) {
      await this.processFilteringResults(result, state, tools);
    }    
  },

  async requestFiltering(filter, state, {output}) {
    assign(state, {pending: Math.floor(Math.random() * 100000000), selected: null});
    const request = `
I'll give you a list of places names, and I would like you to reply with a sub set of only these places names that are suitable for ${filter}:
${state.locations.map(({name}) => name).join(', ')}
Start your answer with the string '${state.pending}:' and then follow by ONLY a comma-separated list of places names! not a full sentence, no enumeration, just the names.
`;
    await output({request, restart: Math.random(), locations: [], location: {}});
  },

  async processFilteringResults(result, state, {output}) {
    state.result = result;
    const prefix = `${state.pending}:`;
    if (result.startsWith(prefix)) {
      assign(state, {pending: null, selected: null});
      const names = new Set(result.substring(prefix.length).split(',').map(name => name.trim()));
      state.filtered = state.locations?.filter(({name}) => names.has(name));
      await output({
        locations: state.filtered,
        location: {}
      });
    }
  },

  async maybeUpdateSelected({filter, selected}, state, {service, output}) {
    const locations = filter === '*' ? state.locations : state.filtered;
    if (locations?.length && (!state.selected || (selected !== state.selected))) {
      state.selected = selected;
      let location = locations.find(({xid}) => xid === selected);
      if (!location) {
        state.selected = locations?.[0]?.xid;
        location = locations.find(({xid}) => xid === state.selected);
      }
      if (location?.xid !== state.location?.xid) {
        if (location) {
          assign(location, 
            (state.details??={})[state.selected] ??= await service('POIService', 'getDetails', {xid: state.selected}));
        }
        state.location = location;
        output({location});
      }
    }
  }

// Note: using static categories filtering is brittle.
// However, possibly consider combination of structured and AI-based filtering.
// chooseCategories(filter) {
//   switch(filter?.toLowerCase()) {
//     case 'family friendly':
//       return {
//         include: 'amusements,children_museums,beaches,view_points,sport,interesting_places'.split(','),
//         exclude: 'adult,nude_beaches'.split(',')
//       };
//     case 'sports and outdoors':
//       return {
//         include: 'sport,natural,urban_environment,bridges,towers'.split(',')
//       };
//     case 'museums':
//       return {
//         include: ['museums']
//       };
//     case 'history and religion':
//       return {
//         include: 'historic,historic_object,historic_architecture,historic_house_museums,history_museums,religion'.split(',')
//       };
//     default:
//       return {};
//   }
// }

});
