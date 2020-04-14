/* eslint-disable */
import React, {Fragment } from 'react';
import { Col } from 'react-flexbox-grid';
import { connect } from 'react-redux';
import Dropdown from '@andes/dropdown';
import Button from '@andes/button';
import './Header.scss';
import UserIcon from '../../assets/image/user.svg';
import HeaderTitle from './component/HeaderTitle';
import FloatingButtons from '../FloatingButtons';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBars, faTrashAlt, faPen, faStar, faBell, faShareAlt, faSearch, faClock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Spinner from '@andes/spinner';
import { withRouter } from 'react-router';
import axios from 'axios';
import { updateDashboards } from '../../components/DashboardConfig/redux/DashboardConfigActions';
import { logoutUser, updatePage } from './redux/headerActions';
import { activeNotification } from '../Notification/redux/action';
import { addFavorite, deleteFavorite, loadSubscriptions } from '../Pages/redux/pagesAction';
import TextField from '@andes/textfield';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import '../FloatingButtons/FloatingButtons.scss';
import { runInThisContext } from 'vm';
library.add(faBars);
const { DropdownItem } = Dropdown;


const mapStateToProps = (store, props) => ({
  dashboards: store.dashboards,
  username: store.userName,
  currentPage: store.currentPage,
  role: store.role,
  currentDashboard: store.currentDashboard,
  token: store.token,
  buId: store.buId,
  notification: store.notification.status,
  notification: store.notification.list || [],
  favourites: store.favourites || [],
  subscriptions: store.subscriptions || [],
  ...props,
});

