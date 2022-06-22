import request from '@/utils/request'

export function fetchGroup(query) {
    return request({
        url: '/admin/s/group',
        method: 'get',
        params: query
    })
}

export function createGroup(data) {
    return request({
        url: '/admin/s/group/save',
        method: 'post',
        data
    })
}

export function updateGroup(data) {
    return request({
        url: '/admin/s/group/update',
        method: 'post',
        data
    })
}

export function updateGroupStatus(data) {
    return request({
        url: '/admin/s/group/updatestatus',
        method: 'post',
        data
    })
}

export function fetchFlashsale(query) {
    return request({
        url: '/admin/s/flashsale',
        method: 'get',
        params: query
    })
}

export function createFlashsale(data) {
    return request({
        url: '/admin/s/flashsale/save',
        method: 'post',
        data
    })
}

export function updateFlashsale(data) {
    return request({
        url: '/admin/s/flashsale/update',
        method: 'post',
        data
    })
}

export function updateFlashsaleStatus(data) {
    return request({
        url: '/admin/s/flashsale/updatestatus',
        method: 'post',
        data
    })
}


export function fetchCoupon(query) {
    return request({
        url: '/admin/s/coupon',
        method: 'get',
        params: query
    })
}

export function createCoupon(data) {
    return request({
        url: '/admin/s/coupon/save',
        method: 'post',
        data
    })
}

export function updateCoupon(data) {
    return request({
        url: '/admin/s/coupon/update',
        method: 'post',
        data
    })
}

export function updateCouponStatus(data) {
    return request({
        url: '/admin/s/coupon/updatestatus',
        method: 'post',
        data
    })
}