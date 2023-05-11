// 多页配置
module.exports = {
    // 页面名称（对应 chunk 名）
    helloPoint: {
        ts: "./src/pages/helloPoint/index.ts", // 页面入口js
        html: "./src/pages/helloPoint/index.html", // 页面使用的html模板
        out: "helloPoint.html", // 输出目录中的页面文件名,
        title: "HelloPoint"
    }
};
