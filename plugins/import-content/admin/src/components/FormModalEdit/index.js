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
    exportName: '',
    fieldName: '',
  };

  setValue = (val) => {
    this.setState({exportName: val})
  };

  render() {
    const {exportName} = this.state;
    return (
      <Modal
        isOpen={this.props.isOpen}
        onClosed={this.props.onClose}
        onToggle={this.props.onToggle}
        onOpened={this.onOpen}
      >
        {/*todo header & footer*/}
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
                      value={exportName}
                    />
                  </div>
                </div>
                <Row className={""}>
                  <Button
                    style={{marginBottom: 12}}
                    label={"Apply"}
                    onClick={this.onSave}
                    disabled={exportName == ""}
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
    const {fieldName, exportName} = this.props.fieldToEdit;
    this.setState({exportName: exportName || fieldName, fieldName})
  };

  onSave = () => {
    /*todo validation (no space!)*/
    const {exportName, fieldName} = this.state;
    this.props.onFormSave({attributeName: fieldName, exportName})
  };
}

FormModalEdit.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onFormSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  fieldToEdit: PropTypes.string.isRequired,
  modelOptions: PropTypes.array,
  fillOptions: PropTypes.func
};

export default FormModalEdit