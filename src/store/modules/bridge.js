import { doBridgeRequest } from '@/api/bridge'

const bridge = {
  state: {

  },
  mutations: {

  },
  actions: {
    DoBridgeRequest({ commit }, token) {
      return new Promise((resolve, reject) => {
        doBridgeRequest(token).then((response) => {
          const data = response.data
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default bridge
