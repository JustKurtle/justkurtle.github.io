#version 300 es
precision highp float;

in vec4 aVertexPosition;
in vec2 aTextureCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uLookAtMatrix;

out vec2 vTextureCoord;

void main(void) {
    gl_Position = aVertexPosition * uModelViewMatrix * uLookAtMatrix * uProjectionMatrix;
    vTextureCoord = aTextureCoord;
}
#FILE_SPLIT#version 300 es
precision highp float;

in vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform float uGlow;
uniform vec4 uColor;

out vec4 outColor;

void main(void) {
    outColor = texture(uSampler, vTextureCoord) * uGlow * uColor;
}