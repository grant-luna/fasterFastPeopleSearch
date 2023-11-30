import { Client } from '../client.js';
import { Validator } from './validator.js';
import { FileFormatter } from './fileformatter.js';

export class Helper {
  static addTagToForm(currentTag) {
    const tagsContainer = document.getElementById('tags-container');
    const tagContainer = document.createElement('div');
    tagContainer.classList.add('tag-container');
    const generateTag = Handlebars.compile(document.getElementById('tag-template').innerHTML);
    tagContainer.innerHTML = generateTag({currentTag});

    tagsContainer.appendChild(tagContainer);
  }

  static displayFileTypeError() {
    const generateFileTypeError = Handlebars.compile(document.getElementById('filetype-error-template').innerHTML);
    const div = document.createElement('div');
    div.id = 'filetype-error-container';
    div.innerHTML = generateFileTypeError();
    
    const filetypeFieldset = document.getElementById('farm-file-fieldset');
    filetypeFieldset.appendChild(div);
  }

  static displayInputErrors(form) {
    const errorMessages = {
      'farm-name': 'The farm name must not be empty',
      'farm-file': 'The chosen file is not a supported file type.  Please import a file from Fidelity Total Farm or Propwire',
    }

    const invalidInputs = Validator.invalidFormData(form);
    const generateErrorMessage = Handlebars.compile(document.getElementById('error-template').innerHTML);
    
    invalidInputs.forEach((invalidInput) => {
      let errorContainer = document.createElement('div');
      errorContainer.classList.add('error-container');
      errorContainer.innerHTML = generateErrorMessage({errorMessage: errorMessages[invalidInput]});
      
      let fieldsetContainer = document.querySelector(`input[name="${invalidInput}"]`).closest('fieldset');
      
      fieldsetContainer.appendChild(errorContainer);
    })
  }

  static displayResults(reformattedCSVData) {
    const contactResultsHtml = document.getElementById('contact-results-template').innerHTML;
    const generateContactResults = Handlebars.compile(contactResultsHtml);
    
    document.querySelector('main').innerHTML = generateContactResults({contacts: reformattedCSVData});
    const fileDownloadButton = document.getElementById('file-download-button');
    fileDownloadButton.addEventListener('click', function (reformattedCSVData, event) {
      event.preventDefault();
      Helper.triggerFileDownload(reformattedCSVData);
    }.bind(null, reformattedCSVData));
    
  }

  static findTags() {
    return [...document.querySelectorAll('.tag-container')].map((tagContainer) => {
      return [...tagContainer.children][0].textContent;
    }).join(',')
  }

  static async generateCSVFile(fileObject) {
    return new Promise((resolve, _) => {
      const fileReader = new FileReader();

      fileReader.addEventListener('load', (event) => {
        const csvData = event.target.result;
        resolve(csvData);
      });

      fileReader.readAsText(fileObject);
    })
  }

  static handleClear(event) {
    document.querySelector('input[name="farm-name"]').value='';
    document.querySelector('input[name="farm-file"]').value = '';
    const tagsContainer = document.getElementById('tags-container');
    Helper.hideFileTypeError();
    [...tagsContainer.children].forEach((tag) => {
      tag.remove();
    })
  }

  static async handleGenerate(event) {
    event.preventDefault();
    
    const form = new FormData(document.querySelector('form'));

    localStorage.farmName = document.querySelector('input[name="farm-name"]').value || 'farm-file';

    const fileInput = document.querySelector('input[name="farm-file"]').files[0];
    const rawCSVData = await Helper.generateCSVFile(fileInput);
    const parsedCSVData = await Helper.parseCSVFile(rawCSVData);
    const headers = Object.keys(parsedCSVData[0]);
    const tags = Helper.findTags();
    
    try {
      const fileType = await Validator.validateHeaders(headers);
      // refactor the two lines below to pass tags in as an argument to formatDataByFileType
      const reformattedCSVData = FileFormatter.formatDataByFileType(parsedCSVData, fileType)
      reformattedCSVData.forEach((row) => row["Tags"] = tags);
      
      Helper.hideFileTypeError();
      Helper.displayResults(reformattedCSVData);
    } catch (error) {
      Helper.displayFileTypeError();
      console.error('Error:', error);
    }
  }
  

  static handleCreateTag(event) {
    event.preventDefault();
    const tagsFieldset = document.getElementById('tags-fieldset');
    const generateTagEntryTemplate = Handlebars.compile(document.getElementById('tags_template').innerHTML);
    
    tagsFieldset.innerHTML = generateTagEntryTemplate();
    Client.attachInputTagsListener();
  }

  static handleRemoveTag(event) {
    if (event.target.classList.contains('remove-tag')) {
      const tagContainer = event.target.closest('div.tag-container');
      tagContainer.remove();
    }
  }

  static handleTagsInput(event) {
    let currentTag = event.target.value;

    if (currentTag === ',') {
      event.target.value = '';
      event.target.click();
      return;
    }

    if (currentTag.length > 0) {
      const finalCharacter = currentTag[currentTag.length - 1];
      
      if (finalCharacter === ',') {
        currentTag = currentTag.slice(0, currentTag.length - 1);
                
        Helper.addTagToForm(currentTag);
        event.target.value = '';
        event.target.click()
      }
    }
  }

  static hideErrors() {
    const errors = [...document.querySelectorAll('.error-container')];

    if (errors.length > 0) {
      errors.forEach((error) => error.remove());
    }
  }

  static hideFileTypeError() {
    const filetypeError = document.getElementById('filetype-error-container');
    if (filetypeError) {
      filetypeError.remove();
    }
  }

  static parseCSVFile(rawCSVData) {
    return new Promise((resolve, _) => {
      Papa.parse(rawCSVData, {
        header: true,
        dynamicTyping: true,
        complete(event) {
          resolve(event.data);
        }
      })
    });
  }

  static tagExists(currentTag) {
    const currentTags = [...document.getElementById('tags-container').children].map((tagContainer) => {
      return tagContainer.children[0].textContent;
    });
    
    return currentTags.some((tag) => {
      const tagRegexp = new RegExp(currentTag, 'i');
      
      return tagRegexp.test(tag);
    })
  }

  static triggerFileDownload(reformattedCSVData) {
    
    const parsedCSVFile = Papa.unparse(reformattedCSVData);
    const blob = new Blob([parsedCSVFile], {type: 'text/csv;charset=utf-8;'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    
    link.download = `${localStorage.farmName || 'farm-file'}.contacts.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
