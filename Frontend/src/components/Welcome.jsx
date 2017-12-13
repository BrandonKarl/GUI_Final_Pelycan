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

import './styles/Welcome.css'

class Welcome extends Component {
  render() {
    return (
      <div className='welcomeContainer'>
        <span className='welcomeMessage'>
          <h1>Welcome Back, </h1>
          <h1>{this.props.user.info.firstName}!</h1>
        </span>
      </div>
    )
  }
}

export default connect(mapStateToProps)(Welcome)
