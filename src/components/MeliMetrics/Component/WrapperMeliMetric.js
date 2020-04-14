/* eslint-disable */
import React, { Component, Fragment } from 'react';
import { Grid, Row } from 'react-flexbox-grid';
import { connect } from 'react-redux';
import GraphicWrapper from './GraphicWrapper';
import Button from '@andes/button';
import AutoSuggest from './AutoSuggest';
import TagList from './TagList';
import Notification from './Notification';
import wellcomeImage from '../../../assets/image/wellcome-bg.svg';
import '../MeliMetrics.scss';
import ModalMelimetric from './ModalMelimetric';
//import async from 'async';
import axios from 'axios';
import eachLimit from 'async/eachLimit';
import ld from 'lodash';

import {
  deleteMetric,
  postNewUserConfiguration,
  newUserConfiguration,
  loadInitialData,
} from '../redux/action';
import '../MeliMetrics.scss';
import { create } from 'domain';

const mapStateToProps = (store, props) => ({
  token: store.token
});

const mapDispatchToProps = dispatch => ({
  handleInitialData() {
    dispatch(loadInitialData());
  },
  handleGraphicConfiguration(newConfiguration) {
    dispatch(postNewUserConfiguration(newConfiguration));
  },
  handleRemoveMetric(metricId) {
    dispatch(deleteMetric(metricId));
  },
  handleNewConfig(){
    dispatch(newUserConfiguration());
  },
  handleModalData(id, property, value){
    dispatch(updateModalData(id, property, value))
  },
});

class WrapperMeliMetric extends Component {

  constructor(props) {
    super(props);
    this.state = {
      alertModalConfiguration: {
        showModal: false,
        metricId: undefined,
        metricName: undefined,
        availableSites: []
      },
      available_metrics: [],
      saved_charts: [],
      newConfiguration:undefined,
      configurationSaved:false,
      buttonStatus:'filled',
      buttonText:'Save graphics',
      messageSnackBar:'Graphics were saved',
      metric_id:undefined,
      user_id:undefined,
      deviation_period:'ly',
      deviation_unit:'percentage',
      deviation_amount:'10%',
      level:undefined,
      filters:undefined,
      disableUnit:false,
      disablePeriod:false,
      site_id:undefined,
      siteListFromAlert:[],
      currentSide:undefined,
      siteInAlert: undefined
    };
    this.handleConfigurationSaved = this.handleConfigurationSaved.bind(this);
    this.handleAlertId = this.handleAlertId.bind(this);
    this.handleAlertPeriod = this.handleAlertPeriod.bind(this);
    this.handleAlertUnit = this.handleAlertUnit.bind(this);
    this.handleAlertPercentage = this.handleAlertPercentage.bind(this);
    this.handleSideAlert = this.handleSideAlert.bind(this);
    this.handleCurrentSide = this.handleCurrentSide.bind(this);
    this.handleSiteFromAlert = this.handleSiteFromAlert.bind(this);
    this.loadMetrics = this.loadMetrics.bind(this);
    this.addNewMetric = this.addNewMetric.bind(this);
    this.removeMetric = this.removeMetric.bind(this);
    this.handleConfigurationChange = this.handleConfigurationChange.bind(this);
    this.saveConfigurations = this.saveConfigurations.bind(this);
    this.showModalAlert = this.showModalAlert.bind(this);
    this.closeModalAlert = this.closeModalAlert.bind(this);
  };

  async componentWillMount() {
    try {
      this.props.handleInitialData();
      this.loadMetrics(true, true);
    } catch (error) {
      console.log(error);
    };
  };

