/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../../Dom/Xen/xen-async.js';

const template = Xen.Template.html`
<!-- <mwc-icon-button right-aligned icon="refresh" on-click="onRefreshClick"></mwc-icon-button> -->
<data-explorer expand="10" object="{{om}}"></data-explorer>
`;

export class SurfaceWalkerElement extends Xen.Async {
  static get observedAttributes() {
    return ['object', 'kick'];
  }
  get template() {
    return template;
  }
  update() {
    this.refresh();
  }
  refresh() {
    const data = getTree();
    if (Array.isArray(data)) {
      const om = this.stratify(data);
      this.mergeState({om});
    }
  }
  onRefreshClick() {
    this.refresh();
  }
  stratify(arr) {
    const labelize = key => (key.startsWith('_') ? `main${key}` : key).replace(/_/g, '∙');
    return arr.reduce((obj, item) => {
      if (typeof item === 'string') {
        obj[labelize(item)] = '(leaf)';
      } else {
        const key = Object.keys(item).pop();
        obj[labelize(key)] = this.stratify(item[key]);
      }
      return obj;
    }, {});
  }
  // refresh2() {
  //   const data = new SurfaceWalker().from(document.body);
  //   const om = this.stratify(data);
  //   this.mergeState({om});
  // }
  render(inputs, {om}) {
    return {om};
  }
}

const getTree = () => {
  const dump = elt => {
    const children = [];
    const label = elt?.id;
    const node = label ? {[label]: children} : children;
    //
    let child = elt.firstElementChild;
    while (child) {
      if (child.hasAttribute('atom')) {
        children.push(dump(child));
      }
      child = child.nextElementSibling;
    }
    //
    return children.length ? node : label;
  };
  return dump(document.body);
}

// const indent = '<span style="font-size: 50%; opacity:0.2">..</span>';
// const formatChildren = (children, prefix) => {
//   const label = id => id.split('_').reverse().join(' (') + ')';
//   prefix ??= '';
//   const formatNode = node => {
//     if (typeof node === 'string') {
//       return `${prefix}${label(node)}`;
//     }
//     const children = formatChildren(Object.values(node).pop(), `${prefix}${indent}`);
//     return `${prefix}${label(keys(node).pop())}\n${children}`; 
//   }
//   return children?.map?.(child => formatNode(child)).join('\n');
// };

customElements.define('surface-walker', SurfaceWalkerElement);

// export const SurfaceWalker = class {
//   from(root) {
//     //console.group(root);
//     const result = {
//       id: this.classify(root)
//     };
//     const elements = [...root.children, ...root.shadowRoot?.children ?? []];
//     const children = this.children(elements);
//     if (children?.length) {
//       result.children = children;
//     }
//     //console.groupEnd(result);
//     return result;
//   }
//   classify(root) {
//     const names = [];
//     const a$ = root?.attributes;
//     if (a$) {
//       const particleName = a$.particle?.value;
//       const id = a$.id?.value;
//       // if (id === 'arc') {
//       //   names.push(`Arc`);
//       // }
//       if (particleName) {
//         names.push(particleName);
//         // names.push(`${particleName} (Particle)`);
//       }
//       if (names.length) {
//         return names.join(':');
//       }
//     }
//     return null;
//   }
//   children(children) {
//     let nodes = [];
//     children && [...children].forEach(child => {
//       const node = this.from(child);
//       if (node.id) {
//         nodes.push(node);
//       } else if (node.children?.length) {
//         nodes = [...nodes, ...node.children];
//       }
//     });
//     return nodes;
//   }
// };

