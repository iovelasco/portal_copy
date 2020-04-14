import * as types from './types';

export const actCurrentDashboard = (dashboard) => {
  return {
    type: types.DASHBOARD_SELECTED,
    payload: dashboard
  }
}

export const updateCurrentDashboard = (section_id, dashboard_id) => {
  return function(dispatch, getState) {
    const dashboard = getState().dashboards[dashboard_id];
    dispatch(actCurrentDashboard(dashboard));
  }
}

export const toggleDrawerType = (toggle) => {
  let act = {
    type: types.TOGGLE_DRAWER,
    actions: {
      shouldToggle: toggle,
    }
  }
  return act
};

export const toggleDrawerAction = () => (dispatch, getState) => {
  const { toggleDrawer } = getState();
  dispatch(toggleDrawerType(!toggleDrawer));
};
