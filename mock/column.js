const { Random } = require('mockjs')
const Mock = require('mockjs')

const List = []
const count = 100

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'

for (let i = 0; i < count; i++) {
    List.push(Mock.mock({
        id: '@increment',
        title: '@csentence(5, 10)',
        cover: '@image("200x100")',
        try: '@cparagraph',
        content: '@cparagraph',
        'price|1': [10, 5, 6, 99, 88, 100],
        'status|1': [0, 1],
        'sub_count|1': [10, 5, 6, 99, 88, 100],
        'isend|1': [0, 1],
        created_time: '@now',
        updated_time: '@now'
    }))
}

module.exports = [{
        url: '/vue-element-admin/column/list',
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
        url: '/vue-element-admin/column/detail',
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
        url: '/vue-element-admin/column/course',
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
        url: '/vue-element-admin/column/create',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
        }
    },

    {
        url: '/vue-element-admin/column/update',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
        }
    },

    {
        url: '/vue-element-admin/column/delete',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
        }
    }
]