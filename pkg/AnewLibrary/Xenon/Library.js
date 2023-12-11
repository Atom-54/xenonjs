import {atomInfo as manifestInfo} from '../../AnewLibrary/manifest.js';

const maybeParse = json => {
  if (typeof json === 'string') {
    try {
      return JSON.parse(json);
    } catch(x) {
      // squelch
    }
  }
  return json;
};

const readLsLibrary = async (from) => {
  return maybeParse(localStorage.getItem(from));
};

const readFbLibrary = async (from) => {
};

//const defaultLibrary = 'SuperiorMoodDb';
const defaultLibrary = 'a54.00/User/FirstLibrary';

const lsLibrary = {
  root: 'ls:',
  atoms: await readLsLibrary(defaultLibrary) || []
};

const allAtoms = [...lsLibrary.atoms];

const index = {};
allAtoms.forEach(meta => {
  if (meta.name) {
    index[meta.name] = {
      categories: ['Custom'],
      type: meta.name,
      ...meta
    };
  }
});

export const atomInfo = {
  ...manifestInfo,
  ...index
};

export const importLibrary = env => {
  const atomFactories = {}; 
  lsLibrary.atoms.forEach(({name, code}) => {
    try {
      const atomFactory = eval(code);
      atomFactories[name] = atomFactory;
      //console.log('atomFactory', name, atomFactories[name]);
    } catch(x) {
      console.warn(x);
    }
  });
  env.xenon.industrialize(atomFactories)
}
