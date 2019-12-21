import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/notations',
      name: 'notations',
      // route level code-splitting
      // this generates a separate chunk (notations.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "notations" */ './views/Notations.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (login.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "login" */ './views/Login.vue')
    },
    {
      path: '/signin',
      name: 'signin',
      // route level code-splitting
      // this generates a separate chunk (signin.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "signin" */ './views/Signin.vue')
    },
    {
      path: '/forgetpwd',
      name: 'forgetpwd',
      // route level code-splitting
      // this generates a separate chunk (forgetpwd.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "forgetpwd" */ './views/ForgetPwd.vue')
    },
    {
      path: '/resetpwd/:token',
      name: 'resetpwd',
      // route level code-splitting
      // this generates a separate chunk (forgetpwd.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "resetpwd" */ './views/ResetPwd.vue')
    },
    {
      path: '/users',
      name: 'users',
      // route level code-splitting
      // this generates a separate chunk (users.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "users" */ './views/Users.vue'),
      meta: {
        requiresAuth: true,
        roles: ['admin']
      }
    },
    {
      path: '/user/:id',
      name: 'user',
      // route level code-splitting
      // this generates a separate chunk (user.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "user" */ './views/User.vue'),
      meta: {
        requiresAuth: true,
        roles: ['admin']
      }
    },
    {
      path: '/newCompetition',
      name: 'newCompetition',
      // route level code-splitting
      // this generates a separate chunk (newCompetition.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "newCompetition" */ './views/NewCompetition.vue'),
      meta: {
        requiresAuth: true,
        roles: ['admin']
      }
    },
    {
      path: '/tags',
      name: 'tags',
      // route level code-splitting
      // this generates a separate chunk (tags.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "tags" */ './views/Tags.vue'),
      meta: {
        requiresAuth: true,
        roles: ['admin']
      }
    },
    {
      path: '/categories',
      name: 'categories',
      // route level code-splitting
      // this generates a separate chunk (tags.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "categories" */ './views/Categories.vue'),
      meta: {
        requiresAuth: true,
        roles: ['admin']
      }
    },
    {
      path: '/competition/:competition',
      // route level code-splitting
      // this generates a separate chunk (competition.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "competition" */ './views/Competition.vue'),
      children: [
        {
          path: '',
          name: 'classementCompetition',
          // route level code-splitting
          // this generates a separate chunk (classementCompetition.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "classementCompetition" */ './views/ClassementCompetition.vue')
        },
        {
          path: 'equipes',
          name: 'equipesCompetition',
          // route level code-splitting
          // this generates a separate chunk (equipesCompetition.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "equipesCompetition" */ './views/Teams.vue')
        },
        {
          path: 'mettre_a_jour',
          name: 'updateCompetition',
          // route level code-splitting
          // this generates a separate chunk (updateCompetition.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "updateCompetition" */ './views/UpdateCompetition.vue'),
          meta: {
            requiresAuth: true,
            roles: ['admin', 'organisateur', 'juge']
          }
        },
        {
          path: 'juges',
          names: 'jugesCompetition',
          // route level code-splitting
          // this generates a separate chunk (jugesCompetition.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "jugesCompetition" */ './views/JugesCompetition.vue')
        },
        {
          path: 'creer_equipe',
          names: 'createTeam',
          // route level code-splitting
          // this generates a separate chunk (createTeam.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "createTeam" */ './views/CreateTeam.vue')
        },
        {
          path: 'equipe/:equipe',
          names: 'team',
          // route level code-splitting
          // this generates a separate chunk (team.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "team" */ './views/Team.vue')
        },
        {
          path: 'mettre_a_jour/:equipe',
          names: 'updateTeam',
          // route level code-splitting
          // this generates a separate chunk (updateTeam.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "updateTeam" */ './views/UpdateTeam.vue')
        },
        {
          path: 'definir_score',
          names: 'setScore',
          // route level code-splitting
          // this generates a separate chunk (setScore.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "setScore" */ './views/SetScore.vue'),
          meta: {
            requiresAuth: true,
            roles: ['admin', 'organisateur', 'juge']
          }
        },
        {
          path: 'planning',
          names: 'planning',
          // route level code-splitting
          // this generates a separate chunk (setScore.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "planning" */ './views/Planning.vue'),
          meta: {
            requiresAuth: true,
            roles: ['admin', 'organisateur']
          }
        }
      ]
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    try {
      const currentUser = JSON.parse(sessionStorage.getItem('user')) || null
      if (currentUser && currentUser.role && to.meta.roles.indexOf(currentUser.role) >= 0) {
        next()
      } else {
        next({ path: '/' })
      }
    } catch (error) {
      next({ path: '/' })
    }
  } else {
    next()
  }
})

export default router
