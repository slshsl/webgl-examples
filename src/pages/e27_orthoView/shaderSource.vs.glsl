attribute vec4 a_Position;
attribute vec4 a_Color;
uniform mat4 u_ProjMatrix;
varying vec4 v_Color;
void main() {
    gl_Position = u_ProjMatrix * a_Position;
    gl_PointSize = 10.0;
    v_Color = a_Color;
}
