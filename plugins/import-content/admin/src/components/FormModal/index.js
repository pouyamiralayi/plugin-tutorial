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

class FormModal extends Component {
  state = {
    fieldName: "",
    sourceField: "",
    sourceComp: null
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
    const {fieldName, sourceField, sourceComp} = this.state
    this.props.onFormSave({fieldName, sourceField, sourceComp})
  };

  render() {
    const {sourceField, fieldName} = this.state
    return (
      <Modal
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
                      value={this.state.fieldName}
                    />
                  </div>
                  <div className={"col-4"}>
                    <Label htmlFor="fieldSource">Source</Label>
                    <Select
                      name={"fieldSource"}
                      options={this.fillOptions()}
                      value={this.state.sourceField}
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
}

FormModal.propTypes = {
  onFormSave: PropTypes.func,
  onClose: PropTypes.func,
  onToggle: PropTypes.func,
  isOpen: PropTypes.bool,
  targetModel: PropTypes.object
};

export default FormModal