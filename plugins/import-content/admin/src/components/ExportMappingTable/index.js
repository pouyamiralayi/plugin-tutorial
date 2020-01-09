import React, {Component} from "react";
import PropTypes from "prop-types";
import MappingOptions from "./MappingOptions";
import TargetFieldSelect from "./TargetFieldSelect";
import _ from "lodash";
import {Table} from "@buffetjs/core";
import {
  Bool as BoolIcon,
  Json as JsonIcon,
  Text as TextIcon,
  NumberIcon,
  Email as EmailIcon,
  Calendar as DateIcon,
  RichText as XmlIcon
} from "@buffetjs/icons";
import {get} from "lodash";

class MappingTable extends Component {

  state = {mapping: {}};

  CustomRow = ({row}) => {

    const {fieldName, sourceComp, sourceField, format} = row;
    const id = fieldName;
    return (
      <tr style={{paddingTop: 18}}>
        <td>{fieldName}</td>
        <td>
          <p>{sourceComp}</p>
        </td>
        <td>
          {format === "string" && <TextIcon fill="#fdd835"/>}
          {format === "number" && <NumberIcon fill="#fdd835"/>}
          {format === "boolean" && <BoolIcon fill="#fdd835"/>}
          {format === "object" && <JsonIcon fill="#fdd835"/>}
          {format === "email" && <EmailIcon fill="#fdd835"/>}
          {format === "date" && <DateIcon fill="#fdd835"/>}
          {format === "xml" && <XmlIcon fill="#fdd835"/>}
          <p style={{fontWeight: "bold"}}>{format}</p>
        </td>
        <td>
          <p>{sourceField}</p>
        </td>
        {/*<td>*/}
        {/*<span>{minLength}</span>*/}
        {/*</td>*/}
        {/*<td>*/}
        {/*<p>{maxLength}</p>*/}
        {/*</td>*/}
        {/*<td>*/}
        {/*<p>{meanLength}</p>*/}
        {/*</td>*/}
        {/*<td>*/}
        {/*<MappingOptions*/}
        {/*  targetModel={this.props.targetModel}*/}
        {/*  stat={row}*/}
        {/*  onChange={this.changeMappingOptions(row)}*/}
        {/*/>*/}
        {/*</td>*/}
        <td>
          <div className={"row"}>
            <div
              style={{
                marginRight: 18,
                marginLeft: 18
              }}
              onClick={() => this.props.showEdit(fieldName)}>
              <i className={"fa fa-pen"} role={"button"}/>
            </div>
            <div onClick={() => this.props.showDelete(fieldName)}>
              <i className={"fa fa-trash"} role={"button"}/>
            </div>
          </div>
        </td>
      </tr>
    );
  };
  changeMappingOptions = stat => options => {
    let newState = _.cloneDeep(this.state);
    for (let key in options) {
      _.set(newState, `mapping[${stat.fieldName}][${key}]`, options[key]);
    }
    this.setState(newState, () => this.props.onChange(this.state.mapping));
  };

  setMapping = (source, targetField) => {
    const state = _.set(
      this.state,
      `mapping[${source}]['targetField']`,
      targetField
    );
    this.setState(state, () => this.props.onChange(this.state.mapping));
    console.log(this.state.mapping);
  };

  render() {
    const {analysis} = this.props;
    const props = {
      title: "Field Mapping",
      subtitle:
        "Configure the Relationship between Export output Fields and Content type Fields"
    };
    const headers = [
      {name: "Field", value: "fieldName"},
      {name: "Source Component", value: "sourceComp"},
      {name: "Field Type", value: "fieldType"},
      {name: "Source Field", value: "sourceField"},
      {name: "Actions", value: "actions"},
      // {name: "Max Length", value: "maxLength"},
      // {name: "Mean Length", value: "meanLength"},
      // {name: "Options1", value: "options"},
      // {name: "Options2", value: "options"},
      // {name: "Destination", value: "destination"}
    ];
    const rows = []
    const {mapping} = this.props
    Object.keys(mapping).map(fieldName => {
      const {sourceField, sourceComp, format} = get(mapping, [fieldName], {})
      rows.push({fieldName, sourceComp, sourceField, format})
    });
    // const items = [...analysis.fieldStats];
    return (
      <Table
        {...props}
        headers={headers}
        rows={rows}
        customRow={this.CustomRow}
      />
    );
  }

}

MappingTable.propTypes = {
  mapping: PropTypes.object,
  // targetModel: PropTypes.object,
  showDelete: PropTypes.func.isRequired,
  showEdit: PropTypes.func.isRequired,
};

export default MappingTable;
