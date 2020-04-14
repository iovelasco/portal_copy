/* eslint-disable */
import * as types from '../constants/ActionTypes';


const storeReducer = (store = {}, action) => {
  switch (action.type) {
    case types.START_LOADING:
      return Object.assign({}, store, { isLoading: true, loadingMessage: action.message });
    case types.END_LOADING:
      return Object.assign({}, store, { isLoading: false, loadingMessage: undefined });
    case types.UPDATE_BUS:
      let newStore = store;
      newStore.admin.business_units = action.bus;
      return Object.assign({}, newStore);
    case types.START_EDITING:
      return Object.assign({}, store, { isEditing: true });
    case types.END_EDITING:
      return Object.assign({}, store, { isEditing: false });
    case types.CHANGE_PAGE:
      return Object.assign({}, store, {currentPage: action.payload.page, currentSectionPath: action.payload.path || undefined, currentSection: action.payload.section_id || undefined, currentDashboard: action.payload.page != 'edit-dashboard' ? undefined : store.currentDashboard});
    case types.CHANGE_PAGE_ADMIN:
      return Object.assign({}, store, {currentPageAdmin: action.payload, currentDashboardAdmin: undefined });
      default:
      return store
  }
}


export default storeReducer
