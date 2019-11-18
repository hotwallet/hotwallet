export default state => ({

  getAssets() {
    const assets = state.get('assets')
    const symbols = this.getSymbols()
    return symbols.map(symbol => assets[symbol])
  },

  getSymbols({ sort = 'marketCap' } = {}) {
    const assets = state.get('assets')
    return Object.keys(assets).sort((a, b) => assets[b][sort] - assets[a][sort])
  }

})
