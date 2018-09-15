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
            var PageObjects = retrieveWindowVariables(["PageObjects"]);
            var element = PageObjects.all().filter(x => x.uniqueId === srcElement.id)[0];            
            var output = "Type: " + element.type +
                "\nCaption: " + element.caption +
                "\nUrl: " + element.metadataUrl +
                "\nParentId" + element.uniqueId;
            console.log(output);
        }
        prevDOM = srcElement;

    }
}, false);



function retrieveWindowVariables(variables) {
    var ret = {};

    var scriptContent = "";
    for (var i = 0; i < variables.length; i++) {
        var currVariable = variables[i];
        scriptContent += "if (typeof " + currVariable + " !== 'undefined') document.getElementsByTagName('body')[0].setAttribute('tmp_" + currVariable + "', JSON.stringify(" + currVariable + "));\n";
        //scriptContent += "if (typeof " + currVariable + " !== 'undefined') document.getElementsByTagName('body')[0].setAttribute('tmp_" + currVariable + "', JSON.stringify(" + currVariable + "));\n";
    }

    var script = document.createElement('script');
    script.id = 'tmpScript';
    script.appendChild(document.createTextNode(scriptContent));
    (document.body || document.head || document.documentElement).appendChild(script);

    for (var i = 0; i < variables.length; i++) {
        var currVariable = variables[i];
        ret[currVariable] = JSON.parse(document.getElementsByTagName("body")[0].getAttribute("tmp_" + currVariable));
        //document.getElementsByTagName("body")[0].removeAttribute("tmp_" + currVariable);
    }

    //script.parentNode.removeChild(script);

    return ret;
}