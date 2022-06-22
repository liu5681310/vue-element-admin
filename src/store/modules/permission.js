import { asyncRoutes, constantRoutes, routesList } from '@/router'
import Layout from '@/layout'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
    if (route.meta && route.meta.roles) {
        return roles.some(role => route.meta.roles.includes(role))
    } else {
        return true
    }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
    const res = []

    routes.forEach(route => {
        const tmp = {...route }
        if (hasPermission(roles, tmp)) {
            if (tmp.children) {
                tmp.children = filterAsyncRoutes(tmp.children, roles)
            }
            res.push(tmp)
        }
    })

    return res
}

const state = {
    routes: [],
    addRoutes: []
}

const mutations = {
    SET_ROUTES: (state, routes) => {
        state.addRoutes = routes
        state.routes = constantRoutes.concat(routes)
    }
}


export function filterRoutesList(routes, menus) {
    let res = []
    menus.forEach(m => {
        let index = routes.findIndex(r => r.name == m.name)
        let tmp = {}

        if (index === -1) {
            tmp = {
                path: (m.access_id == 0 ? '/' : '') + m.name.toLowerCase(),
                component: Layout,
                name: m.name,
                hidden: m.hidden,
                meta: {
                    title: m.title,
                },
            }
        } else {
            let rt = routes[index]
            tmp = {
                path: (m.access_id == 0 ? '/' : '') + rt.path,
                component: m.access_id == 0 ? Layout : rt.component,
                name: m.name,
                hidden: m.hidden,
                meta: rt.meta || {},
            }
            tmp.meta.title = m.title
        }

        if (m.children && m.children.length > 0) {
            tmp.children = filterRoutesList(routes, m.children)
            tmp.redirect = tmp.children[0].path
        } else {
            if (m.access_id == 0) {
                let rt = routes[index]
                delete tmp.name
                tmp.children = [{
                    path: rt.path,
                    name: rt.name,
                    component: rt ? rt.component : tmp.component,
                    meta: rt.meta || {}
                }]
                tmp.children[0].meta.title = m.title
                tmp.redirect = tmp.children[0].path
            }
        }
        res.push(tmp)
    })

    res.push({ path: '*', redirect: '/404', hidden: true })

    return res
}

const actions = {
    generateRoutes({ commit }, menus) {
        return new Promise(resolve => {
            let accessedRoutes
            accessedRoutes = filterRoutesList(routesList, menus)
            commit('SET_ROUTES', accessedRoutes)
            resolve(accessedRoutes)
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}