document.addEventListener('DOMContentLoaded', () => {
  let form = document.querySelector('#csvForm');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const fileSource = document.querySelector('select[name="fileSource"').value;
    const fileInput = document.querySelector('input[name="farmFile"]');
    const farmName = document.querySelector('input[name="farmName"]').value;

    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];

      const fileContent = await readFile(file);
      const processFileByFileSource = selectFileProcessingType(fileSource);
      const processedData = processCSVData(fileContent, processFileByFileSource);

      const blob = new Blob([processedData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${farmName}.contacts.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }
  });

  function readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.addEventListener('load', (event) => {
        resolve(event.target.result);
      });
      
      reader.addEventListener('error', (event) => {
        reject(event.target.error);
      });
  
      reader.readAsText(file);
    });
  }

  function selectFileProcessingType(fileSource) {
    switch (fileSource) {
      case 'Fidelity Total Farm':
        return processFidelityTotalFarm;
        break;
      case 'Propwire':
        return processPropWire;
        break;
      case 'ReboGateway':
        return processReboGateway;
        break;
    }
  }

  function processFidelityTotalFarm(row) {
    const siteAddressHouseNumber = row["Site Address House Number"] || '';
    const siteAddressStreetName = row["Site Address Street Name"] || '';
    const siteAddressCity = row["Site Address City"] || '';
    const siteAddressState = row["Site Address State"] || '';
    const siteAddressUnitNumber = row['Site Address Unit Number'] || '';
    const siteAddressZip = row["Site Address Zip+4"] || '';

    const mailAddress = row["Full Mail Address"] || '';
    const mailCity = row["Mail Address City"] || '';
    const mailState = row["Mail Address State"] || '';

    return {
      "Owner Name": row["Owner Name"] || '',
      "Second Owner Name": (row["Owner2 First Name"] || '') + ' ' + (row["Owner2 Last Name"] || ''),
      "Owner Occupied": row['Owner Occupied'] === 'Y' ? 'Yes' : 'No',
      "Site Address": `${siteAddressHouseNumber} ${siteAddressStreetName} ${siteAddressUnitNumber ? `#${siteAddressUnitNumber}` : ''} ${siteAddressCity} ${siteAddressState} ${siteAddressZip}`,
      "Site Address Contact Information Link": `https://www.fastpeoplesearch.com/address/${siteAddressHouseNumber.replace(/ /g, "-")}-${siteAddressStreetName.replace(/ /g, "-")}-${siteAddressUnitNumber}_${siteAddressCity.replace(/ /g, "-")}-${siteAddressState}`,
      "Mailing (Likely Owner) Address": `${mailAddress} ${mailCity} ${mailState} ${siteAddressZip}`,
      "Mailing Address Contact Information Link": `https://www.fastpeoplesearch.com/address/${mailAddress.replace(/ /g, "-")}_${mailCity.replace(/ /g, "-")}-${mailState}`
    };
  }

  function processPropWire(row) {
    const siteAddress = row["Address"] || '';
    const siteAddressCity = row["City"] || '';
    const siteAddressState = row["State"] || '';

    const mailAddress = row["Owner Mailing Address"] || '';
    const mailCity = row["Owner Mailing City"] || '';
    const mailState = row["Owner Mailing State"] || '';

    return {
      "First Owner Name": `${row["Owner 1 First Name"]} ${row['Owner 1 Last Name']}` || '',
      "Second Owner Name": `${row["Owner 2 First Name"]} ${row['Owner 2 Last Name']}` || '',
      "Owner Occupied": row['Owner Occupied'] === 'true' ? 'Yes' : 'No',
      "Site Address": `${siteAddress} ${siteAddressCity}, ${siteAddressState}`,
      "Site Address Contact Information Link": `https://www.fastpeoplesearch.com/address/${siteAddress}_${siteAddressCity}-${siteAddressState}`.replace(/#/g, '').replace(/ /g, '-'),
      "Mail Address": `${mailAddress} ${mailCity}, ${mailState}`,
      "Mailing Address Contact Information Link": `https://www.fastpeoplesearch.com/address/${mailAddress}_${mailCity}-${mailState}`.replace(/#/g, '').replace(/ /g, '-'),
    };
  }

  function processReboGateway(row) {
    const siteAddress = row["Site Address"] || '';
    const siteAddressCity = row["Site City"] || '';
    const siteAddressState = row["Site State"] || '';

    const mailAddress = row["Mail Address"] || '';
    const mailCity = row["Mailing City"] || '';
    const mailState = row["Mailing State"] || '';

    return {
      "First Owner Name": `${row["1st Owner's First Name"]} ${row["1st Owner's Last Name"]}` || '',
      "Second Owner Name": `${row["2nd Owner's First Name"]} ${row["2nd Owner's Last Name"]}` || '',
      "Owner Occupied": row['Owner Occupied'] === 'N' ? 'No' : 'Yes',
      "Site Address": `${siteAddress} ${siteAddressCity}, ${siteAddressState}`,
      "Site Address Contact Information Link": `https://www.fastpeoplesearch.com/address/${siteAddress}_${siteAddressCity}-${siteAddressState}`.replace(/#/g, '').replace(/ /g, '-'),
      "Mail Address": `${mailAddress} ${mailCity}, ${mailState}`,
      "Mailing Address Contact Information Link": `https://www.fastpeoplesearch.com/address/${mailAddress}_${mailCity}-${mailState}`.replace(/#/g, '').replace(/ /g, '-'),
    };
  }
  
  function processCSVData(fileContent, processFileByFileSource) {
    const parsedData = Papa.parse(fileContent, {
      header: true,
    });

    const newData = parsedData.data.map(processFileByFileSource);
    const csv = Papa.unparse(newData);
    return csv;
  }

  let clearButton = document.querySelector('button[type="button"]');
  clearButton.addEventListener('click', (event) => {
    event.preventDefault();

    let agentName = document.querySelector('input[name="agentName"]');
    let farmName = document.querySelector('input[name="farmName"]');
    let farmFile = document.querySelector('input[name="farmFile"]');

    agentName.value = '';
    farmName.value = '';
    farmFile.value = '';
  });
});