  async loadMetrics(refreshCharts, refreshMetrics) {

    const getCharts = async () => {
      try {
        const {data} = await axios.get(`/api/charts`, {headers:{ 'X-DSH-Token': this.props.token}});
        const foundCharts = data.foundCharts.map((ch) => {
          const nch = {
            "site_id": "MLA",
            "graphic_type": "bar",
            "cy": {
              "color" :"blue"
            },
            "ly": {
              "color": "grey"
            }, metric_id: ch.metric_id, ...ch.configuration
          }
          return nch;
        });
        console.log(foundCharts);
        return {data: foundCharts, success: true}
      } catch (error) {
        return {success: false, error}
      } 
    }

    const getAvailableMetrics = async () => {
      try {
        const {data} = await axios.get('/api/melimetrics/metrics');
        return {data: data.metrics, success: true}
      } catch (error) {
        return {success: false, errror}
      }
    }

    let state = {};
    if (refreshCharts) {
      state['saved_charts'] = (await getCharts()).data;
    }

    if (refreshMetrics) {
      state['available_metrics'] = (await getAvailableMetrics()).data;
    }

    state.saved_charts = state.saved_charts.map((p) => {
      const foundMetric = state.available_metrics.find(x => x.id==p.metric_id);
      p.modified = false;
      p.is_calculation = foundMetric.is_calculation;
      p.display_name = foundMetric.display_name;
      p.display_type = foundMetric.display_type;
      return p;
    });

    this.setState({...state});

  }

  createDefaultConfig() {
    return {
      selectSite: 'MLA',
      selectBgColor: 'grey',
      selectLineColor: 'blue',
      selectRande: {},
      measureUnit: 'Millions',
      graphicType: 'Bar'
    }
  }

  async saveConfigurations() {
    const newConfigs = this.state.saved_charts.filter(sv => {
      return sv.modified
    }).map((p) => {
      const config = ld.pick(p, ['site_id', 'graphic_type', 'cy', 'ly']);
      delete config.selectRande;
      return {metric_id: p.metric_id, configuration: config}
    });
    console.log(newConfigs);
    if (newConfigs.length>0) {
      try {
        await axios.put(`/api/charts`, {configurations: newConfigs}, { headers: { 'X-DSH-Token': this.props.token }});
        this.setState({saved_charts: this.state.saved_charts.map(p => {
          const np = p;
          np.modified = false;
          return np;
        }), configurationSaved: !this.state.configurationSaved});
        setTimeout(() =>{this.setState({configurationSaved: false});},1000);
      } catch (error) {
        console.error(error);
      }
    }
  }

  removeMetric(metricId) {
    const newCharts = this.state.saved_charts.filter(f => {
      if (f.metric_id==metricId) return false;
      return true;
    });
    axios.delete(`/api/charts`, {headers: { 'X-DSH-Token': this.props.token}, data: {metric_id: metricId}}).then(() => console.log('deleted ok'))
    .catch((error) => console.error(error));
    this.setState({saved_charts: newCharts})
  }

  addNewMetric(metricId) {
    const foundSaved = this.state.saved_charts.filter(s => {
      if (s.metric_id==metricId) return true;
      return false;
    });
    if (foundSaved.length==0) {
      const foundMetric = this.state.available_metrics.filter(m => {
        if (m.id == metricId) return true;
        return false;
      })[0];
      this.setState({saved_charts: [{metric_id: metricId, modified: true, is_calculation: foundMetric.is_calculation, display_type: foundMetric.display_type, display_name: foundMetric.display_name, graphic_type: 'bar', site_id: "MLA", cy: {color: 'blue'}, ly: {color: 'grey'}}, ...this.state.saved_charts, ]});
      window.scrollTo(0, window.innerHeight);
    }
  }

  showModalAlert(metricId, availableSites) {
    const foundMetric = this.state.available_metrics.filter((p) => p.id == metricId);
    if (foundMetric.length!=0) {
      const metricName = foundMetric[0].display_name;
      const currentConfiguration = Object.assign({}, this.state.alertModalConfiguration, {showModal: true, metricId, metricName, availableSites: availableSites||[]});
      this.setState({alertModalConfiguration: currentConfiguration});
    }
  }

  closeModalAlert() {
    this.setState({alertModalConfiguration: {showModal: false, metricId: undefined, metricName: undefined, availableSites: []}});
  }


  handleSiteFromAlert(ev, site) {
    this.setState({siteInAlert: site});
  }

  handleConfigurationSaved(newConfiguration){
    this.props.handleGraphicConfiguration(newConfiguration);

  };

  handleConfigurationChange(cfgKey, metricId, newValue) {
    const savedCharts = this.state.saved_charts.map((sv) => {
      if (sv.metric_id==metricId) {
        const nsv = sv;
        nsv[cfgKey] = newValue;
        nsv.modified = true;
        return nsv;
      }
      return sv;
    });
    this.setState({saved_charts: savedCharts});
  }

