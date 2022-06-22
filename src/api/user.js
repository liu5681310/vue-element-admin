import request from '@/utils/request'

export function login(data) {
    return request({
        url: '/user/login',
        method: 'post',
        data
    })
}

export function reg(data) {
    return request({
        url: '/user/reg',
        method: 'post',
        data
    })
}

export function getInfo(token) {
    return request({
        url: '/admin/user/info',
        method: 'get',
        params: { token }
    })
}

export function logout() {
    return request({
        url: '/admin/user/logout',
        method: 'post'
    })
}

export function fetchList(query) {
    return request({
        url: '/admin/s/school_user',
        method: 'get',
        params: query
    })
}

export function fetchUserDetail(query) {
    return request({
        url: '/admin/s/school_user/read',
        method: 'get',
        params: query
    })
}

export function fetchUserCourse(query) {
    query.type = 'course'
    return request({
        url: '/admin/s/order_item',
        method: 'get',
        params: query
    })
}

export function fetchUserColumn(query) {
    query.type = 'column'
    return request({
        url: '/admin/s/order_item',
        method: 'get',
        params: query
    })
}

export function fetchUserOrder(query) {
    return request({
        url: '/admin/s/order',
        method: 'get',
        params: query
    })
}

export function fetchUserHistory(query) {
    return request({
        url: '/admin/s/user_history',
        method: 'get',
        params: query
    })
}

export function fetchUserComment(query) {
    query.comment = 1
    return request({
        url: '/admin/s/order_item',
        method: 'get',
        params: query
    })
}

export function changeCommentStatus(data) {
    return request({
        url: '/admin/s/school_user/updatecomment',
        method: 'post',
        data
    })
}

export function changeAccessStatus(data) {
    return request({
        url: '/admin/s/school_user/updateaccess',
        method: 'post',
        data
    })
}

export function fetchRole(query) {
    return request({
        url: '/admin/role',
        method: 'get',
        params: query
    })
}

export function readRole(query) {
    return request({
        url: '/admin/role/read',
        method: 'get',
        params: query
    })
}