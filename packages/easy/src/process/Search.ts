import { Repo, Struct } from '../domain';
import { Id, isNotEmpty, JsonValue, Key, List, toList } from '../types';
import { choose, resolve } from '../utils';

export class Search<T extends Struct> {
  constructor(protected repo: Repo<T>) {}

  all = (): Promise<List<T>> => this.repo.all();

  byId = (id: Id): Promise<T> => this.repo.byId(id);

  byIds = (...ids: Id[]): Promise<List<T>> => this.repo.byIds(...ids);

  byKey = (key: Key): Promise<List<T>> => this.repo.byKey(key);

  search = (query: JsonValue): Promise<List<T>> =>
    choose(query)
      .case(isNotEmpty, q => this.repo.search(q))
      .else(resolve(toList<T>()));

  exists = (id: Id): Promise<boolean> => this.repo.exists(id);
}
