import React, {useContext, useState, useEffect} from 'react';
import PropTypes from "prop-types";
import ListViewContext from "../../utils/ListViewContext";
import {ATTRIBUTES, ATTRIBUTES_ARRAY, COMPONENTS, TARGET, TARGET_NAME, TARGET_UID} from "../../utils/constants";
import {get} from 'lodash'
import Wrapper from '../List/List'
import convertAttrObjToArray from "../../utils/convertAttrObjToArray";
import ContentTypeList from "../ContentTypeList";
import Td from "../Td";

const ComponentTree = ({
                         isFromDynamicZone,
                         customRowComponent,
                         component,
                         editTarget,
                         targetUid,
                         targetName
                       }) => {
  const {state, dispatch} = useContext(ListViewContext);
  const [componentName, updateComponentName] = useState("");
  const [attrsArray, updateAttrsArray] = useState([]);

  useEffect(() => {
    const {schema: {name: componentName, attributes}} = get(state, [COMPONENTS, component], {schema: {attributes: {}}});
    const attrArray = convertAttrObjToArray(attributes);
    updateAttrsArray(attrArray);
    console.log(attrArray);
    updateComponentName(componentName)
  }, [component, state]);

  return (
    <tr className="component-row">
      <Td colSpan={12} isChildOfDynamicZone={isFromDynamicZone}>
        <ContentTypeList
          items={attrsArray}
          customRowComponent={customRowComponent}
          isFromDynamicZone={isFromDynamicZone}
          editTarget={"components"}
          targetUid={component}
          targetName={targetName}
        />
      </Td>
    </tr>
  )
};

ComponentTree.defaultProps = {
  component: null,
  customRowComponent: null,
  isFromDynamicZone: false,
};

ComponentTree.propTypes = {
  isFromDynamicZone: PropTypes.bool,
  component: PropTypes.string,
  customRowComponent: PropTypes.func,
  editTarget: PropTypes.string,
  targetUid: PropTypes.string,
  targetName: PropTypes.string,

};

export default ComponentTree