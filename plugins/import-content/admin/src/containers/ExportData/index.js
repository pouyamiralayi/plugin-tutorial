import React, {useEffect, useReducer, useState} from 'react';
import {reducer, store} from "../DataManagerProvider/reducer";
import {get, has, isEmpty} from "lodash";
import {
  ATTRIBUTES,
  LOADING,
  MODELS, SCHEMA,
  SET_ATTRIBUTES,
  SET_ATTRIBUTES_ARRAY,
  SET_COMPONENTS,
  SET_MODELS, SET_TARGET,
  SET_TARGET_NAME,
  SET_TARGET_UID, TARGET,
  TOGGLE_LOADING
} from "../../utils/constants";
import ListViewContext from "../../utils/ListViewContext";
import ContentTypeTree from "../../components/ContentTypeTree";
import {LoadingIndicator, request} from 'strapi-helper-plugin'
import Block from "../../components/Block";
import Row from "../../components/Row";
import {Label, Select} from '@buffetjs/core'
import convertAttrObjToArray from "../../utils/convertAttrObjToArray";

const ExportData = () => {
  const [state, dispatch] = useReducer(reducer, store);
  const [targetModelName, updateTargetModelName] = useState("");
  const [targetModelObj, updateTargetModelObj] = useState("");
  const [targetUid, updateTargetUid] = useState("");
  const [targetName, updateTargetName] = useState("");

  const [modelOptions, updateModelOptions] = useState([]);

  /*1.receive models & components*/
  useEffect(() => {
    getComponents();
    getModels();
    // setTimeout(() => {
      dispatch({type: TOGGLE_LOADING, payload: false});
    // }, 1000)
  }, []);

  /*2.generate modelOptions*/
  useEffect(() => {

  }, [state]);

  /*3.set targetModel to the first option*/
  useEffect(() => {
    const opt = get(modelOptions, ["0", "value"], "");
    if (!isEmpty(opt)) {
      updateTargetModelName(opt);
    }
  }, [modelOptions]);

  /*4.based on targetModel, fetch the model actual object & attributes*/
  useEffect(() => {
    const models = get(state, [MODELS], []);
    if (!models) return;
    const target = models.find(model => model.uid === targetModelName);
    target && dispatch({type: SET_TARGET, payload: target});
    const attrs = target && get(target, [SCHEMA, ATTRIBUTES], {});
    attrs && dispatch({type: SET_ATTRIBUTES, payload: attrs});
    // const attrs_array = attrs && convertAttrObjToArray(attrs); // todo move this to sub-components state
    // attrs_array && dispatch({type: SET_ATTRIBUTES_ARRAY, payload: attrs_array})
  }, [targetModelName]);

  const onSelectTarget = (targetModel) => {
    updateTargetModelName(targetModel)
  };

  const getComponents = async () => { // todo error
    const resp = await request("/content-type-builder/components", {method: "GET"});
    const components = {};
    get(resp, ["data"], [])
      .map(obj => {
        obj.uid ? components[obj.uid] = obj : null
      });
    dispatch({type: SET_COMPONENTS, payload: components});
  };

  const getModels = async () => { // todo error
    const response = await request("/content-type-builder/content-types", {
      method: "GET"
    });
    // Remove content types from models
    const models = get(response, ["data"], []).filter(
      obj => !has(obj, "plugin")
    );
    const modelOptions = models.map(model => {
      return {
        label: get(model, ["schema", "name"], ""),
        value: model.uid
      }
    });
    dispatch({type: SET_MODELS, payload: models});
    updateModelOptions(modelOptions);
  };

  return (
          <Block
            title="General"
            description="Export your Content Types"
            style={{marginBottom: 12}}
          >
            {
              get(state, [LOADING], false) ? (
                <LoadingIndicator/>
              ) : (
                <>
                  <Row className={"col-4 row"}>
                    <Label htmlFor={"targetContentType"}>Select Content Type</Label>
                    <Select
                      name={"targetContentType"}
                      options={modelOptions}
                      value={targetModelName}
                      onChange={({target: {value}}) =>
                        onSelectTarget(value)}
                    />
                  </Row>
                  < ListViewContext.Provider value={{state, dispatch}}>
                    <ContentTypeTree/>
                  </ListViewContext.Provider>
                </>
              )
            }
          </Block>
  )
};

export default ExportData