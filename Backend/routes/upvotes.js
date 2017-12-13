/* 
 Name: Brandon Karl/ Serey Morm, brandon_karl@student.uml.edu/serey_morm@student.uml.edu
 Computer Science Department, UMass Lowell
 Comp.4610, GUI Programming I
 File: /usr/cs/2018/smorm/public_html/
 Created: 20-nov-2017
 Last updated by HL: 7-Dec-2017, 15:34
*/

import express from 'express'

import Upvote from '../models/upvote'
import Post from '../models/post'

import { asyncMiddleware } from './middleware/async'
import { validateNewVote } from '../validations/validateNewVote'

const router = express.Router()

router.post('/', asyncMiddleware(async (req, res) => {
  const { errors, isValid } = await validateNewVote(req.body.user, req.body.post, 'upvote')
  if (!isValid) return res.status(400).json({ errors: errors })

  const { user, post } = req.body
  const newUpvote = {
    user,
    post
  }

  const addedUpvote = await Upvote.create(newUpvote)
  if(addedUpvote) {
    const foundPost = await Post.findById(addedUpvote.post)
    foundPost.score += 1
    await foundPost.save()
    return res.json(addedUpvote)
  }
}))

router.get('/post/:id', asyncMiddleware(async (req, res) => {
  const upvotes = await Upvote.find({ post: req.params.id })
  return res.json({ upvotes })
}))

router.delete('/:user/:post', asyncMiddleware(async (req, res) => {
  const { user, post } = req.params
  const deletedUpvote = await Upvote.findOne({ user, post }).remove()
  const updatedPost = await Post.findById(post)
  updatedPost.score -= 1;
  await updatedPost.save()
  return res.json({ success: true })
}))

export default router