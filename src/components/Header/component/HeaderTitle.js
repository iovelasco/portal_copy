import React, {Fragment} from 'react';
import { Col, Row, Grid } from 'react-flexbox-grid';
import { connect } from 'react-redux';
import Button from '@andes/button';
import FloatingButtons from '../../FloatingButtons';
import Tooltip from '@andes/tooltip';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faInfoCircle, faInfo } from '@fortawesome/free-solid-svg-icons'
import { toggleDrawerBodyAction } from '../redux/headerActions';
import {toggleDrawerAction } from '../../Drawer/redux/drawerActions';

library.add(faBars, faInfoCircle);

const HeaderTitle = (props) => {
  const { handlerOnClick, buName, handlerOnClickDrawerBody, showDrawer } = props
  return (
    <Col md={5} className="header__title">
      <Col md={1} className={showDrawer ? 'header__title-close' : 'header__title-open'} >
        <FloatingButtons heightWidth={45} bgColor={"#f2f2f2"} iconColor={"#009ee3"} icon={faBars} onClick={handlerOnClick} modifier="outline" />
      </Col>
      <Col md={11} className="header__title-name">
        <h4>{buName} <span> {(props.loadedDashboard ? <Fragment> / {props.loadedDashboard.title}</Fragment>: '')}</span></h4>
        {((props.loadedDashboard && props.page!='edit-dashboard')?
          <div className="header__title-options">
            <Tooltip className="detaill-Tooltip" title="Dashboard detail" side="bottom">
              <Button onClick={() => handlerOnClickDrawerBody(true, false, false, false)} modifier="outline"> <FontAwesomeIcon icon={faInfo} /></Button>
            </Tooltip>
          </div>
          : '')
        }
      </Col>
    </Col>
  );
}

const mapStateToProps = (store, props) => ({
  showDrawer: store.toggleDrawer,
  showDrawerBody: store.toggleDrawerBody,
  dashboards: store.dashboards,
  buName: store.buName,
  currentDashboard: store.currentDashboard,
  page: store.currentPage,
  ...props,
});

const mapDispatchToProps = (dispatch, props) => ({

  handlerOnClick: () => {
    dispatch(toggleDrawerAction(props.toggleDrawer));
  },
  handlerOnClickDrawerBody: (toggle, metrics, attributes, resume) => {
    dispatch(toggleDrawerBodyAction(toggle, metrics, attributes, resume));
  },
});

const connectedHeaderTitle = connect(mapStateToProps, mapDispatchToProps);
export default connectedHeaderTitle(HeaderTitle);