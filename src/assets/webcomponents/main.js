'use strict';

(function() {
  class EditableList extends HTMLElement {
    constructor() {
      // establish prototype chain
      super();

      console.log('constructor');
      // attaches shadow tree and returns shadow root reference
      // https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow
      console.log('title ->>', this.isConnected)

    }

    template() {
      const shadow = this.attachShadow({ mode: 'open' });

      // creating a container for the editable-list component
      const editableListContainer = document.createElement('div');

      // get attribute values from getters
      const title = this.title;
      const addItemText = this.addItemText;
      const listItems = this.items;

      // adding a class to our container for the sake of clarity
      editableListContainer.classList.add('editable-list');

      // creating the inner HTML of the editable list element
      editableListContainer.innerHTML = `
        <style>
          li, div > div {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .icon {
            background-color: #fff;
            border: none;
            cursor: pointer;
            float: right;
            font-size: 1.8rem;
          }

          .item-list {
            align-items: center;
            justify-content: space-between;
            border: 1px solid;
            border-radius: 15px;
            padding: 0px 20px;
            margin: 10px;
          }

          .add-item {
            display: flex;
            align-items: center;
            justify-content: space-around;
            margin: 20px;
            padding: 5px;
          }

          input{
            width: 90%;
            border: 1px solid black;
            border-radius: 40px;
            height: 30px;
            padding: 0 10px;
          }

          .icon:hover {
            background-color: lightgray;
          }

        </style>
        <h3 id="baslik">${title}</h3>
        <div class="add-item">
          <label>${addItemText}</label>
          <input class="add-new-list-item-input" type="text" placeholder="Add New Item"></input>
          <button class="editable-list-add-item icon">&oplus;</button>
        </div>
        <ul class="item-list">
          ${listItems.map(item => `
            <li>${item}
              <button class="editable-list-remove-item icon">&ominus;</button>
            </li>
          `).join('')}
        </ul>
      `;

      // binding methods
      this.addListItem = this.addListItem.bind(this);
      this.handleRemoveItemListeners = this.handleRemoveItemListeners.bind(this);
      this.removeListItem = this.removeListItem.bind(this);

      // appending the container to the shadow DOM
      shadow.appendChild(editableListContainer);
    }

    // add items to the list
    addListItem(e) {
      const textInput = this.shadowRoot.querySelector('.add-new-list-item-input');

      if (textInput.value) {
        const li = document.createElement('li');
        const button = document.createElement('button');
        const childrenLength = this.itemList.children.length;

        li.textContent = textInput.value;
        button.classList.add('editable-list-remove-item', 'icon');
        button.innerHTML = '&ominus;';

        this.itemList.appendChild(li);
        this.itemList.children[childrenLength].appendChild(button);

        this.handleRemoveItemListeners([button]);

        textInput.value = '';
      }
    }

    // 262895
    // fires after the element has been attached to the DOM
    connectedCallback() {
      // Init html template after created dom element
      this.template();

      const removeElementButtons = [...this.shadowRoot.querySelectorAll('.editable-list-remove-item')];
      const addElementButton = this.shadowRoot.querySelector('.editable-list-add-item');

      this.itemList = this.shadowRoot.querySelector('.item-list');

      this.handleRemoveItemListeners(removeElementButtons);
      addElementButton.addEventListener('click', this.addListItem, false);
    }

    attributeChangedCallback(name, oldValue, newValue) {
      console.log('Custom square element attributes changed.');
      updateStyle(this);
    }

    // gathering data from element attributes
    get title() {
      setTimeout(() => {
        console.log('title', this.getAttribute('title'));

      }, 0);
      return this.getAttribute('title') || '';
    }

    get items() {
      const items = [];

      [...this.attributes].forEach(attr => {
        if (attr.name.includes('list-item')) {
          items.push(attr.value);
        }
      });

      return items;
    }

    get addItemText() {
      return this.getAttribute('add-item-text') || '';
    }

    handleRemoveItemListeners(arrayOfElements) {
      arrayOfElements.forEach(element => {
        element.addEventListener('click', this.removeListItem, false);
      });
    }

    removeListItem(e) {
      e.target.parentNode.remove();
    }


  }

  // let the browser know about the custom element
  customElements.define('editable-list', EditableList);
})();
