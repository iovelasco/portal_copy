/* eslint-disable */

import React, { Component, Fragment } from 'react'
import { Grid, Row, Col } from 'react-flexbox-grid';
import './DashboardConfig.scss';

import Button from '@andes/button';
import Spinner from '@andes/spinner';
import axios from 'axios';
import Tag from '@andes/tag';
import Form from '@andes/form';
import TextField from '@andes/textfield';
import FloatingButtons from '../FloatingButtons';
import TextInput from 'react-autocomplete-input';
import { connect } from 'react-redux';
import { createDashboard } from './redux/DashboardConfigActions';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus, faGlasses } from '@fortawesome/free-solid-svg-icons';
import ModalSelectSection from '../Modals/ModalSelectSection';
import {withRouter} from 'react-router';
import moment from 'moment';

library.add(faPlus);

class DashboardConfig extends Component {
  constructor(props) {
    super(props);
    if (props.edit == true) {
      const dashboard = this.resolveDashboardFromProps(props.match.params.dashboardId);
      if (dashboard) {
        this.state = {...dashboard};
      } else {
        this.state = {...(this.nulledDashboard())};
      }
    
    } else {
      this.state = {...(this.nulledDashboard())};
    }
    
    this.handleSelectedMetric = this.handleSelectedMetric.bind(this);
    this.handleSelectedSection = this.handleSelectedSection.bind(this);
    this.addAttribute = this.addAttribute.bind(this);
    this.createDashboard = this.createDashboard.bind(this);
    this.removeMetric = this.removeMetric.bind(this)
    this.removeAttributes = this.removeAttributes.bind(this);
    this.addMetric = this.addMetric.bind(this);
    this.handleInputs = this.handleInputs.bind(this);
    this.handleOnChangeMetric = this.handleOnChangeMetric.bind(this);
    this.updateSectionPath = this.updateSectionPath.bind(this);
    this.handleModalSection = this.handleModalSection.bind(this);
    this.loadInitialData = this.loadInitialData.bind(this);
    this.resolveDashboardFromProps = this.resolveDashboardFromProps.bind(this);
    this.nulledDashboard = this.nulledDashboard.bind(this);
    this.handleDependency = this.handleDependency.bind(this);
    this.addDependency = this.addDependency.bind(this);
    this.removeDependency = this.removeDependency.bind(this);
  }


 nulledDashboard()  {
  return {
    id: undefined,
    isLoadingData: false,
    metrics: this.state ? this.state.metrics : [],
    sections: [],
    selectedMetrics: [],
    dependencies: [],
    section_id: undefined,
    section_path: undefined,
    selectedSection: undefined,
    autor: '',
    colaboradores: '',
    url: '',
    descripcion: '',
    titulo: '',
    timeMessage: '',
    attname: '',
    attvalue: '',
    attributes: [],
    metricToAdd: undefined,
    buttonSave: 'Create Dashboard',
    dependencyToAdd: '',
    update_target_time: '02:00',
    showSelectSection: false
  }

};

  componentWillMount() {
    this.loadInitialData();
  }

  componentDidMount() {
    if (this.props.edit) {
      const newDashboard = this.resolveDashboardFromProps(this.props.match.params.dashboardId);
      if (newDashboard) {
        this.setState({...newDashboard});
      } else {
        this.setState({...(this.nulledDashboard())});
      }
    } else {
      this.setState({...(this.nulledDashboard())});
    }
  }

  resolveDashboardFromProps(dashboard_id) {
    if (this.props.dashboards&&this.props.dashboards[dashboard_id]) {
      const dashboard = this.props.dashboards[dashboard_id];
      return {
        id: dashboard.id,
        isLoadingData: false,
        metrics: this.state ? this.state.metrics : [],
        sections: [],
        section_id: undefined,
        section_path: undefined,
        selectedMetrics: [...dashboard.metrics],
        selectedSection: undefined,
        autor: dashboard.author,
        colaboradores: dashboard.collaborators.join(','),
        dependencies: dashboard.dependencies,
        update_target_time: dashboard.update_target_time,
        url: dashboard.url,
        descripcion: dashboard.description,
        titulo: dashboard.title,
        attname: '',
        attvalue: '',
        timeMessage: '',
        attributes: [...dashboard.attributes],
        metricToAdd: undefined,
        buttonSave: 'Save Changes',
        dependencyToAdd: undefined,
        showSelectSection: false
      }
    }
    return undefined;
  }

