export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update(inputs, state) {
  state.groups = this.groupByCategory(inputs);
  this.updateGraphsCategory(inputs, state);
},
updateGraphsCategory({graphs, search}, state) {
  if (graphs) {
    const matchStr = str => str?.toLowerCase().includes(search.toLowerCase());
    const matchSearch = ({meta: {id, description}}) => (!search || matchStr(id) || matchStr(description));
    const graphIds = graphs.filter(matchSearch).map(g => g.meta.id);
    if (graphIds.length > 0) {
      const graphsGroup = this.createGroup('Graphs', []);
      graphsGroup.nodeTypes = graphIds.map(id => ({id, displayName: id})).sort((g1, g2) => g1.id.toLowerCase() > g2.id.toLowerCase() ? 1 : -1);
      const index = state.groups.findIndex(g => g.category === 'Graphs');
      if (index < 0) {
        state.groups.push(graphsGroup);
      } else {
        state.groups[index] = graphsGroup;
      }
    }
  }
},
groupByCategory({nodeTypes, search, categories}) {
  const matchSearch = name => (!search || name?.toLowerCase().includes(search.toLowerCase()));
  const groupTypeEntry = ([id, type], i) => {
    try {
      const {category, description, displayName} = type;
      if (matchSearch(displayName || id) || matchSearch(category) || matchSearch(description)) {
        const group = this.requireGroup(category ?? 'Objects', groups, categories);
        group.nodeTypes.push({
          id,
          displayName: displayName || id
        });
      }
    } catch(x) {
      log(`nodeType [${id}] is malformed`, type);
    }
  };
  // populate groups
  const groups = {};
  entries(nodeTypes).forEach(groupTypeEntry);
  // sort each group.nodeTypes now that they are populated
  values(groups).forEach(group => group.nodeTypes = group.nodeTypes.sort(this.sortNodeTypes));
  // return the groups themselves
  return values(groups);
},
requireGroup(category, groups, categories) {
  return groups[category] ?? this.createGroup(category, groups, categories);
},
createGroup(category, groups, categories) {
  const group = {
    category,
    style: this.categoryStyle(category, categories),
    nodeTypes: []
  };
  groups[category] = group;
  return group;
},
categoryStyle(category, categories) {
  const color = this.colorByCategory(category, categories);
  const backgroundColor = this.bgColorByCategory(category, categories);
  return {
    color,
    backgroundColor,
    // borderTop: `1px solid ${color}`
  };
},
colorByCategory(category, categories) {
  return categories?.[category]?.color || 'var(--xcolor-one)';
},
bgColorByCategory(category, categories) {
  return categories?.[category]?.bgColor || 'var(--xcolor-brand)';
},
render({}, {groups, showInfoPanel, infoPanelPos, scrollLeft}) {
  const {top, right} = infoPanelPos || {top: 0, right: 0};
  const nodeNodeTypes = groups.flatMap(group => group.category !== 'Graphs' ? group.nodeTypes : []);
  nodeNodeTypes.sort(this.sortNodeTypes);
  const flat = nodeNodeTypes.map(nodeType => ({
    ...nodeType, 
    hideGroup: true, 
    hideNodeType: false
  }));
  // const flat = groups.flatMap(group => {
  //   return [{
  //     group: group.category, 
  //     style: group.style, 
  //     hideNodeType: true, 
  //     hideGroup: group.category !== 'Graphs'
  //   },
  //   ...(group.nodeTypes.map(nodeType => ({
  //       ...nodeType, 
  //       hideGroup: true, 
  //       hideNodeType: false
  //     })))
  //   ]
  // });
  //log.warn(flat);
  return {
    scrollLeft,
    // flat,
    groups,
    hideNoMatchedNodesLabel: groups?.length !== 0,
    showInfoPanel: String(Boolean(showInfoPanel)),
    infoPanelContainerStyle: {
      top: top < 500 ? `${top + 25}px` : `${top - 260}px`,
      //right: `${right + 40}px`
      left: `${200}px`
    }
  };
},
sortNodeTypes({displayName}, {displayName: otherDisplayName}) {
  return displayName?.toLowerCase().localeCompare(otherDisplayName.toLowerCase());
},
async onItemClick({eventlet: {key}, nodeTypes, graphs}) {
  const type = nodeTypes[key];
  if (type) {
    const action = {
      //name: 'Morph Object', 
      //ligature: 'morph',
      actions: [{
        action: 'service',
        args: {
          kind: 'DesignService',
          msg: 'MorphObject',
          data: {type}
        }
      }, {
        action: 'toggle',
        stateKey: 'NodeTypeListFlyOut$flyOut$show'
      }]
    };
    return {type, event: {action, version: Math.random()}};
  } else {
    const graph = graphs.find(g => g.meta.id === key);
    const action = {
      //name: 'Append Graph', 
      actions: [{
        action: 'service',
        args: {
          kind: 'GraphService',
          msg: 'AppendGraph',
          data: {graph}
        }
      }, {
        action: 'toggle',
        stateKey: 'NodeTypeListFlyOut$flyOut$show'
      }]
    };
    return {type, event: {action, version: Math.random()}};
  }
},
async onHoverNodeType({eventlet: {key, value}, nodeTypes, graphs}, state, {service}) {
  assign(state, {
    showInfoPanel: true,
    infoPanelPos: value
  });
  const type = nodeTypes[key]?.type;
  let meta = null;
  if (type) {
    meta = await service('GraphService', 'FetchNodeMeta', {type});
    meta.title = type.split('/').pop();
  } else {
    const graph = graphs.find(g => g.meta.id === key);
    if (graph) {
      // TODO: add owner and creation date to description!
      meta = {title: key, description: graph.meta.description??''};
    }
  }
  return {
    hoveredMeta: meta ?? {title: '', description: 'no description available'}
  };
},
onMouseOutNodeType(inputs, state) {
  state.showInfoPanel = false;
  return {hoveredMeta: null};
},
onMouseWheel({eventlet: {scrollLeft, deltaY}}, state) {
  state.scrollLeft = scrollLeft + deltaY;
},
template: html`
<style>
  :host {
    height: 100%;
    overflow: auto !important;
    background-color: var(--xcolor-two) !important;
    color: var(--xcolor-four);
    display: flex;
    flex-direction: row;
    --cell-margin: 0;
    --cell-pad: 0;
  }
  [no-matched-nodes] {
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
  }
  [info-panel-container] {
    position: fixed;
    background: white;
    z-index: 1000;
    box-shadow: 0px 1px 2px rgba(60, 64, 67, 0.3), 0px 2px 6px 2px rgba(60, 64, 67, 0.15);
    border-radius: 31px;
    min-width: 300px;
    max-width: 500px;
  }
  nodetype-info-panel {
    display: none;
  }
  [group] {
    min-width: 200px;
    border: 1px solid var(--xcolor-brand);
    background-color: var(--xcolor-one);
    border-radius: 4px;
    margin: 0 4px;
    font-size: 0.9em;
  }
  [category] {
    font-size: 0.75em;
    font-weight: bold;
    padding: 4px 20px 5px;
    text-transform: capitalize;
  }
  [item] {
    /* font-size: 0.8em; */
    cursor: pointer;
    border: 2px solid transparent;
    padding: 2px;
    margin: 0 4px;
    background-color: var(--xcolor-one);
    /* padding: 4px 20px; */
  }
  [item]:hover {
    border: 2px dotted var(--xcolor-brand);
  }
  [grid] {
    padding: 8px;
  }
  [grid] > * {
    flex: 0;
  }
</style>

<slot name="search"></slot>

<div flex column>
  <div scrolling flex column grid repeat="group_t">{{groups}}</div>
  <!-- <div scrolling flex column grid scroll-left="{{scrollLeft:scrollLeft}}" on-mousewheel="onMouseWheel" repeat="nodetype_t">{{flat}}</div> -->
  <div no-matched-nodes hide$="{{hideNoMatchedNodesLabel}}">No matched nodes</div>
</div>

<div info-panel-container xen:style="{{infoPanelContainerStyle}}" display$="{{showInfoPanel}}">
  <slot name="info"></slot>
</div>

<template group_t>
  <div group>
    <div center bar xen:style="{{style}}">
      <div category>{{category}}</div>
    </div>
    <div repeat="nodetype_t">{{nodeTypes}}</div>
  </div>
</template>

<template nodetype_t>
  <div>
    <!-- <div group hidden="{{hideGroup}}">
      <div center bar xen:style="{{style}}">
        <div category>{{group}}</div>
      </div>
    </div> -->
    <!-- -->
    <div item hidden="{{hideNodeType}}" toolbar key="{{id}}" on-click="onItemClick">
      <draggable-item icon="deployed_code" disabled="true" key="{{id}}" on-enter="onHoverNodeType" on-leave="onMouseOutNodeType">
        <span>&nbsp;</span>
      </draggable-item>
      <span>{{displayName}}</span>
    </div>
  </div>
</template>

<!-- <template nodetype_t>
  <draggable-item key="{{id}}" name="{{displayName}}" on-enter="onHoverNodeType" on-leave="onMouseOutNodeType" on-item-clicked="onItemClick"></draggable-item>
</template> -->

`
});
