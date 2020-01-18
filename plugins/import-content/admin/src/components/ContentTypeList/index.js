import React, {useEffect, useState, useReducer, useContext} from 'react';
import PropTypes from 'prop-types'
import ListViewContext from "../../utils/ListViewContext";
import {ATTRIBUTES, ATTRIBUTES_ARRAY, COMPONENTS, LOADING} from "../../utils/constants";
import {get, keys} from 'lodash'
import {LoadingIndicator, ListWrapper} from 'strapi-helper-plugin'
import Block from "../Block";
import convertAttrObjToArray from "../../utils/convertAttrObjToArray";
import Wrapper from '../List/List'
import ListHeader from "../ListHeader";
import pluginId from "../../pluginId";

const ContentTypeList = ({
                           isFromDynamicZone,
                           component,
                           customRowComponent
                         }) => {
  const {state, dispatch} = useContext(ListViewContext);
  const attrArray = get(state, [ATTRIBUTES_ARRAY], []);
  return (
    <>
      <Wrapper isFromDynamicZone={isFromDynamicZone}>
        <table>
          <tbody>
          {attrArray.map(item => {
            const comp = get(state, [COMPONENTS, item.component || component], {});
            const {type} = item;
            const CustomRow = customRowComponent;
            return (
              <React.Fragment key={item.name}>
                <CustomRow
                  {...item}
                  isFromDynamicZone={isFromDynamicZone}
                  // targetUid={targetUid}
                  // editTarget={editTarget}
                  // mainTypeName={mainTypeName}
                  // firstLoopComponentName={firstLoopComponentName}
                  // firstLoopComponentUid={firstLoopComponentUid}
                  // secondLoopComponentName={secondLoopComponentName}
                  // secondLoopComponentUid={secondLoopComponentUid}
                />
              </React.Fragment>
            )
          })}
          </tbody>
        </table>
      </Wrapper>
    </>
  )
};

ContentTypeList.defaultProps = {
  isFromDynamicZone: false,
  customRowComponent: null,
};

ContentTypeList.propTypes = {
  isFromDynamicZone: PropTypes.bool,
  component: PropTypes.string,
  customRowComponent: PropTypes.func,

};

export default ContentTypeList

