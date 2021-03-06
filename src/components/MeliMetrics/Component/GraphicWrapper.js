/* eslint-disable */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Spinner from '@andes/spinner';
import '../MeliMetrics.scss';
import GraphicSetup from './GraphicSetup';
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

const url = '/api/melimetrics/metrics';

const mapStateToProps = (store, props) => ({

});

const mapDispatchToProps = dispatch => ({
  updateNewGraphProperty: (id, property, value) => {
    dispatch(updateGraphProperty(id, property, value));
  },
  measureAction:(id,measure)=>{
    dispatch(updatePayloadMeasure(id,measure))
  },
});


class GraphicWrapper extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTimestamp: '12months',
      filteredSite: undefined,
      data:undefined,
      sites:undefined,
      toggleGrip:false,
      rangeFilter: undefined,
      dateType:'DD-MM',
      measureUnit:"Thousands",
      sites:[],
      showCalendar: false,
      selectBgColor: undefined,
      selectLineColor:"blue",
      selectGraphic: "bar",
      selectRande: undefined,
      isLoadingData: true,
      data:undefined,
      gridOn:false,
      graphicConfig:undefined,
      labelIsEmpty:false,
      side_id:undefined,
      minTimestamp: undefined,
      maxTimestamp: undefined,
      maxValue: 0,
      availableSites: []
    }
 
    this.handleOnChangeCalendar = this.handleOnChangeCalendar.bind(this);
    this.handleMeasureUnit = this.handleMeasureUnit.bind(this);
    this.handleTypeDate = this.handleTypeDate.bind(this);
    this.hangleGrid = this.hangleGrid.bind(this);
    this.mouseOutCalendar = this.mouseOutCalendar.bind(this);
    this.handleShowCalendar = this.handleShowCalendar.bind(this);
    this.handleMetricId = this.handleMetricId.bind(this);
    this.changeTimespan = this.changeTimespan.bind(this);
  }

  promiseParallel(functions) {
    return new Promise((resolve, reject) => {
      parallel(functions, (err, res) => {
        if (err) return reject(err);
        resolve(res);
      });
    })
  }

  async loadFinalMetricData(timespan, site) {
    const {metric} = this.props;
    this.setState({isLoadingData: true});
    try {
      const gmd = function(cb) {
        this.getMetricData(metric.metric_id, timespan, ["site_id", "timestamp"], site).then((data) => {
          cb(null, data);
        });
      }.bind(this);

      const gmv = function(cb) {
        this.getMetricValues(metric.metric_id).then((data) => {
          cb(null, data);
        });
      }.bind(this);

      const {gmd : resultData, gmv : resultValues} = await this.promiseParallel({gmd, gmv});
      const rawData = resultData;
      const metricValues = resultValues;
      const {site_id : availableSites, min_timestamp : minTimestamp, max_timestamp : maxTimestamp} = ld.pick(metricValues, ['site_id', 'min_timestamp', 'max_timestamp']);
      const {data, maxValue} = this.generateDatasets(metric.display_name, rawData, metric);
      this.setState({
        selectedTimestamp: timespan,
        filteredSite: undefined,
        maxValue,
        rawData,
        data,
        isLoadingData: false, 
        availableSites,
        minTimestamp,
        maxTimestamp,
        isLoadingData: false
      });
    } catch (err) {
      console.log(err);
    }
  }

  async componentDidMount() {
   this.loadFinalMetricData('12months');
  }

  async getMetricData(metric_id, timespan, aggregations, site) {
    try {
      let body = {aggregations};
      if (site&&site!='all') body['sites'] = [site];
      const {data} = await axios.post(`/api/melimetrics/metrics/${metric_id}/data?period=${timespan}`, body);
      return data.data.results;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async getMetricValues(metric_id) {
    try {
      const {data} = await axios.get(`/api/melimetrics/metrics/${metric_id}/values`);
      return data;
    } catch (error) {
      console.log(error);
      return {};
    }
  }

  componentDidUpdate(oldProps, oldState) {
    console.log(this.props.metric);

    if (oldProps.selectedSite!==this.props.selectedSite||oldProps.cyColor!=this.props.cyColor||oldProps.lyColor!=this.props.lyColor||this.state.rangeFilter!=oldState.rangeFilter) {
      if (oldProps.selectedSite!==this.props.selectedSite&&this.props.metric.is_calculation) {
        this.loadFinalMetricData(this.state.selectedTimestamp, this.props.selectedSite);
      } else {
        const {data, maxValue} = this.generateDatasets(this.props.metric.display_name, this.state.rawData,  this.props.metric);
        this.setState({data, maxValue});
      }
    }
  }

  generateDatasets(metricName, data, cfg) {
    const finalData = {};
    const {currentYearDS, lastYearDS} = this.loadConfigurationFromSaving(metricName, cfg);
    let filteredData = (() => {
      if (cfg.site_id!='all') return data.filter(d => d.site_id==(cfg.site_id||'MLA'));
      return data;
    })();
    filteredData = filteredData.sort((a, b) => moment(a.timestamp).diff(moment(b.timestamp)));
    const uniqueLabels = ld.uniq(filteredData.map((a) => moment.parseZone(a.timestamp).format('YYYY-MM-DD')));
    finalData.labels = uniqueLabels;
    let maxValue = this.state.maxValue;
    if (cfg.site_id=='all') {
      const objData = {}
      finalData.labels.forEach(dt => objData[dt] = {cy: 0, ly: 0});
      filteredData.forEach(x => {
        objData[moment.parseZone(x.timestamp).format('YYYY-MM-DD')].cy+=x.value;
        objData[moment.parseZone(x.timestamp).format('YYYY-MM-DD')].ly+=x.value_ly;
      });
      currentYearDS.data = Object.values(objData).map((p) => {
        maxValue = Math.max(maxValue, p.cy);
        return p.cy;
      });
      lastYearDS.data = Object.values(objData).map((p) => {
        maxValue = Math.max(maxValue, p.ly);
        return p.ly
      });
      finalData.datasets = [currentYearDS, lastYearDS];
    } else {
      currentYearDS.data = filteredData.map(fd => {
        maxValue = Math.max(fd.value, maxValue);
        return fd.value
      });
      lastYearDS.data = filteredData.map(fd => {
        maxValue = Math.max(fd.value_ly, maxValue);
        return fd.value_ly
      });
      finalData.datasets = [currentYearDS, lastYearDS];
    }
    return {data: finalData, maxValue};
  }

  loadConfigurationFromSaving(metricName, cfg) {
    const colors = (() => {
      let cy = Colors.Blue, ly = Colors.Grey;
      if (cfg) {
        if (cfg.cy) cy=cfg.cy.color;
        if (cfg.ly) ly=cfg.ly.color;
      } 
      return {cy, ly}
    })();
    const currentYearDS = this.buildConfiguration(metricName, colors.cy);
    const lastYearDS = this.buildConfiguration(metricName, colors.ly, true); 
    return {currentYearDS, lastYearDS}
  }

  handleMetricId(metric_id){
    this.props.handleAlertId(metric_id);
  };

  handleMeasureUnit(ev, value){
    this.setState({measureUnit:value});
  }

  handleShowCalendar = () => this.setState(prevState => {
    return { showCalendar: !prevState.showCalendar }
  });

  mouseOutCalendar(e) {
    e.preventDefault();
    this.setState({ showCalendar:false });
  };

  hangleGrid(gridOn){ 
    this.setState({ gridOn });
  };

  handleOnChangeCalendar(range) {
    let configRange = undefined;
    if (range) {
      configRange = {
        start: `${moment(range[0]).format('YYYY-MM-DD')}T00:00:00.000Z`,
        end: `${moment(range[1]).format('YYYY-MM-DD')}T00:00:00.000Z`
      };
    }
    this.setState({showCalendar: false, rangeFilter: configRange});
  };

  handleTypeDate(ev, value){
    this.setState({
      dateType:value,
    });
  };

  buildConfiguration(label, color, isLy) {
    const defaultObj = {};
    ['backgroundColor', 'borderColor', 'hoverBackgroundColor', 'hoverBorderColor'].forEach((colp) => {
        defaultObj[colp] = color
    });
    defaultObj.borderWith = 0;
    defaultObj.data = [1];
    defaultObj.label = (() => {
      if (isLy) return `${label} LY`
      else return label;
    })();
    return defaultObj;
  }

  changeTimespan(ev, timespan) {
    this.loadFinalMetricData(timespan);
  }

  changeSite(ev, site) {
    if (site)
    this.loadFinalMetricData(timestanp, site)
  }

  render() {
    console.log(this.props.metric);
    return (
      <div className="meli-metric__graphic-card" >
          <GraphicSetup
            selectedSite={this.props.selectedSite}
            rangeFilter={this.state.rangeFilter}
            metricId={this.props.metric_id}
            metricName={this.props.metric.display_name}
            minTimestamp={this.state.minTimestamp}
            maxTimestamp={this.state.maxTimestamp}
            availableSites={this.state.availableSites}
            onAlertConfig={this.props.onAlertConfig}
            onConfigChange={this.props.onConfigChange}
            onTimestampChange={this.changeTimespan}
            metric_id={this.props.metric.metric_id}
            isCalculation={this.props.metric.is_calculation}
            aler_id={this.props.metric_id}
            sites={this.state.sites}
            gridOn={this.state.gridOn}
            selectRande={this.state.selectRande}
            showCalendar={this.state.showCalendar}
            handleShowCalendar={this.handleShowCalendar}
            handleOnChangeCalendar={this.handleOnChangeCalendar}
            handleTypeDate={this.handleTypeDate}
            hangleGrid={this.hangleGrid}
            mouseOutCalendar={this.mouseOutCalendar}
            handleAlertId={this.props.handleAlertId}
            onRemoveMetric={this.props.onRemoveMetric}
          />
        <div className="meli-metric__graphic">
          <div>
            {!this.state.isLoadingData ? <Graphic displayType={this.props.metric.display_type} maxValue={this.state.maxValue} showGrid={this.state.gridOn} graphicType={this.props.selectedGraphicType} data={this.state.data} /> : undefined}
            <Spinner modifier="block" size="small" label="Loading Graphic" show={this.state.isLoadingData} />
          </div>
        </div>
          <Notification 
            
            duration={3000}
            message="This range data dosen't have information"
            type="warning" 
            container="top-right"
            />
      </div>
    );
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(GraphicWrapper);

