import * as types from '../../../store/constants/ActionTypes';
import initialStore from '../../../store/initialStore';

const DashboardConfigReducer = (store = initialStore, action) => {
  const newState = Object.assign({}, store)
  switch (action.type) {
    case types.START_DASHBOARD_CREATION:
      return Object.assign({}, store, { isLoading: true, loadingMessage: 'Updating dashboard...' });
    case types.END_DASHBOARD_CREATION:
      return Object.assign({}, store, { isLoading: false, loadingMessage: undefined, recentDashboard: action.payload ? action.payload.dashboard_id : undefined});
    default:
      return store
  }
}

export default DashboardConfigReducer


