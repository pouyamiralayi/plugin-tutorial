"use strict";

/**
 * @author Fabio Nettis <nettisfabio@gmail.com>
 * @version 1.0.0
 *
 * @description
 * The data-migration plugin provversiones a simple and interactive
 * way to migrate content-types, components and their data
 * between different projects.
 */

require("strapi");
const fs = require("fs-extra");

const {
  forEach,
  makeError,
  migrationExists
} = require("../services/DataMigration");

module.exports = {
  /**
   * @description
   * List all migrations from the `migrations` folder.
   */
  getMigrationVersions: async ctx => {
    const payload = [];
    const exists = await migrationExists();

    if (!exists) {
      return ctx.send([]);
    }

    const versions = await fs.readdir("./migrations");

    await forEach(versions, async version => {
      const shapes = await fs.readdir(`./migrations/${version}/types`);
      payload.push({
        version,
        shapes
      });
    });

    ctx.send(payload);
  },

  /**
   * @description
   * List the migration with where version === :version
   */
  getMigrationDetails: async ctx => {
    const { version } = ctx.params;
    const exists = await migrationExists(version);

    if (!exists) {
      ctx.status = 404;
      ctx.body = makeError(
        404,
        `The migration with version code "${version}" could not be found`
      );
      return;
    }

    const meta = await fs.readJSON(`./migrations/${version}/meta.json`);
    ctx.status = 200;
    ctx.body = meta;
  },

  /**
   * @description
   * Remove a migration from the `migrations` folder
   * where version === :version.
   */
  deleteMigration: async ctx => {
    const { version } = ctx.params;
    const exists = await migrationExists(version);

    if (!exists) {
      ctx.status = 404;
      ctx.body = makeError(
        404,
        `The migration with version code "${version}" could not be found`
      );
      return;
    }
  },

  /**
   * @description
   * Exports all content-types, components and their data
   * into a versioned folder in the `migrations` folder.
   */
  createMigration: async ctx => {
    const { override } = ctx.query;
    const packageJson = await fs.readJSON("./package.json");
    const version = packageJson.dependencies.strapi;
    const exists = await migrationExists(version);

    /**
     * don't overide existing migrations by default
     */
    if (exists && !override) {
      ctx.status = 500;
      ctx.body = makeError(
        500,
        `Migration with version "${version}" already exists, call with "?override=true" to recreate folder.`
      );
      return;
    }

    /**
     * overide existing
     */
    if (exists && override) {
      await fs.remove(`./migrations/${version}`);
    }

    /**
     * Check if there is any content-types or any components
     * that can be exported otherwise drop a 404 since there
     * is no sense in exporting.
     */
    let types = await fs.readdir("./api");
    types = types.filter(value => value !== ".gitkeep");

    const adminExists = await fs.exists("./admin");
    const componentsExist = await fs.exists("./components");
    const hasContentTypes = types.length !== 0;

    if (!componentsExist && !hasContentTypes) {
      ctx.status = 404;
      ctx.body = makeError(404, "Could not find anything to export.");
      return;
    }

    if (componentsExist) {
      await fs.copy("./components", `./migrations/${version}/components`);
    }

    if (hasContentTypes) {
      await forEach(types, async folder => {
        await fs.copy(
          `./api/${folder}`,
          `./migrations/${version}/types/${folder}`
        );
      });
    }

    if (adminExists) {
      await fs.copy("./admin", `./migrations/${version}/admin`);
    }

    let componentCount = 0;
    const componentGroups = await fs.readdir("./components");
    const componentShape = [];

    await forEach(componentGroups, async group => {
      const components = await fs.readdir(`./components/${group}`);
      componentCount = componentCount + components.length;

      componentShape.push({
        group,
        components: components.map(value => value.replace(".json", ""))
      });
    });

    const meta = {
      info: {
        version,
        customization: adminExists,
        createdAt: new Date()
      },
      types: {
        count: types.length,
        shapes: types
      },
      components: {
        count: componentShape.length,
        shapes: componentShape
      }
    };

    await fs.createFile(`./migrations/${version}/meta.json`);
    await fs.writeJSON(`./migrations/${version}/meta.json`, meta, {
      spaces: " "
    });

    ctx.status = 201;
    ctx.body = meta;
  },

  /**
   * @description
   * Import a migration by it's version and create the needed folders
   * in the new project.
   */
  importMigration: async ctx => {
    const { version } = ctx.params;
    const exists = await migrationExists(version);

    if (!exists) {
      ctx.status = 404;
      ctx.body = makeError(
        404,
        `The migration with version code "${version}" could not be found`
      );
      return;
    }

    const typesExist = await fs.exists(`./migrations/${version}/types`);
    const adminExist = await fs.exists(`./migrations/${version}/admin`);
    const componentsExist = await fs.exists(
      `./migrations/${version}/components`
    );

    if (typesExist) {
      const types = await fs.readdir(`./migrations/${version}/types`);
      await forEach(types, async type => {
        await fs.copy(`./migrations/${version}/types/${type}`, `./api/${type}`);
      });
    }

    if (adminExist) {
      const admin = await fs.readdir(`./migrations/${version}/admin`);
      await forEach(admin, async folder => {
        await fs.copy(
          `./migrations/${version}/admin/${folder}`,
          `./admin/${folder}`
        );
      });
    }

    if (componentsExist) {
      const components = await fs.readdir(`./migrations/${version}/components`);
      await forEach(components, async group => {
        await fs.copy(
          `./migrations/${version}/components/${group}`,
          `./components/${group}`
        );
      });
    }

    const meta = await fs.readJSON(`./migrations/${version}/meta.json`);
    ctx.status = 200;
    ctx.body = meta;
  },

  /**
   * TODO: Write the logic for cross database migrations
   */
  cloneMigrationData: async ctx => {
    ctx.status = 501;
    ctx.body = makeError(501, "Feature currently under development.");
  },

  /**
   * @description
   * Generates .json files with the data of the content-types.
   * usually is imported with the migration.
   */
  generateLocalData: async ctx => {
    const { version } = ctx.params;
    const { filters } = ctx.request.body;
    const exists = await migrationExists(version);

    if (!exists) {
      ctx.status = 404;
      ctx.body = makeError(
        404,
        `The migration with version code "${version}" could not be found`
      );
      return;
    }

    /**
     * migrate the data for each content-type
     */
    const types = await fs.readdir(`./migrations/${version}/types`);
    await forEach(types, async type => {
      await fs.createFile(
        `./migrations/${version}/types/${type}/models/migration-data.json`
      );

      await fs.writeJSON(
        `./migrations/${version}/types/${type}/models/migration-data.json`,
        [],
        { spaces: "" }
      );

      const count = await strapi.query(type).count();

      for (let i = 0; i < (Math.ceil(count) * 20) / 20; i++) {
        const filter = filters[type];
        const results = await strapi.query(type).find(filter ? filter : {});

        const data = await fs.readFile(
          `./migrations/${version}/types/${type}/models/migration-data.json`
        );

        data.push(results);
        await fs.writeJSON(
          `./migrations/${version}/types/${type}/models/migration-data.json`,
          data,
          {
            spaces: ""
          }
        );
      }
    });

    ctx.status = 200;
    ctx.send({
      message: `Data migration complete`
    });
  },

  /**
   * @description
   * Imports the files from `generateLocalData`.
   */
  readLocalData: async () => {
    const { version } = ctx.params;
    const exists = await migrationExists(version);

    if (!exists) {
      ctx.status = 404;
      ctx.body = makeError(
        404,
        `The migration with version code "${version}" could not be found`
      );
      return;
    }

    /**
     * migrate the data for each content-type
     */
    const types = await fs.readdir(`./migrations/${version}/types`);
    await forEach(types, async type => {
      const results = await fs.readJSON(
        `./migrations/${version}/types/${type}/models/migration-data.json`
      );

      for (let i = 0; i <= results.length - 1; i++) {
        await strapi.query(type).create(results[i]);
      }
    });

    ctx.status = 200;
    ctx.send({
      message: `Data migration complete`
    });
  },

  /**
   * @description
   * Alter content-types or components after they have been exported.
   */
  editMigration: async ctx => {
    const { version } = ctx.params;
    const { shapes } = ctx.request.body;
    const exists = await migrationExists(version);

    if (!exists) {
      ctx.status = 404;
      ctx.body = makeError(
        404,
        `The migration with version code "${version}" could not be found`
      );
      return;
    }

    if (!shapes || shapes.length === 0) {
      ctx.status = 422;
      ctx.body = makeError(422, "Please provide models to edit.");
      return;
    }

    const errors = [];
    await forEach(shapes, async entry => {
      const { type, shape } = entry;

      if (type === "model") {
        const { name } = shape.info;
        await fs.writeJSON(
          `./migrations/${version}/types/${name}/models/${name}.settings.json`,
          shape,
          {
            spaces: " "
          }
        );
      }

      // components_test_compas
      if (type === "component") {
        const { collectionName } = shape;
        const separation = collectionName.split("_");
        const name = separation[2];
        const group = separation[1];
        await fs.writeJSON(
          `./migrations/${version}/components/${group}/${name}.json`,
          shape,
          {
            spaces: " "
          }
        );
      }

      if (!type || (type !== "component" && type !== "model")) {
        errors.push(
          makeError(
            422,
            "Please provide a valid shape type (model, component)."
          )
        );
      }
    });

    if (errors.length > 0) {
      ctx.status = 422;
      ctx.body = makeError(422, errors);
    } else {
      ctx.status = 200;
      ctx.body = {
        shapes
      };
    }
  }
};
