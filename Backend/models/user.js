/* 
 Name: Brandon Karl/ Serey Morm, brandon_karl@student.uml.edu/serey_morm@student.uml.edu
 Computer Science Department, UMass Lowell
 Comp.4610, GUI Programming I
 File: /usr/cs/2018/smorm/public_html/
 Created: 20-nov-2017
 Last updated by HL: 7-Dec-2017, 15:34
*/

import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({ // What each user will look like
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, default: '' },
  profile_picture: { type: String, default: '' },
}, { timestamps: true })

userSchema.methods.generateJWT = function generateJWT() {
  return jwt.sign({
    id: this.id,
    firstName: this.firstName,
    lastName: this.lastName
  }, process.env.JWT_SECRET, { expiresIn: '10d' })
}

export default mongoose.model('User', userSchema)
