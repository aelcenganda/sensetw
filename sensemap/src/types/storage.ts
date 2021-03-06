import { ActionUnion, emptyAction } from './action';
import { ObjectMap, HasID } from './sense/has-id';
import { MapID, MapData, emptyMapData } from './sense/map';
import { ObjectID, ObjectData, emptyObjectData } from './sense/object';
import { CardID, CardData, emptyCardData } from './sense/card';
import { BoxID, BoxData, emptyBoxData } from './sense/box';
import { EdgeID, Edge, emptyEdge } from './sense/edge';
import { HistoryID, History, emptyHistory } from './sense/history';
import { UserID, UserData, anonymousUserData } from './sense/user';

/**
 * The storage of sense objects.
 */
export type Storage = {
  maps:      ObjectMap<MapData>,
  objects:   ObjectMap<ObjectData>,
  cards:     ObjectMap<CardData>,
  boxes:     ObjectMap<BoxData>,
  edges:     ObjectMap<Edge>,
  histories: ObjectMap<History>,
  users:     ObjectMap<UserData>,
};

export const initial: Storage = {
  maps:      {},
  objects:   {},
  cards:     {},
  boxes:     {},
  edges:     {},
  histories: {},
  users:     {},
};

/**
 * It gets a map by it's id.
 *
 * @param storage The storage.
 * @param id The map id.
 */
export const getMap = (storage: Storage, id: MapID): MapData => storage.maps[id] || emptyMapData;

/**
 * It gets an object by it's id.
 *
 * @param storage The storage.
 * @param id The object id.
 */
export const getObject = (storage: Storage, id: ObjectID): ObjectData => storage.objects[id] || emptyObjectData;

/**
 * It gets a card by it's id.
 *
 * @param storage The storage.
 * @param id The card id.
 */
export const getCard = (storage: Storage, id: CardID): CardData => storage.cards[id] || emptyCardData;

/**
 * It gets a box by it's id.
 *
 * @param storage The storage.
 * @param id The box id.
 */
export const getBox = (storage: Storage, id: BoxID): BoxData => storage.boxes[id] || emptyBoxData;

/**
 * It gets an edge by it's id.
 *
 * @param storage The storage.
 * @param id The edge id.
 */
export const getEdge = (storage: Storage, id: EdgeID): Edge => storage.edges[id] || emptyEdge;

/**
 * It gets a history by it's id.
 * @param storage The storage.
 * @param id The history id.
 */
export const getHistory = (storage: Storage, id: HistoryID): History => storage.histories[id] || emptyHistory;

/**
 * It gets an user by it's id.
 * @param storage The storage.
 * @param id The user id.
 */
export const getUser = (storage: Storage, id: UserID): UserData => storage.users[id] || anonymousUserData;

/**
 * It gets cards from the given box.
 *
 * @param storage The storage.
 * @param id The box id.
 */
export const getCardsInBox = (storage: Storage, id: BoxID): ObjectMap<CardData> =>
  Object.keys(getBox(storage, id).contains)
    .map(oid => getObject(storage, oid).data )
    .map(cid => getCard(storage, cid))
    .reduce((a, c) => { a[c.id] = c; return a; }, {});

/**
 * Check if there is any map.
 *
 * @param storage The storage.
 */
export const hasNoMap = (storage: Storage): boolean => Object.keys(storage.maps).length === 0;

/**
 * Check if there is any object.
 *
 * @param storage The storage.
 */
export const hasNoObject = (storage: Storage): boolean => Object.keys(storage.objects).length === 0;

/**
 * Check if there is any card.
 *
 * @param storage The storage.
 */
export const hasNoCard = (storage: Storage): boolean => Object.keys(storage.cards).length === 0;

/**
 * Check if there is any box.
 *
 * @param storage The storage.
 */
export const hasNoBox = (storage: Storage): boolean => Object.keys(storage.boxes).length === 0;

/**
 * Check if there is any edge.
 *
 * @param storage The storage.
 */
