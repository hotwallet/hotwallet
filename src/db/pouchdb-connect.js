import React from 'react'

export default function connect(db) {
  const changes = db.changes({
    since: 'now',
    live: true,
    include_docs: true
  })
  return (getData, shouldUpdate) => {
    return Component => {
      return class extends React.Component {
        componentDidMount() {
          Promise.resolve().then(() => getData(this.props)).then(data => this.setState(data))
          changes.on('change', async change => {
            const { doc } = change
            change.isInsert = doc._rev.substring(0, 2) === '1-'
            if (!change.isInsert) {
              const revs = await db.get(doc._id, {
                revs_info: true,
                revs: true
              })
              const rev = revs._revs_info[1].rev
              change.previousDoc = await db.get(doc._id, { rev })
            }
            change.affects = function (selector) {
              const isAffected = Object.keys(selector).some(property => {
                const value = selector[property]
                // TODO: support for $ mango operators
                if (typeof value === 'object') return true
                if (change.doc[property] === value) return true
                if (change.previousDoc && change.previousDoc[property] === value) return true
                return false
              })
              return isAffected
            }
            change.toggles = function (property) {
              if (change.doc[property] !== undefined && !change.previousDoc) return true
              if (!!change.doc[property] && change.previousDoc && !change.previousDoc[property]) return true
              if (!change.doc[property] && change.previousDoc && !!change.previousDoc[property]) return true
              return false
            }
            shouldUpdate(change, this.state) && Promise.resolve().then(() => getData(this.props)).then(data => this.setState(data))
          })
        }

        componentWillUnmount() {
          changes.cancel()
        }

        render() {
          return React.createElement(Component, { ...this.props, ...this.state })
        }
      }
    }
  }
}
