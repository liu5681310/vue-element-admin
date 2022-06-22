const { Random } = require('mockjs')
const Mock = require('mockjs')

module.exports = [{
        url: '/vue-element-admin/marketing/group/list',
        type: 'get',
        response: config => {
            const { status, title, page = 1, limit = 20, sort } = config.query


            let List = []
            let count = 100

            for (let i = 0; i < count; i++) {
                let obj = Mock.mock({
                    id: '@increment',
                    'type|1': ['course', 'column'],
                    // 关联课程/专栏
                    value: {
                        id: '@increment',
                        title: '@csentence(5, 10)',
                        cover: '@image("200x100")',
                        price: 10
                    },
                    price: 10.00,
                    p_num: 2,
                    auto: 1,
                    expire: 24,
                    'status|1': [0, 1],
                    start_time: '@now',
                    end_time: '@now',
                    created_time: '@now',
                    updated_time: '@now'
                })

                // 活动中
                if (i < 2) {
                    obj.start_time = '2021-01-15 10:00:00'
                    obj.end_time = '2031-01-15 10:00:00'
                }
                // 未开始
                else if (i >= 2 && i < 5) {
                    obj.start_time = '2029-01-15 10:00:00'
                    obj.end_time = '2031-01-15 10:00:00'
                }
                // 已结束
                else if (i > 5) {
                    obj.start_time = '2020-01-15 10:00:00'
                    obj.end_time = '2020-12-15 10:00:00'
                }


                List.push(obj)
            }

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
        url: '/vue-element-admin/marketing/group/create',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
        }
    },

    {
        url: '/vue-element-admin/marketing/group/update',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
        }
    },

    {
        url: '/vue-element-admin/marketing/flashsale/list',
        type: 'get',
        response: config => {
            const { status, title, page = 1, limit = 20, sort } = config.query


            let List = []
            let count = 100

            for (let i = 0; i < count; i++) {
                let obj = Mock.mock({
                    id: '@increment',
                    'type|1': ['course', 'column'],
                    // 关联课程/专栏
                    value: {
                        id: '@increment',
                        title: '@csentence(5, 10)',
                        cover: '@image("200x100")',
                        price: 10
                    },
                    price: 10.00,
                    s_num: 10,
                    used_num: 10,
                    'status|1': [0, 1],
                    start_time: '@now',
                    end_time: '@now',
                    created_time: '@now',
                    updated_time: '@now'
                })

                // 活动中
                if (i < 2) {
                    obj.start_time = '2021-01-15 10:00:00'
                    obj.end_time = '2031-01-15 10:00:00'
                }
                // 未开始
                else if (i >= 2 && i < 5) {
                    obj.start_time = '2029-01-15 10:00:00'
                    obj.end_time = '2031-01-15 10:00:00'
                }
                // 已结束
                else if (i > 5) {
                    obj.start_time = '2020-01-15 10:00:00'
                    obj.end_time = '2020-12-15 10:00:00'
                }


                List.push(obj)
            }

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
        url: '/vue-element-admin/marketing/flashsale/create',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
        }
    },

    {
        url: '/vue-element-admin/marketing/flashsale/update',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
        }
    },

    {
        url: '/vue-element-admin/marketing/coupon/list',
        type: 'get',
        response: config => {
            const { status, title, page = 1, limit = 20, sort } = config.query


            let List = []
            let count = 100

            for (let i = 0; i < count; i++) {
                let obj = Mock.mock({
                    id: '@increment',
                    'type|1': ['course', 'column', 'all'],
                    // 关联课程/专栏
                    value: {
                        id: '@increment',
                        title: '@csentence(5, 10)',
                        cover: '@image("200x100")',
                        price: 10
                    },
                    condition: 100.00,
                    price: 10.00,
                    c_num: 10,
                    received_num: 1,
                    used_num: 10,
                    'status|1': [0, 1],
                    start_time: '@now',
                    end_time: '@now',
                    created_time: '@now',
                    updated_time: '@now'
                })

                // 活动中
                if (i < 2) {
                    obj.start_time = '2021-01-15 10:00:00'
                    obj.end_time = '2031-01-15 10:00:00'
                }
                // 未开始
                else if (i >= 2 && i < 5) {
                    obj.start_time = '2029-01-15 10:00:00'
                    obj.end_time = '2031-01-15 10:00:00'
                }
                // 已结束
                else if (i > 5) {
                    obj.start_time = '2020-01-15 10:00:00'
                    obj.end_time = '2020-12-15 10:00:00'
                }


                List.push(obj)
            }

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
        url: '/vue-element-admin/marketing/coupon/create',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
        }
    },

    {
        url: '/vue-element-admin/marketing/coupon/update',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
        }
    },
]