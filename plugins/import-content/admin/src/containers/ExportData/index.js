import React, {useEffect, useReducer, useState} from 'react';
import {reducer, store} from "../DataManagerProvider/reducer";
import {get, has} from "lodash";
import {LOADING, MODELS, SET_ATTRIBUTES, SET_COMPONENTS, SET_MODELS, TOGGLE_LOADING} from "../../utils/constants";
import ListViewContext from "../../utils/ListViewContext";
import ContentTypeTree from "../../components/ContentTypeTree";
import {LoadingIndicator, request} from 'strapi-helper-plugin'
import Block from "../../components/Block";
import Row from "../../components/Row";
import {Label, Select} from '@buffetjs/core'

const ExportData = () => {
  const [state, dispatch] = useReducer(reducer, store);
  const [targetModel, updateTargetModel] = useState("");
  const [targetUid, updateTargetUid] = useState("");
  const [targetName, updateTargetName] = useState("");

  const [modelOptions, updateModelOptions] = useState([]);


  /*1.receive models & components*/
  useEffect(() => {
    getComponents();
    getModels();
    setTimeout(() => {
      dispatch({type: TOGGLE_LOADING, payload: false});
    }, 1000)
  }, []);

  /*2.generate modelOptions*/
  useEffect(() => {
    const models = get(state, [MODELS], []);
    const modelOptions = models.map(model => {
      return {
        label: get(model, ["schema", "name"], ""),
        value: model.uid
      }
    });
    updateModelOptions(modelOptions);
  }, [get(state, [MODELS], [])]);

  /*3.set targetModel to the first option*/
  useEffect(() => {
    modelOptions && updateTargetModel(modelOptions[0]);
  }, [modelOptions]);

  /*4.based on targetModel, fetch the attributes*/
  useEffect(() => {
    const models = get(state, [MODELS], []);
    if (!models) return;
    const target = models.find(model => model.uid === targetModel);
    const attrs = target && get(target, ['schema', 'attributes'], {});
    attrs && dispatch({type: SET_ATTRIBUTES, payload: attrs})
    // const attributesArray = attrs && convertAttrObjToArray(attrs);
    // attributesArray && dispatch({type: SET_ATTRIBUTES_ARRAY, payload: attributesArray})
  }, [targetModel]);

  useEffect(() => {
    const targetUid = get(targetModel, ['uid'], "");
    updateSelectedTargetUid(targetUid);
  }, [targetModel]);
  const onSelectTarget = (targetModel) => {
    updateTargetModel(targetModel)
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
    dispatch({type: SET_MODELS, payload: models})
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
                value={targetModel}
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