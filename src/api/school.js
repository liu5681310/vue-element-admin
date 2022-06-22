import request from '@/utils/request'
import { getSchoolid } from '@/utils/auth'

export function getStatistics(query) {
    return request({
        url: '/admin/s/statistics',
        method: 'get',
        params: query
    })
}

export function fetchSchool(query) {
    return request({
        url: '/admin/school',
        method: 'get',
        params: query
    })
}

export function readSchool() {
    return request({
        url: '/admin/s/school/read',
        method: 'get',
        params: {
            id: getSchoolid()
        }
    })
}

export function createSchool(data) {
    return request({
        url: '/admin/school/save',
        method: 'post',
        data
    })
}

export function updateSchool(data) {
    return request({
        url: '/admin/s/school/update',
        method: 'post',
        data
    })
}