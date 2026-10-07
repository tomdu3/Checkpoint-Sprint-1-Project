import { getData, setData } from "./storage.js";

// Bookmark submission form
export function setupBookmarkForm(renderBookmarks) {
  const form = document.querySelector("#bookmark-form");

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    // get bookmark form values
    const { url, title, description, userId } = getBookmarkFormValues();

    // validate selected user
    if (!validateSelectedUser(userId)) {
      return;
    }

    // Create new bookmark
    const newBookmark = createNewBookmark(url, title, description);

    // Save the new bookmark
    saveBookmark(userId, newBookmark);

    // Re-render feed immediately when a new bookmark is submitted
    renderBookmarks(userId);
    form.reset();
  });
}

// validate selected user
function validateSelectedUser(userId) {
  const userError = document.querySelector("#user-error");
  if (!userError) return false; // this isn't fixing a bug. it just makes the function safer If user-error does not exist
  if (!userId) {
    userError.textContent = "Please select a user before adding a bookmark.";
    return false;
  }
  userError.textContent = "";
  return true;
}

// get bookmark form values
function getBookmarkFormValues() {
  return {
    url: document.querySelector("#url").value.trim().replace(/\/+$/, ""),
    title: document.querySelector("#title").value.trim(),
    description: document.querySelector("#description").value.trim(),
    userId: document.querySelector("#user_Id").value,
  };
}

// save bookmark
function saveBookmark(userId, bookmark) {
  const userData = getData(userId) || [];
  const bookmarks = Array.isArray(userData) ? userData : [];
  bookmarks.push(bookmark);
  setData(userId, bookmarks);
}

// create new bookmark
function createNewBookmark(url, title, description) {
  return {
    url,
    title,
    description,
    createdAt: new Date().toISOString(),
    likes: 0,
  };
}
