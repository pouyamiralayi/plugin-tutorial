import React, {Component} from "react"
import {PluginHeader, HeaderNav, LoadingIndicator, request} from 'strapi-helper-plugin'
import Block from '../../components/Block'
import Row from "../../components/Row";
import ExportMapping from "../../components/ExportMappingTable";
import pluginId from "../../pluginId";
import FormModal from "../../components/FormModal";
import {get, has} from 'lodash'
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
    exportConfigs: {}, // cache the previous export configs in case we want them again
    exportConfig: {},
    /**/
    mapping: {},
    mappingTable: [],
    formModalOpen: false,
    selectedTarget: "",
    loading: true,
    models: [],
    modelOptions: [],
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
    const {fieldName, sourceField, sourceComp} = val;
    const {mapping} = this.state;

    if (sourceComp == null) {
      if (!has(mapping, fieldName)) {
        mapping[fieldName] = sourceField
        this.setState({mapping}, () => {
          console.log(this.state.mapping)
        })
      } else {
        this.setState({formModalError: "Field name already Exists!"})
      }
    }

    this.setState({formModalOpen: false})
  };

  componentDidMount = async () => {
    const res = await this.getModels();
    const {models, modelOptions} = res;
    this.setState({models, modelOptions, selectedTarget: modelOptions && modelOptions[0].value });
  };

  render() {
    const {formModalOpen, targetModel, selectedTarget, modelOptions} = this.state;
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
              <Button onClick={() => this.openFormModal()}>Add new Field</Button>
            </Row>
            {this.state.loading && <LoadingIndicator/>}{" "}
            {!this.state.loading && this.state.exportConfigs && (
              <Row className={""} style={{marginTop: 12}}>
                <FormModal
                  isOpen={formModalOpen}
                  onFormSave={this.onFormSave}
                  onClose={this.closeFormModal}
                  onToggle={this.toggleFormModal}
                  targetModel={this.getTargetModel()}
                />
                <ExportMapping
                  // undoImport={this.undoImport}
                  // deleteImport={this.deleteImport}
                  mapping={this.state.mappingTable}
                />
              </Row>
            )}
          </Block>
        </div>
      </div>
    )
  }


  openFormModal = () => {
    this.setState({formModalOpen: true})
  };

  closeFormModal = () => {
    this.setState({formModalOpen: false})
  };

  toggleFormModal = () => {
    this.setState(prevState => ({
      formModalOpen: !prevState.formModalOpen
    }))
  };

  onSelectTarget = (selectedTarget) => {
    this.setState({selectedTarget})
  };

  getTargetModel = () => {
    const {models} = this.state;
    if (!models) return null;
    return models.find(model => model.uid === this.state.selectedTarget);
  };
}

export default ExportPage