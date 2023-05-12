attribute vec4 a_Position;
attribute vec4 a_Color;//表面基底色
attribute vec4 a_Normal;//法向量
uniform mat4 u_ModelMatrix;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjMatrix;
uniform vec3 u_LightColor;//光线颜色
uniform vec3 u_LightDirection;//归一化的世界坐标（入射光方向）
uniform mat4 u_NormalMatrix;
varying vec4 v_Color;
void main() {
    gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
    vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));//对法向量进行归一化
    float nDotL = max(dot(u_LightDirection, normal), 0.0); //计算光线方向和法向量的点积
    vec3 diffuse = u_LightColor * vec3(a_Color) * nDotL; //计算漫反射光的颜色
    v_Color = vec4(diffuse, a_Color.a);
}
