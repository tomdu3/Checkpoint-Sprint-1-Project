import assert from "node:assert";
import test from "node:test";

// Mock minimal document object for Node.js test environment
globalThis.document = {
  getElementById: () => null,
  querySelector: () => null,
};

const { sortBookmarks, formatTimestamp } = await import("./script.js");

// TODO: should think of  the way I can test it correctly because the format is different in different local time
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

test("sortBookmarks returns empty array when given empty list or invalid input", () => {
  assert.deepEqual(sortBookmarks([]), []);
  assert.deepEqual(sortBookmarks(null), []);
  assert.deepEqual(sortBookmarks(undefined), []);
});

test("sortBookmarks sorts bookmarks in reverse chronological order (newest first)", () => {
  const bookmarks = [
    {
      title: "Oldest",
      url: "https://google.com",
      description: "Older bookmark",
      createdAt: "2026-01-01T00:00:00.000Z",
    },
    {
      title: "Newest",
      url: "https://openai.com",
      description: "Newest bookmark",
      createdAt: "2026-03-01T00:00:00.000Z",
    },
    {
      title: "Middle",
      url: "https://nextjs.org",
      description: "Middle bookmark",
      createdAt: "2026-02-01T00:00:00.000Z",
    },
  ];

  const sorted = sortBookmarks(bookmarks);
  assert.equal(sorted[0].title, "Newest");
  assert.equal(sorted[1].title, "Middle");
  assert.equal(sorted[2].title, "Oldest");
});

test("sortBookmarks does not change the original array", () => {
  const bookmarks = [
    { title: "First", createdAt: "2026-01-01T00:00:00.000Z" },
    { title: "Second", createdAt: "2026-02-01T00:00:00.000Z" },
  ];
  const copy = [...bookmarks];
  sortBookmarks(bookmarks);
  assert.deepEqual(bookmarks, copy);
});
