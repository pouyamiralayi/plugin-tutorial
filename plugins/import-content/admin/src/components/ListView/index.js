// import React from 'react';
import React, {useEffect, useState} from 'react';
// import {Prompt, useHistory, useLocation} from 'react-router-dom';
import PropTypes from 'prop-types';
import {get, has, isEqual, isEmpty} from 'lodash';
import {
  BackHeader,
  ListWrapper,
  useGlobalContext,
  LayoutIcon,
  request,
  LoadingIndicator
} from 'strapi-helper-plugin';
import {Header} from '@buffetjs/custom';
import ListViewContext from '../../utils/ListViewContext';
import convertAttrObjToArray from '../../utils/convertAttrObjToArray';
import getTrad from '../../utils/getTrad';
// import makeSearch from '../../utils/makeSearch';
import ListRow from '../../components/ListRow';
import List from '../../components/List';

// import useDataManager from '../../hooks/useDataManager';
import pluginId from '../../pluginId';

import ListHeader from '../../components/ListHeader';
// import LeftMenu from '../LeftMenu';
import Wrapper from './Wrapper';

/*props:
* targetModel -> PropTypes.object.isRequired
* */
const ListView = ({comps, targetModel}) => {

  // const [components, updateComponents] = useState({});

  // async function getComponents() {
  //   const resp = await request("/content-type-builder/components", {method: "GET"});
  //   const comps = {};
  //   get(resp, ["data"], [])
  //     .map(obj => {
  //       obj.uid ? comps[obj.uid] = obj : null
  //     });
    console.log("comps: (list1)", comps);
  //   updateComponents(comps)
  // }

  // useEffect(() => {
  //   let didCancel = false;
  //   !didCancel && getComponents()
  //   return () => didCancel = true
  // }, []);

  const {
    initialData,
    modifiedData,
    isInDevelopmentMode,
    isInContentTypeView,
    submitData,
    toggleModalCancel,
  } = {
    initialData: {},
    modifiedData: {},
    isInDevelopmentMode: true,
    isInContentTypeView: false,
    submitData: null,
    toggleModalCancel: null
  };
  let compo
  const {emitEvent, formatMessage} = useGlobalContext();
  // const {push, goBack} = useHistory();
  // const {search} = useLocation();
  // const [enablePrompt, togglePrompt] = useState(true);
  // useEffect(() => {
  //   if (search === '') {
  //     togglePrompt(true);
  //   }
  // }, [search]);
  //
  // // Disabling the prompt on the first render if one of the modal is open
  // useEffect(() => {
  //   if (search !== '') {
  //     togglePrompt(false);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // const firstMainDataPath = isInContentTypeView ? 'contentType' : 'component';
  const firstMainDataPath = 'contentType';
  const mainDataTypeAttributesPath = [
    // "contentType",
    'schema',
    'attributes',
  ];

  // const targetUid = get(modifiedData, [firstMainDataPath, 'uid'], "");
  const targetUid = get(targetModel, ['uid'], "");

  /*TODO must fill it using fillOptions or something like that or receive the targetModel and make it shile!!*/
  // const attributes = get(modifiedData, mainDataTypeAttributesPath, {});
  const attributes = get(targetModel, mainDataTypeAttributesPath, {});
  const attributesLength = Object.keys(attributes).length;
  const currentDataName = get(
    targetModel,
    // [firstMainDataPath, 'schema', 'name'],
    ['schema', 'name'],
    ''
  );
  const isFromPlugin = has(initialData, [firstMainDataPath, 'plugin']);
  const hasModelBeenModified = !isEqual(modifiedData, initialData);
  // const forTarget = isInContentTypeView ? 'contentType' : 'component';
  const forTarget = 'contentType';

  const handleClickOpenModalAddField = async (
    forTarget,
    targetUid,
    headerDisplayName,
    headerDisplayCategory = null,
    headerDisplaySubCategory = null,
    subTargetUid = null
  ) => {
    const searchObj = {
      modalType: 'chooseAttribute',
      forTarget,
      targetUid,
      headerDisplayName,
      headerDisplayCategory,
      headerDisplaySubCategory,
      subTargetUid,
    };

    // Disable the prompt
    await wait();

    // push({search: makeSearch(searchObj, true)});
  };

  const handleClickAddComponentToDZ = async dzName => {
    const search = {
      modalType: 'addComponentToDynamicZone',
      forTarget: 'contentType',
      targetUid,
      headerDisplayCategory: currentDataName,
      dynamicZoneTarget: dzName,
      settingType: 'base',
      step: '1',
      actionType: 'edit',
      headerDisplayName: dzName,
    };

    await wait();

    // push({search: makeSearch(search, true)});
  };

  /*TODO edit happens here*/
  const handleClickEditField = async (
    forTarget,
    targetUid,
    attributeName,
    type,
    headerDisplayName,
    headerDisplayCategory = null,
    headerDisplaySubCategory = null,
    subTargetUid = null
  ) => {
    let attributeType;

    switch (type) {
      case 'integer':
      case 'biginteger':
      case 'decimal':
      case 'float':
        attributeType = 'number';
        break;
      case 'string':
      case 'text':
        attributeType = 'text';
        break;
      case '':
        attributeType = 'relation';
        break;
      default:
        attributeType = type;
    }

    await wait();

    const search = {
      modalType: 'attribute',
      actionType: 'edit',
      settingType: 'base',
      forTarget,
      targetUid,
      attributeName,
      attributeType,
      headerDisplayName,
      headerDisplayCategory,
      headerDisplaySubCategory,
      step: type === 'component' ? '2' : null,
      subTargetUid,
    };

    await wait();

    // push({search: makeSearch(search, true)});
  };

  const getDescription = () => {
    const description = get(
      modifiedData,
      [firstMainDataPath, 'schema', 'description'],
      null
    );

    return description
      ? description
      : formatMessage({
        id: `${pluginId}.modelPage.contentHeader.emptyDescription.description`,
      });
  };

  const wait = async () => {
    // togglePrompt(false);
    return new Promise(resolve => setTimeout(resolve, 100));
  };
  const label = get(modifiedData, [firstMainDataPath, 'schema', 'name'], '');

  const headerProps = {
    actions: isInDevelopmentMode
      ? [
        {
          color: 'cancel',
          onClick: () => {
            toggleModalCancel();
          },
          title: formatMessage({
            id: `${pluginId}.form.button.cancel`,
          }),
          type: 'button',
          disabled: isEqual(modifiedData, initialData) ? true : false,
        },
        {
          className: 'button-submit',
          color: 'success',
          onClick: () => submitData(),
          title: formatMessage({
            id: `${pluginId}.form.button.save`,
          }),
          type: 'submit',
          disabled: isEqual(modifiedData, initialData) ? true : false,
        },
      ]
      : [],
    title: {
      label,
      cta:
        isInDevelopmentMode && !isFromPlugin
          ? {
            icon: 'pencil-alt',
            onClick: async () => {
              await wait();

              // if (firstMainDataPath === 'contentType') {
              //   emitEvent('willEditNameOfContentType');
              // }

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
          : null,
    },
    content: getDescription(),
  };


  const listTitle = [
    formatMessage(
      {
        id: `${pluginId}.table.attributes.title.${
          attributesLength > 1 ? 'plural' : 'singular'
        }`,
      },
      {number: attributesLength}
    ),
  ];

  const addButtonProps = {
    icon: true,
    className: 'add-button',
    color: 'primary',
    label: formatMessage({id: `${pluginId}.button.attributes.add.another`}),
    onClick: () => {
      handleClickOpenModalAddField(forTarget, targetUid, currentDataName);
    },
  };
  const goToCMSettingsPage = () => {
    const endPoint = isInContentTypeView
      ? `/plugins/content-manager/${targetUid}/ctm-configurations/edit-settings/content-types`
      : `/plugins/content-manager/ctm-configurations/edit-settings/components/${targetUid}/`;
    push(endPoint);
  };

  const configureButtonProps = {
    icon: <LayoutIcon className="colored" fill="#007eff"/>,
    color: 'secondary',
    label: formatMessage({id: `${pluginId}.form.button.configure-view`}),
    onClick: goToCMSettingsPage,
    style: {height: '30px', marginTop: '1px'},
    className: 'button-secondary',
  };

  const listActions = isInDevelopmentMode
    ? [{...configureButtonProps}, {...addButtonProps}]
    : [configureButtonProps];

  const handleClickOnTrashIcon = () => {
  };

  const CustomRow = props => {
    const {name} = props;

    return (
      <ListRow
        {...props}
        attributeName={name}
        name={name}
        onClick={handleClickEditField}
        onClickDelete={handleClickOnTrashIcon}
        targetModel={targetModel}
      />
    );
  };

  CustomRow.defaultProps = {
    name: null,
  };

  CustomRow.propTypes = {
    name: PropTypes.string,
  };

  return (
    <ListViewContext.Provider
      value={{openModalAddField: handleClickOpenModalAddField}}
    >
      <Wrapper>
        {/*<BackHeader onClick={goBack}/>*/}
        {/*<Prompt*/}
        {/*  message={formatMessage({id: getTrad('prompt.unsaved')})}*/}
        {/*  when={hasModelBeenModified && enablePrompt}*/}
        {/*/>*/}
        <div className="container-fluid">
          <div className="row">
            {/*<LeftMenu wait={wait}/>*/}
            <div
              className="col-md-9 content"
              style={{paddingLeft: '30px', paddingRight: '30px'}}
            >
              {/*TODO fieldName && selectTarget*/}
              {/*<Header {...headerProps} />*/}

              <ListWrapper style={{marginBottom: 80}}>
                {/*<ListHeader actions={listActions} title={listTitle}/>*/}
                <ListHeader title={listTitle}/>
                {isEmpty(comps) ? (<LoadingIndicator/>) :
                  (
                    <List
                      items={convertAttrObjToArray(attributes)}
                      comps={comps}
                      customRowComponent={props => <CustomRow {...props} />}
                      addComponentToDZ={handleClickAddComponentToDZ}
                      targetUid={targetUid}
                      dataType={forTarget}
                      dataTypeName={currentDataName}
                      mainTypeName={currentDataName}
                      editTarget={forTarget}
                      isMain
                    />
                  )
                }
              </ListWrapper>
            </div>
          </div>
        </div>
      </Wrapper>
    </ListViewContext.Provider>
  );
};


export default ListView;


