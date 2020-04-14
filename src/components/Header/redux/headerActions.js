import * as types from '../../../store/constants/ActionTypes';

export const actToggleDrawerBody = (toggle, metrics, attributes, resume) => {

  let act = {
    type: types.TOGGLE_DRAWER_BODY,
    actions: {
      shouldToggle: toggle,
      showMetrics: metrics,
      showAttributes: attributes,
      showResume: resume,
    }
  };
  return act;
};

export const toggleDrawerBodyAction = (toggle, metrics, attributes, resume) => (dispatch, getState) => {
  let finalMetric;
  let finalAttributes;
  let finalResume;
  const { showMetrics, showAttributes, showResume, toggleDrawerBody } = getState();
  if (toggle) {
    finalMetric = metrics;
    finalAttributes = attributes;
    finalResume = resume;
  } else {
    finalMetric = metrics ? !showMetrics : showMetrics;
    finalAttributes = attributes ? !showAttributes : showAttributes;
    finalResume = resume ? !showResume : showResume;
  }
  dispatch(actToggleDrawerBody(toggle ? !toggleDrawerBody : toggleDrawerBody, finalMetric, finalAttributes, finalResume));
};

export const logoutUser = () => {
  localStorage.removeItem("login_data");
  return {
    type: types.USER_LOGGED_OUT
  }
};

export const updatePage = (page) => {
;

  return function (dispatch) {
    dispatch({ type: types.CHANGE_PAGE, payload: page });
  }
};
