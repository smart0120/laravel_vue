<template>
    <b-table
        striped
        hover
        :items="contacts"
        :fields="fields"
    >
        <template #cell(actions)="row">
            <b-button size="sm" variant="warning" @click="updateRow(row.item)" class="mr-1">
                View
            </b-button>
            <b-button size="sm" variant="danger" @click="deleteRow(row.item)">
                Delete
            </b-button>
        </template>
    </b-table>
</template>

<script>
export default {
    props: {
        contacts: {
            type: Array
        },
    },
    data() {
        return {
            fields: ['name', 'email', 'address', 'created_at', 'actions']
        }
    },
    methods: {
        updateRow(item) {
            this.$emit('updateContact', item.id)
            // this.infoModal.title = `Row index: ${index}`
            // this.infoModal.content = JSON.stringify(item, null, 2)
            // this.$root.$emit('bv::show::modal', this.infoModal.id, button)
        },
        deleteRow(item) {
            this.$emit('deleteContact', item.id)
            // this.infoModal.title = `Row index: ${index}`
            // this.infoModal.content = JSON.stringify(item, null, 2)
            // this.$root.$emit('bv::show::modal', this.infoModal.id, button)
        },
    }
}
</script>
