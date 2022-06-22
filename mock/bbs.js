const { Random } = require('mockjs')
const Mock = require('mockjs')

const List = []
const count = 100

for (let i = 0; i < count; i++) {
    List.push(Mock.mock({
        id: '@increment',
        title: '@csentence(5, 10)',
        'status|1': [0, 1],
        created_time: '@now',
        updated_time: '@now',
        bbs_managers: [{
            username: "帝莎编程",
            nickname: ""
        }]
    }))
}

module.exports = [{
        url: '/vue-element-admin/post/comment',
        type: 'get',
        response: config => {
            const { status, title, page = 1, limit = 20, sort } = config.query

            let mockList = []

            for (let i = 0; i < 20; i++) {
                mockList.push(Mock.mock({
                    id: '@increment',
                    content: '@csentence(5, 10)',
                    user: {
                        id: '@increment',
                        username: "帝莎编程",
                        nickname: "",
                        avatar: ""
                    },
                    'is_top|1': [0, 1],
                    post_id: '@increment',
                    reply_id: '@increment',
                    reply_user: {
                        username: "帝莎编程",
                        nickname: "",
                        avatar: ""
                    },
                    support_count: 1,
                    created_time: '@now',
                    updated_time: '@now',
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
    }, {
        url: '/vue-element-admin/post/list',
        type: 'get',
        response: config => {
            const { status, title, page = 1, limit = 20, sort } = config.query

            let mockList = []

            for (let i = 0; i < 20; i++) {
                mockList.push(Mock.mock({
                    id: '@increment',
                    content: [{
                        text: '@csentence(5, 10)',
                        images: ['http://edu-image.nosdn.127.net/161D78327D38C28645011D73B7A7D49D.jpg?imageView&thumbnail=330y204&quality=100', 'http://edu-image.nosdn.127.net/161D78327D38C28645011D73B7A7D49D.jpg?imageView&thumbnail=330y204&quality=100']
                    }, {
                        text: '@csentence(5, 10)',
                        images: ['http://edu-image.nosdn.127.net/161D78327D38C28645011D73B7A7D49D.jpg?imageView&thumbnail=330y204&quality=100', 'http://edu-image.nosdn.127.net/161D78327D38C28645011D73B7A7D49D.jpg?imageView&thumbnail=330y204&quality=100']
                    }],
                    'is_top|1': [0, 1],
                    user: {
                        id: '@increment',
                        username: "帝莎编程",
                        nickname: "",
                        avatar: ""
                    },
                    support_count: 1,
                    comment_count: 10,
                    created_time: '@now',
                    updated_time: '@now',
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
        url: '/vue-element-admin/bbs/list',
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
        url: '/vue-element-admin/bbs/create',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
        }
    },

    {
        url: '/vue-element-admin/bbs/update',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
        }
    },

    {
        url: '/vue-element-admin/bbs/delete',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
        }
    },

    {
        url: '/vue-element-admin/post/delete',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
        }
    },
    {
        url: '/vue-element-admin/post/comment/delete',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
        }
    }
]