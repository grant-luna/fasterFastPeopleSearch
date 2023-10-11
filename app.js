document.addEventListener('DOMContentLoaded', () => {
  let form = document.querySelector('#csvForm');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const fileInput = document.querySelector('input[name="farmFile"');
    const farmName = document.querySelector('input[name="farmName"]').value;

    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];

      const fileContent = await readFile(file);
      const processedData = processCSVData(fileContent);

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
  
      reader.onload = (event) => {
        resolve(event.target.result);
      };
  
      reader.onerror = (event) => {
        reject(event.target.error);
      };
  
      reader.readAsText(file);
    });
  }
  
  function processCSVData(fileContent) {
    // Parse the CSV data using PapaParse
    const parsedData = Papa.parse(fileContent, {
      header: true,
    });
  
    // Process the data and format it according to your requirements
    const newData = parsedData.data.map(row => {
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
        "Site Address Contact Information Link": `https://www.fastpeoplesearch.com/address/${siteAddressHouseNumber.replace(/ /g, "-")}-${siteAddressUnitNumber}-${siteAddressStreetName.replace(/ /g, "-")}_${siteAddressCity.replace(/ /g, "-")}-${siteAddressState}`,
        "Mailing (Likely Owner) Address": `${mailAddress} ${mailCity} ${mailState} ${siteAddressZip}`,
        "Mailing Address Contact Information Link": `https://www.fastpeoplesearch.com/address/${mailAddress.replace(/ /g, "-")}_${mailCity.replace(/ /g, "-")}-${mailState}`
      };
    });
  
    // Convert the processed data back to a CSV string using PapaParse
    const csv = Papa.unparse(newData);
  
    return csv;
  }
});