  handleAlertConfigurationChange(key, value, metric_id) {
    const actualConfig = Object.assign({}, this.state.modalConfigAlert);
    actualConfig[key] = value;
    this.setState({modalConfigAlert: actualConfig});
  }

  handleAlertPeriod(ev){
    this.setState({ deviation_period:ev});
  };
  
  handleAlertUnit(ev){ 
    console.log('Deviation unit: ', ev);
    this.setState({ deviation_unit:ev});
  };
  
  handleAlertPercentage(ev){
    this.setState({ deviation_amount:ev.target.value });
  };

  handleAlertId(metrid_id){
    this.setState({metric_id: metrid_id });
  };

  handleSideAlert(siteListFromAlert){
    this.setState({siteListFromAlert:siteListFromAlert});
  };

  handleCurrentSide(ev, side){
    this.setState({currentSide:side});
  }

  handleModalData(ev, value) {
    this.props.updateNewGraphProperty(this.props.metric.metric_id, 'graphicType', value);
  };

  render() {

    const { toggleDrawer } = this.props
    const showElements = this.state.saved_charts.length != 0;

    return (
      <Grid fluid className="meli-metric">
        <Row>
          <Fragment>
            {(showElements) ?
              <Fragment>
                <div style={(toggleDrawer)?drawerOpen:drawerClose} className="meli-metric__search-container">
                  <AutoSuggest availableMetrics={this.state.available_metrics} onMetricAdded={this.addNewMetric}/>
                    <TagList renderList={this.state.saved_charts} title="Added Metrics" onRemoveMetric={this.removeMetric}/>
                   <div className="meli-metric__footer">
                    <Button onClick={this.saveConfigurations} size="small" modifier={this.state.buttonStatus}>{this.state.buttonText}</Button>
                  </div>
                </div>
              </Fragment> : undefined}
            <div style={(toggleDrawer)?bodyDrawerOpen:bodyDrawerClose} className="meli-metric__wrapper-graphics">
              {(showElements) ? 
              <Fragment>
                {
                this.state.saved_charts.map((cfg, i) => {
                  console.log(cfg);
                  return <GraphicWrapper
                  selectedSite={cfg.site_id}
                  cyColor={cfg.cy.color}
                  lyColor={cfg.ly.color}
                  selectedGraphicType={cfg.graphic_type}
                  onAlertConfig={this.showModalAlert}
                  onConfigChange={this.handleConfigurationChange}
                  key={cfg.metric_id}
                  handleCurrentSide={this.handleCurrentSide}
                  handleAlertId={this.handleAlertId}
                  handleSideAlert={this.handleSideAlert}
                  metric_id={cfg.metric_id}
                  metric={{...cfg}}
                  onRemoveMetric={this.removeMetric}/> })
                }
              </Fragment> : undefined  }
              <div id="fin" ref={(el) => {this.finGraf = el}}/>
            </div>
            {(!showElements) ? 
                  <div className="meli-metric__wellcome-message">
                    {/*
                  <div className="meli-metric__help-icon">
                    <img src={wellcomeImage} />
                    </div>*/}
                  <p>Welcome to MELI Metrics</p>
                  <p>Add a metric by typing the name below</p>
                  <AutoSuggest availableMetrics={this.state.available_metrics} onMetricAdded={this.addNewMetric}/>
                </div>
              : undefined}
          </Fragment>
        </Row>
        <ModalMelimetric
          modalConfiguration={this.state.alertModalConfiguration}
          onClose={this.closeModalAlert}
          />
        <Notification 
            configurationSaved={this.state.configurationSaved}
            message="Your configuration was saved"
            type="success" 
            container="bottom-center"
            duration={2000}
            />
      </Grid>
    );
  }
};

const bodyDrawerOpen = {
  width: '87%',
  right:0,
  left:'auto',
};

const bodyDrawerClose = {
  width: '85%',
  right:0,
  left:'auto',
}

const drawerOpen = {
  width: '13%',
};

const drawerClose = {
  width: '15%',
  left:"auto",
  borderLeft:'4px solid #fff159'
}

export default connect(mapStateToProps, mapDispatchToProps)(WrapperMeliMetric)

