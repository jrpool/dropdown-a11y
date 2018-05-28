import {html, PolymerElement} from '../node_modules/@polymer/polymer/polymer-element.js';
import {specs} from './listSpecs.js';
let disableCommit,
  enableCommit,
  filter,
  htmlOf,
  makeExtremeLiFocal,
  moveFocusDown,
  moveFocusUp;
// Identify the HTML content to be inserted into the slot.
if (specs.type === 'links') {
  htmlOf = listText =>
    `<li tabindex="-1"><a href="${listText[0]}">${listText[1]}</a></li>`;
}
else if (specs.type === 'single') {
  htmlOf = listText =>
    `<li tabindex="-1">
      <input
        tabindex="-1"
        type="radio"
        name="${specs.name}"
        value="${listText[0]}"
        title="${listText[1]}"
      >
      ${listText[1]}
    </li>`;
}
else if (specs.type === 'multi') {
  htmlOf = listText =>
    `<li tabindex="-1">
      <input
        tabindex="-1"
        type="checkbox"
        name="${specs.name}"
        value="${listText[0]}"
        title="${listText[1]}"
      >
      ${listText[1]}
    </li>`;
}
const htmlList = specs.list.map(listText => htmlOf(listText)).join('\n');
// Define a function to return the set of query-matching “li” elements.
const matchingLis = () =>
  document.querySelectorAll('dd-poly li:not(.nonmatching)');
