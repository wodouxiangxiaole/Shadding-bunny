#version 300 es

// Define the inputs. The first input
// will be the position and the second will be
// the color.
layout(location = 0) in vec3 position;
layout(location = 1) in vec4 color;
layout(location = 2) in vec3 Normal;
// Define the outputs. Since the output for the vertex
// position is a built-in variable, we just need to define
// an output for the color. Note that the default interpolation 
// qualifier is smooth, so it is not neccessary to write.
smooth out vec4 vertexColor;

uniform mat4 translation;
uniform mat4 scale;
uniform mat4 real_transform;

uniform mat4 viewProjection;

// u_world is just transform 
uniform mat4 u_world;

uniform mat4 u_worldInverseTranspose;

// eye/camera position
uniform vec3 u_viewWorldPosition;

// pass it into frag sahder
out vec3 v_surfaceToView;

uniform vec3 u_lightWorldPosition;

uniform vec3 u_lightWorldPosition_spot;

uniform vec3 u_lightDirection;
uniform float u_limit;

out vec3 lightDirection;
out float limit;

out vec3 v_surfaceToLight_spot;

out vec3 v_normal;
out vec3 v_surfaceToLight;





// Per-vertex transformations 
// should be computed in the vertex shader.
void main() {

    // Write the position to gl_Position.
    // Remember, we need to use homogenous coordinates.
    gl_Position = viewProjection* translation*real_transform* vec4(position, 1.0f);



    limit = u_limit;
    lightDirection = u_lightDirection;

    // Write the color to the output defined earlier.
    // vertexColor = color;

    v_normal = mat3(u_worldInverseTranspose) * Normal;

    // world surface coordinate
    vec3 surfaceWorldPosition = vec3(u_world * vec4(position, 1.0f));


    // calculate the direction of light and parse it into fragment shader
    v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;

    v_surfaceToLight_spot = u_lightWorldPosition_spot - surfaceWorldPosition;

    v_surfaceToView = u_viewWorldPosition - surfaceWorldPosition;
}