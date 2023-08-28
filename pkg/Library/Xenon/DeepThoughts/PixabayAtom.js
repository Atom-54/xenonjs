export const atom = () => ({
  async update({query}, state) {
    if (query && query !== state.query) {
      state.query = query;
      state.hits = await this.requestHits(query);
    }
    const {hits} = state;
    if (hits) {
      return {hits};
    }
  },
  async requestHits(query) {
    const server = `https://openai.iamthearchitect.workers.dev/pixabay/?query=`;
    const response = await fetch(`${server}${query}`, {method: 'GET'});
    const json = await response.json();
    return json?.hits;
  }
});