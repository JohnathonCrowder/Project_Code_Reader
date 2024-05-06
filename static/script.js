document.addEventListener('DOMContentLoaded', function() {
    var textbox = document.getElementById('textbox');
    var copyButton = document.getElementById('copyButton');
    var filePathList = document.getElementById('filePathList');
    var selectFileButton = document.getElementById('selectFileButton');
    var includeFileNameCheckbox = document.getElementById('includeFileNameCheckbox');

    copyButton.addEventListener('click', function() {
        textbox.select();
        document.execCommand('copy');
        alert('Text copied to clipboard!');
    });

    selectFileButton.addEventListener('click', function() {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt, .js, .py, .html, .css, .json'; // Specify accepted file types
        input.addEventListener('change', function(event) {
            var file = event.target.files[0];
            var fileName = file.name;
            var listItem = document.createElement('li');
            listItem.textContent = fileName;
            filePathList.appendChild(listItem);

            var reader = new FileReader();
            reader.onload = function(e) {
                var fileContents = e.target.result;
                var language = getLanguage(fileName);
                if (includeFileNameCheckbox.checked) {
                    textbox.value = fileName + ':\n\n' + 'This code is in ' + language + '\n\n' + fileContents;
                } else {
                    textbox.value = fileContents;
                }
            };
            reader.readAsText(file);
        });
        input.click();
    });

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
});