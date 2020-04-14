
/* eslint-disable */
import React from 'react';
import { Row, Col } from 'react-flexbox-grid';

import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Accordion} from 'react-accessible-accordion';
import { MetricWhiteIcon, logoDash } from '../../assets/image/icons';
import './Drawer.scss';
import Button from '@andes/button';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBars, faPlus, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import GeneralOption from './component/GeneralOptions';
import ActionList from './component/ActionsList';
import SectionList from './component/SectionList'


library.add(faBars, faPlus, faCaretRight)

const Drawer = (props) => {
  const { history } = props;

  return (
    <div className={(props.showDrawer) ? "drawer drawer-open" : "drawer drawer-closed"}>
      <div className="drawer--body">
        <Row className="drawer--header">
          <Col md={12} className="drawer--header-logo">
            <img src={logoDash} onClick={() => history.push('/')} />
          </Col>
        </Row>
        <Row className="drawer--container-list">
          <Button className="drawer--melimetric-button"onClick={() => props.history.push(`/business_unit/${props.match.params.buId}/meli_metrics`)}>
          <img src={MetricWhiteIcon}/> MELI Metrics </Button>
          <Accordion accordion={false} className="drawer--list-group">
            <GeneralOption/>
            <ActionList permissions={props.role}/>
            <SectionList/>
           </Accordion>
        </Row>
      </div>
    </div>
  )
}

const mapStateToProps = (store, props) => ({
  showDrawer: store.toggleDrawer,
  sections: store.sections,
  role: store.role,
  ...props,
});

const connectedDrawer = connect(mapStateToProps, null);
export default connectedDrawer(withRouter(Drawer));



