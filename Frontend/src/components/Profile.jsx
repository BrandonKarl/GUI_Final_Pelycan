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
import axios from 'axios'
import FontAwesome from 'react-fontawesome'
import { Link } from 'react-router-dom'

import mapStateToProps from '../utils/redux'

import './styles/Profile.css'
const proxy = 'https://pelycan-backend.herokuapp.com'

class Profile extends Component {

  state = {
    hasPicture: false,
    profilePicture: '',
    posts: [],
    fullName: ''
  }

  /**
   * Checks if the user is authenticated, if they are
   * GET request to get their posts
   */
  componentWillMount = () => {
    const userId = this.props.match.params[0]
    if(userId){
      axios.get(`${proxy}/api/user/${userId}`)
      .then(res => {
        const { profile_picture } = res.data
        const fullName = `${res.data.firstName} ${res.data.lastName}`

        if(profile_picture.length > 2 ) {
          this.setState({ hasPicture: true, profile_picture })
        }
  
        axios.get(`${proxy}/api/post/user/${userId}`)
        .then(res => {
          this.setState({ posts: res.data, fullName })
        })
      })
    } else {
      axios.get(`${proxy}/api/user/${this.props.user.info.id}`)
      .then(res => {
        const { profile_picture } = res.data
        const fullName = `${res.data.firstName} ${res.data.lastName}`
  
        if(profile_picture.length > 2 ) {
          this.setState({ hasPicture: true, profile_picture })
        }
  
        axios.get(`${proxy}/api/post/user/${this.props.user.info.id}`)
        .then(res => {
          this.setState({ posts: res.data, fullName })
        })
      })
    }
  }
  
  render() {
    return (
      <div className='profileContainer'>
        <br/><br/><br/>
        <div className='profileContent'>
          <span className='profileBubble'>
            {this.props.user.info.firstName[0]}
          </span>
          <br/><br/>
          <h3>{this.state.fullName}</h3>
        </div>

        <div className='userPosts'>
        <h1>Recent posts</h1>
        <hr/>
        {
          this.state.posts.map((post, key) => {
            return ( 
              <li key={key} className='postStyle'>
                <h4 className='postBody'>
                  <Link to={`/post/${post._id}`} style={{color: 'black', textDecoration: 'none'}}>
                    {post.body}
                  </Link>
                </h4>   
                <span className='postFlex'>

                  <span className='postScore'>
                    <h3><FontAwesome name='fire'/> {post.score}</h3>
                  </span>

                  <span className='postPhotos'>
                    {post.photos.length > 0
                      && <div><FontAwesome name='picture-o'/> {post.photos.length}</div>
                    }
                  </span>

                </span>
              </li>
            )
          })
        }
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps)(Profile)