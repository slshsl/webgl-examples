attribute vec4 a_Position;
uniform mat4 u_ScalingMatrix;
void main() {
    gl_Position = u_ScalingMatrix * a_Position;
}