  validateHour(time) {
    let splitted = time.split(':');
    if (splitted.length<3) return false;
    else {
      try {
        let horas = Number(splitted[0]);
        let minutos = Number(splitted[1]);
        let segundos = Number(splitted[2]);
        if ((horas>=0&&horas<=23)&&(minutos>=0&&minutos<=59)&&(segundos>=0&&minutos<=59)) return true;
        return false;
      } catch (error) {
        console.error(error);
        return false;
      }
    }
  }

  componentDidUpdate(oldProps) {
      if ((this.props.edit!=oldProps.edit)||(this.props.match.params.dashboardId!=oldProps.match.params.dashboardId)||(this.props.dashboards!=oldProps.dashboards)) {
        if (this.props.edit) {
          const newDashboard = this.resolveDashboardFromProps(this.props.match.params.dashboardId);
          if (newDashboard) {
            this.setState({...newDashboard});
          }
        } else {
          this.setState({...(this.nulledDashboard())});
        }
      }
      if (oldProps.isLoading==true&&this.props.isLoading==false) {
        if (this.props.recentDashboard) {
          this.props.history.push(`/business_unit/${this.props.match.params.buId}/dashboards/${this.props.recentDashboard}`);
        }
      }
  }

  async loadInitialData() {
    const bu_id = this.props.match.params.buId;
    this.setState({ isLoadingData: true });
    const metricResp = await axios.get(`/api/business_units/${bu_id}/metrics`, { headers: { 'X-DSH-Token': this.props.token } });
    this.setState({
      isLoadingData: false,
      metrics: metricResp.data.metrics
    });
  }

  addAttribute() {
    this.setState({
      attributes: [...this.state.attributes, { name: this.state.attname, value: this.state.attvalue }]
    });
    this.setState({
      attname: '',
      attvalue: ''
    });
  }

  handleInputs(ev, value) {
    
    let newState = {
      [ev.target.id]: ev.target.value
    };

    if (ev.target.id=='update_target_time') {
      console.log('es target time');
      let isValid = this.validateHour(ev.target.value);
      console.log(isValid);
      if (!isValid) newState['timeMessage'] = 'The time format is invalid';
      else newState['timeMessage'] = '';
    }

    this.setState({...newState});
  }

  handleSelectedMetric(value) {
    let currentMetrics = this.state.metrics;
    const actualMetric = currentMetrics.filter((x) => x.metric_id == value);
    const alreadyAdded = this.state.selectedMetrics.filter((x) => x.metric_id == value);
    if (alreadyAdded.length == 0) {
      this.setState({
        selectedMetrics: [...this.state.selectedMetrics, ...actualMetric]
      });
    }
  }

  removeMetric(metricID){
    let unSelectedMetric = this.state.selectedMetrics
    for (var i= 0; i < unSelectedMetric.length;i++) {
      if (unSelectedMetric[i].metric_id == metricID) unSelectedMetric.splice(i, 1);
    }
    this.setState({selectedMetrics:unSelectedMetric})
  }

  removeAttributes(nameMetric){
    let unSelectedAttribute = this.state.attributes
    for ( var i= 0; i < unSelectedAttribute.length; i++){
        if(unSelectedAttribute[i].name == nameMetric) unSelectedAttribute.splice(i, 1);
    }
    this.setState({attributes:unSelectedAttribute})
  }

  handleSelectedSection(ev, value) {
    const selSection = this.state.sections.filter((x) => x.section_id == value);
    this.setState({ selectedSection: selSection });
  }

