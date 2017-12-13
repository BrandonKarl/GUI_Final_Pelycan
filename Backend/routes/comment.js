/* 
 Name: Brandon Karl/ Serey Morm, brandon_karl@student.uml.edu/serey_morm@student.uml.edu
 Computer Science Department, UMass Lowell
 Comp.4610, GUI Programming I
 File: /usr/cs/2018/smorm/public_html/
 Created: 20-nov-2017
 Last updated by HL: 7-Dec-2017, 15:34
*/

import express from 'express'

import Comment from '../models/comment'

import { asyncMiddleware } from './middleware/async'
import { validateNewComment } from '../validations/validateNewComment'

const router = express.Router()

router.post('/', asyncMiddleware(async (req, res) => {
  const { errors, isValid } = await validateNewComment(req.body)
  if (!isValid) return res.status(400).json({ errors: errors })

  const { body, user, post } = req.body
  const newComment = {
    body,
    user,
    post
  }

  const addedComment = await Comment.create(newComment)
  if (addedComment) {
    return res.json(addedComment)
  }
}))

router.get('/post/:id', asyncMiddleware(async (req, res) => {
  const comments = await Comment.find({ post: req.params.id })
  if (comments) {
    return res.json(comments)
  }
}))

router.delete('/', asyncMiddleware(async (req, res) => {
  const { comment } = req.body
  const deletedComment = await Comment.findById(comment).remove()
  return res.json({ success: true })
}))

export default router

