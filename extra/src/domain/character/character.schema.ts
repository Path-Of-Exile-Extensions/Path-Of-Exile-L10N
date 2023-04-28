import {RxJsonSchema} from "rxdb";
import {Character} from "./character";

const _CharacterSchemaLiteral = {
  title: 'character',
  version: 0,
  primaryKey: 'c',
  type: 'object',
  properties: {
    // characters 以原始英文作为主键(需要考虑是否冲突的问题)
    c: {
      type: 'string',
      maxLength: 150
    },
    // us 原始英文字符串
    u: {
      type: 'string',
      maxLength: 150,
    },
    // category 分类 🐱
    cat: {
      type: 'number',
    },
  },
  required: ['c', 'u', 'cat'],
} as const

export const CharacterSchemaLiteral: RxJsonSchema<Character> = _CharacterSchemaLiteral;
