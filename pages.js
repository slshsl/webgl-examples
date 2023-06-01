// 多页配置
module.exports = {
    // 页面名称（对应 chunk 名）
    index: {
        ts: "./src/index/index.ts", // 页面入口js
        html: "./src/index/index.html", // 页面使用的html模板
        out: "index.html", // 输出目录中的页面文件名,
        title: "index"
    },
    helloCanvas: {
        ts: "./src/pages/e01_helloCanvas/index.ts", // 页面入口js
        html: "./src/pages/e01_helloCanvas/index.html", // 页面使用的html模板
        out: "helloCanvas.html", // 输出目录中的页面文件名,
        title: "helloCanvas"
    },
    helloPoint1: {
        ts: "./src/pages/e02_helloPoint1/index.ts", // 页面入口js
        html: "./src/pages/e02_helloPoint1/index.html", // 页面使用的html模板
        out: "helloPoint1.html", // 输出目录中的页面文件名,
        title: "HelloPoint1"
    },
    helloPoint2: {
        ts: "./src/pages/e03_helloPoint2/index.ts", // 页面入口js
        html: "./src/pages/e03_helloPoint2/index.html", // 页面使用的html模板
        out: "helloPoint2.html", // 输出目录中的页面文件名,
        title: "HelloPoint2"
    },
    coloredPoints: {
        ts: "./src/pages/e04_coloredPoints/index.ts", // 页面入口js
        html: "./src/pages/e04_coloredPoints/index.html", // 页面使用的html模板
        out: "coloredPoints.html", // 输出目录中的页面文件名,
        title: "ColoredPoints"
    },
    clickedPoints: {
        ts: "./src/pages/e05_clickedPoints/index.ts", // 页面入口js
        html: "./src/pages/e05_clickedPoints/index.html", // 页面使用的html模板
        out: "clickedPoints.html", // 输出目录中的页面文件名,
        title: "ClickedPoints"
    },
    multiPoints: {
        ts: "./src/pages/e06_multiPoints/index.ts", // 页面入口js
        html: "./src/pages/e06_multiPoints/index.html", // 页面使用的html模板
        out: "multiPoints.html", // 输出目录中的页面文件名,
        title: "MultiPoints"
    },
    helloTriangle: {
        ts: "./src/pages/e07_helloTriangle/index.ts", // 页面入口js
        html: "./src/pages/e07_helloTriangle/index.html", // 页面使用的html模板
        out: "helloTriangle.html", // 输出目录中的页面文件名,
        title: "HelloTriangle"
    },
    helloRectangle: {
        ts: "./src/pages/e08_helloRectangle/index.ts", // 页面入口js
        html: "./src/pages/e08_helloRectangle/index.html", // 页面使用的html模板
        out: "helloRectangle.html", // 输出目录中的页面文件名,
        title: "HelloRectangle"
    },
    translatedTriangle: {
        ts: "./src/pages/e09_translatedTriangle/index.ts", // 页面入口js
        html: "./src/pages/e09_translatedTriangle/index.html", // 页面使用的html模板
        out: "translatedTriangle.html", // 输出目录中的页面文件名,
        title: "TranslatedTriangle"
    },
    rotatedTriangle: {
        ts: "./src/pages/e10_rotatedTriangle/index.ts", // 页面入口js
        html: "./src/pages/e10_rotatedTriangle/index.html", // 页面使用的html模板
        out: "rotatedTriangle.html", // 输出目录中的页面文件名,
        title: "RotatedTriangle"
    },
    scaledTriangle: {
        ts: "./src/pages/e11_scaledTriangle/index.ts", // 页面入口js
        html: "./src/pages/e11_scaledTriangle/index.html", // 页面使用的html模板
        out: "scaledTriangle.html", // 输出目录中的页面文件名,
        title: "ScaledTriangle"
    },
    translatedTriangleMatrix: {
        ts: "./src/pages/e12_translatedTriangleMatrix/index.ts", // 页面入口js
        html: "./src/pages/e12_translatedTriangleMatrix/index.html", // 页面使用的html模板
        out: "translatedTriangleMatrix.html", // 输出目录中的页面文件名,
        title: "TranslatedTriangleMatrix"
    },
    rotatedTriangleMatrix: {
        ts: "./src/pages/e13_rotatedTriangleMatrix/index.ts", // 页面入口js
        html: "./src/pages/e13_rotatedTriangleMatrix/index.html", // 页面使用的html模板
        out: "rotatedTriangleMatrix.html", // 输出目录中的页面文件名,
        title: "RotatedTriangleMatrix"
    },
    scaledTriangleMatrix: {
        ts: "./src/pages/e14_scaledTriangleMatrix/index.ts", // 页面入口js
        html: "./src/pages/e14_scaledTriangleMatrix/index.html", // 页面使用的html模板
        out: "scaledTriangleMatrix.html", // 输出目录中的页面文件名,
        title: "ScaledTriangleMatrix"
    },
    mvpMatrix: {
        ts: "./src/pages/e15_mvpMatrix/index.ts", // 页面入口js
        html: "./src/pages/e15_mvpMatrix/index.html", // 页面使用的html模板
        out: "mvpMatrix.html", // 输出目录中的页面文件名,
        title: "MvpMatrix"
    },
    rotatingTriangle: {
        ts: "./src/pages/e16_rotatingTriangle/index.ts", // 页面入口js
        html: "./src/pages/e16_rotatingTriangle/index.html", // 页面使用的html模板
        out: "rotatingTriangle.html", // 输出目录中的页面文件名,
        title: "RotatingTriangle"
    },
    multiAttributeSize: {
        ts: "./src/pages/e17_multiAttributeSize/index.ts", // 页面入口js
        html: "./src/pages/e17_multiAttributeSize/index.html", // 页面使用的html模板
        out: "multiAttributeSize.html", // 输出目录中的页面文件名,
        title: "MultiAttributeSize"
    },
    multiAttributeSizeInterleaved: {
        ts: "./src/pages/e18_multiAttributeSizeInterleaved/index.ts", // 页面入口js
        html: "./src/pages/e18_multiAttributeSizeInterleaved/index.html", // 页面使用的html模板
        out: "multiAttributeSizeInterleaved.html", // 输出目录中的页面文件名,
        title: "MultiAttributeSizeInterleaved"
    },
    multiAttributeColor: {
        ts: "./src/pages/e19_multiAttributeColor/index.ts", // 页面入口js
        html: "./src/pages/e19_multiAttributeColor/index.html", // 页面使用的html模板
        out: "multiAttributeColor.html", // 输出目录中的页面文件名,
        title: "MultiAttributeColor"
    },
    coloredTriangle: {
        ts: "./src/pages/e20_coloredTriangle/index.ts", // 页面入口js
        html: "./src/pages/e20_coloredTriangle/index.html", // 页面使用的html模板
        out: "coloredTriangle.html", // 输出目录中的页面文件名,
        title: "ColoredTriangle"
    },
    texturedQuad: {
        ts: "./src/pages/e21_texturedQuad/index.ts", // 页面入口js
        html: "./src/pages/e21_texturedQuad/index.html", // 页面使用的html模板
        out: "texturedQuad.html", // 输出目录中的页面文件名,
        title: "TexturedQuad"
    },
    multiTexture: {
        ts: "./src/pages/e22_multiTexture/index.ts", // 页面入口js
        html: "./src/pages/e22_multiTexture/index.html", // 页面使用的html模板
        out: "multiTexture.html", // 输出目录中的页面文件名,
        title: "MultiTexture"
    },
    lookAtTriangles: {
        ts: "./src/pages/e23_lookAtTriangles/index.ts", // 页面入口js
        html: "./src/pages/e23_lookAtTriangles/index.html", // 页面使用的html模板
        out: "lookAtTriangles.html", // 输出目录中的页面文件名,
        title: "LookAtTriangles"
    },
    lookAtRotatedTriangles: {
        ts: "./src/pages/e24_lookAtRotatedTriangles/index.ts", // 页面入口js
        html: "./src/pages/e24_lookAtRotatedTriangles/index.html", // 页面使用的html模板
        out: "lookAtRotatedTriangles.html", // 输出目录中的页面文件名,
        title: "LookAtRotatedTriangles"
    },
    lookAtRotatedTrianglesMvMatrix: {
        ts: "./src/pages/e25_lookAtRotatedTrianglesMvMatrix/index.ts", // 页面入口js
        html: "./src/pages/e25_lookAtRotatedTrianglesMvMatrix/index.html", // 页面使用的html模板
        out: "lookAtRotatedTrianglesMvMatrix.html", // 输出目录中的页面文件名,
        title: "LookAtRotatedTrianglesMvMatrix"
    },
    lookAtTrianglesWithKeys: {
        ts: "./src/pages/e26_lookAtTrianglesWithKeys/index.ts", // 页面入口js
        html: "./src/pages/e26_lookAtTrianglesWithKeys/index.html", // 页面使用的html模板
        out: "lookAtTrianglesWithKeys.html", // 输出目录中的页面文件名,
        title: "LookAtTrianglesWithKeys"
    },
    orthoView: {
        ts: "./src/pages/e27_orthoView/index.ts", // 页面入口js
        html: "./src/pages/e27_orthoView/index.html", // 页面使用的html模板
        out: "orthoView.html", // 输出目录中的页面文件名,
        title: "OrthoView"
    },
    perspectiveview: {
        ts: "./src/pages/e28_perspectiveview/index.ts", // 页面入口js
        html: "./src/pages/e28_perspectiveview/index.html", // 页面使用的html模板
        out: "perspectiveview.html", // 输出目录中的页面文件名,
        title: "Perspectiveview"
    },
    perspectiveviewMvp: {
        ts: "./src/pages/e29_perspectiveviewMvp/index.ts", // 页面入口js
        html: "./src/pages/e29_perspectiveviewMvp/index.html", // 页面使用的html模板
        out: "perspectiveviewMvp.html", // 输出目录中的页面文件名,
        title: "PerspectiveviewMvp"
    },
    depthBuffer: {
        ts: "./src/pages/e30_depthBuffer/index.ts", // 页面入口js
        html: "./src/pages/e30_depthBuffer/index.html", // 页面使用的html模板
        out: "depthBuffer.html", // 输出目录中的页面文件名,
        title: "DepthBuffer"
    },
    zfighting: {
        ts: "./src/pages/e31_zfighting/index.ts", // 页面入口js
        html: "./src/pages/e31_zfighting/index.html", // 页面使用的html模板
        out: "zfighting.html", // 输出目录中的页面文件名,
        title: "Zfighting"
    },
    helloCube: {
        ts: "./src/pages/e32_helloCube/index.ts", // 页面入口js
        html: "./src/pages/e32_helloCube/index.html", // 页面使用的html模板
        out: "helloCube.html", // 输出目录中的页面文件名,
        title: "HelloCube"
    },
    coloredCube: {
        ts: "./src/pages/e33_coloredCube/index.ts", // 页面入口js
        html: "./src/pages/e33_coloredCube/index.html", // 页面使用的html模板
        out: "coloredCube.html", // 输出目录中的页面文件名,
        title: "ColoredCube"
    },
    coloredCubSingleColor: {
        ts: "./src/pages/e34_coloredCubSingleColor/index.ts", // 页面入口js
        html: "./src/pages/e34_coloredCubSingleColor/index.html", // 页面使用的html模板
        out: "coloredCubSingleColor.html", // 输出目录中的页面文件名,
        title: "ColoredCubSingleColor"
    },
    lightedCube: {
        ts: "./src/pages/e35_lightedCube/index.ts", // 页面入口js
        html: "./src/pages/e35_lightedCube/index.html", // 页面使用的html模板
        out: "lightedCube.html", // 输出目录中的页面文件名,
        title: "LightedCube"
    },
    lightedCubeAnimation: {
        ts: "./src/pages/e36_lightedCubeAnimation/index.ts", // 页面入口js
        html: "./src/pages/e36_lightedCubeAnimation/index.html", // 页面使用的html模板
        out: "lightedCubeAnimation.html", // 输出目录中的页面文件名,
        title: "LightedCubeAnimation"
    },
    lightedCubeAmbient: {
        ts: "./src/pages/e37_lightedCubeAmbient/index.ts", // 页面入口js
        html: "./src/pages/e37_lightedCubeAmbient/index.html", // 页面使用的html模板
        out: "lightedCubeAmbient.html", // 输出目录中的页面文件名,
        title: "LightedCubeAmbient"
    },
    pointLightedCube: {
        ts: "./src/pages/e38_pointLightedCube/index.ts", // 页面入口js
        html: "./src/pages/e38_pointLightedCube/index.html", // 页面使用的html模板
        out: "pointLightedCube.html", // 输出目录中的页面文件名,
        title: "PointLightedCube"
    },
    pointLightedCubeAnimation: {
        ts: "./src/pages/e39_pointLightedCubeAnimation/index.ts", // 页面入口js
        html: "./src/pages/e39_pointLightedCubeAnimation/index.html", // 页面使用的html模板
        out: "pointLightedCubeAnimation.html", // 输出目录中的页面文件名,
        title: "PointLightedCubeAnimation"
    },
    pointLightedCubePerFragment: {
        ts: "./src/pages/e40_pointLightedCubePerFragment/index.ts", // 页面入口js
        html: "./src/pages/e40_pointLightedCubePerFragment/index.html", // 页面使用的html模板
        out: "pointLightedCubePerFragment.html", // 输出目录中的页面文件名,
        title: "PointLightedCubePerFragment"
    },
    rotateObject: {
        ts: "./src/pages/e41_rotateObject/index.ts", // 页面入口js
        html: "./src/pages/e41_rotateObject/index.html", // 页面使用的html模板
        out: "rotateObject.html", // 输出目录中的页面文件名,
        title: "RotateObject"
    },
    pickObject: {
        ts: "./src/pages/e42_pickObject/index.ts", // 页面入口js
        html: "./src/pages/e42_pickObject/index.html", // 页面使用的html模板
        out: "pickObject.html", // 输出目录中的页面文件名,
        title: "PickObject"
    },
    pickFace: {
        ts: "./src/pages/e43_pickFace/index.ts", // 页面入口js
        html: "./src/pages/e43_pickFace/index.html", // 页面使用的html模板
        out: "pickFace.html", // 输出目录中的页面文件名,
        title: "PickFace"
    },
    fog: {
        ts: "./src/pages/e44_fog/index.ts", // 页面入口js
        html: "./src/pages/e44_fog/index.html", // 页面使用的html模板
        out: "fog.html", // 输出目录中的页面文件名,
        title: "Fog"
    },
    fogW: {
        ts: "./src/pages/e45_fogW/index.ts", // 页面入口js
        html: "./src/pages/e45_fogW/index.html", // 页面使用的html模板
        out: "fogW.html", // 输出目录中的页面文件名,
        title: "FogW"
    },
    roundedPoints: {
        ts: "./src/pages/e46_RoundedPoints/index.ts", // 页面入口js
        html: "./src/pages/e46_RoundedPoints/index.html", // 页面使用的html模板
        out: "roundedPoints.html", // 输出目录中的页面文件名,
        title: "RoundedPoints"
    },
    lookAtBlendedTriangles: {
        ts: "./src/pages/e47_lookAtBlendedTriangles/index.ts", // 页面入口js
        html: "./src/pages/e47_lookAtBlendedTriangles/index.html", // 页面使用的html模板
        out: "lookAtBlendedTriangles.html", // 输出目录中的页面文件名,
        title: "LookAtBlendedTriangles"
    },
    blendedCube: {
        ts: "./src/pages/e48_blendedCube/index.ts", // 页面入口js
        html: "./src/pages/e48_blendedCube/index.html", // 页面使用的html模板
        out: "blendedCube.html", // 输出目录中的页面文件名,
        title: "BlendedCube"
    },
    framebufferObject: {
        ts: "./src/pages/e49_framebufferObject/index.ts", // 页面入口js
        html: "./src/pages/e49_framebufferObject/index.html", // 页面使用的html模板
        out: "framebufferObject.html", // 输出目录中的页面文件名,
        title: "FramebufferObject"
    },
    glPosition: {
        ts: "./src/pages/e50_glPosition/index.ts", // 页面入口js
        html: "./src/pages/e50_glPosition/index.html", // 页面使用的html模板
        out: "glPosition.html", // 输出目录中的页面文件名, tt
        title: "GlPosition"
    }
};