export const hasNoEdge = (storage: Storage): boolean => Object.keys(storage.edges).length === 0;

/**
 * Check if there is any history.
 *
 * @param storage The storage.
 */
export const hasNoHistory = (storage: Storage): boolean => Object.keys(storage.histories).length === 0;

/**
 * Check if there is any user.
 *
 * @param storage The storage.
 */
export const hasNoUser = (storage: Storage): boolean => Object.keys(storage.users).length === 0;

/**
 * Check if a map exists.
 *
 * @param storage The storage.
 * @param id The map id.
 */
export const doesMapExist = (storage: Storage, id: MapID): boolean => !!storage.maps[id];

/**
 * Check if an object exists.
 *
 * @param storage The storage.
 * @param id The object id.
 */
export const doesObjectExist = (storage: Storage, id: ObjectID): boolean => !!storage.objects[id];

/**
 * Check if a card exists.
 *
 * @param storage The storage.
 * @param id The card id.
 */
export const doesCardExist = (storage: Storage, id: CardID): boolean => !!storage.cards[id];

/**
 * Check if a box exists.
 *
 * @param storage The storage.
 * @param id The card id.
 */
export const doesBoxExist = (storage: Storage, id: BoxID): boolean => !!storage.boxes[id];

/**
 * Check if an edge exists.
 *
 * @param storage The storage.
 * @param id The card id.
 */
export const doesEdgeExist = (storage: Storage, id: EdgeID): boolean => !!storage.edges[id];

/**
 * Check if a history exists.
 *
 * @param storage The storage.
 * @param id The history id.
 */
export const doesHistoryExist = (storage: Storage, id: HistoryID): boolean => !!storage.histories[id];

/**
 * Check if an user exists.
 *
 * @param storage The Storage.
 * @param id The user id.
 */
export const doesUserExist = (storage: Storage, id: UserID): boolean => !!storage.users[id];

/**
 * It filters the storage objects and create a new storage with those objects
 * and their edges.
 *
 * @todo Is it a `map`?
 *
 * @param storage The target storage.
 * @param filter The filter function.
 */
export const scoped = (storage: Storage, filter: (key: ObjectID) => boolean): Storage => {
  const objects = Object.keys(storage.objects)
    .filter(filter)
    .reduce(
      (acc, key) => {
        acc[key] = getObject(storage, key);
        return acc;
      },
      {});
  const edges = Object.values(storage.edges)
    .filter(g => !!objects[g.from] && !!objects[g.to])
    .reduce(
      (acc, g) => {
        acc[g.id] = g;
        return acc;
      },
      {});
  const { maps, cards, boxes, histories, users } = storage;
  return { maps, objects, cards, boxes, edges, histories, users };
};

/**
 * It gets a substorage with objects inside a box.
 *
 * @param storage The target storage.
 * @param id The box id.
 */
export const scopedToBox = (storage: Storage, id: BoxID): Storage => {
  const { contains } = getBox(storage, id);
  const filter = (key: ObjectID): boolean => !!contains[key];
  return scoped(storage, filter);
};

/**
 * It gets a new storage with objects that are not in any box.
 *
 * @param storage The target storage.
 */
export const scopedToMap = (storage: Storage): Storage => {
  const filter = (key: ObjectID): boolean => !getObject(storage, key).belongsTo;
  return scoped(storage, filter);
};

export const getObjectIds = (storage: Storage): ObjectID[] => Object.keys(storage.objects);

export const getCardIds = (storage: Storage): CardID[] => Object.keys(storage.cards);

export const getBoxIds = (storage: Storage): BoxID[] => Object.keys(storage.boxes);

export const getEdgeIds = (storage: Storage): EdgeID[] => Object.keys(storage.edges);

export const getHistoryIds = (storage: Storage): HistoryID[] => Object.keys(storage.histories);

export const getUserIds = (storage: Storage): UserID[] => Object.keys(storage.users);

/**
 * Partially update `maps` state.
 */
