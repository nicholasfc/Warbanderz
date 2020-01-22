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
import DeletePlayer from "../views/DeletePlayer";
import EditRemoved from "../views/EditRemoved";
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
    component: Login
  },
  {
    path: "/register",
    name: "register",
    component: Register
  },
  {
    path: "/resetpw",
    name: "resetpw",
    component: ResetPw
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
  // {
  //   path: "/add",
  //   name: "addplayer",
  //   component: AddPlayer,
  //   meta: {
  //     requiresAuth: true
  //   }
  // },
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
  },
  {
    path: "/delete/:name",
    name: "delete",
    component: DeletePlayer,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/editremoved/:name",
    name: "editremoved",
    component: EditRemoved,
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
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = firebase.auth().currentUser;
  if (requiresAuth && !isAuthenticated) {
    next("/login");
  } else {
    next();
  }
});

export default router;
