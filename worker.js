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
        sessionStorage: typeof self.sessionStorage !== 'undefined',

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
        permissions: typeof navigator.permissions !== 'undefined',

        // Additional properties
        ua: navigator.userAgent,
        data: self.platform,
        platform: self.platform,
        fontA: 'Not available in worker',
        fontB: 'Not available in worker',
        fontC: 'Not available in worker',
        canvas: 'Not available in worker',
        gpu: 'Not available in worker',
        hardware: `${navigator.hardwareConcurrency},${navigator.deviceMemory || 'unknown'}`,
        gb: 'Not available in worker',
        network: getNetworkInfo(),
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
        langs: navigator.languages.join(','),
        window: 'unknown',
        worker: '88783bd9', // This is a placeholder value
        code: 'unknown', // This needs to be implemented
        stack: getStackSize(),
        timing: performance.now(),
        bug: getBugInfo()
    };
}

// Helper functions

function getNetworkInfo() {
    if (navigator.connection) {
        return `${navigator.connection.effectiveType},${navigator.connection.rtt},${navigator.connection.downlink}`;
    }
    return 'unknown';
}

function getStackSize() {
    let i = 0;
    function recurse() {
        i++;
        recurse();
    }
    try {
        recurse();
    } catch (e) {
        return i;
    }
}

function getBugInfo() {
    // This is a placeholder. Implement actual bug checks here.
    return 'denied,denied';
}

self.onmessage = function(event) {
    if (event.data === 'getValues') {
        const workerValues = getValues();
        self.postMessage(workerValues);
    }
};