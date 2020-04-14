/* eslint-disable */
import * as types from './types';


const melimetric = (store = {}, action) => {
  switch (action.type) {
    case types.GET_MELIMETRIC_DATA:
      return {
        ...store, metricData: action.payload,
      };
    case types.GET_METRIG_CONFIG:
      return {
        ...store, userConfig: action.payload
      };
    case types.MERGE_DATA_SELECTED_CONFIG:
      return {
        ...store, userConfig: action.payload
      };
    case types.SUGGESTIONS:
      return {
        ...store, metricSelected: [...store.metricSelected, action.payload]
      };
    case types.ADD_CONFIGURATION_SELECTED_METRIC:
      const metricSelected = store.metricSelected
      for (let i = 0; i < metricSelected.length;i++) {
        metricSelected[i].metric_id = metricSelected[i].id
        metricSelected[i].configuration = {
          selectBgColor: 'rgba(33, 150, 243, 0.79)',
          selectLineColor: 'rgba(255,99,132,0.4)',
          selectSite: 'MLA',
          selectGraphic: 'bar',
          selectRande: { start: new Date(), end: new Date() },
        };
      };
      return {
        ...store, metricSelected: metricSelected
      }
    case types.CONFIGURATION:
      return {
        ...store, metricConfigurations: [...store.metricSelected, ...store.userConfig]
      };
    case types.REMOVE_METRIC:
      const deletedMetric = store.metricConfigurations.filter(metric => {
        return metric.metric_id != action.payload
      });
      return {
        ...store, metricConfigurations: deletedMetric 
      };
    case types.UPDATE_GRAPH_PROPERTY:
        const configExistentes = store.metricConfigurations;
        store.metricConfigurations.forEach((currentMetric, indice) => {
          if (action.payload.id === currentMetric.metric_id) {
            configExistentes[indice].configuration[action.payload.property] = action.payload.value;
          }
        });
        return {
          ...store, metricConfigurations: [...configExistentes]
        };        
    case types.LOAD_ALL_INITIAL_DATA:
        return {...store, metricConfigurations: action.payload.finalCharts, existingMetrics: action.payload.finalMetrics};
    case types.ADD_NEW_METRIC_CFG: 
        const newCfg = {
          metric_id: action.payload.id, display_name: action.payload.display_name, 
          configuration: {
          selectBgColor: 'rgba(33, 150, 243, 0.79)',
          selectLineColor: 'rgba(95, 95, 95, 0.81)',
          selectSite: 'MLA',
          selectGraphic: 'bar',
          selectRande: {start: undefined, end: undefined},
          }
         };
        return {
          ...store, metricConfigurations: [...store.metricConfigurations, newCfg]
        }
    case types.SHOW_ALERT:
        return {
          ...store, meliMetricAlert:{...store.meliMetricAlert, alert:true , metric_data:{id:action.payload.id, metric_name:action.payload.metric_name }  }
        }
    case types.HIDE_ALERT:
        return {
          ...store, meliMetricAlert:{...store.meliMetricAlert, alert:false } 
        }
      case types.GET_ALERT_DATA:
        return {
          ...store, meliMetricAlert:{...store.meliMetricAlert, alert_data: action.payload.alertData }
        }
        default:
      return store;
  }
};

export default melimetric;