export const UPDATE_MAPS = 'UPDATE_MAPS';
export const updateMaps =
  (maps: ObjectMap<MapData>) => ({
    type: UPDATE_MAPS as typeof UPDATE_MAPS,
    payload: { maps },
  });

/**
 * Overwrite `maps`.
 */
export const OVERWRITE_MAPS = 'OVERWRITE_MAPS';
export const overwriteMaps =
  (maps: ObjectMap<MapData>) => ({
    type: OVERWRITE_MAPS as typeof OVERWRITE_MAPS,
    payload: { maps },
  });

/**
 * Remove listed `maps`.
 */
export const REMOVE_MAPS = 'REMOVE_MAPS';
export const removeMaps =
  (maps: ObjectMap<HasID<MapID>>) => ({
    type: REMOVE_MAPS as typeof REMOVE_MAPS,
    payload: { maps },
  });

/**
 * Partially update `objects` state.
 */
export const UPDATE_OBJECTS = 'UPDATE_OBJECTS';
export const updateObjects =
  (objects: ObjectMap<ObjectData>) => ({
    type: UPDATE_OBJECTS as typeof UPDATE_OBJECTS,
    payload: { objects },
  });

/**
 * Overwrite `objects`.
 */
export const OVERWRITE_OBJECTS = 'OVERWRITE_OBJECTS';
export const overwriteObjects =
  (objects: ObjectMap<ObjectData>) => ({
    type: OVERWRITE_OBJECTS as typeof OVERWRITE_OBJECTS,
    payload: { objects },
  });

/**
 * Remove listed `objects`.
 */
export const REMOVE_OBJECTS = 'REMOVE_OBJECTS';
export const removeObjects =
  (objects: ObjectMap<HasID<ObjectID>>) => ({
    type: REMOVE_OBJECTS as typeof REMOVE_OBJECTS,
    payload: { objects },
  });

/**
 * Partially update `cards` state.
 */
export const UPDATE_CARDS = 'UPDATE_CARDS';
export const updateCards =
  (cards: ObjectMap<CardData>) => ({
    type: UPDATE_CARDS as typeof UPDATE_CARDS,
    payload: { cards },
  });

/**
 * Overwirte `objects`.
 */
export const OVERWRITE_CARDS = 'OVERWRITE_CARDS';
export const overwriteCards =
  (cards: ObjectMap<CardData>) => ({
    type: OVERWRITE_CARDS as typeof OVERWRITE_CARDS,
    payload: { cards },
  });

/**
 * Remove listed `cards`.
 */
export const REMOVE_CARDS = 'REMOVE_CARDS';
export const removeCards =
  (cards: ObjectMap<HasID<CardID>>) => ({
    type: REMOVE_CARDS as typeof REMOVE_CARDS,
    payload: { cards },
  });

/**
 * Partially update `boxes` state.
 */
export const UPDATE_BOXES = 'UPDATE_BOXES';
export const updateBoxes =
  (boxes: ObjectMap<BoxData>) => ({
    type: UPDATE_BOXES as typeof UPDATE_BOXES,
    payload: { boxes },
  });

/**
 * Overwrite `boxes`.
 */
export const OVERWRITE_BOXES = 'OVERWRITE_BOXES';
export const overwriteBoxes =
  (boxes: ObjectMap<BoxData>) => ({
    type: OVERWRITE_BOXES as typeof OVERWRITE_BOXES,
    payload: { boxes },
  });

/**
 * Remove listed `boxes`.
 */
export const REMOVE_BOXES = 'REMOVE_BOXES';
export const removeBoxes =
  (boxes: ObjectMap<HasID<BoxID>>) => ({
    type: REMOVE_BOXES as typeof REMOVE_BOXES,
    payload: { boxes },
  });

/**
 * Partially update `edges` state.
 */
export const UPDATE_EDGES = 'UPDATE_EDGES';
export const updateEdges =
  (edges: ObjectMap<Edge>) => ({
    type: UPDATE_EDGES as typeof UPDATE_EDGES,
    payload: { edges },
  });

