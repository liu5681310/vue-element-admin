const { Random } = require('mockjs')
const Mock = require('mockjs')

let List = []
const count = 100

for (let i = 0; i < count; i++) {
    List.push(Mock.mock({
        id: '@increment',
        no: '@increment',
        goods: [{
            title: '@csentence(5, 10)',
        }],
        'type|1': ['group', 'default'],
        'status|1': ['pendding', 'success', 'fail'],
        total_price: 10.00,
        'price|1': [10.00, 0.00, 3.00],
        pay_method: 'wechat',
        pay_time: '@now',
        created_time: '@now',
        updated_time: '@now'
    }))
}

module.exports = [{
        url: '/vue-element-admin/order/list',
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
        url: '/vue-element-admin/pay/assets',
        type: 'get',
        response: config => {
            const { page = 1, limit = 20 } = config.query

            let mockList = []
            mockList.push(Mock.mock({
                id: '@increment',
                created_time: '@now',
                account: "6216**********7287",
                name: "王XX",
                'price|1': [10.00, 0.00, 3.00],
                'status|1': [0, 1]
            }))

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
        url: '/vue-element-admin/pay/payments',
        type: 'get',
        response: config => {
            const { page = 1, limit = 20 } = config.query

            let mockList = []
            mockList.push(Mock.mock({
                id: '@increment',
                account: "6216**********7287",
                province: "广东省",
                city: "广州市",
                area: "天河区",
                path: "中国银行北京西罗园支行",
                bank: "中国银行",
                name: "王XX",
                status: 1,
                created_time: '@now',
            }))

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
        url: '/vue-element-admin/order/delete',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
        }
    },
    {
        url: '/vue-element-admin/assets/cashout',
        type: 'post',
        response: _ => {
            let { price, payment_id } = _.query
            return {
                code: 20000,
                data: Mock.mock({
                    id: '@increment',
                    created_time: '@now',
                    account: "6216**********7287",
                    name: "王XX",
                    price,
                    status: 0
                })
            }
        }
    },
    {
        url: '/vue-element-admin/payment/create',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
        }
    },
    {
        url: '/vue-element-admin/payment/update',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
        }
    },
    {
        url: '/vue-element-admin/payment/delete',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
        }
    },
]