const { Random } = require('mockjs')
const Mock = require('mockjs')

const List = []
const count = 100

for (let i = 0; i < count; i++) {
    List.push(Mock.mock({
        id: '@increment',
        title: '@csentence(5, 10)',
        cover: '@image("200x100")',
        try: '@cparagraph',
        'price|1': [10, 5, 6, 99, 88, 100],
        'status|1': [0, 1],
        'sub_count|1': [10, 5, 6, 99, 88, 100],
        created_time: '@now',
        updated_time: '@now'
    }))
}

module.exports = [{
        url: '/vue-element-admin/book_detail/list',
        type: 'get',
        response: config => {
            const { page = 1, limit = 20 } = config.query

            let mockList = []

            for (let i = 0; i < 20; i++) {
                mockList.push(Mock.mock({
                    id: '@increment',
                    title: '@csentence(5, 10)',
                    content: '@csentence(10, 20)',
                    'isfree|1': [0, 1],
                    created_time: '@now',
                    updated_time: '@now'
                }))
            }

            const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

            return {
                code: 20000,
                data: {
                    total: mockList.length,
                    items: pageList
                }
            }
        }
    },
    {
        url: '/vue-element-admin/book_detail/create',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: Mock.mock({
                    id: '@increment',
                    title: '新章节',
                    content: '新章节内容',
                    'isfree|1': [0, 1],
                    created_time: '@now',
                    updated_time: '@now'
                })
            }
        }
    },

    {
        url: '/vue-element-admin/book_detail/update',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
        }
    },

    {
        url: '/vue-element-admin/book_detail/delete',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
        }
    },


    {
        url: '/vue-element-admin/book/list',
        type: 'get',
        response: config => {
            const { status, title, page = 1, limit = 20, sort } = config.query

            let mockList = List.filter(item => {
                // if (type && item.type !== type) return false
                if (title && item.title.indexOf(title) < 0) return false
                return true
            })

            if (sort === '-id') {
                mockList = mockList.reverse()
            }

            const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

            return {
                code: 20000,
                data: {
                    total: mockList.length,
                    items: pageList
                }
            }
        }
    },
    {
        url: '/vue-element-admin/book/detail',
        type: 'get',
        response: config => {
            let { id } = config.query

            let data = List.find(item => item.id == id)

            if (!data) {
                return {
                    code: 20000,
                    data: false
                }
            }

            return {
                code: 20000,
                data
            }
        }
    },

    {
        url: '/vue-element-admin/book/course',
        type: 'get',
        response: config => {
            const { status, title } = config.query

            let courseList = []

            for (let i = 0; i < 50; i++) {
                courseList.push(Mock.mock({
                    id: '@increment',
                    title: '@csentence(5, 10)',
                    cover: '@image("200x100")',
                    try: '@cparagraph',
                    content: '@cparagraph',
                    'price|1': [10, 5, 6, 99, 88, 100],
                    'status|1': [0, 1],
                    'sub_count|1': [10, 5, 6, 99, 88, 100],
                    created_time: '@now',
                    updated_time: '@now'
                }))
            }


            let mockList = courseList.filter(item => {
                // if (type && item.type !== type) return false
                if (title && item.title.indexOf(title) < 0) return false
                return true
            })


            return {
                code: 20000,
                data: {
                    total: mockList.length,
                    items: mockList
                }
            }
        }
    },

    {
        url: '/vue-element-admin/book/create',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
        }
    },

    {
        url: '/vue-element-admin/book/update',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
        }
    },

    {
        url: '/vue-element-admin/book/delete',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
        }
    }
]