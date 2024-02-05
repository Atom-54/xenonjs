export const atom = (log, resolve) => ({

  shouldUpdate({query}) {
    return query;
  },

  async update({query}, state) { 
    state.value = await this.doFetch(query);
    state.json = JSON.stringify(state.value, null, '  ');
    state.results = state.value?.results;
    return state;
  },
  
  async doFetch(query) {
    const key = '6fd682fe90726e12913ceb562e50e560';
    const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&api_key=${key}`;
    const results = await fetch(url);
    const json = await results.json();
    return json;
  },
    
  template: `<pre>{{json}}</pre>`
  
});