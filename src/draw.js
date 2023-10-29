
    
    
// Render graphics
function draw(fps, t) {
    var g = global.ctx
    var canvas = global.canvas
    g.fillStyle = global.backgroundColor
    g.fillRect( 0, 0, 1, 1 )
    g.lineWidth = global.edgeWidth

    if( true ){
        // draw bubbles
        g.fillStyle = global.edgeColor
        g.beginPath()
        global.allBubbles.forEach( b => b.draw(g,.005) )
        g.fill()
        g.fillStyle = global.bubbleColor
        g.beginPath()
        global.allBubbles.forEach( b => b.draw(g,0) )
        g.fill()
    }
    
    if( true ){
        // reflections on top of bubbles
        g.fillStyle = global.reflectionColor
        g.beginPath()
        global.allBubbles.forEach( b => b.drawReflection(g,0) )
        g.fill()
    }
    
    if( true ){
        // shadows on top of bubbles
        g.fillStyle = global.shadowColor
        g.beginPath()
        global.allBubbles.forEach( b => b.drawShadow(g,0) )
        g.fill()
    }
    
    // draw bubble debug
    if( global.debugBubbles ){
        global.allBubbles.forEach( b => b.drawDebug(g) )
    }
    
    // debug draw corners
    if( false ){
        global.screenCorners.forEach( c => {
            g.fillStyle = 'red'
            g.beginPath()
            g.moveTo(c.x,c.y)
            g.arc(c.x,c.y,global.bubbleRad[1],0,twopi)
            g.fill()
        })
    }
    
    // debug draw mouse
    if( false ){
        var c = global.mousePos
        g.fillStyle = 'red'
        g.beginPath()
        g.moveTo(c.x,c.y)
        g.arc(c.x,c.y,.01,0,twopi)
        g.fill()
    }

    //debug
    if( global.showDebugLines && global.debugLines ){
        g.lineWidth = .001
        g.strokeStyle = 'red'
        g.beginPath()
        global.debugLines.forEach(l => {
            g.moveTo(l[0].x,l[0].y)
            g.lineTo(l[1].x,l[1].y)
        })
        g.stroke()
    }
}