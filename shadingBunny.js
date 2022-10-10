/*
    Initialization
*/
"use strict";
// The WebGL context.
var gl
var canvas;

// Variables for spinning the cube
var angle;
var angleX;
var angleY;
var angularSpeed;
var cubeX;
var cubeZ;

var cone_angle;

var cone_angularSpeed;

// point light position
var cube_translation_position

var v_normal;

// Sets up the canvas and WebGL context.
function initializeContext() {
    // Get and store the webgl context from the canvas    
    canvas = document.getElementById("myCanvas");
    gl = canvas.getContext("webgl2");

    // Determine the ratio between physical pixels and CSS pixels
    const pixelRatio = window.devicePixelRatio || 1;

    // Set the width and height of the canvas
    // using clientWidth and clientHeight
    canvas.width = pixelRatio * canvas.clientWidth;
    canvas.height = pixelRatio * canvas.clientHeight;

    // Set the viewport size
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Set the clear color to white.
    gl.clearColor(1, 1, 1, 0);
    // Set the line width to 1.0.
    gl.lineWidth(1.0);

    // TODO: Enable depth testing
    gl.enable(gl.DEPTH_TEST);

    logMessage("WebGL initialized.");
}

async function setup() {
    // Initialize the context.
    initializeContext();

    // Set event listeners
    setEventListeners(canvas);

    colorCube();

    colorCone();

    // Create cube data.
    colorBunny();



    // Create vertex buffer data.
    createBuffers();

    // Load shader files
    await loadShaders();

    

    // Compile the shaders
    compileShaders();

    // Create vertex array objects
    createVertexArrayObjects();

    // TODO: Initialize angle and angularSpeed.
    angle = 0.0;
    angleX = 0.0;
    angleY = 0.0;
    angularSpeed = 1.0;
    cubeX = 0.0;
    cubeZ = 0.0;
    

    cone_angularSpeed = 1.0;

    cone_angle = 0.0;
    

    // Draw!
    requestAnimationFrame(render)

};

window.onload = setup;

// Vertex position is in the format [x0, y0, z0, x1, y1, ...]
// Note that a vertex can have multiple attributes (ex. colors, normals, texture coordinates, etc.)
var positions = [];

var cube_positions = [];

var cubeColors = [];
// Vertex color data in the format [r0, g0, b0, a0, r1, g1, ...].
// Note that for every vertex position, we have an associated color.
// The number of tuples between different vertex attributes must be the same.
var colors = [];



var cone_positions = [];
var coneColors = [];

function colorCone(){
    var cone_vertices =[
        vec3(1.5, 0, 0), 
        vec3(-1.5, 1, 0), 
        vec3(-1.5, 0.809017,	0.587785),
        vec3(-1.5, 0.309017,	0.951057), 
        vec3(-1.5, -0.309017, 0.951057), 
        vec3(-1.5, -0.809017, 0.587785),
        vec3(-1.5, -1, 0), 
        vec3(-1.5, -0.809017, -0.587785),
        vec3(-1.5, -0.309017, -0.951057), 
        vec3(-1.5, 0.309017,	-0.951057), 
        vec3(-1.5, 0.809017,	-0.587785)];

    var cone_indices = 
        [0, 1, 2,
        0, 2, 3,
        0, 3, 4,
        0, 4, 5,
        0, 5, 6,
        0, 6, 7,
        0, 7, 8,
        0, 8, 9,
        0, 9, 10,
        0, 10, 1];
        
    var vertexColors =[0.0, 0.0, 0.0, 1.0];

    for (var i = 0; i < cone_indices.length; i++){
        cone_positions.push(cone_vertices[cone_indices[i]]);
        coneColors.push(vertexColors);
    } 

    
    cone_positions = flatten(cone_positions);
    coneColors = flatten(coneColors);
    
}

