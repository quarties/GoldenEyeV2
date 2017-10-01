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
        router: function (currentPage, success, satNumber) {

            success = success || false;
            satNumber = satNumber || null;

            if (success===true) {
                switch (currentPage) {
                    case '404':
                        window.location.href = 'single-sat.html?satNumber='+satNumber;
                        break;
                }
            } else {
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

                $('.fileContent').html(fileName+'<br>'+fileContent).show();
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
            //countDownFinal.setHours(countDownFinal.getHours() + 1);
            countDownFinal.setSeconds(countDownFinal.getSeconds() + 5);

            $('.countdownTimer').countdown(countDownFinal, function(event) {
                var totalMinutes = event.offset.hours * 60 + event.offset.minutes;
                $(this).html(event.strftime(totalMinutes + ':%S'));
            }).on('finish.countdown', function () {
                GoldenEye.router(GoldenEye.currentPage, true, satNumber);
            });

            $('.countdown').show();
        },
        passwordCheck: function (password) {
            var satNumber = this.passwords.indexOf(password)+1;
            if (satNumber > 0) {
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
        satStatus: function (callback) {
            $.getJSON("satStatus.json", callback);
        },
        getSatProgress: function (satNumber, callback) {
            this.satStatus(function (json) {
                satNumber -= 1;
                var start = json[satNumber]['time']['start'];
                var end = json[satNumber]['time']['end'];
                var now = parseInt(new Date().getTime() / 1000);
                var progress = Math.round((now-start)/(end-start)*100);
                callback(progress);
            })
        },
        getSatStatus: function (satNumber, callback) {
            this.satStatus(function (json) {
                satNumber -= 1;
                var satStatus = {
                    "status": json[satNumber]['status'],
                    "progress": ""
                };
                var start = json[satNumber]['time']['start'];
                var end = json[satNumber]['time']['end'];
                if (start && end) {
                    var now = parseInt(new Date().getTime() / 1000);
                    var progress = Math.round((now-start)/(end-start)*100);
                    satStatus.progress = ' '+progress+'%';
                }
                callback(satStatus);
            });
        },
        showSatStatus: function () {
            $("body").append('<div class="satStatus"></div>');

            var satNumber;
            var satStatusElement = $(".satStatus");

            this.satStatus(function (json) {
                satStatusElement.html('');
                for (var i in json) {
                    satNumber = parseInt(i)+1;
                    var satStatus = {
                        "status": json[i]['status'],
                        "progress": ""
                    };
                    var start = json[i]['time']['start'];
                    var end = json[i]['time']['end'];
                    if (start && end) {
                        var now = parseInt(new Date().getTime() / 1000);
                        var progress = Math.round((now-start)/(end-start)*100);
                        satStatus.progress = ' '+progress+'%';
                    }
                    satStatusElement.append('<p>Sat #'+satNumber+': '+satStatus['status']+satStatus['progress']+'</p>');
                }
            });

            setInterval(function() {
                GoldenEye.satStatus(function (json) {
                    satStatusElement.html('');
                    for (var i in json) {
                        satNumber = parseInt(i) + 1;
                        var satStatus = {
                            "status": json[i]['status'],
                            "progress": ""
                        };
                        var start = json[i]['time']['start'];
                        var end = json[i]['time']['end'];
                        if (start && end) {
                            var now = parseInt(new Date().getTime() / 1000);
                            var progress = Math.round((now - start) / (end - start) * 100);
                            satStatus.progress = ' ' + progress + '%';
                        }
                        satStatusElement.append('<p>Sat #' + satNumber + ': ' + satStatus['status'] + satStatus['progress'] + '</p>');
                    }
                });
            }, 1000);
        },
        satPage: function (satNumber, single) {
            single = single || true;

            this.showSatStatus();

            if (single === true) {
                $('.satNumber').html(satNumber);
                this.getSatStatus(satNumber, function (data) {
                    var satFunction = $('.satFunction');
                    if (data.progress)
                        satFunction.html(data.status + data.progress);
                    else
                        satFunction.html(data.status);
                });
                setInterval(function() {
                    GoldenEye.getSatStatus(satNumber, function (data) {
                        var satFunction = $('.satFunction');
                        if (data.progress)
                            satFunction.html(data.status + data.progress);
                        else
                            satFunction.html(data.status);
                    });
                }, 1000);
            }
        },
        init: function () {

            this.getLicense(function (data) {

                var $_GET = {};
                if(document.location.toString().indexOf('?') !== -1) {
                    var query = document.location
                        .toString()
                        .replace(/^.*?\?/, '')
                        .replace(/#.*$/, '')
                        .split('&');

                    for(var i=0, l=query.length; i<l; i++) {
                        var aux = decodeURIComponent(query[i]).split('=');
                        $_GET[aux[0]] = aux[1];
                    }
                }

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
                    case 'single-sat':
                        this.satPage($_GET['satNumber']);
                        break;
                    case 'multiple-sat':
                        this.satPage(0, false);
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