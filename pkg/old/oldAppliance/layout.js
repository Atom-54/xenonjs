import '../third-party/gridstack/gridstack-all.js';

const {GridStack} = globalThis;

export const init = (elt, layoutState) => {
  const grid = !layoutState 
    ? initGridStack(elt)
    : GridStack.addGrid(elt, layoutState)
    ;
  listen(grid);
  return grid;
};

const initGridStack = gridStackEl => GridStack.init({
  margin: 4,
  alwaysShowResizeHandle: true,
  removable: '#trash', // drag-out delete selector
}, gridStackEl);

const listen = grid => {
  grid.on('added removed change', function(e, items) {
    grid.onchange?.();
  });
};

export const add = (grid, thing) => {
  /*const div =*/ grid.addWidget({w: 2, h:2, subGridDynamic: true, content: `<xenon-graph name="${thing}"></xenon-graph>`});
};

export const serialize = grid => {
  return grid.save(true, true);
};

export const deserialize = (grid, data) => {
  return data && grid.load(data);
};