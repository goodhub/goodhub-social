import {
  Attributes,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ModelAttributes
} from 'sequelize';
import { z } from 'zod';
import { anonymous, router } from '../../trpc.js';
import { App } from '../../utils/Application.js';

class Website extends Model<InferAttributes<Website>, InferCreationAttributes<Website>> {
  declare organisationId: number;
  declare name: string;

  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;

  declare readonly color?: string;
  declare readonly headline?: string;

  declare readonly contactPhoneNumber?: string;
  declare readonly contactEmail?: string;
  declare readonly contactAddress?: string;

  static modelName = 'Website';
  static attributes: ModelAttributes<Website, Attributes<Website>> = {
    organisationId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true
    },
    headline: {
      type: DataTypes.STRING,
      allowNull: true
    },
    contactPhoneNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    contactEmail: {
      type: DataTypes.STRING,
      allowNull: true
    },
    contactAddress: {
      type: DataTypes.STRING,
      allowNull: true
    },

    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  };
}

export default await App.setup('website', {
  // Any environment variables that are required for the application to run
  environment: z.object({}),
  // Any tables that need to be created in the database
  tables: [Website],
  seed: async () => {
    await Website.create({ name: 'Website configuration', organisationId: 1 });
  },
  router: (env, cache) =>
    router({
      // Any routes that need to be exposed
      infoForOrganisation: anonymous.input(z.object({ organisationId: z.number() })).query(async ({ input }) => {
        const { organisationId } = input;
        const row = await Website.findOne({ where: { organisationId } });
        return row?.toJSON();
      }),

      updateInfoForOrganisation: anonymous
        .input(
          z.object({
            organisationId: z.number(),
            headline: z.string(),
            color: z.string()
          })
        )
        .mutation(async ({ input }) => {
          const { organisationId, ...props } = input;
          const configuration = await Website.findOne({ where: { organisationId } });
          if (!configuration) {
            throw new Error('No configuration found');
          }
          await configuration.update(props);
          return configuration.toJSON();
        })
    })
});
