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
import Welcome from './Welcome.jsx'
import { upvote, deleteUpvote, downvote, deleteDownvote } from '../actions/post'
import { getRecentPosts, getRecentPostsSecure, getBestPostsSecure, getBestPosts } from '../actions/post'
import { Link } from 'react-router-dom'
import FontAwesome from 'react-fontawesome'
import Scroll from 'react-scroll'

import CreatePost from './CreatePost'

import DisplayPosts from './DisplayPosts'

import './styles/Home.css'

let initialState;
class Home extends Component {

  state ={
    posts: [],
    displayEditor: false,
    maxedQuery: false,
    pivot: null,
    currentCategory: 'Recents'
  }

  /**
   * When the component is mounted, we want to query the 
   * default posts to show, which are the recent ones
   */
  componentWillMount = () => {
    this.queryRecents()
  }

  /**
   * To help us with out pagination on scroll, add this listener
   * for when the user hits the bottom of the page
   */
  componentDidMount = () => {
    window.addEventListener('scroll', this.handleScroll)
  }

  /**
   * Remove the listener if the user leaves the home page
   */
  componentWillUnmount = () => {
    window.removeEventListener('scroll', this.handleScroll)    
  }

  /**
   * Switches the categories on the homepage to show the recent posts
   */
  toggleRecents = () => {
    this.setState({ posts: [], maxedQuery: false, pivot: null, currentCategory: 'Recents'})
    this.queryRecents('reset')
  }

  /**
   * Switches the categories on the homepage to show the most popular posts
   */
  toggleBest = () => {
    this.setState({ posts: [], maxedQuery: false, pivot: null, currentCategory: 'Best' })
    this.queryBest()
  }

  /**
   * Paginate on scroll when user hits the bottom of the window,
   * we want to allow the user to vote on each posts if they're
   * an authenticated user
   */
  queryRecents = pivot => {
    let newPivot
    (pivot === 'reset') ? (newPivot = null) : (newPivot = this.state.pivot)
    if(this.props.user.isAuthenticated) {
      this.props.getRecentPostsSecure(this.props.user.info.id, newPivot)
      .then(res => {
        if(res.data.length > 0) {
          const pivot = res.data[res.data.length - 1]._id
          this.setState({ posts: [...this.state.posts, ...res.data], pivot })
          return
        }
        if(res.data.length < 10) {
          this.setState({ maxedQuery: true, pivot: null })
          window.removeEventListener('scroll', this.handleScroll)
        }
      })
      .catch(err => {
        console.log(err.response)
      })
    } else {
      this.props.getRecentPosts(this.state.pivot)
      .then(res => {
        if(res.data.length > 0) {
          const pivot = res.data[res.data.length - 1]._id
          this.setState({ posts: [...this.state.posts, ...res.data], pivot })
        } else {
          if(res.data.length < 10) {
            this.setState({ maxedQuery: true, pivot: null })
            window.removeEventListener('scroll', this.handleScroll)
          }
        }
      })
      .catch(err => {
        console.log(err.response)
      })
    }
  }

  /**
   * Same functionality as queryRecents, but for Best posts
   */
  queryBest = () => {
    if(this.props.user.isAuthenticated) {
      this.props.getBestPostsSecure(this.props.user.info.id, this.state.pivot)
      .then(res => {
        if(res.data.length > 0) {
          const pivot = res.data[res.data.length - 1]._id
          this.setState({ posts: [...this.state.posts, ...res.data], pivot })
          return
        }
        if(res.data.length < 10) {
          this.setState({ maxedQuery: true })
          window.removeEventListener('scroll', this.handleScroll)
        }
      })
      .catch(err => {
        console.log(err.response)
      })
    } else {
      this.props.getBestPosts(this.state.pivot)
      .then(res => {
        if(res.data.length > 0) {
          const pivot = res.data[res.data.length - 1]._id
          this.setState({ posts: [...this.state.posts, ...res.data], pivot })
          return
        }
        if(res.data.length < 10) {
          this.setState({ maxedQuery: true })
          window.removeEventListener('scroll', this.handleScroll)
        }
      })
      .catch(err => {
        console.log(err.response)
      })
    }
  }

  /**
   * Client-side code to update the view with the new posts the
   * user just created
   */
  updatePosts = updatedPosts => {
    console.log(updatedPosts)
    this.setState({posts: updatedPosts})
  }

  /**
   * If the user clicks on the Create Post buttons
   */
  toggleEditor = () => {
    this.setState({ displayEditor: !this.state.displayEditor })
  }

  /**
   * Turns off the editor and updates the posts with the recently
   * created one
   */
  createdPost = () => {
    this.setState({ displayEditor: false })
    this.toggleRecents()
  }

