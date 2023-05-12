attribute vec4 a_Position;
uniform mat4 u_RotationMatrix;
void main() {
    gl_Position = u_RotationMatrix * a_Position;
}
