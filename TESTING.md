# Testing Documentation

This document outlines the testing strategy and verifies that each requirement from the project rubric has been tested and verified.

## Rubric Requirements Testing

- [x] 1. The website must contain a drop-down which lists five users
  - We have fetched 5 users from our `getUserIds()` helper function to populate the dropdown list.
    ![User dropdown menu](./docs/dropdown-user-menu.png)

- [ ] 2. Selecting a user must display the list of bookmarks for the relevant user

- [ ] 3. If there are no bookmarks for the selected user, a message is displayed to explain this

- [ ] 4. The list of bookmarks must be shown in reverse chronological order

- [ ] 5. Each bookmark has a title, description and created at timestamp displayed

- [ ] 6. Each bookmark’s title is a link to the bookmark’s URL

- [ ] 7. Each bookmark's "Copy to clipboard" button must copy the URL of the bookmark

- [ ] 8. Each bookmark's like counter works independently, and persists data across sessions

- [ ] 9. The website must contain a form with inputs for a URL, a title, and a description. The form should have a submit button.

- [ ] 10. Submitting the form adds a new bookmark for the relevant user only

- [ ] 11. After creating a new bookmark, the list of bookmarks for the current user is shown, including the new bookmark

- [ ] 12. The website must score 100% for accessibility in Lighthouse in the Desktop device mode, for all views in the website

- [ ] 13. Unit tests must be written for at least one non-trivial function

- [ ] 14. The project must not contain any dead code. All written JavaScript and CSS must be used.
