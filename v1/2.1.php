<!doctype html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title></title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="stylesheet" href="css/normalize.min.css">
    <link rel="stylesheet" href="css/main.css">

    <script src="js/vendor/modernizr-2.8.3.min.js"></script>

    <script src="js/vendor/jquery-1.11.2.min.js"></script>

    <script src="js/plugins.js"></script>
    <script src="js/main.js"></script>
    <script src="js/jquery.countdown.js"></script>

    <script type="text/javascript">
        $(function() {

            var licenseTypeLocal = "";

            $(".key").click(function(){

                $("#abort").hide();
                $("#404").hide();

                $.ajax({
                    type: "POST",
                    url: "/nodejs/getLicense.php",
                    success: function(data) {
                        licenseTypeLocal = data;
                    }
                });

                if(licenseTypeLocal != '404') {
                    if (licenseTypeLocal == "normal") {
                        $("#abort").show();
                        $("input[name=abort]").focus();
                    } else if (licenseTypeLocal == "bond") {
                        $("#abort").show();
                        $("input[name=abort]").focus();
                        var alfaNumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                        alfaNumeric = alfaNumeric.split("");
                        var i = 0;
                        var r1 = 0;
                        var r2 = 0;
                        var i2 = 0;
                        var bond = "DD-AT-MS-1502";

                        function shuffle(a) {
                            var j, x, i;
                            for (i = a.length; i; i -= 1) {
                                j = Math.floor(Math.random() * i);
                                x = a[i - 1];
                                a[i - 1] = a[j];
                                a[j] = x;
                            }
                        }

                        shuffle(alfaNumeric);

                        var getChar = setInterval(function(){
                            i1 = i + 1;

                            if (i1%3 == 0 && i1 != 12) {
                                $("input[name=abort]").val($("input[name=abort]").val() + "-");
                                i++;
                            } else {
                                if ( r1 < 36 ) {
                                    $("input[name=abort]").val($("input[name=abort]").val().substr(0,i) + alfaNumeric[r1]);
                                    r1++;
                                } else {
                                    $("input[name=abort]").val($("input[name=abort]").val().substr(0,i) + alfaNumeric[r2]);
                                    r2++;
                                }

                            }

                            if (alfaNumeric[r2-1] == bond.substr(i,1)) {
                                shuffle(alfaNumeric);
                                i++;
                                r1 = 0;
                                r2 = 0;
                            }
                            if (i == bond.length ) {
                                clearInterval(getChar);
                            }
                        }, 75 );
                    }
                } else {
                    $("#404").show();
                }

            });

        });
    </script>
</head>
<body>

<div class="center">
    <div class="inner">

        <h2 id="current">Current function: <span></span></h2>

        <div id="menu">

            <a href="#" type="button" class="function">Change function (<u>esc</u>)</a>

            <div id="loc">

                <p>Please type a target location below and press enter to submit.</p>

                <input type="text" name="loc">

            </div>

            <div id="orbit">

                <p>Please type value in space veloicty unit and press enter to submit. Valid range is from 0 to 2. </p>

                <input type="number" name="velocity" step="0.01" min="0" max="2">

                <p id="result">Stay</p>

            </div>

        </div>

        <div id="count">

            <p id="target">Target: <span></span></p>

            <div class="timer"></div>

            <p><a type="button" class="key"><u>R</u>eload key</a></p>

            <div id="abort">
                <p>Please type a license code below and press enter to submit</p>
                <p><input type="text" name="abort"></p>
            </div>

            <div id="404">
                <p>License code is missing</p>
            </div>

        </div>

        <div id="function">

            <p><label class="radio" id="L"><input type="radio" name="func" value="LASER"> <u>L</u>aser</label></p>
            <p><label class="radio" id="A"><input type="radio" name="func" value="LANDING"> L<u>a</u>nding</label> </p>
            <p><label class="radio" id="S"><input type="radio" name="func" value="SPY"> <u>S</u>py</label></p>
            <p><label class="radio" id="T"><input type="radio" name="func" value="TV-RADIO"> <u>T</u>V-Radio</label></p>
            <p><label class="radio" id="C"><input type="radio" name="func" value="ORBIT"> <u>C</u>hange orbit</label></p>
            <p><label class="radio" id="D"><input type="radio" name="func" value="AUTODESTRUCTION">   AUTO<u>D</u>ESTRUCTION</label></p>

        </div>

    </div>
</div>

</body>
</html>
