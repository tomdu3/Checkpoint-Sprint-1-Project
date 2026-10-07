import { getUserIds, getData, setData } from "./storage.js";

// Set up user selection dropdown
function setupUserDropdown(){
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

// Bookmark submission handler
const form = document.querySelector("#bookmark-form");
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const url = document.querySelector("#url").value.trim().replace(/\/+$/, "");
    const title = document.querySelector("#title").value.trim();
    const description = document.querySelector("#description").value.trim();
    const userId = document.querySelector("#user_Id").value;

    // Check if user is selected
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
    const userData = getData(userId) || []; // Get data for the user, or an empty array if no data exists yet
    const bookmarks = Array.isArray(userData) ? userData : []; // Check if the data is an array, otherwise initialize an empty array

    bookmarks.push(newBookmark);
    setData(userId, bookmarks);

    // Re-render feed immediately when a new bookmark is submitted
    renderBookmarks(userId);
    form.reset();
  });
}

// Render bookmark feed for the selected user
export function renderBookmarks(userId) {
  const feedElement = document.querySelector("#bookmark-feed");

  if (!feedElement) return;

  feedElement.innerHTML = "";

  if (!userId) {
    const message = document.createElement("p");
    message.textContent = "Please select a user to view bookmarks.";
    feedElement.appendChild(message);
    return;
  }

  // Fetch data on dropdown change via getData(userId)
  const userData = getData(userId) || [];
  const bookmarks = Array.isArray(userData) ? userData : [];

  // If no bookmarks exist, show a user-friendly explanatory message
  if (bookmarks.length === 0) {
    const message = document.createElement("p");
    message.textContent = "No bookmarks saved for this user yet.";
    feedElement.appendChild(message);
    return;
  }

  const tableElement = document.createElement("table");
  const theadElement = document.createElement("thead");
  const headerRow = document.createElement("tr");

  const titleHeader = document.createElement("th");
  titleHeader.textContent = "Title";

  const descriptionHeader = document.createElement("th");
  descriptionHeader.textContent = "Description";

  const timestampHeader = document.createElement("th");
  timestampHeader.textContent = "Timestamp";

  const actionsHeader = document.createElement("th");
  actionsHeader.textContent = "Actions";

  const likesHeader = document.createElement("th");
  likesHeader.textContent = "Likes";

  headerRow.appendChild(titleHeader);
  headerRow.appendChild(descriptionHeader);
  headerRow.appendChild(timestampHeader);
  headerRow.appendChild(actionsHeader);
  headerRow.appendChild(likesHeader);
  theadElement.appendChild(headerRow);
  tableElement.appendChild(theadElement);

  const tbodyElement = document.createElement("tbody");

  // Display in reverse chronological order (newest timestamp first)
  const sortedBookmarks = sortBookmarks(bookmarks);

  sortedBookmarks.forEach((bookmark) => {
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

    tbodyElement.appendChild(row);
  });

  tableElement.appendChild(tbodyElement);
  feedElement.appendChild(tableElement);
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
