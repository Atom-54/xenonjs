/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
export const BuildLayout = {
  Panel: {
    type: '$library/Layout/Atoms/Panel'
  },
  Header: {
    type: '$library/Layout/Atoms/Panel',
    container: 'Panel#Container',
    state: {
      layout: 'row',
      style: {
        flex: '0 0 auto',
        background: '#ececec'
      }
    }
  },
  BodySplit: {
    type: '$library/Layout/Atoms/SplitPanel',
    container: 'Panel#Container',
    state: {
      layout: 'row',
      divider: 252
    }
  },
  ToolsBody: {
    type: '$library/Layout/Atoms/Panel',
    container: 'BodySplit#Container2'
  },
  DocumentBody: {
    type: '$library/Layout/Atoms/Panel',
    container: 'BodySplit#Container'
  },
  DocumentSplit: {
    type: '$library/Layout/Atoms/SplitPanel',
    container: 'DocumentBody#Container',
    state: {
      layout: 'column',
      divider: 212
    }
  },
  Document: {
    type: '$library/Layout/Atoms/Panel',
    container: 'DocumentSplit#Container'
  },
  DocumentEditors: {
    type: '$library/Layout/Atoms/Panel',
    container: 'DocumentSplit#Container2'
  },
  Footer: {
    type: '$library/Echo',
    container: 'Panel#Container',
    state: {
      html: 'atom54.com',
      style: {
        textAlign: 'right',
        fontSize: '70%',
        padding: '4px',
        flex: '0 0 auto',
        background: '#cccccc'
      }
    }
  }
};
