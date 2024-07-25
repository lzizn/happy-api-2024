import { QueryBuilder } from "@/infra/db/mongodb/query-builder";

describe("QueryBuilder", () => {
  it("Should be able to chain functions", () => {
    const query = new QueryBuilder();

    const result = query
      .project({ 1: 2 })
      .unwind({ a: "b" })
      .sort({ xyz: "1" })
      .group({ a: "b" });

    expect(result).toBeInstanceOf(QueryBuilder);
  });

  it("Should return instance of query builder when calling chaining functions", () => {
    const query = new QueryBuilder();

    expect(query.match({ true: false })).toBeInstanceOf(QueryBuilder);
  });

  it("Should return accumulated query when calling build", () => {
    const query = new QueryBuilder();

    const result = query
      .match({
        1: 2,
      })
      .match({ 2: 1 })
      .build();

    expect(result).toEqual([{ $match: { "1": 2 } }, { $match: { "2": 1 } }]);
  });

  it("Should add a $match filter when using match", () => {
    const query = new QueryBuilder();

    const result = query.match({ a: 2 }).build();

    expect(result).toEqual([{ $match: { a: 2 } }]);
  });

  it("Should add a $lookup filter when using lookup", () => {
    const query = new QueryBuilder();

    const result = query.lookup({ a: 2 }).build();

    expect(result).toEqual([{ $lookup: { a: 2 } }]);
  });

  it("Should add a $project filter when using project", () => {
    const query = new QueryBuilder();

    const result = query.project({ a: 2 }).build();

    expect(result).toEqual([{ $project: { a: 2 } }]);
  });

  it("Should add a $group filter when using group", () => {
    const query = new QueryBuilder();

    const result = query.group({ a: 2 }).build();

    expect(result).toEqual([{ $group: { a: 2 } }]);
  });

  it("Should add a $sort filter when using sort", () => {
    const query = new QueryBuilder();

    const result = query.sort({ a: 2 }).build();

    expect(result).toEqual([{ $sort: { a: 2 } }]);
  });

  it("Should add a $unwind filter when using unwind", () => {
    const query = new QueryBuilder();

    const result = query.unwind({ a: 2 }).build();

    expect(result).toEqual([{ $unwind: { a: 2 } }]);
  });
});
