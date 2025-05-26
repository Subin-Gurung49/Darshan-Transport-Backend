document.addEventListener('DOMContentLoaded', () => {
    const apiBaseUrlInput = document.getElementById('apiBaseUrl');
    const fetchSeriesBtn = document.getElementById('fetchSeriesBtn');
    const seriesDropdown = document.getElementById('seriesDropdown');
    const seriesInput = document.getElementById('seriesInput');
    const invoiceInput = document.getElementById('invoiceInput');
    const checkStatusBtn = document.getElementById('checkStatusBtn');
    const responseArea = document.getElementById('responseArea');

    let currentApiBaseUrl = apiBaseUrlInput.value;

    apiBaseUrlInput.addEventListener('change', () => {
        currentApiBaseUrl = apiBaseUrlInput.value.trim();
        if (!currentApiBaseUrl.endsWith('/')) {
            currentApiBaseUrl += '/';
        }
        console.log("API Base URL set to:", currentApiBaseUrl);
    });
    
    // Initialize API base URL
    if (currentApiBaseUrl && !currentApiBaseUrl.endsWith('/')) {
        currentApiBaseUrl += '/';
    }


    fetchSeriesBtn.addEventListener('click', async () => {
        console.log("!!!!!!!!!! FETCH SERIES BUTTON CLICKED !!!!!!!!!! - If you see this, the click handler is working."); // <-- ADDED THIS LINE

        if (!currentApiBaseUrl) {
            responseArea.textContent = 'Error: Please set the Backend API Base URL first.';
            return;
        }
        responseArea.textContent = 'Fetching series...';
        try {
            const response = await fetch(`${currentApiBaseUrl}api/delivery/series`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Fetched series data:', data); // Log the whole data object

            seriesDropdown.innerHTML = '<option value="">-- Select a Series --</option>'; // Clear existing options
            if (data.success && data.data && Array.isArray(data.data)) {
                if (data.data.length === 0) {
                    responseArea.textContent = 'Series fetched, but no series are available in the data.';
                } else {
                    data.data.forEach((seriesObj, index) => {
                        console.log(`Processing series item at index ${index}: '${seriesObj}' (type: ${typeof seriesObj})`); // More detailed log
                        const option = document.createElement('option');
                        
                        let seriesValue = '';
                        if (typeof seriesObj === 'string') {
                            seriesValue = seriesObj;
                            console.log(`  Item is a string. seriesValue determined to be: '${seriesValue}'`);
                        } else if (seriesObj && typeof seriesObj.SERIES === 'string') { 
                            seriesValue = seriesObj.SERIES;
                            console.log(`  Item is an object with SERIES property. seriesValue determined to be: '${seriesValue}'`);
                        } else if (seriesObj && Object.keys(seriesObj).length > 0) {
                            const firstKey = Object.keys(seriesObj)[0];
                            seriesValue = String(seriesObj[firstKey]); 
                            console.warn(`  Property 'SERIES' not found in series item. Using first property '${firstKey}'. seriesValue determined to be: '${seriesValue}'`);
                        } else {
                            console.warn(`  Item is not a string, not an object with SERIES, and not a non-empty object. Item:`, seriesObj);
                        }

                        if (seriesValue) {
                            option.value = seriesValue;
                            option.textContent = seriesValue;
                            console.log(`  Created option: value='${option.value}', textContent='${option.textContent}'`);
                            try {
                                seriesDropdown.appendChild(option);
                                console.log(`  Successfully appended option. seriesDropdown.options.length is now: ${seriesDropdown.options.length}`);
                            } catch (e) {
                                console.error('  Error appending child:', e);
                            }
                        } else {
                            console.warn('  Could not determine a valid seriesValue for item (it was empty or not set):', seriesObj);
                        }
                    });

                    if (seriesDropdown.options.length > 1) { 
                        responseArea.textContent = 'Series fetched successfully. Select one from the dropdown.';
                    } else {
                        responseArea.textContent = 'Series data processed, but no valid series found to display in dropdown (dropdown empty or only has placeholder).';
                        console.log(`Final check: seriesDropdown.options.length is ${seriesDropdown.options.length}`);
                    }
                }
            } else {
                responseArea.textContent = `Error fetching series: ${data.message || 'No series data found, data format is incorrect, or data.data is not an array.'}`;
                console.error('Problem with fetched data structure:', data);
            }
        } catch (error) {
            console.error('Error fetching series:', error);
            responseArea.textContent = `Error fetching series: ${error.message}`;
        }
    });

    seriesDropdown.addEventListener('change', () => {
        if (seriesDropdown.value) {
            seriesInput.value = seriesDropdown.value;
        }
    });

    checkStatusBtn.addEventListener('click', async () => {
        const series = seriesInput.value.trim();
        const invoice = invoiceInput.value.trim();

        if (!currentApiBaseUrl) {
            responseArea.textContent = 'Error: Please set the Backend API Base URL first.';
            return;
        }
        if (!series || !invoice) {
            responseArea.textContent = 'Error: Please enter both Series and Invoice Number.';
            return;
        }

        responseArea.textContent = 'Checking delivery status...';
        try {
            const response = await fetch(`${currentApiBaseUrl}api/delivery/status/${encodeURIComponent(series)}/${encodeURIComponent(invoice)}`);
            const data = await response.json(); // Try to parse JSON regardless of response.ok for more info

            if (!response.ok) {
                 responseArea.textContent = `Error: ${response.status} ${response.statusText}\n${JSON.stringify(data, null, 2)}`;
                return;
            }
            
            responseArea.textContent = JSON.stringify(data, null, 2);

        } catch (error) {
            console.error('Error checking status:', error);
            responseArea.textContent = `Error checking status: ${error.message}`;
        }
    });
});
