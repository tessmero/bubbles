

function update(dt) { 
    fitToContainer()  
    
    //debug
    global.debugLines = []
    
    
    global.allBubbles.forEach(b => b.update(dt))
    
    // identify all intersecting pairs
    var allb = global.allBubbles
    var n = allb.length
    for( var i = 0 ; i < n ; i++ ) {
        var a = allb[i]
        for( var j = i+1 ; j < n ; j ++ ){
            var b = allb[j]
            var d2 = a.pos.sub(b.pos).m2()
            if( d2 < (a.mr2+b.mr2) ){
                
                //found intersecting pair
                var ints = getCircleIntersections(a.pos.x,a.pos.y,a.maxRad, b.pos.x,b.pos.y,b.maxRad )
                global.debugLines.push( [a.pos,b.pos] )
                global.debugLines.push( ints )
                a.limitRads( ...ints )
                b.limitRads( ...ints )
                
            }
        }
    }
    
    
    
    //debug
    //console.log(nTicks)
    
    if( false ){
        global.autoResetCountdown -= dt
        if( global.autoResetCountdown < 0 ){
            resetGame()
        }
    }
}



var lastCanvasOffsetWidth = -1;
var lastCanvasOffsetHeight = -1;
function fitToContainer(){
    
    var cvs = global.canvas
    if( (cvs.offsetWidth!=lastCanvasOffsetWidth) || (cvs.offsetHeight!=lastCanvasOffsetHeight) ){
        
      cvs.width  = cvs.offsetWidth;
      cvs.height = cvs.offsetHeight;
        
        var padding = 0; // (extra zoom IN) thickness of pixels CUT OFF around edges
        var dimension = Math.max(cvs.width, cvs.height) + padding*2;
        global.canvasScale = dimension;
        global.canvasOffsetX = (cvs.width - dimension) / 2;
        global.canvasOffsetY = (cvs.height - dimension) / 2;
    global.ctx.setTransform(global.canvasScale, 0, 0, 
        global.canvasScale, global.canvasOffsetX, global.canvasOffsetY);
        
        var xr = -global.canvasOffsetX / global.canvasScale
        var yr = -global.canvasOffsetY / global.canvasScale
        global.screenCorners = [v(xr,yr),v(1-xr,yr),v(1-xr,1-yr),v(xr,1-yr)]
    }
}