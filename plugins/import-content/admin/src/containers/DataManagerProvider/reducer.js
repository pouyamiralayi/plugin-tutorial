import {isEmpty, get, set, keys, pick} from 'lodash'
import {
  ADD_COMPONENT,
  ATTRIBUTES,
  ATTRIBUTES_ARRAY,
  COMPONENTS, DELETE_ACTION, EDIT_ATTRIBUTE, EXPORT_NAME,
  LOADING,
  MODELS, PERFORM_DELETE_ACTION, REMOVE_ATTRIBUTE, REMOVE_COMPONENT_FROM_DYNAMIC_ZONE, SCHEMA,
  SET_ATTRIBUTES,
  SET_ATTRIBUTES_ARRAY,
  SET_COMPONENTS,
  SET_MODELS,
  SET_TARGET,
  SET_TARGET_NAME,
  SET_TARGET_UID, SHOW_DELETE_MODAL,
  TARGET,
  TARGET_NAME,
  TARGET_UID, TOGGLE_DELETE_MODAL,
  TOGGLE_LOADING
} from "../../utils/constants";

export const store = {
  [COMPONENTS]: {},
  [MODELS]: [],
  [ATTRIBUTES]: {},
  [ATTRIBUTES_ARRAY]: [],
  [TARGET]: {},
  [TARGET_UID]: "",
  [TARGET_NAME]: "",
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
      }
      return state
    }
    case SET_COMPONENTS: {
      const comps = action.payload;
      if (!isEmpty(comps)) {
        const newState = {...state};
        set(newState, [COMPONENTS], comps);
        return newState
      }
      return state
    }
    case SET_MODELS: {
      const models = action.payload;
      if (!isEmpty(models)) {
        const newState = {...state};
        set(newState, [MODELS], models);
        return newState
      }
      return state
    }
    case SET_ATTRIBUTES: {
      const attrs = action.payload;
      if (!isEmpty(attrs)) {
        const newState = {...state};
        set(newState, [ATTRIBUTES], attrs);
        return newState
      }
      return state
    }
    case SET_ATTRIBUTES_ARRAY: {
      const attrs = action.payload;
      if (!isEmpty(attrs)) {
        const newState = {...state};
        set(newState, [ATTRIBUTES_ARRAY], attrs);
        return newState
      }
      return state
    }
    case REMOVE_ATTRIBUTE: {
      if (!isEmpty(action.payload)) {
        const {attributeName, exportName, editTarget, targetUid, targetName} = action.payload;
        const newState = {...state};
        if (editTarget === 'contentType') {
          const newKeys = keys(get(state, [ATTRIBUTES], {}))
            .filter(k => k != attributeName);
          const newAttrs = pick(state, newKeys);
          set(newState, [ATTRIBUTES], newAttrs);
          return newState
        }
        return state
      }
    }
    case EDIT_ATTRIBUTE: {
      if (!isEmpty(action.payload)) {
        const {attributeName, exportName, editTarget, targetUid, targetName} = action.payload;
        const newState = {...state};
        if (editTarget === 'contentType') {
          set(newState, [ATTRIBUTES, attributeName, EXPORT_NAME], exportName);
        } else if (editTarget === COMPONENTS) {
          set(newState, [COMPONENTS, targetUid, SCHEMA, ATTRIBUTES, attributeName, EXPORT_NAME], exportName)
        }
        return newState
      }
      return state
    }
    case SET_TARGET: {
      const target = action.payload;
      if (!isEmpty(target)) {
        const newState = {...state};
        set(newState, [TARGET], target);
        return newState
      }
      return state
    }
    case SET_TARGET_UID: {
      const target = action.payload;
      if (!isEmpty(target)) {
        const newState = {...state};
        set(newState, [TARGET_UID], target);
        return newState
      } else {
        return state
      }
    }
    case SET_TARGET_NAME: {
      const target = action.payload;
      if (!isEmpty(target)) {
        const newState = {...state};
        set(newState, [TARGET_NAME], target);
        return newState
      } else {
        return state
      }
    }
    case TOGGLE_LOADING: {
      return {...state, [LOADING]: action.payload}
    }
    case REMOVE_COMPONENT_FROM_DYNAMIC_ZONE: {
      if (!isEmpty(action.payload)) {
        const {dzName, idx} = action.payload;
        const newState = {...state};
        const comps = get(state, [ATTRIBUTES, dzName, COMPONENTS], []);
        comps.splice(idx, 1);
        // console.log(comps);
        set(newState, [ATTRIBUTES, dzName, COMPONENTS], comps);
        return newState
      }
      return state
    }
    default:
      return state
  }

};