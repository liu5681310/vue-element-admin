export default {
    swapArray(arr, index1, index2) {
        arr[index1] = arr.splice(index2, 1, arr[index1])[0];
        return arr;
    },
    // 上移 将当前数组index索引与后面一个元素互换位置，向数组后面移动一位
    moveUp(arr, index) {
        this.swapArray(arr, index, index - 1);
    },
    // 下移 将当前数组index索引与前面一个元素互换位置，向数组前面移动一位
    moveDown(arr, index) {
        this.swapArray(arr, index, index + 1);
    },
    // 判断时间状态
    formatGroupStatus(row) {
        if (row.status == 0) {
            return 3
        }

        let start_time = new Date(row.start_time).getTime()
        let end_time = new Date(row.end_time).getTime()
        let now_time = new Date().getTime()

        // 未开始
        if (start_time > now_time) {
            return 0
        }
        // 活动中
        if (now_time > end_time) {
            return 2
        }
        return 1
    },
}