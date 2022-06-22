const { Random } = require('mockjs')
const Mock = require('mockjs')

module.exports = [{
        url: '/vue-element-admin/tool/question/list',
        type: 'get',
        response: config => {
            const { status, title, page = 1, limit = 20, sort } = config.query


            let List = []
            let count = 100

            for (let i = 0; i < count; i++) {
                let obj = Mock.mock({
                    id: '@increment',
                    'type|1': ['radio', 'checkbox', 'trueOrfalse', 'answer', 'completion'],
                    title: '@csentence(5, 10)',
                    value: null,
                    remark: '@csentence(5, 10)',
                    created_time: '@now',
                    updated_time: '@now'
                })

                const val = {
                    radio: {
                        value: 0,
                        options: ['选项1', '选项2']
                    },
                    checkbox: {
                        value: [0, 2],
                        options: ['选项1', '选项2', '选项3']
                    },
                    trueOrfalse: {
                        value: 0,
                        options: ['正确', '错误']
                    },
                    answer: {
                        options: ['答案内容']
                    },
                    completion: {
                        options: ['填空1', '填空2']
                    }
                }

                obj.value = val[obj.type]

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
        url: '/vue-element-admin/tool/question/create',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
        }
    },

    {
        url: '/vue-element-admin/tool/question/update',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
        }
    },
    {
        url: '/vue-element-admin/tool/question/delete',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
        }
    },
]