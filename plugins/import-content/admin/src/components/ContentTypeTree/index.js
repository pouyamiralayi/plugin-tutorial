import React, {useContext, useEffect, useState} from 'react';
import ListViewContext from "../../utils/ListViewContext";
import {ATTRIBUTES_ARRAY} from "../../utils/constants";
import {get} from 'lodash'
import {ListWrapper, useGlobalContext} from 'strapi-helper-plugin'
import Wrapper from '../ListView/Wrapper'
import ListHeader from "../ListHeader";
import pluginId from "../../pluginId";
import ContentTypeList from "../ContentTypeList";
import ListRow from "../ListRow";
import PropTypes from "prop-types";
import TreeRow from "../TreeRow";

const ContentTypeTree = () => {
  const {emitEvent, formatMessage} = useGlobalContext();
  const {state, dispatch} = useContext(ListViewContext);
  const attributesArray = get(state, [ATTRIBUTES_ARRAY], {});
  const [attributesLength, updateAttributesLength] = useState(0);
  const [listTitle, updateListTitle] = useState([]);

  useEffect(() => {
    const attributesLength = attributesArray.length;
    updateAttributesLength(attributesLength)
  }, [attributesArray]);

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

  const CustomRow = props => {
    return (
      <TreeRow {...props}/>
    );
  };

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
              <ContentTypeList
                customRowComponent={props => <CustomRow {...props} />}
              />
            </ListWrapper>
          </div>
        </div>
      </div>
    </Wrapper>
  )
};

ContentTypeTree.propTypes = {};


export default ContentTypeTree