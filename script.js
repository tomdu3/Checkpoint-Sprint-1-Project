// This is a placeholder file which shows how you can access functions defined in other files.
// It can be loaded into index.html.
// You can delete the contents of the file once you have understood how it works.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.

import { getUserIds, getData, setData } from "./storage.js";

window.onload = function () {
  const users = getUserIds();
  // document.querySelector("body").innerText = `There are ${users.length} users`;
  // FIXME: Remove this line later, just for testing
  // setData("1", { name: "John" });
};

// Implement bookmark submission handler
const form = document.querySelector("#bookmark-form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const url = document.querySelector("#url").value.toLowerCase().trim();
  // TODO: implement URL validation
  const title = document.querySelector("#title").value.trim();
  const description = document.querySelector("#description").value.trim();
  const userId = document.querySelector("[data-user-id]").dataset.userId;
  // Create new bookmark object
  const newBookmark = {
    url,
    title,
    description,
    likes: 0,
  };
  // Save data using storage.js and re-render list
  const userData = getData(userId) || {}; // Get data for the user, or an empty object if no data exists yet
  userData[new Date().toISOString()] = newBookmark;
  setData(userId, userData);
  // TODO: re-render list
  form.reset();
});
