import React from 'react';
// import ReactDOM from 'react-dom';
import axios from 'axios';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      token: '',
      is_login: false,
      is_authorised: false,
      tokeninpt: '',
      authname: '',
    };
  }

  // Submit handler
  mySubmitHandler = (event) => {
    event.preventDefault();

    axios
      .post(`http://localhost:8000/login`, {
        username: this.state.username,
        password: parseInt(this.state.password),
      })
      .then((res) => {
        if (res.data.data.token) {
          this.setState({ token: res.data.data.token });
          this.setState({ is_login: true });
        }
      });
  };

  // New submit handler to submit authorisation url
  authHandler = (event) => {
    event.preventDefault();

    let tkn = document.getElementById('tokeninpt').value;
    this.setState({ tokeninpt: tkn });

    axios
      .post(`http://localhost:8000/authenticate`, { token: tkn })
      .then((res) => {
        if (res.data.status === 200) {
          this.setState({ authname: res.data.data.username });
          this.setState({ is_authorised: true });
        }
      });
  };

  // Getting input values and put them into state
  myChangeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val });
  };

  render() {
    if (this.state.is_login && this.state.is_authorised === false) {
      return (
        <form onSubmit={this.authHandler}>
          <h2>
            Successfully Loggedin..{' '}
            <small>Click below to Authorise the token</small>{' '}
          </h2>
          <p>Token:</p>
          <input
            type='text'
            name='tokeninpt'
            value={this.state.token}
            id='tokeninpt'
          />
          <br />
          <input type='submit' name='submit' value='submit' />
        </form>
      );
    } else if (this.state.is_authorised) {
      return <h1>Welcome {this.state.authname} ... </h1>;
    } else {
      return (
        <form onSubmit={this.mySubmitHandler}>
          <h1>Login Here</h1>
          <p>Username:</p>
          <input type='text' name='username' onChange={this.myChangeHandler} />
          <p>Password:</p>
          <input
            type='password'
            name='password'
            onChange={this.myChangeHandler}
          />
          <br />
          <input type='submit' name='submit' value='submit' />
        </form>
      );
    }
  }
}

export default Login;
