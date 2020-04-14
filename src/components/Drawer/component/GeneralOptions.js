
/* eslint-disable */
import React from 'react';

import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {Accordion, AccordionItem, AccordionItemTitle, AccordionItemBody } from 'react-accessible-accordion';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBars, faPlus, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { updateCurrentDashboard } from '../redux/drawerActions';

import '../Drawer.scss';
library.add(faBars, faPlus, faCaretRight)

const GeneralOption = (props) => {
  return (
    <Accordion accordion={false} className="drawer--list-group">
    <AccordionItem>
      <AccordionItemTitle hideBodyClassName="accordion--arrow">
        <h3>Options</h3> <FontAwesomeIcon className="accordion--arrow-icon" icon={faCaretRight} />
      </AccordionItemTitle>
      <AccordionItemBody>
        <ul>
        <li onClick={() => props.history.push(`/business_unit/${props.match.params.buId}/subscriptions_update`)}>Dashboards Status </li>
          <li onClick={() => props.history.push(`/business_unit/${props.match.params.buId}/key_users`)}> Key Users </li>
          <li onClick={() => props.history.push(`/business_unit/${props.match.params.buId}/faqs`)}> FAQ </li>
          <li onClick={() => props.history.push(`/business_unit/${props.match.params.buId}/metrics`)}> Metric  </li>
          <li onClick={() => props.history.push(`/business_unit/${props.match.params.buId}/favourites`)}> Favorites </li>
          <li onClick={() => props.history.push(`/business_unit/${props.match.params.buId}/tools`)}> Tools </li>
          <li onClick={() => props.history.push(`/business_unit/${props.match.params.buId}/deliveries`)}> Deliveries </li>
        </ul>
      </AccordionItemBody>
    </AccordionItem>
    </Accordion>
  )
}

const mapStateToProps = (store, props) => ({
  sections: store.sections,
  ...props,
});

const mapDispatchToProps = (dispatch, props) => ({
  updateCurrentDashboard: (section_id, dashboard_id) => {
    dispatch(updateCurrentDashboard(section_id, dashboard_id))
  },
});

const connectedDrawer = connect(mapStateToProps, mapDispatchToProps);
export default connectedDrawer(withRouter(GeneralOption));



