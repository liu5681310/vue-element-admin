const { Random } = require('mockjs')
const Mock = require('mockjs')

module.exports = [{
        url: '/vue-element-admin/school/list',
        type: 'get',
        response: config => {
            const { page = 1, limit = 20 } = config.query

            let mockList = []

            for (let i = 0; i < 20; i++) {
                mockList.push(Mock.mock({
                    created_time: '@now',
                    updated_time: '@now',
                    id: '@increment',
                    title: '@csentence(3, 5)',
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
        url: '/vue-element-admin/school/create',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
        }
    },
]