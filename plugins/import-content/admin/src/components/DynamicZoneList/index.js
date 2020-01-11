/**
 *
 * DynamicZoneList
 *
 */

import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import {TabContent, TabPane, Nav} from 'reactstrap';
import {Plus} from '@buffetjs/icons';
// import useDataManager from '../../hooks/useDataManager';
import getTrad from '../../utils/getTrad';
import ComponentList from '../ComponentList';
import ComponentButton from './ComponentButton';
import ComponentCard from '../ComponentCard';
import Td from '../Td';
import {get} from "lodash";

function DynamicZoneList({
                           customRowComponent,
                           components,
                           addComponent,
                           mainTypeName,
                           name,
                           targetUid,
                           comps
                         }) {
  // const { isInDevelopmentMode } = useDataManager();
  const isInDevelopmentMode = true;
  const [activeTab, setActiveTab] = useState("0");
  const toggle = tab => {
    if (activeTab !== tab) {
      setActiveTab(tab)
    }
  };

  const handleClickAdd = () => {
    addComponent(name);
  };

  return (
    <tr className="dynamiczone-row">
      <Td colSpan={12} isFromDynamicZone>
        <div>
          <div className="tabs-wrapper">
            <Nav tabs>
              {isInDevelopmentMode && (
                <li>
                  {/*<ComponentButton onClick={handleClickAdd}>*/}
                  {/*  <div>*/}
                  {/*    <Plus style={{ height: 15, width: 15 }} />*/}
                  {/*  </div>*/}
                  {/*  <p>*/}
                  {/*    <FormattedMessage id={getTrad('button.component.add')} />*/}
                  {/*  </p>*/}
                  {/*</ComponentButton>*/}
                </li>
              )}
              {components.map((component, index) => {
                return (
                  <li key={component}>
                    <ComponentCard
                      dzName={name}
                      index={index}
                      component={get(comps, [component], {})}
                      isActive={activeTab === `${index}`}
                      isInDevelopmentMode={isInDevelopmentMode}
                      onClick={() => {
                        toggle(`${index}`);
                      }}
                    />
                  </li>
                );
              })}
            </Nav>
          </div>
          <TabContent activeTab={activeTab}>
            {components.map((component, index) => {
              const props = {
                customRowComponent: customRowComponent,
                component: component,
                comp: get(comps, [component], {}),
                comps
              };
              console.log("props: ", props);

              return (
                <TabPane tabId={`${index}`} key={component}>
                  <table>
                    <tbody>
                    <ComponentList
                      {...props}
                      isFromDynamicZone
                      mainTypeName={mainTypeName}
                      targetUid={targetUid}
                      key={component}
                    />
                    </tbody>
                  </table>
                </TabPane>
              );
            })}
          </TabContent>
        </div>
      </Td>
    </tr>
  );
}

DynamicZoneList.defaultProps = {
  addComponent: () => {
  },
  components: [],
  customRowComponent: null,
  name: null,
  comps: {}
};

DynamicZoneList.propTypes = {
  addComponent: PropTypes.func,
  components: PropTypes.instanceOf(Array),
  customRowComponent: PropTypes.func,
  mainTypeName: PropTypes.string.isRequired,
  name: PropTypes.string,
  targetUid: PropTypes.string.isRequired,
  comps: PropTypes.object
};

export default DynamicZoneList;
