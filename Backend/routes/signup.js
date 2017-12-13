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
import { validateNewUser } from '../validations/validateNewUser'

const router = express.Router()

router.post('/', asyncMiddleware(async (req, res) => {
  const { isValid, errors } = validateNewUser(req.body)
  if (!isValid) return res.status(400).json({ errors: errors })

  const { firstName, lastName, email, password } = req.body
  const user = await User.findOne({ email })
  if (user) return res.status(422).json({ error: 'Username taken' })

  const newUser = {
    firstName,
    lastName,
    email,
    password: bcrypt.hashSync(password, 10)
  }

  const addedUser = await User.create(newUser)
  if (addedUser) {
    const token = addedUser.generateJWT()
    return res.json({ token })
  }
}))

export default router