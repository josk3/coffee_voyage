/**
 * API服务统一导出入口
 */
import auth from './auth';
import user from './user';
import banner from './banner';
import category from './category';
import album from './album';
import course from './course';
import comment from './comment';
import coffeeShop from './coffeeShop';

export const authAPI = auth;
export const userAPI = user;
export const bannerAPI = banner;
export const categoryAPI = category;
export const albumAPI = album;
export const courseAPI = course;
export const commentAPI = comment;
export const coffeeShopAPI = coffeeShop;

export default {
  authAPI,
  userAPI,
  bannerAPI,
  categoryAPI,
  albumAPI,
  courseAPI,
  commentAPI,
  coffeeShopAPI
}; 