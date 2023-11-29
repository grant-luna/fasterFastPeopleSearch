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

    [...tagsContainer.children].forEach((tag) => {
      tag.remove();
    })
  }

  static async handleGenerate(event) {
    event.preventDefault();
    
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
      const parsedCSVFile = Papa.unparse(reformattedCSVData);
      Helper.triggerFileDownload(parsedCSVFile);
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
    const currentTag = event.target.value;

    if (currentTag === ',') {
      event.target.value = '';
      event.target.click();
      return;
    }

    if (currentTag.length > 0) {
      const finalCharacter = currentTag[currentTag.length - 1];
      
      if (finalCharacter === ',') {
        Helper.addTagToForm(currentTag.slice(0, currentTag.length -1));
        event.target.value = '';
        event.target.click();
      }
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

  static triggerFileDownload(parsedCSVFile) {
    const blob = new Blob([parsedCSVFile], {type: 'text/csv;charset=utf-8;'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${document.querySelector('input[name="farm-name"]').value}.contacts.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}