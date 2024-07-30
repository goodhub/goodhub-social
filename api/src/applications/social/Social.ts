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

class Social extends Model<InferAttributes<Social>, InferCreationAttributes<Social>> {
  declare postId: CreationOptional<number>;
  declare description: string;

  declare title: string;
  declare subtitle: string;

  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;

  static modelName = 'Social';
  static attributes: ModelAttributes<Social, Attributes<Social>> = {
    postId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    description: {
      type: DataTypes.STRING
    },
    title: {
      type: DataTypes.STRING
    },
    subtitle: {
      type: DataTypes.STRING
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  };
}

export default await App.setup('social', {
  // Any environment variables that are required for the application to run
  environment: z.object({
    // TWITTER_API_KEY: z.string()
  }),
  // Any tables that need to be created in the database
  tables: [],
  seed: async () => {},
  router: env =>
    router({
      // Any routes that need to be exposed
      info: anonymous.input(z.object({ userId: z.number() })).query(async ({ input }) => {
        const { userId } = input;
        const row = await Social.findByPk(userId);
        if (!row) throw new Error('Not found');
        return row.toJSON();
      }),
      echo: anonymous.input(z.object({ message: z.string() })).mutation(async ({ input }) => {
        const { message } = input;
        console.log(message);
        return { message };
      }),
      color: anonymous.input(z.object({ userId: z.number(), shade: z.string() })).query(async ({ input }) => {
        console.log(input.userId);
        return { color: 'green' };
      })
    })
});
