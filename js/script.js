$(document).ready(function() {
    window.GoldenEye = {
        currentPage: null,
        licenseType: null,
        files: null,
        passwords: [
            'ge1',
            'ge2',
            'ge3',
            'ge4',
            'ge5',
            'ge6',
            'ge7'
        ],
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
                        default:
                            window.location.href = '404.html';
                            break;
                    }
                    break;
                case 'files':
                case '404':
                    window.location.href = 'index.html';
                    break;
            }
        },
        pageIndex: function () {
            $(document).keyup(function (e) {
                if (e.keyCode === 13)
                    window.GoldenEye.router(GoldenEye.currentPage);
            });
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
        pageFiles: function () {

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
        programCheck: function (programName) {
            programName = programName.toLowerCase();
            programName = programName.replace(/\s/g,'');
            if (programName === 'goldeneye' || programName === 'złoteoko' || programName === 'zloteoko') {
                $('input').toggleClass('program').toggleClass('password').val('');
                $('span').html('password');
            }
        },
        connect: function (satNumber) {
            $('.programPassword').hide();

            $('.satNumber').html(satNumber);

            var countDownFinal = new Date();
            countDownFinal.setSeconds(countDownFinal.getSeconds() + 3599);

            $('.countdownTimer').countdown(countDownFinal, function(event) {
                $(this).html(event.strftime('%M:%S'));
            });

            $('.countdown').show();
        },
        passwordCheck: function (password) {
            var satNumber = this.passwords.indexOf(password)+1;
            if (satNumber > -1) {
                this.connect(satNumber);
            }
        },
        page404: function () {
            $('.countdown').hide();
            var input = $('input');
            input.toggleClass('program');
            $(document).keyup(function (e) {
                if (e.keyCode === 13) {
                    if (input.hasClass('program'))
                        window.GoldenEye.programCheck($('.program').val());
                    else if ($('input').hasClass('password'))
                    window.GoldenEye.passwordCheck($('.password').val());
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
                        this.pageFiles();
                        break;
                    case '404':
                        this.page404();
                        break;
                    default:
                        this.pageIndex();
                        break;
                }
            });
        }
    };

    window.GoldenEye.init();
});