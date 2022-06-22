<template>
    <div>
        <div v-if="show">
            <div class="tinymceplus-modal" @click="show = false"></div>
            <tinymce style="position: relative;z-index: 10000;" :value="value" @input="input" :height="height" :width="width" />
        </div>

        <div v-else class="tinymceplus-box" v-html="value" @click="show = true"></div>

    </div>
</template>
<script>
    import Tinymce from '@/components/Tinymce'
    export default {
        data() {
            return {
                show: false
            }
        },
        model: {
            prop: "value",
            event: "input"
        },
        components: {
            Tinymce
        },
        props: {
            height: {
                type: [String, Number],
                default: 300
            },
            width: {
                type: [String, Number],
                default: 600
            },
            value: {
                type: String,
                default: ""
            }
        },
        methods: {
            input(e) {
                this.$emit('input', e)
            }
        }
    }
</script>
<style>
    .tinymceplus-box {
        border: 1px dotted;
        min-height: 40px;
        padding: 0 10px;
        cursor: pointer;
    }
    
    .tinymceplus-box:hover {
        background: #fffde7;
    }
    
    .tinymceplus-box p {
        padding: 0;
        margin: 0;
    }
    
    .tinymceplus-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1000;
    }
</style>