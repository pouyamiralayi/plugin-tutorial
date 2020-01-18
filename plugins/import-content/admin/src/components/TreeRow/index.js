import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {get} from 'lodash';
import {FormattedMessage} from 'react-intl';
import {AttributeIcon} from '@buffetjs/core';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import pluginId from '../../pluginId';
// import useDataManager from '../../hooks/useDataManager';
import getTrad from '../../utils/getTrad';
import Curve from '../../icons/Curve';
import UpperFist from '../UpperFirst';
import Wrapper from './Wrapper';
import ListViewContext from "../../utils/ListViewContext";
import {MODELS} from "../../utils/constants";

// import {onClickDelete} from "../../../../../../.cache/plugins/strapi-plugin-users-permissions/admin/src/containers/EditPage/actions";

function TreeRow({name, type, target}) {
  // console.log(item);
  const {state, dispatch} = useContext(ListViewContext);
  // const {type, name, target} = item;
  // const {type, name, target} = {name: 'name', type: 'type', target: 'target'};
  const [ico, updateIco] = useState("");
  const [readableType, updateReadableType] = useState("");
  const [contentTypeFriendlyName, updateContentTypeFriendlyName] = useState("");
  const [src, updateSrc] = useState("");

  useEffect(() => {
    ['integer', 'biginteger', 'float', 'decimal'].includes(type)
      ? updateIco('number')
      : updateIco(type);
  }, [type]);

  useEffect(() => {
    if (['integer', 'biginteger', 'float', 'decimal'].includes(type)) {
      updateReadableType('number')
    } else if (['string'].includes(type)) {
      updateReadableType('text')
    }
    else {
      updateReadableType(type)
    }
  }, [type]);

  useEffect(() => {
    const name = get(state, [MODELS, target, 'schema', 'name'], "");
    updateContentTypeFriendlyName(name)
  }, [target]);

  useEffect(() => {
    target ? updateSrc('relation') : updateSrc(ico)
  }, [target, ico]);

  const repeatable = null;

  // const handleClick = () => {
  //   if (configurable !== false) {
  //     const attrType = nature ? 'relation' : type;
  //     let headerDisplayName = mainTypeName;
  //
  //     if (firstLoopComponentName) {
  //       headerDisplayName = firstLoopComponentName;
  //     }
  //
  //     if (secondLoopComponentUid) {
  //       headerDisplayName = secondLoopComponentName;
  //     }
  //
  //     onClick(
  //       exportName,
  //       // Tells where the attribute is located in the main modifiedData object : contentType, component or components
  //       editTarget,
  //       // main data type uid
  //       secondLoopComponentUid || firstLoopComponentUid || targetUid,
  //       // Name of the attribute
  //       name,
  //       mainTypeName,
  //       // Type of the attribute
  //       attrType,
  //       headerDisplayName,
  //       firstLoopComponentUid ? mainTypeName : null,
  //       secondLoopComponentName ? firstLoopComponentName : null,
  //       secondLoopComponentUid ? firstLoopComponentUid : null
  //     );
  //   }
  // };
  // let loopNumber;

  // if (secondLoopComponentUid && firstLoopComponentUid) {
  //   loopNumber = 2;
  // } else if (firstLoopComponentUid) {
  //   loopNumber = 1;
  // } else {
  //   loopNumber = 0;
  // }

  return (
    <Wrapper
      // onClick={handleClick}
      className={[
        // target ? 'relation-row' : '',
        // configurable ? 'clickable' : '',
        'clickable',
      ]}
      // loopNumber={loopNumber}
    >
      <td>
        <AttributeIcon key={src} type={src}/>
        {/*<Curve fill={isFromDynamicZone ? '#AED4FB' : '#f3f4f4'}/>*/}
        <Curve fill={'#f3f4f4'}/>
      </td>
      <td style={{fontWeight: 600}}>
        <p>{name}</p>
      </td>
      <td>
        {target ? (
          <div>
            <FormattedMessage
              id={`${pluginId}.modelPage.attribute.relationWith`}
            />
            &nbsp;
            <FormattedMessage id={`${pluginId}.from`}>
              {msg => (
                <span style={{fontStyle: 'italic'}}>
                    <UpperFist content={contentTypeFriendlyName}/>
                  &nbsp;
                  {plugin && `(${msg}: ${plugin})`}
                  </span>
              )}
            </FormattedMessage>
          </div>
        ) : (
          <>
            <FormattedMessage id={`${pluginId}.attribute.${readableType}`}/>
            &nbsp;
            {repeatable && (
              <FormattedMessage id={getTrad('component.repeatable')}/>
            )}
          </>
        )}
      </td>
      <td className="button-container">
        <>
          <>
            {/*<button type="button" onClick={handleClick}>*/}
            <button type="button">
              <FontAwesomeIcon className="link-icon" icon="pencil-alt"/>
            </button>
            <button
              type="button"
              // onClick={e => {
              //   e.stopPropagation();

              // removeAttribute(
              //   editTarget,
              //   name,
              //   secondLoopComponentUid || firstLoopComponentUid || ''
              // );
              //   onClickDelete(isFromDynamicZone ? `dz ${editTarget}` : editTarget, name, secondLoopComponentUid || firstLoopComponentUid || '')
              // }}
            >
              <FontAwesomeIcon className="link-icon" icon="trash"/>
            </button>
          </>
        </>
      </td>
    </Wrapper>
  );
}

TreeRow.defaultProps = {
  // configurable: true,
  // firstLoopComponentName: null,
  // firstLoopComponentUid: null,
  // isFromDynamicZone: false,
  // nature: null,
  // onClick: () => {
  // },
  // onClickDelete: () => {
  // },
  // plugin: null,
  // repeatable: false,
  // secondLoopComponentName: null,
  // secondLoopComponentUid: null,
  target: null,
  // targetUid: null,
  type: null,
  // targetModel: {},
};

TreeRow.propTypes = {
  // item: PropTypes.object
  // configurable: PropTypes.bool,
  // editTarget: PropTypes.string.isRequired,
  // firstLoopComponentName: PropTypes.string,
  // firstLoopComponentUid: PropTypes.string,
  // isFromDynamicZone: PropTypes.bool,
  // mainTypeName: PropTypes.string.isRequired,
  name: PropTypes.string,
  // nature: PropTypes.string,
  // onClick: PropTypes.func,
  // plugin: PropTypes.string,
  // repeatable: PropTypes.bool,
  // secondLoopComponentName: PropTypes.string,
  // secondLoopComponentUid: PropTypes.string,
  target: PropTypes.string,
  // targetUid: PropTypes.string,
  type: PropTypes.string,
  // targetModel: PropTypes.object,
  // exportName: PropTypes.string,
  // onClickDelete: PropTypes.func
};

export default TreeRow
