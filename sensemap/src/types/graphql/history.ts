import { HasID } from '../sense/has-id';
import { UserID } from '../sense/user';
import { MapID } from '../sense/map';
import { ObjectID } from '../sense/object';
import { CardID } from '../sense/card';
import { BoxID } from '../sense/box';
import { ChangeType, HistoryID, HistoryType } from '../sense/history';

interface GraphQLChangeFields {
  changeType: ChangeType;
  field: string;
  before: string;
  after: string;
  from: HasID<ObjectID>;
  to: HasID<ObjectID>;
  box: HasID<BoxID>;
  connectWith: HasID<ObjectID>;
}

export interface GraphQLHistoryFields {
  id: HistoryID;
  createdAt: string;
  updatedAt: string;
  historyType: HistoryType;
  user: HasID<UserID>;
  map: HasID<MapID>;
  object: HasID<ObjectID>;
  card: HasID<CardID>;
  changes: GraphQLChangeFields[];
}

// const toChange: (c: GraphQLChangeFields) => Change = undefined;

// const toHistory: (h: GraphQLHistoryFields) => History = undefined;