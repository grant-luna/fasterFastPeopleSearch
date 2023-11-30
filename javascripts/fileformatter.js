export class FileFormatter {
  static fileTypeFunctions = {
    "Propwire" : this.processPropwireRow,
    "Fidelity Total Farm": this.processFidelityTotalFarmRow,
  }

  static formatDataByFileType(parsedCSVData, fileType) {
    return parsedCSVData.map(this.fileTypeFunctions[fileType]);
  }

  static processFidelityTotalFarmRow(row) {
    const fpsAddressPath = 'https://fastpeoplesearch.com/address/';
    
    return {
      'Owner 1 Name': (row["Owner1 First Name"] || '') + ' ' + (row["Owner1 Last Name"] || ''),
      'Owner 2 Name': (row["Owner2 First Name"] || '') + ' ' + (row["Owner2 Last Name"] || ''),
      'Owner Occupied': row["Owner Occupied"] === 'Y' ? 'Yes' : 'No',
      'Likely Contact Information Address': row["Owner Occupied"] === 'Y' ? 'Site Address' : 'Mailing Address',
      'Site Address': `${row["Site Address House Number"]} ${row["Site Address Street Prefix"]} ${row["Site Address Street Name"]} ${row["Site Address Unit Number"] ? `Unit ${row["Site Address Unit Number"]} ` : ''}${row["Site Address City"]}, ${row["Site Address State"]} ${row["Site Address Zip+4"]}`.replace(/^null$/g, ''),
      'Site Address Contact Information Link': `${fpsAddressPath}${String(row["Site Address House Number"] || '') }-${row["Site Address Street Prefix" || '']}-${(row["Site Address Street Name"] || '').replace(/ /g, '-')}${row["Site Address Unit Number"] ? `-${String(row["Site Address Unit Number"])}` : ''}_${(row["Site Address City"] || '').replace(/ /g, '-')}-${row["Site Address State"] || ''}`,
      'Mail Address': `${row["Full Mail Address"]} ${row["Mail Address City"]}, ${row["Mail Address State"]} ${row["Mail Address Zip+4"]}`,
      'Mail Address Contact Information Link': `${fpsAddressPath}${(row["Full Mail Address"] || '').replace(/ /g, '-')}_${(row["Mail Address City"] || '').replace(/ /g, '-')}-${row["Mail Address State"]}`,
      'Years in Property': String(row["Years In Proper"] || ''),
      'Purchase Date': row["Sale Date"],
      'Purchase Price': row["Sales Price"],
      'Estimated Value': row['AVM'] || '',
      'Bedrooms': row["Bedrooms"],
      'Bathrooms': row["Bathrooms"],
      'Square Feet': row["Building Area"],
    }
  }

  static processPropwireRow(row) {
    const fpsAddressPath = 'https://fastpeoplesearch.com/address/';
    
    return {
      'Owner 1 Name': (row["Owner 1 First Name"] || '') + ' ' + (row["Owner 1 Last Name"] || ''),
      'Owner 2 Name': (row["Owner 2 First Name"] || '') + ' ' + (row["Owner 2 Last Name"] || ''),
      'Owner Occupied': row["Owner Occupied"] === true ? 'Yes' : 'No',
      'Likely Contact Information Address': row["Owner Occupied"] === true ? 'Site Address' : 'Mailing Address',
      'Site Address': `${row['Address'] || ''} ${row["City"] || ''}, ${row["State"] || ''} ${String(row["Zip"]) || ''}`,
      'Site Address Contact Information Link': `${fpsAddressPath}${row["Address"].replace(/ /g, '-')}_${row["City"].replace(/ /g, '-')}-${row["State"]}`,
      'Mail Address': `${row["Owner Mailing Address"] || ''} ${row["Owner Mailing City"] || ''}, ${row["Owner Mailing State"] || ''} ${String(row["Owner Mailing Zip"]) || ''}`,
      'Mail Address Contact Information Link': `${fpsAddressPath}${(row["Owner Mailing Address"] || '').replace(/ /g, '-')}_${(row["Owner Mailing City"] || '').replace(/ /g, '-')}-${row["Owner Mailing State"]}`,
      'Years in Property': String((Number(row["Ownership Length (Months)"]) / 12).toFixed(2)),
      'Purchase Date': row["Last Sale Date"],
      'Purchase Price': row["Last Sale Amount"],
      'Estimated Value': row['Estimated Value'],
      'Bedrooms': row["Bedrooms"],
      'Bathrooms': row["Bathrooms"],
      'Square Feet': row["Living Square Feet"],
    }
  }
}
