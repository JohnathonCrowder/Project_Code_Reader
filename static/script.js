document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    var textbox = document.getElementById('textbox');
    var copyButton = document.getElementById('copyButton');
    var filePathList = document.getElementById('filePathList');
    var selectFileButton = document.getElementById('selectFileButton');
    var selectDirectoryButton = document.getElementById('selectDirectoryButton');
    var clearButton = document.getElementById('clearButton');
    var includeFileNameCheckbox = document.getElementById('includeFileNameCheckbox');
    var darkModeCheckbox = document.getElementById('darkModeCheckbox');
    var exportButton = document.getElementById('exportButton');
    var helpButton = document.getElementById('helpButton');
    var helpModal = document.getElementById('helpModal');
    var closeButton = document.getElementsByClassName('close')[0];

    // Event listener for copy button
    copyButton.addEventListener('click', function() {
        textbox.select();
        document.execCommand('copy');
        alert('Text copied to clipboard!');
    });

    // Event listener for select file button
    selectFileButton.addEventListener('click', function() {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt, .js, .py, .html, .css, .json';
        input.addEventListener('change', handleFileSelect);
        input.click();
    });

    // Event listener for select directory button
    selectDirectoryButton.addEventListener('click', function() {
        var input = document.createElement('input');
        input.type = 'file';
        input.webkitdirectory = true;
        input.directory = true;
        input.addEventListener('change', handleDirectorySelect);
        input.click();
    });

    // Event listener for clear button
    clearButton.addEventListener('click', function() {
        filePathList.innerHTML = '';
        textbox.value = '';
    });

    // Event listener for dark mode checkbox
    darkModeCheckbox.addEventListener('change', function() {
        document.body.classList.toggle('dark-mode');
    });

    // Event listener for export button
    exportButton.addEventListener('click', function() {
        var textboxContent = textbox.value;
        var blob = new Blob([textboxContent], { type: 'text/plain' });
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download = 'exported_text.txt';
        link.click();
        URL.revokeObjectURL(url);
    });

    // Event listener for help button
    helpButton.addEventListener('click', function() {
        helpModal.style.display = 'block';
    });

    // Event listener for close button in the help modal
    closeButton.addEventListener('click', function() {
        helpModal.style.display = 'none';
    });

    // Event listener to close the help modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === helpModal) {
            helpModal.style.display = 'none';
        }
    });

    // Function to handle file selection
    function handleFileSelect(event) {
        var file = event.target.files[0];
        if (file && isValidFile(file)) {
            var fileName = file.name;
            addFilePathToList(fileName);
            readFileContents(file);
        }
    }

    // Function to handle directory selection
    function handleDirectorySelect(event) {
        var files = event.target.files;
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            if (isValidFile(file)) {
                var fileName = file.webkitRelativePath;
                addFilePathToList(fileName);
                readFileContents(file);
            }
        }
    }

    // Function to check if a file has a valid extension
    function isValidFile(file) {
        var validExtensions = ['.txt', '.js', '.py', '.html', '.css', '.json'];
        var fileName = file.name.toLowerCase();
        return validExtensions.some(function(extension) {
            return fileName.endsWith(extension);
        });
    }

    // Function to add file path to the list
    function addFilePathToList(fileName) {
        var listItem = document.createElement('li');
        listItem.textContent = fileName;
        filePathList.appendChild(listItem);
    }

    // Function to read file contents
    function readFileContents(file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var fileContents = e.target.result;
            var language = getLanguage(file.name);
            var languageComment = getLanguageComment(language);
            var fileInfo = '';
            if (includeFileNameCheckbox.checked) {
                fileInfo = file.name + ':\n\n' + languageComment + '\n\n' + fileContents;
            } else {
                fileInfo = fileContents;
            }
            appendToTextbox(fileInfo);
        };
        reader.readAsText(file);
    }

    // Function to append file contents to the textbox
    function appendToTextbox(fileInfo) {
        if (textbox.value !== '') {
            textbox.value += '\n\n\n\n\n\n\n\n\n';
        }
        textbox.value += fileInfo;
    }

    // Function to get the language based on file extension
    function getLanguage(fileName) {
        var extension = fileName.split('.').pop();
        switch (extension) {
            case 'txt':
                return 'plain text';
            case 'js':
                return 'JavaScript';
            case 'py':
                return 'Python';
            case 'html':
                return 'HTML';
            case 'css':
                return 'CSS';
            case 'json':
                return 'JSON';
            default:
                return 'unknown';
        }
    }

    // Function to get the language-specific comment
    function getLanguageComment(language) {
        switch (language) {
            case 'plain text':
                return '# This code is in plain text';
            case 'JavaScript':
                return '// This code is in JavaScript';
            case 'Python':
                return '# This code is in Python';
            case 'HTML':
                return '<!-- This code is in HTML -->';
            case 'CSS':
                return '/* This code is in CSS */';
            case 'JSON':
                return '// This code is in JSON';
            default:
                return '# This code is in an unknown language';
        }
    }
});