attribute vec4 a_Position;
uniform vec4 u_Translation;
void main() {
    gl_Position = a_Position + u_Translation; // 设置坐标
    gl_PointSize = 10.0; // 设置尺寸
}
