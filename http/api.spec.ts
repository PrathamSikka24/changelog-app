import { describe, it, expect } from "bun:test";
import { ChangeLogService } from "../controllers/controller";

const mockDataSource = {
  getChangeLogs: async () => [
    {
      id: 1,
      readmePath: "../../content/photo-app.md",
      date: "2024-02-08",
      version: "v 1.6.0",
      author: "Devzero-Inc",
    },
  ],
};

describe("getChangelogs service function", () => {
  it("should fetch change logs successfully", async () => {
    const service = new ChangeLogService(mockDataSource);
    const expected = [
      {
        id: 1,
        readmePath: "../../content/photo-app.md",
        date: "2024-02-08",
        version: "v 1.6.0",
        author: "Devzero-Inc",
      },
    ];

    const changeLogs = await service.getChangelogs();
    expect(changeLogs).toEqual(expected);
  });
  it("should return an empty array when no change logs are found", async () => {
    const emptyDataSource = {
      getChangeLogs: async () => [],
    };
    const service = new ChangeLogService(emptyDataSource);
    const expected = [];

    const changeLogs = await service.getChangelogs();
    expect(changeLogs).toEqual(expected);
  });
  it("should handle errors gracefully when the data source fails", async () => {
    const failingDataSource = {
      getChangeLogs: async () => {
        throw new Error("Data source failure");
      },
    };
    const service = new ChangeLogService(failingDataSource);

    // Correctly await the promise within expect().rejects
    await expect(service.getChangelogs()).rejects.toThrow(
      "Data source failure"
    );
  });

  // Additional tests as needed
});
