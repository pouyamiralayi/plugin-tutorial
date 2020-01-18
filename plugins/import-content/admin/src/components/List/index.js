/**
 *
 * List
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import {useGlobalContext} from 'strapi-helper-plugin';
import {Plus} from '@buffetjs/icons';

import pluginId from '../../pluginId';
// import useListView from '../../hooks/useListView';
// import useDataManager from '../../hooks/useDataManager';
import DynamicZoneList from '../DynamicZoneList';
import ComponentList from '../ComponentList';
// import { ListButton } from '../ListButton';
import Wrapper from './List';
import {get, isEmpty} from "lodash"

import {useEffect, useContext} from 'react'
import ListViewContext from "../../utils/ListViewContext";
import convertAttrObjToArray from "../../utils/convertAttrObjToArray";
import {ATTRIBUTES} from "../../utils/constants";

function List({
                component,
                className,
                customRowComponent,
                items,
                addComponentToDZ,
                removeComponentFromDZ, // NEW!
                targetUid,
                mainTypeName,
                editTarget,
                isFromDynamicZone,
                isMain,
                firstLoopComponentName,
                firstLoopComponentUid,
                secondLoopComponentName,
                secondLoopComponentUid,
                isSub,
                comps
              }) {

  const {state, dispatch} = useContext(ListViewContext);
  const attrs = get(state, [ATTRIBUTES], {});
  let attrArray;
  attrArray = convertAttrObjToArray(attrs);


  useEffect(() => {
  }, []);
  console.log("STATE: ", state);
  console.log("ATTRIBUTES: ", attrs);
  console.log("ATTRIBUTES ARRAY:", attrArray);

  console.log("comps: (list2)", comps);
  if (isFromDynamicZone) {
    console.log("comps: (dz)", comps);
  }
  const {formatMessage} = useGlobalContext();
  // const { isInDevelopmentMode } = useDataManager();
  const isInDevelopmentMode = true;
  // const { openModalAddField } = useListView();
  const onClickAddField = () => {
    let headerDisplayName = mainTypeName;

    if (firstLoopComponentName) {
      headerDisplayName = firstLoopComponentName;
    }

    if (secondLoopComponentUid) {
      headerDisplayName = secondLoopComponentName;
    }

    // openModalAddField(
    //   editTarget,
    //   targetUid,
    //   headerDisplayName,
    //   firstLoopComponentUid ? mainTypeName : null,
    //   secondLoopComponentName ? firstLoopComponentName : null,
    //   secondLoopComponentUid ? firstLoopComponentUid : null
    // );
  };

  const addButtonProps = {
    icon: !isSub ? <Plus fill="#007eff" width="11px" height="11px"/> : false,
    color: 'primary',
    label: isInDevelopmentMode
      ? formatMessage({
        id: !isSub
          ? `${pluginId}.form.button.add.field.to.${editTarget}`
          : `${pluginId}.form.button.add.field.to.component`,
      })
      : null,
    onClick: onClickAddField,
  };

  if (!targetUid) {
    return null;
  }

  return (
    <>
      <Wrapper className={className} isFromDynamicZone={isFromDynamicZone}>
        <table>
          <tbody>
          {attrArray && attrArray.map(item => {
            // {items.map(item => {
            console.log("item: ", item);
            const comp = get(comps, [item.component || component], {});
            const {type} = item;
            if (isFromDynamicZone) {
              console.log("comp: (dz)", comp);
              console.log("type: (dz)", type);
              console.log("item: (dz)", item);
            }
            const CustomRow = customRowComponent;
            return (
              <React.Fragment key={item.name}>
                <CustomRow
                  {...item}
                  targetUid={targetUid}
                  mainTypeName={mainTypeName}
                  editTarget={editTarget}
                  firstLoopComponentName={firstLoopComponentName}
                  firstLoopComponentUid={firstLoopComponentUid}
                  isFromDynamicZone={isFromDynamicZone}
                  secondLoopComponentName={secondLoopComponentName}
                  secondLoopComponentUid={secondLoopComponentUid}
                />

                {type === 'component' && !isEmpty(comp) && !isEmpty(comps) && (
                  <ComponentList
                    {...item}
                    comp={comp}
                    comps={comps}
                    customRowComponent={customRowComponent}
                    targetUid={targetUid}
                    // NEW PROPS
                    mainTypeName={mainTypeName}
                    editTarget={editTarget}
                    firstLoopComponentName={firstLoopComponentName}
                    firstLoopComponentUid={firstLoopComponentUid}
                  />
                )}

                {type === 'dynamiczone' && !isEmpty(comps) && (
                  <DynamicZoneList
                    {...item}
                    comps={comps}
                    customRowComponent={customRowComponent}
                    addComponent={addComponentToDZ}
                    removeComponent={removeComponentFromDZ}
                    targetUid={targetUid}
                    mainTypeName={mainTypeName}
                  />
                )}
              </React.Fragment>
            );
          })}
          </tbody>
        </table>
        {/*{isMain && isInDevelopmentMode && (*/}
        {/*  <ListButton {...addButtonProps}></ListButton>*/}
        {/*)}*/}
        {/*{!isMain && <ListButton {...addButtonProps}></ListButton>}*/}
      </Wrapper>
      {isSub && (
        <div className="plus-icon" onClick={onClickAddField}>
          {/*{isInDevelopmentMode && (*/}
          {/*  <Plus fill={isFromDynamicZone ? '#007EFF' : '#b4b6ba'}/>*/}
          {/*)}*/}
        </div>
      )}
    </>
  );
}

List.defaultProps = {
  addField: () => {
  },
  addComponentToDZ: () => {
  },
  className: null,
  customRowComponent: null,
  firstLoopComponentName: null,
  firstLoopComponentUid: null,
  isFromDynamicZone: false,
  isMain: false,
  isSub: false,
  items: [],
  secondLoopComponentName: null,
  secondLoopComponentUid: null,
  targetUid: null,
  // comps: {}
};

List.propTypes = {
  addComponentToDZ: PropTypes.func,
  className: PropTypes.string,
  customRowComponent: PropTypes.func,
  editTarget: PropTypes.string.isRequired,
  firstLoopComponentName: PropTypes.string,
  firstLoopComponentUid: PropTypes.string,
  isFromDynamicZone: PropTypes.bool,
  isMain: PropTypes.bool,
  items: PropTypes.instanceOf(Array),
  mainTypeName: PropTypes.string.isRequired,
  secondLoopComponentName: PropTypes.string,
  secondLoopComponentUid: PropTypes.string,
  targetUid: PropTypes.string,
  isSub: PropTypes.bool,
  comps: PropTypes.object.isRequired,
  component: PropTypes.string,
  removeComponentFromDZ: PropTypes.func
};

export default List;
