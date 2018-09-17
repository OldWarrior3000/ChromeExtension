// Unique ID for the className.
var MOUSE_VISITED_CLASSNAME = 'crx_mouse_visited';

// Previous dom, that we want to track, so we can remove the previous styling.
var prevDOM = null;

// Mouse listener for any move event on the current document.
document.addEventListener('mousemove', function (e) {
    let srcElement = e.srcElement;

    // Lets check if our underlying element is a IMG.
    if (prevDOM != srcElement) {
        var print = srcElement.id !== 'null' && srcElement.id !== '';    

        if (print) {
            // var d = new Date();
            // var n = d.getMilliseconds();

            // var output = "Millies: " + n +
            //     "CurrentSrc: " + srcElement.currentSrc +
            //     "\nNodeName: " + srcElement.nodeName +
            //     "\nsrcElement: " + srcElement +
            //     "\nParentId" + srcElement.parentElement.id;
            var objects = retrieveWindowVariables([srcElement.id]);
            var element = objects.pageObject;
            var output = "Type: " + element.type +
                "\nCaption: " + element.caption +
                "\nUrl: " + element.metadataUrl +
                "\nParentId" + element.uniqueId;
            console.log(output);
        }
        prevDOM = srcElement;

    }
}, false);



function retrieveWindowVariables(ids) {
    var ret = {};

    var scriptContent = "";
    for (var i = 0; i < ids.length; i++) {
        var currVariable = ids[i];
        scriptContent += "if (typeof PageObjects !== 'undefined') document.getElementsByTagName('body')[0].setAttribute('tmp_" + currVariable + "', JSON.stringify(PageObjects.all()[0]));\n";
        // scriptContent += "if (typeof PageObjects !== 'undefined') document.getElementsByTagName('body')[0].setAttribute('tmp_" + currVariable + "', JSON.stringify(PageObjects.all().filter(x => x.uniqueId === '" + currVariable + "')));\n";
        //scriptContent += "if (typeof " + currVariable + " !== 'undefined') document.getElementsByTagName('body')[0].setAttribute('tmp_" + currVariable + "', JSON.stringify(" + currVariable + "));\n";
    }

    var script = document.createElement('script');
    script.id = 'tmpScript';
    script.appendChild(document.createTextNode(scriptContent));
    (document.body || document.head || document.documentElement).appendChild(script);

    for (var i = 0; i < ids.length; i++) {
        var currVariable = ids[i];
        ret['pageObject'] = JSON.parse(document.getElementsByTagName("body")[0].getAttribute("tmp_" + currVariable));        
    }

    script.parentNode.removeChild(script);

    return ret;
}