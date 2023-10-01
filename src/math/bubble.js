class Bubble {
    constructor(pos, vel){
        this.pos = pos
        this.vel = vel
        this.rmi = getNewBubbleIndex()
        this.targetRad = global.defaultBubbleRad
    }
    
    update(dt){
        
        // prepare for fast collision checks
        this.maxRad = getMaxRad(this.rmi) + global.bubblePadding
        this.mr2 = this.maxRad * this.maxRad
        
        this.pos = this.pos.add(this.vel.mul(dt))
        
        for( var i = 0 ; i < global.nRadii ; i++ ){
            var r = global.bubbleRads[this.rmi+i]
            var tr = global.bubbleRadLims[this.rmi+i]
            if( r > tr ){
                global.bubbleRadVels[this.rmi+i] -= (global.brFmag*dt)
            } else if( r < tr ) {
                global.bubbleRadVels[this.rmi+i] += (global.brFmag*dt)
            }
        }
    }

    // limit rads to prevent crossing line a-b
    limitRads(a,b,dt){
        for( var i = 0 ; i < global.nRadii ; i++ ){
            var r = global.bubbleRads[this.rmi+i] + global.bubblePadding
            var x = this.pos.x + r * global.bubbleRadCos[i] 
            var y = this.pos.y + r * global.bubbleRadSin[i]
            var intr = segmentsIntersection( this.pos, v(x,y), a, b )
            if( intr ){
                var ir = intr.sub(this.pos)
                global.bubbleRadLims[this.rmi+i] = ir.getMagnitude() - global.bubblePadding
                global.bubbleRadVels[this.rmi+i] -= (global.brFmag*dt)
                this.vel = this.vel.sub( vp( ir.getAngle(), global.bubbleFmag*dt ) )
            } else {
                global.bubbleRadLims[this.rmi+i] = this.targetRad
            }
        }
    }
    
    draw(g,dilate=0){
        
        for( var i = 0 ; i < global.nRadii ; i++ ){
            var r = global.bubbleRads[this.rmi+i] + dilate
            var x = this.pos.x + r * global.bubbleRadCos[i] 
            var y = this.pos.y + r * global.bubbleRadSin[i]
            if( i == 0 ){
                g.moveTo(x,y)
            } else {
                g.lineTo(x,y)
            }
        }
        
    }
    
    drawDebug(g){
        g.strokeStyle = 'green'
        g.lineWidth = .001
        for( var i = 0 ; i < global.nRadii ; i++ ){
            var r = global.bubbleRads[this.rmi+i]
            var x = this.pos.x + r * global.bubbleRadCos[i] 
            var y = this.pos.y + r * global.bubbleRadSin[i]
            g.moveTo(this.pos.x, this.pos.y)
            g.lineTo(x,y)
        }
        g.stroke()
    }
}