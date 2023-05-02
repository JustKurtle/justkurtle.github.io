#version 300 es

layout(location=0) in mat4 aModelViewMatrix;
layout(location=4) in vec4 aColor;
layout(location=5) in float aGlow;
layout(location=6) in vec4 aVertexPosition;
layout(location=7) in vec2 aTextureCoord;

uniform mat4 uProjectionMatrix;
uniform mat4 uLookAtMatrix;
uniform sampler2D uSampler;

out vec2 vTextureCoord;
out vec4 vColor;
out float vGlow;

void main() {
    vTextureCoord = aTextureCoord;
    vColor = aColor;
    vGlow = aGlow;
    
    gl_Position = aVertexPosition * aModelViewMatrix * uLookAtMatrix * uProjectionMatrix;
}

#FILE_SPLIT#version 300 es
precision highp float;

in vec2 vTextureCoord;
in vec4 vColor;
in float vGlow;

uniform sampler2D uSampler;

out vec4 outColor;

void main() {
    
    outColor = texture(uSampler, vTextureCoord) * vGlow * vColor;
}