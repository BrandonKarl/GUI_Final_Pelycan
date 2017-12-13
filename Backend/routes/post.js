/* 
 Name: Brandon Karl/ Serey Morm, brandon_karl@student.uml.edu/serey_morm@student.uml.edu
 Computer Science Department, UMass Lowell
 Comp.4610, GUI Programming I
 File: /usr/cs/2018/smorm/public_html/
 Created: 20-nov-2017
 Last updated by HL: 7-Dec-2017, 15:34
*/

import express from 'express'
import multer from 'multer'
import sharp from 'sharp'
import AWS from 'aws-sdk'

import Post from '../models/post'
import Comment from '../models/comment'
import Upvote from '../models/upvote'
import Downvote from '../models/downvote'

import { asyncMiddleware } from './middleware/async'
import { validateNewPost } from '../validations/validateNewPost'

const router = express.Router()

const upload = multer()
const s3 = new AWS.S3()

router.post('/', upload.array('photos'), asyncMiddleware(async (req, res) => {
  const { errors, isValid } = await validateNewPost(req.body)
  if (!isValid) return res.status(400).json({ errors: errors })

  const { body, user } = req.body
  const newPost = {
    body,
    user
  }

  const addedPost = await Post.create(newPost)
  if (addedPost) {
    addedPost.photos = await Promise.all(req.files.map(async (image, key) => {
      const buffer = await sharp(image.buffer).resize(600).toBuffer()
      await s3.putObject({
        Body: buffer,
        Bucket: `ae2017/${addedPost.user}/posts/${addedPost.id}`,
        Key: `photo${key}.png`,
        ACL: 'public-read'
      }).promise()
      return `https://s3.amazonaws.com/ae2017/${addedPost.user}/posts/${addedPost.id}/photo${key}.png`
    }))

    const updatedPost = await addedPost.save()
    return res.json(updatedPost)
  }
}))

router.get('/recents', asyncMiddleware(async (req, res) => {
  const recents = await Post.find({}).limit(10).sort({ _id: -1 }).populate('user')
  return res.json(recents)
}))

router.get('/recents/paginate/:pivot', asyncMiddleware(async (req, res) => {
  let recents
  if(req.params.pivot === 'null')
    recents = await Post.find({}).limit(10).sort({ _id: -1 }).populate('user')
  else {
    recents = await Post.find({_id: {'$lt': req.params.pivot}}).sort({_id: -1}).populate('user').limit(10)
  }
  return res.json(recents)
}))

router.get('/recents/paginate/:id/:pivot', asyncMiddleware(async (req, res) => {
  let recents
  if(req.params.pivot === 'null')
    recents = await Post.find({}).limit(10).sort({ _id: -1 }).populate('user')
  else {
    recents = await Post.find({_id: {'$lt': req.params.pivot}}).sort({_id: -1}).populate('user').limit(10)
  }
  let arr = []
  for (let post of recents) {
    const upvote = await Upvote.findOne({ post: post.id, user: req.params.id })
    if (upvote) {
      const updatedPost = {
        _id: post._id,
        body: post.body,
        photos: post.photos,
        score: post.score,
        user: post.user,
        vote: 'up'
      }
      arr.push(updatedPost)
    }
    else {
      const downvote = await Downvote.findOne({ post: post.id, user: req.params.id })
      if (downvote) {
        const updatedPost = {
          _id: post._id,
          body: post.body,
          photos: post.photos,
          score: post.score,
          user: post.user,
          vote: 'down'
        }
        arr.push(updatedPost)
      } else {
        const updatedPost = {
          _id: post._id,
          body: post.body,
          photos: post.photos,
          score: post.score,
          user: post.user,
          vote: 'null'
        }
        arr.push(updatedPost)
      }
    }
  }
  return res.json(arr)
}))

router.get('/best/paginate/:pivot', asyncMiddleware(async (req, res) => {
  // let recents
  // if(req.params.pivot === 'null')
  //   recents = await Post.find({}).limit(10).sort({ score: -1 }).populate('user')
  // else {
  //   recents = await Post.find({_id: {'$lt': req.params.pivot}}).sort({score: -1}).populate('user').limit(10)
  // }
  const recents = await Post.find({}).limit(10).sort({ score: -1 }).populate('user')
  return res.json(recents)
}))

router.get('/best/paginate/:id/:pivot', asyncMiddleware(async (req, res) => {
  // let recents
  // if(req.params.pivot === 'null')
  //   recents = await Post.find({}).limit(10).sort({ score: -1 }).populate('user')
  // else 
  //   recents = await Post.find({_id: {'$lt': req.params.pivot}}).sort({score: -1}).populate('user').limit(10)
  let arr = []
  const recents = await Post.find({}).limit(10).sort({ score: -1 }).populate('user')
  console.log(recents)
  for (let post of recents) {
    const upvote = await Upvote.findOne({ post: post.id, user: req.params.id })
    if (upvote) {
      const updatedPost = {
        _id: post._id,
        body: post.body,
        photos: post.photos,
        score: post.score,
        user: post.user,
        vote: 'up'
      }
      arr.push(updatedPost)
    }
    else {
      const downvote = await Downvote.findOne({ post: post.id, user: req.params.id })
      if (downvote) {
        const updatedPost = {
          _id: post._id,
          body: post.body,
          photos: post.photos,
          score: post.score,
          user: post.user,
          vote: 'down'
        }
        arr.push(updatedPost)
      } else {
        const updatedPost = {
          _id: post._id,
          body: post.body,
          photos: post.photos,
          score: post.score,
          user: post.user,
          vote: 'null'
        }
        arr.push(updatedPost)
      }
    }
  }
  return res.json(arr)
}))

router.get('/:id', asyncMiddleware(async (req, res) => {
  const foundPost = await Post.findById(req.params.id).populate('user')
  if (foundPost) {
    const foundComments = await Comment.find({ post: foundPost._id}).populate('user')
    if(foundComments){
      console.log(foundComments)
      const data = {
        _id: foundPost._id,
        photos: foundPost.photos,
        body: foundPost.body,
        score: foundPost.score,
        user: foundPost.user,
        comments: foundComments
      }

      return res.json(data)
    }
  }
  return res.status(404).json({ errors: 'Post not found' })
}))

router.get('/user/:id', asyncMiddleware(async (req, res) => {
  const foundPost = await Post.find({user: req.params.id}).sort({_id: -1})
  if (foundPost) {
    return res.json(foundPost)
  }

  return res.status(404).json({ errors: 'Post not found' })
}))

router.delete('/', asyncMiddleware(async (req, res) => {
  const { post } = req.body
  const deletePost = Post.findById(post).remove()
  const deleteComments = Comment.find({ post }).remove()
  const deleteUpvotes = Upvote.find({ post }).remove()
  const deleteDownvotes = Downvote.find({ post }).remove()

  await Promise.all([deletePost, deleteComments, deleteUpvotes, deleteDownvotes])
  return res.json({ success: true })
}))

export default router