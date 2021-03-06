import * as M from "./map";
import * as O from "./object";
import { maps, users } from "../../seeds/dev";
import { context } from "../context";

const nonExistentID = "10330ced-04b4-46d3-91a6-1d294bb12da3";

const { db } = context();
const user = users[0];
beforeEach(() => db.seed.run());
afterAll(() => db.destroy());

describe("GraphQL", () => {
  test("Map result fields", async () => {
    const map = await M.resolvers.Query.Map(
      null,
      { id: maps[0].id },
      { db },
      null
    );
    expect(map.id).toBe(maps[0].id);
    expect(map.createdAt).toBeTruthy();
    expect(map.updatedAt).toBeTruthy();
    expect(map.name).toBeTruthy();
    expect(map.description).toBeTruthy();
    expect(map.tags).toBeTruthy();
    expect(map.image).toBeTruthy();
    expect(map.type).toBeTruthy();
    expect(map.ownerId).toBeTruthy();
  });

  test("create/update/delete Map", async () => {
    const m0 = await M.resolvers.Mutation.createMap(
      null,
      {
        ownerId: user.id
      },
      { db, user }
    );
    expect(m0.id).toBeTruthy();
    expect(m0.createdAt).toBeTruthy();
    expect(m0.updatedAt).toBeTruthy();
    expect(m0.name).toBeNull();
    expect(m0.ownerId).toBe(user.id);

    const m1 = await M.resolvers.Mutation.updateMap(
      null,
      { id: m0.id, name: "baz", type: "someothertype" },
      { db, user }
    );

    const m2 = await M.resolvers.Query.Map(null, { id: m0.id }, { db }, null);
    expect(m2.id).toBe(m0.id);
    expect(m2.createdAt).toEqual(m0.createdAt);
    expect(m2.updateAt).toEqual(m0.updateAt);
    expect(m2.name).toEqual("baz");
    expect(m2.type).toEqual("someothertype");

    const m3 = await M.resolvers.Mutation.deleteMap(
      null,
      { id: m0.id },
      { db, user }
    );
    expect(m3.id).toBe(m0.id);
    const r3 = await M.resolvers.Query.Map(null, { id: m0.id }, { db }, null);
    expect(r3).toBeNull();
  });

  test("allMaps", async () => {
    const ms = await M.resolvers.Query.allMaps(null, {}, { db }, null);
    expect(ms.length).toBeGreaterThan(1);
  });

  test("allMaps null result", async () => {
    const ms = await M.resolvers.Query.allMaps(
      null,
      { filter: { id: nonExistentID } },
      { db },
      null
    );
    expect(ms.length).toBe(0);
  });
});

describe("Basics", () => {
  test("getObjectsInMap", async () => {
    const objects = await M.getObjectsInMap(db, maps[0].id);
    expect(objects[0].mapId).toEqual(maps[0].id);
  });

  /*
  test("updateMapUpdatedAt", async () => {
    const m0 = await M.getMap(db, maps[0].id);
    const old = m0.updatedAt;
    const m1 = await M.updateMapUpdatedAt(db, maps[0].id);
    expect(m1.updatedAt.valueOf()).toBeGreaterThan(old.valueOf());
  });
 */
});
