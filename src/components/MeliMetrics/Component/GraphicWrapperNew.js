/* eslint-disable */
import React, { Component, Fragment, useReducer, useEffect } from 'react';
import { connect } from 'react-redux';
import Spinner from '@andes/spinner';
import '../MeliMetrics.scss';
import GraphicSetup from './GraphicSetupNew';
import Colors from './Colors'
import moment from 'moment';
import Notification from './Notification';
import ld from 'lodash';
import Graphic from './Graphic';
import axios from 'axios';
import {  
  updateGraphProperty,
} from '../redux/action';
import parallel from 'async/parallel';
import qs from 'query-string';

const url = '/api/melimetrics/metrics';

const mapDispatchToProps = dispatch => ({
  updateNewGraphProperty: (id, property, value) => {
    dispatch(updateGraphProperty(id, property, value));
  },
  measureAction:(id,measure)=>{
    dispatch(updatePayloadMeasure(id,measure))
  },
});

const initialState = {
  timespan: '12months',
  is_loading: false,
  data: undefined,
  maxValue: 0,
  values: {
    site_id: [],
    timestamps: []
  }
}

const types = {
  SET_TIMESPAN: 'SET_TIMESPAN',
  START_LOADING: 'START_LOADING',
  END_LOADING: 'END_LOADING',
  SET_INITIAL_DATA: 'SET_INITIAL_DATA',
  SET_DATA: 'SET_DATA',
  SET_MAX_VALUE: 'SET_MAX_VALUE'
}

const reducer = (state, action) => {
  switch (action.type) {
    case types.SET_TIMESPAN:
      return {...state, timespan: action.timespan}
    case types.START_LOADING:
      return {...state, is_loading: true}
    case types.END_LOADING:
      return {...state, is_loading: false}
    case types.SET_INITIAL_DATA:
      return {...state, data: action.data, values: action.values, maxValue: action.maxValue}
    case types.SET_DATA:
      return {...state, data: action.data}
    default:
      return state;
  }
}

export default function NewGraphicWrapper(props) {

  console.log(props);
  
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    loadInitialData();
  }, [props.siteId, state.timespan]);

  useEffect(() => {
    updateColor(props.cy.color, props.ly.color);
  }, [JSON.stringify(props.cy), JSON.stringify(props.ly)]);

  function updateColor(cyColor, lyColor) {
    if (state.data) {
      let newData = Object.assign({}, state.data);
      ['backgroundColor', 'borderColor', 'hoverBackgroundColor', 'hoverBorderColor'].forEach(x => {
        newData.datasets[0][x] = cyColor;
        newData.datasets[1][x] = lyColor;
      });
      dispatch({type: types.SET_DATA, data: newData});
    }
  }

  async function getMetricData() {
    const {metricId, siteId : site_id} = props;
    let params = {
      period: state.timespan
    };
    if (site_id!='all') params['site_id'] = site_id;
    let query = qs.stringify(params);
    try {
      const {data} = await axios.post(`/api/melimetrics/metrics/${metricId}/data?${query}`, {});
      return data.data.results;
    } catch (error) {
      return [];
    }
  }

  async function getMetricValues() {
    try {
      const {metricId} = props;
      const {data} = await axios.get(`/api/melimetrics/metrics/${metricId}/values`);
      return data;
    } catch (error) {
      return {};
    }
  }

  async function loadInitialData() {
    try {
      dispatch({type: types.START_LOADING});
      let [data, values] = await Promise.all([getMetricData(), getMetricValues()]);
      const datasets = generateDatasets(data);
      console.log(datasets);
      dispatch({type: types.SET_INITIAL_DATA, data: datasets.data, maxValue: datasets.maxValue, values});
      dispatch({type: types.END_LOADING});
    } catch (error) {
      console.log(error);
    }
  }

  function buildDataset(metricName, color, isLy) {
    const defaultObj = {};
    ['backgroundColor', 'borderColor', 'hoverBackgroundColor', 'hoverBorderColor'].forEach((colp) => {
        defaultObj[colp] = color;
    });
    defaultObj.borderWith = 0;
    defaultObj.data = [1];
    defaultObj.label = (() => {
      if (isLy) return `${metricName} LY`
      else return metricName;
    })();
    return defaultObj;    
  }

  function generateDatasets(data) {
    const finalData = {};
    const {metricName, cy, ly} = props;
    let currentYearDS = buildDataset(metricName, cy.color);
    let lastYearDS = buildDataset(metricName, ly.color, true);
    let filteredData = data.sort((a, b) => moment(a.timestamp).diff(moment(b.timestamp)));
    const uniqueLabels = ld.uniq(filteredData.map((a) => moment.parseZone(a.timestamp).format('YYYY-MM-DD')));
    finalData.labels = uniqueLabels;
    let maxValue = state.maxValue;
    currentYearDS.data = filteredData.map(fd => {
      maxValue = Math.max(fd.value, maxValue);
      return fd.value
    });
    lastYearDS.data = filteredData.map(fd => {
      maxValue = Math.max(fd.value_ly, maxValue);
      return fd.value_ly
    });
    finalData.datasets = [currentYearDS, lastYearDS];
    return {data: finalData, maxValue};
  }

  return (
    <div className="meli-metric__graphic-card" >
        <GraphicSetup
          metricName={props.metricName}
          metricId={props.metricId}
          ly={props.ly}
          cy={props.cy}
          sites={state.values.site_id}
          graphicType={props.graphicType}
          onOpenModalAlert={props.onOpenModalAlert}
          onSiteChanged={(site) => props.onPropertyChange('site_id', site)}
          onLyColorChange={(color) => props.onPropertyChange('ly', {color})}
          onCyColorChange={(color) => props.onPropertyChange('cy', {color})}
          onTimespanChange={(ev,timespan) => dispatch({type: types.SET_TIMESPAN, timespan})}
          onGraphicTypeChange={(graph) => props.onPropertyChange('graphic_type', graph)}
          onRemove={props.onRemove}
        />
        <div className="meli-metric__graphic">
          <div>
          {!state.is_loading ? <Graphic displayType={props.displayType} maxValue={state.maxValue} graphicType={props.graphicType} data={state.data} /> : undefined}
          <Spinner modifier="block" size="small" label="Loading Graphic" show={state.is_loading} />
          </div>
        </div>
      </div>
  )
}