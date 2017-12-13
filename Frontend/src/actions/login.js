/* 
 Name: Brandon Karl/ Serey Morm, brandon_karl@student.uml.edu/serey_morm@student.uml.edu
 Computer Science Department, UMass Lowell
 Comp.4610, GUI Programming I
 File: /usr/cs/2018/smorm/public_html/
 Created: 20-nov-2017
 Last updated by HL: 7-Dec-2017, 15:34
*/

import axios from 'axios'
import setAuthorizationToken from '../api/setAuth'
import jwt from 'jsonwebtoken'
import { SET_CURRENT_USER } from './types.js'

export function setCurrentUser(user) {
  return {
    type: SET_CURRENT_USER,
    user
  }
}

export function login(data) {
  return dispatch => {
    return axios.post('https://pelycan-backend.herokuapp.com/api/login', data)
    .then(res => { // Got token, else do nothing
      const token = res.data.token
      localStorage.setItem('jwtToken', token) // Add token to local storage
      setAuthorizationToken(token) // Add token to header of HTTP requests
      dispatch(setCurrentUser(jwt.decode(token))) // Send action to reducers with correct type
    })
  }
}

export function logout() {
  return dispatch => {
    localStorage.removeItem('jwtToken')
    setAuthorizationToken(false)
    dispatch(setCurrentUser({}))
  }
}