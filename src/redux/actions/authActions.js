/**
 * auth actions
 */

export const setUserInfo = (user) => {
  return {
    type: 'SET_USERINFO',
    payload: { user },
  }
}

export const setAddress = (address) => {
  return {
    type: 'SET_ADDRESS',
    payload: { address },
  }
}


export const setToken = (token) => {
  return {
    type: 'SET_TOKEN',
    payload: { token },
  }
}

export const Logut = () => {
  return { type: 'LOG_OUT' }
}