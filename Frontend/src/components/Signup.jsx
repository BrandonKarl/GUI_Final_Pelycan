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
import { signup } from '../actions/signup'
import mapStateToProps from '../utils/redux'
import PropTypes from 'prop-types'

import './styles/Signup.css'
class Signup extends Component {

  state = {
    emailVerified: false,
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    errors: {}
  }


  /**
   * Update state upon input update
   */
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  /**
   * Verifies if the email is a .edu
   */
  verifyEmail = event => {
    event.preventDefault()
    const { email } = this.state
    if(email.includes('.edu')){
      this.setState({ emailVerified: true, errors: {} })
    }
    else {
      const { errors } = this.state
      if(email === '')
        errors['email'] = 'Please enter an email that ends with .edu'
      else
        errors['email'] = 'You must have a valid .edu email to register'
      this.setState({ errors })
    }
  }

  /**
   * Validates the input forms
   */
  verifyForm = () => {
    const { firstName, lastName, password, confirmPassword } = this.state
    let isValid = true, errors = {}

    if(firstName === '')
      errors['firstName'] = 'First name required'
    if(lastName === '')
      errors['lastName'] = 'Last name required'
    if(password === '')
      errors['password'] = 'Password required'
    if(confirmPassword === ''){
      errors['confirmPassword'] = 'Re-enter password'
    }
    if(password !== confirmPassword && confirmPassword !== '')
      errors['confirmPassword'] = 'Pass. must match'

    if(errors.firstName || errors.lastName || errors.password || errors.confirmPassword) {
      this.setState({ errors })
      isValid = false
    }

    return isValid
  }

  /**
   * Creates the POST request to signup
   */
  completeSignup = event => {
    event.preventDefault()
    const { email, firstName, lastName, password } = this.state
    if(this.verifyForm()) {
      this.props.signup({ email, firstName, lastName, password })
      .then(res => {
        this.context.router.history.push('/')
      })
      .catch(err => {
        const { errors } = this.state
        errors['signup'] = 'Signup failed'
        this.setState({ errors })
      })
    }
  }
  
  render() {
    return (
      <div className='signupContainer'>
        <div className='signupContent'>
          {this.state.emailVerified &&
            <form className='signupInfo' onSubmit={this.onCompleteSignup}>
              <span className='signupNameFields'>
                <span className='firstName'>
                {this.state.errors.firstName 
                  ? <label style={{color: 'red'}}>{this.state.errors.firstName}</label>
                  : <label>First Name</label> 
                }
                  <input
                    type='text'
                    name='firstName'
                    onChange={this.onChange}
                    value={this.state.firstName}/>
                </span>
                <span className='lastName'>
                  {this.state.errors.lastName 
                    ? <label style={{color: 'red'}}>{this.state.errors.lastName}</label>
                    : <label>Last Name</label> 
                  }
                  <input
                    type='text'
                    name='lastName'
                    onChange={this.onChange}
                    value={this.state.lastName}/>
                </span>
              </span>
              <br/><br/>
              <span className='passwordFields'>
                <span>
                  {this.state.errors.password 
                    ? <label style={{color: 'red'}}>{this.state.errors.password}</label>
                    : <label>Password</label> 
                  }
                  <input
                    type='password'
                    name='password'
                    onChange={this.onChange}
                    value={this.state.password}/>
                </span>
                <span>
                  {this.state.errors.confirmPassword 
                    ? <label style={{color: 'red'}}>{this.state.errors.confirmPassword}</label>
                    : <label>Confirm Password</label> 
                  }
                  <input
                    type='password'
                    name='confirmPassword'
                    onChange={this.onChange}
                    value={this.state.confirmPassword}/>
                </span>
              </span>
              {this.state.errors.signup && <h4 style={{color: 'red'}}>{this.state.errors.signup}</h4>}
              <button onClick={this.completeSignup}>Signup</button>
            </form>
          }
          {!this.state.emailVerified &&
            <form className='signupEmail' onSubmit={this.verifyEmail}>
              <h3>Enter your .edu email so we can verify your status.</h3>
              {this.state.errors.email && <p style={{color: 'red'}}>{this.state.errors.email}</p>}
              <input
                type='email'
                name='email'
                onChange={this.onChange}
                value={this.state.email}/>
            </form>
          }
        </div>
      </div>
    )
  }
}

Signup.contextTypes = {
  router: PropTypes.object.isRequired
}

export default connect(mapStateToProps, { signup })(Signup)