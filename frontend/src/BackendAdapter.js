class BackendAdapter {
    constructor(url) {
        this.url = url
    }

    // Clients
    listClients() {
        return fetch(`${this.url}/list-clients`)
            .then(res => res.json());
    }

    listClientsDetails() {
        return fetch(`${this.url}/list-clients-details`)
            .then(res => res.json());
    }

    addNewClient({first_name, last_name, email, phone}) {
        return fetch(`${this.url}/add-new-client`, {
            method: "POST",
            body: JSON.stringify({
                first_name,
                last_name,
                email,
                phone
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
    }

    modifyClient(id, {first_name, last_name, email, phone}) {
        return fetch(`${this.url}/modify-client`, {
            method: "POST",
            body: JSON.stringify({
                id,
                first_name,
                last_name,
                email,
                phone
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
    }

    deleteClients(clients_to_delete) {
        return fetch(`${this.url}/delete-clients`, {
            method: "POST",
            body: JSON.stringify({
                clients_to_delete
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
    }


    // Dogs
    listDogsDetails() {
        return fetch(`${this.url}/list-dogs-details`)
            .then(res => res.json());
    }

    addNewDog({pet_name, owner_id, dob, breed, sex, notes}) {
        return fetch(`${this.url}/add-new-dog`, {
            method: "POST",
            body: JSON.stringify({
                pet_name,
                owner_id,
                dob,
                breed,
                sex,
                notes
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
    }

    modifyDog(id, {pet_name, owner_id, dob, breed, sex, notes}) {
        return fetch(`${this.url}/modify-dog`, {
            method: "POST",
            body: JSON.stringify({
                id,
                pet_name,
                owner_id,
                dob,
                breed,
                sex,
                notes
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
    }

    deleteDogs(dogs_to_delete) {
        return fetch(`${this.url}/delete-dogs`, {
            method: "POST",
            body: JSON.stringify({
                dogs_to_delete
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
    }

    // Instructors
    listInstructors() {
        return fetch(`${this.url}/list-instructors`)
            .then(res => res.json());
    }

    listInstructorsDetails() {
        return fetch(`${this.url}/list-instructors-details`)
            .then(res => res.json());
    }

    addNewInstructor({ first_name, last_name, email, phone }) {
        return fetch(`${this.url}/add-new-instructor`, {
            method: "POST",
            body: JSON.stringify({
                first_name,
                last_name,
                email,
                phone
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
    }

    modifyInstructor(id, { first_name, last_name, email, phone }) {
        return fetch(`${this.url}/modify-instructor`, {
            method: "POST",
            body: JSON.stringify({
                id,
                first_name,
                last_name,
                email,
                phone
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
    }

    deleteInstructors(instructors_to_delete) {
        return fetch(`${this.url}/delete-instructors`, {
            method: "POST",
            body: JSON.stringify({
                instructors_to_delete
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
    }
}



export default BackendAdapter
