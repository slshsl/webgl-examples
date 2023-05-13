attribute vec4 a_Position;
attribute vec4 a_Color;//表面基底色
attribute vec4 a_Normal; //法向量
uniform mat4 u_ModelMatrix;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjMatrix;
varying vec3 v_Normal;
varying vec3 v_Position;
varying vec4 v_Color;
void main() {
    gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
    v_Position = vec3(u_ModelMatrix * a_Position);
    v_Normal = normalize(vec3(a_Normal));//法向量进行归一化
    v_Color = a_Color;
}
