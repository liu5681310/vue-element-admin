import request from '@/utils/request'

export function fetchStaff(query) {
    return request({
        url: '/admin/s/schoolstaff',
        method: 'get',
        params: query
    })
}

export function createStaff(data) {
    return request({
        url: '/admin/s/schoolstaff/save',
        method: 'post',
        data
    })
}

export function setRoles(data) {
    return request({
        url: '/admin/s/schoolstaff/setroles',
        method: 'post',
        data
    })
}

export function deleteStaff(data) {
    return request({
        url: '/admin/s/schoolstaff/delete',
        method: 'post',
        data
    })
}