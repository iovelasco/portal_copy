import React, { Component } from 'react';
import { connect } from 'react-redux';
import Card from '@andes/card';
import Form from '@andes/form';
import TextField from '@andes/textfield';
import Button from '@andes/button';
import '../Login.scss';
import axios from 'axios';
import { logUser, logoutUser } from '../redux/loginActions';

const { Password } = TextField;

class FormLogin extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: undefined,
      pwd: undefined,
      errorOnLogin: undefined,
      isLoggingIn: false
    };
    this.handleInput = this.handleInput.bind(this);
    this.tryLogin = this.tryLogin.bind(this); 
  }

  handleInput(ev) {
    this.setState({
      [ev.target.id]: ev.target.value,
      errorOnLogin: undefined
    });
  }

  async componentWillMount() {
    const localData = localStorage.getItem("login_data");
    if (localData) {
      try {
        const res = await axios.get('/api/authenticate/alive', {headers: {'X-DSH-Token': JSON.parse(localData).token}});
        this.props.userLogged(JSON.parse(localData));
      } catch (error) {
        this.props.userLoggedOut();
      }
    }
  }

  handleKeyPress = (ev) => {
    if (ev.key == 'Enter') {
      this.tryLogin()
    }
  }

  async tryLogin() {
    try {
      this.setState({
        isLoggingIn: true
      });
      const userData = await axios.post(`/api/authenticate`, {user_id: this.state.username, password: this.state.pwd});
      const newData = {"token": userData.data.token, "user_id": userData.data.user_id, "mail": userData.data.mail};
      localStorage.setItem("login_data", JSON.stringify(newData));
      this.props.userLogged(newData);
    } catch (error) {
      console.log(error);
      this.setState({
        errorOnLogin: 'Wrong user or password',
        isLoggingIn: false
      });
    }
  }

  render() {
    return (
      <Card paddingSize={48} className="login__card">
        <Form>
          <TextField
            label="User"
            message={this.state.errorOnLogin}
            modifier={this.state.errorOnLogin ? 'error' : undefined}
            id="username"
            onChange={this.handleInput}
          />
          <Password
            className="demo-textfield"
            id="pwd"
            label="Password"
            showLabel="show"
            hideLabel="hidden"
            messageShow
            onChange={this.handleInput}
            onKeyPress={this.handleKeyPress}
          />
        </Form>
        <Button disabled={this.isLoggingIn} onClick={this.tryLogin}>  Sign in  </Button>
      </Card>
    );
  }
};

const mapStateToProps = (store, props) => ({
  ...props,
});

const mapDispatchToProps = (dispatch, props) => ({
  userLogged: (data) => {
    dispatch(logUser(data))
  },
  userLoggedOut: () => {
    dispatch(logoutUser());
  }
});

const connectedFormLogin = connect(mapStateToProps, mapDispatchToProps);
export default connectedFormLogin(FormLogin);