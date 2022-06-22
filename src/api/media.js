import request from '@/utils/request'

export function fetchList(query) {
    return request({
        url: '/admin/s/course',
        method: 'get',
        params: query
    })
}

export function createMedia(data) {
    return request({
        url: '/admin/s/course/save',
        method: 'post',
        data
    })
}

export function updateMedia(data) {
    return request({
        url: '/admin/s/course/update',
        method: 'post',
        data
    })
}

export function deleteMedia(data) {
    return request({
        url: '/admin/s/course/delete',
        method: 'post',
        data
    })
}

export function updateStatus(data) {
    return request({
        url: '/admin/s/course/updatestatus',
        method: 'post',
        data
    })
}