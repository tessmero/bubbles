

function spawnBubble(){
    if( global.allBubbles.length >= global.maxBubbles ){
        return
    }
    
    var side = randInt(0,2)*2   
    var a = global.screenCorners[side]
    var b = global.screenCorners[(side+1)%4]
    var pos = va(a,b,randRange(.4,.6))
    pos = pos.add( pos.sub(global.screenCenter).mul(global.allBubbles.length > 0 ? 1 : .1) )
    var vel = v(0,0)
    var m = global.bubbleGmag
    var g
    if(side==0) g = v(0,m) 
    if(side==1) g = v(-m,0) 
    if(side==2) g = v(0,-m) 
    if(side==3) g = v(m,0) 
    var b = new Bubble(pos,vel,g)
    
    global.allBubbles.push(b)
}

function update(dt) { 
    fitToContainer()  
    
    global.bubbleSpawnCountdown -= dt
    if( global.bubbleSpawnCountdown < 0 ){
        spawnBubble()
        global.bubbleSpawnCountdown = global.bubbleSpawnDelay
    }
        
    //debug
    global.debugLines = []
    
    
    global.allBubbles = global.allBubbles.filter(b => {
        b.update(dt)
        if( b.eaten || b.isOob() ){
            deleteBubble(b.rmi)
            return false
        }
        return true
    })
    
    // identify all intersecting pairs
    var allb = global.allBubbles
    var n = allb.length
    for( var i = 0 ; i < n ; i++ ) {
        var a = allb[i]
        for( var j = i+1 ; j < n ; j ++ ){
            var b = allb[j]
            var d2 = a.pos.sub(b.pos).m2()
            if( d2 < 2*(a.mr2+b.mr2) ){
                
                //found intersecting pair
                var ints = getCircleIntersections(a.pos.x,a.pos.y,a.maxRad, b.pos.x,b.pos.y,b.maxRad )
                
                // check if one is inside the other
                if( ((d2<a.mr2) || (d2<b.mr2))  ){// && (null==segmentsIntersection(a.pos,b.pos,ints[0], ints[1])) ) {
                    var rada = getAvgRad(i*global.nRadii)
                    var radb = getAvgRad(j*global.nRadii)
                    var smallerBubble = ((rada < radb) ? a : b)
                    smallerBubble.eaten = true
                    continue
                }
                
                // limit rads for intersecting pair
                global.debugLines.push( [a.pos,b.pos] )
                global.debugLines.push( ints )
                a.limitRads( ...ints, dt)
                b.limitRads( ...ints, dt )
                
            }
        }
    }
    
    updateBubbleRadPhysics(dt)
    
    
    
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
        global.screenCenter = v(.5,.5)
    }
}