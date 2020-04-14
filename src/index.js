import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { HashRouter, Route, Switch } from "react-router-dom";
import RequiresAuth from './middleware/requiresAuth';

import App from "./App";
import store from "./store/store";
import Login from "./components/Login";
import {withRouter} from 'react-router';

class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      returnUrl: undefined
    };
    this.setReturnUrl = this.setReturnUrl.bind(this);
    this.cancelReturn = this.cancelReturn.bind(this);
  }

  setReturnUrl(returnUrl) {
    this.setState({returnUrl});
  }

  cancelReturn() {
    this.setState({returnUrl: undefined});
  }

  render() {
    return(
      <Provider store={store}>
          <HashRouter>
            <Switch>
              <Route path="/business_unit/:buId" render={() => <RequiresAuth><App/></RequiresAuth>} />
              <Route exact path="/" render={() => <RequiresAuth><Login returnUrl={this.state.returnUrl}/></RequiresAuth>} />
            </Switch>
          </HashRouter>
        </Provider>
    )
  }
}

ReactDOM.render(
  <Root/>
  ,
  document.getElementById('root'));
