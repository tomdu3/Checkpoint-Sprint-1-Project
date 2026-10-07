import { getData } from "./storage.js";
import { setupUserDropdown } from "./userDropdown.js";
import { setupBookmarkForm } from "./bookmarkForm.js";
import { createCopyButton, createLikeButton } from "./bookmarkActions.js";


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

  // Bookmark copy actions
  const actionsCell = document.createElement("td");
  const copyButton = createCopyButton(bookmark);

  // Bookmark like button
  const likesCell = document.createElement("td");
  const likeButton = createLikeButton(
    bookmark,
    userId,
    bookmarks,
    renderBookmarks,
  );

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
