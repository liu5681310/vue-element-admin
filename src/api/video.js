import request from '@/utils/request'

export function fetchList(query) {
    return request({
        url: '/vue-element-admin/video/list',
        method: 'get',
        params: query
    })
}

export function createVideo(data) {
    return request({
        url: '/vue-element-admin/video/create',
        method: 'post',
        data
    })
}

export function updateVideo(data) {
    return request({
        url: '/vue-element-admin/video/update',
        method: 'post',
        data
    })
}

export function deleteVideo(data) {
    return request({
        url: '/vue-element-admin/video/delete',
        method: 'post',
        data
    })
}