import { setupUserDropdown } from "./userDropdown.js";
import { setupBookmarkForm } from "./bookmarkForm.js";
import { renderBookmarksFeed } from "./bookmarkFeed.js";

// this wrapper means this two functions inside script.js can simply call render Bookmarks function
export function renderBookmarks(userId) {
  renderBookmarksFeed(userId, sortBookmarks, formatTimestamp);
}

// Sort bookmarks in reverse chronological order (newest first)
export function sortBookmarks(bookmarks) {
  if (!Array.isArray(bookmarks)) return [];
  return [...bookmarks].sort((a, b) => {
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return timeB - timeA;
  });
}

// Format creation timestamp
export function formatTimestamp(timestamp) {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleString(); // for display in local time of the user
}

setupUserDropdown(renderBookmarks);
setupBookmarkForm(renderBookmarks);
