// maintain array of MxN radii (global.bulbbleRads)
//  so tupposrt maximum of M bubbles
//  each bubble having N radii


// called in setup.js init()
function initBubbleRads(){
    
    var m = global.maxBubbles
    var n = global.nRadii
    
    global.bubbleRads = new Array(m*n).fill(null)
    global.bubbleRadLims = new Array(m*n).fill(null)
    global.bubbleRadVels = new Array(m*n).fill(0)
    global.bubbleRadSin = new Array(n).fill(null)
    global.bubbleRadCos = new Array(n).fill(null)
    
    // precompute trig functions
    for( var i = 0 ; i < n ; i++ ){
        var a = twopi*i/n
        global.bubbleRadSin[i] = Math.sin(a)
        global.bubbleRadCos[i] = Math.cos(a)
    }
    
    
    // more trig funcs for lighting details
    global.nLightScale = 100
    n = global.nRadii * global.nLightScale
    global.lightRadSin = new Array(n).fill(null)
    global.lightRadCos = new Array(n).fill(null)
    for( var i = 0 ; i < n ; i++ ){
        var a = twopi*i/n
        global.lightRadSin[i] = Math.sin(a)
        global.lightRadCos[i] = Math.cos(a)
    }
    
}

function updateBubbleRadPhysics(dt){
    var m = global.maxBubbles
    var n = global.nRadii
    var mn = m*n
    for( var i = 0 ; i < mn ; i++ ){
        if( ! global.bubbleRads[i] ) continue
        global.bubbleRadVels[i] *= (1.0-dt*global.brFriction)
        global.bubbleRads[i] += global.bubbleRadVels[i]*dt
    }
}

function deleteBubble(rmi){
    var n = global.nRadii
    for( var j = 0 ; j < n ; j++ ){
        global.bubbleRads[rmi+j] = null
        global.bubbleRadLims[rmi+j] = null
    }
}

function getAvgRad(rmi){
    var n = global.nRadii
    var total = 0
    for( var j = 0 ; j < n ; j++ )
        total += global.bubbleRads[rmi+j] 
    return total/n
}

// called in setup.js resetGame()
function clearBubbles(){
    global.bubbleRads.fill(null)
}

// called in bubble.js
function getMaxRad(rmi){
    var result = 0
    for( var j = 0 ; j < global.nRadii ; j++ ){
        var r = global.bubbleRads[rmi+j]
        if( r > result ){
            result = r
        }
    }
    return result
}

// called in bubble.js constructor
function getNewBubbleIndex(rad){
    var br = global.bubbleRads
    var m = global.maxBubbles
    var n = global.nRadii
    var mn = m*n
    
    // find unoccupied index
    for( var i = 0 ; i < mn ; i+=n ){
        if( br[i] == null ){
            
            // set starting radius
            for( var j = 0 ; j < n ; j++ ){
                br[i+j] = rad
                global.bubbleRadLims[i+j] = rad
            }
            return i
        }
    }
}