function colorCube()
{
    quad(0, 1);
    quad(1, 2);
    quad(2, 3);
    quad(3, 0);
    quad(4, 5);
    quad(5, 6);
    quad(6, 7);
    quad(7, 4);
    quad(0, 4);
    quad(1, 5);
    quad(2, 6);
    quad(3, 7);

    cube_positions = flatten(cube_positions);
    cubeColors = flatten(cubeColors);
    // console.log(cube_positions.length);
    

}

function quad(a, b){
    var cube_vertices = [
        vec3(-0.1, -0.1, -0.1),
        vec3(0.1, -0.1, -0.1),
        vec3(0.1, 0.1, -0.1),
        vec3(-0.1, 0.1, -0.1),
        vec3(-0.1, -0.1, 0.1),
        vec3(0.1, -0.1, 0.1),
        vec3(0.1, 0.1, 0.1),
        vec3(-0.1, 0.1, 0.1),
    ];

    var vertexColors = [[0.0, 0.0, 0.0, 1.0]];

    var indices = [ a, b];

    for ( var i = 0; i < indices.length; ++i ) {
        cube_positions.push( cube_vertices[indices[i]] );
        cubeColors.push(vertexColors[0]);
    }

}

function colorBunny()
{
    var vertices = get_vertices();
    var faces = get_faces();

    v_normal = setNomal(vertices, faces);

    // console.log(v_normal)
    v_normal = flatten(v_normal);





    faces = flatten(faces);

    var vertexColors = [1.0, 0.0, 0.0 ,1.0];

    for (var i = 0; i < faces.length; i++){
        faces[i] = faces[i] - 1;
    }

    for (var i = 0; i < faces.length; i++){
        positions.push(vertices[faces[i]]);
        colors.push(vertexColors);
    }

    

    // flatten

    
    positions = flatten(positions);
    colors = flatten(colors);
    

    // console.log(positions.length);

}

function normal(v1, v2, v3){
    var l1 = subtract(v2, v1);
    var l2 = subtract(v3, v1);
    var n = cross(l1, l2);
    return normalize(n);
}
function setNomal(vertices, faces){
    // var result = [];
    // var v1, v2, v3, n;
    // var vector1;
    // var vector2;

    // // get three vertices from one face
    // // do the calculation and get the normalize vector
    // // push it to result
    // // result[i] ===> face[i]; result[i] contains the index of face normal vector;
    // // i.e. result[1] contain the face[1]'s normal vector
    // for(var i= 0; i < f.length; i++){
    //     v1 = v[f[i][0] - 1];
    //     v2 = v[f[i][1] - 1];
    //     v3 = v[f[i][2] - 1];
    //     vector1 = subtract(v2, v1);
    //     vector2 = subtract(v3, v1);
    //     n = cross(vector1, vector2);
    //     n = normalize(n);
    //     result.push(n);
    // }

    // return result;
    var result = [];
    var temp = vertices.map(each =>{
        return vec3(0, 0, 0);
    });


    faces.forEach(each => {
        var v1 = vertices[each[0] -1];
        var v2 = vertices[each[1] -1];
        var v3 = vertices[each[2] -1];
        var vector1 = subtract(v2, v1);
        var vector2 = subtract(v3, v1);
        var n = cross(vector1, vector2);
        n = normalize(n);
    
   
        temp[each[0] - 1] = add(temp[each[0] - 1], n)
        temp[each[1] - 1] = add(temp[each[1] - 1], n)
        temp[each[2] - 1] = add(temp[each[2] - 1], n)
    });


    var flat_faces = flatten(faces).map(element => {
        return element -= 1
    });

    flat_faces.forEach(each => {
        result.push(normalize(temp[each]));
    });


    return result;
}


// Buffer objects
var position_buffer;
var color_buffer;
var cube_buffer;
var cube_color_buffer;
var cone_buffer;
var cone_color_buffer;

var normal_buffer;


