/* 
 Name: Brandon Karl/ Serey Morm, brandon_karl@student.uml.edu/serey_morm@student.uml.edu
 Computer Science Department, UMass Lowell
 Comp.4610, GUI Programming I
 File: /usr/cs/2018/smorm/public_html/
 Created: 20-nov-2017
 Last updated by HL: 7-Dec-2017, 15:34
*/

import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware, compose } from 'redux'
import jwt from 'jsonwebtoken'

// User functions
import { setCurrentUser } from './actions/login.js'
import setAuthorizationToken from './api/setAuth'

// Redux
import rootReducer from './reducers/rootReducer'
import { Provider } from 'react-redux'

import Navigation from './components/Navigation.jsx'
import Home from './components/Home.jsx'
import Signup from './components/Signup.jsx'
import Login from './components/Login.jsx'
import Profile from './components/Profile.jsx'
import Post from './components/Post.jsx'

const store = createStore( // Make global store
  rootReducer,
  compose(
    applyMiddleware(thunk), // Apply promise middleware
    window.devToolsExtension ? window.devToolsExtension() : f => f // Allow chrome extension
  )
)

if(localStorage.jwtToken){
  setAuthorizationToken(localStorage.jwtToken)
  store.dispatch(setCurrentUser(jwt.decode(localStorage.jwtToken)))
}

export default class Routes extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div>
            <Navigation />
            <Switch>
              <Route exact path='/' component={Home} />
              <Route exact path='/recents' component={Home} />
              <Route exact path='/hot' component={Home} />
              <Route path='/signup' component={Signup} />
              <Route path='/login' component={Login} />
              <Route exact path='/profile' component={Profile} />
              <Route path='/profile/*' component={Profile} />
              <Route path='/post/*' component={Post} />
              <Route path='*' component={Home}/>
            </Switch>
          </div>
        </Router>
      </Provider>
    )
  }
}
