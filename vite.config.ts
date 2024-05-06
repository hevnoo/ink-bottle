import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import VueRouter from "unplugin-vue-router/vite";
//路由生成插件
import Pages from "vite-plugin-pages";
import Layouts from "vite-plugin-vue-layouts";

export default defineConfig({
  plugins: [
    VueRouter({
      /* options */
    }),
    vue(),
    Layouts({
      exclude: ["**/components/*.vue", "**/modules/*.vue"],
      layoutsDirs: "src/components/common/layout", // 自定义布局目录路径
      defaultLayout: "index", // 自定义默认布局文件名
      // layoutsDirs: "src/layouts",
      // pagesDirs: "src/views", // 自定义页面目录路径
    }),
    Pages({
      exclude: ["**/components/*.vue", "**/modules/*.vue"],
      dirs: "src/views", // 自定义页面目录路径
      // pagesDir: [
      //   // { dir: "src/components/common/layout", baseRoute: "" }, // 根级页面
      //   { dir: "src/views", baseRoute: "" }, // 嵌套页面
      // ],
      // importMode: "async",
      extendRoute(route) {
        // 添加前缀
        // route.path = `/layout${route.path}`;
        route.meta = { requiresAuth: true };
        return route;
      },
      /*
      dir指定了页面文件的位置，而baseRoute定义了对应的基础路由。
      在这个例子中，src/views目录下的页面将会映射到根路由（/），
      而src/views目录下的页面将会映射到/ layout的子路由。
      */
    }),
  ],
  // 配置根路径与@路径
  base: "./",
  resolve: {
    // ↓配置路径别名
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  //将constant.scss中的scss常量加载到全局
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/constant.scss";`,
      },
    },
  },
});
