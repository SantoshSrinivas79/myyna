//var domLoaded = function (callback) {
    //alert('hello');
    
    /* Internet Explorer */
    /*@cc_on
    @if (@_win32 || @_win64)
        document.write('<script id="ieScriptLoad" defer src="//:"><\/script>');
        document.getElementById('ieScriptLoad').onreadystatechange = function() {
            if (this.readyState == 'complete') {
                appenddata();
            }
        };
    @end @*/
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = 'a.cbt-pin-it{font-style:normal; border:0; background:rgb(50,50,50); color:rgb(252,181,57); padding:5px 8px; font-family:"Open Sans", sans-serif; font-size:11px; border-radius:3px; font-weight:600; cursor:pointer;}a.cbt-pin-it:active{background:rgb(180,50,50);}a.cbt-pin-it:focus{outline:none;}';
    document.body.appendChild(css);
    
    /* Mozilla, Chrome, Opera */
    if (document.addEventListener) {
        
        document.addEventListener('DOMContentLoaded', appenddata, false);
    }
    /* Safari, iCab, Konqueror */
    if (/KHTML|WebKit|iCab/i.test(navigator.userAgent)) {
        var DOMLoadTimer = setInterval(function () {
            if (/loaded|complete/i.test(document.readyState)) {
                appenddata();
                clearInterval(DOMLoadTimer);
            }
        }, 10);
    }
    /* Other web browsers */
    //window.onload = callback;
    
//};

 function appenddata(){
    var divs = document.getElementsByClassName('source');
    var append_data ='<a class="cbt-pin-it">PIN IT</a>';
    for(var i=0; i<divs.length; i++) { 
        divs[i].innerHTML =  append_data;
    }
    
    var buttons = document.getElementsByClassName("cbt-pin-it");
    for(var i=0; i<buttons.length; i++) { 
        buttons[i].onclick = function() { 
            var par = buttons[i].parentNode;
            url = par.getAttribute("data-url");
            alert(url);
            var openurl = "http://192.168.1.65:3000/sharepinload"
            if(url) {
                openurl += '?u='+url;
            }
            window.open(openurl,"","width=415,height=415,toolbar=no,location=no");
        }
    }
    
}