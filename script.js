import { setupUserDropdown } from "./userDropdown.js";
import { setupBookmarkForm } from "./bookmarkForm.js";
import { renderBookmarkFeed } from "./bookmarkFeed.js";
export { sortBookmarks, formatTimestamp } from "./bookmarkUtils.js";

// Wrapper for rendering the bookmark feed
export function renderBookmarks(userId) {
  renderBookmarkFeed(userId);
}

setupUserDropdown(renderBookmarks);
setupBookmarkForm(renderBookmarks);
