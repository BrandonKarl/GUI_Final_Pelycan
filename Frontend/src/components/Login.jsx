/* 
 Name: Brandon Karl/ Serey Morm, brandon_karl@student.uml.edu/serey_morm@student.uml.edu
 Computer Science Department, UMass Lowell
 Comp.4610, GUI Programming I
 File: /usr/cs/2018/smorm/public_html/
 Created: 20-nov-2017
 Last updated by HL: 7-Dec-2017, 15:34
*/

import React, { Component } from 'react'
import { login } from '../actions/login'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import mapStateToProps from '../utils/redux'

import './styles/Login.css'
class Login extends Component {
  state = {
    email: '',
    password: '',
    errors: {}
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  onSubmit = event => {
    event.preventDefault()
    const { email, password } = this.state
    let errors = {}, isValid = true

    if(email === '')
      errors['email'] = 'E-Mail required'
    if(password === '')
      errors['password'] = 'Password required'
    
      if(errors.email || errors.password) {
        this.setState({ errors })
        isValid = false
      }

      if(isValid){
        this.props.login({ email, password})
        .then(res => {
          this.context.router.history.push('/')
        })
        .catch( err => {
          errors['login'] = err.response.data.errors
          this.setState({ errors })
        })
      }
  }

  render() {
    return (
      <div className='loginContainer'>
        <form onSubmit={this.onSubmit} className='loginContent'>
          {this.state.errors.login 
            ? <h4 className='errorTab'>{this.state.errors.login}</h4>
            : <div className='errorTabHolder'></div>
          }
          <span className='loginField'>
            {this.state.errors.email 
              ? <label style={{color: 'red', animation: 'shake 0.5s forwards'}}>{this.state.errors.email}</label>
              : <label>E-Mail</label> 
            }
            <input
              type='email'
              name='email'
              onChange={this.onChange}
              value={this.state.username}/>
          </span>
          <br/><br/>
          <span className='loginField'>
            {this.state.errors.password 
              ? <label style={{color: 'red', animation: 'shake 0.5s forwards'}}>{this.state.errors.password}</label>
              : <label>Password</label> 
            }
            <input
              type='password'
              name='password'
              onChange={this.onChange}
              value={this.state.username}/>
          </span>
          <button onClick={this.onSubmit}>Login</button>
        </form>
      </div>
    )
  }
}

Login.contextTypes = {
  router: PropTypes.object.isRequired
}

export default connect(mapStateToProps, { login })(Login)