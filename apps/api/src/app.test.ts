import { describe, expect, it } from "vitest";

import { buildApp } from "./app.js";

describe("api health", () => {
  it("returns an ok health response", async () => {
    const app = buildApp();

    const response = await app.inject({
      method: "GET",
      url: "/health"
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      status: "ok",
      service: "drumforge-api"
    });
  });
});
