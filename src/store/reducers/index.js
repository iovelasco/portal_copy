import reduceReducers from 'reduce-reducers';
import { combineReducers } from 'react-redux';

import storeReducer from './reducerStore';
import headerReducer from '../../components/Header/redux/headerReducer';
import bodyReducer from '../../components/BodyDashboard/redux/bodyReducer';
import DashboardConfigReducer from '../../components/DashboardConfig/redux/DashboardConfigReducer';
import initialState from '../initialStore';
import loginReducer from '../../components/Login/redux/loginReducer';
import pagesReducer from '../../components/Pages/redux/pagesReducer';
import drawerReducer from '../../components/Drawer/redux/drawerReducer';
import notificationReducer from '../../components/Notification/redux/reducer';
import modalReducer from '../../components/Modals/redux/modalReducer';
import melimetricReducer from '../../components/MeliMetrics/redux/reducer';

const rootReducer = reduceReducers(
  notificationReducer,
  pagesReducer,
  DashboardConfigReducer,
  headerReducer,
  loginReducer,
  headerReducer,
  storeReducer,
  drawerReducer,
  bodyReducer,
  modalReducer,
  melimetricReducer,
  initialState,
);


export default rootReducer;
