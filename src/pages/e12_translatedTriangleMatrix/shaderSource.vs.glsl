attribute vec4 a_Position;
uniform mat4 u_Translation;
void main() {
    gl_Position = u_Translation * a_Position;
}
