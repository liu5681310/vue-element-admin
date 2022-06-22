import request from '@/utils/request'

export function fetchList(query) {
    return request({
        url: '/admin/s/course',
        method: 'get',
        params: query
    })
}

export function createCourse(data) {
    return request({
        url: '/admin/s/course/save',
        method: 'post',
        data
    })
}

export function updateCourse(data) {
    return request({
        url: '/admin/s/course/update',
        method: 'post',
        data
    })
}

export function deleteCourse(data) {
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