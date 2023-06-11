import type {RxJsonSchema} from "rxdb";
import {PreferenceEntity} from "./preference.entity";

export const PreferenceSchemaLiteral: RxJsonSchema<PreferenceEntity> = {
  title: 'preference',
  version: 1,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: "string",
      maxLength: 10,
    },
    language: {
      type: 'string',
      maxLength: 20
    },
    presentationMode: {
      type: 'number',
    },
    enableTranslation: {
      type: 'boolean',
    },
    enableCustomTranslation: {
      type: 'boolean',
    },
    assetProxy: {
      type: 'string',
    },
    assetServer: {
      type: 'string',
    }
  },
  required: ["id"],
} as const
