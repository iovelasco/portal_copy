import React from 'react';
import { Grid } from 'react-flexbox-grid';
import { withRouter } from 'react-router';

import WrapperApp from './components/WrapperApp';
import './style/index.scss';

const App = props => (
  <Grid fluid className="wrapper-app-component">
    <WrapperApp isAuthenticated={props.isAuthenticated} buId={props.match.params.buId} />
  </Grid>
);

export default withRouter(App);

