/* 
 Name: Brandon Karl/ Serey Morm, brandon_karl@student.uml.edu/serey_morm@student.uml.edu
 Computer Science Department, UMass Lowell
 Comp.4610, GUI Programming I
 File: /usr/cs/2018/smorm/public_html/
 Created: 20-nov-2017
 Last updated by HL: 7-Dec-2017, 15:34
*/

import { SET_CURRENT_USER } from '../actions/types'
import isEmpty from 'lodash/isEmpty'

const initialState = {
  isAuthenticated: false,
  user: {}
} // Start off not signed in

export default (state = initialState, action= {}) => {
  switch(action.type) {
    case SET_CURRENT_USER: // If the action is setting current user
      return {
        isAuthenticated: !isEmpty(action.user),
        info: action.user
      } // Add to redux state the user
    default: return state // Action doesnt apply
  }
}