// Creates buffers using provided data.
function createBuffers() {
    // Create a position buffer for the vertices.
    // In WebGL, the default winding order is counter-clock-wise,
    // meaning that the order of vertices in a triangle must occur
    // in a counter-clock-wise sequence relative to the viewer to be
    // considered front-facing.
    position_buffer = gl.createBuffer();


    // Bind the buffer as an ARRAY_BUFFER to tell WebGL it will
    // be used as a vertex buffer. Note that if another buffer was previously
    // bound to ARRAY_BUFFER, that binding will be broken.
    gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer);



    // Set the buffer data of the buffer bound to target 
    // ARRAY_BUFFER with STATIC_DRAW usage. The usage is a hint
    // that tells the API & driver the expected usage pattern of the backing
    // data store. This allows it to make some optimizations.
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array(positions),
        gl.STATIC_DRAW);


    // Repeat for the color vertex data.
    color_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array(colors),
        gl.STATIC_DRAW);

    cube_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cube_buffer);
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array(cube_positions),
        gl.STATIC_DRAW);
    
    cube_color_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cube_color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array(cubeColors),
        gl.STATIC_DRAW);

    cone_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cone_buffer);
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array(cone_positions),
        gl.STATIC_DRAW);

    cone_color_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cone_color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array(coneColors),
        gl.STATIC_DRAW);

    


    normal_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normal_buffer);
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array(v_normal),
        gl.STATIC_DRAW);

    


    logMessage("Created buffers.");
}

// Shader sources
var vs_source;
var fs_source;

function loadShaderFile(url) {
    return fetch(url).then(response => response.text());
}

// Loads the shader data from the files.
async function loadShaders() {
    // Specify shader URLs for your
    // local web server.
    const shaderURLs = [
        './main.vert',
        './main.frag'
    ];

    // Load shader files.
    const shader_files = await Promise.all(shaderURLs.map(loadShaderFile));

    // Assign shader sources.
    vs_source = shader_files[0];
    fs_source = shader_files[1];

    // logMessage(vs_source);
    // logMessage(fs_source);

    logMessage("Shader files loaded.")
}

// Shader handles
var vs;
var fs;
var prog;


// Compile the GLSL shader stages and combine them
// into a shader program.
function compileShaders() {
    // Create a shader of type VERTEX_SHADER.
    vs = gl.createShader(gl.VERTEX_SHADER);
    // Specify the shader source code.
    gl.shaderSource(vs, vs_source);
    // Compile the shader.
    gl.compileShader(vs);
    // Check that the shader actually compiled (COMPILE_STATUS).
    // This can be done using the getShaderParameter function.
    // The error message can be retrieved with getShaderInfoLog.
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
        logError(gl.getShaderInfoLog(vs));
        gl.deleteShader(vs);
    }

    // Repeat for the fragment shader.
    fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fs_source);
    gl.compileShader(fs);

    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
        logError(gl.getShaderInfoLog(fs));
        gl.deleteShader(fs);
    }

    // Next we have to create a shader program
    // using the shader stages that we compiled.

    // Create a shader program.
    prog = gl.createProgram();

    // Attach the vertex and fragment shaders
    // to the program.
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);

    // Link the program
    gl.linkProgram(prog);

    // Check the LINK_STATUS using getProgramParameter
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        logError(gl.getProgramInfoLog(prog));
    }

    logMessage("Shader program compiled successfully.");
}



