import React, {useEffect, useReducer, useState} from 'react';
import {reducer, store} from "../DataManagerProvider/reducer";
import {get, has, isEmpty, isEqual} from "lodash";
import {
  ATTRIBUTES,
  LOADING,
  MODELS,
  SCHEMA,
  SET_ATTRIBUTES,
  SET_COMPONENTS,
  SET_MODELS,
  SET_TARGET,
  TOGGLE_LOADING
} from "../../utils/constants";
import ListViewContext from "../../utils/ListViewContext";
import ContentTypeTree from "../../components/ContentTypeTree";
import {LoadingIndicator, request, useGlobalContext} from 'strapi-helper-plugin'
import Block from "../../components/Block";
import ContentTypeTable from "../../components/ContentTypeTable";
import Row from '../../components/Row'
import LeftMenu from "../LeftMenu";
import Wrapper from './Wrapper'
import {Button} from '@buffetjs/core'
import {Header} from '@buffetjs/custom'
import makeSearch from "strapi-plugin-content-type-builder/admin/src/utils/makeSearch";
import getTrad from "../../utils/getTrad";
import {FormattedMessage} from 'react-intl';

const ExportData = () => {
  const [state, dispatch] = useReducer(reducer, store);
  const [targetModelName, updateTargetModelName] = useState("");
  const [targetModelObj, updateTargetModelObj] = useState("");
  const [targetUid, updateTargetUid] = useState("");
  const [targetName, updateTargetName] = useState("");

  const [modelOptions, updateModelOptions] = useState([]);
  const [selectedOption, updateSelectedOption] = useState("");

  const [configOptions, updateConfigOptions] = useState([
    {
      title: "18.3",
      models: [
        {uid: 'application::book.book', name: 'book'},
        {uid: 'application::contact.contact', name: 'contact'}
      ]
    },
    {
      title: "18.4",
      models: [
        {uid: 'application::book.book', name: 'book'},
        {uid: 'application::contact.contact', name: 'contact'}
      ]
    }
  ]);
  const [selectedConfigOption, updateSelectedConfigOption] = useState({});
  const [targetConfigName, updateTargetConfigName] = useState(""); // the target migration
  const [selectedMenu, toggleSelectedMenu] = useState("models");

  const headerProps = {
    actions:
      [
        {
          color: 'cancel',
          onClick: () => {
          },
          title: 'Reset',
          type: 'button',
          // disabled: isEqual(modifiedData, initialData) ? true : false,
        },
        {
          className: 'button-submit',
          color: 'success',
          onClick: () => {
          },
          title: 'Generate',
          type: 'submit',
          // disabled: isEqual(modifiedData, initialData) ? true : false,
        },
      ],
    title: {
      targetModelName,
      cta:
        {
          icon: 'pencil-alt',
          onClick: async () => {
            // await wait();
            //
            // if (firstMainDataPath === 'contentType') {
            //   emitEvent('willEditNameOfContentType');
            // }
            //
            // push({
            //   search: makeSearch({
            //     modalType: firstMainDataPath,
            //     actionType: 'edit',
            //     settingType: 'base',
            //     forTarget: firstMainDataPath,
            //     targetUid,
            //     headerDisplayName: label,
            //   }),
            // });
          },
        }
    },
    // content: getDescription(),
  };

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
  // useEffect(() => {
  //   const opt = get(modelOptions, ["0", "value"], "");
  //   if (!isEmpty(opt)) {
  //     updateTargetModelName(opt);
  //   }
  // }, [modelOptions]);

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
        // value: model.uid,
        uid: model.uid,
        checked: true,
      }
    });
    dispatch({type: SET_MODELS, payload: models});
    updateModelOptions(modelOptions);
    const opt = get(modelOptions, ["0", "uid"], "");
    if (!isEmpty(opt)) {
      // console.log(opt);
      updateTargetModelName(opt);
      updateSelectedOption(opt)
    }
  };

  const onModelChecked = (val) => {
    // console.log(val);
    const {uid, checked} = val;
    const newModelOptions = modelOptions.map(opt => {
      if (opt.uid === uid) {
        opt.checked = checked;
      }
      return opt
    });
    // console.log(newModelOptions)
    updateModelOptions(newModelOptions)
  };

  const onModelClicked = (val) => {
    // console.log(val);
    // const newModelOptions = modelOptions.map(opt => {
    //   if (opt.uid === uid) {
    //     opt.selected = true;
    //   }
    //   return opt
    // });
    // updateModelOptions(newModelOptions);
    const {uid} = val;
    updateSelectedOption(uid);
    updateTargetModelName(uid);
    toggleSelectedMenu('models') // todo move to constants

  };

  const onConfigClicked = (val) => {
    console.log(val);
    const {uid, configTitle} = val; // todo now that we know which content type, which migration...
    updateSelectedConfigOption({uid, configTitle});
    updateTargetConfigName(configTitle);
    toggleSelectedMenu('configs') // todo move to constants
  };

  const onConfigDelete = (val) => {
    console.log(val)
  };

  return (
    <Wrapper>
      <ListViewContext.Provider value={{state, dispatch}}>
        <div className={'container-fluid'}>
          <div className={'row'}>
            <div className={'col-md-3'}>
              <ContentTypeTable
                models={modelOptions}
                configs={configOptions}
                onModelChecked={onModelChecked}
                onModelClicked={onModelClicked}
                onConfigClicked={onConfigClicked}
                onConfigDelete={onConfigDelete}
                selectedOption={selectedOption}
                selectedConfigOption={selectedConfigOption}
                selectedMenu={selectedMenu}
              />
            </div>
            <div className={'col-md-9 content'}>
              {/*<Block*/}
              {/*  title="General"*/}
              {/*  description="Configure your content types for migration"*/}
              {/*  style={{marginBottom: 12}}*/}
              {/*>*/}
              {
                get(state, [LOADING], false) ? (
                  <LoadingIndicator/>
                ) : (
                  <>
                    {/*<Row>*/}

                    {/*</Row>*/}
                    {/*<Row className={"col-4 row"}>*/}
                    {/*  <Label htmlFor={"targetContentType"}>Select Content Type</Label>*/}
                    {/*  <Select*/}
                    {/*    name={"targetContentType"}*/}
                    {/*    options={modelOptions}*/}
                    {/*    value={targetModelName}*/}
                    {/*    onChange={({target: {value}}) =>*/}
                    {/*      onSelectTarget(value)}*/}
                    {/*  />*/}
                    {/*</Row>*/}
                    {/*<Row style={{display: 'flex', justifyContent: 'space'}}>*/}
                    {/*  <div className={'col-md-9'}>*/}

                    {/*  </div>*/}
                    {/*  <div className={'col-md-3'}>*/}
                    {/*    <Button color={'secondary'}>Reset</Button>*/}
                    {/*    <Button color={'success'}>Generate</Button>*/}
                    {/*  </div>*/}
                    {/*</Row>*/}
                    <Header {...headerProps}/>
                    <Row>
                      {!isEmpty(modelOptions) && (
                        <ContentTypeTree className={''}/>
                      )}
                    </Row>
                  </>
                )
              }
              {/*</Block>*/}
            </div>
          </div>
        </div>
      </ListViewContext.Provider>
    </Wrapper>
  )
};

export default ExportData