import { setData } from "./storage.js";

// create like button
export function createLikeButton(bookmark, userId, bookmarks, renderBookmarks) {
  const likeButton = document.createElement("button");
  likeButton.type = "button";
  likeButton.textContent = `Like ${bookmark.likes ?? 0}`;

  likeButton.addEventListener("click", () => {
    likeBookmark(bookmark, userId, bookmarks, renderBookmarks);
  });
  return likeButton;
}

// create copy button
export function createCopyButton(bookmark) {
  const copyButton = document.createElement("button");
  copyButton.type = "button";
  copyButton.textContent = "Copy to clipboard";

  copyButton.addEventListener("click", () => {
    copyBookmarkUrl(bookmark.url, copyButton);
  });
  return copyButton;
}

// Copy bookmark URL
async function copyBookmarkUrl(url, button) {
  try {
    await navigator.clipboard.writeText(url);
    button.textContent = "Copied!";
    setTimeout(() => {
      button.textContent = "Copy to clipboard";
    }, 1500);
  } catch {
    button.textContent = "Copy failed";
  }
}

// Update bookmark like count
function likeBookmark(bookmark, userId, bookmarks, renderBookmarks) {
  bookmark.likes = (bookmark.likes ?? 0) + 1;
  setData(userId, bookmarks);
  renderBookmarks(userId);
}
