/*
 *
 * CreateImportPage
 *
 */

import React, { Component } from "react";
import {
  HeaderNav,
  LoadingIndicator,
  PluginHeader,
  request
} from "strapi-helper-plugin";
import { get, has, isEmpty, pickBy, set } from "lodash";
import { Button, InputNumber, InputText, Label, Select } from "@buffetjs/core";
import pluginId from "../../pluginId";
import Container from "../../components/Container";
import Row from "../../components/Row";
import Block from "../../components/Block";
import UploadFileForm from "../../components/UploadFileForm";
import MappingTable from "../../components/MappingTable";
import ExternalUrlForm from "../../components/ExternalUrlForm";
import RawInputForm from "../../components/RawInputForm";

const getUrl = to =>
  to ? `/plugins/${pluginId}/${to}` : `/plugins/${pluginId}`;

class CreateImportPage extends Component {
  state = {
    importSource: "upload",
    selectedContentType: "",
    loading: true,
    models: [],
    modelOptions: [],
    inputFormatSettings: { delimiter: ",", skipRows: 0 },
    fieldMapping: {},
    analysing: false,
    analyzeError: null,
    analysisConfig: null,
    analysis: null,
    saving: false,
    saveError: null,
    created: null
  };

  importSources = [
    { label: "External URL ", value: "url" },
    { label: "Upload file", value: "upload" },
    { label: "Raw text", value: "raw" }
  ];

  /*Check if user specified any field mapping or not*/
  isEmptyMapping = () => {
    const { fieldMapping } = this.state;
    return isEmpty(pickBy(fieldMapping, o => o.targetField !== "none"));
  };

  getTargetModel = () => {
    const { models } = this.state;
    if (!models) return null; //

    return models.find(model => model.uid === this.state.selectedContentType);
  };

  saveImportConfig = async importConfig => {
    this.setState({ saving: true }, async () => {
      try {
        await request("/import-plugin", { method: "POST", body: importConfig });

        this.setState({ saving: false }, () => {
          strapi.notification.info("Data imported");
        });
      } catch (e) {
        strapi.notification.error(`${e}`);
      }
    });
  };

  onSaveImport = () => {
    const { selectedContentType, fieldMapping } = this.state;
    const { analysisConfig } = this;

    const analysisConfigWithSettings = this.getAnalysisConfigWithSettings(
      analysisConfig
    );

    const importConfig = {
      ...analysisConfigWithSettings,
      contentType: selectedContentType,
      fieldMapping
    };

    this.saveImportConfig(importConfig);
  };

  setFieldMapping = fieldMapping => {
    this.setState({ fieldMapping });
  };

  preAnalyze = async analysisConfigWithSettings => {
    this.setState({ analysing: true }, async () => {
      try {
        const response = await request("/import-plugin/preAnalyzeImportFile", {
          method: "POST",
          body: analysisConfigWithSettings
        });

        this.setState({ analysis: response, analysing: false }, () => {
          strapi.notification.success(`Analyzed Successfully`);
        });
      } catch (e) {
        this.setState({ analysing: false }, () => {
          strapi.notification.error(`Analyze Failed, try again`);
          strapi.notification.error(`${e}`);
        });
      }
    });
  };

