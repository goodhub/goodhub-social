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
import { anonymous, router } from '../../trpc';
import { App } from '../../utils/Application';

class Example extends Model<InferAttributes<Example>, InferCreationAttributes<Example>> {
  declare userId: CreationOptional<number>;
  declare description: string;

  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;

  static modelName = 'Example';
  static attributes: ModelAttributes<Example, Attributes<Example>> = {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    description: {
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

export default await App.setup('example', {
  // Any environment variables that are required for the application to run
  environment: z.object({}),
  // Any tables that need to be created in the database
  tables: [Example],
  seed: async () => {
    await Example.create({ description: `Stored in the database at ${new Date()}`, userId: 1 });
  },
  router: (env, cache) =>
    router({
      // Any routes that need to be exposed
      info: anonymous.input(z.object({ userId: z.number() })).query(async ({ input }) => {
        const { userId } = input;
        const row = await Example.findByPk(userId);
        if (!row) throw new Error('Not found');
        return row.toJSON();
      }),
      echo: anonymous.input(z.object({ message: z.string() })).mutation(async ({ input }) => {
        const { message } = input;
        return { message };
      })
    })
});
