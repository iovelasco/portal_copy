/* eslint-disable */
import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-flexbox-grid';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from "react-router-dom";
import loginReducer from '../Login/redux/loginReducer';
import { faBell } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { loadNotification, readNotification, activeNotification } from './redux/action';
import './Notification.scss';
import { linkSync } from 'fs';

class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: undefined,
    };
    this.mouseOut = this.mouseOut.bind(this);
  }
  componentWillMount() {
    this.props.handlerNotificationData();
  }

  mouseOut(e) {
    e.preventDefault();
    this.props.handleShowModal();
  }

  render() {
    const { status } = this.props;
    const listNotification = this.props.listNotification || [];
    let mapListNotification;
    return (
      <div onMouseLeave={(e)=>this.mouseOut(e)} style={(status) ? { display: "block" } : { display: "none" }} className="notification">
        <div className="notification--card">
          <div className="notification--header">
            <p>Notifications</p> <p>{listNotification.length}</p>
          </div>
          <ul className="notification--list">
            {mapListNotification = listNotification.map((item, i) => {
              return (
                <Link to="#" key={i}>
                  <li  className="notification--item-list" onClick={()=>this.props.handleNotificationStatus(item.id)}>
                    <div className="notification--header-item-list">
                      <div className="name">
                        <p > <FontAwesomeIcon icon={faBell} style={(item.read_flag) ? { color: "#c9c9c9" } : { color: "#009ee3" }} /> {item.title}</p>
                      </div>
                      <div className="date">
                        <p>{item.sender}</p>
                        <p>{item.date}</p>
                      </div>
                    </div>
                    <div className="notification--description-item-list">
                        <p >{item.content}</p>
                    </div>
                  </li>
                </Link>
              )})}
          </ul>
        </div>
      </div>
    );
  }
}


const mapStateToProps = (store, props) => ({
  status: store.notification.status,
  listNotification: store.notification.list,
  ...props,
});

const mapDispachtToProps = dispacht => ({
  handlerNotificationData() {
    dispacht(loadNotification());
  },
  handleNotificationStatus(id) {
    dispacht(readNotification(id));
  },
  handleShowModal:()=>{
    dispacht(activeNotification())
  }
});

const connectNotification = connect(mapStateToProps, mapDispachtToProps);

export default withRouter(connectNotification(Notification));
