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
        content: '@cparagraph',
        'price|1': [10, 5, 6, 99, 88, 100],
        't_price|1': [10, 5, 6, 99, 88, 100],
        'status|1': [0, 1],
        'sub_count|1': [10, 5, 6, 99, 88, 100],
        created_time: '@now',
        updated_time: '@now'
    }))
}

module.exports = []