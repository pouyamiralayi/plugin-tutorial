import PropTypes from "prop-types"
import {
  HeaderModal, HeaderModalTitle, Modal,
  ModalBody, ModalFooter, ModalForm
} from 'strapi-helper-plugin'
import React, {Component} from 'react'
import ModalHeader
  from "../../../../../../.cache/plugins/strapi-plugin-content-type-builder/admin/src/components/ModalHeader";
import {Select, InputText, Button, Label} from '@buffetjs/core'
import {get} from "lodash"
import Row from '../Row'
import Block from "../Block";

class FormModalEdit extends Component {
  state = {
    prevFieldName: "",
    fieldName: "",
    sourceField: "",
    sourceComp: "",
    selectedTarget: ""
  };

  onSelectTarget = (selectedTarget) => {
    this.setState({selectedTarget})
  };

  fillOptions = () => {
    const targetModel = this.props.getTargetModel(this.state.selectedTarget);
    const schemaAttributes = get(targetModel, ["schema", "attributes"], {});
    const options = Object.keys(schemaAttributes)
      .map(fieldName => {
        const attribute = get(schemaAttributes, [fieldName], {});

        return attribute.type && {label: fieldName, value: fieldName};
      })
      .filter(obj => obj !== undefined);
    return [{label: "None", value: "none"}, ...options];
  };

  setValue = (val) => {
    this.setState({fieldName: val})
  };

  onChange = (val) => {
    if (val == "none") {
      this.setState({sourceField: ""})
    } else {
      this.setState({sourceField: val})
    }
  };

  onSave = () => {
    const {fieldName, sourceField, sourceComp, prevFieldName, selectedTarget} = this.state;
    this.props.onFormSave({fieldName, sourceField, sourceComp, prevFieldName, selectedTarget})
  };

  render() {
    const {sourceField, fieldName, sourceComp} = this.state;
    return (
      <Modal
        isOpen={this.props.isOpen}
        onClosed={this.props.onClose}
        onToggle={this.props.onToggle}
        onOpened={this.onOpen}
      >
        {/*<HeaderModal>*/}
        {/*  <ModalHeader*/}
        {/*    name={"Add new Field"}*/}
        {/*    headerId={"newField"}*/}
        {/*    iconType={"content-type"}*/}
        {/*  >*/}
        {/*    <section>*/}
        {/*      <HeaderModalTitle>*/}
        {/*        {"Edit Field"}*/}
        {/*      </HeaderModalTitle>*/}
        {/*    </section>*/}
        {/*  </ModalHeader>*/}
        {/*</HeaderModal>*/}
        <form>
          <ModalForm>
            <ModalBody>
              <div className={"container-fluid"}>
                <Row className={"col-4 row"}>
                  <Label htmlFor={"targetContentType"}>Select Content Type</Label>
                  <Select
                    name={"targetContentType"}
                    options={this.props.modelOptions}
                    value={this.state.selectedTarget}
                    onChange={({target: {value}}) =>
                      this.onSelectTarget(value)}
                  />
                </Row>
                <div className={"row"}>
                  <div className={"col-4"}>
                    <Label htmlFor="fieldNames">Field Name</Label>
                    <InputText
                      name={"fieldName"}
                      onChange={({target: {value}}) => {
                        this.setValue(value);
                      }}
                      placeholder="Field Name"
                      type="text"
                      value={fieldName}
                    />
                  </div>
                  <div className={"col-4"}>
                    <Label htmlFor="fieldSource">Source</Label>
                    <Select
                      name={"fieldSource"}
                      options={this.props.fillOptions(this.state.selectedTarget)}
                      value={sourceField}
                      onChange={({target: {value}}) =>
                        this.onChange(value)
                      }
                    />
                  </div>
                </div>
                <Row className={""}>
                  <Button
                    style={{marginBottom: 12}}
                    label={"Apply"}
                    onClick={this.onSave}
                    disabled={sourceField == "" || fieldName == ""}
                  />
                </Row>
              </div>
            </ModalBody>
          </ModalForm>
        </form>
      </Modal>
    )
  }

  onOpen = () => {
    const fieldToEdit = this.props.fieldToEdit;
    console.log(fieldToEdit);
    const {fieldName, selectedTarget} = fieldToEdit;
    this.setState({...fieldToEdit, prevFieldName: fieldName, selectedTarget}, () => {
      console.log("initial state: ", this.state)
    })
  }
}

FormModalEdit.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onFormSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  fieldToEdit: PropTypes.object.isRequired,
  modelOptions: PropTypes.array.isRequired,
  fillOptions: PropTypes.func.isRequired
};

export default FormModalEdit