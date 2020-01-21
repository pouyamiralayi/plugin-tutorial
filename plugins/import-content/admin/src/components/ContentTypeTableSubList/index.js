import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import TableRow from "../TableRow";
import {Collapse} from 'reactstrap';
import Dropdown from "./DROPDOWN.JS";

const ContentTypeTableSubList = ({title, models, isFirstItem, isSearching, onClickDelete, onConfigClicked}) => {
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

  const CustomRow = ({uid, name, title}) => {
    // console.log(label, uid, checked, selected);
    // const {label, uid, checked, selected} = row;
    return (
      <TableRow
        // selected={selectedOption === uid}
        key={uid}
        onClick={ev => {
          onConfigClicked({uid, configTitle: title})
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
            className="link-icon"
            icon={'trash'}
            onClick={e => {
              e.stopPropagation();
              onClickDelete({title})
            }}
          />
        </button>
        <Collapse isOpen={collapse}>
          <ul>
            {models.map(m => {
              const {uid} = m;
              return (
                <CustomRow key={uid} title={title} {...m}/>
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
  },
  onConfigClicked: () => {
  }
};

ContentTypeTableSubList.propTypes = {
  title: PropTypes.string,
  models: PropTypes.array,
  isFirstItem: PropTypes.bool,
  isSearching: PropTypes.bool,
  onClickDelete: PropTypes.func,
  onConfigClicked: PropTypes.func,
};

export default ContentTypeTableSubList;