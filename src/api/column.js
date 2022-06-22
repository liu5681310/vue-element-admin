import request from '@/utils/request'

export function fetchList(query) {
    return request({
        url: '/admin/s/column',
        method: 'get',
        params: query
    })
}

export function fetchDetail(query) {
    return request({
        url: '/admin/s/column/read',
        method: 'get',
        params: query
    })
}

export function fetchDetailCourse(query) {
    return request({
        url: '/admin/s/column_course',
        method: 'get',
        params: query
    })
}

export function createColumn(data) {
    return request({
        url: '/admin/s/column/save',
        method: 'post',
        data
    })
}

export function createColumnCourse(data) {
    return request({
        url: '/admin/s/column_course/save',
        method: 'post',
        data
    })
}

export function updateColumn(data) {
    return request({
        url: '/admin/s/column/update',
        method: 'post',
        data
    })
}

export function deleteColumn(data) {
    return request({
        url: '/admin/s/column/delete',
        method: 'post',
        data
    })
}

export function deleteColumnCourse(data) {
    return request({
        url: '/admin/s/column_course/delete',
        method: 'post',
        data
    })
}

export function sortColumnCourse(data) {
    return request({
        url: '/admin/s/column_course/sort',
        method: 'post',
        data
    })
}


export function updateStatus(data) {
    return request({
        url: '/admin/s/column/updatestatus',
        method: 'post',
        data
    })
}

export function updateEnd(data) {
    return request({
        url: '/admin/s/column/updateend',
        method: 'post',
        data
    })
}