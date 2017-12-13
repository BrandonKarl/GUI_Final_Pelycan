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
import Modal from 'react-modal'

import mapStateToProps from '../utils/redux'

import './styles/Post.css'

class Post extends Component {
  state = {
    post: {
      user: {
        firstName: '',
        lastName: ''
      },
      comments: [],
      photos: []
    },
    hasPicture: false,
    comment: '',
    modal: false,
    modalContent: ''
  }

  /**
   * GET request to fetch posts
   */
  componentWillMount = () => {
    const postId = this.props.match.params[0]
    axios.get(`http://localhost:4000/api/post/${postId}`)
    .then(res => {
      if(res.data.user.profile_picture !== '') {
        this.setState({ hasPicture: true, post: res.data })
      } else {
        this.setState({ post: res.data })        
      } 
    })
    .catch(err => {
      console.log(err)
    })
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  /**
   * Post request to add comments
   */
  addComment = () => {
    if(this.state.comment === '') return
    const data = { 
      body: this.state.comment, 
      user:this.props.user.info.id,
      post: this.props.match.params[0] 
    }
    axios.post('http://localhost:4000/api/comment', data)
    .then(res => {
      const newComment = {
        body: res.data.body,
        user: {
          firstName: this.props.user.info.firstName,
          lastname: this.props.user.info.lastName
        }
      }
      const { post } = this.state
      post['comments'] = [...this.state.post.comments, newComment]
      this.setState({ post, comment: '' })
    })
    .catch(err => {
      console.log(err)
    })
  }

  /**
   * Open modal to enlarge image
   */
  openImage = index => {
    this.setState({ modalContent: this.state.post.photos[index]})
    this.toggleModal()
  }

  /**
   * Toggles the modal to display image
   */
  toggleModal = () => {
    this.setState({modal: !this.state.modal})
  }

  render() {
    return (
      <div className='postContainer'>
        <br/><br/>
        <div className='postContent'>
          <span className='postUser'>
            {this.state.hasPicture
              ? <img src={this.state.post.user.profile_picture} alt='profile'/>
              : <span className='profileBubble'>{this.state.post.user.firstName ? this.state.post.user.firstName[0] : 'G'}</span>
            }
            <br/><br/>
            <h3>{this.state.post.user.firstName} {this.state.post.user.lastName}</h3>
            <hr/>
          </span>
          <span className='postBody'>
            <h2>{this.state.post.body}</h2>
          </span>
          <div className='postImageContainer'>
              { this.state.post.photos.length > 0
                &&           
                  <div className='postImageContent'>
                    {this.state.post.photos.map((photo, key) => {
                      return <img key={key} src={photo} alt='' onClick={() => this.openImage(key)}/>
                    })}
                  </div>
              }
          </div>
          <br/> <br/>
          <ul className='postComments'>
            {this.state.post.comments.length > 0
              && 
              (<div className='postCommentsContent'>
                <h2>Comments</h2>
                {this.state.post.comments.map((comment, key) => {
                  return <li key={key}>
                    <Link to={`/profile/${comment.user._id}`} style={{textDecoration: 'none'}}>
                      {comment.user.firstName}
                    </Link>: {comment.body}
                    </li>
                })}
              </div>
              )
            }
          </ul>
          <br/>
          <div className='addCommentField'>
            <input
              type='text'
              name='comment'
              value={this.state.comment}
              onChange={this.onChange}
              placeholder='Message'/>
            <button
              onClick={this.addComment}>
              <FontAwesome name='pencil'/>&ensp;Comment
            </button>
          </div>
        </div>        
        <Modal
            isOpen={this.state.modal}
            className={{base: 'modalStyle'}}
            onRequestClose={() => {this.setState({ modal: false, modalContent: ''})}}>
            <span className='modalImg'>
              <img src={this.state.modalContent} alt=''/>
            </span>
        </Modal>
      </div>
    )
  }
}

export default connect(mapStateToProps)(Post)