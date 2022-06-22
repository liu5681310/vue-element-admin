import request from '@/utils/request'

export function fetchQuestion(query) {
    return request({
        url: '/admin/s/question',
        method: 'get',
        params: query
    })
}

export function createQuestion(data) {
    return request({
        url: '/admin/s/question/save',
        method: 'post',
        data
    })
}

export function updateQuestion(data) {
    return request({
        url: '/admin/s/question/update',
        method: 'post',
        data
    })
}

export function deleteQuestion(data) {
    return request({
        url: '/admin/s/question/delete',
        method: 'post',
        data
    })
}