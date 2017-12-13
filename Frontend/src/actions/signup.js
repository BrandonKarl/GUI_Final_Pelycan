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
import { setCurrentUser } from './login.js'

export function signup(data) {
  return dispatch => {
    return axios.post('https://pelycan-backend.herokuapp.com/api/signup', data) // Tries to add to DB
    .then(res => {
      const token = res.data.token
      localStorage.setItem('jwtToken', token)
      setAuthorizationToken(token)
      dispatch(setCurrentUser(jwt.decode(token)))
    })
  }
}