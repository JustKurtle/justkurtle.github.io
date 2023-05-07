#version 300 es

precision highp float;

in vec2 vTextureCoord;
in vec4 vColor;
in float vGlow;

uniform sampler2D uSampler;

out vec4 fragColor;

void main(void) {
    fragColor = texture(uSampler, vTextureCoord) * vGlow * vColor;
}