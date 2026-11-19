// Third Party
import { describe, expect, it } from "vitest";

// AA Geuthur React
import { apiErrorMessage } from "@/Api/errors";

describe("apiErrorMessage", () => {
  it("should return the message below error", () => {
    // Test Action & Expected Result
    expect(apiErrorMessage({ error: "Permission Denied." }, "Failed to load")).toBe("Permission Denied.");
  });

  it("should return the string below detail", () => {
    // Test Action & Expected Result
    expect(apiErrorMessage({ detail: "Unauthorized" }, "Failed to load")).toBe("Unauthorized");
  });

  it("should prefer error over detail", () => {
    // Test Action & Expected Result
    expect(apiErrorMessage({ error: "Owner not found.", detail: "Not Found" }, "Failed to load")).toBe(
      "Owner not found.",
    );
  });

  it("should return the fallback for the detail list of a validation error", () => {
    // Test Data
    const error = { detail: [{ type: "missing", loc: ["body", "name"], msg: "Field required" }] };

    // Test Action & Expected Result
    expect(apiErrorMessage(error, "Failed to save")).toBe("Failed to save");
  });

  it("should return the fallback for a body without a message", () => {
    // Test Action & Expected Result
    expect(apiErrorMessage({}, "Failed to load")).toBe("Failed to load");
    expect(apiErrorMessage({ error: "" }, "Failed to load")).toBe("Failed to load");
    expect(apiErrorMessage({ error: 500, detail: null }, "Failed to load")).toBe("Failed to load");
  });

  it("should return the fallback when there is no body or no object", () => {
    // Test Action & Expected Result
    expect(apiErrorMessage(undefined, "Failed to load")).toBe("Failed to load");
    expect(apiErrorMessage(null, "Failed to load")).toBe("Failed to load");
    expect(apiErrorMessage("Internal Server Error", "Failed to load")).toBe("Failed to load");
    expect(apiErrorMessage(500, "Failed to load")).toBe("Failed to load");
  });
});
