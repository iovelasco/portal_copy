
/* eslint-disable */
import React, { Fragment, Component } from 'react';

import { connect } from 'react-redux';
import FloatingButtons from '../../FloatingButtons'
import { withRouter } from 'react-router';
import {Accordion, AccordionItem, AccordionItemTitle, AccordionItemBody } from 'react-accessible-accordion';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBars, faPlus, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { updateCurrentDashboard } from '../redux/drawerActions';
import { updatePage } from '../../Header/redux/headerActions';
import ModalSection from '../../Modals/ModalSelectSection';
import { createNewSection } from '../../Modals/redux/modalActions';
import Spinner from '@andes/spinner';
import '../Drawer.scss';
library.add(faBars, faPlus, faCaretRight)

class ActionsList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showSelectSection: false
    };
    this.showModal = this.showModal.bind(this);
    this.createSectionOutput = this.createSectionOutput.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  closeModal() {
    this.setState({showSelectSection: false});
  }

  showModal() {
    this.setState({showSelectSection: true});
  }

  createSectionOutput(path, parent_section_id, section_name) {
    this.setState({showSelectSection: false});
    this.props.createSection(this.props.buId, section_name, parent_section_id);
  }

  render() {
    const {props} = this;
    const resolveActions = () => {
      const actions = [];
      if (this.props.permissions&&this.props.permissions.can_create_sections) actions.push({label :'Add Section', action: this.showModal});
      if (this.props.permissions&&this.props.permissions.can_create_dashboards) actions.push({label: 'Add Dashboard/Report', action: () => this.props.history.push(`/business_unit/${this.props.match.params.buId}/createDashboard`)});
      return actions;
    }
    const finalActions = resolveActions();
    const resolveBody = (actions) => {
      if (actions.length>0) {
        return (
        <Fragment><Accordion accordion={false} className="drawer--list-group">
        <AccordionItem>
          <AccordionItemTitle hideBodyClassName="accordion--arrow">
            <h3>Actions</h3> <FontAwesomeIcon className="accordion--arrow-icon" icon={faCaretRight} />
          </AccordionItemTitle>
          <AccordionItemBody>
            <ul>
              {actions.map(act => {
                return <li onClick={act.action}>{act.label}<FloatingButtons
                heightWidth={20}
                icon={faPlus}
                modifier={"filled"}
                bgColor="#313131"/></li>
              })
            }
            </ul>
          </AccordionItemBody>
        </AccordionItem>
      </Accordion>
      <ModalSection onCloseSection={this.closeModal} onSelectedSection={this.createSectionOutput} showing={this.state.showSelectSection} editing={false}/>
      <Spinner show={this.props.isWorking} modifier="fullscreen" label="Adding section..." />
      </Fragment>)
      } else return undefined;
    }
    
    return (
      <Fragment>
        {resolveBody(finalActions)}
      </Fragment>
  
    )
  }
  
}

const mapStateToProps = (store, props) => ({
  sections: store.sections,
  role: store.role,
  buId: store.buId,
  isWorking: store.isAddingSection,
  ...props,
});

const mapDispatchToProps = (dispatch, props) => ({
  showModalSection: () => {
    dispatch({ type: 'SHOW_MODAL_SECTION' })
  },
  updateCurrentDashboard: (section_id, dashboard_id) => {
    dispatch(updateCurrentDashboard(section_id, dashboard_id))
  },
  createSection: (buId, section_name, parent_section_id) => {
    dispatch(createNewSection(buId, section_name, parent_section_id));
  }
});

const connectedDrawer = connect(mapStateToProps, mapDispatchToProps);
export default withRouter(connectedDrawer(withRouter(ActionsList)));