  createDashboard() {
    if (!this.state.section_id) return alert('Debes seleccionar una seccion');
    if (!this.validateHour(this.state.update_target_time)) return alert('El formato de la hora no es correcto');
    const finalMetrics = this.state.selectedMetrics.map((x) => {
      return (x.metric_id||x.id)
    });
    let dashToPost = {
      id: this.state.id,
      author: this.state.autor,
      collaborators: this.state.colaboradores.split(','),
      url: this.state.url,
      title: this.state.titulo,
      description: this.state.descripcion,
      section: String(this.state.section_id),
      metrics: finalMetrics,
      attributes: this.state.attributes,
      dependencies: this.state.dependencies,
      update_target_time: this.state.update_target_time
    };
    console.log('dashToPost',dashToPost)
   this.props.createNewDashboard(dashToPost, this.props.match.params.buId);
  }

  updateSectionPath(path, section_id) {
    this.setState({section_path: path, section_id, showSelectSection: false});
  }
  
  handleOnChangeMetric(event) {
    this.setState({
      metricToAdd:event
    });
  }

  handleModalSection(showable) {
    this.setState({showSelectSection: showable});
  }

  handleDependency(ev) {
    this.setState({dependencyToAdd: ev})
  }

  addMetric(){
    const { metrics, metricToAdd, selectedMetrics } = this.state
    for (var i = 0; i < metrics.length ; i++) {
      if (metrics[i].metric_name.trim() == metricToAdd.trim()) {
        const addedMetrics = selectedMetrics.filter((x) => x.metric_id == metrics[i].metric_id );
        if (addedMetrics.length == 0) {
          this.setState((state) => {
            return {
              selectedMetrics: [...state.selectedMetrics, metrics[i]],
              metricToAdd: ''
            }
          });
          break;
        }
      }
    }
  }

  addDependency() {
    let exists = this.state.dependencies.find(x => x==this.state.dependencyToAdd);
    if (!exists&&this.state.dependencyToAdd) {
      let dependencies = [...this.state.dependencies, this.state.dependencyToAdd];
      this.setState({dependencies, dependencyToAdd: ''});
    }
  }

  removeDependency(dep) {
    let _dep = this.state.dependencies;
    let index = _dep.indexOf(dep);
    if (index!=-1) _dep.splice(index, 1);
    this.setState({dependencies: _dep});
  }
  
