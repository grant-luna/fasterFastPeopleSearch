export class Validator {
  static validHeaders = {
    "Propwire": ['Address', 'City', 'State', 'Zip', 'County', 'Living Square Feet', 'Year Built', 'Lot (Acres)', 'Lot (Square Feet)', 'Land Use', 'Subdivision', 'APN', 'Legal Description', 'Property Use', 'Units Count', 'Bedrooms', 'Bathrooms', '# of Stories', 'Garage Type', 'Garage Square Feet', 'Air Conditioning Type', 'Heating Type', '# of Fireplaces', 'Owner 1 First Name', 'Owner 1 Last Name', 'Owner 2 First Name', 'Owner 2 Last Name', 'Owner Mailing Address', 'Owner Mailing City', 'Owner Mailing State', 'Owner Mailing Zip', 'Ownership Length (Months)', 'Owner Type', 'Owner Occupied', 'Vacant?', 'Listing Status', 'Listing Price', 'Days on Market', 'Last Updated', 'Listing Agent Full Name', 'Listing Agent First Name', 'Listing Agent Last Name', 'Listing Agent Email', 'Listing Agent Phone', 'Listing Office Phone', 'MLS Type', 'Last Sale Date', 'Last Sale Amount', 'Estimated Value', 'Estimated Equity', 'Equity Percent', 'Open Mortgage Balance', 'Mortgage Interest Rate', 'Mortgage Document Date', 'Mortgage Loan Type', 'Lender Name', 'Deed Type', 'Position', 'Tax Amount', 'Assessment Year', 'Assessed Total Value', 'Assessed Land Value', 'Assessed Improvement Value', 'Market Value', 'Market Land Value', 'Market Improvement Value', 'Status', 'Default Amount', 'Opening bid', 'Recording Date', 'Auction Date'],
    "Fidelity Total Farm": [
      "Site Address House Number",
      "Site Address Street Prefix",
      "Site Address Street Name",
      "Site Address Unit Number",
      "Site Address City",
      "Site Address State",
      "Site Address Zip+4",
      "Owner Name",
      "Owner1 First Name",
      "Owner1 Middle Name",
      "Owner1 Last Name",
      "Owner1 Spouse First Name",
      "Owner2 First Name",
      "Owner2 Middle Name",
      "Owner2 Last Name",
      "Owner2 Spouse First Name",
      "Full Mail Address",
      "Mail Address City",
      "Mail Address State",
      "Mail Address Zip+4",
      "Use Code Description",
      "Zoning",
      "Building Area",
      "Rooms",
      "Bedrooms",
      "Bathrooms",
      "Pool",
      "Number Of Stories",
      "Number Of Units",
      "Sales Price",
      "Sale Date",
      "Sales Document Number",
      "Tax Delinquent",
      "Tax Year",
      "Assessed Land Value",
      "Assessed Improve Percent",
      "Assessed Improvement Value",
      "Lot Area Acres",
      "Lot Area SQFT",
      "Parcel Number",
      "Year Built",
      "Cost Per Sq Ft",
      "Prior Sale Date",
      "Prior Sales Price",
      "Prior Sales Price Code",
      "Tax Exemption Code",
      "Owner Occupied",
      "Sales Price Code",
      "Site Carrier Route",
      "NOD",
      "NTS",
      "PHONE",
      "NOD_DOCTYPE",
      "NOD_DOCNUM",
      "NOD_CASE",
      "NOD_BEN",
      "NOD_TRNAME",
      "NOD_TRENAME",
      "NOD_TREPHONE",
      "NOD_TSNUM",
      "NOD_LOANDATE",
      "NOD_LOANDOC",
      "NOD_LOANAMO",
      "NOD_CONTACT",
      "NOD_ATT",
      "NOD_MAILADD",
      "NOD_LEGAL",
      "NTS_DOCTYPE",
      "NTS_AUCTION",
      "NTS_SALEDATE",
      "NTS_SALETIME",
      "NTS_MINBID",
      "NTS_LEGAL",
      "NTS_DOCNUM",
      "MARRIAGE",
      "BIRTH",
      "DIVORCE",
      "DEATH",
      "NOTES",
      "Years In Proper",
      "Phone 1",
      "Phone 2",
      "Phone 3",
      "Phone 4",
      "Phone 5",
      "Email 1",
      "Email 2",
      "Email 3",
      "Email 4",
      "Email 5",
      "Tract",
      "Lender Name",
      "First Loan",
      "Second Loan",
      "Loan Type",
      "Type Financing",
      "Mailing Carrier",
      "AVM",
      "LoanAmountDue",
      "LTV",
      "Rate",
      "Equity",
      "Whatsahomeworth"
    ],
  }

  static invalidFormData(formData) {
    const invalidInputs = [];

    formData = [...formData.entries()];
    const farmNameIndex = formData.findIndex((formInput) => formInput[0] === 'farm-name');
    const farmFileIndex = formData.findIndex((formInput) => formInput[0] === 'farm-file');
    const farmName = formData[farmNameIndex][1];
    const farmFile = formData[farmFileIndex][1];
    const farmFileType = Object.getPrototypeOf(farmFile).constructor.name;
    
    if (farmName.length === 0) {
      invalidInputs.push(formData[farmNameIndex][0]);
    }

    if (farmFileType !== 'File' || farmFile.size === 0) {
      invalidInputs.push(formData[farmFileIndex][0]);
    }
    
    return invalidInputs.length > 0 ? invalidInputs : null;
  }

  static validateHeaders(headers) {
    return new Promise(function (headers, resolve, reject) {
      
      let matchingHeader;
      
      for (let property in this.validHeaders) {
        if (JSON.stringify(headers) === JSON.stringify(this.validHeaders[property])) {
          matchingHeader = property;
        }
      }
      
      matchingHeader ? resolve(matchingHeader) : reject(new Error('Incorrect File Type'));
    }.bind(Validator, headers));
  }
}
