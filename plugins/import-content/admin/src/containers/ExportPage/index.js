import React, {Component} from "react"
import {HeaderNav, LoadingIndicator, PluginHeader, PopUpWarning, request} from 'strapi-helper-plugin'
import Block from '../../components/Block'
import Row from "../../components/Row";
import pluginId from "../../pluginId";
import FormModalEdit from "../../components/FormModalEdit";
import {get, has, isEmpty, omit} from 'lodash'
import {Button, Label, Select} from "@buffetjs/core";
import ListView from "../../components/ListView";

const getUrl = to =>
  to ? `/plugins/${pluginId}/${to}` : `/plugins/${pluginId}`;

class ExportPage extends Component {
  /*state -> exported item? received from the server
  * state -> selected content type
  * state -> mapping object? slug -> sourceField || sourceComponent -> componentSourceField
  * state -> files? fileSlug -> componentSourceField
  * */
  state = {
    // exportConfigs: {}, // cache the previous export configs in case we want them again
    // exportConfig: {},
    loading: true,
    showCreateModal: false,
    createModalError: "",
    showEditModal: false,
    fieldToEdit: {},
    showDeleteModal: false,
    fieldToDelete: {},
    selectedTarget: "",
    models: [],
    modelOptions: [],
    mapping: {},
    formEditModalError: "",
    components: {},
  };

  getComponents = async () => {
    const resp = await request("/content-type-builder/components", {method: "GET"});
    const components = {};
    get(resp, ["data"], [])
      .map(obj => {
        obj.uid ? components[obj.uid] = obj : null
      });
    // console.log("comps: ", components);
    return components
  };

  deleteField = (fieldName) => {
    let {mapping} = this.state;
    mapping = omit(mapping, [fieldName]);
    this.setState({showDeleteModal: false, mapping}, () => {
      strapi.notification.success("Deleted")
    })
  };

  getModels = async () => {
    try {
      const response = await request("/content-type-builder/content-types", {
        method: "GET"
      });

      // Remove content types from models
      const models = get(response, ["data"], []).filter(
        obj => !has(obj, "plugin")
      );

      const modelOptions = models.map(model => {
        return {
          label: get(model, ["schema", "name"], ""),
          value: model.uid
        }
      });

      this.setState({loading: false});
      return {models, modelOptions};
    } catch (e) {
      this.setState({loading: false}, () => {
        strapi.notification.error(`${e}`);
      });
    }
  };

  onFormSave = (val) => {
    this.setState({showCreateModal: false}, () => {
      const {fieldName, sourceField, sourceComp, selectedTarget} = val;
      const {mapping} = this.state;

      if (!has(mapping, fieldName)) {
        /*TODO calculate format*/
        mapping[fieldName] = {sourceField, sourceComp, selectedTarget, format: "string"};
        this.setState({showCreateModal: false, mapping}, () => {
          console.log("extended state: ", this.state.mapping);
          strapi.notification.success("Created")
        });
      } else {
        strapi.notification.warning("Field name already Exists!")
      }
    });
  };

  onFormEdit = async (val) => {
    const {fieldName, sourceField, sourceComp, prevFieldName, selectedTarget} = val;
    let {mapping} = this.state;

    if (!has(mapping, fieldName)) {
      console.log("prevFieldName: ", prevFieldName);
      mapping = omit(mapping, [prevFieldName]);
      mapping[fieldName] = {sourceField, sourceComp, format: "string", selectedTarget};
    } else {
      mapping[fieldName] = {sourceField, sourceComp, format: "string", selectedTarget}
    }
    this.setState({showEditModal: false, mapping}, () => {
      console.log("modified state: ", this.state.mapping)
      strapi.notification.success("Edited")
    });
  };


  componentDidMount = async () => {
    const components = await this.getComponents()
    const res = await this.getModels();
    const {models, modelOptions} = res;
    this.setState({components, models, modelOptions, selectedTarget: modelOptions && modelOptions[0].value}, () => {
      // console.log("modelOptions: ", this.state.modelOptions[0])
      console.log("comps: ", this.state.components)
    });
  };

