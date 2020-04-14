/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import FormLogin from './Component/FormLogin';
import SelectBU from './Component/SelectBU';
import './Login.scss';
import logoDash from '../../assets/image/logo-color.svg';
import {withRouter} from 'react-router';
import qs from 'query-string';


class Login extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const values = qs.parse(this.props.location.search);
    return (
      <div className="login">
        <div className="login--logo">
          <img src={ logoDash } />
        </div>
        {(!this.props.isAuthenticated) ? <FormLogin /> : (values.return ? this.props.history.push(values.return) : <SelectBU/>) }
        <span className="login--bg" />
      </div>
    );
  }
};


const mapStateToProps = (store, props) => ({
  loginUserSucces: store.loginUserSucces,
  ...props,
});

const mapDispatchToProps = (dispatch, props) => ({
});

const connectedLogin = connect(mapStateToProps, mapDispatchToProps);

export default withRouter(connectedLogin(Login));