import { getToken } from "src/auth/utils";
import localStorageAvailable from "src/utils/localStorageAvailable";
import { appLink, directory, version } from "src/utils/varibles";
import * as XLSX from 'xlsx';

const downloadExcel = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};


const extractDatesFromQuery = (query) => {
  // Expected format: analytics/branches/startDate/endDate or analytics/property/id/startDate/endDate
  const parts = query.split('/');
  if (parts.includes('property')) {
    return {
      startDate: parts[parts.length - 2],
      endDate: parts[parts.length - 1]
    };
  }
  return {
    startDate: parts[parts.length - 2],
    endDate: parts[parts.length - 1]
  };
};
// CSV parsing function - add this at the top of your file or in a utils file
function parseCSV(csvText) {
  const lines = [];
  const rows = csvText.split('\n');
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i].trim();
    if (row === '') continue;
    
    const fields = [];
    let field = '';
    let inQuotes = false;
    let j = 0;
    
    while (j < row.length) {
      const char = row[j];
      
      if (char === '"') {
        if (inQuotes && row[j + 1] === '"') {
          // Escaped quote
          field += '"';
          j += 2;
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
          j++;
        }
      } else if (char === ',' && !inQuotes) {
        // Field separator
        fields.push(field.trim());
        field = '';
        j++;
      } else {
        field += char;
        j++;
      }
    }
    
    // Add the last field
    fields.push(field.trim());
    lines.push(fields);
  }
  
  return lines;
}

const get = async (query, id, enqueueSnackbar) => {
  const storageAvailable = localStorageAvailable();
  const accessToken = storageAvailable ? getToken() : '';
 
  const requestOptions = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
  };
  
  const apiUrl = id != null
    ? `${appLink}/${directory}/${version}/${query}/${id}`
    : `${appLink}/${directory}/${version}/${query}`;
    
  try {
    const response = await fetch(apiUrl, requestOptions);
   
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
   
    const csvText = await response.text();
   
    // Replace the problematic CSV parsing with the proper parseCSV function
    const data = parseCSV(csvText);
   
    // Validate that we have data
    if (!data || data.length === 0) {
      throw new Error('No data found in the CSV response');
    }
   
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    
    // Optional: Set column widths for better formatting
    const colWidths = data[0]?.map(() => ({ wch: 15 })) || [];
    worksheet['!cols'] = colWidths;
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
   
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });
   
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
   
    const { startDate, endDate } = extractDatesFromQuery(query);
    const filename = `Report_${startDate}_to_${endDate}.xlsx`;
   
    downloadExcel(blob, filename);
   
    return { api: "SUCCESS", data: "File downloaded successfully" };
   
  } catch (error) {
    console.error('Error:', error);
   
    if (enqueueSnackbar) {
      enqueueSnackbar(error.message || 'An error occurred while downloading the file', {
        variant: 'error'
      });
    }
   
    return { api: "FAILED", error: error.message };
  }
};

const getCSV = async (query, id, enqueueSnackbar) => {
  const storageAvailable = localStorageAvailable();
  const accessToken = storageAvailable ? getToken() : '';
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${accessToken}`);
  
  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };

  const apiUrl = id != null
    ? `${appLink}/${directory}/${version}/${query}/${id}`
    : `${appLink}/${directory}/${version}/${query}`;

  try {
    const response = await fetch(apiUrl, requestOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    
    const blob = new Blob(["\ufeff" + text], { 
      type: 'text/csv;charset=utf-8;' 
    });
    
    const today = formatDate(new Date());
    const { startDate, endDate } = extractDatesFromQuery(query);
    const filename = `Info from ${startDate} to ${endDate}.csv`;

    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);

    return { api: "SUCCESS", data: "File downloaded successfully" };
    
  } catch (error) {
    console.error('Error downloading CSV:', error);
    
    if (enqueueSnackbar) {
      enqueueSnackbar('An error occurred while downloading the file', { 
        variant: 'error' 
      });
    }
    
    return { api: "FAILED", error: error.message };
  }
};


export async function getBranchAnalytics (startDate, endDate, setIsLoading, enqueueSnackbar) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 99000000);

  try {
    setIsLoading(true);
    const link = `analytics/branches/${startDate}/${endDate}`;
    
    await Promise.race([
      getCSV(link, null, enqueueSnackbar),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), 99000000)
      )
    ]);

    setIsLoading(false);
    enqueueSnackbar('File downloaded successfully', { variant: 'success' });
  } catch (error) {
    let errorMessage = 'Failed to fetch branch analytics';
    
    if (error.name === 'AbortError' || error.message === 'Request timeout') {
      errorMessage = 'Request timed out. Please try again.';
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    enqueueSnackbar(errorMessage, { variant: 'error' });
  } finally {
    clearTimeout(timeoutId);
    setIsLoading(false);
  }
};

export async function getOneBranchAnalytics (startDate, endDate, selectedProperty, setIsLoading, enqueueSnackbar) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 99000000);

  try {
    setIsLoading(true);
    
    if (!selectedProperty) {
      throw new Error('No property selected');
    }

    const link = `analytics/property/${selectedProperty}/${startDate}/${endDate}`;
    
    await Promise.race([
      get(link, null, enqueueSnackbar),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), 99000000)
      )
    ]);

    setIsLoading(false);
    enqueueSnackbar('File downloaded successfully', { variant: 'success' });
  } catch (error) {
    console.error(error);
    let errorMessage = 'Failed to fetch property analytics';
    
    if (!selectedProperty) {
      errorMessage = 'Please select a property first';
    } else if (error.name === 'AbortError' || error.message === 'Request timeout') {
      errorMessage = 'Request timed out. Please try again.';
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    enqueueSnackbar(errorMessage, { variant: 'error' });
  } finally {
    clearTimeout(timeoutId);
    setIsLoading(false);
  }
};