const mapDispatchToProps = dispatch => ({
  actualizarDashboards: function (buid) {
    dispatch(updateDashboards(buid));
  },
  editDashboard: function () {
    dispatch(updatePage({page: 'edit-dashboard'}));
  },
  deslogueo: function () {
    dispatch(logoutUser());
  },
  updateSubscriptions: function(bu_id) {
    dispatch(loadSubscriptions(bu_id));
  },
  handlerAddFavorite: function (dashboard_id, bu_id) {
    dispatch(addFavorite(dashboard_id, bu_id));
  },
  handlerDeletedFavorite: function (dashboard_id, bu_id) {
    dispatch(deleteFavorite(dashboard_id, bu_id));
  },
  handleNotification: function (toggle) {
    dispatch(activeNotification(toggle));
  }
});

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDeleting: false,
      loadingMessage: undefined,
      loadedDashboard: undefined,
      justShared: false,
      search:'',
      notification: true,
      justSubscribed: false
    };
    this.deleteDashboard = this.deleteDashboard.bind(this);
    this.evaluateLogout = this.evaluateLogout.bind(this);
    this.showSnackbar = this.showSnackbar.bind(this);
    this.closeSnackBar = this.closeSnackBar.bind(this);
    this.copyToClipboard = this.copyToClipboard.bind(this);
    this.subscribeUpdate = this.subscribeUpdate.bind(this);
    this.unsubscribeUpdate = this.unsubscribeUpdate.bind(this);
    this.resolveSubscribe = this.resolveSubscribe.bind(this);
  }

  componentDidUpdate(oldProps) {
    if (oldProps.loadedDashboard&&this.props.loadedDashboard) {
      if (oldProps.loadedDashboard.id!=this.props.loadedDashboard.id) {
        console.log('son distintos');
        this.setState({justSubscribed: undefined});
      }
    } else if (!oldProps.loadedDashboard&&this.state.justSubscribed!=undefined) this.setState({justSubscribed: undefined});
  }

  showSnackbar() {
    this.setState({justShared: true});
  }

  closeSnackBar() {
    this.setState({justShared: false});
  }

  evaluateLogout(ev, value) {
    if (value == 'Cerrar') {
      this.props.deslogueo();
    }
  }

  handlerFavorite = () => {
    return this.props.handlerAddFavorite(this.props.loadedDashboard.id, this.props.match.params.buId);
  }
  handlerDeleted = () => {
    return this.props.handlerDeletedFavorite(this.props.loadedDashboard.id, this.props.match.params.buId);
  }

  subscribeUpdate = async () => {
    try {
      const {buId} = this.props.match.params;
      const dashboardId = this.props.loadedDashboard.id;
      await axios.post(`/api/business_units/${buId}/dashboards/${dashboardId}/subscription_update`, {}, {headers: {'X-DSH-Token': this.props.token}});
      this.props.updateSubscriptions(buId);
    } catch (error) {

    }
  }

  unsubscribeUpdate = async () => {
    const {buId} = this.props.match.params;
    const dashboardId = this.props.loadedDashboard.id;
    await axios.delete(`/api/business_units/${buId}/dashboards/${dashboardId}/subscription_update`, {headers: {'X-DSH-Token': this.props.token}});
    this.props.updateSubscriptions(buId);
  }

  async deleteDashboard() {
    try {
      this.setState({
        isDeleting: true,
        loadingMessage: 'Deleting dashboard...'
      });
      await axios.delete(`/api/business_units/${this.props.match.params.buId}/dashboards/${this.props.loadedDashboard.id}`, { headers: { 'X-DSH-Token': this.props.token } });
      this.setState({
        isDeleting: false,
        loadingMessage: undefined
      });
      this.props.actualizarDashboards(this.props.buId);
      this.props.resetDashboard();
      this.props.history.push(`/business_unit/${this.props.match.params.buId}`);
    } catch (error) {
    }
  }

  checkExist() {
    const filtrados = this.props.favourites.filter((x) => {
      return x.dashboard_id == this.props.loadedDashboard.id;
    });
    return filtrados.length > 0;
  }

  checkSub() {
    const filtrados = this.props.subscriptions.filter(x => {
      return x.dashboard_id == this.props.loadedDashboard.id;
    });
    return filtrados.length > 0;
  }

  copyToClipboard() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`/#${this.props.location.pathname}`).then(() => {
        this.setState({justShared: true});
        setTimeout(this.closeSnackBar, 2000);
      }).catch((error) => {
        console.log(error);
      });
    } else {
      console.log('No se puede acceder al clipboard.');
    }
  }

  handleInput = (ev) => {
    ev.preventDefault()
    this.setState({
      search: ev.target.value
    });
  }

  handleSearch = () => {
    return this.props.history.push(`/business_unit/${this.props.match.params.buId}/search?q=${this.state.search}`)
  }


  handleKeyPress = (ev) => {
    if (ev.key == 'Enter') {
      this.handleSearch()
    }
  }

  resolveSubscribe() {
    if (this.state.justSubscribed!=undefined) return this.state.justSubscribed;
    else if (this.props.loadedDashboard) return this.props.loadedDashboard.is_subscribed;
    else return false;
  }

  render() {
    const props = this.props;
    console.log(this.props);
    const dashboardActions = () => {
      if (this.props.role&&this.props.role.can_create_dashboards) {
        return (
        <React.Fragment>
          <FloatingButtons heightWidth={35} bgColor={"#fff"} iconColor={"#009ee3"} icon={faTrashAlt} modifier="outline" onClick={this.deleteDashboard} />
          <FloatingButtons heightWidth={35} bgColor={"#fff"} iconColor={"#009ee3"} icon={faPen} onClick={() => props.history.push(`/business_unit/${props.match.params.buId}/dashboards/${props.loadedDashboard.id}/edit`)} modifier="outline" />
        </React.Fragment>)
      }
    };
    const favouriteActions = () => {
      console.log(this.checkExist());
      if (this.checkExist()) return <FloatingButtons heightWidth={35} bgColor={"#fff"} iconColor={"#009ee3"} icon={faStar} onClick={this.handlerDeleted} modifier="outline" />;
      else return <FloatingButtons heightWidth={35} bgColor={"#fff"} iconColor={"#ccc"} icon={faStar} onClick={this.handlerFavorite} modifier="outline" />;
    }
    const subscribingActions = () => {
      if (this.checkSub()) return <FloatingButtons heightWidth={35} bgColor={"#fff"} iconColor={"#009ee3"} icon={faClock} onClick={this.unsubscribeUpdate} modifier="outline" />;
      else return <FloatingButtons heightWidth={35} bgColor={"#fff"} iconColor={"#ccc"} icon={faClock} onClick={this.subscribeUpdate} modifier="outline" />; 
    }
    const showActions = () => {
      if (this.props.loadedDashboard) {
        return (
          <React.Fragment>
            {dashboardActions()}
            {favouriteActions()}
            {subscribingActions()}
          </React.Fragment>
        )
      } else return undefined
    };
    return (
      <React.Fragment>
      <div fluid className="header">
        <HeaderTitle loadedDashboard={this.props.loadedDashboard}/>
          <Col md={2} className="header__option">
            {showActions()}
          </Col>
          <Col md={3} className="header__input-search">
        <TextField 
            textbox
            id={props.inputId}
            onChange={this.handleInput}
            value={props.value}
            onKeyPress={this.handleKeyPress}
            placeholder="Search Dashboard or Faqs"

          />
          <FloatingButtons
            heightWidth={40}
            icon={faSearch}
            modifier={"filled"}
            bgColor="transparent"
            iconColor="#009ee3"
            onClick={()=> this.handleSearch()}
          />
        </Col>
          <Col md={2} className="header__user-info">
            {/*
            <Col md={2} className="header__notification">
              <span onClick={()=>this.props.handleNotification(this.props.notification)} className={(this.props.notification.length >= 1) ? "active":"disable"}> 
                <FontAwesomeIcon icon={faBell}  /> 
              </span>
            </Col>*/}
            <Col md={7}>
              <Dropdown className="header__drop" label={props.username} value={props.username} size="compact" onChange={this.evaluateLogout}>
                <DropdownItem className="header--drop-item" value={props.username} primary={props.username} />
                <DropdownItem value="Cerrar" primary="log out" />
              </Dropdown>
            </Col>
            <Col md={3}>
              <span className="header__avatar">
                <img src={UserIcon} alt="avatar" />
              </span>
            </Col>
          </Col>
          <Spinner show={this.state.isDeleting} label={this.state.loadingMessage} />
          <textarea className="header__share-link" id="pacopiar" value={this.props.history.location.pathname}></textarea>
      </div>
      {/*<div style={{backgroundColor: 'red', display: 'flex', flexDirection: 'row', alignItems:'center', justifyContent: 'center', color: 'white', width: '100%'}}><h3>Recordá que Teradata no va a estar disponible desde las 17:00 hs GMT-3 del Viernes 22 hasta las 18:00 hs GMT-3 del Sabado 23</h3></div>*/}
      </React.Fragment>
);
  }
};


const connectedDrawer = connect(mapStateToProps, mapDispatchToProps);
export default withRouter(connectedDrawer(withRouter(Header)));

