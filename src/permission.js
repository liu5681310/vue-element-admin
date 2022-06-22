import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, removeSchoolid } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
    // start progress bar
    NProgress.start()

    // set page title
    document.title = getPageTitle(to.meta.title)

    // determine whether the user has logged in
    const hasToken = getToken()

    if (hasToken) {
        if (to.path === '/login') {
            // if is logged in, redirect to the home page
            next({ path: '/' })
            NProgress.done()
        } else if (to.path == '/' || to.path.startsWith('/platform')) {
            removeSchoolid()
            const { isplatform } = await store.dispatch('user/getInfo')
            if (!isplatform && to.path.startsWith('/platform')) {
                Message.error('你没有访问权限')
                next({...from })
                return NProgress.done()
            }
            next()
            NProgress.done()
        } else {
            // determine whether the user has obtained his permission roles through getInfo
            const hasRoles = store.getters.roles && store.getters.roles.length > 0
            if (hasRoles) {
                next()
            } else {
                try {
                    // get user info
                    // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
                    const { roles, menus, isplatform } = await store.dispatch('user/getInfo')

                    // 动态生成路由
                    const accessRoutes = await store.dispatch('permission/generateRoutes', menus)

                    if (roles.length == 0 && menus.length == 0) {
                        Message.error('你没有访问权限')
                        next({
                            ...from
                        })
                        return NProgress.done()
                    }

                    // dynamically add accessible routes
                    router.addRoutes(accessRoutes)

                    // hack method to ensure that addRoutes is complete
                    // set the replace: true, so the navigation will not leave a history record
                    next({...to, replace: true })
                } catch (error) {
                    // remove token and go to login page to re-login
                    await store.dispatch('user/resetToken')
                    Message.error(error || 'Has Error')
                    next(`/login`)
                    NProgress.done()
                }
            }
        }
    } else {
        /* has no token*/

        if (whiteList.indexOf(to.path) !== -1) {
            // in the free login whitelist, go directly
            next()
        } else {
            // other pages that do not have permission to access are redirected to the login page.
            next(`/login`)
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    // finish progress bar
    NProgress.done()
})