attribute vec4 a_Position;
attribute vec4 a_Color; // 表面基底色
attribute vec4 a_Normal; // 法向量
uniform mat4 u_ModelMatrix;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjMatrix;
uniform mat4 u_NormalMatrix; // 用来变换法向量的矩阵
uniform vec3 u_PrectionalLightColor; // 平行光光源颜色
uniform vec3 u_PrectionalLightDirection; // 平行光光源方向
uniform vec3 u_PointLightColor; // 点光源颜色
uniform vec3 u_PointLightPosition; // 点光源位置（世界坐标系）
uniform vec3 u_AmbientLight; // 环境光颜色
varying vec4 v_Color;
void main() {
    gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;

    vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));// 计算变化后的法向量进行归一化

    // 计算平行光源漫反射----------------------------------------------------------------------------------------------------

    float normalDotPrectionalLight = max(dot(u_PrectionalLightDirection, normal), 0.0); // 计算平行光源方向和法向量的点积

    vec3 prectionalDiffuse = u_PrectionalLightColor * vec3(a_Color) * normalDotPrectionalLight; // 计算平行光源漫反射光的颜色

    // -------------------------------------------------------------------------------------------------------------------

    // 计算点光源漫反射----------------------------------------------------------------------------------------------------

    vec4 vertexPosition = u_ModelMatrix * a_Position; // 计算顶点的世界坐标

    vec3 pointLightDirection = normalize(u_PointLightPosition - vec3(vertexPosition)); // 计算点光源方向并归一化

    float normalDotPointLight = max(dot(pointLightDirection, normal), 0.0); // 计算点光源方向和法向量的点积

    vec3 pointDiffuse = u_PointLightColor * vec3(a_Color) * normalDotPointLight; // 计算点光源漫反射光的颜色

    // -------------------------------------------------------------------------------------------------------------------

    // 计算点光源漫反射----------------------------------------------------------------------------------------------------

    vec3 ambient = u_AmbientLight * vec3(a_Color); // 计算环境光产生的反射光颜色

    // -------------------------------------------------------------------------------------------------------------------

    // 计算颜色
    v_Color = vec4(prectionalDiffuse + pointDiffuse + ambient, a_Color.a);
}
