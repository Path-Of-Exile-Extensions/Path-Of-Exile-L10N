import {RxJsonSchema} from "rxdb";
import {PalmCivet} from "./palm-civet";

const _PalmCivetSchemaLiteral = {
  title: 'PalmCivet',
  version: 1,
  primaryKey: 'lang',
  type: 'object',
  properties: {
    // 语言标识, 主键
    lang: {
      type: 'string',
      maxLength: 20,
    },
    checksums: {
      type: 'string',
    },
    common: {
      type: 'string',
    },
    items: {
      type: 'string',
    },
    static: {
      type: 'string',
    },
    stats: {
      type: 'string',
    },
    statsFlat: {
      type: 'string',
    },
    menuSearch: {
      type: 'string',
    },
    full: {
      type: 'string',
    },
    gemStatsFlat: {
      type: 'string',
    },
    gemNames: {
      type: 'string',
    },
    gemFlat: {
      type: 'string',
    }
  },
  required: ['lang'],
} as const

export const PalmCivetSchemaLiteral: RxJsonSchema<PalmCivet> = _PalmCivetSchemaLiteral;
