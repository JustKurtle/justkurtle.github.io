attribute vec4 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uModelViewMatrix;

uniform mat4 uProjectionMatrix;
uniform mat4 uLookAtMatrix;

varying highp vec2 vTextureCoord;

void main(void) {
    gl_Position = aVertexPosition * (uModelViewMatrix * uLookAtMatrix * uProjectionMatrix);
    vTextureCoord = aTextureCoord;
}
#FILE_SPLIT
varying highp vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform highp float uGlow;
uniform highp vec4 uColor;

void main(void) {
    gl_FragColor = texture2D(uSampler, vTextureCoord) * uGlow * uColor;
}