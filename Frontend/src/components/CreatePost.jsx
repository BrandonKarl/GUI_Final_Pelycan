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
import Dropzone from 'react-dropzone'
import FontAwesome from 'react-fontawesome'
import { createPost } from '../actions/post'
import { DoubleBounce } from 'better-react-spinkit'

import mapStateToProps from '../utils/redux'

import './styles/CreatePost.css'

class CreatePost extends Component {
  state = {
    body: '',
    photos: [],
    maxPhotos: false,
    isLoading: false
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  /**
   * POST request to make the post
   */
  createPost = event => {
    event.preventDefault()
    this.setState({ isLoading: true })
    if(this.state.body !== '') {
      const { body, photos } = this.state
      const user = this.props.user.info.id
      console.log({ body, photos, user})
      this.props.createPost({ body, photos, user})
      .then(res => {
        this.setState({ isLoading: false })
        this.props.createdPost()
      })
    } else {
      let errors = { post: 'Failed to create post' }
      this.setState({ errors })
    }
  }

  /**
   * Handles image drop/upload
   */
  onDrop = (acceptedFiles, rejectedFiles) => {
    let photos = [...this.state.photos, ...acceptedFiles]

    if(photos.length > 4) {
      photos = photos.splice(0, 4)
      this.setState({ maxPhotos: true, photos })
    } else {
      this.setState({ maxPhotos: false, photos})
    }
  }

  render() {
    return (
      <div className='createPostContainer'>
        <br/>
        {this.state.isLoading
          ? <span className='postLoading'>
              <DoubleBounce size={50} color='#EE748C'/>
            </span>
          : <span>
              <form className='createPostForm'>
              <textarea
                type='text'
                name='body'
                placeholder='Type something'
                value={this.state.body}
                onChange={this.onChange}
              />
              <Dropzone
                disabled={this.state.maxPhotos ? true : false}
                onDrop={this.onDrop}
                accept='image/*'
                name='dropzone'
                className='dropzoneStyle'
                activeClassName='dropzoneActive'
                multiple>
                <span>
                  {this.state.photos.length > 0
                    ? this.state.photos.map((photo, key) => {
                        return (
                          <img 
                          src={photo.preview} 
                          alt='' 
                          key={key}
                          className='previewCrop'/>
                        )
                      })
                    
                    : <FontAwesome name='picture-o' />
                  }
                </span>
              </Dropzone>
            </form>
            <button onClick={this.createPost} className='createPostButton'>
              <FontAwesome name='check' />
              &nbsp;Create Post
            </button>
            </span>
        }
      </div>
    )
  }
}

export default connect(mapStateToProps, { createPost})(CreatePost)