const { Random } = require('mockjs')
const Mock = require('mockjs')

module.exports = [{
        url: '/vue-element-admin/tool/testpaper/list',
        type: 'get',
        response: config => {
            const { status, title, page = 1, limit = 20, sort } = config.query


            let List = []
            let count = 100

            for (let i = 0; i < count; i++) {
                let obj = Mock.mock({
                    id: '@increment',
                    title: '@csentence(5, 10)',
                    'status|1': [0, 1],
                    total_score: 100,
                    pass_score: 60,
                    expire: 60,
                    created_time: '@now',
                    updated_time: '@now'
                })

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
        url: '/vue-element-admin/tool/testpaper/read',
        type: 'get',
        response: _ => {
            return {
                code: 20000,
                data: {
                    id: 123,
                    title: '试卷标题',
                    status: 1,
                    total_score: 100,
                    pass_score: 60,
                    expire: 60,
                    questions: [{
                        question: {
                            id: 1,
                            title: "题目名称",
                            type: "radio",
                            value: {
                                value: 0,
                                options: ['选项1', '选项2']
                            },
                        },
                        score: 5
                    }]
                }
            }
        }
    },
    {
        url: '/vue-element-admin/tool/testpaper/create',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
        }
    },

    {
        url: '/vue-element-admin/tool/testpaper/update',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
        }
    },
    {
        url: '/vue-element-admin/tool/testpaper/delete',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
        }
    },


    {
        url: '/vue-element-admin/tool/user_test/list',
        type: 'get',
        response: config => {
            const { status, title, page = 1, limit = 20, sort } = config.query


            let List = []
            let count = 100

            for (let i = 0; i < count; i++) {
                let obj = Mock.mock({
                    id: '@increment',
                    testpaper: {
                        title: '@csentence(5, 10)',
                    },
                    user: {
                        username: '@csentence(2, 3)',
                        nickname: '@csentence(2, 3)',
                    },
                    answer_status: 1, // 1答题完成，0未完成
                    read_status: 0, // 1阅卷完成，0未完成
                    created_time: '@now',
                    updated_time: '@now',
                    score: 0,
                })

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
        url: '/vue-element-admin/tool/user_test/update',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
        }
    },
    {
        url: '/vue-element-admin/tool/user_test/delete',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
        }
    },
    {
        url: '/vue-element-admin/tool/user_test/read',
        type: 'get',
        response: _ => {
            return {
                code: 20000,
                data: {
                    id: 123,
                    testpaper: {
                        title: '试卷标题',
                    },
                    // 当前试卷的所有题目
                    questions: [{
                        question: {
                            id: 1,
                            title: "单选",
                            type: "radio",
                            value: {
                                value: 0,
                                options: ['选项1', '选项2']
                            },
                        },
                        score: 5
                    }, {
                        question: {
                            id: 1,
                            title: "多选",
                            type: "checkbox",
                            value: {
                                value: [0, 2],
                                options: ['选项1', '选项2', '选项3']
                            },
                        },
                        score: 5
                    }, {
                        question: {
                            id: 1,
                            title: "判断题",
                            type: "trueOrfalse",
                            value: {
                                value: 0,
                                options: ['正确', '错误']
                            },
                        },
                        score: 5
                    }, {
                        question: {
                            id: 1,
                            title: "问答题",
                            type: "answer",
                            value: {
                                options: ['答案内容']
                            },
                        },
                        score: 5
                    }, {
                        question: {
                            id: 1,
                            title: "填空题",
                            type: "completion",
                            value: {
                                options: ['填空1', '填空2']
                            },
                        },
                        score: 5
                    }],
                    // 考生每一道题的答案
                    values: [{
                        type: "radio",
                        answer: 1,
                        score: 0
                    }, {
                        type: "checkbox",
                        answer: [0, 1],
                        score: 0
                    }, {
                        type: "trueOrfalse",
                        answer: 1,
                        score: 0
                    }, {
                        type: "answer",
                        answer: ["这是问答答案"],
                        score: 0
                    }, {
                        type: "completion",
                        answer: ['填空题答案'],
                        score: 0
                    }],
                    score: 0
                }
            }
        }
    },
]