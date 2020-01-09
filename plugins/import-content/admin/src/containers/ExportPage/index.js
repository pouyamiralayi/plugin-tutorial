import React, {Component} from "react"
import {PluginHeader, HeaderNav, LoadingIndicator, request, PopUpWarning} from 'strapi-helper-plugin'
import Block from '../../components/Block'
import Row from "../../components/Row";
import ExportMapping from "../../components/ExportMappingTable";
import pluginId from "../../pluginId";
import FormModal from "../../components/FormModal";
import FormModalEdit from "../../components/FormModalEdit";
import {get, has, pick, keys, omit} from 'lodash'
import {Select, Button, Label} from "@buffetjs/core";

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
  };


  deleteField = (fieldName) => {
    let {mapping} = this.state;
    mapping = omit(mapping, [fieldName]);
    this.setState({showDeleteModal: false, mapping},() => {
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
      const {fieldName, sourceField, sourceComp} = val;
      const {mapping} = this.state;

      if (!has(mapping, fieldName)) {
        /*TODO calculate format*/
        mapping[fieldName] = {sourceField, sourceComp, format: "string"};
        this.setState({showCreateModal: false, mapping}, () => {
          console.log("extended state: ", this.state.mapping)
          strapi.notification.success("Created")
        });
      } else {
        strapi.notification.warning("Field name already Exists!")
      }
    });
  };

  onFormEdit = async (val) => {
    const {fieldName, sourceField, sourceComp, prevFieldName} = val;
    let {mapping} = this.state;

    if (!has(mapping, fieldName)) {
      /*TODO calculate format*/
      console.log("prevFieldName: ", prevFieldName);
      mapping = omit(mapping, [prevFieldName]);
      mapping[fieldName] = {sourceField, sourceComp, format: "string"};
    } else {
      mapping[fieldName] = {sourceField, sourceComp, format: "string"}
    }
    this.setState({showEditModal: false, mapping}, () => {
      console.log("modified state: ", this.state.mapping)
      strapi.notification.success("Edited")
    });
  };

  componentDidMount = async () => {
    const res = await this.getModels();
    const {models, modelOptions} = res;
    this.setState({models, modelOptions, selectedTarget: modelOptions && modelOptions[0].value});
  };

  render() {
    const {showCreateModal, showEditModal, targetModel, selectedTarget, modelOptions, fieldToEdit} = this.state;
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
        <div className={"row"}>
          <Block
            title="General"
            description="Export your Content-Types"
            style={{marginBottom: 12}}
          >
            <Row className={""}>
              <Label htmlFor={"targetContentType"}>Select Content Type</Label>
              <Select
                name={"targetContentType"}
                options={modelOptions}
                value={selectedTarget}
                onChange={({target: {value}}) =>
                  this.onSelectTarget(value)}
              />
            </Row>
            <Row className={""}>
              <Button onClick={() => this.showCreateModal()}>Add new Field</Button>
            </Row>
            {this.state.loading && <LoadingIndicator/>}
            {!this.state.loading && (
              <Row className={""} style={{marginTop: 12}}>
                <FormModal
                  isOpen={showCreateModal}
                  onFormSave={this.onFormSave}
                  onClose={() => this.setState({showCreateModal: false})}
                  onToggle={() => this.setState(prevState => ({
                    showCreateModal: !prevState.showCreateModal
                  }))}
                  targetModel={this.getTargetModel()}
                />
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
                  targetModel={this.getTargetModel()}
                  fieldToEdit={fieldToEdit}
                />
                <ExportMapping
                  // undoImport={this.undoImport}
                  // deleteImport={this.deleteImport}
                  showDelete={this.showDelete}
                  showEdit={this.showEdit}
                  mapping={this.state.mapping}

                />
              </Row>
            )}
          </Block>
        </div>
      </div>
    )
  }


  showCreateModal = () => {
    console.log("showCreateModal")
    this.setState({showCreateModal: true}, () => {
      console.log(this.state.showCreateModal)
    })
  };


  onSelectTarget = (selectedTarget) => {
    this.setState({selectedTarget})
  };

  getTargetModel = () => {
    const {models} = this.state;
    if (!models) return null;
    return models.find(model => model.uid === this.state.selectedTarget);
  };

  showDelete = (id) => {
    this.setState({showDeleteModal: true, fieldToDelete: id})
  };

  showEdit = (fieldName) => {
    const {sourceField, sourceComp} = get(this.state.mapping, [fieldName], {});
    const fieldToEdit = {fieldName, sourceField, sourceComp};
    this.setState({showEditModal: true, fieldToEdit})
  };
}

export default ExportPage