import { getEnv } from "@/main/config/env";

describe("getEnv", () => {
  it("Should return all environment variables setup on this project", () => {
    const envs = getEnv();

    expect(typeof envs).toBe("object");
    expect(Object.keys(envs)).toEqual(["database_url"]);
  });
});
