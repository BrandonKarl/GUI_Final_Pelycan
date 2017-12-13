/* 
 Name: Brandon Karl/ Serey Morm, brandon_karl@student.uml.edu/serey_morm@student.uml.edu
 Computer Science Department, UMass Lowell
 Comp.4610, GUI Programming I
 File: /usr/cs/2018/smorm/public_html/
 Created: 20-nov-2017
 Last updated by HL: 7-Dec-2017, 15:34
*/

import Upvote from '../models/upvote'
import Downvote from '../models/downvote'

export const validateNewVote = async (user, post, type) => {
  let errors = {}
  let isValid = true;
  
  if (type === 'upvote') {
    const foundUpvote = await Upvote.findOne({ user, post })
    if (foundUpvote) {
      errors.upvote = 'Can not upvote a post twice'
      isValid = false
    }
  }
  else if (type === 'downvote') {
    const foundDownvote = await Downvote.findOne({ user, post })
    if (foundDownvote) {
      errors.downvote = 'Can not downvote a post twice'
      isValid = false
    }
  }

  return {
    errors,
    isValid
  }
}