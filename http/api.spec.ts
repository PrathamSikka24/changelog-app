import { describe, it, expect, jest } from "bun:test";
import { getChangelogs } from "../controllers/controller"; // Assuming this is your backend function to fetch changelogs from the database
global.fetch= jest.fn();
// Mocking the database or the service directly, as Bun doesn't have a built-in HTTP request mocker
jest.mock("./databaseService", () => ({
  getChangeLogs: () => Promise.resolve([
    {
      id: 1,
      readmePath: "../../content/photo-app.md",
      date: "2024-02-08",
      version: "v 1.6.0",
      author: "Devzero-Inc"
    }
    // Mock more data as needed
  ])
}));

describe("fetchChangeLogs service function", () => {
  it("should fetch change logs successfully", async () => {
    const expected = [
      {
        id: 1,
        readmePath: "../../content/photo-app.md",
        date: "2024-02-08",
        version: "v 1.6.0",
        author: "Devzero-Inc"
      }
    ];

    const changeLogs = await getChangelogs();
    expect(changeLogs).toEqual(expected);
  });

  it("should handle errors properly if database query fails", async () => {
    // Overriding the mock to simulate a failure
    jest.mock("./databaseService", () => ({
      getChangeLogs: () => Promise.reject(new Error("Database query failed"))
    }));

    try {
      await getChangelogs();
    } catch (error) {
      expect(error).toEqual(new Error("Database query failed"));
    }
  });
});