// Sets the uniform variables in the shader program
function setUniformVariables() {


    var matrix = mat4();

    // Tell the current rendering state to use the shader program
    gl.useProgram(prog);


    // stack1.push(inverse(translation_matrix));
    // stack2.push(translation_matrix);

    // Get the location of the uniform variable in the shader


    var transform_matrix = mat4();

    // along y-axis rotate
    var modelX = rotate(angleX, [0.0, 1.0, 0.0]);

    // along x-axis rotate
    var modelY = rotate(angleY, [1.0, 0.0, 0.0]);
    
    transform_matrix = mult(transform_matrix, modelY);

    transform_matrix = mult(transform_matrix, modelX);

    
    var translation_matrix = mat4();

    translation_matrix = translate(newX, newY, newZ);

    // TODO: Define a camera location
    var eye = vec3(0, 0, 10);


    // TODO: Define the target position; reference point
    var target = vec3(0, 0, 0);

    // TODO: Define the up direction; up vector
    var up = vec3(0, 1, 0);

    // TODO: Create view matrix.
    var view = lookAt(
        eye,
        target,
        up
    );



    var translationLocation = gl.getUniformLocation(prog, "translation");
    var transformLocation = gl.getUniformLocation(prog, "real_transform");



    gl.uniformMatrix4fv(translationLocation,false, flatten(translation_matrix));
    gl.uniformMatrix4fv(transformLocation, false, flatten(transform_matrix))
    



    transform_matrix = mult(transform_matrix, translation_matrix);
    // TODO: Calculate the aspect ratio.
    var aspect = canvas.width / canvas.height;

    // TODO: Create a projection matrix.
    var projection = perspective(60, aspect, 0.1, 1000.0);

    var viewProjectionLocation = gl.getUniformLocation(prog, "viewProjection");
    var viewProjection_matrix = mult(projection,view);
    gl.uniformMatrix4fv(viewProjectionLocation, false, flatten(viewProjection_matrix));



    var lightWorldPositionLocation = gl.getUniformLocation(prog, "u_lightWorldPosition");
    var worldLocation = gl.getUniformLocation(prog, "u_world");

    var worldInverseTranspose = gl.getUniformLocation(prog, "u_worldInverseTranspose");

    ////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////POINT LIGHT ////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////

    var u_world = mat4();
    u_world = mult(u_world, transform_matrix);
    u_world = mult(u_world, translate(newX, newY, newZ))

    var inverseTranspose = transpose(inverse(u_world));

    gl.uniformMatrix4fv(
        worldLocation, false,
        flatten(u_world)
    );

    gl.uniform3fv(
        lightWorldPositionLocation,
        [5.0 * Math.cos((cubeX*3.1415)/180), 5.0, 5.0*Math.sin((cubeZ*3.1415)/180)]
    )

    gl.uniformMatrix4fv(
        worldInverseTranspose, false,
        flatten(inverseTranspose)
    )
    ////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////SPECULAR ////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////

    var viewWorldPositionLocation = gl.getUniformLocation(prog, "u_viewWorldPosition");
    gl.uniform3fv(viewWorldPositionLocation, [0, 0, 10]);
    var shiness = gl.getUniformLocation(prog, "u_shininess");
    gl.uniform1f(shiness, 150.0);



    ////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////SPOT LIGHT ////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////
    var lightWorldPositionLocation_spot = gl.getUniformLocation(prog, "u_lightWorldPosition_spot");
    var limitLocation = gl.getUniformLocation(prog, "u_limit");
    var lightDirectionLocation = gl.getUniformLocation(prog, "u_lightDirection");
    // var attenuationLocation


    var lightDirection = lookAt([0, 4, 2], [0, 0, 0], [0, 1, 0]);
    lightDirection = mult(lightDirection, rotate( -cone_angle, [0.0, 0.0, 1.0]))


    gl.uniform3fv(lightDirectionLocation, [-lightDirection[2][0],-lightDirection[2][1], -lightDirection[2][2]]);
    gl.uniform3fv(lightWorldPositionLocation_spot, [0.0, 4.0, 2.0]);
    gl.uniform1f(limitLocation, Math.cos(0.261799));

    
    // PHONG SHADING

    // for the material
    var Ka = gl.getUniformLocation(prog, "material_ambient");
    var Kd = gl.getUniformLocation(prog, "material_diffuse");
    var Ks = gl.getUniformLocation(prog, "material_specular");
    gl.uniform1f(Ka, 0.75);
    gl.uniform1f(Kd, 0.1);
    gl.uniform1f(Ks, 0.2);



    // for the light
    var La = gl.getUniformLocation(prog, "light_ambient");
    var Ld = gl.getUniformLocation(prog, "light_diffuse");
    var Ls = gl.getUniformLocation(prog, "light_specular");
    gl.uniform3fv(La, [1, 0.8, 0]);
    gl.uniform3fv(Ld, [1, 0.4, 0]);
    gl.uniform3fv(Ls, [0.4, 0.6, 0.6]);




    // logMessage("Set uniform variables.")
}

