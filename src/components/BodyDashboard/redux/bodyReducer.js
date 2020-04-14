import * as types from '../../../store/constants/ActionTypes';


const bodyReducer = (store = {}, action) => {
  switch (action.type) {
    case types.TOGGLE_DRAWER_BODY:
      return Object.assign({}, store, { toggleDrawerBody: action.actions.shouldToggle, showMetrics: action.actions.showMetrics, showResume: action.actions.showResume, showAttributes: action.actions.showAttributes });
    default:
      return store
  }
}

export default bodyReducer