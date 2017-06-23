import React from 'react';
import PropTypes from 'prop-types';
import TopBarProfileMenu from './TopBarProfileMenu';
import { login } from '../lib/api';

const logo = '/static/images/opencollective-icon.svg';

class TopBar extends React.Component {

  static propTypes = {
    LoggedInUser: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.showLoginForm = this.showLoginForm.bind(this);
    this.api = { login };
    this.state = {
      showLoginForm: false
    };
  }

  login(e) {
    e.preventDefault();
    const email = this.refs.email.value;
    if (!this.state.showLoginForm || this.state.success) {
      return this.setState({showLoginForm: true, success: null, error: null});
    }
    if (!email) {
      this.setState({showLoginForm: false, success: null, error: null});
    }
    return this.api.login(email, window.location.href).then(() => {
      this.setState({success: "email sent with magic link to login"});
    });
  }
  
  renderProfileMenu() {
    const { LoggedInUser } = this.props;

    return (
      <div className='LoginTopBarProfileMenu' onClick={(e) => e.nativeEvent.stopImmediatePropagation()}>
        <div>
          <div className='LoginTopBarProfileMenuHeading'>
            <span>collectives</span>
            <div className='-dash'></div>
          </div>
          <ul>
          {this.showCreateBtn && <li><a href='/create'>create a collective</a></li>}
          <li><a href='/discover'>Discover</a></li>
            <li><a href='#' onClick={this.onClickSubscriptions.bind(this)}>Subscriptions</a></li>
          </ul>
        </div>
        <div>
          <div className='LoginTopBarProfileMenuHeading'>
            <span>my account</span>
            <div className='-dash'></div>
          </div>
          <ul>
            <li><a href={`/${LoggedInUser.username}`}>Profile</a></li>
          </ul>
          <ul>
            <li><a className='-blue' href='#' onClick={this.onClickLogout.bind(this)}>Logout</a></li>
          </ul>
        </div>
      </div>
    )
  }

  showLoginForm() {
    this.setState({showLoginForm: true, success: null, error: null});
    this.refs.email.focus();
  }

  render() {
    const { className, LoggedInUser } = this.props;

    return (
      <div className={`${className} TopBar`}>
        <style jsx>{`
        .TopBar {
          height: 60px;
          width: 100%;
          position: relative;
        }
        .logo {
          margin: 10px;
        }
        .loading .logo {
          animation: oc-rotate 0.8s infinite linear;
        }
        @keyframes oc-rotate {
          0%    { transform: rotate(0deg); }
          100%  { transform: rotate(360deg); }
        }
        .nav {
          display: flex;
          align-items: center;
          box-sizing: border-box;
          position: absolute;
          top: 0px;
          right: 20px;
          padding-top: 10px;
        }
        ul {
          display: inline-block;
          min-width: 200px;
          list-style: none;
          text-align: right;
          margin: 0;
          padding-left: 10px;
          padding-right: 10px;
        }
        li {
          display: inline-block;
        }
        .separator {
          display: inline-block;
          width: 1px;
          margin: 0 5px;
          height: 30px;
          height: 40px;
          background-color: #e6e6e6;
          vertical-align: middle;          
        }
        .nav a {
          box-sizing: border-box;
          display: inline-block;
          font-size: 1.2rem;
          letter-spacing: 1px;
          text-align: center;
          color: #b4bbbf;
          text-transform: capitalize;
          padding: 4px 16px;
          cursor: pointer;
        }
        .nav a:last-child {
          margin-right: 0;
          padding-right: 0;          
        }

        .loginForm {
          display: inline-block;
          position: relative;
          margin-left: 1rem;
          line-height: 3rem;
        }

        .loginForm a {
          margin: 0px;
          padding: 0px;
        }

        form {
          display: flex;
        }

        .loginForm .inputWrapper {
          display: inline-block;
          overflow: hidden;
          height: 3rem;
          margin-right: 1rem;
          width: 0px;
          transition: 1s;
          -webkit-perspective: 1000;
          -moz-perspective: 1000;
          -o-perspective: 1000;
          perspective: 1000;
        }

        .loginForm .inputWrapper.show {
          padding: 0 0.8rem;
          width: 22rem;
        }

        .loginForm input {
          width: 22rem;
          letter-spacing: 0.5px;
          font-size: 1.2rem;
          margin-right: 1rem;
        }

        .loginForm .success {
          display: inline-block;
          font-size: 1.2rem;
          letter-spacing: 1px;
          color: #46B0ED;
        }

        .flipper {
          width: 100%;
          height: 100%;
          -webkit-transition: 0.6s;
          -webkit-transform-style: preserve-3d;

          -moz-transition: 0.6s;
          -moz-transform-style: preserve-3d;
          
          -o-transition: 0.6s;
          -o-transform-style: preserve-3d;

          transition: 0.6s;
          transform-style: preserve-3d;

          position: relative;
        }

        .front, .back {
          -webkit-backface-visibility: hidden;
          -moz-backface-visibility: hidden;
          -o-backface-visibility: hidden;
          backface-visibility: hidden;

          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
        }

        .success .flipper {
          -webkit-transform: rotateY(180deg);
          -moz-transform: rotateY(180deg);
          -o-transform: rotateY(180deg);
          transform: rotateY(180deg);
        }

        .front {
          z-index: 2;
        }

        .back {
          -webkit-transform: rotateY(180deg);
          -moz-transform: rotateY(180deg);
          -o-transform: rotateY(180deg);
          transform: rotateY(180deg);
        }

        @media(max-width: 380px) {
          ul {
            display: none;
          }
        }
        `}</style>
        <img src={logo} width="40" height="40" className="logo" alt="Open Collective logo" />
        <div className="nav">
          <ul>
            <li><a href="/learn-more">How it works</a></li>
            <li><a href="/discover">Discover</a></li>
            <li><a href="https://medium.com/open-collective">Blog</a></li>
          </ul>
          <div className="separator"></div>
          { !LoggedInUser && 
          <div className="loginForm">
            <form onSubmit={this.login}>
              <div className={`inputWrapper ${this.state.success ? 'success' : ''} ${this.state.showLoginForm ? 'show' : ''}`}>
                <div className="flipper">
                  <div className="front">
                    <input type="email" ref="email" placeholder="<Enter your email>" />
                  </div>
                  <div className="back">
                    { this.state.error && <div className="error">{this.state.error}</div> }
                    { this.state.success && <div className="success">{this.state.success}</div> }
                  </div>
                </div>
              </div>
              <a href="#" onClick={this.login}>Login</a> 
            </form>
          </div>
          }
          { LoggedInUser && <TopBarProfileMenu LoggedInUser={LoggedInUser} /> }
        </div>

      </div>
    )
  }
}

export default TopBar;