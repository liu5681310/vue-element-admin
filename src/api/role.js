import request from '@/utils/request'

export function fetchRole(query) {
    return request({
        url: '/platform/role',
        method: 'get',
        params: query
    })
}

export function readRole(query) {
    return request({
        url: '/platform/role/read',
        method: 'get',
        params: query
    })
}

export function addRole(data) {
    return request({
        url: '/platform/role/save',
        method: 'post',
        data
    })
}

export function updateRole(data) {
    return request({
        url: `/platform/role/update`,
        method: 'post',
        data
    })
}

export function deleteRole(data) {
    return request({
        url: `/platform/role/delete`,
        method: 'post',
        data
    })
}

export function setrules(data) {
    return request({
        url: `/platform/role/setrules`,
        method: 'post',
        data
    })
}