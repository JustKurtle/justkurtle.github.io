#version 300 es
precision highp float;

layout(location = 0) in vec4 aVertexPosition;
layout(location = 1) in vec2 aTextureCoord;

layout(location = 2) in mat4 aModelViewMatrix;
layout(location = 6) in vec4 aColor;
layout(location = 7) in float aGlow;

uniform mat4 uProjectionMatrix;
uniform mat4 uLookAtMatrix;

out vec2 vTextureCoord;
out vec4 vColor;
out float vGlow;

void main(void) {
    gl_Position = aVertexPosition * (aModelViewMatrix * uLookAtMatrix * uProjectionMatrix);
    
    vTextureCoord = aTextureCoord;
    vColor = aColor;
    vGlow = aGlow;
}