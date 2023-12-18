/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
export const BuildLayout = {
  Panel: {
    type: '$anewLibrary/Layout/Atoms/Panel'
  },
  Header: {
    type: '$anewLibrary/Layout/Atoms/Panel',
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
    type: '$anewLibrary/Layout/Atoms/SplitPanel',
    container: 'Panel#Container',
    state: {
      layout: 'row',
      divider: 252
    }
  },
  ToolsBody: {
    type: '$anewLibrary/Layout/Atoms/Panel',
    container: 'BodySplit#Container2'
  },
  DocumentBody: {
    type: '$anewLibrary/Layout/Atoms/Panel',
    container: 'BodySplit#Container'
  },
  DocumentSplit: {
    type: '$anewLibrary/Layout/Atoms/SplitPanel',
    container: 'DocumentBody#Container',
    state: {
      layout: 'column',
      divider: 212
    }
  },
  Document: {
    type: '$anewLibrary/Layout/Atoms/Panel',
    container: 'DocumentSplit#Container'
  },
  DocumentEditors: {
    type: '$anewLibrary/Layout/Atoms/Panel',
    container: 'DocumentSplit#Container2'
  },
  Footer: {
    type: '$anewLibrary/Echo',
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
