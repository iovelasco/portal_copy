/* eslint-disable */
import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux'
import { Grid, Row, Col } from 'react-flexbox-grid';
import metricIcon from '../../../assets/image/metric.svg';
import './Metric.scss';
import '../Pages.scss';
import FloatingButtons from '../../FloatingButtons';
import Card from '@andes/card';
import TextField from '@andes/textfield'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faSearch, faTrashAlt, faPen  } from '@fortawesome/free-solid-svg-icons'
import Button from '@andes/button';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableData } from '@andes/table';
import ModalMetric from '../../Modals/ModalAddMetric';
import Spinner from '@andes/spinner';
import axios from 'axios';
import PagesTitle from '../Component/pagesTitle';
import { updateMetric } from '../redux/pagesAction';
import { createNewMetric } from '../../Modals/redux/modalActions';

library.add(faPlus, faTrashAlt, faPlus, faPen, faSearch)

class Metric extends Component {

  constructor(props) {
    super(props);
    this.state = {
      metrics: [],
      isLoading: false,
      metric_search: undefined,
      last_search: undefined,
      loadingMessage: undefined,
      errorMessage: undefined,
      successMessage: undefined,
      editMetric:false,
      metricToEdit: undefined
    };
    this.handleInput = this.handleInput.bind(this);
    this.makeSearch = this.makeSearch.bind(this);
    this.deleteMetric = this.deleteMetric.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    if (window.dataLayer) {
      window.dataLayer.push({
          'event': 'trackPageview',
          'businessUnit': this.props.buName,
          'section': 'Options',
          'title': 'View Metrics'
        });
  }
  }

  componentDidUpdate() {
      if (window.dataLayer) {
        window.dataLayer.push({
            'event': 'trackPageview',
            'businessUnit': this.props.buName,
            'section': 'Options',
            'title': 'View Metrics'
          });
    }
  }

  handleInput (ev) {
    this.setState({
      [ev.target.id]: ev.target.value
    });
  }

  handleEdit (metric) {
    this.props.handleUpdateMetric(metric.metric_id)
    this.setState({
      editMetric: true,
      metricToEdit: metric
    })
  }

  closeModal (){
    this.props.cancelToggle()
    this.setState({
      editMetric: false
    })
  }

  loadMetrics(bu_id, search_term) {
    return new Promise(async (resolve, reject) => {
      try {
        const metrics = await axios.get(`/api/business_units/${bu_id}/metrics?name=${search_term.toLowerCase()}`, {headers: {'X-DSH-Token': this.props.token}});
        resolve(metrics.data.metrics);
      } catch (error) {
        reject();
      }
    });
  }

  async makeSearch(showSpinner) {
    try {
      const last_search = this.state.metric_search.toLowerCase();
      if (last_search.trim() == ''){
        return this.setState({
          metrics:[],
        })  
      }
      this.setState({isLoading: showSpinner, loadingMessage: 'Buscando metrica...', last_search});
      const metrics = await this.loadMetrics(this.props.buId, this.state.metric_search);

      this.setState({isLoading: false, metrics: metrics, errorMessage: undefined, successMessage: undefined});
    } catch (error) {
      this.setState({isLoading: false, errorMessage: undefined, successMessage: undefined});
    }
  }

  async deleteMetric(metricId) {
    try {
      this.setState({isLoading: true, loadingMessage: 'Borrando metrica...'});
      const deleted = await axios.delete(`/api/business_units/${this.props.buId}/metrics/${metricId}`, {headers: {'X-DSH-Token': this.props.token}});
      this.setState({isLoading: true, loadingMessage: 'Actualizando metricas...'});
      const metrics = await this.loadMetrics(this.props.buId, this.state.last_search);
      this.setState({isLoading: false, metrics: metrics, successMessage: 'Metrica borrada correctamente.', errorMessage: undefined});      
    } catch (error) {
      this.setState({isLoading: false, errorMessage: 'No se puede eliminar la metrica porque está asociada a un dashboard.', successMessage: undefined});
    }
  }


