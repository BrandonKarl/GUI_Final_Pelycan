/* 
 Name: Brandon Karl/ Serey Morm, brandon_karl@student.uml.edu/serey_morm@student.uml.edu
 Computer Science Department, UMass Lowell
 Comp.4610, GUI Programming I
 File: /usr/cs/2018/smorm/public_html/
 Created: 20-nov-2017
 Last updated by HL: 7-Dec-2017, 15:34
*/

import validator from 'validator'

import User from '../models/user'

export const validateNewPost = async (formData) => {
  let errors = {}
  let isValid = true;

  if (validator.isEmpty(formData.body)) {
    errors.body = 'Body can not be empty'
    isValid = false
  }
  
  const foundUser = await User.findById(formData.user)
  if (foundUser) {
  } else {
    errors.user = 'User posting was not found'
    isValid = false
  }

  console.log(errors, isValid)
  
  return {
    errors,
    isValid
  }
}