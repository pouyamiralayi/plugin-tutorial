import {isEmpty, set} from 'lodash'
import {
  ADD_COMPONENT,
  ATTRIBUTES, ATTRIBUTES_ARRAY,
  COMPONENTS, LOADING, MODELS,
  SET_ATTRIBUTES, SET_ATTRIBUTES_ARRAY,
  SET_COMPONENTS, SET_MODELS, TOGGLE_LOADING
} from "../../utils/constants";

export const store = {
  [COMPONENTS]: {},
  [MODELS]: [],
  [ATTRIBUTES]: {},
  [ATTRIBUTES_ARRAY]: [],
  contentTypes: {},
  initialComponents: {},
  intialContentTypes: {},
  initialData: {},
  modifiedData: {},
  [LOADING]: true,
  isLoadingForDataToBeSet: true,
};


export const reducer = (state, action) => {
  switch (action.type) {
    case ADD_COMPONENT: {
      const comp = action.payload;
      if (!isEmpty(comp)) {
        const newState = {...state};
        set(newState, [COMPONENTS, comp.uid], comp);
        return newState
      } else {
        return state
      }
    }
    case SET_COMPONENTS: {
      const comps = action.payload;
      if (!isEmpty(comps)) {
        const newState = {...state};
        set(newState, [COMPONENTS], comps);
        return newState
      } else {
        return state
      }
    }
    case SET_MODELS: {
      const models = action.payload;
      if (!isEmpty(models)) {
        const newState = {...state};
        set(newState, [MODELS], models);
        return newState
      } else {
        return state
      }
    }
    case SET_ATTRIBUTES: {
      const attrs = action.payload;
      if (!isEmpty(attrs)) {
        const newState = {...state};
        set(newState, [ATTRIBUTES], attrs);
        return newState
      } else {
        return state
      }
    }
    case SET_ATTRIBUTES_ARRAY: {
      const attrs = action.payload;
      if (!isEmpty(attrs)) {
        const newState = {...state};
        set(newState, [ATTRIBUTES_ARRAY], attrs);
        return newState
      } else {
        return state
      }
    }
    case TOGGLE_LOADING: {
      return {...state, [LOADING]: action.payload}
    }
    default:
      return state
  }

};