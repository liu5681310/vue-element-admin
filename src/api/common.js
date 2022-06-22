import request from '@/utils/request'

export function getSign(query) {
    return request({
        url: '/admin/sign',
        method: 'get',
        params: query
    })
}