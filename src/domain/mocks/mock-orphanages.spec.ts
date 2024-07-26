import { mockOrphanageModel, mockOrphanageModels } from "@/domain/mocks";

describe("OrphanageModel mocks", () => {
  describe("mockOrphanage()", () => {
    it("Should return a valid instance of OrphanageMock", () => {
      const orphanageMock = mockOrphanageModel();

      expect(typeof orphanageMock.id).toBe("string");
      expect(typeof orphanageMock.name).toBe("string");
      expect(typeof orphanageMock.latitude).toBe("number");
      expect(typeof orphanageMock.longitude).toBe("number");
      expect(typeof orphanageMock.description).toBe("string");
      expect(typeof orphanageMock.instructions).toBe("string");
      expect(typeof orphanageMock.open_on_weekends).toBe("boolean");
      expect(typeof orphanageMock.opening_hours).toBe("string");
    });
  });

  describe("mockOrphanages()", () => {
    it("Should return an array of OrphanageMock instances", () => {
      const orphanageMocks = mockOrphanageModels();

      for (const orphanageMock of orphanageMocks) {
        expect(typeof orphanageMock.id).toBe("string");
        expect(typeof orphanageMock.name).toBe("string");
        expect(typeof orphanageMock.latitude).toBe("number");
        expect(typeof orphanageMock.longitude).toBe("number");
        expect(typeof orphanageMock.description).toBe("string");
        expect(typeof orphanageMock.instructions).toBe("string");
        expect(typeof orphanageMock.open_on_weekends).toBe("boolean");
        expect(typeof orphanageMock.opening_hours).toBe("string");
      }
    });

    it("Should return, by default, 2 items when not passing amount", () => {
      const orphanageMocks = mockOrphanageModels();

      expect(orphanageMocks.length).toBe(2);
    });

    it("Should return amount of items based on provided amount", () => {
      const seed_amount = 20;
      const orphanageMocks = mockOrphanageModels(seed_amount);

      expect(orphanageMocks.length).toBe(seed_amount);
    });
  });
});