/*
  Define a function to identify the set of query-matching “li” elements of
  the list, and an “li” element’s index in it or -1 if no element was
  specified or (anomalously) the specified element is not matching.
*/
const liOfMatches = (cE, li) => {
  const matches = Array.from(matchingLis());
  const liIndex = li ? matches.indexOf(li) : -1;
  return [matches, liIndex];
};
/*
  Define a function to revise the set of viewable matching “li” elements of
  the list. If any of them contains the focal anchor or control, place it
  at or just above the middle of the allowed list window; otherwise start
  from the start of the matching “li” elements. If the “maxView” property is
  0 (to make the viewable size unlimited) or missing, do nothing.
*/
const reframe = (cE, form, centralLi, maxView) => {
  // If the count of viewable “li” elements is constrained:
  if (Number.parseInt(maxView)) {
    /*
      Identify the non-viewable ones and mark them as such, putting the central
      one into the middle of the viewable set, or, if there is none, starting
      the viewable set at the start.
    */
    const matchData = liOfMatches(cE, centralLi);
    if (matchData[1] === -1) {
      matchData[1] = 0;
    }
    const halfMaxView = maxView / 2;
    const buffers = [
      Math.ceil(halfMaxView) - 1, Math.floor(halfMaxView)
    ];
    let viewStart = matchData[1] - buffers[0];
    let viewEnd = matchData[1] + buffers[1];
    if (viewStart < 0) {
      viewEnd = Math.min(matchData[0].length - 1, viewEnd - viewStart);
      viewStart = 0;
    }
    else if (viewEnd > matchData[0].length - 1) {
      viewStart = Math.max(0, viewStart - viewEnd + matchData[0].length - 1);
    }
    for (let i = 0; i < matchData[0].length; i++) {
      if (i < viewStart || i > viewEnd) {
        matchData[0][i].classList.add('beyond');
      }
      else {
        matchData[0][i].classList.remove('beyond');
      }
    }
    // Insert or remove ellipses in lieu of non-viewable “li” elements, if any.
    const ellipses = form.getElementsByClassName('ellipsis');
    ellipses.item(0).innerHTML = viewStart > 0 ? '&hellip;' : '';
    ellipses.item(1).innerHTML
      = viewEnd < matchData[0].length - 1 ? '&hellip;' : '';
  }
};
// Define a function to make the commit button or form focal.
const dropOrWrapFocus = (cE, form) => {
  const button = form.querySelector('button:not([disabled])');
  if (button) {
    button.focus();
  }
  else {
    form.focus();
  }
};
// Define a function to make the query input fild or form focal.
const focusOnQueryOrForm = (cE, form) => {
  const queryField = form.querySelector('input[type=text]');
  if (queryField) {
    queryField.focus();
  }
  else {
    form.focus();
  }
};
/*
  Define a function to remove the commit button if the list type is links
  and otherwise to disable it.
*/
const initButton = (form, listType) => {
  if (listType === 'links') {
    const fieldset = form.querySelector('fieldset');
    fieldset.removeChild(fieldset.lastElementChild);
  }
  else {
    disableCommit(form.querySelector('button', true));
  }
};
// Define key navigation handlers.
const makeKeyHandlers = (cE, form, maxView) => {
  let newFocalLi;
  moveFocusUp = focus => {
    /*
      Identify the set of matching “li” elements and, if a focal one was
      specified, its index in the set.
    */
    const matchData = liOfMatches(cE, focus ? focus.parentElement : null);
    // If the focus is on any element within the custom element:
    if (focus) {
      // If on an “li” element:
      if (matchData[1] > -1) {
        // Identify the new focal “li” element, i.e. the preceding one.
        newFocalLi = matchData[0][matchData[1] - 1];
        // If the there is one, move the focus to its anchor or control.
        if (newFocalLi) {
          reframe(cE, form, newFocalLi, maxView);
          newFocalLi.firstElementChild.focus();
        }
        // Or from the highest “li” element to the query-input field or form.
        else {
          focusOnQueryOrForm(cE, form);
        }
      }
      // Or, if on the query input field, move the focus to the form.
      else if (focus.type === 'text') {
        form.focus();
      }
      // Or, if on the commit button:
      else if (focus.tagName === 'BUTTON') {
        // If there are any matching “li” elements, to the last one.
        if (matchData[0].length) {
          newFocalLi = matchData[0][matchData[0].length - 1];
          reframe(cE, form, newFocalLi, maxView);
          newFocalLi.firstElementChild.focus();
        }
        // Or to the query input field or form.
        else {
          focusOnQueryOrForm(cE, form);
        }
      }
    }
    // Or, if on the form:
    else {
      const button = form.querySelector('button:not([disabled])');
      // If an enabled commit button exists, move it there.
      if (button) {
        button.focus();
      }
      // Or, if there are any matching “li” elements, to the last one.
      else if (matchData[0].length) {
        newFocalLi = matchData[0][matchData[0].length - 1];
        reframe(cE, form, newFocalLi, maxView);
        newFocalLi.firstElementChild.focus();
      }
      // Or, if there is a query input field, to it.
      else {
        const input = form.querySelector('input[type=text]');
        if (input) {
          input.focus();
        }
      }
    }
  };
  moveFocusDown = focus => {
    /*
      Identify the set of matching “li” elements and, if a focal one was
      specified, its index in the set.
    */
    const matchData = liOfMatches(cE, focus ? focus.parentElement : null);
    // If the focus is on any element within the custom element:
    if (focus) {
      // If on an “li” element:
      if (matchData[1] > -1) {
        // Identify the new focal “li” element, i.e. the next lower one.
        newFocalLi = matchData[0][matchData[1] + 1];
        // If the there is one, move the focus to its anchor or control.
        if (newFocalLi) {
          reframe(cE, form, newFocalLi, maxView);
          newFocalLi.firstElementChild.focus();
        }
        // Or from the lowest “li” element to the commit button or form.
        else {
          dropOrWrapFocus(cE, form);
        }
      }
      // Or, if on the commit button, move the focus to the form.
      else if (focus.tagName === 'BUTTON') {
        form.focus();
      }
      // Or, if on the query text field:
      else if (focus.type === 'text') {
        // If there are any matching “li” elements, to the first one.
        if (matchData[0].length) {
          newFocalLi = matchData[0][0];
          reframe(cE, form, newFocalLi, maxView);
          newFocalLi.firstElementChild.focus();
        }
        // Or to the commit button or form.
        else {
          dropOrWrapFocus(cE, form);
        }
      }
    }
    // Or, if on the form:
    else {
      const input = form.querySelector('input[type = text]');
      // If a query text field exists, move it there.
      if (input) {
        input.focus();
      }
      // Or, if there are any matching “li” elements, to the first one.
      else if (matchData[0].length) {
        focalLi = matchData[0][0];
        reframe(cE, form, focalLi, maxView);
        focalLi.firstElementChild.focus();
      }
      // Or, if there is an enabled commit button, to it.
      else {
        const button = form.querySelector('button:not([disabled])');
        if (button) {
          button.focus();
        }
      }
    }
  };
  /*
    Make the first or last  matching “li” element’s anchor or control focal
    and central.
  */
  makeExtremeLiFocal = last => {
    const matchData = liOfMatches(cE, null);
    if (matchData[0].length) {
      focalLi = matchData[0][last ? matchData[0].length - 1 : 0];
      if (focalLi) {
        reframe(cE, form, focalLi, maxView);
        focalLi.firstElementChild.focus();
      }
    }
  };
}
// Define a key navigation listener.
const makeKeyListener = (cE, form) => {
  cE.addEventListener('keydown', event => {
    const key = event.key;
    focus = cE.shadowRoot.activeElement || document.activeElement;
    if (focus) {
      /*
        Listen for all keydown events, but act only on vertical navigation
        keys. Up and down arrows cycle within the section, including the
        section itself. But home and end keys move focus to the top and bottom
        of the list, omitting the query field, the submission button, and the
        section itself.
      */
      const keyType = [
        'ArrowUp', 'Up', 'ArrowDown', 'Down', 'Home', 'End'
      ].indexOf(key);
      if (keyType > -1) {
        if (keyType < 2) {
          if (focus === form) {
            moveFocusUp(null);
          }
          else {
            moveFocusUp(focus);
          }
        }
        else if (keyType < 4) {
          if (focus === form) {
            moveFocusDown(null);
          }
          else {
            moveFocusDown(focus);
          }
        }
        else if (keyType === 4) {
          makeExtremeLiFocal(false);
        }
        else if (keyType === 5) {
          makeExtremeLiFocal(true);
        }
        // Prevent the browser from applying its default rule to the keypress.
        event.preventDefault();
      }
    }
  });
};
/**
 * Define a query handler making each “li” element of the form eligible for
 * viewing iff the query string is a case-insensitive substring of the
 * element’s text content. Whether it becomes viewable depends on the central
 * “li” element and the size of the maximum viewable sublist.
 * @param {cE} element The `dd-poly` custom element.
 * @param {maxView} string The `specs.maxView` property’s value, an integer,
 *   as a string.
 */
