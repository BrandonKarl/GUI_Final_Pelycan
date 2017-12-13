/* 
 Name: Brandon Karl/ Serey Morm, brandon_karl@student.uml.edu/serey_morm@student.uml.edu
 Computer Science Department, UMass Lowell
 Comp.4610, GUI Programming I
 File: /usr/cs/2018/smorm/public_html/
 Created: 20-nov-2017
 Last updated by HL: 7-Dec-2017, 15:34
*/

import React, { Component } from 'react'
import { connect } from 'react-redux' 
import mapStateToProps from '../utils/redux'
import FontAwesome from 'react-fontawesome'
import { upvote, deleteUpvote, downvote, deleteDownvote } from '../actions/post'
import { getRecentPosts, getRecentPostsSecure } from '../actions/post'

import './styles/DisplayPosts.css'
class DisplayPosts extends Component {

  state = {
    posts: []
  }

  
  upvote = (post, index) => {
    const user = this.props.user.info.id 
    const vote = this.props.posts[index].vote
    const data = { user, post }
    let { posts } = this.props

    if(vote === 'up') return
    if(vote === 'down') {
      console.log('clicked upvote, already downvoted')
      this.props.deleteDownvote(data)
      .then(res => {
        this.props.upvote(data)
        .then(res => {
          posts[index].score += 2
          posts[index].vote = 'up'
          this.props.updatePosts(posts)
          return
        })
      })
      .catch(err => {
        console.log(err.response)
      })
    }
    if(vote === 'null') {
      console.log('vote empty, now upvoting')
      this.props.upvote(data)
      .then(res => {
        posts[index].score += 1
        posts[index].vote = 'up'
        this.props.updatePosts(posts)
        return
      })
      .catch(err => {
        console.log(err.response.data.errors)
      })
    }
  }

  componentWillReceiveProps = (nextProps) => {
    console.log(nextProps)
    this.setState({ posts: nextProps.posts })
  }

  downvote = (post, index) => {
    const user = this.props.user.info.id 
    const vote = this.props.posts[index].vote
    const data = { user, post }
    let { posts } = this.props

    if(vote === 'down') return
    if(vote === 'up') {
      console.log('clicked downvote, already upvoted')
      this.props.deleteUpvote(data)
      .then(res => {
        this.props.downvote(data)
        .then(res => {
          posts[index].score = posts[index].score - 2
          posts[index].vote = 'down'
          this.props.updatePosts(posts)
          return
        })
      })
      .catch(err => {
        console.log(err.response)
        console.log(err.response.data.errors)
      })
    }
    if(vote === 'null') {
      console.log('vote empty, now downvoting')
      this.props.downvote(data)
      .then(res => {
        posts[index].score = posts[index].score - 1
        posts[index].vote = 'down'
        this.props.updatePosts(posts)
        return
      })
      .catch(err => {
        console.log(err.response.data.errors)
      })
    }
  }
  render() {

    return (
      <div className='displayContainer'>
        <ul>   
        {
          this.state.posts.map((post, key) => {
            return ( 
              <li key={key} className='postStyle'>
                <h4 className='postBody'>{post.body}</h4>   
                <span className='postFlex'>
                  <span className='postUser'>
                    <img src='https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png' alt=''/>
                    <p>{post.user.firstName}</p>                  
                  </span>

                  <span className='postScore'>
                    <FontAwesome 
                    name='thumbs-down' 
                    className='thumbs' 
                    style={{color: post.vote === 'down' && 'red'}}
                    onClick={() => this.downvote(post._id, key)}/>
                    <h3>{post.score}</h3>
                    <FontAwesome 
                    name='thumbs-up'
                    className='thumbs' 
                    style={{color: post.vote === 'up' && 'lightgreen'}}
                    onClick={() => this.upvote(post._id, key)}/>
                  </span>

                  <span className='postPhotos'>
                    {post.photos.length > 0
                      && post.photos.map((photo, key) => {
                        return (
                          <img 
                          src={photo}
                          alt=''
                          key={key}/>
                        )
                      })
                    }
                  </span>

                </span>
              </li>
            )
          })
        }
        </ul>
      </div>
    )
  }
}

export default connect(mapStateToProps, { 
  upvote, 
  downvote, 
  getRecentPosts, 
  getRecentPostsSecure,
  deleteDownvote,
  deleteUpvote
})(DisplayPosts)