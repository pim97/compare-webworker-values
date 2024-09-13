# Browser Environment Comparison

This project provides a simple web application that compares various browser environment properties between the main thread and a Web Worker. It helps developers understand the differences and similarities in the execution contexts of these two environments. Could be useful for detecting legit traffic.

## Features

- Compares over 25 browser environment properties
- Displays results in an easy-to-read table format
- Highlights inconsistencies between main thread and Web Worker
- Includes properties from Navigator, Screen, Date, Performance, and more

## How it works

1. The main script (`script.js`) collects environment data from the main thread.
2. A Web Worker (`worker.js`) is created to collect the same data in its context.
3. The results are compared and displayed in a table, with inconsistencies highlighted.

## Usage

1. Clone the repository
2. Open `index.html` in a web browser
3. The comparison results will be displayed automatically

## Code Structure

- `index.html`: The main HTML file that sets up the page structure and styling

```1:30:index.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Browser Environment Comparison</title>
    <style>
        table {
            border-collapse: collapse;
            width: 100%;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .inconsistent {
            background-color: #ffcccc;
        }
    </style>
</head>
<body>
    <h1>Browser Environment Comparison</h1>
    <div id="result">Comparing values...</div>
    <script src="script.js"></script>
</body>
</html>
```


- `script.js`: The main JavaScript file that runs in the main thread

```1:91:script.js
function getValues() {
    return {
        // Navigator properties
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        hardwareConcurrency: navigator.hardwareConcurrency,
        language: navigator.language,
        languages: navigator.languages,
        onLine: navigator.onLine,
        cookieEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack,
        deviceMemory: navigator.deviceMemory || 'Not available',
        maxTouchPoints: navigator.maxTouchPoints,
        pdfViewerEnabled: navigator.pdfViewerEnabled,
        webdriver: navigator.webdriver,

        // Screen properties (may not be available in all workers)
        screenWidth: self.screen ? self.screen.width : 'Not available',
        screenHeight: self.screen ? self.screen.height : 'Not available',
        screenColorDepth: self.screen ? self.screen.colorDepth : 'Not available',
        screenPixelDepth: self.screen ? self.screen.pixelDepth : 'Not available',

        // Date and time
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        dateLocale: new Date().toLocaleString(),

        // Performance
        timeOrigin: performance.timeOrigin,

        // Other global objects
        indexedDB: typeof indexedDB !== 'undefined',
        webkitIndexedDB: typeof self.webkitIndexedDB !== 'undefined',
        localStorage: typeof self.localStorage !== 'undefined',
        sessionStorage: typeof self.sessionStorage !== 'undefined'
        // Feature detection
        serviceWorker: 'serviceWorker' in navigator,
        webGL: typeof self.WebGLRenderingContext !== 'undefined',
        webGL2: typeof self.WebGL2RenderingContext !== 'undefined',
        worker: typeof self.Worker !== 'undefined',
        sharedWorker: typeof self.SharedWorker !== 'undefined',
        
        // Crypto
        crypto: typeof self.crypto !== 'undefined',
        subtle: typeof self.crypto !== 'undefined' && typeof self.crypto.subtle !== 'undefined',

        // Network information (if available)
        connection: navigator.connection ? {
            effectiveType: navigator.connection.effectiveType,
            rtt: navigator.connection.rtt,
            downlink: navigator.connection.downlink,
            saveData: navigator.connection.saveData
        } : 'Not available',

        // Permissions API (if available)
        permissions: typeof navigator.permissions !== 'undefined'
    };
}
const mainValues = getValues();

const worker = new Worker('worker.js');

worker.onmessage = function(event) {
    const workerValues = event.data;
    displayComparison(mainValues, workerValues);
};

function displayComparison(main, worker) {
    const resultElement = document.getElementById('result');
    let output = '<table>';
    output += '<tr><th>Property</th><th>Main Thread</th><th>Web Worker</th><th>Consistent</th></tr>';

    for (const key in main) {
        const mainValue = JSON.stringify(main[key]);
        const workerValue = JSON.stringify(worker[key]);
        const isConsistent = mainValue === workerValue;

        output += `<tr class="${isConsistent ? '' : 'inconsistent'}">`;
        output += `<td>${key}</td>`;
        output += `<td>${mainValue}</td>`;
        output += `<td>${workerValue}</td>`;
        output += `<td>${isConsistent ? 'Yes' : 'No'}</td>`;
        output += '</tr>';
    }

    output += '</table>';
    resultElement.innerHTML = output;
}

worker.postMessage('getValues');
```


- `worker.js`: The Web Worker script that runs in a separate thread

```1:65:worker.js
function getValues() {
    return {
        // Navigator properties
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        hardwareConcurrency: navigator.hardwareConcurrency,
        language: navigator.language,
        languages: navigator.languages,
        onLine: navigator.onLine,
        cookieEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack,
        deviceMemory: navigator.deviceMemory || 'Not available',
        maxTouchPoints: navigator.maxTouchPoints,
        pdfViewerEnabled: navigator.pdfViewerEnabled,
        webdriver: navigator.webdriver,

        // Screen properties (may not be available in all workers)
        screenWidth: self.screen ? self.screen.width : 'Not available',
        screenHeight: self.screen ? self.screen.height : 'Not available',
        screenColorDepth: self.screen ? self.screen.colorDepth : 'Not available',
        screenPixelDepth: self.screen ? self.screen.pixelDepth : 'Not available',

        // Date and time
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        dateLocale: new Date().toLocaleString(),

        // Performance
        timeOrigin: performance.timeOrigin,

        // Other global objects
        indexedDB: typeof indexedDB !== 'undefined',
        webkitIndexedDB: typeof self.webkitIndexedDB !== 'undefined',
        localStorage: typeof self.localStorage !== 'undefined',
        sessionStorage: typeof self.sessionStorage !== 'undefined'
        // Feature detection
        serviceWorker: 'serviceWorker' in navigator,
        webGL: typeof self.WebGLRenderingContext !== 'undefined',
        webGL2: typeof self.WebGL2RenderingContext !== 'undefined',
        worker: typeof self.Worker !== 'undefined',
        sharedWorker: typeof self.SharedWorker !== 'undefined',
        
        // Crypto
        crypto: typeof self.crypto !== 'undefined',
        subtle: typeof self.crypto !== 'undefined' && typeof self.crypto.subtle !== 'undefined',

        // Network information (if available)
        connection: navigator.connection ? {
            effectiveType: navigator.connection.effectiveType,
            rtt: navigator.connection.rtt,
            downlink: navigator.connection.downlink,
            saveData: navigator.connection.saveData
        } : 'Not available',

        // Permissions API (if available)
        permissions: typeof navigator.permissions !== 'undefined'
    };
}
self.onmessage = function(event) {
    if (event.data === 'getValues') {
        const workerValues = getValues();
        self.postMessage(workerValues);
    }
};
```


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).