import * as types from './types';

const initialState = {
  toggleDrawer:false,
  isAddingFAQ:false, 
  modalFAQ:false,
  faqs:undefined
}


const drawerReducer = (store = initialState, action) => {
  const newState = Object.assign({}, store)
  switch (action.type) {
    case types.START_ADDING_FAQ:
      return Object.assign({}, store, { isAddingFAQ: true });
    case types.END_ADDING_FAQ:
      return Object.assign({}, store, { isAddingFAQ: false, modalFAQ: false, faqs: [...store.faqs, action.payload] });
    case types.TOGGLE_DRAWER:
      return Object.assign({}, store, { toggleDrawer: action.actions.shouldToggle });
    default:
      return store
  }
}

export default drawerReducer