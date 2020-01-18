import React, {useEffect, useState, useReducer, useContext} from 'react';
import ListViewContext from "../../utils/ListViewContext";
import {ATTRIBUTES, COMPONENTS, LOADING} from "../../utils/constants";
import {get, keys} from 'lodash'
import {LoadingIndicator, ListWrapper,useGlobalContext} from 'strapi-helper-plugin'
import Block from "../Block";
import convertAttrObjToArray from "../../utils/convertAttrObjToArray";
import Wrapper from '../ListView/Wrapper'
import ListHeader from "../ListHeader";
import pluginId from "../../pluginId";
import ContentTypeList from "../ContentTypeList";

const ContentTypeTree = () => {
  const {emitEvent, formatMessage} = useGlobalContext();
  const {state, dispatch} = useContext(ListViewContext);
  const attributes = get(state, [ATTRIBUTES], {});
  const [attributesArray, updateAttributesArray] = useState([]);
  const [attributesLength, updateAttributesLength] = useState(0);
  const [listTitle, updateListTitle] = useState([]);

  useEffect(() => {
    const attributesArray = convertAttrObjToArray(attributes);
    updateAttributesArray(attributesArray);
    const attributesLength = Object.keys(attributes).length;
    updateAttributesLength(attributesLength)
  }, [attributes]);

  useEffect(() => {
    const title = formatMessage(
      {
        id: `${pluginId}.table.attributes.title.${
          attributesLength > 1 ? 'plural' : 'singular'
        }`,
      },
      {number: attributesLength}
    );
    title && updateListTitle([title])
  }, [attributesLength]);

  return (
    <Wrapper>
      <div className="container-fluid">
        <div className="row">
          {/*<LeftMenu wait={wait}/>*/}
          <div
            className="row col-12"
          >
            {/*<Header {...headerProps} />*/}
            <ListWrapper style={{marginBottom: 80}}>
              <ListHeader title={listTitle}/>
              <ContentTypeList/>
            </ListWrapper>
          </div>
        </div>
      </div>
    </Wrapper>
  )
};

export default ContentTypeTree