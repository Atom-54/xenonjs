if (!globalThis.THREE) {
  //
  // TODO(sjmiles): cannot stop it, can only hope to contain it
  //
  // if say, model-viewer, has loaded three.js privately,
  // THREE will still know it's being double loaded, and will
  // complain.
  //
  // We have to load it anyway, because we need the reference.
  //
  // We could do other shenanigans, but for now I'm content
  // with squelching the warning.
  //
  delete globalThis.__THREE__;
  await import('./three.min.js');
}
export const {THREE} = globalThis;
