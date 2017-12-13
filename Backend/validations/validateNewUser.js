/* 
 Name: Brandon Karl/ Serey Morm, brandon_karl@student.uml.edu/serey_morm@student.uml.edu
 Computer Science Department, UMass Lowell
 Comp.4610, GUI Programming I
 File: /usr/cs/2018/smorm/public_html/
 Created: 20-nov-2017
 Last updated by HL: 7-Dec-2017, 15:34
*/

import validator from 'validator';

export const validateNewUser = (formData) => {
  let errors = {}
  let isValid = true;

  if (!validator.isEmail(formData.email)) {
    errors.email = 'Invalid email'
    isValid = false
  }
  if (validator.isEmpty(formData.firstName)) {
    errors.firstName = 'First name required'
    isValid = false
  }
  if (validator.isEmpty(formData.lastName)) {
    errors.lastName = 'Last name required'
    isValid = false
  }
  if (validator.isEmpty(formData.password)) {
    errors.lastName = 'Password required'
    isValid = false
  }

  return {
    errors,
    isValid
  }
}