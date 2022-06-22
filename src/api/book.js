import request from '@/utils/request'

export function fetchList(query) {
    return request({
        url: '/admin/s/book',
        method: 'get',
        params: query
    })
}

export function fetchDetail(query) {
    return request({
        url: '/vue-element-admin/book/detail',
        method: 'get',
        params: query
    })
}


export function createBook(data) {
    return request({
        url: '/admin/s/book/save',
        method: 'post',
        data
    })
}

export function updateBook(data) {
    return request({
        url: '/admin/s/book/update',
        method: 'post',
        data
    })
}

export function updateBookStatus(data) {
    return request({
        url: '/admin/s/book/updatestatus',
        method: 'post',
        data
    })
}

// export function deleteBook(data) {
//     return request({
//         url: '/vue-element-admin/book/delete',
//         method: 'post',
//         data
//     })
// }


export function fetchBookDetail(query) {
    return request({
        url: '/admin/s/book_detail',
        method: 'get',
        params: query
    })
}


export function createBookDetail(data) {
    return request({
        url: '/admin/s/book_detail/save',
        method: 'post',
        data
    })
}

export function updateBookDetail(data) {
    return request({
        url: '/admin/s/book_detail/update',
        method: 'post',
        data
    })
}

export function deleteBookDetail(data) {
    return request({
        url: '/admin/s/book_detail/delete',
        method: 'post',
        data
    })
}

export function sortBookDetial(data) {
    return request({
        url: '/admin/s/book_detail/sort',
        method: 'post',
        data
    })
}