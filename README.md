# \<dd-poly\>

A web component providing a custom dropdown selector element with accessibility features

## Introduction

This is a web component implemented with Polymer 3. It provides a custom HTML element. The element is a dropdown selector, whose purpose is like that of the native HTML `select` element.

The `dd-poly` custom element differs from `select` by providing accessibility (and usability) features that are missing from `select`.

### Limitations of `select`

The issues with the `select` element include the following:

- [User research reported in 2013 by Baymard Institute](https://baymard.com/blog/mobile-dropdown-navigation) revealed that native dropdown selectors, at least on small-screen touch devices, conflict with typical user navigation preferences (e.g., skim before selecting).
- Websites differ in their implementions of navigation menus with dropdown selectors. When a user tabs through a navigation bar, some sites skip over the items within each top-level menu item, but other sites open each one and move through its sub-items with further presses of the `tab` key. Thus, users not familiar with a website cannot forecast how it will behave.
- The most popular web browsers respond differently to user actions on HTML `select` elements. For example, under OS X, (1) `option + up-arrow` or `command + up-arrow` navigates to the prior item in Firefox, but navigates to the top item in Chrome and Safari; (2) `tab` closes a single-select control in Firefox, but doesn’t do so in Chrome and Safari. Thus, users who switch browsers will need to remember more than one set of conventions if we use HTML `select` elements.
- Users of a multi-select element can accidentally destroy a set of prior selections by making one additional selection while failing to hold down the proper modifier key.
- [WAI-ARIA Authoring Practices](https://www.w3.org/TR/wai-aria-practices-1.1/#Listbox) makes two alternate recommendations for multi-select listbox interfaces, but both of them are violated by the dropdown implementations of all popular browsers.
- Users who navigate and perform actions entirely with a keyboard cannot use the multi-select feature, because, in the popular browsers, there is no keyboard action that moves the focus among menu items without also altering the selected states of items. Users can select multiple contiguous items with the keyboard, but cannot select any non-contiguous items. This flaw violates accessibility standard [WCAG 2.1 §2.1.1](https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html).
- Blind users and others who use a screen reader to interface with a browser can hear the items read aloud and hear confirmation when they “press” any item, but (at least if using VoiceOver) do not hear (1) whether the press selects or deselects the item and (2) whether pressing an item or navigating among items causes already selected items to become deselected. This violates accessibility standard [WCAG 2.1 §3.2.2](https://www.w3.org/WAI/WCAG21/Understanding/on-input.html).
- Popular browsers’ implementations of type-ahead rely on typing speed: A character entered within approximately 1 second after the previous character was entered is treated as a continuation of the current matching query, and otherwise is treated as the start of a new matching query. This imposition of a 1-second time limit makes the feature unusable for users who cannot enter characters at normal speed and violates accessibility standard [WCAG 2.1 §2.2.3](https://www.w3.org/WAI/WCAG21/Understanding/no-timing.html). The time constraint interferes with some purposes of fast typists, too: After you enter “typ”, you might want to scroll through the list of matches to inspect it before further refining your query by entering “e” or “i”, but the time limit prevents you from accomplishing this. Moreover, your query is not displayed, so you may lose track of what the browser considers it to be.

### Enhancements in `dd-poly`

The following accessibility and usability features distinguish `dd-poly` from the `select` element:

- Query transparency: You can see the text you entered for list filtration (your “query”).
- Temporal permissiveness: Your query is not discarded if you fail to enter 1 character per second or faster.
- Anchorless matching: Your query matches a list item if it is a substring anywhere in that item, not only at the beginning.
- Functional separation: You can navigate to a list item without selecting that item.
- Selection safety: In a multi-select list, you cannot accidentally destroy your prior selections by selecting an item without the proper modifier key.
- Focal transparency: You can always see the currently focal list item; it cannot be scrolled out of view.
- Keyboard operability: All operations can be performed with keyboard keys; no mouse pointing or scrolling is necessary.
- Need-based enabling: The commit button is enabled only when there is something to commit and therefore tells you whether you have changed the selection(s) since you last committed.
- List types: The interface details are customized to be appropriate for the 3 list types that dropdown selectors commonly support: lists of links, single-select lists of non-links, and multi-select lists of non-links.

## Demonstrating `dd-poly`

To experience `dd-poly` in a sample web page within the Polymer 3 `polymer-cli` environment:

- Ensure that you have installed [Node.js](https://nodejs.org), [Polymer CLI](https://www.npmjs.com/package/polymer-cli), and this `dd-poly` package.
- Launch a command-line terminal interface and make the `dd-poly` directory your working directory.
- Use the `npm install` command to install the dependencies specified in the `package.json` file.
- Choose a list type to demonstrate: links, single, or multi. To make that choice, duplicate one of the files inside the `demo/listSpecs` directory, rename the duplicate `listSpecs.js`, and move the duplicate out of the `demo` directory into the `dd-poly` directory.
- Use the `polymer serve` command to run a local web server.
- Noting the port that polymer reports it has chosen to run the server on, visit that URL with a web browser.
- Try the navigation and selection features of the dropdown selector.

## Using `dd-poly`

xxx

## Future work

xxx

## Related work

Other web components provide dropdown-selector custom elements with various aesthetic and behavioral themes. Some of them, such as [`paper-dropdown`](https://www.webcomponents.org/element/pushkar8723/paper-dropdown), have some of the above-listed accessibility features.

## Contributing

### Testing

Attempts to perform tests have not yet succeeded. There is a reported incompatibility between Polymer and Node 10, but reverting to Node 9.2 has resulted in errors not yet understood.
