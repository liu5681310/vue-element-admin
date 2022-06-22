import request from '@/utils/request'

export function fetchOrder(query) {
    return request({
        url: '/admin/s/order',
        method: 'get',
        params: query
    })
}

export function fetchAssets(query) {
    return request({
        url: '/admin/s/cashconfirm',
        method: 'get',
        params: query
    })
}

export function fetchPayments(query) {
    return request({
        url: '/admin/s/cash',
        method: 'get',
        params: query
    })
}

export function Cashout(data) {
    return request({
        url: '/admin/s/cashconfirm/save',
        method: 'post',
        data
    })
}


export function deleteOrder(data) {
    return request({
        url: '/admin/s/order/delete',
        method: 'post',
        data
    })
}

export function createPayment(data) {
    return request({
        url: '/admin/s/cash/save',
        method: 'post',
        data
    })
}
export function updatePayment(data) {
    return request({
        url: '/admin/s/cash/update',
        method: 'post',
        data
    })
}
export function deletePayment(data) {
    return request({
        url: '/admin/s/cash/delete',
        method: 'post',
        data
    })
}