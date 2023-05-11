// 多页配置
module.exports = {
    // 页面名称（对应 chunk 名）
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
    }
};
