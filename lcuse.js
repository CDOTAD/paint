/*
LC.init(
    document.getElementsByClassName('my-drawing')[0],
    {imageURLPrefix: 'literallycanvas-0.4.14/img'}
);*/

var lc;

var MyCannyTool = function(lc){
    var self = this

    return{
        usesSimpleAPI: false,
        name: 'MyCannyTool',
        iconNmae: 'pan',
        strokeWidth: lc.opts.defaultStrokeWidth,
        optionsStype: 'stroke-width',

        didBecomeActive: function(lc) {
            var onPointerDown = function(pt) {
              self.currentShape = LC.createShape('Line', {
                x1: pt.x, y1: pt.y, x2: pt.x, y2: pt.y,
                strokeWidth: self.strokeWidth, color: lc.getColor('primary')});
              lc.setShapesInProgress([self.currentShape]);
              lc.repaintLayer('main');
            };
      
            var onPointerDrag = function(pt) {
              self.currentShape.x2 = pt.x;
              self.currentShape.y2 = pt.y;
              lc.setShapesInProgress([self.currentShape]);
              lc.repaintLayer('main');
            };
      
            var onPointerUp = function(pt) {
              self.currentShape.x2 = pt.x;
              self.currentShape.y2 = pt.y;
              lc.setShapesInProgress([]);
              lc.saveShape(self.currentShape);
            };
      
            var onPointerMove = function(pt) {
              console.log("Mouse moved to", pt);
            };
      
            // lc.on() returns a function that unsubscribes us. capture it.
            self.unsubscribeFuncs = [
              lc.on('lc-pointerdown', onPointerDown),
              lc.on('lc-pointerdrag', onPointerDrag),
              lc.on('lc-pointerup', onPointerUp),
              lc.on('lc-pointermove', onPointerMove)
            ];
          },
      
          willBecomeInactive: function(lc) {
            // call all the unsubscribe functions
            self.unsubscribeFuncs.map(function(f) { f() });
          }
    }
}

$(document).ready(function(){

    var imageSize = {width:200, height: 200};
    var imageBounds = {
        x:0, y:0, width: imageSize.width, height: imageSize.height
    };

    lc = LC.init(
    document.getElementsByClassName('my-drawing')[0],
        {/*imageSize: imageSize,
            imageSize: {width: 1000, height: 1000},*/
            imageURLPrefix: 'literallycanvas-0.4.14/img',
            tools:[LC.tools.Pencil, LC.tools.Eraser, LC.tools.Line, LC.tools.Rectangle, LC.tools.Ellipse, 
                LC.tools.Polygon, LC.tools.Text, LC.tools.Pan, LC.tools.SelectShape, MyCannyTool],
            toolbarPosition: "bottom"
        }
    );

    //var newImage = new Image();
    
    //console.log(newImage);

    //newImage.src = 'test.png';
    //newImage.crossOrigin='http://profile.ak.fbcdn.net/crossdomain.xml';
    //lc.saveShape(LC.createShape('Image',{x:0, y:0, image:newImage}));
    
    $('.controls.export [data-action=export-as-png]').click(function(e){
        e.preventDefault();
        var dataURL = lc.getImage(/*{rect:imageBounds}*/);
        var imageData = dataURL.getContext("2d").getImageData(0,0,dataURL.width,dataURL.height);
        console.log(dataURL);
        console.log(imageData);
    });
    
    //var greyFlag = false;

    $('#grey').click(function(e){
        e.preventDefault();
        /*
        if(greyFlag)
        {
            return;
        }*/

        console.log('grey');
        //canvas
        var dataURL = lc.getImage(/*{rect:imageBounds}*/);
        
        //console.log('dataURL',dataURL);

        //var context = dataURL.getContext("2d");
        
        //console.log('context',context);
        // imageData
        /*
        var imageData = context.getImageData(0,0,dataURL.width,dataURL.height);
        var pixelData = imageData.data;

        for(var i=0;i<dataURL.width*dataURL.height;i++){
            var r=pixelData[i*4+0];
            var g=pixelData[i*4+1];
            var b=pixelData[i*4+2];
            var grey = r*0.3+g*0.59+b*0.11;
            pixelData[i*4+0]=grey;
            pixelData[i*4+1]=grey;
            pixelData[i*4+2]=grey;
        }
        */

        let src = cv.imread(dataURL);
        let dst = new cv.Mat();

        cv.cvtColor(src, dst, cv.COLOR_RGB2GRAY, 0);
        cv.imshow(dataURL, dst);
        src.delete();
        dst.delete();

        //context.putImageData(imageData,0,0,0,0,dataURL.width,dataURL.height);
        lc.saveShape(LC.createShape('Image',{x:0,y:0,image:dataURL}));
        console.log('gray');

        //greyFlag = true;

    });

    $('#canny').click(function(e){
        e.preventDefault();

        console.log('canny');

        //canvas
        var dataURL = lc.getImage();
        console.log(dataURL);
        let src = cv.imread(dataURL);
        let dst = new cv.Mat();
        cv.cvtColor(src,src,cv.COLOR_RGB2GRAY,0);

        cv.Canny(src, dst, 50, 100, 3, false);
        cv.imshow(dataURL, dst);
        src.delete();
        dst.delete();

        lc.saveShape(LC.createShape('Image',{x:0,y:0,image:dataURL}));


    });
    
    $('#blur').click(function(e){
        e.preventDefault();

        console.log('blur');

        var dataURL = lc.getImage();

        let src = cv.imread(dataURL);
        let dst = new cv.Mat();
        let ksize = new cv.Size(3,3);

        cv.GaussianBlur(src,dst,ksize,0,0,cv.BORDER_DEFAULT);
        cv.imshow(dataURL, dst);
        src.delete();
        dst.delete();

        lc.saveShape(LC.createShape('Image',{x:0,y:0,image:dataURL}));
    });

});

//var canvas = document.getElementById("demo");
//var cxt = canvas.getContext("2d");

function getFileUrl(sourceId){
    var url;
    if(navigator.userAgent.indexOf("MSIE")>=1){
        url = document.getElementById(sourceId).value;
    }
    else if(navigator.userAgent.indexOf("Firefox")>0){
        url = window.URL.createObjectURL(document.getElementById(sourceId).files.item(0));
    }
    else if(navigator.userAgent.indexOf("Chrome")>0){
        url = window.URL.createObjectURL(document.getElementById(sourceId).files.item(0));
        
    }

    return url;
}


function preImg(sourceId){
    //cxt.clearRect(0,0,400,400);
    console.log('preImg');

    var url = getFileUrl(sourceId);
    //var imgPre = document.getElementById(targetId);
    imgPre = new Image();
    imgPre.src = url;

    imgPre.onload = function(e){
        e.preventDefault();

        //var cxt = document.getElementById("demo").getContext("2d");

        //cxt.drawImage(imgPre,0,0);

        lc = LC.init(
            document.getElementsByClassName('my-drawing')[0],
                {/*imageSize: imageSize,
                    imageSize: {width: 1000, height: 1000},*/
                    imageURLPrefix: 'literallycanvas-0.4.14/img',
                    tools:[LC.tools.Pencil, LC.tools.Eraser, LC.tools.Line, LC.tools.Rectangle, LC.tools.Ellipse, 
                        LC.tools.Polygon, LC.tools.Text, LC.tools.Pan, LC.tools.SelectShape, MyCannyTool]}
            );
        //lc.clear();
        lc.saveShape(LC.createShape('Image',{x:0,y:0,image:imgPre}));
    }
}    
      

