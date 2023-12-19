/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
export const Documents = {
  DocumentTabs: {
    type: '$library/Spectrum/Atoms/SpectrumTabPanels',
    container: 'Layout$BodyMiddle#Container',
    state: {
      closeable: true
    }
  },
  CloseService: {
    type: '$library/Data/Atoms/ServiceAccess',
    state: {
      service: 'DocumentService',
      type: 'Close'
    },
    connections: {
      data: 'DocumentTabs$closed'
    }
  }
};