attribute vec4 a_Position;
attribute float a_PointSize;
void main() {
    gl_Position = a_Position; // 设置坐标
    gl_PointSize = a_PointSize; // 设置尺寸
}
