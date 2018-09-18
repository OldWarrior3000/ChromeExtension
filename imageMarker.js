// Previous dom, that we want to track, so we can remove the previous styling.
var prevDOM = null;

// Mouse listener for any move event on the current document.
document.addEventListener('mousemove', function (e) {
    let srcElement = e.srcElement;

    // Lets check if our underlying element is a IMG.
    if (prevDOM != srcElement) {
        var print = srcElement !== 'null' && srcElement.textContent !== '';    

        if (print) {
            var object = retrieveWindowVariable(srcElement.textContent);            
            if ( (object === null )  || (typeof object.pageObject === null) ){
                return;
            } 

            var element = object.pageObject;       
            console.log(element);
        }
        prevDOM = srcElement;

    }
}, false);



function retrieveWindowVariables(ids) {
    var ret = {};

    var scriptContent = "";
    for (var i = 0; i < ids.length; i++) {
        var currVariable = ids[i];
        scriptContent += "if (typeof PageObjects !== 'undefined') document.getElementsByTagName('body')[0].setAttribute('tmp_" + currVariable + "', JSON.stringify(PageObjects.find({caption: \"" + currVariable + "\"})));\n";
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

function retrieveWindowVariable(caption) {
    var ret = {};
    var id = guid();
    // Remove all special characters from the input variable
    caption = caption.replace(/[^a-zA-Z ]/g, "");
    var scriptContent = "if (typeof PageObjects !== 'undefined') document.getElementsByTagName('body')[0].setAttribute('"+ id + "', JSON.stringify(PageObjects.find({caption: \"" + caption + "\"})));\n";
    
    try {
        var script = document.createElement('script');
        script.id = 'tmpScript';
        script.appendChild(document.createTextNode(scriptContent));
        (document.body || document.head || document.documentElement).appendChild(script);
        
        ret['pageObject'] = JSON.parse(document.getElementsByTagName("body")[0].getAttribute(id));        
    }catch(ex) {
        return null;
    }finally{
        if (script != null ) {
            script.parentNode.removeChild(script);
        }        
    }        

    return ret;
}


function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return '_' + s4() + s4() + '_' + s4() + '_' + s4() + '_' + s4() + '_' + s4() + s4() + s4();
  }