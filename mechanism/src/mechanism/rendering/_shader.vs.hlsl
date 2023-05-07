#version 300 es

precision highp float;

layout(location = 0) in vec4 aVertexPosition;
layout(location = 1) in vec2 aTextureCoord;

layout(location = 2) in mat4 aModelViewMatrix;
layout(location = 6) in vec4 aColor;
layout(location = 7) in float aGlow;

layout(std140) uniform Globals {
    mat4 projectionMatrix;
    mat4 lookAtMatrix;
} u;

out vec2 vTextureCoord;
out vec4 vColor;
out float vGlow;

void main(void) {
    gl_Position = aVertexPosition * (aModelViewMatrix * u.lookAtMatrix * u.projectionMatrix);
    vTextureCoord = aTextureCoord;
    vColor = aColor;
    vGlow = aGlow;
}