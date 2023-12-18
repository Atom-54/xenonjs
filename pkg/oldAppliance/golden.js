import * as Storage from './storage.js';
import * as Layout from './goldenLayout.js';

const options = Storage.getOptions();
select.innerHTML = options;

const makeKey = i => `appliance-goldenlayout-${i}`;

const config = {
  content: [{
    type: 'row',
    content:[{
      type: 'component',
      componentName: 'testComponent',
      componentState: { label: 'GraphAgent' }
    },{
      type: 'column',
      content:[{
        type: 'component',
        componentName: 'testComponent',
        componentState: { label: 'Comparinator' }
      },{
        type: 'component',
        componentName: 'testComponent',
        componentState: { label: 'SelfieShaders' }
      }]
    }]
  }]
};

const initLayouts = elts => {
  const layouts = {};
  for (let i=0; i<elts.length; i++) {
    const key = makeKey(i);
    const layoutState = Storage.loadLayout(key);
    const layout = Layout.init(elts[i], config);
    layouts[key] = layout;
    // layout.onchange = () => {
    //   Storage.saveLayout(key, Layout.serialize(layout));
    // };
  }
  return layouts;
};

const elts = [gridStack1, gridStack2, gridStack3, gridStack4];
const layouts = initLayouts(elts);
let layout;

const selectPage = key => {
  const i = key - 1;
  layout = Object.values(layouts)[i];
  elts.forEach(e => e.style.display = 'none');
  elts[i].style.display = '';
  setTimeout(() => layout.updateSize(), 0);
};

selectPage(1);

window.add = thing => {
  Layout.add(layout, thing);
};

window.onPagebarClick = e => {
  const key = Number(e.target.getAttribute?.('key'));
  if (key > 0) {
    [...document.querySelectorAll('[key]')].forEach(e => e.removeAttribute('selected'));
    e.target.setAttribute('selected', '');
    selectPage(key);
  }
};
