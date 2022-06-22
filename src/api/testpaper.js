import request from '@/utils/request'

export function fetchTestpaper(query) {
    return request({
        url: '/admin/s/testpaper',
        method: 'get',
        params: query
    })
}

export function readTestpaper(query) {
    return request({
        url: '/admin/s/testpaper/read',
        method: 'get',
        params: query
    })
}

export function createTestpaper(data) {
    return request({
        url: '/admin/s/testpaper/save',
        method: 'post',
        data
    })
}

export function updateTestpaper(data) {
    return request({
        url: '/admin/s/testpaper/update',
        method: 'post',
        data
    })
}

export function deleteTestpaper(data) {
    return request({
        url: '/admin/s/testpaper/delete',
        method: 'post',
        data
    })
}

export function fetchUserTest(query) {
    return request({
        url: '/admin/s/user_test',
        method: 'get',
        params: query
    })
}

export function updateUserTest(data) {
    return request({
        url: '/admin/s/user_test/update_readstatus',
        method: 'post',
        data
    })
}

export function deleteUserTest(data) {
    return request({
        url: '/admin/s/user_test/delete',
        method: 'post',
        data
    })
}

export function readUserTest(query) {
    return request({
        url: '/admin/s/user_test/read',
        method: 'get',
        params: query
    })
}