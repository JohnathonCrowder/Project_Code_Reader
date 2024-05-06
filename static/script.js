document.addEventListener('DOMContentLoaded', function() {
    var textbox = document.getElementById('textbox');
    var copyButton = document.getElementById('copyButton');
    var filePathList = document.getElementById('filePathList');
    var selectFileButton = document.getElementById('selectFileButton');
    var selectDirectoryButton = document.getElementById('selectDirectoryButton');
    var clearButton = document.getElementById('clearButton');
    var includeFileNameCheckbox = document.getElementById('includeFileNameCheckbox');

    copyButton.addEventListener('click', function() {
        textbox.select();
        document.execCommand('copy');
        alert('Text copied to clipboard!');
    });

    selectFileButton.addEventListener('click', function() {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt, .js, .py, .html, .css, .json';
        input.addEventListener('change', function(event) {
            var file = event.target.files[0];
            if (file && isValidFile(file)) {
                var fileName = file.name;
                var listItem = document.createElement('li');
                listItem.textContent = fileName;
                filePathList.appendChild(listItem);
    
                var reader = new FileReader();
                reader.onload = function(e) {
                    var fileContents = e.target.result;
                    var language = getLanguage(fileName);
                    var languageComment = getLanguageComment(language);
                    var fileInfo = '';
                    if (includeFileNameCheckbox.checked) {
                        fileInfo = fileName + ':\n\n' + languageComment + '\n\n' + fileContents;
                    } else {
                        fileInfo = fileContents;
                    }
                    appendToTextbox(fileInfo);
                };
                reader.readAsText(file);
            }
        });
        input.click();
    });

    selectDirectoryButton.addEventListener('click', function() {
        var input = document.createElement('input');
        input.type = 'file';
        input.webkitdirectory = true;
        input.directory = true;
        input.addEventListener('change', function(event) {
            var files = event.target.files;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                if (isValidFile(file)) {
                    var fileName = file.webkitRelativePath;
                    var listItem = document.createElement('li');
                    listItem.textContent = fileName;
                    filePathList.appendChild(listItem);

                    var reader = new FileReader();
                    reader.onload = (function(fileName) {
                        return function(e) {
                            var fileContents = e.target.result;
                            var language = getLanguage(fileName);
                            var languageComment = getLanguageComment(language);
                            var fileInfo = '';
                            if (includeFileNameCheckbox.checked) {
                                fileInfo = fileName + ':\n\n' + languageComment + '\n\n' + fileContents;
                            } else {
                                fileInfo = fileContents;
                            }
                            appendToTextbox(fileInfo);
                        };
                    })(fileName);
                    reader.readAsText(file);
                }
            }
        });
        input.click();
    });

    clearButton.addEventListener('click', function() {
        filePathList.innerHTML = '';
        textbox.value = '';
    });

    function isValidFile(file) {
        var validExtensions = ['.txt', '.js', '.py', '.html', '.css', '.json'];
        var fileName = file.name.toLowerCase();
        return validExtensions.some(function(extension) {
            return fileName.endsWith(extension);
        });
    }


    function appendToTextbox(fileInfo) {
        if (textbox.value !== '') {
            textbox.value += '\n\n';
        }
        textbox.value += fileInfo;
    }

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