function cube_uniformviriable(){
    var matrix = mat4();
    gl.useProgram(prog);
    var eye = vec3(0, 0, 10);
    var target = vec3(0, 0, 0);

    var up = vec3(0, 1, 0);
    var view = lookAt(
        eye,
        target,
        up
    );

    cube_translation_position = translate(5.0 * Math.cos((cubeX*3.1415)/180), 5.0, 5.0*Math.sin((cubeZ*3.1415)/180));
    
    var transform_matrix = matrix;


    var translationLocation = gl.getUniformLocation(prog, "translation");
    var transformLocation = gl.getUniformLocation(prog, "real_transform");
    gl.uniformMatrix4fv(translationLocation,false, flatten(cube_translation_position));
    gl.uniformMatrix4fv(transformLocation, false, flatten(transform_matrix))
    

    var aspect = canvas.width / canvas.height;
    var projection = perspective(60, aspect, 0.1, 1000.0);

    var viewProjectionLocation = gl.getUniformLocation(prog, "viewProjection");
    var viewProjection_matrix = mult(projection,view);
    gl.uniformMatrix4fv(viewProjectionLocation, false, flatten(viewProjection_matrix));
    
}

function cone_uniformvirable(){
    var matrix = mat4();
    gl.useProgram(prog);
    var eye = vec3(0, 0, 10);
    var target = vec3(0, 0, 0);

    var up = vec3(0, 1, 0);
    var view = lookAt(
        eye,
        target,
        up
    );
    


    var transform_matrix = matrix;

    transform_matrix = mult(transform_matrix, translate(0.0, 4.0, 2.0));

    transform_matrix = mult(transform_matrix, rotate(cone_angle, [0.0, 0.0, 1.0]))

    transform_matrix = mult(transform_matrix, rotate(90.0, [0.0, 0.0, 1.0]));
    
    transform_matrix = mult(transform_matrix, scalem(0.3, 0.3, 0.3));

    transform_matrix = mult(transform_matrix, translate(-1.5, 0.0, 0.0));


    var translation_matrix = mat4();


    var translationLocation = gl.getUniformLocation(prog, "translation");
    var transformLocation = gl.getUniformLocation(prog, "real_transform");
    gl.uniformMatrix4fv(translationLocation,false, flatten(translation_matrix));
    gl.uniformMatrix4fv(transformLocation, false, flatten(transform_matrix))

    var aspect = canvas.width / canvas.height;
    var projection = perspective(60, aspect, 0.1, 1000.0);
    var viewProjectionLocation = gl.getUniformLocation(prog, "viewProjection");
    var viewProjection_matrix = mult(projection,view);
    gl.uniformMatrix4fv(viewProjectionLocation, false, flatten(viewProjection_matrix));

    

}

// Handle for the vertex array object
var vao;
var vao_cube;
var vao_cone;


