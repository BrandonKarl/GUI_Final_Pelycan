/* 
 Name: Brandon Karl/ Serey Morm, brandon_karl@student.uml.edu/serey_morm@student.uml.edu
 Computer Science Department, UMass Lowell
 Comp.4610, GUI Programming I
 File: /usr/cs/2018/smorm/public_html/
 Created: 20-nov-2017
 Last updated by HL: 7-Dec-2017, 15:34
*/

import axios from 'axios'

const proxy = 'https://pelycan-backend.herokuapp.com'

export function createPost(data) {
  return dispatch => {
    const formData = new FormData()
    data.photos.forEach((photo, index) => [
      formData.append('photos', photo, `photo${index}.png`)
    ]) // Upload photos
    formData.append('body', data.body)
    formData.append('user', data.user)
    return axios.post(`http://localhost:4000/api/post`, formData) // Send to backend
  }
}

export function getRecentPosts(pivot) {
  return dispatch => {
    return axios.get(`${proxy}/api/post/recents/paginate/${pivot}`)
  }
}

export function getRecentPostsSecure(id, pivot) {
  return dispatch => {
    return axios.get(`${proxy}/api/post/recents/paginate/${id}/${pivot}`)
  }
}

export function getBestPosts(pivot) {
  return dispatch => {
    return axios.get(`${proxy}/api/post/best/paginate/${pivot}`)
  }
}

export function getBestPostsSecure(id, pivot) {
  return dispatch => {
    return axios.get(`${proxy}/api/post/best/paginate/${id}/${pivot}`)
  }
}


// takes user id, and posts
export function upvote(data) {
  return dispatch => {
    return axios.post(`${proxy}/api/upvotes`, data)
  }
}

export function deleteUpvote(data) {
  return dispatch => {
    return axios.delete(`${proxy}/api/upvotes/${data.user}/${data.post}`)
  }
}

// takes user id, and posts
export function downvote(data) {
  return dispatch => {
    return axios.post(`${proxy}/api/downvotes`, data)
  }
}

export function deleteDownvote(data) {
  return dispatch => {
    return axios.delete(`${proxy}/api/downvotes/${data.user}/${data.post}`)
  }
}



