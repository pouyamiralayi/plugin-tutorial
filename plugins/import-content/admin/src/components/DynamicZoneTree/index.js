import React, {useState} from 'react';
import PropTypes from 'prop-types'
import {Nav, TabContent, TabPane} from 'reactstrap';
import ComponentTree from "../ComponentTree";
import ComponentCard from "../ComponentCard";
import Td from "../Td";

const DynamicZoneTree = ({
                           components,
                           customRowComponent,
                           name,
                           targetName,
                         }) => {
  const [activeTab, setActiveTab] = useState('0');

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <tr className="dynamiczone-row">
      <Td colSpan={12} isFromDynamicZone>
        <div>
          <div className={"tabs-wrapper"}>
            <Nav tabs>
              <li>
                {/*<ComponentButton onClick={handleClickAdd}>*/}
                {/*<ComponentButton>*/}
                {/*<div>*/}
                {/*  <Plus style={{ height: 15, width: 15 }} />*/}
                {/*</div>*/}
                {/*  <p>*/}
                {/*    <FormattedMessage id={getTrad('button.component.add')} />*/}
                {/*  </p>*/}
                {/*</ComponentButton>*/}
              </li>
              {components.map((component, index) => {
                return (
                  <li key={component}>
                    <ComponentCard
                      dzName={name}
                      index={index}
                      component={component}
                      isActive={activeTab === `${index}`}
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
              };

              return (
                <TabPane tabId={`${index}`} key={component}>
                  <table>
                    <tbody>
                    <ComponentTree
                      {...props}
                      isFromDynamicZone
                      targetName={targetName}
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
  )
};

DynamicZoneTree.defaultProps = {
  customRowComponent: null,
  isFromDynamicZone: false,
  components: [],
};

DynamicZoneTree.propTypes = {
  isFromDynamicZone: PropTypes.bool,
  targetUid: PropTypes.string,
  targetName: PropTypes.string,
  customRowComponent: PropTypes.func,
  components: PropTypes.instanceOf(Array),

};


export default DynamicZoneTree;