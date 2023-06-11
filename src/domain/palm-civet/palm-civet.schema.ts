import {RxJsonSchema} from "rxdb";
import {PalmCivet} from "./palm-civet";

export const PalmCivetSchemaLiteral: RxJsonSchema<PalmCivet> = {
  title: 'PalmCivet',
  version: 2,
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
    statsIdFlat: {
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
    },
    itemsBoth: {
      type: 'string',
    }
  },
  required: ['lang'],
} as const

