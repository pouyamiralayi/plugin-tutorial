"use strict";
/**
 * DataMigration.js controller
 *
 * @description
 * The data-migration plugin that will be integrated into the
 * import / export plugin in near future, provides two relative
 * simple routes to export / import content-type configurations
 * into a foreign strapi instance.
 */
const fs = require("fs-extra");
module.exports = {
  import: async ctx => {
    // check if the migration file for this version already exists
    const {version} = ctx.params;
    const file = `./migrations/${version}/CTypes.json`;
    const exists = await fs.exists(file);
    if (!exists) {
      ctx.response.status = 500;
      return ctx.throw(
        500,
        `Migration file for version ${version} could not be found.`
      );
    }
    const ctypes = await fs.readJSON(file);
    ctypes.contentTypes.forEach(type => {
      const { name } = type.info;
      type.info.description = `Imported from strapi version ${version}.`;
      fs.writeJSONSync(
        `./migrations/${version}/types/${name}/models/${name}.settings.json`,
        type,
        { spaces: " " }
      );
      fs.copySync(`./migrations/${version}/types/${name}`, `./api/${name}`);
      fs.copySync(`./migrations/${version}/components`, `./components`);
    });
    ctx.send({
      message: 'Migrational import completed successfully.',
      meta: {
        version,
        imported: {
          types: ctypes.meta.exported.types,
          componentGroups: ctypes.meta.exported.componentGroups,
          components: ctypes.meta.exported.components,
        },
      },
    });
  },
  export: async ctx => {
    const { models } = strapi;
    const exports = [];
    Object.keys(models).filter(value => value !== 'core_store').forEach(name => {
      const model = models[name];
      // create a replica of "name.settings.json"
      const settings = {
        connection: model.connection,
        collectionName: model.collectionName,
        info: model.info,
        options: model.options,
        attributes: model.attributes
      };
      exports.push(settings);
    });
    // check if the migration file for this version already exists
    try {
      const packageJson = await fs.readJSON("./package.json");
      const version = packageJson.dependencies.strapi;
      const file = `./migrations/${version}/CTypes.json`;
      const exists = await fs.exists(file);
      if (!exists) {
        await fs.createFile(file);
      }
      exports.forEach(async type => {
        const { name } = type.info;
        await fs.copy(
          `./api/${name}`,
          `./migrations/${version}/types/${name}`
        );
      });
      await fs.copy(
        `./components`,
        `./migrations/${version}/components`
      );
      // get count of the exported items
      const components = await fs.readdir(`./components`);
      const componentGroupCount = components.length;
      let componentCount = 0;
      components.forEach(async value => {
        const innerDir = await fs.readdir(`./components/${value}`);
        componentCount = componentCount + innerDir.length;
      });
      const ctypes = {
        version,
        created: new Date(),
        meta: {
          version,
          exported: {
            types: exports.filter(value => value.info.name !== 'core_store').length,
            componentGroups: componentGroupCount,
            components: componentCount,
          },
        },
        contentTypes: exports
      };
      // wirte content to file & copy folders
      await fs.writeJSON(file, ctypes, { spaces: " " });
      ctx.send({
        message: `Migrational export completed successfully.`,
        meta: {
          version,
          exported: {
            types: exports.filter(value => value.info.name !== 'core_store').length,
            componentGroups: componentGroupCount,
            components: componentCount,
          },
        },
      });
    } catch (err) {
      strapi.log.error(`Error creating migration file: ${err}`);
    }
  },
};