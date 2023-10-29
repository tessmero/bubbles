class Bubble {
    constructor(pos, vel, g){
        this.pos = pos
        this.vel = vel
        this.g = g
        this.targetRad = randRange(...global.bubbleRad)
        this.rmi = getNewBubbleIndex(this.targetRad)
        
        this.lightAngleIndex = Math.floor(-0.4*global.nRadii)
    }
    
    isOob(){
        var x = this.pos.x
        var y = this.pos.y
        var m = global.bubbleRad[1]*10
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
        
        // compute light angle
        if( false ){
            var angle = global.mousePos.sub(this.pos).getAngle()
            this.lightAngleIndex = Math.floor( global.nRadii * angle  / twopi )
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
        var start = this.edgePoint( 0, 1, dilate )
        g.moveTo(...start)
        for( var i = 1 ; i < global.nRadii ; i++ )
            g.lineTo(...this.edgePoint( i, 1, dilate ))
        g.closePath()//g.lineTo(...start)
    }
    
    drawReflection(g,dilate=0){
        
        var off,spread,ai,bi,r1,r2,start 
        
        off = -global.nRadii/30
        spread = global.nRadii/30
        ai = Math.floor( off-spread + this.lightAngleIndex )
        bi = Math.floor( off+spread + this.lightAngleIndex )
        r1 = .7
        r2 = .9
        start = this.edgePoint(ai,r1,dilate)
        g.moveTo(...start)
        for( var i = ai+1 ; i <= bi ; i++ )
            g.lineTo(...this.edgePoint(i,r1,dilate))
        for( var i = bi ; i >= ai ; i-- )
            g.lineTo(...this.edgePoint(i,r2,dilate))
        g.closePath()//g.lineTo(...start)
        
        off = global.nRadii/30
        spread = global.nRadii/90
        ai = Math.floor( off-spread + this.lightAngleIndex )
        bi = Math.floor( off+spread + this.lightAngleIndex )
        r1 = .78
        r2 = .89
        start = this.edgePoint(ai,r1,dilate)
        g.moveTo(...start)
        for( var i = ai+1 ; i <= bi ; i++ )
            g.lineTo(...this.edgePoint(i,r1,dilate))
        for( var i = bi ; i >= ai ; i-- )
            g.lineTo(...this.edgePoint(i,r2,dilate))
        g.closePath()//g.lineTo(...start)
    }
    
    drawShadow(g, dilate=0){
        
        var off,spread,ai,bi,r1,r2,taper,roundr,n,first
        
        off = global.nRadii/2
        spread = global.nRadii/4
        ai = Math.floor( off-spread + this.lightAngleIndex )
        bi = Math.floor( off+spread + this.lightAngleIndex )
        r1 = .8
        r2 = 1
        taper = 1-r1
        roundr = .1
        n = bi-ai
        first = true
        for( var i = 0 ; i <= n ; i++ ) {
            var cdi = Math.abs(i-(n/2)) 
            var cdr = cdi / n
            if( cdr < roundr ) cdr = roundr
            var r = r1+taper * (cdr/.5)
            var p = this.edgePoint(ai+i,r,dilate)
            if( first ){
                g.moveTo(...p)
                first = false
            } else {
                g.lineTo(...p)
            }
        }
        for( var i = bi ; i >= ai ; i-- )
            g.lineTo(...this.edgePoint(i,r2,dilate))
        g.closePath()
    }
    
    edgePoint(i,r=1,dilate=0){
        i = nnmod(i,global.nRadii)
        r = r*global.bubbleRads[this.rmi+i] + dilate
        return [
            this.pos.x + r * global.bubbleRadCos[i],
            this.pos.y + r * global.bubbleRadSin[i]
        ]
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