// Creates VAOs for vertex attributes
function createVertexArrayObjects() {

    // Create vertex array object
    vao = gl.createVertexArray();

    // Bind vertex array so we can modify it
    gl.bindVertexArray(vao);


    // Get shader location of the position vertex attribute.
    var pos_idx = gl.getAttribLocation(prog, "position");

    // Bind the position buffer again
    gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer);

    // Specify the layout of the data using vertexAttribPointer.
    gl.vertexAttribPointer(pos_idx, 3, gl.FLOAT, false, 0, 0);


    // Enable this vertex attribute.
    gl.enableVertexAttribArray(pos_idx);


    // Repeat for the color vertex attribute. The size is now 4. 
    var col_idx = gl.getAttribLocation(prog, "color");
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    gl.vertexAttribPointer(col_idx, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(col_idx);

    // Unbind array to prevent accidental modification.
    gl.bindVertexArray(null);

    logMessage("Created VAOs.");


    //////////////////////////// set normal ///////////////////////////////
    gl.bindVertexArray(vao);
    var normalLocation = gl.getAttribLocation(prog, "Normal");
    gl.enableVertexAttribArray(normalLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, normal_buffer);
    gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);

    ////////////////////////////////////////////////////////

    vao_cube = gl.createVertexArray();

    // Bind vertex array so we can modify it
    gl.bindVertexArray(vao_cube);


    // Get shader location of the position vertex attribute.
    var pos_idx = gl.getAttribLocation(prog, "position");

    

    // Bind the position buffer again
    gl.bindBuffer(gl.ARRAY_BUFFER, cube_buffer);

    // Specify the layout of the data using vertexAttribPointer.
    gl.vertexAttribPointer(pos_idx, 3, gl.FLOAT, false, 0, 0);


    // Enable this vertex attribute.
    gl.enableVertexAttribArray(pos_idx);


    // Repeat for the color vertex attribute. The size is now 4. 
    var col_idx = gl.getAttribLocation(prog, "color");
    gl.bindBuffer(gl.ARRAY_BUFFER, cube_color_buffer);
    gl.vertexAttribPointer(col_idx, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(col_idx);

    // Unbind array to prevent accidental modification.
    gl.bindVertexArray(null);


    ////////////////////////////////////////////////////////
    /////////////////cone vao//////////////////////////////
    ///////////////////////////////////////////////////////
    vao_cone = gl.createVertexArray();

    // Bind vertex array so we can modify it
    gl.bindVertexArray(vao_cone);


    // Get shader location of the position vertex attribute.
    var pos_idx = gl.getAttribLocation(prog, "position");

    

    // Bind the position buffer again
    gl.bindBuffer(gl.ARRAY_BUFFER, cone_buffer);

    // Specify the layout of the data using vertexAttribPointer.
    gl.vertexAttribPointer(pos_idx, 3, gl.FLOAT, false, 0, 0);


    // Enable this vertex attribute.
    gl.enableVertexAttribArray(pos_idx);


    // Repeat for the color vertex attribute. The size is now 4. 
    var col_idx = gl.getAttribLocation(prog, "color");
    gl.bindBuffer(gl.ARRAY_BUFFER, cone_color_buffer);
    gl.vertexAttribPointer(col_idx, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(col_idx);

    // Unbind array to prevent accidental modification.
    gl.bindVertexArray(null);

}

var previousTimestamp;

var right = 1;


function updateAngle(timestamp) {
    // TODO: Initialize previousTimestamp the first time this is called.
    if (previousTimestamp === undefined) {
        // console.log("previous" + previousTimestamp);
        previousTimestamp = timestamp;
    }

    // TODO: Calculate the change in time in seconds
    

    // TODO: Update the angle using angularSpeed and the change in time
    cubeX += angularSpeed;
    cubeZ -= angularSpeed;

    

    if(cone_angle == 30){
        right = 0;
    }
    
    if(cone_angle == -30){
        right = 1;
    }

    if(right == 1){
        cone_angle += cone_angularSpeed;
    }
    else{
        cone_angle -= cone_angularSpeed;
    }


}
// Draws the vertex data.
function render(timestamp) {
    // TODO: Clear the color and depth buffers
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Set the rendering state to use the shader program
    gl.useProgram(prog);

    // TODO: Call updateAngle
    updateAngle(timestamp)

    // TODO: Update uniforms

    cube_uniformviriable();

    gl.bindVertexArray(vao_cube);
    gl.drawArrays(gl.LINES, 0, cube_positions.length/3);

    cone_uniformvirable();
    gl.bindVertexArray(vao_cone);

    gl.drawArrays(gl.LINE_STRIP, 0, cone_positions.length/3);

    setUniformVariables();
    gl.bindVertexArray(vao);
    gl.drawArrays(gl.TRIANGLES, 0, (positions.length)/3);
    


    // Call this function repeatedly with requestAnimationFrame.
    requestAnimationFrame(render);
}

/*
    Input Events
*/
var newX = 0.0, newY = 0.0, newZ = 0.0;
var rotating;
var dragging;

function setEventListeners(canvas) {

    dragging = false;
    rotating = false;

    canvas.addEventListener('mousedown', function(event){
        let x = event.clientX, y = event.clientY;
        let rect = event.target.getBoundingClientRect();
        if(rect.left <= x && x < rect.right && rect.top <= y && y <= rect.bottom && event.which == 1){
            dragging = true;
        }

        if(event.which == 3){
            // right mouse click
            rotating = true;
        }
    })

    canvas.addEventListener('mouseup', function(event){
         dragging = false;
         rotating = false;
    });

    canvas.addEventListener('mouseleave', function(event){
        dragging = false;
        rotating = false;
    });

    var x = 0.0, y = 0.0, z = 0.0;
    var lastX = -1, lastY = -1;


    canvas.addEventListener('mousemove', function(event) {
        if(dragging){
            let rect = event.target.getBoundingClientRect();
            x = event.clientX - rect.left, y = event.clientY - rect.top;
            let midx = (rect.right - rect.left)/2, midy = (rect.bottom - rect.top)/2;
            x = ((x) - midx) / midx;
            y = (midy - (y)) / midy;
            newX = 5*x;
            newY = 5*y;
        }

        if(rotating){
            let rect = event.target.getBoundingClientRect();
            x = event.clientX - rect.left, y = event.clientY - rect.top, z = 0.0;
            let midx = (rect.right - rect.left)/2, midy = (rect.bottom - rect.top)/2;
            x = ((x) - midx) / midx;
            y = (midy - (y)) / midy;
            rotateBunny(lastX, lastY, x, y);        
        }
        lastX = x;
        lastY = y;
    });

    var scale = 0.0
    canvas.addEventListener('wheel', function(event){

        if(event.deltaY < 0){
            if(scale < 4){
                scale += (Math.max(.125, (event.deltaY * -0.01)));
            }
        }
        else{
            if(scale > -4){
                scale += Math.min(-0.125 ,event.deltaY * 0.01);
            }
        }

        newZ = scale;
    })

    var cone_stop = 0;
    var cube_stop = 0;


    canvas.addEventListener('keypress', function(event){
        if(event.key == 'r'){
            angleX = 0.0;
            angleY = 0.0;
            newX = newY = newZ = 0.0;
        }
        if(event.key == 'p'){
            if(cube_stop == 0){
                cube_stop = 1;
                angularSpeed = 0;
            }
            else{
                cube_stop = 0;
                angularSpeed = 1;
            }
        }
        if(event.key == 's'){
            if(cone_stop == 0){
                cone_stop = 1;
                cone_angularSpeed = 0;
            }
            else{
                cone_stop = 0;
                cone_angularSpeed = 1;
            }
        }
    })


}

function rotateBunny(lastX, lastY, x, y){
    var xDist = (x - lastX);
    var yDist = (lastY - y);
    angleX += xDist * 360
    angleY += yDist * 360

    console.log(x);

}

// Logging

function logMessage(message) {
    document.getElementById("messageBox").innerText += `[msg]: ${message}\n`;
}

function logError(message) {
    document.getElementById("messageBox").innerText += `[err]: ${message}\n`;
}

function logObject(obj) {
    let message = JSON.stringify(obj, null, 2);
    document.getElementById("messageBox").innerText += `[obj]:\n${message}\n\n`;
}
