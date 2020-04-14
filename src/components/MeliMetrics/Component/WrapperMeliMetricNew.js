/* eslint-disable */
import React, { Component, Fragment, useReducer, useEffect } from 'react';
import { Grid, Row } from 'react-flexbox-grid';
import { connect } from 'react-redux';
import GraphicWrapper from './GraphicWrapperNew';
import Button from '@andes/button';
import AutoSuggest from './AutoSuggest';
import TagList from './TagList';
import Notification from './Notification';
import '../MeliMetrics.scss';
import ModalMelimetric from './ModalMelimetric';
import axios from 'axios';
import ld from 'lodash';
import parallel from 'async/parallel';
import '../MeliMetrics.scss';
import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from 'constants';

const metricsState = {
  charts: [],
  metrics: []
};

const generalState = {
  is_loading: false,
  is_saving: false,
  show_modal: false
}

const initialModalState = {
  show: false,
  metricId: undefined,
  metricName: undefined,
  availableSites: []
}

const types = {
  SET_METRICS: 'SET_METRICS',
  SET_CHARTS: 'SET_CHARTS',
  SET_INITIAL_DATA: 'SET_INITIAL_DATA'
}

const generalTypes = {
  START_LOADING: 'START_LOADING',
  ENDED_LOADING: 'ENDED_LOADING',
  SAVING_CONFIGURATION: 'SAVING_CONFIGURATION',
  SAVED_CONFIGURATION: 'SAVED_CONFIGURATION',
  SHOW_ALERT_MODAL: 'SHOW_ALERT_MODAL',
  CLOSE_ALERT_MODAL: 'CLOSE_ALERT_MODAL'
}

const modalTypes = {
  SHOW_MODAL: 'SHOW_MODAL',
  CLOSE_MODAL: 'CLOSE_MODAL'
}

const modalReducer = (state, action) => {
  switch (action.type) {
    case modalTypes.SHOW_MODAL:
      return {show: true, metricId: action.metricId, availableSites: action.sites, metricName: action.metricName}
    case modalTypes.CLOSE_MODAL:
      return {show: false, metricId: undefined, availableSites: [], metricName: undefined}
    default:
      return state;
  }
}

const metricsReducer = (state, action) => {
  switch (action.type) {
    case types.SET_METRICS:
      return {...state, metrics: action.metrics}
    case types.SET_INITIAL_DATA:
      return {...state, metrics: action.metrics, charts: action.charts}
    case types.SET_CHARTS:
      return {...state, charts: action.charts}
    default:
      return state
  }
}

const generalReducer = (state, action) => {
  switch (action.type) {
    case generalTypes.START_LOADING:
      return {...state, is_loading: true}
    case generalTypes.ENDED_LOADING:
      return {...state, is_loading: false}
    case generalTypes.SAVING_CONFIGURATION:
      return {...state, is_saving: true}
    case generalTypes.SAVED_CONFIGURATION:
      return {...state, is_saving: false}
    case generalTypes.SHOW_ALERT_MODAL:
      return {...state, show_modal: true}
    case generalTypes.CLOSE_ALERT_MODAL:
      return {...state, show_modal: false}
    default:
      return state
  }
}

const mapStateToProps = (store, props) => ({
  token: store.token
});

