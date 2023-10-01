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
    backgroundColor: 'gray',
    bubbleColor: 'white',
    edgeColor: 'black',
    
    // physics settings
    maxBubbles: 30,
    nRadii: 30,
    bubblePadding: .01,
    
    // high-level OOP state
    allBubbles: [],
    
    // detailed state optimized vars
    // see math/rad_manager.js
    bubbleRad: [.04,.08],
    bubbleRads: null, // MxN bubbles' edge shapes
    bubbleRadVels: null, // MxN bubbles' edge momentums
    bubbleRadCos: null, // N pre-computed cosines
    bubbleRadSin: null, // N pre-computed sines
    brFriction: 1e-2, // bubble edge detail
    brNeightborFmag: 1e-3, // bubble edge detail
    brFmag: 1e-6, //
    bubbleFmag: 1e-5, // force between bubbles
    bubbleFlim: 1e-5,
    bubbleGmag: 1e-6, // bubble bouyancy
    bubbleFric: 1e-2, // bubble overal motion
    
    //
    bubbleSpawnCountdown: 0,
    bubbleSpawnDelay: 500,

    
    //debug
    debugLines: [],
    debugBubbles: false,
    showDebugLines: false,
}