  render() {
    const { 
        metrics, 
        titulo, 
        autor, 
        colaboradores, 
        sections, 
        url, 
        descripcion, 
        attname, 
        isLoadingData, 
        buttonSave, 
        attvalue, 
        attributes,
        metricToAdd
    } = this.state;
    const metricNames = metrics.map((metricName) => metricName.metric_name);

    return (
      <Fragment>
        <Grid className="dash-config">
          <Row className="dash-config__container">
            <div className="dash-config__title-section">
              <h3>General information</h3>
            </div>
            <div className="dash-config__section">
              <Col md={6} className="dash-config__input">
                <Form>
                  <TextField id="titulo" label={"Title"} value={titulo} onChange={this.handleInputs} />
                </Form>
              </Col>
              <Col md={6} className="dash-config__input">
                <Form>
                  <TextField id="autor" label={"Author"} value={autor} onChange={this.handleInputs} />
                </Form>
              </Col>
              <Col md={6} className="dash-config__input">
                <Form>
                  <TextField id="colaboradores" label={"Contributors"} value={colaboradores} onChange={this.handleInputs} />
                </Form>
              </Col>
              <Col md={6} className="dash-config__input-section">
              <TextField label="Path" value={this.state.section_path} onChange={this.handleInputs} />
              <Button size="small" onClick={() => this.handleModalSection(true)}>Select section</Button>
              </Col>
              <Col md={6} className="dash-config__input">
                <Form>
                  <TextField id="url" label={"URL"} value={url} onChange={this.handleInputs} countdown={false} maxLength={600} multiline={true}/>
                </Form>
              </Col>
              <Col md={6} className="dash-config__input">
                <Form>
                  <TextField id="descripcion" multiline={true} label={"Description"} value={descripcion}onChange={this.handleInputs} countdown={false} maxLength={600} multiline={true}/>
                </Form>
              </Col>
              <Col md={6} className="dash-config__input">
                <Form>
                  <TextField id="update_target_time" messageShown={true} message={this.state.timeMessage} label={"Update Target Time (GMT-4)"} value={this.state.update_target_time} onChange={this.handleInputs} countdown={false} maxLength={600}/>
                </Form>
              </Col>
            </div>
            <div className="dash-config__title-section">
              <h3>Metrics</h3>
            </div>
            <div className="dash-config__section dash-config__section-tag  dash-config--autocomplete">
                <TextInput id="metricToAdd" className="andes-form-control__field" value={metricToAdd} onChange={this.handleOnChangeMetric} options={metricNames} trigger={''} placeholder="Select a metric"/>
                <FloatingButtons heightWidth={45} bgColor={"#009ee3"} icon={faPlus} modifier={"filled"} onClick={() => this.addMetric()}  /> 
              <Col md={6} className="dash-config__tags-container">
                <p>Selected metrics</p>
                <div>
                  {this.state.selectedMetrics.map((metric) => {
                    return <Tag label={metric.metric_name||metric.name} onClose={() => this.removeMetric(metric.metric_id)} />
                  }
                  )}
                </div>
              </Col>
            </div>
            <div className="dash-config__title-section ">
              <h3>Attributes</h3>
            </div>
            <Row className="dash-config__section dash-config__section-tag ">
              <Col md={6} className="dash-config--atributos">
                  <Col md={6}>
                    <Form>
                      <TextField id="attname" value={attname} label={"Name"} onChange={this.handleInputs} />
                    </Form>
                  </Col>
                  <Col md={5}>
                    <Form>
                      <TextField id="attvalue" value={attvalue} label={"Value"} onChange={this.handleInputs} />
                    </Form>
                  </Col>
                    <FloatingButtons heightWidth={45} bgColor={"#009ee3"} icon={faPlus} modifier={"filled"} onClick={this.addAttribute} />
              </Col>
              <Col md={6} className="dash-config__tags-container">
                  <p>Selected Attributes</p>
                  <div>
                    {attributes.map((attributes) => {
                      return <Tag label={`${attributes.name} : ${attributes.value}`} onClose={()=> this.removeAttributes(attributes.name)}/>
                    })}
                  </div>
              </Col>
              </Row>
              <div className="dash-config__title-section">
              <h3>Dependencies</h3>
            </div>
            <div className="dash-config__section dash-config__section-tag  dash-config--autocomplete">
                <TextInput id="metricToAdd" className="andes-form-control__field" value={this.state.dependencyToAdd} onChange={this.handleDependency} placeholder="Type a dependency"/>
                <FloatingButtons heightWidth={45} bgColor={"#009ee3"} icon={faPlus} modifier={"filled"} onClick={() => this.addDependency()}  /> 
              <Col md={6} className="dash-config__tags-container">
                <p>Selected dependencies</p>
                <div>
                  {this.state.dependencies.map((dep) => {
                    return <Tag label={dep} onClose={() => this.removeDependency(dep)} />
                  }
                  )}
                </div>
              </Col>
            </div>
             <div className="dash-config__footer">
                <Button modifier={"filled"} onClick={this.createDashboard}  > {buttonSave} </Button>
            </div>
          </Row>
        </Grid>
        <Spinner label="Loading necessary information" show={isLoadingData} />
        <ModalSelectSection showing={this.state.showSelectSection} editing={true}  onSelectedSection={this.updateSectionPath}/>
      </Fragment>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    bu_id: state.buId,
    token: state.token,
    dashboard: state.currentDashboard,
    sections: state.sections,
    dashboards: state.dashboards,
    isLoading: state.isLoading,
    recentDashboard: state.recentDashboard
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createNewDashboard: function (data, buid) {
      dispatch(createDashboard(data, buid));
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DashboardConfig));