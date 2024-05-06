//  * staticRouter(静态路由)
//引入插件自动生成的路由pages
// import routes from "pages-generated";

// import { setupLayouts } from "virtual:generated-layouts";
// import generatedRoutes from "virtual:generated-pages";
// const routes = setupLayouts(generatedRoutes);
export const staticRouter = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/components/common/login/index.vue"),
    meta: {
      title: "登录",
    },
  },
  // ...routes,
  {
    path: "/",
    name: "layouts",
    component: () => import("@/layouts/index.vue"),
    redirect: "/403",
    children: [
      {
        path: "/403",
        name: "403",
        component: () => import("@/components/common/error/403.vue"),
      },
    ],
  },

  // {
  //   path: "/",
  //   name: "layout",
  //   component: () => import("@/views/layout/index.vue"),
  //   redirect: "/403",
  //   children: [
  //     {
  //       path: "/403",
  //       name: "403",
  //       component: () => import("@/components/error/403.vue"),
  //     },
  //   ],
  // },
  //others components:
  // {
  // 	path: '/article/articleDetail',
  // 	name: 'articleDetail',
  // 	components: () => import('@/components/articleDetail/index.vue'),
  // 	mata: {
  // 		title: '文章详情'
  // 	}
  // }
];

/**
 * errorRouter(错误页面路由)
 */
export const errorRouter = [
  {
    path: "/404",
    name: "404",
    component: () => import("@/components/common/error/404.vue"),
    meta: {
      title: "404",
    },
  },

  // {
  // 	path: "/500",
  // 	name: "500",
  // 	component: () => import("@/components/common/error/500.vue"),
  // 	meta: {
  // 		title: "500页面"
  // 	}
  // }
];

/**
 * notFoundRouter(找不到路由)
 */
export const notFoundRouter = {
  path: "/:catchAll(.*)",
  name: "404",
  component: () => import("@/components/common/error/404.vue"),
};
// export const notFoundRouter = {
//   path: "/:pathMatch(.*)*",
//   name: "notFound",
//   redirect: { name: "404" },
// };
