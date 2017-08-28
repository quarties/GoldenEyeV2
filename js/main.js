function getCurentFileName(){
    var pagePathName = window.location.pathname; 
    str = pagePathName.substring(pagePathName.lastIndexOf("/") + 1);
    return parseInt(str.substr(0,1)); 
}

$( document ).ready(function(){

    var licenseType = "",
        license = "123",
        key = "",
        bond = "DD-AT-MS-1502",
        loc = "",
        abort = "",
        isOn = 0,
        isOrbit = 0,
        isLoc = 0,
        systemPath = "/nodejs/",
        func = "CHOOSE",
        author = "Kurtz Korinokabe Software Combinat",
        version = "v. 2-QRT-18-PROD";
    
    $("#current span").html(func);
    
    $("#count").hide();
    $("#menu").hide();
    $("#orbit").hide();
    $(".back").hide();
    $("#abort").hide();
    $("#404").hide();
    $("#error").hide();    
    
    $("body").append("<div class=\"version\"><p>"+author+"</p><p>"+version+"</p>");
    
    
    
    $(".function").click(function(){
        $("#error").hide();    
        $("#menu").hide();
        $("#function").show();
        isLoc = 0;     
        isOrbit = 0;
    });
    
    $(".back").click(function() {
        $("#function").hide();
        $("#menu").show();
        
    });
    
    $("input[type=number]").on('input', function(){
        $("#result").html( timeFall( $(this).val() ) );
    });
    
    $(".logout").click(function(){
        window.location.href = systemPath+"0.php";
    });
    
    $("input[name=loc]").keyup(function(){
        this.value = this.value.toUpperCase();
    });
    
    $(document).keyup(function(e) {
            
        if(e.which == 13) {
            switch (getCurentFileName()) {  
                case 0:
                    $.ajax({
                        type: "POST",
                        url: "getLicense.php",
                        success: function(data) {
                            licenseType = data;
                        }
                    });
                    if(licenseType != '404') {
                        if (licenseType == "normal")
                            window.location.href = systemPath+"1.1.php";
                        else if (licenseType == "bond")
                            window.location.href = systemPath+"/terminal/";
                        /*else
                            window.location.href = systemPath+"8.php";*/
                    } else    
                        window.location.href = systemPath+"8.php";
                    break;
                case 1: 
                    var pass = $("input[name=pass]").val().toUpperCase();
                    if ( pass == license )  
                        window.location.href = systemPath+"2.1.php";
                    else if ( pass == bond )          
                        window.location.href = systemPath+"2.2.php";
                    else
                        window.location.href = systemPath+"9.php";
                    break; 
                case 2:   
                    
                    loc = $("input[name=loc]").val();
                    if (loc == "") {
                        loc = $("input[name=velocity]").val(); 
                        if (timeFall(loc) == "ERROR") {
                            $("#error").show();
                            loc = "";
                        } else {     
                            isOrbit = 1;
                        }  
                        $("input[name=loc]").val("");
                        $("input[name=velocity]").val("");
                        
                    }     
                    if (isOn == 0 && loc != "") { 
                        $("#error").hide();    
                        $("#menu").hide();
                        if ( isOrbit == 1 ) {
                            $("#target").html( timeFall(loc) );
                        } else {
                            $("#target span").html(loc);
                        }   
                        isOn = 1;  
                        $("#count").show();      
                        loc = "";  
                    } 
                    
                    abort = $("input[name=abort]").val();
                    if ( abort == license || abort == bond && isOn == 1 ) {  
                        $("input[name=loc]").val("");
                        $("#count").hide(); 
                        $("input[name=abort]").val(""); 
                        abort = "";
                        if ( func == "TV-RADIO" || func == "AUTODESTRUCTION" ){
                            $("#function").show();
                        } else {
                            $("#menu").show();
                            $("#target").show();
                        }    
                        if ( isOrbit == 1 ) {
                            $("#target").html( "target: <span></span>" );
                            isOrbit = 0;
                        } 
                        $("#abort").hide();   
                        $("input[name=loc]").val("");
                        $("input[name=velocity]").val("");
                        isOn = 0;
                    }
                    
                     
                    break;
                case 8:
                    window.location.href = systemPath+"0.php";
                    break; 
                case 9:
                    window.location.href = systemPath+"1.1.php";
                    break;
                default:
                    window.location.href = systemPath+"8.php";
            }
            
        }
        
        if (isLoc == 0 && isOn == 0) {
        
            if (e.which == 76) {
                $("#L input").click();
            }

            if (e.which == 67) {
                $("#C input").click();
            }

            if (e.which == 65) {
                $("#A input").click();
            }

            if (e.which == 83) {
                $("#S input").click();
            }

            if (e.which == 84) {
                $("#T input").click();
            }

            if (e.which == 68) {
                $("#D input").click();
        } 
        
        }    
        
        if (isLoc == 1) {
        
            if (e.which == 27) {
                $(".function").click();
            }

        }
        
        if (isOn == 1) {

            if (e.which == 82) {

                $(".key").click();
            }
        
        }
        
    });
    
    
    
    $("label").click(function() {
        func = $(this).children(("input[name=func]")).val();
        $("#current span").html(func);
        $(this).children(("input[name=func]")).filter("[value="+func+"]").prop('checked', true);
        if ( func == "TV-RADIO" || func == "AUTODESTRUCTION" ) {
            $("#count").show();  
            $("#target").hide();
            isOn = 1;
        } else if ( func == "ORBIT" ) {
            $("#menu").show();
            $("#loc").hide();
            $("#orbit").show();    
            isLoc = 1;
            $("input[name=velocity]").val("");
            $("input[name=velocity]").focus();
        } else {
            $("#menu").show();
            $("#loc").show();
            $("#orbit").hide();  
            isLoc = 1;         
            $("input[name=loc]").focus(); 
        }
        $("#function").hide();
        $(".back").show();
        
    });
    
    function  timeFall(x) {
        var m = 124000;
        var s = 8000000;
        var f;
        var result;
        if ( x < 0 || x > 2) {
            result = "ERROR";
        } else if ( x == 1 ) {
            result = "STAY";
        } else if ( x < 1) {
            f = 310000*(1-(x*x));
            result = Math.sqrt((m*s)/f);
            result = result / 60;
            result = Math.round(result);
            result = "Collision with earth after "+result+" minutes";
        } else { 
            f = 310000*((x*x)-1);
            result = Math.sqrt((m*s)/f);
            result = result / 60;
            result = Math.round(result);
            switch (x) {
                case '1.1':
                    result = "Collision with moon after "+result+" minutes";
                    break; 
                case '1.3':
                    result = "Collision with Mars after "+result+" minutes";
                    break;
                case '1.6':
                    result = "Collision with Venus after "+result+" minutes";
                    break;
                case '1.9':
                    result = "Collision with moon after "+result+" minutes";
                    break;
                default:
                    result = "Send into space";
                    break;
            }
        }
        return result;
    } 

});
