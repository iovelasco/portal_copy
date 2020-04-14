import * as types from './types';


const modalReducer = (store = {}, action) => {
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
    case types.START_ADDING_KU:
      return Object.assign({}, store, { isAddingKu: true });
    case types.END_ADDING_KU:
      console.log(action.payload);
      let existingKU = store.key_users;
      console.log(existingKU);
      if (!existingKU[action.payload.country]) existingKU[action.payload.country] = [];
      existingKU[action.payload.country].push({ ku_id: action.payload.ku_id, name: action.payload.name, email: action.payload.email, specialties: action.payload.specialties, pic: action.payload.pic });
      console.log(existingKU);
      return Object.assign({}, store, { isAddingKu: false, modalKeyUser: false, key_users: { ...existingKU } });
    case 'END_EDITING_METRIC':
      return Object.assign({}, store, { metrics: action.payload });
    case 'GET_SECTION_UPDATE':
      console.log('payload', action.payload)
      return { ...store, sections: { ...store.sections } }
    default:
      return store;
  }
};

export default modalReducer;
