/**
 * auth reducer
 */
import produce from 'immer'

const initialState = {
  user: null,
  address: null,
  token: null,
}

export default function reducer(state = initialState, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case 'SET_USERINFO':
        draft.user = action.payload.user
        return
      case 'SET_ADDRESS':
        draft.address = action.payload.address
        return
      case 'SET_TOKEN':
        draft.token = action.payload.token
        return
      case 'LOG_OUT':
        draft.user = null
        draft.address = null
        draft.token = null
        return
      default:
        return state
    }
  })
}
