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
    </head>
    <body>

        <div class="center">
            <div class="inner">
            
                <p>Wait for the password cracking process to complete and press enter to submit.</p>
        
                <input type ="text" name="pass" autofocus readonly>
                
            </div>
        </div>

        <script src="js/vendor/jquery-1.11.2.min.js"></script>

        <script src="js/plugins.js"></script>
        <script src="js/main.js"></script>
        <script>
        $(document).ready(function() {
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
                        $("input[name=pass]").val($("input[name=pass]").val() + "-");
                        i++;
                    } else {
                        if ( r1 < 36 ) {   
                            $("input[name=pass]").val($("input[name=pass]").val().substr(0,i) + alfaNumeric[r1]);      
                            r1++;
                        } else { 
                            $("input[name=pass]").val($("input[name=pass]").val().substr(0,i) + alfaNumeric[r2]);      
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
                
        });
        </script>
    </body>
    </body>
</html>
