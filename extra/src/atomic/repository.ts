export class RepositoryBase<T> {
  /**
   * 增
   */
  create(struct: T): Promise<T> {
    throw new Error('not implemented');
  }

  /**
   * 删
   */
  delete(struct: T): Promise<T> {
    throw new Error('not implemented');
  }

  /**
   * 改
   */
  update(struct: T): Promise<T> {
    throw new Error('not implemented');
  }

  /**
   * 增加多个
   */
  createMany(structs: T[]): Promise<T[]> {
    throw new Error('not implemented');
  }

  /**
   * 删除多个
   */
  deleteMany(structs: T[]): Promise<any> {
    throw new Error('not implemented');
  }

  /**
   * 删除所有
   */
  deleteAll(): Promise<any> {
    throw new Error('not implemented');
  }

  /**
   * 更新多个
   */
  updateMany(structs: T[]): Promise<any> {
    throw new Error('not implemented');
  }

  /**
   * 查询
   */
  query(...args: any): Promise<any> {
    throw new Error('not implemented');
  }

  /**
   * 更新或覆盖
   */
  upsert(struct: T): Promise<any> {
    throw new Error('not implemented');
  }

  /**
   * 更新或覆盖多个
   */
  upsertMany(structs: T[]): Promise<any> {
    throw new Error('not implemented');
  }

  initialize(): Promise<any> {
    return Promise.resolve()
  }
}
