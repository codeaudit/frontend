import React from 'react'

class LoginPage extends React.Component {

  static getInitialProps ({ query: { accessToken, next } }) {
    return { accessToken, next }
  }

  componentDidMount() {
    window.localStorage.setItem('accessToken', this.props.accessToken);
    window.location.replace(this.props.next || '/');
  }

  render() {

    const logo = '/static/images/opencollective-icon.svg';

    return (
      <div>
        <style jsx>{`
        @font-face {
          font-family: 'montserratlight';
          src: url('/static/fonts/montserrat/montserrat-light-webfont.eot');
          src: url('/static/fonts/montserrat/montserrat-light-webfont.eot?#iefix') format('embedded-opentype'),
            url('/static/fonts/montserrat/montserrat-light-webfont.woff2') format('woff2'),
            url('/static/fonts/montserrat/montserrat-light-webfont.woff') format('woff'),
            url('/static/fonts/montserrat/montserrat-light-webfont.ttf') format('truetype'),
            url('/static/fonts/montserrat/montserrat-light-webfont.svg#montserratlight') format('svg');
          font-weight: normal;
          font-style: normal;
        }

        :global(html) {
          font-size: 62.5%;
          height: 100%;
          width: 100%;
        }

        :global(body) {
          width: 100%;
          height: 100%;
        }

        :global(div) {
          height: 100%;
        }

        h2 {
          font-family: montserratlight,Helvetica,sans-serif;
          font-weight: 300;
          line-height: 1.5;
        }

        .page {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .dialog {
          text-align: center;
          height: auto;
        }

        .logo {
          animation: oc-rotate 0.8s infinite linear;
        }
        @keyframes oc-rotate {
          0%    { transform: rotate(0deg); }
          100%  { transform: rotate(360deg); }
        }
        `}</style>
        <div className="page">
          <div className="dialog">
            <img src={logo} width="40" height="40" className="logo" alt="Open Collective logo" />
            <h2>Logging in...</h2>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginPage;
