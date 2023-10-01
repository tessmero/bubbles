const global = {
    // graphics context
    canvas: null,
    ctx: null,
    
    // relate pixels to virtual units
    canvasOffsetX: 0,
    canvasOffsetY: 0,
    canvasScale: 0,

    // mouse
    canvasMousePos: v(0,0),     //pixels
    mousePos: v(0,0),           //internal units

    // 
    backgroundColor: 'white',
    bubbleColor: 'white',
    edgeColor: 'black',
    
    // physics settings
    maxBubbles: 10,
    nRadii: 10,
    
    // high-level OOP state
    allBubbles: [],
    
    // detailed state optimized vars
    // see math/rad_manager.js
    bubbleRads: null, // MxN bubbles' edge shapes
    bubbleRadVels: null, // MxN bubbles' edge momentums
    bubbleRadCos: null, // N pre-computed cosines
    bubbleRadSin: null, // N pre-computed sines
    
    //
    autoResetCountdown: 0,
    autoResetDelay: 1000,

    
    //debug
    debugLines: [],
}