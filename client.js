import { Helper } from './javascripts/helper.js';

document.addEventListener('DOMContentLoaded', () => {
  Client.attachEventListeners();
  Client.registerPartials();
  Client.registerHandlebarsHelperFunctions();
});

export class Client {
  static attachEventListeners() {
    this.attachClearListener();
    this.attachCreateTagsListener();
    this.attachInputTagsListener();
    this.attachGenerateListener();
    this.attachRemoveTagListener();
  }

  static attachClearListener() {
    const clearButton = document.getElementById('clear');

    clearButton.addEventListener('click', Helper.handleClear)
  }

  static attachCreateTagsListener() {
    const createTagsButton = document.getElementById('apply-tags-button');
    
    if (createTagsButton) {
      createTagsButton.addEventListener('click', Helper.handleCreateTag);
    }
  }

  static attachGenerateListener() {
    const generateButton = document.getElementById('generate');

    generateButton.addEventListener('click', Helper.handleGenerate);
  }

  static attachInputTagsListener() {
    const tagsInput = document.querySelector('#tags-fieldset #tags');
    
    if (tagsInput) {
      tagsInput.addEventListener('input', Helper.handleTagsInput);
    }
  }

  static attachRemoveTagListener() {
    const tagsFieldset = document.getElementById('tags-fieldset');

    tagsFieldset.addEventListener('click', Helper.handleRemoveTag);
  }

  static registerPartials() {
    const contactPartial = document.getElementById('contact-partial');
    Handlebars.registerPartial('contact-partial', contactPartial);
  }

  static registerHandlebarsHelperFunctions() {
    Handlebars.registerHelper('isAbsenteeOwned', function(isOwnerOccupied) {
      return isOwnerOccupied === 'No';
    });
  }
}
