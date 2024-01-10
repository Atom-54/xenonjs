import {Build} from '../Graphs/Build.js';
import {BuildLayout} from '../Graphs/BuildLayout.js';
import {FileExplorer} from '../Graphs/FileExplorer.js';
import {Inspector} from '../Graphs/Inspector.js';
import {Parts} from '../Graphs/Parts.js';
import {State} from '../Graphs/State.js';
import {Editors} from '../Graphs/Editors.js';
import {Design} from '../Graphs/Design.js';
import {Run} from '../Graphs/Run.js';
import {GeneralEditor} from '../Graphs/GeneralEditor.js';
import {AtomTree} from '../Graphs/AtomTree.js';

export const Graphs = {
  Build, 
  BuildLayout,
  FileExplorer,
  Design,
  Inspector,
  Parts,
  State,
  Editors,
  Run,
  GeneralEditor,
  AtomTree
};

globalThis.Graphs = Graphs;