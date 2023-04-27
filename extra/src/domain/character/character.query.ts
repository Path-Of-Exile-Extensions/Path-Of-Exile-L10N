import type {MangoQuerySelector} from "rxdb";
import {Character} from "./character";

export class CharacterCriteria {

  constructor(
    // Character 结构体中 c 字段
    public readonly c: string | undefined,
    // Character 结构体中 cat 字段
    public readonly cat: number | undefined,
  ) {
    this.c = c;
    this.cat = cat
  }

}

export class CharacterQuery {
  // 排序
  sortBy: string[];
  // 过滤
  criteria: CharacterCriteria


  constructor(
    criteria: CharacterCriteria,
    sortBy: string[] = [],
  ) {
    this.criteria = criteria;
    this.sortBy = sortBy;
  }

  toRXQuery(query: CharacterQuery): MangoQuerySelector<Character> {
    const selector: MangoQuerySelector<Character> = {};
    if (query.criteria.cat) {
      selector.cat = {
        $eq: query.criteria.cat
      }
    }
    if (query.criteria.c) {
      selector.c = {
        $eq: query.criteria.c
      }
    }

    return selector;
  }
}
