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

class AI extends Model<InferAttributes<AI>, InferCreationAttributes<AI>> {
  declare requestId: CreationOptional<number>;
  declare description: string;
  declare ip: string;

  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;

  static modelName = 'AI';
  static attributes: ModelAttributes<AI, Attributes<AI>> = {
    requestId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ip: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.DATE
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  };
}

export default await App.setup('ai', {
  // Any environment variables that are required for the application to run
  environment: z.object({
    OPEN_AI_API_KEY: z.string()
  }),
  // Any tables that need to be created in the database
  tables: [],
  router: env =>
    router({
      // Any routes that need to be exposed
      request: anonymous
        .input(z.object({ model: z.string(), max_tokens: z.number(), prompt: z.string() }))
        .mutation(async ({ input }) => {
          const response = await fetch(`https://api.openai.com/v1/completions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${env.OPEN_AI_API_KEY}`
            },
            body: JSON.stringify({
              ...input
            })
          });
          return response.json();
        })
    })
});
