/* 
 Name: Brandon Karl/ Serey Morm, brandon_karl@student.uml.edu/serey_morm@student.uml.edu
 Computer Science Department, UMass Lowell
 Comp.4610, GUI Programming I
 File: /usr/cs/2018/smorm/public_html/
 Created: 20-nov-2017
 Last updated by HL: 7-Dec-2017, 15:34
*/

import express from 'express'

import Downvote from '../models/downvote'
import Post from '../models/post'

import { asyncMiddleware } from './middleware/async'
import { validateNewVote } from '../validations/validateNewVote'

const router = express.Router()

router.post('/', asyncMiddleware(async (req, res) => {
  const { errors, isValid } = await validateNewVote(req.body.user, req.body.post, 'downvote')
  if (!isValid) return res.status(400).json({ errors: errors })

  const { user, post } = req.body
  const newDownvote = {
    user,
    post
  }

  const addedDownvote = await Downvote.create(newDownvote)
  if(addedDownvote) {
    const foundPost = await Post.findById(addedDownvote.post)
    foundPost.score -= 1
    await foundPost.save()
    return res.json(addedDownvote)
  }
}))

router.get('/post/:id', asyncMiddleware(async (req, res) => {
  const downvotes = await Downvote.find({ post: req.params.id })
  return res.json({ downvotes })
}))

router.delete('/:user/:post', asyncMiddleware(async (req, res) => {
  const { user, post } = req.params
  const deletedDownvote = await Downvote.findOne({ user, post }).remove()
  const updatedPost = await Post.findById(post)
  updatedPost.score += 1;
  await updatedPost.save()
  return res.json({ success: true })
}))

export default router