/**
 * Overwrite `edges`.
 */
export const OVERWRITE_EDGES = 'OVERWRITE_EDGES';
export const overwriteEdges =
  (edges: ObjectMap<Edge>) => ({
    type: OVERWRITE_EDGES as typeof OVERWRITE_EDGES,
    payload: { edges },
  });

/**
 * Remove listed `edges`.
 */
export const REMOVE_EDGES = 'REMOVE_EDGES';
export const removeEdges =
  (edges: ObjectMap<HasID<EdgeID>>) => ({
    type: REMOVE_EDGES as typeof REMOVE_EDGES,
    payload: { edges },
  });

export const UPDATE_HISTORIES = 'UPDATE_HISTORIES';
export const updateHistories =
  (histories: ObjectMap<History>) => ({
    type: UPDATE_HISTORIES as typeof UPDATE_HISTORIES,
    payload: { histories },
  });

export const OVERWRITE_HISTORIES = 'OVERWRITE_HISTORIES';
export const overwriteHistories =
  (histories: ObjectMap<History>) => ({
    type: OVERWRITE_HISTORIES as typeof OVERWRITE_HISTORIES,
    payload: { histories },
  });

export const REMOVE_HISTORIES = 'REMOVE_HISTORIES';
export const removeHistories =
  (histories: ObjectMap<HasID<HistoryID>>) => ({
    type: REMOVE_HISTORIES as typeof REMOVE_HISTORIES,
    payload: { histories },
  });

export const UPDATE_USERS = 'UPDATE_USERS';
export const updateUsers =
  (users: ObjectMap<UserData>) => ({
    type: UPDATE_USERS as typeof UPDATE_USERS,
    payload: { users },
  });

export const OVERWRITE_USERS = 'OVERWRITE_USERS';
export const overwriteUsers =
  (users: ObjectMap<UserData>) => ({
    type: OVERWRITE_USERS as typeof OVERWRITE_USERS,
    payload: { users },
  });

export const REMOVE_USERS = 'REMOVE_USERS';
export const removeUsers =
  (users: ObjectMap<HasID<UserID>>) => ({
    type: REMOVE_USERS as typeof REMOVE_USERS,
    payload: { users },
  });

/**
 * Remove card from Box.contains bidirectional relation.
 */
export const UPDATE_NOT_IN_BOX = 'UPDATE_NOT_IN_BOX';
export const updateNotInBox =
  (cardObject: ObjectID, box: BoxID) => ({
    type: UPDATE_NOT_IN_BOX as typeof UPDATE_NOT_IN_BOX,
    payload: { cardObject, box }
  });

/**
 * Add card to Box.contains bidirectional relation.
 */
export const UPDATE_IN_BOX = 'UPDATE_IN_BOX';
export const updateInBox =
  (cardObject: ObjectID, box: BoxID) => ({
    type: UPDATE_IN_BOX as typeof UPDATE_IN_BOX,
    payload: { cardObject, box }
  });

export const actions = {
  updateMaps,
  overwriteMaps,
  removeMaps,
  updateObjects,
  overwriteObjects,
  removeObjects,
  updateCards,
  overwriteCards,
  removeCards,
  updateBoxes,
  overwriteBoxes,
  removeBoxes,
  updateEdges,
  overwriteEdges,
  removeEdges,
  updateHistories,
  overwriteHistories,
  removeHistories,
  updateUsers,
  overwriteUsers,
  removeUsers,
  updateNotInBox,
  updateInBox,
};

export type Action = ActionUnion<typeof actions>;

/**
 * The storage reducer.
 *
 * @param {Storage} [state=initial] The current storage state.
 * @param {Action} [action=emptyAction] The storage action.
 * @returns {Storage} A new storage state.
 */
