import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login";
import firebase from "firebase/app";

Vue.use(VueRouter);

const Memberlist = () => import(/* webpackChunkName: "memberlist" */ '../views/MemberList.vue');
const RemovedLog = () => import(/* webpackChunkName: "removedlog" */ '../views/RemovedLog.vue');
const PointLog = () => import(/* webpackChunkName: "pointlog" */ '../views/PointLog.vue');
const Member = () => import(/* webpackChunkName: "member" */ '../views/Member.vue');
const EditPlayer = () => import(/* webpackChunkName: "editplayer" */ '../views/EditPlayer.vue');
const DeletePlayer = () => import(/* webpackChunkName: "deleteplayer" */ '../views/DeletePlayer.vue');
const EditRemoved = () => import(/* webpackChunkName: "editremoved" */ '../views/EditRemoved.vue');
const ResetPw = () => import(/* webpackChunkName: "resetpw" */ '../views/ResetPw.vue');
const Register = () => import(/* webpackChunkName: "register" */ '../views/Register.vue');

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
    },
    {
        path: "/register",
        name: "register",
        component: Register,
    },
    {
        path: "/resetpw",
        name: "resetpw",
        component: ResetPw,
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
