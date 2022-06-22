<template>
  <div class="dndList">
    <draggable :set-data="setData" :list="list" group="course" class="dragArea" @change="handleChange">
        <div v-for="(element,index) in list" :key="element.id" class="list-complete-item" style="border: 0;padding:20px;border-bottom:1px solid #eeeeee;" :style="element.id == activeId ? 'background-color:#eeeeee;' : ''" @click="handleActive(element)">
          <div class="list-complete-item-handle" style="display:flex;align-items: center;font-size:16px;">
           <div>
               <div>{{ index + 1 }}. {{ element.title }}</div>
               <div style="padding-left:20px;">
                    <el-tag v-if="element.isfree" type="danger" size="mini"  effect="dark">试读</el-tag>
                </div>
           </div>
          </div>
          <div style="position:absolute;right:0px;">
            <span style="float: right ;margin-top: -20px;margin-right:5px;" @click.stop="$emit('del',element)">
              <i style="color:#ff4949" class="el-icon-delete" />
            </span>
          </div>
        </div>
    </draggable>
  </div>
</template>

<script>
    import draggable from 'vuedraggable'

    export default {
        name: 'DndList',
        components: {
            draggable
        },
        data() {
            return {
                activeId:0
            }
        },
        props: {
            list: {
                type: Array,
                default () {
                    return []
                }
            },
        },
        methods: {
            handleActive(row){
                this.activeId = row.id
                this.$emit('click',row)
            },
            setData(dataTransfer) {
                // to avoid Firefox bug
                // Detail see : https://github.com/RubaXa/Sortable/issues/1012
                dataTransfer.setData('Text', '')
            },
            handleChange(e){
                this.$emit('sort',this.list.map(o=>o.id))
            }
        }
    }
</script>

<style lang="scss" scoped>
    .dndList {
        background: #fff;
        padding-bottom: 40px;
        &:after {
            content: "";
            display: table;
            clear: both;
        }
        .dndList-list {
            float: left;
            padding-bottom: 30px;
            &:first-of-type {
                margin-right: 2%;
            }
            .dragArea {
                margin-top: 15px;
                min-height: 50px;
                padding-bottom: 30px;
            }
        }
    }
    
    .list-complete-item {
        cursor: pointer;
        position: relative;
        font-size: 14px;
        padding: 5px 12px;
        margin-top: 4px;
        border: 1px solid #bfcbd9;
        transition: all 1s;
    }
    
    .list-complete-item-handle {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: 50px;
    }
    
    .list-complete-item-handle2 {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: 20px;
    }
    
    .list-complete-item.sortable-chosen {
        background: #4AB7BD;
    }
    
    .list-complete-item.sortable-ghost {
        background: #30B08F;
    }
    
    .list-complete-enter,
    .list-complete-leave-active {
        opacity: 0;
    }
</style>
<style>
    .sortable-ghost {
        background-color: #30B08F!important;
    }
</style>