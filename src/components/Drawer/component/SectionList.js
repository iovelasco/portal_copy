/* eslint-disable */
import React from 'react'
import { connect } from 'react-redux';
import { updateCurrentDashboard } from '../redux/drawerActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBars, faPlus, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import {Accordion, AccordionItem, AccordionItemTitle, AccordionItemBody } from 'react-accessible-accordion';
import '../Drawer.scss';
import {updatePage} from '../../Header/redux/headerActions';
import {withRouter} from 'react-router';


class SectionList extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    let sectionList;
    return (
      this.props.sections ? 
      <Accordion onChange={this.checkAccordion} accordion={false} className="accordion--section">
        { sectionList = Object.keys(this.props.sections).map((key) => {  
         const sectionLevelOne = Object.keys(this.props.sections[key].childrens).map((key2) => {    
          const lvlTwo = Object.keys(this.props.sections[key].childrens[key2].childrens).map((x)=> x)
          const sectionLevelTwo = lvlTwo.map((key3) => {
          return (
            <AccordionItem key={key3} className="accordion--section-lvl-3">
            <AccordionItemTitle hideBodyClassName="accordion--arrow">
            <h3 onClick={() => this.props.history.push(`/business_unit/${this.props.match.params.buId}/sections/${key}/${key2}/${key3}`)}>{this.props.sections[key].childrens[key2].childrens[key3].name}</h3> 
            </AccordionItemTitle>
              <AccordionItemBody>
                <ul>
                { sectionLevelTwo }
                </ul>
              </AccordionItemBody>
            </AccordionItem>
          )
        });
        return (
          <AccordionItem key={key2} className="accordion--section-lvl-2">
          <AccordionItemTitle hideBodyClassName="accordion--arrow">
            <h3 onClick={() => this.props.history.push(`/business_unit/${this.props.match.params.buId}/sections/${key}/${key2}`)}>
            {this.props.sections[key].childrens[key2].name}</h3> {lvlTwo.length < 1 ? undefined : <FontAwesomeIcon className="accordion--arrow-icon" icon={faCaretRight} />   }
          </AccordionItemTitle>
            <AccordionItemBody>
              <ul>
              { sectionLevelTwo }
              </ul>
            </AccordionItemBody>
          </AccordionItem>
          );
      });
      return (
        <AccordionItem key={key}>
          <AccordionItemTitle hideBodyClassName="accordion--arrow">
            <h3 onClick={() => this.props.history.push(`/business_unit/${this.props.match.params.buId}/sections/${key}`)}>{this.props.sections[key].name}</h3> {sectionLevelOne.length < 1 ? undefined :<FontAwesomeIcon className="accordion--arrow-icon" icon={faCaretRight} />}
          </AccordionItemTitle>
          <AccordionItemBody>
            <ul>
             { sectionLevelOne }
            </ul>
          </AccordionItemBody>
        </AccordionItem>
      );
    })}
      </Accordion> : ''
    );
  }
};


const mapStateToProps = (store, props) => ({
  sections: store.sections,
  role: store.role,
  ...props,
});

const mapDispatchToProps = (dispatch, props) => ({
  changeCurrentPage: (page) => {
    dispatch(updatePage(page));
  },
  verifyByBiwitch: () =>{
    dispatch(verifyByBiAction(props.verifyByBi));
  },
  showModalSection: () => {
    dispatch({type: 'SHOW_MODAL_SECTION'})
  },
  showModalFAQ: () => {
    dispatch({type: 'SHOW_MODAL_FAQ'});
  },
  showModalMetric: () => {
    dispatch({ type:'SHOW_MODAL_METRIC'});
  },
  updateCurrentDashboard: function (section_id, dashboard_id) {
    dispatch(updateCurrentDashboard(section_id, dashboard_id))
  },
  openModalSection: function () {
    dispatch({ type: 'SHOW_MODAL_SECTION' });
  }
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SectionList));
