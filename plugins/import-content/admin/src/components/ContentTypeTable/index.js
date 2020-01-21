import React, {useState, useEffect, useContext} from 'react'
import PropTypes from 'prop-types'
// import {Checkbox} from '@buffetjs/core'
import Checkbox from './Checkbox'
// import {List} from '@buffetjs/custom'
import List from './List'
import Wrapper from './Wrapper'
import TableRow from '../TableRow'
import WrapperList from "./WrapperList";
import {FormattedMessage} from 'react-intl'
import getTrad from "../../utils/getTrad";
import ContentTypeTableSubList from "../ContentTypeTableSubList";

const ContentTypeTable = ({onModelChecked, onModelClicked, onConfigClicked, onConfigDelete, models, configs, selectedOption, selectedMenu, selectedConfigOption}) => {

  const [search, setSearch] = useState("");
  const migrations = [
    {
      title: "18.3",
      models: [
        {uid: 'application::book.book', name: 'book'},
        {uid: 'application::contact.contact', name: 'contact'}
      ]
    },
    {
      title: "18.4",
      models: [
        {uid: 'application::book.book', name: 'book'},
        {uid: 'application::contact.contact', name: 'contact'}
      ]
    }
  ];
  // console.log('modelOptions: ', models);
  const CustomRow = ({label, uid, checked, selectedMenu}) => {
    // console.log(label, uid, checked, selected);
    // const {label, uid, checked, selected} = row;
    return (
      <TableRow
        selected={selectedMenu === 'models' ? selectedOption === uid : null}
        key={uid}
        onClick={ev => {
          onModelClicked({uid})
        }}
        className={['clickable']}>
        <a>
          <span>{label}</span> &nbsp;
          <Checkbox
            name={uid}
            onChange={(e) => {
              e.persist();
              e.nativeEvent.stopImmediatePropagation();
              e.stopPropagation();
              const {target: {value}} = e;
              onModelChecked({uid, checked: value})
            }
            }
            value={checked}/>
        </a>
      </TableRow>
    )
  };

  CustomRow.propTypes = {
    label: PropTypes.string,
    uid: PropTypes.string,
    checked: PropTypes.bool,
    selected: PropTypes.bool,
    selectedMenu: PropTypes.string,
  };

  const props = {
    title: 'Ready to migrate',
    subtitle: 'List of content types available for migration',
    // button: {
    //   color: 'primary',
    //   // icon: 'content-type',
    //   icon: true,
    //   label: 'Add new Content Type',
    //   onClick: () => alert('Do you want to create a new chief entry?'),
    //   type: 'button',
    // },
  };

  const renderItem = (m, i) => {
    return (
      <CustomRow {...m} key={i}/>
    )
  };

  return (
    <Wrapper>
      <WrapperList>
        <div className={'list-header'}>
          <div className="title-wrapper">
            {/*<h3 style={{ 'padding-left': '1.2rem'}}>*/}
            <h3>
              <FormattedMessage id={getTrad(`menu.section.models.name.${models.length > 1 ? 'plural' : 'singular'}`)}/>
              &nbsp;&nbsp;
              <span className="count-info" datadescr={models.length}>
                {models.length}
              </span>
            </h3>
            {/*<button onClick={toggleSearch}>*/}
            {/*  <FontAwesomeIcon icon="search"/>*/}
            {/*</button>*/}
          </div>
        </div>
        <List>{models.map((m, i) => renderItem(m, i))}</List>
        <div className={'list-header'} style={{marginTop: '1.2rem'}}>
          <div className="title-wrapper">
            <h3>
              <FormattedMessage
                id={getTrad(`menu.section.migration.configs.name.${configs.length > 1 ? 'plural' : 'singular'}`)}/>
              &nbsp;&nbsp;
              <span className="count-info" datadescr={configs.length}>
                {configs.length}
              </span>
            </h3>
          </div>
        </div>
        <List>
          {migrations.map((m, i) => <ContentTypeTableSubList
            key={i}
            {...m}
            onConfigClicked={onConfigClicked}
            onClickDelete={onConfigDelete}
            isFirstItem={i == 0}
          />)}
        </List>
      </WrapperList>
    </Wrapper>
  )
};

ContentTypeTable.propTypes = {
  onModelChecked: PropTypes.func,
  onModelClicked: PropTypes.func,
  onConfigClicked: PropTypes.func,
  onConfigDelete: PropTypes.func,
  models: PropTypes.array,
  configs: PropTypes.array,
  selectedOption: PropTypes.string,
  selectedConfigOption: PropTypes.string,
  selectedMenu: PropTypes.string,
};

ContentTypeTable.defaultProps = {
  configs: [],
  onConfigClicked: () => {
  },
  onConfigDelete: () => {
  },
  onModelClicked: () => {
  },
};

export default ContentTypeTable