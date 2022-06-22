import store from '@/store'

function checkPermission(el, binding) {
    const { value } = binding
    const accesses = store.getters && store.getters.accesses

    if (value) {
        const hasPermission = accesses.includes(value)

        if (!hasPermission) {
            el.parentNode && el.parentNode.removeChild(el)
        }
    } else {
        throw new Error(`need accesses! Like v-permission="'/admin/s/bbs/save,POST'"`)
    }

}

export default {
    inserted(el, binding) {
        checkPermission(el, binding)
    },
    update(el, binding) {
        checkPermission(el, binding)
    }
}