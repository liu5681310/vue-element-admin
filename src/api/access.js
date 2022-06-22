import request from '@/utils/request'

export function fetchAccess(query) {
    return request({
        url: '/platform/access',
        method: 'get',
        params: query
    })
}