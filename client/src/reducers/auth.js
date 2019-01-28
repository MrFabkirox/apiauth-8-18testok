import { AUTH_SIGN_UP, AUTH_ERROR } from '../actions/types'

const DEFAULT_STATE = {

  isAuthenticated: false,
  token: '',
  errorMessage: ''

}

export default (state = DEFAULT_STATE, action) => {
  switch(action.type) {
    
    case AUTH_SIGN_UP:
      console.log('authreducer got a auth_sign_up action')
      return {
        ...state,
        token: action.payload,
        isAuthenticated: true,
        errorMessage: ''
      }

      case AUTH_ERROR:
        console.log('authreducer got a auth_error action')
        return {
          ...state,
          errorMessage: action.payload
        }

      default:
        return state

  }

}
