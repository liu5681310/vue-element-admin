const { Random } = require('mockjs')
const Mock = require('mockjs')

module.exports = [{
        url: '/vue-element-admin/staff/list',
        type: 'get',
        response: config => {
            const { page = 1, limit = 20 } = config.query

            let mockList = []

            for (let i = 0; i < 20; i++) {
                mockList.push(Mock.mock({
                    created_time: '@now',
                    updated_time: '@now',
                    id: '@increment',
                    iscreator: 0,
                    roles: [{
                        id: '@increment',
                        name: "运营"
                    }],
                    user: {
                        avatar: "",
                        username: '@csentence(3, 5)',
                        nickname: ""
                    }
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
        url: '/vue-element-admin/staff/create',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
        }
    },
    {
        url: '/vue-element-admin/staff/setroles',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
        }
    },

    {
        url: '/vue-element-admin/staff/delete',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
        }
    },
]