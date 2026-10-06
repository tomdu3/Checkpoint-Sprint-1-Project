import assert from "node:assert";
import test from "node:test";
import { getUserIds } from "./storage.js";
import {
  checkDuplicatedBookmark,
  formatTimestamp,
} from "./script.js";

test("checkDuplicatedBookmark returns false when bookmarks list is empty", () => {
  const bookmarks = [];
  const result = checkDuplicatedBookmark(
    bookmarks,
    "https://example.com",
    "Example",
    "A test site",
  );
  assert.equal(result, false);
});

test("checkDuplicatedBookmark returns true when exact duplicate exists", () => {
  const bookmarks = [
    {
      url: "https://example.com",
      title: "Example",
      description: "A test site",
    },
  ];
  const result = checkDuplicatedBookmark(
    bookmarks,
    "https://example.com",
    "Example",
    "A test site",
  );
  assert.equal(result, true);
});

test("checkDuplicatedBookmark ignores URL casing (case-insensitive)", () => {
  const bookmarks = [
    {
      url: "https://example.com",
      title: "Example",
      description: "A test site",
    },
  ];
  const result = checkDuplicatedBookmark(
    bookmarks,
    "HTTPS://EXAMPLE.COM",
    "Example",
    "A test site",
  );
  assert.equal(result, true);
});

test("checkDuplicatedBookmark returns false if URL is same but title is different", () => {
  const bookmarks = [
    {
      url: "https://example.com",
      title: "Example Old",
      description: "A test site",
    },
  ];
  const result = checkDuplicatedBookmark(
    bookmarks,
    "https://example.com",
    "Example New",
    "A test site",
  );
  assert.equal(result, false);
});

test("checkDuplicatedBookmark returns false if URL is same but description is different", () => {
  const bookmarks = [
    {
      url: "https://example.com",
      title: "Example",
      description: "Old description",
    },
  ];
  const result = checkDuplicatedBookmark(
    bookmarks,
    "https://example.com",
    "Example",
    "New description",
  );
  assert.equal(result, false);
});

test("checkDuplicatedBookmark returns false when URL does not exist", () => {
  const bookmarks = [
    {
      url: "https://first.com",
      title: "First",
      description: "First description",
    },
  ];
  const result = checkDuplicatedBookmark(
    bookmarks,
    "https://second.com",
    "First",
    "First description",
  );
  assert.equal(result, false);
});

test("checkDuplicatedBookmark detects duplicate when multiple bookmarks exist", () => {
  const bookmarks = [
    {
      url: "https://site-a.com",
      title: "Site A",
      description: "Description A",
    },
    {
      url: "https://site-b.com",
      title: "Site B",
      description: "Description B",
    },
  ];
  const result = checkDuplicatedBookmark(
    bookmarks,
    "https://site-b.com",
    "Site B",
    "Description B",
  );
  assert.equal(result, true);
});

test("formatTimestamp returns a formatted date string for a valid ISO timestamp", () => {
  const timestamp = "2026-10-06T15:02:20.000Z";
  const formatted = formatTimestamp(timestamp);
  assert.ok(formatted.length > 0);
  assert.ok(formatted.includes("2026"));
});

test("formatTimestamp returns an empty string for missing or invalid timestamps", () => {
  assert.equal(formatTimestamp(""), "");
  assert.equal(formatTimestamp(null), "");
  assert.equal(formatTimestamp(undefined), "");
  assert.equal(formatTimestamp("invalid-date"), "");
});

