import request from '@/utils/request'

export function fetchPostComment(query) {
    return request({
        url: '/admin/s/post_comment',
        method: 'get',
        params: query
    })
}

export function fetchPostList(query) {
    return request({
        url: '/admin/s/post',
        method: 'get',
        params: query
    })
}

export function fetchList(query) {
    return request({
        url: '/admin/s/bbs',
        method: 'get',
        params: query
    })
}

export function createBbs(data) {
    return request({
        url: '/admin/s/bbs/save',
        method: 'post',
        data
    })
}

export function updateBbs(data) {
    return request({
        url: '/admin/s/bbs/update',
        method: 'post',
        data
    })
}

export function updateBbsStatus(data) {
    return request({
        url: '/admin/s/bbs/updatestatus',
        method: 'post',
        data
    })
}

export function deleteBbs(data) {
    return request({
        url: '/admin/s/bbs/delete',
        method: 'post',
        data
    })
}

export function setManagers(data) {
    return request({
        url: '/admin/s/bbs/setmanagers',
        method: 'post',
        data
    })
}

export function deletePost(data) {
    return request({
        url: '/admin/s/post/delete',
        method: 'post',
        data
    })
}

export function deletePostComment(data) {
    return request({
        url: '/admin/s/post_comment/delete',
        method: 'post',
        data
    })
}

export function updatePostIstop(data) {
    return request({
        url: '/admin/s/post/updateistop',
        method: 'post',
        data
    })
}