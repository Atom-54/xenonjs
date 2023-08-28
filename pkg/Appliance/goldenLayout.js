const {GoldenLayout} = globalThis;

export const init = (elt, layoutState) => {
  const layout = new GoldenLayout(layoutState, elt);
  layout.registerComponent('testComponent', function (container, {label}) {
    container.getElement().html(`<xenon-graph name="${label}"></xenon-graph>`);
    //container.getElement().html('<h2>' + componentState.label + '</h2>');
  });
  //listen(grid);
  layout.init();
  return layout;
};

export const add = (grid, thing) => {
//  /*const div =*/ grid.addWidget({w: 2, h:2, subGridDynamic: true, content: `<xenon-graph name="${thing}"></xenon-graph>`});
};

export const serialize = grid => {
  // return grid.save(true, true);
};

export const deserialize = (grid, data) => {
  // return data && grid.load(data);
};