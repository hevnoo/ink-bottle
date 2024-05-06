import http from "@/request/index";
import { getUsers, deleteUsers } from "./interface/user";

// * 用户登录接口
export const loginApi = (params: any) => {
  return http.post("/api/users/login", params, {
    headers: { noLoading: true },
  }); // 正常 post json 请求  ==>  application/json
};

// * 注册接口
export const registerApi = (params: any) => {
  return http.post("/api/users/register", params);
};

// * 获取菜单
export const getMenuApi = (params: any) => {
  return http.get("/api/users/getMenu", params);
};

// * 刷新token
export const refreshTokenApi = (params: any) => {
  return http.post("/api/users/refreshToken", params);
};

//获取用户列表
export const getUserListApi = (params: any) => {
  return http.get(`/api/users/getData`, { params: params });
};

//新增用户
export const addUserApi = (params: any) => {
  return http.post("/api/users/register", params);
};

//更新用户
export const upUserApi = (params: any) => {
  return http.put("/api/users/updateData", params);
};

//删除用户
export const deleUserApi = (params: Object) => {
  return http.delete("/api/users/deleteData", { params });
};

//规范参数，用于增、删、改...
function setParams(params: any) {
  //发请求的参数全为Object类型
  let condition = Object.prototype.toString.call(params) === "[object Object]";
  if (!condition) {
    return { params };
  } else {
    return params;
  }
}
