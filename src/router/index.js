import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Memberlist from "../views/MemberList";
import AddPlayer from "../views/AddPlayer";
import Member from "../views/Member";
import EditPlayer from "../views/EditPlayer";
import Login from "../views/Login";
import Register from "../views/Register";
import ResetPw from "../views/ResetPw";
import PointLog from "../views/PointLog";
import RemovedLog from "../views/RemovedLog";
import firebase from "firebase/app";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      requiresGuest: true
    }
  },
  {
    path: "/register",
    name: "register",
    component: Register,
    meta: {
      requiresGuest: true
    }
  },
  {
    path: "/resetpw",
    name: "resetpw",
    component: ResetPw,
    meta: {
      requiresGuest: true
    }
  },
  {
    path: "/member",
    name: "memberlist",
    component: Memberlist,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/removed",
    name: "removedlog",
    component: RemovedLog,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/log",
    name: "pointlog",
    component: PointLog,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/add",
    name: "addplayer",
    component: AddPlayer,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/:name",
    name: "member",
    component: Member,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/edit/:name",
    name: "edit",
    component: EditPlayer,
    meta: {
      requiresAuth: true
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  //check for requiredauth guard
  if (to.matched.some(record => record.meta.requiresAuth)) {
    //check if not logged in
    if (!firebase.auth().currentUser) {
      //go to login
      next({
        path: "/login",
        query: {
          redirect: to.fullPath
        }
      });
    } else {
      //procced to route
      next();
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      //check if logged in
      if (firebase.auth().currentUser) {
        //go to login
        next({
          path: "/",
          query: {
            redirect: to.fullPath
          }
        });
      } else {
        //procced to route
        next();
      }
    } else {
      next();
    }
  }
});

export default router;
