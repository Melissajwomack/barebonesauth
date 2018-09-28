import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import API from "./utils/API";

class App extends Component {
  state = {
    email: "fake@example.com2",
    password: "asdf2",

    username: "",
    time: ""
  }
  componentDidMount(){
    API.login(this.state.email, this.state.password)
      .then(() => API.hello())
      .then(response => {
        console.log(response);
        this.setState({
          username: response.data.email,
          time: response.data.timestamp
        })
      }).catch(err => {
        console.log(err);
      })

  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React {this.state.username}</h1>
        </header>
        <p className="App-intro">
          It is currently {this.state.time}
        </p>
      </div>
    );
  }
}

export default App;
