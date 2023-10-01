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
    nRadii: 100,
    bubblePadding: .01,
    
    // high-level OOP state
    allBubbles: [],
    
    // detailed state optimized vars
    // see math/rad_manager.js
    defaultBubbleRad: .1,
    bubbleRads: null, // MxN bubbles' edge shapes
    bubbleRadVels: null, // MxN bubbles' edge momentums
    bubbleRadCos: null, // N pre-computed cosines
    bubbleRadSin: null, // N pre-computed sines
    brFriction: 1e-2, //
    brFmag: 1e-6, //
    bubbleFmag: 1e-9,
    
    //
    autoResetCountdown: 0,
    autoResetDelay: 1000,

    
    //debug
    debugLines: [],
    debugBubbles: false,
    showDebugLines: false,
}