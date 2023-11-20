// choose a connector
import {connectXenon} from './connectXenon.js';

const log = logf('Main', 'purple');

export const start = async (main) => {
  try {
    // here's a xenon
    const xenon = await connectXenon();
    await main(xenon, log);
  } catch(x) {
    console.error(x);
  }
};
