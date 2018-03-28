const selector = state => ({
  uri: () => state.router.location.pathname,
  isMobile: () => state.app.isMobile
})

export const getProps = fn => state => fn(selector(state))