  getModels = async () => {
    this.setState({ loading: true });

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
        };
      });

      this.setState({ loading: false });

      return { models, modelOptions };
    } catch (e) {
      this.setState({ loading: false }, () => {
        strapi.notification.error(`${e}`);
      });
    }
    return [];
  };

  selectImportSource = importSource => {
    this.setState({
      importSource,
      inputFormatSettings: { delimiter: ",", skipRows: 0 }
    });
  };

  selectImportDest = selectedContentType => {
    this.setState({ selectedContentType });
  };

  onRequestAnalysis = async analysisConfig => {
    this.analysisConfig = analysisConfig;

    const analysisConfigWithSettings = this.getAnalysisConfigWithSettings(
      analysisConfig
    );

    this.preAnalyze(analysisConfigWithSettings);
  };

  getAnalysisConfigWithSettings = analysisConfig => {
    const { inputFormatSettings } = this.state;

    return {
      ...analysisConfig,
      options: {
        ...analysisConfig.options,
        ...inputFormatSettings
      }
    };
  };

  componentDidMount() {
    this.getModels().then(res => {
      const { models, modelOptions } = res;
      this.setState({
        models,
        modelOptions,
        selectedContentType: modelOptions ? modelOptions[0].value : ""
      });
    });
  }

  render() {
    const {
      modelOptions,
      loading,
      inputFormatSettings,
      fieldMapping
    } = this.state;

    return (
      <Container className={"container-fluid"}>
        <PluginHeader
          title={"Import Plugin"}
          description={"Import CSV and RSS-Feed into your Content Types"}
        />
        <Row>
          <HeaderNav
            links={[
              {
                name: "Import Data",
                to: getUrl("")
              },
              {
                name: "Import History",
                to: getUrl("history")
              }
            ]}
            style={{ marginTop: "4.4rem" }}
          />
        </Row>
        <div className={"row"}>
          <Block
            title="General"
            description="Configure the Import Source & Destination"
            style={{ marginBottom: 12 }}
          >
            {loading && <LoadingIndicator />}
            {!loading && modelOptions && (
              <div className={"col-12"}>
                <form className={"row"}>
                  <div className={"col-4"}>
                    <Label htmlFor="importSource">Import Source</Label>
                    <Select
                      name="importSource"
                      options={this.importSources}
                      value={this.state.importSource} // observe our state
                      onChange={({ target: { value } }) =>
                        this.selectImportSource(value)
                      }
                    />
                  </div>
                  <div className={"col-4"}>
                    <Label htmlFor="importDest">Import Destination</Label>
                    <Select
                      value={this.state.selectedContentType} // observe our state
                      name="importDest"
                      options={this.state.modelOptions}
                      onChange={({ target: { value } }) =>
                        this.selectImportDest(value)
                      }
                    />
                  </div>
                </form>
                <form className="">
                  <Row>
                    {this.state.importSource === "upload" && (
                      <UploadFileForm
                        onRequestAnalysis={this.onRequestAnalysis}
                        loadingAnalysis={this.state.analysing}
                      />
                    )}
                    {this.state.importSource === "url" && (
                      <ExternalUrlForm
                        onRequestAnalysis={this.onRequestAnalysis}
                        loadingAnalysis={this.state.analysing}
                      />
                    )}
                    {this.state.importSource === "raw" && (
                      <RawInputForm
                        onRequestAnalysis={this.onRequestAnalysis}
                        loadingAnalysis={this.state.analysing}
                      />
                    )}
                  </Row>
                  {this.state.analysis &&
                  this.state.analysis.sourceType === "csv" && ( // show only when data type is CSV
                      <Row className={"row"}>
                        <div className={"col-4"}>
                          <Label
                            message={"Delimiter"}
                            htmlFor={"delimiterInput"}
                          />
                          <InputText
                            name={"delimiterInput"}
                            onChange={({ target: { value } }) => {
                              const state = set(
                                this.state,
                                ["inputFormatSettings", "delimiter"],
                                value
                              );
                              this.setState(state);
                            }}
                            value={inputFormatSettings.delimiter}
                          />
                        </div>
                        <div className={"col-4"}>
                          <Label message={"Skip Rows"} htmlFor={"skipInput"} />
                          <InputNumber
                            name={"skipInput"}
                            onChange={({ target: { value } }) => {
                              const state = set(
                                this.state,
                                ["inputFormatSettings", "skipRows"],
                                value
                              );
                              this.setState(state);
                            }}
                            value={inputFormatSettings.skipRows}
                          />
                        </div>
                      </Row>
                    )}
                </form>
              </div>
            )}
          </Block>
        </div>
        {this.state.analysis && (
          <Row className="row">
            <MappingTable
              analysis={this.state.analysis}
              targetModel={this.getTargetModel()}
              onChange={this.setFieldMapping}
            />
            {!this.state.saving && (
              <Button
                style={{ marginTop: 12 }}
                label={"Run the Import"}
                color={this.isEmptyMapping() ? "delete" : "primary"}
                disabled={this.isEmptyMapping()}
                onClick={this.onSaveImport}
              />
            )}
          </Row>
        )}
      </Container>
    );
  }
}

export default CreateImportPage;
