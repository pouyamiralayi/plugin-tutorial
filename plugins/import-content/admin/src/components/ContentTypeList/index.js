import React, {useContext} from 'react';
import PropTypes from 'prop-types'
import ListViewContext from "../../utils/ListViewContext";
import {ATTRIBUTES_ARRAY, COMPONENTS, TARGET, TARGET_NAME, TARGET_UID} from "../../utils/constants";
import {get} from 'lodash'
import Wrapper from '../List/List'

const ContentTypeList = ({
                           isFromDynamicZone,
                           component,
                           customRowComponent
                         }) => {
  const {state, dispatch} = useContext(ListViewContext);
  const attrArray = get(state, [ATTRIBUTES_ARRAY], []);
  const targetUid = get(state, [TARGET, 'uid'], "");
  const targetName = get(state, [TARGET, 'schema', 'name'], "");
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