  handleKeyPress = (ev) => {
    if(ev.key == 'Enter'){
      this.makeSearch()
    }
  }

  render() {

  const metricTableContent = (this.state.metrics).map((x)=>{
    return(
      <TableRow selected={false} key={x.metric_id}>
        <TableData data-title="Name">{x.metric_name}</TableData>
        <TableData data-title="Definicion">{x.metric_description}</TableData>
        {this.props.role&&this.props.role.can_create_metrics ? <TableData className="pages-metric__button-option-row" data-title="Acciones">
          <FloatingButtons heightWidth={45} bgColor={"#fff"} iconColor={"#f23d4f"} onClick={() => this.deleteMetric(x.metric_id)} icon={faTrashAlt}  modifier="outline" />
          <FloatingButtons heightWidth={45} bgColor={"#fff"} iconColor={"#009ee3"} onClick={() => this.handleEdit(x)} icon={faPen}  modifier="outline" />
        </TableData> : ''}
    </TableRow>
    );
  });

  const pageTitleConfig = {
    title:"Metrics",
    icon:metricIcon, 
    makeSearch:() => this.makeSearch(true),
    role:this.props.role,
    handleInput: this.handleInput,
    value: this.state.search,
    inputId:"metric_search",
    showSearchInput: false,
    requiredRole: 'can_create_metrics',
    handleModal:this.props.handleModalMetric,
    headerAction: "Add metric"
  }
  return (
    <Fragment>
      <PagesTitle {...pageTitleConfig}/>
      <Grid>
        <Row className="pages-metric" center="xs">
        <Col md={12}>
        <Card paddingSize={16} className="pages-metric--search" >
          <TextField 
            textbox
            id="metric_search"
            onChange={this.handleInput}
            value={this.state.search}
            onKeyPress={this.handleKeyPress}
            placeholder='Example "GMV"'
          />
          <Button
            modifier="filled"
            onClick={this.makeSearch}
          > Search </Button>
          </Card>
        </Col>
        <Col md={12}>
          <Card paddingSize={16} >
              <p style={{color: this.state.errorMessage ? 'red' : 'green'}}>{this.state.errorMessage||this.state.successMessage}</p>
              <Table >
                <TableHead>
                  <TableHeader>Name</TableHeader>
                  <TableHeader>Description</TableHeader>
                  {this.props.role == 'admin' ? <TableHeader className="pages-metric__button-option-header">Actions</TableHeader> : ''}
                </TableHead>
                <TableBody>
                  {metricTableContent}
                </TableBody>
              </Table>
          </Card>
          </Col>
        </Row>
      </Grid>
      {this.state.editMetric == true ? 
        <ModalMetric  
            callbackUpdate={() => this.makeSearch(false)}
            metricId={this.state.metricToEdit.metric_id} 
            name={this.state.metricToEdit.metric_name} 
            description={this.state.metricToEdit.metric_description}
            editMetric={true} closeModal={this.closeModal} 
         /> 
            : 
         <ModalMetric 
            callbackUpdate={() => this.makeSearch(false)}  
            editMetric={false} 
            closeModal={this.closeModal}
         />}
      <Spinner moodifier="inline" label={this.state.loadingMessage} show={this.state.isLoading}/>
    </Fragment>
    )
  }

}

const mapStateToProps = (store, props) => ({
  metrics: store.metrics,
  buId: store.buId,
  role: store.role,
  token: store.token,
  buName: store.buName,
  ...props,
  
});

const mapDispatchToProps = (dispatch) => {
  return {
      cancelToggle: () => {
        dispatch({ type: 'CLOSE_MODAL_METRIC' });
      },
      handleModalMetric: () => {
          dispatch({type: 'SHOW_MODAL_METRIC'});
      },
      handleUpdateMetric: (metric_id) => {
        dispatch({type: 'SHOW_MODAL_METRIC'})
      },
      createMetric: (buId, faqData, token) => {
        dispatch(createNewMetric(buId, faqData, token));
      },
  }
}


const connectedMetric = connect(mapStateToProps, mapDispatchToProps );
export default connectedMetric(Metric);

