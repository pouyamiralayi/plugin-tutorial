import React, {useContext, useEffect, useState} from 'react';
import ListViewContext from "../../utils/ListViewContext";
import {ATTRIBUTES, ATTRIBUTES_ARRAY, EDIT_ATTRIBUTE, TARGET} from "../../utils/constants";
import {get, has, omit} from 'lodash'
import {ListWrapper, useGlobalContext} from 'strapi-helper-plugin'
import Wrapper from '../ListView/Wrapper'
import ListHeader from "../ListHeader";
import pluginId from "../../pluginId";
import ContentTypeList from "../ContentTypeList";
import ListRow from "../ListRow";
import PropTypes from "prop-types";
import TreeRow from "../TreeRow";
import FormModalEdit from "../FormModalEdit";
import convertAttrObjToArray from "../../utils/convertAttrObjToArray";

const ContentTypeTree = () => {
  const {emitEvent, formatMessage} = useGlobalContext();
  const {state, dispatch} = useContext(ListViewContext);
  const [attributesLength, updateAttributesLength] = useState(0);
  const [listTitle, updateListTitle] = useState([]);
  const [showEditModal, toggleShowEditModal] = useState(false);
  const [fieldToEdit, updateFieldToEdit] = useState({});

  const targetUid = get(state, [TARGET, 'uid'], "");
  const targetName = get(state, [TARGET, 'schema', 'name'], "");

  useEffect(() => {
    const attributesArray = convertAttrObjToArray(get(state, [ATTRIBUTES], {}));
    const attributesLength = attributesArray.length;
    updateAttributesLength(attributesLength)
  }, [state]);

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

  const onFormEdit = (val) => {
    const {editTarget, targetUid, targetName} = fieldToEdit;
    dispatch({type: EDIT_ATTRIBUTE, payload: {...val, editTarget, targetUid, targetName}});
    toggleShowEditModal(false)
  };

  const showEdit = (fieldName, exportName, targetUid, targetName, editTarget) => {
    // console.log({fieldName, exportName, targetUid, targetName,editTarget});
    updateFieldToEdit({fieldName, exportName, targetUid, editTarget, targetName});
    toggleShowEditModal(true)
  };

  const CustomRow = props => {
    return (
      <TreeRow
        {...props}
        onClick={showEdit}
      />
    );
  };

  return (
    <Wrapper>
      <div className="container-fluid">
        <div className="row">
          {/*<LeftMenu wait={wait}/>*/}
          <div
            className="col-9 content"
          >
            {/*<Header {...headerProps} />*/}
            <ListWrapper style={{marginBottom: 80}}>
              <ListHeader title={listTitle}/>
              <FormModalEdit
                isOpen={showEditModal}
                onFormSave={onFormEdit}
                onClose={() => toggleShowEditModal(false)}
                onToggle={() => toggleShowEditModal(prev => !prev)}
                fieldToEdit={fieldToEdit}
              />
              <ContentTypeList
                customRowComponent={props => <CustomRow {...props} />}
                editTarget={'contentType'}
                targetUid={targetUid}
                targetName={targetName}
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