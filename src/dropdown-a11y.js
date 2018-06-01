import {specs} from './listSpecs.js';
let disableCommit,
  enableCommit,
  filter,
  htmlOf,
  makeExtremeOptFocal,
  moveFocusDown,
  moveFocusUp;
/*
  Specifies the list parameters and contents. Replace this object with your own.
  In each property, set “type” to 'links', 'single', or 'multi'; set “size” to 0
  (for unlimited viewable list size) or a positive integer (number of viewable
  items); and specify a non-empty `legend` value. The `matcher` property is
  optional. If you include it, its value must include at least a `label`
  property. The `button` property is optional. If you include it, its value
  must include `enabledText` and `disabledText` properties.
*/
const lists = {
  continent: {
    type: 'single',
    size: 5,
    legend: 'Select the continent you most want to learn about.',
    matcher: {
      label: 'Show only continents containing:'
      width: 5,
      maxLength: 5
    },
    button: {
      enabledText: 'Done',
      disabledText: 'N/A'
    },
    specs: [
      [
        'af',
        'Africa'
      ],
      [
        'an',
        'Antarctica'
      ],
      [
        'as',
        'Asia'
      ],
      [
        'au',
        'Australia'
      ],
      [
        'eu',
        'Europe'
      ],
      [
        'mn',
        'Moon'
      ],
      [
        'na',
        'North America'
      ],
      [
        'oc',
        'Oceania'
      ],
      [
        'sa',
        'South America'
      ]
    ]
  },
  continents: {
    type: 'multiple',
    size: 0,
    legend: 'Select all the continents you most want to learn about.',
    matcher: {
      label: 'Show only continents containing:'
      width: 5,
      maxLength: 5
    },
    button: {
      enabledText: 'Done',
      disabledText: 'N/A'
    },
    specs: [
      [
        'af',
        'Africa'
      ],
      [
        'an',
        'Antarctica'
      ],
      [
        'as',
        'Asia'
      ],
      [
        'au',
        'Australia'
      ],
      [
        'eu',
        'Europe'
      ],
      [
        'mn',
        'Moon'
      ],
      [
        'na',
        'North America'
      ],
      [
        'oc',
        'Oceania'
      ],
      [
        'sa',
        'South America'
      ]
    ]
  },
  webcomplit: {
    type: 'links',
    size: 3,
    legend: 'Select the resource you want to consult.',
    matcher: {
      label: 'Show only resources containing:'
      width: 15,
      maxLength: 15
    },
    specs: [
      [
        'https://baymard.com/blog/mobile-dropdown-navigation',
        'Mobile: Never Use Native Drop-Downs for Navigation'
      ],
      [
        'https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets',
        'Keyboard-navigable JavaScript widgets'
      ],
      [
        'https://developer.mozilla.org/en-US/docs/Web/Web_Components',
        'Web Components'
      ],
      [
        'https://alligator.io/web-components/your-first-custom-element',
        'Your First Custom Element'
      ],
      [
        'https://www.webcomponents.org/community/articles/a-quick-polymer-introduction',
        'A Quick Introduction To Polymer'
      ],
      [
        'https://auth0.com/blog/build-your-first-app-with-polymer-and-web-components/',
        'Build Your First App with Polymer and Web Components'
      ],
      [
        'https://www.sitepen.com/blog/2017/09/14/using-web-components-with-angular/',
        'Using Web Components With Angular'
      ],
      [
        'https://alligator.io/vuejs/vue-integrate-web-components/',
        'Integrate Web Components with Your Vue.js App'
      ]
    ]
  }
};
// Identifies the HTML content to be inserted into the slot.
// if (specs.type === 'links') {
//   htmlOf = listText =>
//     `<li tabindex="-1"><a href="${listText[0]}">${listText[1]}</a></li>`;
// }
// else if (specs.type === 'single') {
//   htmlOf = listText =>
//     `<li tabindex="-1">
//       <input
//         tabindex="-1"
//         type="radio"
//         name="${specs.name}"
//         value="${listText[0]}"
//         title="${listText[1]}"
//       >
//       ${listText[1]}
//     </li>`;
// }
// else if (specs.type === 'multi') {
//   htmlOf = listText =>
//     `<li tabindex="-1">
//       <input
//         tabindex="-1"
//         type="checkbox"
//         name="${specs.name}"
//         value="${listText[0]}"
//         title="${listText[1]}"
//       >
//       ${listText[1]}
//     </li>`;
// }
// const htmlList = specs.list.map(listText => htmlOf(listText)).join('\n');
// Returns the set of query-matching options.
const matchingOpts = () =>
  document.querySelectorAll('select-a11y option:not(.nonmatching)');
