import * as types from './types';

const initialStore = {
  modalFAQ:false,
}


const pagesReducer = (store = initialStore, action) => {
  switch (action.type) {
    case types.CLOSE_MODAL_FAQ:
      return Object.assign({}, store, { modalFAQ: false });
    case types.SHOW_MODAL_FAQ:
      return Object.assign({}, store, { modalFAQ: true });
    case types.SHOW_MODAL_INTRODUCTION:
      return Object.assign({}, store, { modalIntroduction: true });
    case types.CLOSE_MODAL_INTRODUCTION:
      return Object.assign({}, store, { modalIntroduction: false });
    case types.SHOW_MODAL_METRIC:
      return Object.assign({}, store, { modalMetric: true });
    case types.CLOSE_MODAL_METRIC:
      return Object.assign({}, store, { modalMetric: false, resultAddingMetric: undefined });
    case types.START_ADDING_METRIC:
      return Object.assign({}, store, { isAddingMetric: true });
    case types.END_ADDING_METRIC:
      if (action.payload) return Object.assign({}, store, { isAddingMetric: false, resultAddingMetric: action.payload });
      else return Object.assign({}, store, { isAddingMetric: false, resultAddingMetric: 'La metrica se creo correctamente.' });
    case types.UPDATE_BU:
      return Object.assign({}, store, { buId: action.payload });
    case types.UPDATE_DASHBOARDS:
      return Object.assign({}, store, { role: action.payload.business_units.permissions, buName: action.payload.business_units.bu_name, faqs: action.payload.business_units.faqs, introduction: { title: action.payload.business_units.title, description: action.payload.business_units.description }, sections: action.payload.business_units.sections, key_users: action.payload.business_units.key_users, currentPage: action.payload.page || 'search', currentDashboard: undefined, dashboards: action.payload.business_units.dashboards });
    case types.DASHBOARD_SELECTED:
      return Object.assign({}, store, { currentDashboard: action.payload, currentPage: 'dashboard' });
    case types.SHOW_MODAL_SECTION:
      return Object.assign({}, store, { modalSection: true });
    case types.SHOW_MODAL_KU:
      return Object.assign({}, store, { modalKeyUser: true });
    case types.CLOSE_MODAL_KU:
      return Object.assign({}, store, { modalKeyUser: false });
    case types.CLOSE_MODAL_SECTION:
      return Object.assign({}, store, { modalSection: false });
    case types.START_ADDING_SECTION:
      return Object.assign({}, store, { isAddingSection: true });
    case types.END_ADDING_SECTION:
      return Object.assign({}, store, { isAddingSection: false, modalSection: false });
    case types.LOAD_FAVORITE:
      return Object.assign({}, store, { favourites: action.payload });
    case types.ADD_FAVORITE:
      return Object.assign({}, store, { favourites: action.payload });
    case types.DELETE_FAVORITE:
      return Object.assign({}, store, { favourites: action.payload });
    case types.LOAD_DATA_DASHBOARD:
      return Object.assign({}, store, { search: action.payload });
    case types.FAQ_DELETED:
      return Object.assign({}, store, { faqs: action.payload });
    case 'END_EDITING_METRIC':
      return Object.assign({}, store, { metrics: action.payload });
    case types.UPDATE_SECTION:
      return { ...store, sections: { ...store.sections }};
    case types.DELETE_SECTION:
      return {...store, currentPage: 'favourites'}
    case types.LOAD_SUBSCRIPTION:
      return {...store, subscriptions: action.payload}
    default:
      return store;
  }
};

export default pagesReducer;
