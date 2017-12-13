/* 
 Name: Brandon Karl/ Serey Morm, brandon_karl@student.uml.edu/serey_morm@student.uml.edu
 Computer Science Department, UMass Lowell
 Comp.4610, GUI Programming I
 File: /usr/cs/2018/smorm/public_html/
 Created: 20-nov-2017
 Last updated by HL: 7-Dec-2017, 15:34
*/

import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bluebird from 'bluebird'
import path from 'path'
import cors from 'cors'

import signup from './routes/signup'
import login from './routes/login'
import post from './routes/post'
import user from './routes/user'
import upvotes from './routes/upvotes'
import downvotes from './routes/downvotes'
import comment from './routes/comment'

const app = express()
dotenv.config({ path: path.join(__dirname, '/.env') })
const PORT = process.env.PORT || '4000'

app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(bodyParser.text())

mongoose.Promise = bluebird
mongoose.connect(process.env.MONGOOSE_CONNECT, { useMongoClient: true })
mongoose.connection.on('error', (err) => {
  console.error(`FAILED TO CONNECT TO DB 🙃 ${err.message}. Make sure you have a .env file.`)
  process.exit(126)
})

app.get('/', (req, res) => { res.send('Home Route /') })
app.use('/api/signup', signup)
app.use('/api/login', login)
app.use('/api/post', post)
app.use('/api/user', user)
app.use('/api/upvotes', upvotes)
app.use('/api/downvotes', downvotes)
app.use('/api/comment', comment)

app.listen(PORT, () => {
  console.log(`Server Started at port 4000`)
})