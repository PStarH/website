import { createWebHashHistory, createRouter } from "vue-router";
import store from "../store/store";

const routes = [
    {
        path: "/",
        name: "website-layout",
        component: () => store.state.display.isMobile ? import('../components/mLayout.vue') : import('../components/layout.vue'),
        children: [
            {
                path: "",
                name: "landing",
                component: () => store.state.display.isMobile ? import('../components/landing/mLanding.vue') : import('../components/landing/landing.vue')
            },
            {
                path: "project",
                name: "project",
                component: () => store.state.display.isMobile ? import('../components/project/landing/mLanding.vue') : import('../components/project/landing/landing.vue')
            },
            {
                path: "projects",
                name: "projects",
                component: () => store.state.display.isMobile ? import('../components/project/mProject.vue') : import('../components/project/project.vue'),
                children: [
                    {
                        path: "fire-escape",
                        name: "projects-fireEscape",
                        component: () => store.state.display.isMobile ? import('../components/project/algorithms/mFireEscape.vue') : import('../components/project/algorithms/fireEscape.vue')
                    },
                    {
                        path: "reversi",
                        name: "projects-reversi",
                        component: () => store.state.display.isMobile ? import('../components/project/algorithms/mReversi.vue') : import('../components/project/algorithms/Reversi.vue')
                    }
                ]
            },
            {
                path: "about",
                name: "about",
                component: () => store.state.display.isMobile ? import('../components/about/mAbout.vue') : import('../components/about/about.vue')
            },
            {
                path: "competition",
                name: "competition",
                component: () => store.state.display.isMobile ? import('../components/competition/mCompetition.vue') : import('../components/competition/competition.vue')
            },
            {
                path: "activity",
                name: "activity",
                component: () => store.state.display.isMobile ? import('../components/activity/mActivity.vue') : import('../components/activity/activity.vue')
            }
        ]
    },
];

const router = createRouter({
    history: createWebHashHistory("/"),
    routes,
});

router.afterEach(() => {
    window.scrollTo(0, 0)
})

export default router;
