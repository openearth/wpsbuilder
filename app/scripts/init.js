'use strict';
/* globals hljs */

function setIntervalX(callback, delay, repetitions) {
    // Call setIntervalX but only so many times
    // or stop if the callback returns true
    var x = 0;
    var intervalId = window.setInterval(function () {

        // pass interval so the function can clear it
        callback(intervalId);

        if ((++x === repetitions) ) {
            window.clearInterval(intervalId);
        }
    }, delay);
}

function processStatus(xml, scope) {
    // Process the xml and update the scope
    // return true if we found references
    var result = false;
    var status = xml.getElementsByTagName('Status');
    if (status.length && status[0].children.length) {
        // update status info
        console.log('status', status);
        scope.status.tag = status[0].children[0].tagName;
        scope.status.text = status[0].children[0].textContent;
    }
    var references = xml.getElementsByTagName('Reference');
    if (references.length) {
        console.log('references', references);
        // we only expect one, so take the first
        var reference = references[0];
        var mime = reference.getAttribute('mimeType');
        if (_.startsWith(mime, 'image')) {
            scope.output.tag = 'img';
            scope.output.src = reference.getAttribute('href');
        }

        // we're done, clear the interval
        result = true;
    } else {
    }
    // manually digest
    if(!scope.$$phase) {
        scope.$digest();
    }
    return result;

}

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
        processStatus(root, scope);
        // if we have a statuslocation, keep updating
        if (statusLocation) {
            setIntervalX(
                function(intervalId){
                    $.get(statusLocation, function(data){
                        if (processStatus(data, scope)) {
                            // if we have success
                            window.clearInterval(intervalId);
                        }
                    });
                    return false;
                },
                4000,
                5
            );
        } else {
            console.log('No statuslocation found in xml', xml);
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
