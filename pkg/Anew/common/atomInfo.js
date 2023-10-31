export const atomInfo = {
  SpectrumButton: {
    inputs: {
      label: 'String',
    }
  },
  SpectrumCard: {
    inputs: {
      asset: 'AssetEnum', 
      heading: 'String',
      subheading: 'String', 
      horizontal: 'Boolean'
    },
    types: {
      AssetEnum: ['file', 'folder']
    }
  }
};