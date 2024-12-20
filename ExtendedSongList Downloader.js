// ==UserScript==
// @name         ExtendedSongList Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Downloads the ExtendedSongList JSON from localStorage
// @author       Problem02
// @match        https://*.animemusicquiz.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the DOM to be ready
    const observer = new MutationObserver(() => {
        const targetElement = document.getElementById('expandLibraryPage');
        if (targetElement && targetElement.className == 'gamePage') {
            addDownloadButton();
            observer.disconnect(); // Stop observing after finding the element
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function addDownloadButton() {
        // Avoid adding multiple buttons
        if (document.getElementById('downloadExtendedSongLibraryButton')) return;

        // Create the download button
        const downloadButton = document.createElement('button');
        downloadButton.id = 'downloadExtendedSongLibraryButton';
        downloadButton.textContent = "Download Extended Song Library";
        downloadButton.style.position = "fixed";
        downloadButton.style.top = "10px";
        downloadButton.style.right = "10px";
        downloadButton.style.zIndex = 1000;
        downloadButton.style.padding = "10px";
        downloadButton.style.backgroundColor = "#007BFF";
        downloadButton.style.color = "#FFFFFF";
        downloadButton.style.border = "none";
        downloadButton.style.cursor = "pointer";

        downloadButton.addEventListener('click', () => {
            try {
                const fileContent = localStorage.getItem('extendedSongList');
                if (!fileContent) {
                    alert('No data found in localStorage with the key "extendedSongLibrary".');
                    return;
                }

                const file = JSON.stringify(JSON.parse(fileContent), null, 2); // Pretty-print JSON
                const blob = new Blob([file], { type: 'application/json' });
                const url = URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = url;
                a.download = 'amq_stats.json';

                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Error during download:', error);
                alert('An error occurred during the download process. Check the console for details.');
            }
        });

        document.body.appendChild(downloadButton);
    }
})();