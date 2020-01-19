/**
 *
 * ComponentCard
 *
 */

import React, {useContext, useEffect, useState} from 'react';
import {get} from 'lodash';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

// import useDataManager from '../../hooks/useDataManager';
import Wrapper from './Wrapper';
import Close from './Close';
import ListViewContext from "../../utils/ListViewContext";
import {
  COMPONENTS,
  DELETE_ACTION, PERFORM_DELETE_ACTION,
  REMOVE_COMPONENT_FROM_DYNAMIC_ZONE,
  TOGGLE_DELETE_MODAL
} from "../../utils/constants";

function ComponentCard({
                         component,
                         dzName,
                         index,
                         isActive,
                         removeComponent, // NEW!
                         onClick,
                       }) {

  const {state, dispatch} = useContext(ListViewContext);


  const {schema: {icon, name}} = get(state, [COMPONENTS, component], {schema: {icon: null}});

  return (
    <Wrapper onClick={onClick} className={isActive ? 'active' : ''}>
      <div>
        <FontAwesomeIcon icon={icon}/>
      </div>
      <p>{name}</p>
      <div
        className="close-btn"
        onClick={e => {
          e.stopPropagation();
          dispatch({type: REMOVE_COMPONENT_FROM_DYNAMIC_ZONE, payload: {dzName, index}});
        }}
      >
        <Close width="7px" height="7px"/>
      </div>
    </Wrapper>
  );
}

ComponentCard.defaultProps = {
  component: {},
  isActive: false,
  onClick: () => {
  },
};

ComponentCard.propTypes = {
  component: PropTypes.string,
  dzName: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
  removeComponent: PropTypes.func
};

export default ComponentCard;
