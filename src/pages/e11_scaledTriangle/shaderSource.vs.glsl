attribute vec4 a_Position;
uniform vec4 u_Scaling;
void main() {
    gl_Position.x = a_Position.x * u_Scaling.x;
    gl_Position.y = a_Position.y * u_Scaling.y;
    gl_Position.z = a_Position.z * u_Scaling.z;
    gl_Position.w = 1.0;
}
