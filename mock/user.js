const { Random } = require('mockjs')
const Mock = require('mockjs')

let List = []
const count = 100

for (let i = 0; i < count; i++) {
    List.push(Mock.mock({
        id: '@increment',
        user_id: '@increment',
        user: {
            id: '@increment',
            username: '@csentence(2, 3)',
            avatar: '@image("100x100")',
            nickname: "",
            phone: "15108544507",
            'status|1': [0, 1],
            created_time: '@now',
            user_level: "年度会员",
            user_level_expire: '@now',
        },
        'total_consume|1': [10, 20, 30, 40],
        'no_comment|1': [0, 1],
        'no_access|1': [0, 1],
        created_time: '@now',
        updated_time: '@now'
    }))
}

const tokens = {
    admin: {
        token: 'admin-token'
    },
    editor: {
        token: 'editor-token'
    }
}

const users = {
    'admin-token': {
        roles: ['admin'],
        introduction: 'I am a super administrator',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Super Admin'
    },
    'editor-token': {
        roles: ['editor'],
        introduction: 'I am an editor',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Normal Editor'
    }
}

module.exports = [
    // user login
    {
        url: '/vue-element-admin/user/login',
        type: 'post',
        response: config => {
            const { username } = config.body
            const token = tokens[username]

            // mock error
            if (!token) {
                return {
                    code: 60204,
                    message: 'Account and password are incorrect.'
                }
            }

            return {
                code: 20000,
                data: token
            }
        }
    },

    // get user info
    {
        url: '/vue-element-admin/user/info\.*',
        type: 'get',
        response: config => {
            const { token } = config.query
            const info = users[token]

            // mock error
            if (!info) {
                return {
                    code: 50008,
                    message: 'Login failed, unable to get user details.'
                }
            }

            return {
                code: 20000,
                data: info
            }
        }
    },

    // user logout
    {
        url: '/vue-element-admin/user/logout',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
        }
    },

    {
        url: '/vue-element-admin/user/list',
        type: 'get',
        response: config => {
            const { title, page = 1, limit = 20 } = config.query

            let mockList = List.filter(item => {
                if (title && item.title.indexOf(title) < 0) return false
                return true
            })

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
        url: '/vue-element-admin/role/list',
        type: 'get',
        response: config => {
            const { title, page = 1, limit = 20 } = config.query

            let mockList = []

            for (let i = 0; i < 5; i++) {
                mockList.push(Mock.mock({
                    id: '@increment',
                    name: '@csentence(2, 3)',
                    'role_id|1': ["admin", 'editor'],
                    desc: '@csentence(5, 10)',
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
        url: '/vue-element-admin/user_detail',
        type: 'get',
        response: config => {
            const { id } = config.query
            let data = List.find(item => item.user.id == id)

            return {
                code: 20000,
                data
            }
        }
    },

    {
        url: '/vue-element-admin/user_course',
        type: 'get',
        response: config => {
            const { page = 1, limit = 20 } = config.query

            let mockList = []

            for (let i = 0; i < count; i++) {
                mockList.push(Mock.mock({
                    id: '@increment',
                    title: '@csentence(5, 10)',
                    'price|1': [10.00, 20.00, 30.00],
                    created_time: '@now'
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
        url: '/vue-element-admin/user_column',
        type: 'get',
        response: config => {
            const { page = 1, limit = 20 } = config.query

            let mockList = []

            for (let i = 0; i < count; i++) {
                mockList.push(Mock.mock({
                    id: '@increment',
                    title: '@csentence(5, 10)',
                    'price|1': [10.00, 20.00, 30.00],
                    created_time: '@now'
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
        url: '/vue-element-admin/user_order',
        type: 'get',
        response: config => {
            const { page = 1, limit = 20 } = config.query

            let mockList = []

            for (let i = 0; i < count; i++) {
                mockList.push(Mock.mock({
                    id: '@increment',
                    no: '@increment',
                    'price|1': [10.00, 20.00, 30.00],
                    'status|1': ['pendding', 'success', 'fail'],
                    title: '@csentence(5, 10)',
                    created_time: '@now'
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
        url: '/vue-element-admin/user_history',
        type: 'get',
        response: config => {
            const { page = 1, limit = 20 } = config.query

            let mockList = []

            for (let i = 0; i < count; i++) {
                mockList.push(Mock.mock({
                    id: '@increment',
                    'type|1': ['audio', 'media', 'video', 'column'],
                    title: '@csentence(5, 10)',
                    total_time: '01:00:00'
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
        url: '/vue-element-admin/user_comment',
        type: 'get',
        response: config => {
            const { page = 1, limit = 20 } = config.query

            let mockList = []

            for (let i = 0; i < count; i++) {
                mockList.push(Mock.mock({
                    id: '@increment',
                    content: '@csentence(5, 10)',
                    created_time: '@now',
                    'type|1': ['audio', 'media', 'video', 'column'],
                    title: '@csentence(5, 10)',
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
        url: '/vue-element-admin/user/no_comment',
        type: 'post',
        response: config => {
            const { id, status } = config.query
            return {
                code: 20000,
                data: true
            }
        }
    },

    {
        url: '/vue-element-admin/user/no_access',
        type: 'post',
        response: config => {
            const { id, status } = config.query
            return {
                code: 20000,
                data: true
            }
        }
    },
]