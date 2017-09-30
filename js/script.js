$(document).ready(function() {
    window.GoldenEye = {
        currentPage: null,
        licenseType: null,
        files: null,
        author: "Kurtz Korinokabe Software Combinat",
        version: "v. 2-QRT-20-18-DEV",
        getCurrentFileName: function (){
            var pagePathName = window.location.pathname;
            var filename = pagePathName.replace(/^.*[\\\/]/, '');
            filename = filename.substr(0, filename.lastIndexOf('.')) || filename;
            return filename;
        },
        getLicense: function (callback) {
            $.ajax({
                context: this,
                type: "POST",
                url: "getLicense.php",
                success: callback
            });
        },
        router: function (currentPage) {
            switch (currentPage) {
                case 'index':
                case '':
                    switch (this.licenseType) {
                        case 'files':
                            window.location.href = 'files.html';
                            break;
                        case 'bond':
                            window.location.href = 'bond.html';
                            break;
                        case 'normal':
                            window.location.href = 'normal.html';
                            break;
                    }
                    break;
                case 'files':
                    window.location.href = 'index.html';
                    break;
            }
        },
        getFileContent: function (fileName, callback) {
            $.ajax({
                context: this,
                type: "POST",
                data: {
                    fileName: fileName
                },
                url: "getFile.php",
                success: callback
            });
        },
        openFile: function (fileName) {
            var fileContent = null;
            this.getFileContent(fileName, function (data) {
                fileContent = data;

                $('.fileContent').html(fileName+'<br>'+fileContent);

                $('.fileContent').show();
            });
        },
        filesPage: function () {

            $('.fileContent').hide();

            this.files.forEach(function (item) {
                $(".files").append('<li class="file">'+item+'</li>');
            });

            $(document).keyup(function (e) {

                if(e.keyCode > 47 && e.keyCode < 58) {

                    $('.fileContent').hide();

                    var key;

                    if (e.key > 0 && e.key < 10)
                        key = e.key - 1;
                    else if (e.key === 0)
                        key = 9;
                    else key = null;

                    GoldenEye.openFile(GoldenEye.files[key]);
                } else if (e.keyCode === 27) {
                    GoldenEye.router(GoldenEye.currentPage);
                }

            });
        },
        init: function () {
            this.getLicense(function (data) {

                $("body").append("<div class=\"version\"><p>"+this.author+"</p><p>"+this.version+"</p>");

                this.currentPage = this.getCurrentFileName();
                this.licenseType = data.license;
                if (this.licenseType === 'files') this.files = data.files;

                switch (this.currentPage) {
                    case 'files':
                        this.filesPage();
                        break;
                }

                $(document).keyup(function (e) {
                    if (e.keyCode === 13)
                        window.GoldenEye.router(GoldenEye.currentPage);
                });
            });
        }
    };

    window.GoldenEye.init();
});