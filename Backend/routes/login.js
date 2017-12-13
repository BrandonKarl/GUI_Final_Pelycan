/* 
 Name: Brandon Karl/ Serey Morm, brandon_karl@student.uml.edu/serey_morm@student.uml.edu
 Computer Science Department, UMass Lowell
 Comp.4610, GUI Programming I
 File: /usr/cs/2018/smorm/public_html/
 Created: 20-nov-2017
 Last updated by HL: 7-Dec-2017, 15:34
*/

import express from 'express'
import bcrypt from 'bcrypt'

import User from '../models/user'

import { asyncMiddleware } from './middleware/async'

const router = express.Router()

router.post('/', asyncMiddleware(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (user) {
    if (bcrypt.compareSync(password, user.password)) {
      const token = user.generateJWT()
      return res.json({ token })
    }
  }

  return res.status(404).json({ errors: 'Invalid Credentials' })
}))

export default router