function WrapperMeliMetric (props) {

  const [state, dispatch] = useReducer(metricsReducer, metricsState);
  const [gralState, gralDispatch] = useReducer(generalReducer, generalState);
  const [modalState, modalDispatch] = useReducer(modalReducer, initialModalState);

  const getCharts = async () => {
    try {
      const {data} = await axios.get(`/api/charts`, {headers:{ 'X-DSH-Token': props.token}});
      return {
        charts: data.foundCharts.map(x => {
          const {configuration, metric_id} = x;
          return {...configuration, metric_id}
        })
      }
    } catch (error) {
      return {charts: []}
    } 
  }
  
  const getMetrics = async () => {
    try {
      const {data} = await axios.get('/api/melimetrics/metrics');
      const {metrics} = data;
      return {metrics}
    } catch (error) {
      return {metrics: []}
    }
  }
  
  const loadMetrics = async () => {
    try {
      let [{charts}, {metrics}] = await Promise.all([getCharts(), getMetrics()]);
      charts = charts.map(chart => {
        let foundMetric = metrics.find(m => m.id==chart.metric_id);
        if (foundMetric) {
          const {display_name, display_type, is_calculation} = foundMetric;
          const {cy, ly, site_id, graphic_type} = chart;
          return {cy, ly, site_id, graphic_type, display_name, display_type, is_calculation, is_modified: false, metric_id: chart.metric_id}
        }
      });
      dispatch({type: types.SET_INITIAL_DATA, metrics, charts});
    } catch (error) {
      console.log('There was an error');
      console.error(error);
    }
  }

  useEffect(() => {
    loadMetrics();
  }, []);

  const changeChartProperty = (metricId) => {
    return function(key, value) {
      let charts = state.charts.map(chart => {
        if (chart.metric_id==metricId) {
          chart[key] = value;
          chart.is_modified = true;
        }
        console.log('chart: ', chart);
        return chart;
      });
      dispatch({type: types.SET_CHARTS, charts});
    }
  }

  const saveConfigurations = async () => {
    const configurations = state.charts.filter(x => x.is_modified).map(x => {
      const {site_id, graphic_type, cy, ly, metric_id} = x;
      return {metric_id, configuration: {site_id, graphic_type, cy, ly}}
    });
    if (configurations.length) {
      await axios.put('/api/charts', {configurations}, {headers: {'X-DSH-Token': props.token}});
      gralDispatch({type: generalTypes.SAVING_CONFIGURATION});
      setTimeout(() => gralDispatch({type: generalTypes.SAVED_CONFIGURATION}), 2000);
    }
  }

  const removeMetric = metricId => {
    return function () {
      let charts = state.charts.filter(x => x.metric_id!=metricId);
      axios.delete(`/api/charts`, {headers: { 'X-DSH-Token': props.token}, data: {metric_id: metricId}}).then(() => console.log('deleted ok'))
      dispatch({type: types.SET_CHARTS, charts});
    }
  }

  const addNewMetric = metricId => {
    console.log(metricId);
    const metric = state.metrics.find(x => x.id==metricId);
    const chart = state.metrics.find(x => x.metric_id==metricId);
    if (metric&&!chart) {
      const {id : metric_id, display_name, display_type, is_calculation} = metric;
      let data = {
        metric_id, display_name, display_type, is_calculation,
        site_id: 'MLA',
        is_modified: true,
        graphic_type: 'bar',
        cy: {color: 'blue'},
        ly: {color: 'grey'}
      }
      let copyCharts = state.charts;
      copyCharts.unshift(data);
      dispatch({type: types.SET_CHARTS, charts: copyCharts});
    }
  }

  const onOpenModalAlert = (metricId, availableSites) => {
    console.log(metricId);
    let metric = state.metrics.find(x => x.id==metricId);
    if (metric) {
      let action = {type: modalTypes.SHOW_MODAL, sites: availableSites, metricId, metricName: metric.display_name};
      console.log(action);
      modalDispatch(action);
    }
  }

  return (
    <Grid fluid className="meli-metric">
        <Row>
          <Fragment>
            {(state.charts.length) ?
              <Fragment>
                <div style={(props.toggleDrawer)?drawerOpen:drawerClose} className="meli-metric__search-container">
                  <AutoSuggest availableMetrics={state.metrics} onMetricAdded={addNewMetric}/>
                    <TagList renderList={state.charts} title="Added Metrics" onRemoveMetric={removeMetric}/>
                   <div className="meli-metric__footer">
                    <Button onClick={saveConfigurations} size="small" >Save graphics</Button>
                  </div>
                </div>
              </Fragment> : undefined}
            <div style={(props.stoggleDrawer)?bodyDrawerOpen:bodyDrawerClose} className="meli-metric__wrapper-graphics">
              {(state.charts.length) ? 
              <Fragment>
                  {state.charts.map(x => {
                    return <GraphicWrapper
                            key={x.metric_id}
                            onPropertyChange={changeChartProperty(x.metric_id)}
                            metricId={x.metric_id}
                            metricName={x.display_name}
                            isCalculation={x.is_calculation}
                            displayType={x.display_type}
                            siteId={x.site_id}
                            cy={x.cy}
                            ly={x.ly}
                            graphicType={x.graphic_type}
                            onOpenModalAlert={onOpenModalAlert}
                            onRemove={removeMetric(x.metric_id)}
                            />
                  })}
              </Fragment> : undefined  }
              
            </div>
            {(!state.charts.length) ? 
                  <div className="meli-metric__wellcome-message">
                    {/*
                  <div className="meli-metric__help-icon">
                    <img src={wellcomeImage} />
                    </div>*/}
                  <p>Welcome to MELI Metrics</p>
                  <p>Add a metric by typing the name below</p>
                  <AutoSuggest availableMetrics={state.metrics} onMetricAdded={addNewMetric}/>
                </div>
              : undefined}
          </Fragment>
        </Row>
        <ModalMelimetric
          modalConfiguration={modalState}
          onClose={() => modalDispatch({type: modalTypes.CLOSE_MODAL})}
          />
        <Notification 
            configurationSaved={gralState.is_saving}
            message="Your configuration was saved"
            type="success" 
            container="bottom-center"
            duration={2000}
            />
      </Grid>
  )
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

export default connect(mapStateToProps)(WrapperMeliMetric)

