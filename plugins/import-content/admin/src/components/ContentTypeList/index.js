import React, {useContext, useState, useEffect} from 'react';
import PropTypes from 'prop-types'
import ListViewContext from "../../utils/ListViewContext";
import {ATTRIBUTES, ATTRIBUTES_ARRAY, COMPONENTS, TARGET, TARGET_NAME, TARGET_UID} from "../../utils/constants";
import {get} from 'lodash'
import Wrapper from '../List/List'
import convertAttrObjToArray from "../../utils/convertAttrObjToArray";

const ContentTypeList = ({
                           isFromDynamicZone,
                           component,
                           customRowComponent
                         }) => {
  const {state, dispatch} = useContext(ListViewContext);
  const [attrArray, updateAttributesArray] = useState([]);
  const targetUid = get(state, [TARGET, 'uid'], "");
  const targetName = get(state, [TARGET, 'schema', 'name'], "");

  useEffect(() => {
    const attrs = get(state, [ATTRIBUTES], {});
    const attributesArray = convertAttrObjToArray(attrs);
    updateAttributesArray(attributesArray);
    console.log("attrs", attrArray)
  }, [state]);

  return (
    <>
      <Wrapper isFromDynamicZone={isFromDynamicZone}>
        <table>
          <tbody>
          {attrArray.map(item => {
            const comp = get(state, [COMPONENTS, item.component || component], {});
            const {type} = item;
            const CustomRow = customRowComponent;
            // console.log(item);
            return (
              <React.Fragment key={item.name}>
                <CustomRow
                  {...item}
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
  component: null,
};

ContentTypeList.propTypes = {
  isFromDynamicZone: PropTypes.bool,
  component: PropTypes.string,
  customRowComponent: PropTypes.func,

};

export default ContentTypeList

