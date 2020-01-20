/**
 *
 * LeftMenu
 *
 */

import React, {useEffect, useContext, useState} from 'react';
import PropTypes from 'prop-types';
import {LeftMenuList} from 'strapi-helper-plugin';
import pluginId from '../../pluginId';
import Wrapper from './Wrapper';
import {sortBy} from 'lodash';

const displayNotificationCTNotSaved = () => {
  strapi.notification.info(`${pluginId}.notification.info.creating.notSaved`);
};

function LeftMenu({configs, models, onModelClicked}) {
  const [modelsLinks, updateModelsLinks] = useState([]);

  useEffect(() => {
    const data = [{
      name: 'Content Types',
      title: 'Content Types',
      isEditable: true,
      onClickEdit: (e, data) => {
        e.stopPropagation();
        onModelClicked(data)
      },
      links: sortBy(
        models.map(m => {
          return {
            name: m.uid,
            title: m.label
          }
        }),
        obj => obj.title
      )
    }];
    updateModelsLinks(data)
  }, [models]);


  // const {emitEvent, formatMessage} = useGlobalContext();
  // const {push} = useHistory();

  // const componentsData = sortBy(
  //   Object.keys(componentsGroupedByCategory).map(category => ({
  //     name: category,
  //     title: category,
  //     isEditable: isInDevelopmentMode,
  //     onClickEdit: (e, data) => {
  //       e.stopPropagation();
  //
  //       const search = makeSearch({
  //         actionType: 'edit',
  //         modalType: 'editCategory',
  //         categoryName: data.name,
  //         headerDisplayName: data.name,
  //         headerDisplayCategory: formatMessage({
  //           id: getTrad('modalForm.header.categories'),
  //         }),
  //         settingType: 'base',
  //       });
  //
  //       push({ search });
  //     },
  //     links: sortBy(
  //       componentsGroupedByCategory[category].map(compo => ({
  //         name: compo.uid,
  //         to: `/plugins/${pluginId}/component-categories/${category}/${compo.uid}`,
  //         title: compo.schema.name,
  //       })),
  //       obj => obj.title
  //     ),
  //   })),
  //   obj => obj.title
  // );

  // const canOpenModalCreateCTorComponent = () => {
  //   return (
  //     !Object.keys(contentTypes).some(
  //       ct => contentTypes[ct].isTemporary === true
  //     ) &&
  //     !Object.keys(components).some(
  //       component => components[component].isTemporary === true
  //     )
  //   );
  // };

  // const handleClickOpenModal = async type => {
  //   if (canOpenModalCreateCTorComponent()) {
  //     const eventName =
  //       type === 'contentType'
  //         ? 'willCreateContentType'
  //         : 'willCreateComponent';
  //
  //     emitEvent(eventName);
  //
  //     await wait();
  //     push({
  //       search: `modalType=${type}&actionType=create&settingType=base&forTarget=${type}`,
  //     });
  //   } else {
  //     displayNotificationCTNotSaved();
  //   }
  // };

  const data = [
    {
      name: 'models',
      title: {
        id: `${pluginId}.menu.section.models.name.`,
      },
      searchable: true,
      // customLink:
      //   {
      //     Component: CustomLink,
      //     componentProps: {
      //       id: `${pluginId}.button.model.create`,
      //       onClick: () => {
      //         // handleClickOpenModal('contentType');
      //       },
      //     },
      //   },
      links: modelsLinks,
    },
    // {
    //   name: 'components',
    //   title: {
    //     id: `${pluginId}.menu.section.components.name.`,
    //   },
    //   searchable: true,
    //   // customLink:
    //   //   {
    //   //     Component: CustomLink,
    //   //     componentProps: {
    //   //       id: `${pluginId}.button.component.create`,
    //   //       onClick: () => {
    //   //         // handleClickOpenModal('component');
    //   //       },
    //   //     },
    //   //   },
    //   links: configs,
    // },
  ];

  return (
    <Wrapper className="col-md-3">
      {data.map(list => {
        return <LeftMenuList {...list} key={list.name}/>;
      })}
    </Wrapper>
  );
}

LeftMenu.defaultProps = {};

LeftMenu.propTypes = {
  models: PropTypes.array,
  configs: PropTypes.array,
  onModelClicked: PropTypes.func,
};

export default LeftMenu;
