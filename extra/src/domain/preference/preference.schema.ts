import {RxJsonSchema} from "rxdb";
import {PreferenceEntity} from "./preference.entity";

const _PreferenceSchemaLiteral = {
  title: 'preference',
  version: 0,
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
    }
  },
  required: ["id"],
} as const

export const PreferenceSchemaLiteral: RxJsonSchema<PreferenceEntity> = _PreferenceSchemaLiteral;
