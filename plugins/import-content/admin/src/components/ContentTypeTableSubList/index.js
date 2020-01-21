import React, {useEffect, useContext, useState} from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import TableRow from "../TableRow";
import {Checkbox} from '@buffetjs/core'
import {Collapse} from 'reactstrap';
import Dropdown from "./DROPDOWN.JS";
import List from "../ContentTypeTable/List";

const ContentTypeTableSubList = ({title, models, isFirstItem, isSearching, onClickDelete}) => {
  const [collapse, setCollapse] = useState(isFirstItem);

  const toggle = () => {
    setCollapse(!collapse);
  };


  useEffect(() => {
    if (isSearching) {
      setCollapse(true);
    } else {
      setCollapse(isFirstItem);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSearching]);

  const CustomRow = ({uid, name}) => {
    // console.log(label, uid, checked, selected);
    // const {label, uid, checked, selected} = row;
    return (
      <TableRow
        // selected={selectedOption === uid}
        key={uid}
        onClick={ev => {
          // onModelClicked({uid})
        }}
        className={['clickable']}>
        <a>
          <span>{name}</span> &nbsp;
        </a>
      </TableRow>
    )
  };

  CustomRow.propTypes = {
    label: PropTypes.string,
    uid: PropTypes.string,
    checked: PropTypes.bool,
    selected: PropTypes.bool,
  };

  return (
    models.length > 0 && (
      <Dropdown>
        <button
          onClick={toggle}
          className={`editable ${collapse ? 'is-open' : ''}`}
        >
          {title}
          <FontAwesomeIcon
            icon={'fa fa-trash'}
            onClick={e => {
              onClickDelete(e, {title})
            }}
          />
        </button>
          <Collapse isOpen={collapse}>
            <ul>
              {models.map(m => {
                const {uid} = m;
                return (
                  <CustomRow key={uid} {...m}/>
                )
              })}
            </ul>
          </Collapse>
      </Dropdown>
    )
  )

};

ContentTypeTableSubList.defaultProps = {
  title: "",
  models: [],
  isFirstItem: false,
  isSearching: false,
  onClickDelete: () => {
  }
};

ContentTypeTableSubList.propTypes = {
  title: PropTypes.string,
  models: PropTypes.array,
  isFirstItem: PropTypes.bool,
  isSearching: PropTypes.bool,
  onClickDelete: PropTypes.func,
};

export default ContentTypeTableSubList;