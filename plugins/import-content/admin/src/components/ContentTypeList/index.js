import React, {useContext, useState, useEffect} from 'react';
import PropTypes from 'prop-types'
import ListViewContext from "../../utils/ListViewContext";
import {ATTRIBUTES, ATTRIBUTES_ARRAY, COMPONENTS, TARGET, TARGET_NAME, TARGET_UID} from "../../utils/constants";
import {get, isEmpty} from 'lodash'
import Wrapper from '../List/List'
import convertAttrObjToArray from "../../utils/convertAttrObjToArray";
import ComponentTree from "../ComponentTree";
import DynamicZoneList from "../DynamicZoneList";
import DynamicZoneTree from "../DynamicZoneTree";

const ContentTypeList = ({
                           isFromDynamicZone,
                           customRowComponent,
                           items,
                           editTarget,
                           targetUid,
                           targetName,
                         }) => {
  const {state, dispatch} = useContext(ListViewContext);
  const [attrArray, updateAttributesArray] = useState([]);

  //todo check if this is required or not?
  // const targetUid = get(state, [TARGET, 'uid'], "");
  // const targetName = get(state, [TARGET, 'schema', 'name'], "");

  useEffect(() => {
    if (isEmpty(items)) {
      const attrs = get(state, [ATTRIBUTES], {});
      const attributesArray = convertAttrObjToArray(attrs);
      updateAttributesArray(attributesArray);
      // console.log("attrs", attrArray)
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
                  targetUid={targetUid}
                  targetName={targetName}
                  editTarget={editTarget}
                />
                {type === 'component' && (
                  <ComponentTree
                    component={component}
                    customRowComponent={customRowComponent}
                    targetName={targetName}
                    editTarget={editTarget}
                  />
                )}

                {type === 'dynamiczone' && (
                  <DynamicZoneTree
                    {...item}
                    customRowComponent={customRowComponent}
                    targetName={targetName}
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
  editTarget: PropTypes.string,
  targetUid: PropTypes.string,
  targetName: PropTypes.string,

};

export default ContentTypeList

