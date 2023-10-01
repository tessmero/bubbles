class Bubble {
    constructor(pos, vel, g){
        this.pos = pos
        this.vel = vel
        this.g = g
        this.targetRad = randRange(...global.bubbleRad)
        this.rmi = getNewBubbleIndex(this.targetRad)
    }
    
    isOob(){
        var x = this.pos.x
        var y = this.pos.y
        var m = global.bubbleRad[1]*2
        return (x < -m) || (y < -m) || (x > 1+m) || (y > 1+m)
    }
    
    update(dt){
        
        var br = global.bubbleRads
        var brv = global.bubbleRadVels
        var n = global.nRadii
        var rmi = this.rmi
        
        // prepare for fast collision checks
        this.maxRad = getMaxRad(this.rmi) + global.bubblePadding
        this.mr2 = this.maxRad * this.maxRad
        
        this.pos = this.pos.add(this.vel.mul(dt))
        if( this.g ) this.vel = this.vel.add(this.g.mul(dt))
        this.vel = this.vel.mul( 1 - (global.bubbleFric * dt) )
        
        // propogate edge waves
        for( var i = 0 ; i < n ; i++ ){
            brv[rmi+i] -= (br[rmi+i] - avg(br[rmi+nnmod(i-1,n)],br[rmi+nnmod(i+1,n)] ) ) * dt * global.brNeightborFmag
        }
        
        
        // apply edge vels
        for( var i = 0 ; i < n ; i++ ){
            var r = br[this.rmi+i]
            var tr = global.bubbleRadLims[this.rmi+i]
            if( r > tr ){
                brv[this.rmi+i] -= (global.brFmag*dt)
            } else if( r < tr ) {
                brv[this.rmi+i] += (global.brFmag*dt)
            }
        }
        
        // prepare for limitRads to be called for each neighboring bubble
        for( var i = 0 ; i < global.nRadii ; i++ ){
            global.bubbleRadLims[this.rmi+i] = this.targetRad
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
                var irm = ir.getMagnitude()
                global.bubbleRadLims[this.rmi+i] = irm - global.bubblePadding
                global.bubbleRadVels[this.rmi+i] -= (global.brFmag*dt)
                
                var mul = (this.targetRad-irm)/this.targetRad
                if( mul > 0 ){
                    // push intersecting bubble
                    this.vel = this.vel.sub( vp( ir.getAngle(), Math.min( global.bubbleFlim, mul*global.bubbleFmag*dt ) ) )
                } else {
                    // pull / stick nearby bubble
                }
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