export const reducer = (state: Storage = initial, action: Action = emptyAction): Storage => {
  switch (action.type) {
    case UPDATE_MAPS: {
      return {
        ...state,
        maps: { ...state.maps, ...action.payload.maps },
      };
    }
    case OVERWRITE_MAPS: {
      return {
        ...state,
        maps: action.payload.maps,
      };
    }
    case REMOVE_MAPS: {
      const maps = { ...state.maps };
      Object.keys(action.payload.maps).forEach(key => delete maps[key]);

      return {
        ...state,
        maps,
      };
    }
    case UPDATE_OBJECTS: {
      return {
        ...state,
        objects: { ...state.objects, ...action.payload.objects },
      };
    }
    case OVERWRITE_OBJECTS: {
      return {
        ...state,
        objects: action.payload.objects,
      };
    }
    case REMOVE_OBJECTS: {
      const objects = { ...state.objects };
      Object.keys(action.payload.objects).forEach(key => delete objects[key]);

      return {
        ...state,
        objects,
      };
    }
    case UPDATE_CARDS: {
      return {
        ...state,
        cards: { ...state.cards, ...action.payload.cards },
      };
    }
    case OVERWRITE_CARDS: {
      return {
        ...state,
        cards: action.payload.cards,
      };
    }
    case REMOVE_CARDS: {
      const cards = { ...state.cards };
      Object.keys(action.payload.cards).forEach(key => delete cards[key]);

      return {
        ...state,
        cards,
      };
    }
    case UPDATE_BOXES: {
      return {
        ...state,
        boxes: { ...state.boxes, ...action.payload.boxes },
      };
    }
    case OVERWRITE_BOXES: {
      return {
        ...state,
        boxes: action.payload.boxes,
      };
    }
    case REMOVE_BOXES: {
      const boxes = { ...state.boxes };
      Object.keys(action.payload.boxes).forEach(key => delete boxes[key]);

      return {
        ...state,
        boxes,
      };
    }
    case UPDATE_EDGES: {
      return { ...state, edges: { ...state.edges, ...action.payload.edges } };
    }
    case OVERWRITE_EDGES: {
      return { ...state, edges: action.payload.edges };
    }
    case REMOVE_EDGES: {
      const edges = { ...state.edges };
      Object.keys(action.payload.edges).forEach(key => delete edges[key]);

      return {
        ...state,
        edges,
      };
    }
    case UPDATE_HISTORIES: {
      return { ...state, histories: { ...state.histories, ...action.payload.histories } };
    }
    case OVERWRITE_HISTORIES: {
      return { ...state, histories: action.payload.histories };
    }
    case REMOVE_HISTORIES: {
      const histories = { ...state.histories };
      Object.keys(action.payload.histories).forEach(key => delete histories[key]);

      return {
        ...state,
        histories,
      };
    }
    case UPDATE_USERS: {
      return { ...state, users: { ...state.users, ...action.payload.users } };
    }
    case OVERWRITE_USERS: {
      return { ...state, users: action.payload.users };
    }
    case REMOVE_USERS: {
      const users = { ...state.users };
      Object.keys(action.payload.users).forEach(key => delete users[key]);

      return {
        ...state,
        users,
      };
    }
    case UPDATE_NOT_IN_BOX: {
      const box        = state.boxes[action.payload.box];
      const cardObject = state.objects[action.payload.cardObject];
      let { contains } = box;
      delete(contains[cardObject.id]);
      return {
        ...state,
        boxes: {
          ...state.boxes,
          [box.id]: { ...box, contains },
        },
        objects: {
          ...state.objects,
          [cardObject.id]: { ...cardObject, belongsTo: undefined },
        }
      };
    }
    case UPDATE_IN_BOX: {
      const box        = state.boxes[action.payload.box];
      const cardObject = state.objects[action.payload.cardObject];
      const contains   = {
        ...box.contains,
        [cardObject.id]: { id: cardObject.id },
      };
      return {
        ...state,
        boxes: {
          ...state.boxes,
          [box.id]: { ...box, contains },
        },
        objects: {
          ...state.objects,
          [cardObject.id]: { ...cardObject, belongsTo: box.id },
        },
      };
    }
    default: {
      return state;
    }
  }
};