import request from '@/utils/request'

export function fetchList(query) {
    return request({
        url: '/admin/s/live',
        method: 'get',
        params: query
    })
}

export function createLive(data) {
    return request({
        url: '/admin/s/live/save',
        method: 'post',
        data
    })
}

export function updateLive(data) {
    return request({
        url: '/admin/s/live/update',
        method: 'post',
        data
    })
}

export function deleteLive(data) {
    return request({
        url: '/admin/s/live/delete',
        method: 'post',
        data
    })
}

export function readLive(query) {
    return request({
        url: '/admin/s/live/read',
        method: 'get',
        params: query
    })
}
