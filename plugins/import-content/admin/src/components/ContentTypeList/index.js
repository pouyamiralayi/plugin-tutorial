import React, {useContext, useState, useEffect} from 'react';
import PropTypes from 'prop-types'
import ListViewContext from "../../utils/ListViewContext";
import {ATTRIBUTES, ATTRIBUTES_ARRAY, COMPONENTS, TARGET, TARGET_NAME, TARGET_UID} from "../../utils/constants";
import {get, isEmpty} from 'lodash'
import Wrapper from '../List/List'
import convertAttrObjToArray from "../../utils/convertAttrObjToArray";
import ComponentTree from "../ComponentTree";

const ContentTypeList = ({
                           isFromDynamicZone,
                           customRowComponent,
                           items,
                         }) => {
  const {state, dispatch} = useContext(ListViewContext);
  const [attrArray, updateAttributesArray] = useState([]);
  const targetUid = get(state, [TARGET, 'uid'], "");
  const targetName = get(state, [TARGET, 'schema', 'name'], "");

  useEffect(() => {
    if (isEmpty(items)) {
      const attrs = get(state, [ATTRIBUTES], {});
      const attributesArray = convertAttrObjToArray(attrs);
      updateAttributesArray(attributesArray);
      console.log("attrs", attrArray)
    } else {
      updateAttributesArray(items)
    }
  }, [state, items]);

  return (
    <>
      <Wrapper isFromDynamicZone={isFromDynamicZone}>
        <table>
          <tbody>
          {attrArray.map(item => {
            // const comp = get(state, [COMPONENTS, item.component || component], {});
            const {type, component} = item;
            const CustomRow = customRowComponent;
            // console.log(item);
            return (
              <React.Fragment key={item.name}>
                <CustomRow
                  {...item}
                />
                {type === 'component' && (
                  <ComponentTree
                    component={component}
                    customRowComponent={customRowComponent}
                  />
                )}
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
  items: [],
};

ContentTypeList.propTypes = {
  isFromDynamicZone: PropTypes.bool,
  component: PropTypes.string,
  customRowComponent: PropTypes.func,
  items: PropTypes.instanceOf(Array),
};

export default ContentTypeList