const makeQueryHandler = (cE, maxView) => {
  filter = (form, query) => {
    const queryLowerCase = query.toLowerCase();
    const lis = cE.getElementsByTagName('li');
    for (let i = 0; i < lis.length; i++) {
      const li = lis.item(i);
      if (li.innerText.toLowerCase().includes(queryLowerCase)) {
        li.classList.remove('nonmatching');
      }
      else {
        li.classList.add('nonmatching');
      }
    }
    reframe(cE, form, null, maxView);
  };
};
// Define query listener.
const makeQueryListener = form => {
  const input = form.querySelector('input[type=text]');
  /*
    If the query’s value changes, refilter the list and start the viewable
    set of matching “li” elements at the start.
  */
  input.addEventListener('input', event => {
    filter(form, input.value);
  });
};
// Define a selection handler.
const makeSelectHandler = form => {
  enableCommit = form => {
    const button = form.querySelector('button');
    button.removeAttribute('disabled');
    button.innerText = 'Done';
  };
};
// Define a selection listener.
const makeSelectListener = cE => {
  /*
    If any “li” control selection changes, enable the “Done” button. Form
    controls other than “li” children are in cE.shadowRoot, so changes in
    those stop bubbling before reaching cE.
  */
  cE.addEventListener('change', event => {
    enableCommit(form);
  });
};
// Define a commit handler.
const makeCommitHandler = form => {
  disableCommit = (button, init) => {
    button.setAttribute('disabled', true);
    button.innerText = 'N/A';
    // If executed during initialization, make the form focal.
    init || form.focus();
  };
};
// Define a commit listener, if a commit button exists.
const makeCommitListener = form => {
  const button = form.querySelector('button');
  // If the commit button exists and is activated, disable it.
  if (button) {
    button.addEventListener('click', event => {
      disableCommit(button, false);
    });
  };
}
/**
 * `dd-poly`
 * Dropdown selector with accessibility features.
 * ## Features
 * This is a custom HTML element. It is a dropdown selector. You can use it for
 * a navigation menu, a list that the user selects 1 item from, or a list that
 * the user selects any number of items from.
 * For feature details, see https://github.com/jrpool/dd-poly.
 ## Usage
 * Create a file named `listSpecs.js` in the same directory as the page that
 * you want to use this dropdown in. Format that file according to the format
 * of the file in https://github.com/jrpool/dd-poly/tree/master/demo/listSpecs
 * that corresponds to your list type (links, single, or multi). The `maxView`
 * property represents the maximum number of list items that will be viewable
 * at once, or, if 0, indicates that all items can be viewed at once.
 * For more details, see https://github.com/jrpool/dd-poly.
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
export class DdPoly extends PolymerElement {
  static get template() {
    const htmlTemplateEl = html`
      <style>
        :host {
          display: block;
        }
        * {
          box-sizing: border-box;
        }
        .beyond,
        .nonmatching {
          display: none;
        }
        .dd-box {
          background-color: #f5f5f8;
        }
        .ellipsis {
          margin: 0 0 0 3rem;
        }
        input[type=text] {
          margin-top: 0.5rem;
          margin-bottom: 1rem;
        }
        legend {
          font-size: 1.3rem;
          font-weight: bold;
        }
        ul {
          margin-top: 0;
          margin-bottom: 0;
          list-style-type: none;
        }
        .within {
          display: block;
        }
      </style>
      <form tabindex="0">
        <fieldset>
          <legend>[[legend]]</legend>
          <div>
            <label>[[queryPrompt]] <input tabindex="-1" type="text"></label>
          </div>
          <div class="dd-box">
            <p class="ellipsis"></p>
            <ul>
              <slot></slot>
            </ul>
            <p class="ellipsis"></p>
          </div>
          <div class="button">
            <button tabindex="-1" type="button">Done</button>
          </div>
        </fieldset>
      </form>
    `;
    return htmlTemplateEl;
  }
  static get properties() {
    return {
      /** HTML legend element text for the dropdown selector */
      legend: {
        type: String,
        value: specs.legend
      },
      /** HTML label element text for the query text input field */
      queryPrompt: {
        type: String,
        value: 'Show only items containing:'
      },
      /** Set of HTML li elements containing the list items */
      list: {
        type: String,
        value: htmlList
      }
    };
  }
  constructor() {
    super();
    /*
      Replace the slot element with the list. This puts the “li” elements,
      unlike the remainder of the form, outside cE.shadowRoot, so they are
      treated as descendants of document and dd-poly, not of form.
    */
    this.innerHTML = htmlList;
  }
}
// Initialize the set of viewable “li” elements.
window.customElements.define('dd-poly', DdPoly);
const cE = document.querySelector('dd-poly');
const form = cE.shadowRoot.querySelector('form');
const maxView = specs.maxView.toString();
reframe(cE, form, document.querySelector('dd-poly li'), maxView);
// Create handlers and listeners.
makeKeyHandlers(cE, form, maxView);
makeKeyListener(cE, form);
makeQueryHandler(cE, maxView);
makeQueryListener(form);
makeSelectHandler(form);
makeSelectListener(cE);
makeCommitHandler(form);
makeCommitListener(form);
// Remove or disable the commit button.
initButton(form, specs.type);
