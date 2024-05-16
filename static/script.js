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
    var settingsButton = document.getElementById('settingsButton');
    var settingsModal = document.getElementById('settingsModal');
    var fileTypeCheckboxes = document.getElementsByClassName('fileTypeCheckbox');
    var settingsButton = document.getElementById('settingsButton');
    var settingsModal = document.getElementById('settingsModal');
    var settingsCloseButton = settingsModal.getElementsByClassName('close')[0];
    var fileTypeCheckboxes = document.getElementsByClassName('fileTypeCheckbox');

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

    // Event listener for settings button
    settingsButton.addEventListener('click', function() {
        settingsModal.style.display = 'block';
    });

    // Event listener for close button in the settings modal
    settingsCloseButton.addEventListener('click', function() {
        settingsModal.style.display = 'none';
    });

    // Event listener to close the settings modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
    });

    // Get the select all and unselect all buttons
    var selectAllButton = document.getElementById('selectAllButton');
    var unselectAllButton = document.getElementById('unselectAllButton');

    // Event listener for the select all button
    selectAllButton.addEventListener('click', function() {
        for (var i = 0; i < fileTypeCheckboxes.length; i++) {
            fileTypeCheckboxes[i].checked = true;
        }
    });

    // Event listener for the unselect all button
    unselectAllButton.addEventListener('click', function() {
        for (var i = 0; i < fileTypeCheckboxes.length; i++) {
            fileTypeCheckboxes[i].checked = false;
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

    // Function to get the selected file types from the settings
    function getSelectedFileTypes() {
        var selectedTypes = [];
        for (var i = 0; i < fileTypeCheckboxes.length; i++) {
            if (fileTypeCheckboxes[i].checked) {
                selectedTypes.push(fileTypeCheckboxes[i].value);
            }
        }
        return selectedTypes;
    }

    // Update the isValidFile function to use the selected file types
    function isValidFile(file) {
        var selectedTypes = getSelectedFileTypes();
        var fileName = file.name.toLowerCase();
        return selectedTypes.some(function(extension) {
            return fileName.endsWith(extension);
        });
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
            case 'ts':
                return 'TypeScript';
            case 'tsx':
                return 'TSX';
            case 'html':
                return 'HTML';
            case 'css':
                return 'CSS';
            case 'json':
                return 'JSON';
            case 'java':
                return 'Java';
            case 'cpp':
                return 'C++';
            case 'cs':
                return 'C#';
            case 'php':
                return 'PHP';
            case 'rb':
                return 'Ruby';
            case 'swift':
                return 'Swift';
            case 'go':
                return 'Go';
            case 'kt':
                return 'Kotlin';
            case 'rs':
                return 'Rust';
            case 'xml':
                return 'XML';
            case 'sql':
                return 'SQL';
            case 'md':
                return 'Markdown';
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
            case 'TypeScript':
                return '// This code is in TypeScript';
            case 'TSX':
                return '// This code is in TSX';
            case 'HTML':
                return '<!-- This code is in HTML -->';
            case 'CSS':
                return '/* This code is in CSS */';
            case 'JSON':
                return '// This code is in JSON';
            case 'Java':
                return '// This code is in Java';
            case 'C++':
                return '// This code is in C++';
            case 'C#':
                return '// This code is in C#';
            case 'PHP':
                return '// This code is in PHP';
            case 'Ruby':
                return '# This code is in Ruby';
            case 'Swift':
                return '// This code is in Swift';
            case 'Go':
                return '// This code is in Go';
            case 'Kotlin':
                return '// This code is in Kotlin';
            case 'Rust':
                return '// This code is in Rust';
            case 'XML':
                return '<!-- This code is in XML -->';
            case 'SQL':
                return '-- This code is in SQL';
            case 'Markdown':
                return '<!-- This code is in Markdown -->';
            default:
                return '# This code is in an unknown language';
        }
    }
});