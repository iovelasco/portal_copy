/* eslint-disable */
import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux'
import { Grid, Row } from 'react-flexbox-grid';
import search from '../../../assets/image/search.svg';
import searchDash from '../../../assets/image/search-dash.svg'
import './Search.scss';
import '../Pages.scss';
import {withRouter} from 'react-router';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faSearch, faTrashAlt, faPen  } from '@fortawesome/free-solid-svg-icons'
import withoutResult from '../../../assets/image/withoutResult.svg'
import { updateCurrentDashboard } from '../../Drawer/redux/drawerActions';
import PagesTitle from '../Component/pagesTitle';
import qs from 'query-string';

library.add(faPlus, faTrashAlt, faPlus, faPen, faSearch)

class Search extends Component {
  constructor(props){
    super(props);
    this.state ={
      search:'',
      isLoading: false,
      last_search: undefined,
      loadingMessage: undefined,
      errorMessage: undefined,
      successMessage: undefined,
      dashboards:[],
      faqs:[],
      dashboard_search: undefined,
      accountantSearch: undefined
    }
  }

  componentDidMount() {
    const searchTerm = qs.parse(this.props.location.search);
    this.handleSearch(searchTerm.q);
  }

  componentDidUpdate(oldProps) {
    const newSearchTerm = qs.parse(this.props.location.search);
    const oldSearchTerm = qs.parse(oldProps.location.search);
    if (newSearchTerm.q!=oldSearchTerm.q) {
      this.handleSearch(newSearchTerm.q);
    }
  }



  handleSearch = (searchTerm) => { 
  let searchDashboards = [];
  let searchFaqs = [];
  const sections = this.props.sections;
  const faqs = this.props.faqs
  const search = searchTerm ? searchTerm.toLowerCase() : '';
  const matchAgainst = ['title','author'];
  const matchMetric = ['name'];
  const machAttributes = ['name','value'];
  const machtFaqs = ['answer', 'question'];

    if (search.trim() == ''){
      return this.setState({
        faqs: [],
        dashboards: [],
      })  
    }

    for (var faq in faqs) {
      const matches = false;
      const currentFaqs = faqs[faq];
      machtFaqs.forEach((field) => {
        if (currentFaqs[field].toLowerCase().indexOf(search) > -1) { matches = true; }
      })
      if (matches) { searchFaqs.push(currentFaqs); }
    }

      for (var dash in this.props.dashboards) {
        const matches = false;
        const currentDashboard = this.props.dashboards[dash];
        matchAgainst.forEach((field) => {
          if (currentDashboard[field].toLowerCase().indexOf(search) > -1) { matches = true; }
        })
      for ( var metric in currentDashboard.metrics){
        const DashboardMetric = currentDashboard.metrics[metric];
        matchMetric.forEach((field)=>{
          if (DashboardMetric[field].toLowerCase().indexOf(search) > -1) { matches = true; }
        })
      }
      for ( var attribute in currentDashboard.attributes){
        const DashboardAttribute = currentDashboard.attributes[attribute];
        machAttributes.forEach((field)=>{
          if (DashboardAttribute[field].toLowerCase().indexOf(search) > -1) { matches = true; }
        })
      }
        if (matches) {
          const dashToPush = currentDashboard;
          dashToPush.section = 'section';
          searchDashboards.push(dashToPush); 
        }
        if (searchDashboards.length + searchFaqs.length >= 0 ){
            const totalSearch = searchDashboards.length + searchFaqs.length
            this.setState({
              accountantSearch:totalSearch,
            })
        }
      }
    
    this.setState({
      faqs: searchFaqs,
      dashboards: searchDashboards,
      search: '',
    })
  }

  handleKeyPress = (ev) => {
    if (ev.key == 'Enter') {
      this.handleSearch()
    }
  }

  render() {
  
    const pageTitleConfig = {
      title:"Search",
      icon:search, 
      handleInput: this.handleInput,
      value: this.state.search,
      onKeyPress: this.handleKeyPress,
      inputId:"dashboard_search",
      showSearchInput: false,
      placeholder: "Search dashboard and faqs",
      accountantSearch: this.state.accountantSearch,
    }

  const mapFaqs = this.state.faqs.map((faq, index) => {
    return <div key={index} className="pages-faq--question">
              <div>
                  <h2>{faq.question}</h2>
                  <p>{faq.answer}</p>
                </div>
              <div>
            </div> 
        </div>
  })

  const mapDashboard = this.state.dashboards.map((dashboard, index)=>{
    return  <li key={index} className="pages-dashboard__item" onClick={() => this.props.history.push(`/business_unit/${this.props.match.params.buId}/dashboards/${dashboard.id}`)}>
      <div>
        <div className="pages-dashboard__item-title">
          <img src={searchDash} />
          <div>
            <h4 className="props-title" >Dashboard</h4>
            <p>{dashboard.title}</p>
          </div>
        </div>
        <div md={3} className="pages-dashboard__item-props">
          <h4 className="props-title">Autor</h4>
          <p>{dashboard.author}</p>
          <h4 className="props-title">Colaborador</h4>
          <ul>
            { dashboard.collaborators.map((collaborators, index) => {
                return <li key={index} >{collaborators}</li>
              })
            }
         </ul>
        </div>
      </div>
      <div>
      <div className="pages-dashboard-chips">
        <div>
          <h4 className="props-title">Metricas</h4>
          <ul className="metric">
            {dashboard.metrics.map((metrics, index) => {
              return <li key={index}>{metrics.name}</li>
            })
          }
          </ul>
          </div>
          <div>
            <h4 className="props-title">attributes</h4>
            <ul className="attributes">{
              dashboard.attributes.map((attributes, index) => {
                return <li key={index}>{attributes.name}</li>
              })
            }
            </ul>
          </div>
        </div>
          <div className="pages-dashboard__description">
            <h4 className="props-title">Description</h4>
            <p>{dashboard.description}</p>
        </div>
      </div>
    </li>
   });
   
   return (
     <Fragment>
        <PagesTitle {...pageTitleConfig}/>
      <Grid>
      <div className="pages-dashboard">
          <Row className="pages-dashboard__contianer-list" center="xs">
            <ul className="pages-dashboard__list" >
              <Fragment>
                {mapDashboard}
                {mapFaqs}
              </Fragment>
              {this.state.accountantSearch <= 0 ? 
              <div className="pages-dashboard__not-result">
                <img src={withoutResult} />
                <p >Can find result</p> 
              </div>
              :  ''}
            </ul>
          </Row>
        </div>
      </Grid>
    </Fragment>
    )
  }
} 

const mapStateToProps = (store, props) => ({
  faqs: store.faqs,
  sections: store.sections, 
  dashboards: store.dashboards,
  ...props,
  
});

const mapDispatchToProps = (dispatch, props) => ({
  changeCurrentDashboard: (section, dashid) => {
    dispatch(updateCurrentDashboard(section, dashid));
  }
});

const connectedSearch = connect(mapStateToProps, mapDispatchToProps);

export default withRouter(connectedSearch(Search));

