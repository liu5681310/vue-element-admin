import request from '@/utils/request'

export function readPage(query) {
    return request({
        url: '/admin/s/renovation/read',
        method: 'get',
        params: query
    })
}

export function fetchList(query) {
    return request({
        url: '/admin/s/renovation',
        method: 'get',
        params: query
    })
}

export function createPage(data) {
    return request({
        url: '/admin/s/renovation/save',
        method: 'post',
        data
    })
}

export function updatePage(data) {
    return request({
        url: '/admin/s/renovation/update',
        method: 'post',
        data
    })
}

export function deletePage(data) {
    return request({
        url: '/admin/s/renovation/delete',
        method: 'post',
        data
    })
}

export function fetchPcList(query) {
    return request({
        url: '/vue-element-admin/renovation/pc/list',
        method: 'get',
        params: query
    })
}

export function createPc(data) {
    return request({
        url: '/vue-element-admin/renovation/pc/create',
        method: 'post',
        data
    })
}

export function updatePc(data) {
    return request({
        url: '/vue-element-admin/renovation/pc/update',
        method: 'post',
        data
    })
}

export function deletePc(data) {
    return request({
        url: '/vue-element-admin/renovation/pc/delete',
        method: 'post',
        data
    })
}