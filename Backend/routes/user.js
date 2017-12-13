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

import User from '../models/user'

import { asyncMiddleware } from './middleware/async'

const router = express.Router()

const upload = multer()
const s3 = new AWS.S3()

router.get('/:id', asyncMiddleware(async (req, res) => {
  const foundUser = await User.findById(req.params.id)
  if (foundUser) {
    return res.json(foundUser)
  }

  return res.status(404).json({ errors: 'User not found' })
}))

router.patch('/profile', upload.single('photo'), asyncMiddleware(async (req, res) => {
  const { user } = req.body
  const foundUser = await User.findById(user)
  if (foundUser) {
    const buffer = await sharp(req.file.buffer).resize(600).toBuffer()
    await s3.putObject({
      Body: buffer,
      Bucket: `ae2017/${foundUser.id}`,
      Key: `profile_picture.png`,
      ACL: 'public-read'
    }).promise()
    foundUser.profile_picture = `https://s3.amazonaws.com/ae2017/${foundUser.id}/profile_picture.png`
    
    const updatedUser = await foundUser.save()
    return res.json(updatedUser)
  }
}))

export default router