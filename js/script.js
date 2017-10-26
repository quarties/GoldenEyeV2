$(document).ready(function() {
    window.GoldenEye = {
        debug: false,
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
        version: "v. 2-QRT-20-18-"+((!this.debug) ? 'DEV' : 'PROD'),
        getCurrentFileName: function (){
            let pagePathName = window.location.pathname;
            let filename = pagePathName.replace(/^.*[\\\/]/, '');
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
        router: function (currentPage, success = false, satNumber = null) {

            if (success===true) {
                switch (currentPage) {
                    case '404':
                        window.location.href = 'single-sat.html?satNumber='+satNumber;
                        break;
                    case 'normal':
                        if (satNumber === 8)
                            window.location.href = 'multiple-sat.html';
                        else
                            window.location.href = 'single-sat.html?satNumber='+satNumber;
                        break;
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
                                window.location.href = 'terminal/';
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
                    case 'normal':
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
            let fileContent = null;
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

                    let key;

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

            let countDownFinal = new Date();
            if (GoldenEye.debug) {
                countDownFinal.setSeconds(countDownFinal.getSeconds() + 5);
            } else {
                countDownFinal.setHours(countDownFinal.getHours() + 1);
            }

            $('.countdownTimer').countdown(countDownFinal, function(event) {
                let totalMinutes = event.offset.hours * 60 + event.offset.minutes;
                $(this).html(event.strftime(totalMinutes + ':%S'));
            }).on('finish.countdown', function () {
                GoldenEye.router(GoldenEye.currentPage, true, satNumber);
            });

            $('.countdown').show();
        },
        passwordCheck: function (password, key = false) {
            let satNumber = this.passwords.indexOf(password)+1;
            if (key && password === GoldenEye.passwordAll) {
                satNumber = 8;
            }
            if (satNumber > 0) {
                if (key) {
                    if (password === GoldenEye.passwordAll)
                        GoldenEye.router(GoldenEye.currentPage, true, satNumber);
                    else
                        GoldenEye.router(GoldenEye.currentPage, true, satNumber);
                } else
                    this.connect(satNumber);
            }
        },
        page404: function () {
            $('.countdown').hide();
            let input = $('input');
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
        pageNormal: function () {
            let input = $('input');
            $(document).keyup(function (e) {
                if (e.keyCode === 13) {
                    window.GoldenEye.passwordCheck(input.val(), true);
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
                let start = data[satNumber]['start'];
                let end = data[satNumber]['end'];
                let now = parseInt(new Date().getTime() / 1000);
                let progress = Math.round((now-start)/(end-start)*100);
                callback(progress);
            })
        },*/
        getSatStatus: function (satNumber, callback) {
            this.satStatus(function (data) {
                satNumber -= 1;
                let satStatus = {
                    "status": data[satNumber]['status'],
                    "progress": "",
                    "location": ""
                };
                let start = data[satNumber]['start'];
                let end = data[satNumber]['end'];
                if (start && end) {
                    let now = Math.round(new Date().getTime() / 1000);
                    let progress = Math.round((now-start)/(end-start)*100);
                    satStatus.progress = ' '+progress+'%';
                }
                let location = data[satNumber]['location'];
                if (location) {
                    satStatus.location = ' '+location;
                }
                callback(satStatus);
            });
        },
        checkCondition: function (func, callback) {
            let satCount = 0,
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
        updateSatStatus: function (satNumber, status, hackedSats = 0, callback) {
            satNumber -= 1;
            if (satNumber === 7) {
                    this.satStatus(function (data) {
                        for (let currentSat = 0; currentSat < satNumber; currentSat++) {
                            data[currentSat]['status'] = status;
                            data[currentSat]['start'] = data[currentSat]['end'] = data[currentSat]['location'] = '';
                        }
                        $.ajax({
                            context: this,
                            type: "POST",
                            data: {data:data},
                            url: "updateSatStatus.php",
                            complete: callback
                        })
                    });
            } else if (satNumber === 8) {
                this.satStatus(function (data) {
                    for (let currentSat = 0; currentSat < hackedSats; currentSat++) {
                        data[currentSat]['status'] = status;
                        data[currentSat]['start'] = data[currentSat]['end'] = data[currentSat]['location'] = '';
                    }
                    $.ajax({
                        context: this,
                        type: "POST",
                        data: {data:data},
                        url: "updateSatStatus.php",
                        complete: callback
                    })
                });
            } else {
                this.satStatus(function (data) {
                    data[satNumber]['status'] = status;
                    data[satNumber]['start'] = data[satNumber]['end'] = data[satNumber]['location'] = '';
                    $.ajax({
                        context: this,
                        type: "POST",
                        data: {data:data},
                        url: "updateSatStatus.php",
                        complete: callback
                    })
                });
            }
        },
        updateSatStatusTime: function (satNumber, status, hackedSats = 0, tillEnd, location = null) {
            satNumber -= 1;
            if (satNumber === 7) {
                this.satStatus(function (data) {
                    let now = new Date(),
                        nowStamp = Math.round(now.getTime() / 1000),
                        end;
                    if (tillEnd) {
                        if (GoldenEye.debug) {
                            end = Math.round(new Date(2017, 9, 26).getTime() / 1000);
                        } else {
                            end = Math.round(new Date(2017, 10, 29).getTime() / 1000);
                        }
                    } else {
                        if (GoldenEye.debug) {
                            end = Math.round(now.setMinutes(now.getMinutes() + 5) / 1000);
                        } else {
                            end = Math.round(now.setHours(now.getHours() + 5) / 1000);
                        }
                    }

                    for(let currentSat = 0; currentSat < satNumber; currentSat++) {
                        data[currentSat]['status'] = status;
                        data[currentSat]['start'] = nowStamp;
                        data[currentSat]['end'] = end;
                        data[currentSat]['location'] = location;
                    }

                    $.ajax({
                        context: this,
                        type: "POST",
                        data: {data: data},
                        url: "updateSatStatus.php"
                    });
                });
            } else if (satNumber === 8) {
                this.satStatus(function (data) {
                    let now = new Date(),
                        nowStamp = Math.round(now.getTime() / 1000),
                        end;
                    if (tillEnd) {
                        if (GoldenEye.debug) {
                            end = Math.round(new Date(2017, 9, 26).getTime() / 1000);
                        } else {
                            end = Math.round(new Date(2017, 10, 29).getTime() / 1000);
                        }
                    } else {
                        if (GoldenEye.debug) {
                            end = Math.round(now.setMinutes(now.getMinutes() + 5) / 1000);
                        } else {
                            end = Math.round(now.setHours(now.getHours() + 5) / 1000);
                        }
                    }

                    for(let currentSat = 0; currentSat < hackedSats; currentSat++) {
                        data[currentSat]['status'] = status;
                        data[currentSat]['start'] = nowStamp;
                        data[currentSat]['end'] = end;
                        data[currentSat]['location'] = location;
                    }

                    $.ajax({
                        context: this,
                        type: "POST",
                        data: {data: data},
                        url: "updateSatStatus.php"
                    });
                });
            } else {
                let callbackSend = false;
                this.satStatus(function (data) {
                    let now = new Date(),
                        nowStamp = Math.round(now.getTime() / 1000),
                        end;
                    data[satNumber]['status'] = status;
                    data[satNumber]['start'] = nowStamp;
                    if (tillEnd) {
                        if (GoldenEye.debug) {
                            end = Math.round(new Date(2017, 9, 25).getTime() / 1000);
                        } else {
                            end = Math.round(new Date(2017, 10, 29).getTime() / 1000);
                        }
                        let iteration = 0;
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
            }
        },
        updateSatStatusLocation: function (satNumber, status, location, hackedSats = 0) {
            satNumber -= 1;
            if (satNumber === 7) {
                this.satStatus(function (data) {
                    for(let currentSat = 0; currentSat < satNumber; currentSat++) {
                        data[currentSat]['status'] = status;
                        data[currentSat]['location'] = location;
                    }
                    $.ajax({
                        context: this,
                        type: "POST",
                        data: {data:data},
                        url: "updateSatStatus.php"
                    })
                });
            } else if (satNumber === 8) {
                this.satStatus(function (data) {
                    for(let currentSat = 0; currentSat < hackedSats; currentSat++) {
                        data[currentSat]['status'] = status;
                        data[currentSat]['location'] = location;
                    }
                    $.ajax({
                        context: this,
                        type: "POST",
                        data: {data:data},
                        url: "updateSatStatus.php"
                    })
                });
            } else {
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
            }
        },
        showSatStatus: function () {
            $("body").append('<div class="satStatus"></div>');

            let satNumber;
            let satStatusElement = $(".satStatus");

            this.satStatus(function (data) {
                satStatusElement.html('');
                for (let i in data) {
                    satNumber = parseInt(i)+1;
                    let satStatus = {
                        "status": data[i]['status'],
                        "progress": "",
                        "location": ""
                    };
                    let start = data[i]['start'];
                    let end = data[i]['end'];
                    if (start && end) {
                        let now = Math.round(new Date().getTime() / 1000);
                        let progress = Math.round((now-start)/(end-start)*100);
                        if (now >= end) {
                            GoldenEye.updateSatStatus(satNumber, 'destroyed');
                        } else
                            satStatus.progress = ' '+progress+'%';
                    }
                    let location = data[i]['location'];
                    if (location) {
                        satStatus.location = ' '+location;
                    }
                    satStatusElement.append('<p>Sat #' + satNumber + ': ' + satStatus.status + satStatus.progress + satStatus.location + '</p>');
                }
            });

            setInterval(function() {
                GoldenEye.satStatus(function (data) {
                    satStatusElement.html('');
                    for (let i in data) {
                        satNumber = parseInt(i) + 1;
                        let satStatus = {
                            "status": data[i]['status'],
                            "progress": "",
                            "location": ""
                        };
                        let start = data[i]['start'];
                        let end = data[i]['end'];
                        if (start && end) {
                            let now = Math.round(new Date().getTime() / 1000);
                            let progress = Math.round((now - start) / (end - start) * 100);
                            if (now >= end) {
                                GoldenEye.updateSatStatus(satNumber, 'destroyed');
                            } else
                                satStatus.progress = ' '+progress+'%';
                        }
                        let location = data[i]['location'];
                        if (location) {
                            satStatus.location = ' '+location;
                        }
                        satStatusElement.append('<p>Sat #' + satNumber + ': ' + satStatus.status + satStatus.progress + satStatus.location + '</p>');
                    }
                });
            }, GoldenEye.refreshTime);
        },
        updateSatFunction: function (func, satNumber, hackedSats = 0, location = null, conditionCheck = null) {
            $('.satFunctions').hide();
            GoldenEye.currentFunction = func;
            switch (func) {
                case 'spy':
                case 'energy':
                    GoldenEye.updateSatStatusLocation(satNumber, GoldenEye.currentFunction, location, hackedSats);
                    break;
                case 'self-destruction':
                    GoldenEye.updateSatStatusTime(satNumber, GoldenEye.currentFunction, hackedSats, false);
                    break;
                case 'landing':
                    GoldenEye.updateSatStatusTime(satNumber, GoldenEye.currentFunction, hackedSats, true, location);
                    break;
                case 'laser':
                case 'orbit':
                    if (conditionCheck >= GoldenEye.minCondition || satNumber > Object.keys(GoldenEye.passwords).length)
                        GoldenEye.updateSatStatusTime(satNumber, GoldenEye.currentFunction, hackedSats, true, location);
                    else
                        GoldenEye.updateSatStatus(satNumber, GoldenEye.currentFunction, hackedSats);
                    break;
                default:
                    GoldenEye.updateSatStatus(satNumber, GoldenEye.currentFunction, hackedSats);
                    break;
            }
            func = '.'+func;
            $(func).show();
        },
        clearSatFunction: function (satNumber, hackedSats = 0) {
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
            if (satNumber === 7) {
                this.satStatus(function (data) {
                    for(let currentSat = 0; currentSat < satNumber; currentSat++) {
                        data[currentSat]['status'] = GoldenEye.currentFunction;
                        data[currentSat]['start'] = data[currentSat]['end'] = data[currentSat]['location'] = '';
                    }
                    $.ajax({
                        context: this,
                        type: "POST",
                        data: {data:data},
                        url: "updateSatStatus.php"
                    })
                });
            } else if (satNumber === 8) {
                this.satStatus(function (data) {
                    for(let currentSat = 0; currentSat < hackedSats; currentSat++) {
                        data[currentSat]['status'] = GoldenEye.currentFunction;
                        data[currentSat]['start'] = data[currentSat]['end'] = data[currentSat]['location'] = '';
                    }
                    $.ajax({
                        context: this,
                        type: "POST",
                        data: {data:data},
                        url: "updateSatStatus.php"
                    })
                });
            } else {
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
            }
            $('.satFunctions').show();
        },
        setFocus: function () {
            let input = '.'+GoldenEye.currentFunction+' .location input';
            $(input).focus();
        },
        pageSat: function (satNumber, single = true, hackedSats = 0) {

            let locationElement,
                targetLocation,
                conditionElement,
                input;

            this.showSatStatus();
            $('.satNumber').html((satNumber===9) ? hackedSats : satNumber);

            if (single === true) {
                this.getSatStatus(satNumber, function (data) {
                    GoldenEye.currentFunction = data.status;
                    let satFunction = $('.satFunction');
                    satFunction.html(data.status + data.progress + data.location);

                    $(document).keyup(function (e) {
                        if(GoldenEye.currentFunction === 'idle') {
                            switch (e.keyCode) {
                                case 76:
                                    GoldenEye.checkCondition('laser', function(data) {
                                        GoldenEye.updateSatFunction('laser', satNumber, 0, null, data);
                                        if (data >= GoldenEye.minCondition) {
                                            conditionElement = '.'+GoldenEye.currentFunction+' .condition';
                                            conditionElement = $(conditionElement);
                                            conditionElement.hide();
                                            GoldenEye.setFocus();

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
                                    GoldenEye.setFocus();
                                    break;
                                case 69:
                                    GoldenEye.updateSatFunction('energy', satNumber);
                                    GoldenEye.setFocus();
                                    break;
                                case 68:
                                    GoldenEye.updateSatFunction('self-destruction', satNumber);
                                    break;
                                case 65:
                                    GoldenEye.updateSatFunction('landing', satNumber);
                                    GoldenEye.setFocus();
                                    break;
                                case 79:
                                    GoldenEye.updateSatFunction('orbit', satNumber);
                                    GoldenEye.checkCondition(GoldenEye.currentFunction, function(data) {
                                        if (data >= GoldenEye.minCondition) {
                                            conditionElement = '.'+GoldenEye.currentFunction+' .condition';
                                            conditionElement = $(conditionElement);
                                            conditionElement.hide();
                                            GoldenEye.setFocus();

                                        } else {
                                            locationElement = '.'+GoldenEye.currentFunction+' .location';
                                            locationElement = $(locationElement);
                                            locationElement.hide();
                                        }
                                    });
                                    break;
                                case 27:
                                    window.location.href = 'index.html';
                                    break;
                            }
                        } else {
                            if (e.keyCode === 27) {
                                GoldenEye.clearSatFunction(satNumber);
                                $('input').show();
                            }
                        }

                        if (e.keyCode === 13 && (GoldenEye.currentFunction === 'spy' || GoldenEye.currentFunction === 'energy' || GoldenEye.currentFunction === 'landing' || GoldenEye.currentFunction === 'laser' || GoldenEye.currentFunction === 'orbit')) {
                            locationElement = '.'+GoldenEye.currentFunction+' .location';
                            input = locationElement + ' input';
                            locationElement = $(locationElement);
                            input = $(input);
                            targetLocation = input.val();
                            GoldenEye.checkCondition(GoldenEye.currentFunction, function (data) {
                                GoldenEye.updateSatFunction(GoldenEye.currentFunction, satNumber, 0, targetLocation, data);
                            });
                            input.val("");
                            locationElement.hide();
                        }
                    });
                });
                setInterval(function() {
                    GoldenEye.getSatStatus(satNumber, function (data) {
                        let satFunction = $('.satFunction');
                        satFunction.html(data.status + data.progress + data.location);
                    });
                }, GoldenEye.refreshTime);
            } else {
                GoldenEye.currentFunction = 'idle';
                $(document).keyup(function (e) {
                    if(GoldenEye.currentFunction === 'idle') {
                        switch (e.keyCode) {
                            case 76:
                                GoldenEye.updateSatFunction('laser', satNumber, hackedSats, null, hackedSats);
                                if (satNumber === 8 || (satNumber === 9 && hackedSats > GoldenEye.minCondition)) {
                                    conditionElement = '.'+GoldenEye.currentFunction+' .condition';
                                    conditionElement = $(conditionElement);
                                    conditionElement.hide();
                                    GoldenEye.setFocus();
                                } else {
                                    locationElement = '.'+GoldenEye.currentFunction+' .location';
                                    locationElement = $(locationElement);
                                    locationElement.hide();
                                }
                                break;
                            case 84:
                                GoldenEye.updateSatFunction('shield', satNumber, hackedSats);
                                break;
                            case 83:
                                GoldenEye.updateSatFunction('spy', satNumber, hackedSats);
                                GoldenEye.setFocus();
                                break;
                            case 69:
                                GoldenEye.updateSatFunction('energy', satNumber, hackedSats);
                                GoldenEye.setFocus();
                                break;
                            case 68:
                                GoldenEye.updateSatFunction('self-destruction', satNumber, hackedSats);
                                break;
                            case 65:
                                GoldenEye.updateSatFunction('landing', satNumber, hackedSats);
                                GoldenEye.setFocus();
                                break;
                            case 79:
                                GoldenEye.updateSatFunction('orbit', satNumber, hackedSats);
                                conditionElement = '.'+GoldenEye.currentFunction+' .condition';
                                conditionElement = $(conditionElement);
                                conditionElement.hide();
                                GoldenEye.setFocus();
                                break;
                            case 27:
                                window.location.href = 'index.html';
                                break;
                        }
                    } else {
                        if (e.keyCode === 27) {
                            GoldenEye.clearSatFunction(satNumber, hackedSats);
                            $('input').show();
                        }
                    }


                    if (e.keyCode === 13 && (GoldenEye.currentFunction === 'spy' || GoldenEye.currentFunction === 'energy' || GoldenEye.currentFunction === 'landing' || GoldenEye.currentFunction === 'laser' || GoldenEye.currentFunction === 'orbit')) {
                        locationElement = '.'+GoldenEye.currentFunction+' .location';
                        input = locationElement + ' input';
                        locationElement = $(locationElement);
                        input = $(input);
                        targetLocation = input.val();
                        GoldenEye.checkCondition(GoldenEye.currentFunction, function (data) {
                            GoldenEye.updateSatFunction(GoldenEye.currentFunction, satNumber, hackedSats, targetLocation, data);
                        });
                        input.val("");
                        locationElement.hide();
                    }
                });
            }


        },
        showIndexCountdown: function (func, end) {
            $('.func').html(func);
            end = new Date(end*1000);
            $('.countdownTimer').countdown(end, function(event) {
                let totalHours = event.offset.days * 24 + event.offset.hours;
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
            let funcCheck = 'laser';
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

                let $_GET = {};
                if(document.location.toString().indexOf('?') !== -1) {
                    let query = document.location
                        .toString()
                        .replace(/^.*?\?/, '')
                        .replace(/#.*$/, '')
                        .split('&');

                    for(let i=0, l=query.length; i<l; i++) {
                        let aux = decodeURIComponent(query[i]).split('=');
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
                    case 'normal':
                        this.pageNormal();
                        break;
                    case 'single-sat':
                        this.pageSat($_GET['satNumber']);
                        break;
                    case 'multiple-sat':
                        this.pageSat(8, false);
                        break;
                    case 'bond':
                        ($_GET['sats'] > Object.keys(GoldenEye.passwords).length) ? $_GET['sats'] = 7 : $_GET['sats'];
                        this.pageSat(9, false, $_GET['sats']);
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