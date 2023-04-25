import {CollectionsOfDatabase} from "rxdb/src/types/rx-database";

export default {
  title: 'human schema',
  version: 0,
  primaryKey: 'passportId',
  type: 'object',
  properties: {
    passportId: {
      type: 'string',
      maxLength: 100 // <- the primary key must have set maxLength
    },
    firstName: {
      type: 'string'
    },
    lastName: {
      type: 'string'
    },
    age: {
      description: 'age in years',
      type: 'integer',

      // number fields that are used in an index, must have set minimum, maximum and multipleOf
      minimum: 0,
      maximum: 150,
      multipleOf: 1
    }
  },
  required: ['firstName', 'lastName', 'passportId'],
  indexes: ['age']
}
