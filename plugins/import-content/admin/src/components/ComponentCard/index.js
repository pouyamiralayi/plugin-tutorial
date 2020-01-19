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
import {COMPONENTS} from "../../utils/constants";

function ComponentCard({
                         component,
                         dzName,
                         index,
                         isActive,
                         removeComponent, // NEW!
                         onClick,
                       }) {

  const {state, dispatch} = useContext(ListViewContext);
 const {schema: {icon, name}} =  get(state, [COMPONENTS, component], {schema: { icon: null }});

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
          /*todo figure out something!*/
          // removeComponent(dzName, index);
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
  component: PropTypes.object,
  dzName: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
  removeComponent: PropTypes.func
};

export default ComponentCard;
