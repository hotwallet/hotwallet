import { v4 } from 'uuid'

const id = v4()
let lastSave, lastId

let db, started

const openDB = async () => {
  return new Promise(
    (resolve, reject) => {
      db = db || (db = window.indexedDB.open('tarragon'))

      if (started) {
        resolve(db.result)
      }

      db.onupgradeneeded = (event) => {
        let db = event.target.result
        db.createObjectStore('reduxStore')
      }

      db.onerror = (event) => {
        console.error('IndexedDB error', event.target)
        reject(new Error('IndexedDB error:' + event.target))
      }

      db.onsuccess = (event) => {
        started = true
        resolve(db.result)
      }
    }
  )
}

export const loadState = async () => {
  const db = await openDB()

  return new Promise(
    (resolve, reject) => {
      const transaction = db.transaction(['reduxStore'])
      const objectStore = transaction.objectStore('reduxStore')
      const request = objectStore.get('state')

      request.onerror = (event) => {
        console.log('loadState error', event.target)
        resolve()
      }

      request.onsuccess = (event) => {
        if (request.result) {
          lastSave = request.result.saveTime
          lastId = request.result.lastId
        }
        resolve(request.result && request.result.state)
      }
    })
}

export const saveState = async (state) => {
  const db = await openDB()

  return new Promise(
    (resolve, reject) => {
      const transaction = db.transaction(['reduxStore'], 'readwrite')
      const saveTime = Date.now()

      transaction.onerror = (event) => {
        reject(event.target)
      }

      transaction.oncomplete = (event) => {
        resolve(true)
      }

      const objectStore = transaction.objectStore('reduxStore')

      const request = objectStore.get('state')

      request.onerror = (event) => {
        continueSave()
      }

      request.onsuccess = (event) => {
        if (request.result) {
          if (lastSave !== request.result.saveTime || lastId !== request.result.lastId) {
            resolve(false)
            return
          }
        }
        continueSave()
      }

      const continueSave = () => {
        objectStore.put({id, saveTime, state}, 'state')
        lastSave = saveTime
      }
    }
  )
}

export const isSupported = () => {
  return 'indexedDB' in window
}

export default {
  isSupported,
  loadState,
  saveState
}
