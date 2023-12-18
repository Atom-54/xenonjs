/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
export const BuildLayout = {
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
  BodyLeft: {
    type: '$anewLibrary/Layout/Atoms/SplitPanel',
    container: 'Panel#Container',
    state: {
      layout: 'row',
      divider: 252,
      endflex: true
    }
  },
  BodyMiddle: {
    type: '$anewLibrary/Layout/Atoms/SplitPanel',
    container: 'BodyLeft#Container2',
    state: {
      layout: 'column',
      divider: 212
    }
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
