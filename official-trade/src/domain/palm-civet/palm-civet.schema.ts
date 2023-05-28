import {RxJsonSchema} from "rxdb";
import {PalmCivet} from "./palm-civet";

const _CharacterSchemaLiteral = {
  title: 'character',
  version: 0,
  primaryKey: 'version',
  type: 'object',
  properties: {
    // 版本号, 主键
    version: {
      type: 'string',
      maxLength: 20
    },
    static: {
      type: 'string',
    },
    stats: {
      type: 'string',
    },
    items: {
      type: 'string',
    },
    language: {
      type: 'string',
    }
  },
  required: ['version', 'language'],
} as const

export const PalmCivetSchemaLiteral: RxJsonSchema<PalmCivet> = _CharacterSchemaLiteral;
