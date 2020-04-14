/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux'
import sectionIcon from '../../../assets/image/sectionIcon.svg';
import { withRouter } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAward, faInfo, faStar, faPen, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import { updateCurrentDashboard } from '../../Drawer/redux/drawerActions';
import { updateCurrentSection, deleteSection, up } from '../redux/pagesAction';
import {updateDashboards} from '../../DashboardConfig/redux/DashboardConfigActions';
import  Snackbar  from '@andes/snackbar';
import './Section.scss';
import '../Pages.scss';
import Tooltip from '@andes/tooltip';
import FloatingButtons from '../../FloatingButtons';
import axios from 'axios';
const TextField = require('@andes/textfield');


library.add(faAward, faInfo, faStar)

class Section extends Component {
  constructor(props) {
    super(props)
    this.state = {
      search: '',
      isLoading: false,
      last_search: undefined,
      loadingMessage: undefined,
      errorMessage: undefined,
      successMessage: undefined,
      dashboards: [],
      faqs: [],
      dashboard_search: undefined,
      accountantSearch: undefined,
      dinamicTitle:false,
      newTitle:undefined,
    }
    this.handleEditTitle = this.handleEditTitle.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.startEditing = this.startEditing.bind(this);
    this.handleDeleteSection = this.handleDeleteSection.bind(this);
  }

  handleViewSection = (x) => {
    return this.props.history.push(`/business_unit/${this.props.match.params.buId}/dashboards/${x}`)
  }

  startEditing() {
    this.setState({
      dinamicTitle: !this.state.dinamicTitle
    });
  }

  handleDeleteSection(sectionId) {
    axios.delete(`/api/business_units/${this.props.buId}/sections/${sectionId}`, {headers: {'X-DSH-Token': this.props.token}, data: {}})
    .then(() => {
      this.props.history.push(`/business_unit/${this.props.buId}/favourites`)
      this.props.updDash(this.props.buId, 'favourites');
    });
  }


  handleEditTitle(sectionId, newSectionName){
    this.setState({
      dinamicTitle: false
    });
    this.props.changeCurrenSection(sectionId, newSectionName);
  }

  handleInput (ev) {
    const newTitle = ev.target.value
    this.setState({
      newTitle:newTitle
    });
  }

  render() {
    let dashboards = [];
    let pageTitleConfig = {
      title: 'Sections',
      icon: sectionIcon
    }

    const sectionId = this.props.match.params.level1;
    const newSectionName = this.state.newTitle
    if (this.props.dashboards && this.props.sections) {
      let currentPath;
      let currentPathTrimmed;
      const l1 = this.props.match.params.level1;
      const l2 = this.props.match.params.level2;
      const l3 = this.props.match.params.level3;

      
      if (l1) currentPath = this.props.sections[l1].name;
      if (l2) currentPath += ` / ${this.props.sections[l1].childrens[l2].name }`;
      if (l3) currentPath += ` / ${this.props.sections[l1].childrens[l2].childrens[l3].name}`;

      if (window.dataLayer) {

        window.dataLayer.push({
            'event': 'trackPageview',
            'businessUnit': this.props.buName,
            'section': 'Dashboards',
            'dashboardLevel': currentPath.replace(/ \/ /g, "/").replace(/ /g, "-")
          });
      }

      let currentSection = l3 ? l3 : (l2 ? l2 : l1);
        
      pageTitleConfig = {
        title: `Sections / ${currentPath}`,
        icon: sectionIcon,
      }
      dashboards = Object.keys(this.props.dashboards).map((x, ind) => {
        if (this.props.dashboards[x].section_id == currentSection) return (
          <li key={ind} className="pages-section__list-item" onClick={() => this.handleViewSection(x)}>
            <div className="pages-section__item-title">
              <p>{this.props.dashboards[x].title}</p>
              <div className="pages-section__icon">
                {4 < 6 ? <span className="icon">
                  <FontAwesomeIcon icon={faAward} />
                </span> : undefined}
                <Tooltip trigger="hover" content={this.props.dashboards[x].description}>
                  <span className="icon">
                    <FontAwesomeIcon icon={faInfo} />
                  </span>
                </Tooltip>
              </div>
            </div>
            <div className="pages-section__chips">
              <p>Metric</p>
              <ul className="metric">
                {this.props.dashboards[x].metrics.map((metrics, index) => {
                  return <li key={index}>{metrics.name}</li>
                })
                }
              </ul>
            </div>
            <div className="pages-section__chips">
              <p>Attributes</p>
              <ul className="attributes">
                {this.props.dashboards[x].attributes.map((attributes, index) => {
                  return <li key={index}>{attributes.name}</li>
                })
                }
              </ul>
            </div>
          </li>
        );
      });
    }
    const configureSection = (() => {
      console.log(this.props.permissions);
      if (this.props.permissions&&this.props.permissions.can_create_sections) {
        if (!this.state.dinamicTitle) return <FloatingButtons heightWidth={35} iconColor={"#009ee3"} icon={faPen} modifier="outline" onClick={this.startEditing} />;
        else {
          return <React.Fragment>
                   <FloatingButtons heightWidth={35} iconColor={"#009ee3"} icon={faSave} modifier="outline" onClick={()=>this.handleEditTitle(sectionId, newSectionName)} />
                   <FloatingButtons heightWidth={35} iconColor={"#009ee3"} icon={faTrash} modifier="outline" onClick={()=>{this.handleDeleteSection(sectionId)}} />
          </React.Fragment>
        }
      } else return undefined;
    })();
    return (
      <div className="pages-section">
        <div className="pages-header">
          <div className="pages-header--title">
            <span className="pages-header--icon"> <img src={pageTitleConfig.icon} /></span>
            <div className="pages-header--dinamic-title">{(this.state.dinamicTitle)?
               <TextField label="Select a new name" onChange={this.handleInput} /> : <h3 > {pageTitleConfig.title} </h3>}
               {configureSection}
            </div>
          </div>
        </div>
        <div className="pages-section__contianer-list" center="xs">
          <ul className="pages-section__list">
            {dashboards}
          </ul>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (store, props) => ({
  faqs: store.faqs,
  sections: store.sections,
  dashboards: store.dashboards,
  currentSection: store.currentSection,
  currentSectionPath: store.currentSectionPath,
  permissions: store.role,
  buId: store.buId,
  token: store.token,
  buName: store.buName,
  ...props,

});

const mapDispatchToProps = (dispatch, props) => ({
  changeCurrentDashboard: (section, dashid) => {
    dispatch(updateCurrentDashboard(section, dashid));
  },
  changeCurrenSection: (sectionId, newSection) =>{
    dispatch(updateCurrentSection(sectionId, newSection))
  },
  updDash : (dashId, page) => {
    dispatch(updateDashboards(dashId, page))
  }
});

const connectedSection = connect(mapStateToProps, mapDispatchToProps);
export default withRouter(connectedSection(Section));

