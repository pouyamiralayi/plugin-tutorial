import React, {useState, useEffect, useContext} from 'react'
import PropTypes from 'prop-types'
import {Checkbox} from '@buffetjs/core'
// import {List} from '@buffetjs/custom'
import List from './List'
import Wrapper from './Wrapper'
import TableRow from '../TableRow'
import WrapperList from "./WrapperList";
import {FormattedMessage} from 'react-intl'
import getTrad from "../../utils/getTrad";
import ContentTypeTableSubList from "../ContentTypeTableSubList";

const ContentTypeTable = ({onModelChecked, onModelClicked, models, configs, selectedOption}) => {

  const [search, setSearch] = useState("");
  const migrations = [
    {
      title: "18.3",
      models: [
        {uid: 'application::book.book', name: 'book'},
        {uid: 'application::contact.contact', name: 'contact'}
      ]
    }
  ];
  // console.log('modelOptions: ', models);
  const CustomRow = ({label, uid, checked}) => {
    // console.log(label, uid, checked, selected);
    // const {label, uid, checked, selected} = row;
    return (
      <TableRow
        selected={selectedOption === uid}
        key={uid}
        onClick={ev => {
          onModelClicked({uid})
        }}
        className={['clickable']}>
        <a>
          <span>{label}</span> &nbsp;
          <Checkbox
            name={uid}
            onChange={({target: {value}}) => onModelChecked({uid, checked: value})}
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
        {migrations.map((m, i) => <ContentTypeTableSubList {...m} isFirstItem={i == 0} key={i}/>)}
      </WrapperList>
    </Wrapper>
  )
};

ContentTypeTable.propTypes = {
  onModelChecked: PropTypes.func,
  onModelClicked: PropTypes.func,
  models: PropTypes.array,
  configs: PropTypes.array,
  selectedOption: PropTypes.string,
};

ContentTypeTable.defaultProps = {
  configs: []
};

export default ContentTypeTable
