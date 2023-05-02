#version 300 es
precision highp float;

layout(location=0) in vec4 aVertexPosition;
layout(location=1) in vec2 aTextureCoord;
layout(location=2) in float aModelId;

uniform mat4 uProjectionMatrix;
uniform mat4 uLookAtMatrix;
uniform sampler2D uDataSampler;

out vec2 vTextureCoord;
flat out uint vModelId;

void main() {
    vTextureCoord = aTextureCoord;
    vModelId = uint(aModelId);

    mat4 modelViewMatrix = mat4(
        texelFetch(uDataSampler, ivec2(0, vModelId), 0),
        texelFetch(uDataSampler, ivec2(1, vModelId), 0),
        texelFetch(uDataSampler, ivec2(2, vModelId), 0),
        texelFetch(uDataSampler, ivec2(3, vModelId), 0));
    
    gl_Position = aVertexPosition * modelViewMatrix * uLookAtMatrix * uProjectionMatrix;
}

#FILE_SPLIT#version 300 es
precision highp float;

in vec2 vTextureCoord;
flat in uint vModelId;

uniform sampler2D uDataSampler;
uniform sampler2D uSampler;

out vec4 outColor;

void main() {
    vec4 color = texelFetch(uDataSampler, ivec2(4, vModelId), 0);
    float glow = texelFetch(uDataSampler, ivec2(5, vModelId), 0).x;

    outColor = texture(uSampler, vTextureCoord) * glow * color;
}