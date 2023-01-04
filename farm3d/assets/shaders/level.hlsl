#VERTEX
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

#FRAGMENT
varying highp vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform highp vec3 uLight;

void main(void) {
    gl_FragColor = texture2D(uSampler, vTextureCoord) * vec4(0.5,1,0.5,1);
    if(gl_FragColor.a < 0.5) discard;
}