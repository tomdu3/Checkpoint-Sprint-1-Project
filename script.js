import { getUserIds, getData, setData } from "./storage.js";

// Create user selection dropdown
const userElement =
  typeof document !== "undefined" ? document.getElementById("user_Id") : null; // for the tests to work

if (userElement) {
  const userIds = getUserIds();

  userIds.forEach((userId) => {
    const options = document.createElement("option");

    options.value = userId;

    options.textContent = `User ${userId}`;

    userElement.appendChild(options);
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

// Bookmark submission handler
const form =
  typeof document !== "undefined"
    ? document.querySelector("#bookmark-form")
    : null; // for the tests to work
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const url = document.querySelector("#url").value.trim().replace(/\/+$/, "");
    const title = document.querySelector("#title").value.trim();
    const description = document.querySelector("#description").value.trim();
    const userId = document.querySelector("#user_Id").value;

    // TODO: Do we really need these checks? Remove them later if not needed.
    // Check for empty fields
    if (!userId) {
      alert("Please select a user.");
      return;
    }

    if (!url || !title || !description) {
      alert("Please fill in all fields.");
      return;
    }

    // Validate URL using a regular expression
    const urlRegex =
      /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b(?:[-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
    if (!urlRegex.test(url)) {
      alert("Please enter a valid URL.");
      return;
    }

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

    // If a bookmark with the same URL already exists, remove the previous one,
    // but keep its likes count.
    const existingIndex = bookmarks.findIndex(
      (item) => item.url.toLowerCase() === url.toLowerCase(),
    );

    if (existingIndex !== -1) {
      newBookmark.likes = bookmarks[existingIndex].likes || 0;
      bookmarks.splice(existingIndex, 1);
    }

    bookmarks.push(newBookmark);
    setData(userId, bookmarks);

    // Re-render feed immediately when a new bookmark is submitted
    renderBookmarks(userId);
    form.reset();
  });
}

// Render bookmark feed for the selected user
export function renderBookmarks(userId) {
  const feedElement =
    typeof document !== "undefined"
      ? document.querySelector("#bookmark-feed")
      : null; // for the tests to work

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

  headerRow.appendChild(titleHeader);
  headerRow.appendChild(descriptionHeader);
  headerRow.appendChild(timestampHeader);
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

    row.appendChild(titleCell);
    row.appendChild(descriptionCell);
    row.appendChild(timestampCell);

    tbodyElement.appendChild(row);
  });

  tableElement.appendChild(tbodyElement);
  feedElement.appendChild(tableElement);
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

export function checkDuplicatedBookmark(bookmarks, url, title, description) {
  // Check for duplicates
  // if the URL already exists with identical title and description, then alert user
  // If the URL is the same, but title and/or description is different, the record will be updated
  for (const item of bookmarks) {
    const sameUrl = item.url.toLowerCase() === url.toLowerCase();
    const sameTitle = item.title === title;
    const sameDescription = item.description === description;
    if (sameUrl && sameTitle && sameDescription) return true;
  }
  return false;
}
