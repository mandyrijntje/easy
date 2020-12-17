import { Select } from './Select';
import { Record } from '../domain';
import { Id, Json } from '../types';

export class Manage<T extends Record> extends Select<T> {

  add = (json: Json): Promise<T> => this.repo.add(json);
  update = (json: Json): Promise<T> => this.repo.update(json);
  remove = (id: Id): Promise<boolean> => this.repo.remove(id);
}