#version 300 es

precision mediump float;
// Define the input to the fragment shader
// based on the output from the vertex shader,, assuming
// there are no intermediate shader stages.
in mediump vec4 vertexColor;

// Define the color output.
out mediump vec4 outputColor;

in vec3 lightDirection;
in float limit;
in mediump vec3 v_surfaceToLight_spot;

in vec3 v_surfaceToView;

// import from vertex shader
in mediump vec3 v_normal;
in mediump vec3 v_surfaceToLight;

uniform float u_shininess;

uniform vec3 light_ambient;
uniform vec3 light_diffuse;
uniform vec3 light_specular;

uniform float material_ambient;
uniform float material_diffuse;
uniform float material_specular;


void main() {

    vec3 normal = normalize(v_normal);
    vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
    vec3 surfaceToLightDirection_spot = normalize(v_surfaceToLight_spot);

    vec3 surfaceToViewDirection = normalize(v_surfaceToView);
    vec3 halfVector_point = normalize(surfaceToLightDirection + surfaceToViewDirection);
    vec3 halfVector_spot = normalize(surfaceToLightDirection_spot + surfaceToViewDirection);

    float specularPoint = 0.0;
    float specularSpot = 0.0;
    
    float attenuationFactor = 1.0;


    float pointLight = max(dot(normal, surfaceToLightDirection), 0.0);

    float spotLight = 0.0;
    float dotFromDirection = dot(surfaceToLightDirection_spot, -lightDirection);


    if(dotFromDirection >= limit){
        spotLight = dot(normal, surfaceToLightDirection_spot);
    }

    if( pointLight > 0.0){
        specularPoint = pow(dot(normal, halfVector_point), u_shininess);
    }
    if(spotLight > 0.0){
        specularSpot = pow(dot(normal, halfVector_spot), u_shininess);
    }

    float nl_point = dot(normal, surfaceToLightDirection);
    float nl_spot = dot(normal, surfaceToLightDirection_spot); 

    outputColor = vec4(material_ambient * light_ambient +
                      material_diffuse * light_diffuse * (nl_point + nl_spot) +
                      material_specular * (specularPoint + specularSpot) * light_specular, 
                      1.0);

    outputColor.rgb *= max(spotLight, pointLight);
    outputColor.rgb += (specularPoint + specularSpot);

}