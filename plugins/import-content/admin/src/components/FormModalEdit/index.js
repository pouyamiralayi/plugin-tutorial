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

class FormModalEdit extends Component {
  state = {
    prevFieldName:"",
    fieldName: "",
    sourceField: "",
    sourceComp: ""
  };



  fillOptions = () => {
    const targetModel = this.props.targetModel;
    const schemaAttributes = get(targetModel, ["schema", "attributes"], {});
    const options = Object.keys(schemaAttributes)
      .map(fieldName => {
        const attribute = get(schemaAttributes, [fieldName], {});

        return attribute.type && {label: fieldName, value: fieldName};
      })
      .filter(obj => obj !== undefined);
    return [{ label: "None", value: "none" }, ...options];  };

  setValue = (val) => {
    this.setState({fieldName: val})
  };

  onChange = (val) => {
    if(val == "none"){
      this.setState({sourceField: ""})
    }
    else {
      this.setState({sourceField: val})
    }
  };

  onSave = () => {
    const {fieldName, sourceField, sourceComp, prevFieldName} = this.state;
    this.props.onFormSave({fieldName, sourceField, sourceComp, prevFieldName})
  };

  render() {
    // const {sourceField, fieldName} = this.state
    const {fieldName, sourceComp, sourceField} = this.state;
    return (
      <Modal
        onOpened={this.onOpen}
        isOpen={this.props.isOpen}
        onClosed={this.props.onClose}
        onToggle={this.props.onToggle}
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
                <div className={"row"}>
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
                      options={this.fillOptions()}
                      value={sourceField}
                      onChange={({target: {value}}) =>
                        this.onChange(value)
                      }
                    />
                  </div>
                </div>
                <Row className={""}>
                  <Button
                    style={{marginBottom:12}}
                    label={"Add Field"}
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
    const fieldToEdit = this.props.fieldToEdit
    console.log(fieldToEdit)
    this.setState({...fieldToEdit, prevFieldName:fieldToEdit.fieldName}, () => {
      console.log("initial state: ",this.state)
    })
  }
}

FormModalEdit.propTypes = {
  onFormSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  targetModel: PropTypes.object.isRequired,
  fieldToEdit:PropTypes.object.isRequired,
};

export default FormModalEdit