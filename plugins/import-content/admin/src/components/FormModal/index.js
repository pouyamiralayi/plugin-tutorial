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
import ListView from "../ListView"
class FormModal extends Component {

  state = {
    fieldName: "",
    sourceField: "",
    sourceComp: null,
    selectedTarget: ""
  };

  onSelectTarget = (selectedTarget) => {
    this.setState({selectedTarget})
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
    const {fieldName, sourceField, sourceComp, selectedTarget} = this.state;
    this.props.onFormSave({fieldName, sourceField, sourceComp, selectedTarget})
  };



  render() {
    const {sourceField, fieldName, selectedTarget} = this.state
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
                <Row className={"row"}>
                  <div className={"col-4"}>
                    <Label htmlFor="fieldSource">Field Name</Label>
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
                      value={this.state.sourceField}
                      onChange={({target: {value}}) =>
                        this.onChange(value)
                      }
                    />
                  </div>
                </Row>
                <Row className={""}>
                  <Button
                    style={{marginBottom: 12}}
                    label={"Add Field"}
                    onClick={this.onSave}
                    disabled={sourceField == "" || fieldName == ""}
                  />
                </Row>
                {/*<Row>*/}
                {/*  <ListView*/}
                {/*    targetModel={this.props.getTargetModel(this.state.selectedTarget)}*/}
                {/*  />*/}
                {/*</Row>*/}
              </div>
            </ModalBody>
          </ModalForm>
        </form>
      </Modal>
    )
  }

  onOpen = () => {
    console.log("createModal opened!");
    this.setState({
      fieldName: "",
      sourceField: "",
      sourceComp: "",
      selectedTarget: this.props.modelOptions && this.props.modelOptions[0].value
    })
  }

}


FormModal.propTypes = {
  isOpen: PropTypes.bool,
  onFormSave: PropTypes.func,
  onClose: PropTypes.func,
  onToggle: PropTypes.func,
  modelOptions: PropTypes.array.isRequired,
  fillOptions: PropTypes.func.isRequired,
  getTargetModel:PropTypes.func.isRequired
};

export default FormModal