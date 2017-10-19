$(document).ready(function() {
    window.GoldenEye = {
        debug: true,
        currentPage: null,
        currentFunction: null,
        licenseType: null,
        minCondition: 4,
        files: null,
        refreshTime: 500,
        passwords: [
            'ge1',
            'ge2',
            'ge3',
            'ge4',
            'ge5',
            'ge6',
            'ge7'
        ],
        passwordAll: 'all',
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
            if (GoldenEye.debug) {
                countDownFinal.setSeconds(countDownFinal.getSeconds() + 5);
            } else {
                countDownFinal.setHours(countDownFinal.getHours() + 1);
            }

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
            $.get("getSatStatus.php", callback);
        },
        /*getSatProgress: function (satNumber, callback) {
            this.satStatus(function (data) {
                satNumber -= 1;
                var start = data[satNumber]['start'];
                var end = data[satNumber]['end'];
                var now = parseInt(new Date().getTime() / 1000);
                var progress = Math.round((now-start)/(end-start)*100);
                callback(progress);
            })
        },*/
        getSatStatus: function (satNumber, callback) {
            this.satStatus(function (data) {
                satNumber -= 1;
                var satStatus = {
                    "status": data[satNumber]['status'],
                    "progress": "",
                    "location": ""
                };
                var start = data[satNumber]['start'];
                var end = data[satNumber]['end'];
                if (start && end) {
                    var now = Math.round(new Date().getTime() / 1000);
                    var progress = Math.round((now-start)/(end-start)*100);
                    satStatus.progress = ' '+progress+'%';
                }
                var location = data[satNumber]['location'];
                if (location) {
                    satStatus.location = ' '+location;
                }
                callback(satStatus);
            });
        },
        checkCondition: function (func, callback) {
            var satCount = 0,
                iteration = 0;
            GoldenEye.satStatus(function (data) {
                $.each(data, function (parentKey) {
                    $.each(data[parentKey], function (key, value) {
                        if (key === 'status' && value === func) {
                            satCount++;
                        }
                    });
                    iteration++;
                    if (iteration === 7) {
                        callback(satCount);
                    }
                });
            });
        },
        updateSatStatus: function (satNumber, status, callback) {
            satNumber -= 1;
            this.satStatus(function (data) {
                data[satNumber]['status'] = status;
                data[satNumber]['start'] = data[satNumber]['end'] = '';
                $.ajax({
                    context: this,
                    type: "POST",
                    data: {data:data},
                    url: "updateSatStatus.php",
                    complete: callback
                })
            });
        },
        updateSatStatusTime: function (satNumber, status, tillEnd, location) {
            location = location || null;
            satNumber -= 1;
            var callbackSend = false;
            this.satStatus(function (data) {
                data[satNumber]['status'] = status;
                var now = new Date(),
                    nowStamp = Math.round(now.getTime() / 1000),
                    end;
                data[satNumber]['start'] = nowStamp;
                if (tillEnd) {
                    if (GoldenEye.debug) {
                        end = Math.round(new Date(2017, 9, 21).getTime() / 1000);
                    } else {
                        end = new Math.round(Date(2017, 10, 29).getTime() / 1000);
                    }
                    var iteration = 0;
                    data[satNumber]['end'] = end;
                    data[satNumber]['location'] = location;
                    callbackSend = true;
                    $.each(data, function (index) {
                        iteration++;
                        if (data[index]['status'] === status) {
                            data[index]['start'] = nowStamp;
                            data[index]['end'] = end;
                            data[index]['location'] = location;
                        }
                        if (iteration > 6) {
                            $.ajax({
                                context: this,
                                type: "POST",
                                data: {data: data},
                                url: "updateSatStatus.php"
                            });
                        }
                    });
                } else {
                    if (GoldenEye.debug) {
                        end = Math.round(now.setMinutes(now.getMinutes() + 5) / 1000);
                    } else {
                        end = Math.round(now.setHours(now.getHours() + 5) / 1000);
                    }
                    data[satNumber]['end'] = end;
                }

                if(!callbackSend) {
                    $.ajax({
                        context: this,
                        type: "POST",
                        data: {data: data},
                        url: "updateSatStatus.php"
                    });
                }
            });
        },
        updateSatStatusLocation: function (satNumber, status, location) {
            satNumber -= 1;
            this.satStatus(function (data) {
                data[satNumber]['status'] = status;
                data[satNumber]['location'] = location;
                $.ajax({
                    context: this,
                    type: "POST",
                    data: {data:data},
                    url: "updateSatStatus.php"
                })
            });
        },
        showSatStatus: function () {
            $("body").append('<div class="satStatus"></div>');

            var satNumber;
            var satStatusElement = $(".satStatus");

            this.satStatus(function (data) {
                satStatusElement.html('');
                for (var i in data) {
                    satNumber = parseInt(i)+1;
                    var satStatus = {
                        "status": data[i]['status'],
                        "progress": "",
                        "location": ""
                    };
                    var start = data[i]['start'];
                    var end = data[i]['end'];
                    if (start && end) {
                        var now = Math.round(new Date().getTime() / 1000);
                        var progress = Math.round((now-start)/(end-start)*100);
                        if (now >= end) {
                            GoldenEye.updateSatStatus(satNumber, 'destroyed');
                        } else
                            satStatus.progress = ' '+progress+'%';
                    }
                    var location = data[i]['location'];
                    if (location) {
                        satStatus.location = ' '+location;
                    }
                    satStatusElement.append('<p>Sat #' + satNumber + ': ' + satStatus.status + satStatus.progress + satStatus.location + '</p>');
                }
            });

            setInterval(function() {
                GoldenEye.satStatus(function (data) {
                    satStatusElement.html('');
                    for (var i in data) {
                        satNumber = parseInt(i) + 1;
                        var satStatus = {
                            "status": data[i]['status'],
                            "progress": "",
                            "location": ""
                        };
                        var start = data[i]['start'];
                        var end = data[i]['end'];
                        if (start && end) {
                            var now = Math.round(new Date().getTime() / 1000);
                            var progress = Math.round((now - start) / (end - start) * 100);
                            if (now >= end) {
                                GoldenEye.updateSatStatus(satNumber, 'destroyed');
                            } else
                                satStatus.progress = ' '+progress+'%';
                        }
                        var location = data[i]['location'];
                        if (location) {
                            satStatus.location = ' '+location;
                        }
                        satStatusElement.append('<p>Sat #' + satNumber + ': ' + satStatus.status + satStatus.progress + satStatus.location + '</p>');
                    }
                });
            }, GoldenEye.refreshTime);
        },
        updateSatFunction: function (func, satNumber, location, conditionCheck) {
            location = location || null;
            conditionCheck = conditionCheck || null;
            $('.satFunctions').hide();
            GoldenEye.currentFunction = func;
            switch (func) {
                case 'spy':
                case 'energy':
                    GoldenEye.updateSatStatusLocation(satNumber, GoldenEye.currentFunction, location);
                    break;
                case 'self-destruction':
                    GoldenEye.updateSatStatusTime(satNumber, GoldenEye.currentFunction, false);
                    break;
                case 'landing':
                    GoldenEye.updateSatStatusTime(satNumber, GoldenEye.currentFunction, true, location);
                    break;
                case 'laser':
                case 'orbit':
                    if (conditionCheck >= GoldenEye.minCondition)
                        GoldenEye.updateSatStatusTime(satNumber, GoldenEye.currentFunction, true, location);
                    else
                        GoldenEye.updateSatStatus(satNumber, GoldenEye.currentFunction);
                    break;
                default:
                    GoldenEye.updateSatStatus(satNumber, GoldenEye.currentFunction);
                    break;
            }
            func = '.'+func;
            $(func).show();
        },
        clearSatFunction: function (satNumber) {
            $('.laser').hide();
            $('.shield').hide();
            $('.spy').hide();
            $('.energy').hide();
            $('.self-destruction').hide();
            $('.landing').hide();
            $('.orbit').hide();
            $('.location').show();
            GoldenEye.currentFunction = 'idle';
            satNumber -= 1;
            this.satStatus(function (data) {
                data[satNumber]['status'] = GoldenEye.currentFunction;
                data[satNumber]['start'] = data[satNumber]['end'] = data[satNumber]['location'] = '';
                $.ajax({
                    context: this,
                    type: "POST",
                    data: {data:data},
                    url: "updateSatStatus.php"
                })
            });
            $('.satFunctions').show();
        },
        satPage: function (satNumber, single) {
            single = single || true;

            var locationElement,
                targetLocation,
                conditionElement,
                input;

            this.showSatStatus();

            if (single === true) {
                $('.satNumber').html(satNumber);
                this.getSatStatus(satNumber, function (data) {
                    GoldenEye.currentFunction = data.status;
                    var satFunction = $('.satFunction');
                    satFunction.html(data.status + data.progress + data.location);

                    $(document).keyup(function (e) {
                        if(GoldenEye.currentFunction === 'idle') {
                            switch (e.keyCode) {
                                case 76:
                                    GoldenEye.checkCondition('laser', function(data) {
                                        GoldenEye.updateSatFunction('laser', satNumber, null, data);
                                        if (data >= GoldenEye.minCondition) {
                                            conditionElement = '.'+GoldenEye.currentFunction+' .condition';
                                            conditionElement = $(conditionElement);
                                            conditionElement.hide();

                                        } else {
                                            locationElement = '.'+GoldenEye.currentFunction+' .location';
                                            locationElement = $(locationElement);
                                            locationElement.hide();
                                        }
                                    });
                                    break;
                                case 84:
                                    GoldenEye.updateSatFunction('shield', satNumber);
                                    break;
                                case 83:
                                    GoldenEye.updateSatFunction('spy', satNumber);
                                    break;
                                case 69:
                                    GoldenEye.updateSatFunction('energy', satNumber);
                                    break;
                                case 68:
                                    GoldenEye.updateSatFunction('self-destruction', satNumber);
                                    break;
                                case 65:
                                    GoldenEye.updateSatFunction('landing', satNumber);
                                    break;
                                case 79:
                                    GoldenEye.updateSatFunction('orbit', satNumber);
                                    GoldenEye.checkCondition(GoldenEye.currentFunction, function(data) {
                                        if (data >= 4) {
                                            conditionElement = '.'+GoldenEye.currentFunction+' .condition';
                                            conditionElement = $(conditionElement);
                                            conditionElement.hide();

                                        } else {
                                            locationElement = '.'+GoldenEye.currentFunction+' .location';
                                            locationElement = $(locationElement);
                                            locationElement.hide();
                                        }
                                    });
                                    break;
                            }
                        } else {
                            if (e.keyCode === 27) {
                                if (GoldenEye.debug) {
                                    GoldenEye.clearSatFunction(satNumber);
                                    $('input').show();
                                } else {
                                    window.location.href = 'index.html';
                                }
                            }
                        }

                        if (e.keyCode === 13 && (GoldenEye.currentFunction === 'spy' || GoldenEye.currentFunction === 'energy' || GoldenEye.currentFunction === 'landing' || GoldenEye.currentFunction === 'laser' || GoldenEye.currentFunction === 'orbit')) {
                            locationElement = '.'+GoldenEye.currentFunction+' .location';
                            input = locationElement + ' input';
                            locationElement = $(locationElement);
                            input = $(input);
                            targetLocation = input.val();
                            GoldenEye.checkCondition(GoldenEye.currentFunction, function (data) {
                                GoldenEye.updateSatFunction(GoldenEye.currentFunction, satNumber, targetLocation, data);
                            });
                            input.val("");
                            locationElement.hide();
                        }
                    });
                });
                setInterval(function() {
                    GoldenEye.getSatStatus(satNumber, function (data) {
                        var satFunction = $('.satFunction');
                        satFunction.html(data.status + data.progress + data.location);
                    });
                }, GoldenEye.refreshTime);
            }


        },
        showIndexCountdown: function (func, end) {
            $('.func').html(func);
            end = new Date(end*1000);
            $('.countdownTimer').countdown(end, function(event) {
                var totalHours = event.offset.days * 24 + event.offset.hours;
                $(this).html(event.strftime(totalHours + ':%M:%S'));
            });
            $('.countdown').show();
        },
        getIndexCountdownTime: function (func) {
            GoldenEye.satStatus(function (data) {
                if (data[0]['status'] === func) {
                    GoldenEye.showIndexCountdown(func, data[0]['end']);
                } else if (data[1]['status'] === func) {
                    GoldenEye.showIndexCountdown(func, data[1]['end']);
                } else if (data[2]['status'] === func) {
                    GoldenEye.showIndexCountdown(func, data[2]['end']);
                }
            });
        },
        pageIndex: function () {
            var funcCheck = 'laser';
            GoldenEye.checkCondition(funcCheck, function (data) {
                if (data < 5) {
                    funcCheck = 'orbit';
                    GoldenEye.checkCondition(funcCheck, function (data) {
                        if (data < 5) {
                            funcCheck = 'skyweb';
                            GoldenEye.checkCondition(funcCheck, function (data) {
                                if (data < 5) {
                                    funcCheck = 's/unity';
                                    GoldenEye.checkCondition(funcCheck, function (data) {
                                        if (data >= 5) {
                                            GoldenEye.getIndexCountdownTime(funcCheck);
                                        }
                                    });
                                } else {
                                    GoldenEye.getIndexCountdownTime(funcCheck);
                                }
                            });
                        } else {
                            GoldenEye.getIndexCountdownTime(funcCheck);
                        }
                    });
                } else {
                    GoldenEye.getIndexCountdownTime(funcCheck);
                }
            });

            $(document).keyup(function (e) {
                if (e.keyCode === 13)
                    window.GoldenEye.router(GoldenEye.currentPage);
            });
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