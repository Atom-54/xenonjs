/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
export const Documents = {
  DocumentTabs: {
    type: '$anewLibrary/Spectrum/Atoms/SpectrumTabPanels',
    container: 'Layout$BodyMiddle#Container',
    state: {
      closeable: true
    }
  },
  CloseService: {
    type: '$anewLibrary/Data/Atoms/ServiceAccess',
    state: {
      service: 'DocumentService',
      type: 'Close'
    },
    connections: {
      data: 'DocumentTabs$closed'
    }
  }
};