class Bubble {
    constructor(pos, vel){
        this.pos = pos
        this.vel = vel
        this.rmi = getNewBubbleIndex()
    }
    
    update(dt){
        
        // prepare for fast collision checks
        this.maxRad = getMaxRad(this.rmi)
        this.mr2 = this.maxRad * this.maxRad
        
        this.pos = this.pos.add(this.vel.mul(dt))
    }

    // limit rads to prevent crossing line a-b
    limitRads(a,b){
        for( var i = 0 ; i < global.nRadii ; i++ ){
            var r = this.maxRad
            var x = this.pos.x + r * global.bubbleRadCos[i] 
            var y = this.pos.y + r * global.bubbleRadSin[i]
            var intr = segmentsIntersection( this.pos, v(x,y), a, b )
            if( intr ){
                global.bubbleRads[this.rmi+i] = this.pos.sub(intr).getMagnitude()
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