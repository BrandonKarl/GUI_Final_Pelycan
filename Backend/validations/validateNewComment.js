/* 
 Name: Brandon Karl/ Serey Morm, brandon_karl@student.uml.edu/serey_morm@student.uml.edu
 Computer Science Department, UMass Lowell
 Comp.4610, GUI Programming I
 File: /usr/cs/2018/smorm/public_html/
 Created: 20-nov-2017
 Last updated by HL: 7-Dec-2017, 15:34
*/

import validator from 'validator'

export const validateNewComment = async (comment) => {
  let errors = {}
  let isValid = true;

  if (validator.isEmpty(comment.body)) {
    errors.body = 'Body can not be empty'
    isValid = false
  }

  return {
    errors, 
    isValid
  }
}