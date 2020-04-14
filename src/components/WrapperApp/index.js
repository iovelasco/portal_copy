/* eslint-disable */

import React, { Component, Fragment } from 'react';
import { Col } from 'react-flexbox-grid';
import Spinner from '@andes/spinner';
import { connect } from 'react-redux';
import { withRouter, Switch, Route } from 'react-router';
import Header from '../Header';
import Drawer from '../Drawer';
import BodyDashboard from '../BodyDashboard';
import BodyDrawer from '../BodyDashboard/bodyComponent/BodyDrawer';
import BodyIframeContainer from '../BodyDashboard/bodyComponent/BodyIframeContainer';
import { updateDashboards } from '../../components/DashboardConfig/redux/DashboardConfigActions';
import { toggleDrawerBodyAction } from './redux/WrapperActions';
import Introduction from '../Pages/Introduction';
import KeyUsers from '../Pages/KeyUsers'
import FAQ from '../Pages/FAQ'
import Tools from '../Pages/Tools';
import './WrapperApp.scss';
import ModalAddSection from '../Modals/ModalAddSection';
import DashboardConfig from '../DashboardConfig'
import Metric from '../Pages/Metric';
import FavoriteDash from '../Pages/FavoriteDash';
import Search from '../Pages/Search';
import ModalMetric from '../Modals/ModalAddMetric';
import DownloadPage from '../Pages/DownloadDelivery';
import Section from '../Pages/Section';
import Notification from '../Notification';
import SubsPage from '../Pages/Subscriptions';
import WrapperMeliMetric from '../MeliMetrics/Component/WrapperMeliMetricNew';

class WrapperApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentLoading: true,
      loadedDashboard: undefined
    };
    this.updateLoadedDashboard = this.updateLoadedDashboard.bind(this);
    this.resetDashboard = this.resetDashboard.bind(this);
  }

  componentWillMount() {
    if (!this.props.isAuthenticated) return this.props.history.push(`/?return=${this.props.history.location.pathname}`);
    return this.props.updateDashboardsDis(this.props.buId);
  }

  componentDidUpdate(oldProps) {
    if (oldProps.isAuthenticated!=this.props.isAuthenticated) {
      if (!this.props.isAuthenticated) {
        this.props.history.push('/');
      }
    }
  }

  updateLoadedDashboard(dashboard) {
    if (dashboard) this.setState({loadedDashboard: dashboard});
  }

  resetDashboard() {
    if (this.state.loadedDashboard) this.setState({loadedDashboard: undefined});
  }

  render() {
    const { toggleDrawer } = this.props;
    return (
      this.props.isAuthenticated ? 
      <Fragment>
        <Drawer />
        <div className={toggleDrawer ? "body-app-wrapper-open" : "body-app-wrapper-close"}   >
          <Header resetDashboard={this.resetDashboard} loadedDashboard={this.state.loadedDashboard}/>
            {/*<Notification/>*/}
            <BodyDashboard>
            <Switch>
              <Route exact path = '/business_unit/:buId/key_users' render={() => {
                this.resetDashboard();
                return <KeyUsers/>
              }}/>
              <Route exact path = '/business_unit/:buId/faqs' render={() => {
                this.resetDashboard();
                return <FAQ/>
              }}/>
              <Route exact path = '/business_unit/:buId/tools' render={() => {
                this.resetDashboard();
                return <Tools/>
              }}/>
              <Route exact path = '/business_unit/:buId/favourites' render={() => {
                this.resetDashboard();
                return <FavoriteDash/>
              }}/>
              <Route exact path = '/business_unit/:buId/deliveries' render={() => {
                this.resetDashboard();
                return <DownloadPage/>
              }}/>
              <Route exact path = '/business_unit/:buId/search' render={() => {
                this.resetDashboard();
                return <Search/>
              }}/>
              <Route exact path = '/business_unit/:buId/metrics' render={() => {
                this.resetDashboard();
                return <Metric/>
              }}/>
              <Route exact path = '/business_unit/:buId/subscriptions_update' render={() => {
                this.resetDashboard();
                return <SubsPage/>
              }}/>
              <Route exact path =  '/business_unit/:buId/meli_metrics' render={() => {
                this.resetDashboard();
                return <WrapperMeliMetric/>
              }}/>
              <Route exact path = '/business_unit/:buId/dashboards/:dashboardId' render={() => {
                  return (
                    <Fragment>
                      <BodyDrawer onDashboardLoaded={this.updateLoadedDashboard}/>
                      {this.props.toggleDrawerBody ? <span onClick={() => this.props.handlerOnClickDrawerBody(true, false, false, false)} className="blur"></span> : ''}
                    </Fragment>
                )
              }}/>
              <Route exact path = '/business_unit/:buId/createDashboard' render={() => {
                this.resetDashboard();
                return (
                  <DashboardConfig edit={false}/>
                )
              }}/>
              <Route exact path = '/business_unit/:buId/dashboards/:dashboardId/edit' render={() => {
                this.resetDashboard();
                return (
                  <DashboardConfig edit={true}/>
                )
              }}/>
              <Route exact path = '/business_unit/:buId/sections/:level1' render={() => {
                this.resetDashboard();
                return <Section/>
              }}/>
              <Route exact path = '/business_unit/:buId/sections/:level1/:level2' component={Section}/>
              <Route exact path = '/business_unit/:buId/sections/:level1/:level2/:level3' component={Section}/>
            </Switch>
          </BodyDashboard>
          <Spinner modifier="fullscreen" size="large" label={this.props.loadingMessage} show={this.props.isLoading} />
          <ModalAddSection />
        </div>
      </Fragment> : ''
    );
  }
}

const mapStateToProps = (store, props) => {
  return {
    buName: store.buName,
    sections: store.sections,
    currentDashboard: store.currentDashboard,
    isLoading: store.isLoading,
    loadingMessage: store.loadingMessage,
    toggleDrawer: store.toggleDrawer,
    toggleDrawerBody: store.toggleDrawerBody,
    currentPage: store.currentPage,
    token: store.token,
    listNotification: store.notification.list,
    ...props
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    updateDashboardsDis: (buId) => {
      dispatch(updateDashboards(buId));
    },
    handlerOnClickDrawerBody: (toggle, metrics, attributes, resume) => {
      dispatch(toggleDrawerBodyAction(toggle, metrics, attributes, resume));
    },
    handleNotification : ()=> {
      dispatch(loadNotification())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(WrapperApp));