  render() {
    const {
      showCreateModal, showEditModal,
      selectedTarget, modelOptions, components, fieldToEdit
    } = this.state;
    return (
      <div className={"container-fluid"} style={{padding: "18px 30px"}}>
        <PluginHeader
          title={"Import Content"}
          description={"Export your Content Types into CSV and JSON"}
        />
        <HeaderNav
          links={[
            {
              name: "Import Data",
              to: getUrl("")
            },
            {
              name: "Import History",
              to: getUrl("history")
            },
            {
              name: "Export Data",
              to: getUrl("export")
            }
          ]}
          style={{marginTop: "4.4rem"}}
        />
        {this.state.loading && (
          <Block>
            <LoadingIndicator/>
          </Block>
        )}
        {!this.state.loading && !isEmpty(components) && modelOptions && (
          <div className={"row"}>
            <Block
              title="General"
              description="Export your Content-Types"
              style={{marginBottom: 12}}
            >
              {/*<Row className={""}>*/}
              {/*  <Label htmlFor={"targetContentType"}>Select Content Type</Label>*/}
              {/*  <Select*/}
              {/*    name={"targetContentType"}*/}
              {/*    options={modelOptions}*/}
              {/*    value={selectedTarget}*/}
              {/*    onChange={({target: {value}}) =>*/}
              {/*      this.onSelectTarget(value)}*/}
              {/*  />*/}
              {/*</Row>*/}
              <Row className={""} style={{marginTop: 12}}>
                {/*<FormModal*/}
                {/*  isOpen={showCreateModal}*/}
                {/*  onFormSave={this.onFormSave}*/}
                {/*  onClose={() => this.setState({showCreateModal: false})}*/}
                {/*  onToggle={() => this.setState(prevState => ({*/}
                {/*    showCreateModal: !prevState.showCreateModal*/}
                {/*  }))}*/}
                {/*  modelOptions={modelOptions}*/}
                {/*  fillOptions={this.fillOptions}*/}
                {/*  getTargetModel={this.getTargetModel}*/}
                {/*/>*/}
                <PopUpWarning
                  isOpen={this.state.showDeleteModal}
                  toggleModal={() => this.setState({showDeleteModal: null})}
                  content={{
                    title: `Please confirm`,
                    message: `Are you sure you want to Delete this entry?`
                  }}
                  popUpWarningType="danger"
                  onConfirm={async () => {
                    this.deleteField(this.state.fieldToDelete)
                  }}
                />
                <FormModalEdit
                  isOpen={showEditModal}
                  onFormSave={this.onFormEdit}
                  onClose={() => this.setState({showEditModal: false})}
                  onToggle={() => this.setState(prevState => ({
                    showEditModal: !prevState.showEditModal
                  }))}
                  fieldToEdit={fieldToEdit}
                  modelOptions={this.state.modelOptions}
                  fillOptions={this.fillOptions}
                />
                <Row className={"col-4 row"}>
                  <Label htmlFor={"targetContentType"}>Select Content Type</Label>
                  <Select
                    name={"targetContentType"}
                    options={this.state.modelOptions}
                    value={this.state.selectedTarget}
                    onChange={({target: {value}}) =>
                      this.onSelectTarget(value)}
                  />
                </Row>
              </Row>
              <Row className={""}>
                <Button onClick={() => this.showCreateModal()}>Add new Field</Button>
              </Row>
              <ListView
                comps={this.state.components}
                targetModel={this.getTargetModel(selectedTarget)}
              />
              <Row>
                {/*<ExportMapping*/}
                {/*  // undoImport={this.undoImport}*/}
                {/*  // deleteImport={this.deleteImport}*/}
                {/*  showDelete={this.showDelete}*/}
                {/*  showEdit={this.showEdit}*/}
                {/*  mapping={this.state.mapping}*/}
                {/*/>*/}
              </Row>
            </Block>
          </div>
        )}
      </div>
    )
  }

// {this.state.loading && <LoadingIndicator/>}
// {!this.state.loading && (
  onSelectTarget = (selectedTarget) => {
    this.setState({selectedTarget})
  };

  showCreateModal = () => {
    console.log("showCreateModal")
    this.setState({showCreateModal: true}, () => {
      console.log(this.state.showCreateModal)
    })
  };


  fillOptions = (selectedTarget) => {
    const targetModel = this.getTargetModel(selectedTarget);
    console.log(targetModel);
    const schemaAttributes = get(targetModel, ["schema", "attributes"], {});
    const options = Object.keys(schemaAttributes)
      .map(fieldName => {
        const attribute = get(schemaAttributes, [fieldName], {});
        console.log(attribute);
        return attribute.type && {label: fieldName, value: fieldName};
      })
      .filter(obj => obj !== undefined)
    return [{label: "None", value: "none"}, ...options];
  };

  getTargetModel = (selectedTarget) => {
    const {models} = this.state;
    if (!models) return null;
    return models.find(model => model.uid === selectedTarget);
  };

  showDelete = (id) => {
    this.setState({showDeleteModal: true, fieldToDelete: id})
  };

  showEdit = (fieldName) => {
    const {sourceField, sourceComp, selectedTarget} = get(this.state.mapping, [fieldName], {});
    const fieldToEdit = {fieldName, sourceField, sourceComp, selectedTarget};
    this.setState({showEditModal: true, fieldToEdit})
  };
}

export default ExportPage