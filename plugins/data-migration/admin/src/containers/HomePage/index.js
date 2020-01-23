/*
 *
 * HomePage
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';
import { ContainerFluid } from 'strapi-helper-plugin'

const HomePage = () => {
  return (
    <h1 style={{ marginTop: 15 }}>Migration 1.0</h1>
  );
};

export default memo(HomePage);