/*
  Identifies the set of query-matching options (i.e. “option” elements) of the
  list, and an option’s index in it or -1 if no element was specified or
  (anomalously) the specified option is not matching.
*/
const optOfMatches = (cE, opt) => {
  const matches = Array.from(matchingOpts());
  const optIndex = opt ? matches.indexOf(opt) : -1;
  return [matches, optIndex];
};
/*
  Revises the set of viewable matching options of the list. If any is focal,
  places it at or just above the middle of the viewables; otherwise starts
  from the start of the matching options.
*/
const reframe = (cE, focalOpt, size) => {
  // If all matching options are to be viewable, does nothing. Otherwise:
  if (Number.parseInt(size)) {
    // Identifies the matching options. If none, does nothing. Otherwise:
    const matchData = optOfMatches(cE, centralOpt);
    if (matchData[0].length) {
      /*
        Makes the focal option as central as possible or, if none, makes the
        first matching option the first viewable one. Marks the non-viewable
        options.
      */
    }
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
    /*
      Inserts or removes ellipses in lieu of non-viewable “option” elements,
      if any.
    */
    const ellipses = form.getElementsByClassName('ellipsis');
    ellipses.item(0).innerHTML = viewStart > 0 ? '&hellip;' : '';
    ellipses.item(1).innerHTML
      = viewEnd < matchData[0].length - 1 ? '&hellip;' : '';
  }
};
// Makes the commit button or form focal.
const dropOrWrapFocus = (cE, form) => {
  const button = form.querySelector('button:not([disabled])');
  if (button) {
    button.focus();
  }
  else {
    form.focus();
  }
};
// Makes the query input field or form focal.
const focusOnQueryOrForm = (cE, form) => {
  const queryField = form.querySelector('input[type=text]');
  if (queryField) {
    queryField.focus();
  }
  else {
    form.focus();
  }
};
// Creates key navigation handlers.
const makeKeyHandlers = (cE, form, maxView) => {
  let newFocalOpt;
  moveFocusUp = focus => {
    /*
      Identifies the set of matching “option” elements and, if a focal one was
      specified, its index in the set.
    */
    const matchData = optOfMatches(cE, focus ? focus.parentElement : null);
    // If the focus is on any element within the custom element:
    if (focus) {
      // If on an “option” element:
      if (matchData[1] > -1) {
        // Identifies the new focal “option” element, i.e. the preceding one.
        newFocalOpt = matchData[0][matchData[1] - 1];
        // If the there is one, moves the focus to its anchor or control.
        if (newFocalOpt) {
          reframe(cE, form, newFocalOpt, maxView);
          newFocalOpt.firstElementChild.focus();
        }
        // Or from the highest “option” element to the query-input field or form.
        else {
          focusOnQueryOrForm(cE, form);
        }
      }
      // Or, if on the query input field, moves the focus to the form.
      else if (focus.type === 'text') {
        form.focus();
      }
      // Or, if on the commit button:
      else if (focus.tagName === 'BUTTON') {
        // If there are any matching “option” elements, to the last one.
        if (matchData[0].length) {
          newFocalOpt = matchData[0][matchData[0].length - 1];
          reframe(cE, form, newFocalOpt, maxView);
          newFocalOpt.firstElementChild.focus();
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
      // If an enabled commit button exists, moves it there.
      if (button) {
        button.focus();
      }
      // Or, if there are any matching “option” elements, to the last one.
      else if (matchData[0].length) {
        newFocalOpt = matchData[0][matchData[0].length - 1];
        reframe(cE, form, newFocalOpt, maxView);
        newFocalOpt.firstElementChild.focus();
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
      Identifies the set of matching “option” elements and, if a focal one was
      specified, its index in the set.
    */
    const matchData = optOfMatches(cE, focus ? focus.parentElement : null);
    // If the focus is on any element within the custom element:
    if (focus) {
      // If on the anchor or control of an “option” element:
      if (matchData[1] > -1) {
        // Identify the new focus’s “option” element, i.e. the next lower one.
        newFocalOpt = matchData[0][matchData[1] + 1];
        // If the there is one, moves the focus to its anchor or control.
        if (newFocalOpt) {
          reframe(cE, form, newFocalOpt, maxView);
          newFocalOpt.firstElementChild.focus();
        }
        /*
          Or from the lowest “option” element’s anchor or control to the commit
          button or form.
        */
        else {
          dropOrWrapFocus(cE, form);
        }
      }
      // Or, if on the commit button, moves the focus to the form.
      else if (focus.tagName === 'BUTTON') {
        form.focus();
      }
      // Or, if on the query text field:
      else if (focus.type === 'text') {
        /*
          If there are any matching “option” elements, to the first one’s anchor
          or control.
        */
        if (matchData[0].length) {
          newFocalOpt = matchData[0][0];
          reframe(cE, form, newFocalOpt, maxView);
          newFocalOpt.firstElementChild.focus();
        }
        // Or to the commit button or form.
        else {
          dropOrWrapFocus(cE, form);
        }
      }
    }
    // Or, if on the form:
    else {
      // If a query text field exists, moves it there.
      const input = form.querySelector('input[type = text]');
      if (input) {
        input.focus();
      }
      /*
        Or, if there are any matching “option” elements, to the first one’s
        anchor or control.
      */
      else if (matchData[0].length) {
        focalOpt = matchData[0][0];
        reframe(cE, form, focalOpt, maxView);
        focalOpt.firstElementChild.focus();
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
    Makes the first or last  matching “option” element’s anchor or control focal
    and central.
  */
  makeExtremeOptFocal = last => {
    const matchData = optOfMatches(cE, null);
    if (matchData[0].length) {
      focalOpt = matchData[0][last ? matchData[0].length - 1 : 0];
      if (focalOpt) {
        reframe(cE, form, focalOpt, maxView);
        focalOpt.firstElementChild.focus();
      }
    }
  };
}
// Creates a key navigation listener.
const makeKeyListener = (cE, form) => {
  cE.addEventListener('keydown', event => {
    const key = event.key;
    /*
      If the custom element or any descendant of it is focal and the key
      is a vertical navigation key, move the focus accordingly within the
      custom element, wrapping around for up and down arrows and staying
      within the list for home and end keys.
    */
    const focus = cE.activeElement;
    if (focus) {
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
          makeExtremeOptFocal(false);
        }
        else if (keyType === 5) {
          makeExtremeOptFocal(true);
        }
        // Prevents the browser from applying its default rule to the keypress.
        event.preventDefault();
      }
    }
  });
};
/**
 * Creates a query handler making each “option” element of the form eligible
 * for viewing iff the query string is a case-insensitive substring of the
 * element’s text content. Whether it becomes viewable depends on the central
 * “option” element and the size of the maximum viewable sublist.
 * @param {cE} element The `select-a11y` custom element.
 * @param {maxView} string The `specs.maxView` property’s value, an integer,
 *   as a string.
 */
const makeQueryHandler = (cE, maxView) => {
  filter = (form, query) => {
    const queryLowerCase = query.toLowerCase();
    const opts = cE.getElementsByTagName('option');
    for (let i = 0; i < opts.length; i++) {
      const opt = opts.item(i);
      if (opt.innerText.toLowerCase().includes(queryLowerCase)) {
        opt.classList.remove('nonmatching');
      }
      else {
        opt.classList.add('nonmatching');
      }
    }
    reframe(cE, form, null, maxView);
  };
};
// Creates a query listener.
const makeQueryListener = form => {
  const input = form.querySelector('input[type=text]');
  /*
    If the query’s value changes, refilters the list and starts the viewable
    set of matching “option” elements at the start.
  */
  input.addEventListener('input', event => {
    filter(form, input.value);
  });
};
// Creates a selection handler.
const makeSelectHandler = form => {
  enableCommit = form => {
    const button = form.querySelector('button');
    button.removeAttribute('disabled');
    button.innerText = 'Done';
  };
};
// Creates a selection listener.
const makeSelectListener = cE => {
  // If any “option” control selection changes, enables the commit button.
  cE.addEventListener('change', event => {
    if (event.target.parentElement.tagName === 'OPTION') {
      enableCommit(form);
    }
  });
};
// Creates a commit handler and listener, if a commit button exists.
const makeCommitHandlerAndListener = form => {
  button = form.querySelector('button');
  if (button) {
    // Handler: Disables the commit button.
    disableCommit = (button, init) => {
      button.setAttribute('disabled', true);
      button.innerText = 'N/A';
      // If a user (post-initialization) commit, also makes the form focal.
      init || form.focus();
    };
    // Listener.
    button.addEventListener('click', event => {
      disableCommit(button, false);
    });
};
// Initializes the commit button as gone (if “links”) or disabled.
const initButton = (form, listType) => {
  if (listType === 'links') {
    const fieldset = form.querySelector('fieldset');
    fieldset.removeChild(fieldset.lastElementChild);
  }
  else {
    disableCommit(form.querySelector('button', true));
  }
};
/**
 * `select-a11y`
 * Customized built-in (HTMLFieldSetElement) element.
 * Dropdown selector with accessibility features.
 ## Usage
 * 1. Amend the `lists` definition in this file.
 * 2. Include this file as a script in a web page.
 * 3. Where you want a dropdown list with the features of `select-a11y`,
 *   put a `fieldset` element with an `is` attribute whose value is
 *   `select-a11y` and a `name` attribute whose value is the `name`
 *   property of one of the objects in the `lists` array. Example:
 *   `<select is="select-a11y" name="continent">`.
 * 4. Optionally, you may also assign `form` and/or `disabled` attributes
 *   to this element.
 * For more details, see https://github.com/jrpool/select-a11y.
 * @customizedBuiltInElement
 * @demo demo/index.html
 */
class SelectA11y extends HTMLFieldSetElement {
  constructor() {
    super();
    // If there is a valid list specification:
    if (lists) {
      const name = this.getAttribute('name');
      if (name) {
        const list = lists[name];
        if (list) {
          const legendText = list.legend;
          const listType = list.type;
          const typeSet = new Set('links', 'single', 'multi');
          if (legendText && typeSet.has(listType)) {
            // There is a valid list specification, so create its legend.
            const legend = document.createElement('legend');
            legend.innerHTML = legendText;
            // Create its element and make it a child of this element.
            if (list.matcher && list.matcher.label) {
              const matcher = document.createElement('label');
              matcher.tabIndex = -1;
              matcher.innerHTML = `${list.matcher.label} `;
              const matchField = document.createElement('input');
              const matcherWidth = matcher.width;
              if (matcherWidth) {
                matchField.setAttribute('width', matcherWidth);
              }
              const matcherMaxLength = matcher.maxLength;
              if (matcherMaxLength) {
                matchField.setAttribute('maxlength', matcherMaxLength);
              }
              matcher.appendChild(matchField);
              this.appendChild(matcher);
            }
            /*
              Create a `select` or `ul` element for the list and make it the
              last child of this element.
            */
            const specs = list.specs;
            let listContainer;
            if (listType === 'links') {
              listContainer = document.createElement('ul');
              specs.forEach(spec => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.setAttribute('href') = spec[0];
                a.innerHTML = spec[1];
                li.appendChild(a);
                listContainer.appendChild(li);
              });
            }
            else {
              listContainer = document.createElement('select');
              if (listType === 'multi') {
                listContainer.setAttribute('multiple', true);
              }
              specs.forEach(spec => {
                const option = document.createElement('option');
                const input = document.createElement('input');
                input.type = listType === 'single' ? 'radio' : 'checkbox';
                const label = document.createElement('label');
                label.tabIndex = -1;
                input.setAttribute('name', spec[0]);
                label.appendChild(input);
                label.insertAdjacentHTML('beforeend', spec[1]);
                listContainer.appendChild(label);
              });
            }
            this.appendChild(listContainer);
            // If there is a valid button specification:
            const buttonSpec = list.button;
            if (buttonSpec) {
              const enabledText = buttonSpec.enabledText;
              const disabledText = buttonSpec.disabledText;
              if (enabledText && disabledText) {
                /*
                  Create a button element for it and make it the last child
                  of this element.
                */
                const button = document.createElement('button');
                button.type = button;
                button.tabIndex = -1;
                button.innerHTML = disabledText;
                this.appendChild(button);
              }
            }
          }
        }
      }
    }
  }
}
// Initialize the set of viewable “option” elements.
window.customElements.define('select-a11y', SelectA11y, {extends: "select"});
// const cE = document.querySelector('select-a11y');
// const form = cE.shadowRoot.querySelector('form');
// const maxView = specs.maxView.toString();
// reframe(cE, form, document.querySelector('select-a11y li'), maxView);
// Create handlers and listeners.
// makeKeyHandlers(cE, form, maxView);
// makeKeyListener(cE, form);
// makeQueryHandler(cE, maxView);
// makeQueryListener(form);
// makeSelectHandler(form);
// makeSelectListener(cE);
// makeCommitHandler(form);
// makeCommitListener(form);
// Remove or disable the commit button.
// initButton(form, specs.type);
