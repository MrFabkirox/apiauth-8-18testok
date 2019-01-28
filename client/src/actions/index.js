import axios from 'axios'
import { AUTH_SIGN_UP, AUTH_ERROR } from './types'

/* actionCreators ->
  create actions ({ }) ->
  dispatched ->
  middlewares ->
  reducers */

export const signUp = data => {

    // 1. use data for http call to the backend
    // 2. receive backend response with jwt
    // 3. dispatch user that has just signed with jwt
    // 4. save the jwt in local storage

  return async dispatch => {

    try {
      
      console.log('res in action creation signup')
      const res = await axios.post('http://localhost:5000/users/signup', data)
      console.log('res in action dispatched signup', res)

      dispatch({
        type: AUTH_SIGN_UP,
        payload: res.data.token
      })

      localStorage.setItem('JWT_TOKEN', res.data.token)
    } catch (error) {
      dispatch({
        type: AUTH_ERROR,
        payload: 'Email is already in use'
      })
      
      console.log('error in index action for signup', error)
    }

  }
}
