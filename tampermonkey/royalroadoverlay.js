// ==UserScript==
// @name         RoyalRoadl.com Overlay
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make royalroad more readable
// @author       zachc
// @match        *://royalroadl.com/fiction/chapter/*
// @grant        none 
// ==/UserScript==

(function addOverlayToPage(){
    'use strict';
    // Store old state
    var oldHead = document.head.innerHTML;
    var oldBody = document.body.innerHTML;

    clearSpanStyles();
    removeIframes();
    var chapterContent = document.getElementsByClassName('chapter-content')[0].innerHTML;
    var [navLinksTop, navLinksBot] = getChapterLinks();
    var newHead = getCSS();
    var newBody = getTitleHeader() + navLinksTop + chapterContent + '<br><br>' + navLinksBot;
    document.head.innerHTML = newHead;
    document.body.innerHTML = newBody;
    addToggleButton();

    function addToggleButton(text='[close x]'){
        var toggleAnchor = document.createElement('a');
        toggleAnchor.innerHTML = text;
        toggleAnchor.href = '#';
        toggleAnchor.style = 'font-size: 21px; font-family:Georgia; line-height: 33px; position:fixed; top:10px; right:30px;z-index: 1000;';
        toggleAnchor.addEventListener("click", function( event ) {
            var overlay = document.getElementById('zc-overlay');
            if(toggleAnchor.innerHTML == '[open +]'){
                toggleAnchor.innerHTML = '[close x]';
                document.head.innerHTML = newHead;
                document.body.innerHTML = newBody;
                addToggleButton('[close x]');
            } else{
                document.head.innerHTML = oldHead;
                document.body.innerHTML = oldBody;
                addToggleButton('[open +]');
            }
        }, false);
        document.body.prepend(toggleAnchor);
    }


    function getChapterLinks(){
        var chapterLinks = getAnchors();
        var previousLink = '<span class="faded"><< Prev</span>';
        var nextLink = '<span class="faded">Next >></span>';
        if(chapterLinks[0]){
            chapterLinks[0].innerHTML = "<< Prev";
            previousLink = chapterLinks[0].outerHTML;
        }
        if(chapterLinks[1]){
            chapterLinks[1].innerHTML = "Next >>";
            nextLink = chapterLinks[1].outerHTML;
        }
        var navLinksTop = '<div style="text-align:left;">' + previousLink + '&nbsp;&nbsp;&nbsp;&nbsp;' + nextLink +'</div><br><br>';
        var navLinksBot = '<div style="text-align:center;">' + previousLink + '&nbsp;&nbsp;&nbsp;&nbsp;' + nextLink +'</div>';
        return [navLinksTop, navLinksBot];
    }

    function getCSS(){
        var anchorStyle = 'a{text-decoration:none;}';
        var bodyTextStyle = 'body{font-size: 21px; font-family:Georgia; line-height: 33px; color: rgba(0,0,0,.8); margin: 30px auto; max-width:700px;}.faded{color:#999;}';
        var innerContentTableStyle = 'table{text-align:center;background-color:#F5F5F5;padding:10px 30px;width:100%;}';
        var css = '<style type="text/css">'+ anchorStyle + bodyTextStyle + innerContentTableStyle + '</style>';
        return css;
    }

    function getTitleHeader(){
        var bookName = document.getElementsByTagName('h1')[0].innerHTML;
        var chapterName = document.getElementsByTagName('h2')[0].innerHTML;
        return '<h1>' + bookName + '</h1><h2>' + chapterName + '</h2>';
    }

    function getAnchors(){
        var next, previous;
        var anchors = document.getElementsByTagName('a');
        for(var i=0;i<anchors.length;i++){
            if(anchors[i].innerHTML == 'Next <br class="visible-xs">Chapter')
                next = anchors[i];
            if(anchors[i].innerHTML == 'Previous <br class="visible-xs">Chapter')
                previous = anchors[i];
        }
        return [previous, next];
    }

    function removeIframes(){
        var iframes = document.querySelectorAll('iframe');
        for (var i = 0; i < iframes.length; i++) {
            iframes[i].parentNode.removeChild(iframes[i]);
        }
    }

    function clearSpanStyles(){
        var spans = document.getElementsByTagName('span');
        for(var i=0;i<spans.length;i++){
            spans[i].style = '';
        }
    }

})();