  /**
   * Decide whether the user has already voted on the post, if they 
   * have already upvoted, delete the upvote and update the client.
   */
  upvote = (post, index) => {
    const user = this.props.user.info.id 
    const vote = this.state.posts[index].vote
    const data = { user, post }
    let { posts } = this.state

    if(vote === 'up') {
      this.props.deleteUpvote(data)
      .then(res => {
        posts[index].score -= 1
        posts[index].vote = 'null'
        this.setState({ posts })
        return
      })
    }
    if(vote === 'down') {
      this.props.deleteDownvote(data)
      .then(res => {
        this.props.upvote(data)
        .then(res => {
          posts[index].score += 2
          posts[index].vote = 'up'
          this.setState({posts})
          return
        })
      })
      .catch(err => {
        console.log(err.response)
      })
    }
    if(vote === 'null') {
      this.props.upvote(data)
      .then(res => {
        posts[index].score += 1
        posts[index].vote = 'up'
        this.setState({posts})
        return
      })
      .catch(err => {
        console.log(err.response.data.errors)
      })
    }
  }

  /**
   * Decides whether the user has already downvoted the post,
   * if they did, remove their vote from the post. If not,
   * subtract one from the number of votes
   */
  downvote = (post, index) => {
    const user = this.props.user.info.id 
    const vote = this.state.posts[index].vote
    const data = { user, post }
    let { posts } = this.state

    if(vote === 'down') {
      this.props.deleteDownvote(data)
      .then(res => {
        posts[index].score += 1
        posts[index].vote = 'null'
        this.setState({ posts })
        return
      })
    }
    if(vote === 'up') {
      this.props.deleteUpvote(data)
      .then(res => {
        this.props.downvote(data)
        .then(res => {
          posts[index].score = posts[index].score - 2
          posts[index].vote = 'down'
          this.setState({posts})
          return
        })
      })
      .catch(err => {
        console.log(err.response)
        console.log(err.response.data.errors)
      })
    }
    if(vote === 'null') {
      this.props.downvote(data)
      .then(res => {
        posts[index].score = posts[index].score - 1
        posts[index].vote = 'down'
        this.setState({posts})
        return
      })
      .catch(err => {
        console.log(err.response.data.errors)
      })
    }
  }

  /**
   * query more posts if the user hits the bottom of the page
   * http://blog.sodhanalibrary.com/2016/08/detect-when-user-scrolls-to-bottom-of.html#.WftmORNSyL4
   */
  handleScroll = () => {
    const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight
    const body = document.body
    const html = document.documentElement
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
    const windowBottom = windowHeight + window.pageYOffset
    windowBottom >= docHeight && this.queryRecents()
  }

  /**
   * Animate the page to scroll back up to the top page
   */
  scrollUp = () => {
    Scroll.animateScroll.scrollToTop()
  }

  render() {
    return (
      <div className='homeContainer'>
        {
          !this.props.user.isAuthenticated
          &&  <span className='guestWelcome'>
                <h1>Welcome!</h1>
                <h3>As a guest, you can browse through posts, but interactions such as creating posts can only be done by a member of the community. In order to be a part of the community, you are required to register an account using your University of Massachusetts Lowell issued e-mail address!</h3>
              </span>
        }
        {this.props.user.isAuthenticated && <Welcome />}
        {this.props.user.isAuthenticated && (
          <div className='welcomeInteractions'>
          <button onClick={this.toggleEditor} className='createPostButton'>
            <FontAwesome 
            name={this.state.displayEditor ? 'times' :'pencil'} 
            className='editPencil'/> 
            {this.state.displayEditor ?' Cancel' : ' Create Post'}
          </button>
          { this.state.displayEditor && <CreatePost createdPost={this.createdPost}/> }
        </div>
        )}
        <div className='displayContainer'>
        
        <br/>

        <span className='categoryButtons'>
          <button onClick={this.toggleRecents}>
            <FontAwesome name='clock-o'/> Recents
          </button>
          &emsp;
          <button onClick={this.toggleBest}>
          <FontAwesome name='fire'/> Best
          </button>
        </span>
        <h1>{this.state.currentCategory}</h1>

        <ul>
        {
          this.state.posts.map((post, key) => {
            return ( 
              <li key={key} className='postStyle'>
                <div style={{textDecoration: 'none', color: 'black'}}>
                <h4 className='postBody'><Link to={`/post/${post._id}`} style={{color: 'black', textDecoration: 'none'}}>{post.body}</Link></h4>   
                <span className='postFlex'>
                  <span className='postUser'>
                    <img src='https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png' alt=''/>
                    <p>{post.user.firstName}</p>                  
                  </span>

                  {
                    this.props.user.isAuthenticated
                    ? <span className='postScore'>
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
                    : <span className='postScoreGuest'>
                        <FontAwesome
                          name='fire'
                          className='fire'/>
                          <h3>{post.score}</h3>
                      </span>
                  }


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
                </div>
              </li>
            )
          })
        }
        </ul>
      </div>
      {this.state.maxedQuery && <h3>No more items to show :)</h3>}
      </div>
    )
  }
}

export default connect(mapStateToProps, { 
  upvote, 
  downvote, 
  getRecentPosts, 
  getRecentPostsSecure,
  getBestPostsSecure, 
  getBestPosts,
  deleteDownvote,
  deleteUpvote
})(Home)