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
    bubbleColor: '#f093bf',
    edgeColor: '#b44e7e',
    shadowColor: '#ed74aa',
    reflectionColor: 'white',
    edgeWidth: .002, // only for reflections
    
    // physics settings
    maxBubbles: 20,
    nRadii: 100,
    bubblePadding: .01,
    
    
    // high-level OOP state
    allBubbles: [],
    
    // detailed state optimized vars
    // see math/rad_manager.js
    bubbleRad: [.04,.11],
    bubbleRads: null, // MxN bubbles' edge shapes
    bubbleRadVels: null, // MxN bubbles' edge momentums
    bubbleRadCos: null, // N pre-computed cosines
    bubbleRadSin: null, // N pre-computed sines
    brFriction: 1e-2, // bubble edge detail
    brNeightborFmag: 1e-3, // bubble edge detail
    brFmag: 1e-6, //
    bubbleFmag: 1e-5, // force between bubbles
    bubbleFlim: 1e-5,
    bubbleGmag: 5e-7, // bubble bouyancy
    bubbleFric: 1e-2, // bubble overal motion
    
    //
    bubbleSpawnCountdown: 0,
    bubbleSpawnDelay: 800,

    
    //debug
    debugLines: [],
    debugBubbles: false,
    showDebugLines: false,
}