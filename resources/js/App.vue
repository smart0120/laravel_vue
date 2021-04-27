<template>
    <div>
        <div class="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm">
            <h5 class="my-0 mr-md-auto font-weight-normal">Test project: {{ now }}</h5>
            <a class="btn btn-outline-primary" href="#">Username</a>
        </div>
        <div class="m-5 p-3 border">
            <div class="mb-3 d-flex justify-content-between">
                <h5>Contacts</h5>
                <b-button variant="primary" @click="createContact">Add contact</b-button>
            </div>
            <contact-table :contacts="contacts" @updateContact="updateContact" @deleteContact="deleteContact"></contact-table>
        </div>
        <b-modal
            id="editModal"
            title="Create Contact"
            @hidden="resetModal"
        >
            <b-form ref="form" @submit.stop.prevent="handleSubmit">
                <b-form-group
                    label="Name:"
                    :invalid-feedback="`${errorsMsg.name || 'Name is required'}`"
                    :state="fieldState('name')"
                >
                    <b-form-input
                        v-model="name"
                        placeholder="Enter name"
                        :state="fieldState('name')"
                        required
                    />
                </b-form-group>
                <b-form-group
                    label="Email:"
                    :invalid-feedback="`${errorsMsg.email || 'Enter correct email'}`"
                    :state="fieldState('email')"
                >
                    <b-form-input
                        v-model="email"
                        type="email"
                        placeholder="Enter email"
                        :state="fieldState('email')"
                        required
                    />
                </b-form-group>
                <b-form-group
                    label="Address:"
                    :invalid-feedback="`${errorsMsg.address || 'Address is required'}`"
                    :state="fieldState('address')"
                >
                    <b-form-input
                        v-model="address"
                        placeholder="Enter address"
                        :state="fieldState('address')"
                        required
                    />
                </b-form-group>
            </b-form>
            <template #modal-footer="{ cancel }">
                <b-button @click="cancel">CLOSE</b-button>
                <b-button variant="primary" @click="handleSubmit">SAVE CHANGE</b-button>
            </template>
        </b-modal>
        <b-modal
            id="confirmModal"
            title="Delete Contact"
        >
            Are you sure?
            <template #modal-footer="{ cancel }">
                <b-button @click="cancel">CLOSE</b-button>
                <b-button variant="danger" @click="confirmDelete">CONFIRM</b-button>
            </template>
        </b-modal>
    </div>
</template>
 
<script>
export default {
    components: {
    },
    data() {
        return {
            contacts: [],
            name: '',
            email: '',
            address: '',
            error: {
                name: null,
                email: null,
                address: null,
            },
            errorsMsg: {},
            selectedId: null,
        }
    },
    async created() {
        const response = await this.axios.get('/api/contacts/')
        this.contacts = response.data
    },
    methods: {
        resetModal() {
            this.name = ''
            this.email = ''
            this.address = ''
            this.error = {
                name: null,
                email: null,
                address: null,
            }
        },
        checkFormValidity() {
            this.error.name = !!this.name
            this.error.email = !!this.email
            this.error.address = !!this.address
            const valid = this.$refs.form.checkValidity()
            return valid
        },
        async handleSubmit() {
            this.errorsMsg = {}
            if (!this.checkFormValidity()) {
                return
            }
            try {
                if (this.selectedId) {
                    const response = await this.axios
                        .patch(`/api/contacts/${this.selectedId}`, {
                            name: this.name,
                            email: this.email,
                            address: this.address
                        })
                    this.contacts = [
                        ...this.contacts,
                        response.data
                    ];
                } else {
                    const response = await this.axios
                        .post('/api/contacts/', {
                            name: this.name,
                            email: this.email,
                            address: this.address
                        })
                    this.contacts = [
                        response.data,
                        ...this.contacts
                    ];
                }
                this.$bvModal.hide('editModal');
            } catch(e) {
                this.errorsMsg = e.response.data.errors
            }
        },
        checkEmail(email) {
            return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)
        },
        fieldState(fieldName) {
            return this.error[fieldName] && !this.errorsMsg[fieldName]
        },
        createContact() {
            this.selectedId = null
        },
        updateContact(id) {
            this.selectedId = id
            this.$bvModal.show('editModal')
            const contact = this.contacts.find((item) => {
                return item.id === id
            })
            this.name = contact.name
            this.email = contact.email
            this.address = contact.address
        },
        deleteContact(id) {
            this.selectedId = id
            this.$bvModal.show('confirmModal')
        },
        async confirmDelete() {
            await axios.delete(`/api/contacts/${this.selectedId}`)
            this.$bvModal.hide('confirmModal')
            const idx = this.contacts.map(item => item.id).indexOf(this.selectedId);
            this.contacts.splice(idx, 1)
        }
    },
    watch: {
        name(newValue) {
            this.error.name = !!newValue
        },
        email(newValue) {
            this.error.email = this.checkEmail(newValue)
        },
        address(newValue) {
            this.error.address = !!newValue
        }
    },
    computed: {
        now() {
            const now = new Date()
            return now.toDateString()
        }
    }
}
</script>