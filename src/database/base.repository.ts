import {
  DataSource,
  EntityManager,
  EntityTarget,
  ObjectLiteral,
} from 'typeorm';

export abstract class BaseRepository {
  constructor(private readonly datasource: DataSource) {}

  private getEntityManager(entityManager?: EntityManager): EntityManager {
    if (entityManager) {
      return entityManager;
    }

    return this.datasource.manager;
  }

  protected getRepository<T extends ObjectLiteral>(
    target: EntityTarget<T>,
    manager?: EntityManager,
  ) {
    const entityManager = this.getEntityManager(manager);

    return entityManager.getRepository<T>(target);
  }
}
