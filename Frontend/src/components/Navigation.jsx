/* 
 Name: Brandon Karl/ Serey Morm, brandon_karl@student.uml.edu/serey_morm@student.uml.edu
 Computer Science Department, UMass Lowell
 Comp.4610, GUI Programming I
 File: /usr/cs/2018/smorm/public_html/
 Created: 20-nov-2017
 Last updated by HL: 7-Dec-2017, 15:34
*/

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { logout } from '../actions/login.js'
import FontAwesome from 'react-fontawesome'

import mapStateToProps from '../utils/redux'

import './styles/Navigation.css'

class Navigation extends Component {
  state = {
    fullName: '',
    isAuthenticated: false
  }
  componentWillMount = () => {
    if(this.props.user.isAuthenticated){
      const { firstName, lastName } = this.props.user.info
      if (firstName || lastName)
        this.setState({ fullName: `${firstName} ${lastName}`})
    }
  }

  logout = () => {
    this.props.logout()
  }
  
  render() {
    const notLoggedIn = (
      <span className='navigationNotLoggedIn'>
        <Link to='/login' className='linkStyles'>Login</Link>
        <Link to='/signup' className='linkStyles'>Sign Up</Link>
      </span>
    )

    const loggedIn = (
      <span className='navigationLoggedIn'>
        <Link to='/profile' className='navigationUser'>
          <FontAwesome name='user-circle' style={{display: 'flex', alignItems: 'center'}}/>
          <p>&nbsp;&nbsp;{this.state.fullName}</p>
        </Link>
        <p onClick={this.logout} className='logoutButton'>Logout</p>
      </span>
    )
    return (
      <div>
      <div className='navigationPlaceholder'/>            
        <div className='navigationContainer'>
          <div className='navigationContent'>
            <Link to='/' style={{textDecoration: 'none'}}>
              <h4 className='navigationLogo'>Pelycan</h4>
            </Link>
            {this.props.user.isAuthenticated ? loggedIn : notLoggedIn}
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, { logout })(Navigation)