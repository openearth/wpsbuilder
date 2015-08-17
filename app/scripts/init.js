'use strict';
/* globals hljs */

$(document).ready(function(){
    // load highlight
    hljs.initHighlighting();
    console.log('page ready');

    document.addEventListener('response', function(evt){
        var scope = evt.detail.scope;
        var text = evt.detail.output.responseText;
        var xml = $.parseXML(text);
        // why is this necessary?
        var root = xml.children[0];
        var statusLocation = root.getAttribute('statusLocation');
        console.log('statusLocation', statusLocation);
        if (statusLocation) {
            $.get(statusLocation, function(data){
                scope.output = data;
            });
        } else {
        }
        console.log('scope', scope);
        // You don't want to know...
        // See https://angularjs.org/
        // http://stackoverflow.com/questions/12729122/prevent-error-digest-already-in-progress-when-calling-scope-apply
        if(!scope.$$phase) {
            scope.$digest();
        }

    });
});

