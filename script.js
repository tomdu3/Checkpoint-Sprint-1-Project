// This is a placeholder file which shows how you can access functions defined in other files.
// It can be loaded into index.html.
// You can delete the contents of the file once you have understood how it works.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.

import { getUserIds, getData, setData } from "./storage.js";

// Implement bookmark submission handler

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
    const userId = document.querySelector("[data-user-id]").dataset.userId;

    // Check for empty fields
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

    if (checkDuplicatedBookmark(bookmarks, url, title, description)) {
      alert("A bookmark with this URL, title, and description already exists.");
      return;
    }

    bookmarks.push(newBookmark);
    setData(userId, bookmarks);
    // TODO: re-render list
    form.reset();
  });
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
