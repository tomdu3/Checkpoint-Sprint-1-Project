import { getUserIds, getData, setData } from "./storage.js";

// Set up user selection dropdown
function setupUserDropdown() {
  const userElement = document.getElementById("user_Id");

  if (userElement) {
    const userIds = getUserIds();

    userIds.forEach((userId) => {
      const option = document.createElement("option");
      option.value = userId;
      option.textContent = `User ${userId}`;
      userElement.appendChild(option);
    });

    // Fetch and display bookmarks when user selection changes
    userElement.addEventListener("change", (event) => {
      const selectedUserId = event.target.value;
      renderBookmarks(selectedUserId);
    });

    if (userElement.value) {
      renderBookmarks(userElement.value);
    }
  }
}
setupUserDropdown();

// Bookmark submission form
function setupBookmarkForm() {
  const form = document.querySelector("#bookmark-form");

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const url = document.querySelector("#url").value.trim().replace(/\/+$/, "");
    const title = document.querySelector("#title").value.trim();
    const description = document.querySelector("#description").value.trim();
    const userId = document.querySelector("#user_Id").value;
    const userError = document.querySelector("#user-error");

    if (!userId) {
      userError.textContent = "Please select a user before adding a bookmark.";
      return;
    }

    userError.textContent = "";

    // Create new bookmark object
    const newBookmark = {
      url,
      title,
      description,
      createdAt: new Date().toISOString(),
      likes: 0,
    };

    // Save data using storage.js and re-render list
    const userData = getData(userId) || [];
    // Get data for the user, or an empty array if no data exists yet
    // Check if the data is an array, otherwise initialize an empty array
    const bookmarks = Array.isArray(userData) ? userData : [];

    bookmarks.push(newBookmark);
    setData(userId, bookmarks);

    // Re-render feed immediately when a new bookmark is submitted
    renderBookmarks(userId);
    form.reset();
  });
}

setupBookmarkForm();

// Render bookmark feed for the selected user
export function renderBookmarks(userId) {
  const feedElement = document.querySelector("#bookmark-feed");

  if (!feedElement) return;

  feedElement.innerHTML = "";

  if (!userId) {
    showFeedMessage(feedElement, "Please select a user to view bookmarks.");
    return;
  }

  // Fetch data on dropdown change via getData(userId)
  const userData = getData(userId) || [];
  const bookmarks = Array.isArray(userData) ? userData : [];

  // If no bookmarks exist, show a user-friendly explanatory message
  if (bookmarks.length === 0) {
    showFeedMessage(feedElement, "No bookmarks saved for this user yet.");
    return;
  }
  // create bookmark table
  const tableElement = createBookmarkTable();
  const tbodyElement = document.createElement("tbody");

  // Display in reverse chronological order (newest timestamp first)
  const sortedBookmarks = sortBookmarks(bookmarks);

  sortedBookmarks.forEach((bookmark) => {
    const row = createBookmarkRow(bookmark, userId, bookmarks);
    tbodyElement.appendChild(row);
  });

  tableElement.appendChild(tbodyElement);
  feedElement.appendChild(tableElement);
}

// create bookmark row : builds one bookmark row
function createBookmarkRow(bookmark, userId, bookmarks) {
  const row = document.createElement("tr");

  // Title as a clickable hyperlink (<a href="..." target="_blank">)
  const titleCell = document.createElement("td");
  const link = document.createElement("a");
  link.href = bookmark.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = bookmark.title;
  titleCell.appendChild(link);

  // Short description
  const descriptionCell = document.createElement("td");
  descriptionCell.textContent = bookmark.description;

  // Formatted creation timestamp
  const timestampCell = document.createElement("td");
  timestampCell.textContent = formatTimestamp(bookmark.createdAt);

  // Bookmark actions
  const actionsCell = document.createElement("td");
  const copyButton = document.createElement("button");
  copyButton.type = "button";
  copyButton.textContent = "Copy to clipboard";

  copyButton.addEventListener("click", () => {
    copyBookmarkUrl(bookmark.url, copyButton);
  });

  // Like counter button
  const likesCell = document.createElement("td");
  const likeButton = document.createElement("button");
  likeButton.type = "button";
  likeButton.textContent = `Like ${bookmark.likes ?? 0}`;

  likeButton.addEventListener("click", () => {
    likeBookmark(bookmark, userId, bookmarks);
  });

  actionsCell.appendChild(copyButton);
  likesCell.appendChild(likeButton);

  row.appendChild(titleCell);
  row.appendChild(descriptionCell);
  row.appendChild(timestampCell);
  row.appendChild(actionsCell);
  row.appendChild(likesCell);

  return row;
}

// Create bookmark table : builds table + headings
function createBookmarkTable() {
  const tableElement = document.createElement("table");
  const theadElement = document.createElement("thead");
  const headerRow = document.createElement("tr");

  const headers = ["Title", "Description", "Timestamp", "Actions", "Likes"];
  headers.forEach((headerText) => {
    const header = document.createElement("th");
    header.textContent = headerText;
    headerRow.appendChild(header);
  });

  theadElement.appendChild(headerRow);
  tableElement.appendChild(theadElement);

  return tableElement;
}

// Display Message
function showFeedMessage(feedElement, text) {
  const message = document.createElement("p");
  message.textContent = text;
  feedElement.appendChild(message);
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
function likeBookmark(bookmark, userId, bookmarks) {
  bookmark.likes = (bookmark.likes ?? 0) + 1;
  setData(userId, bookmarks);
  renderBookmarks(userId);
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
