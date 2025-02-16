class BackendAdapter {
    constructor(url) {
        this.url = url
    }

    // Backup

    createBackup() {
        const download = (uri) => {
            const link = document.createElement("a");
            link.href = uri;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        download(`${this.url}/create-backup`)
    }

    restoreBackup(formData) {
        return fetch(`${this.url}/restore-backup`, {
            method: "POST",
            body: formData,
        });
    }

    // Clients
    listClients() {
        return fetch(`${this.url}/list-clients`)
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

    markClientsActive(clients_to_activate, activate) {
        return fetch(`${this.url}/activate-clients`, {
            method: "POST",
            body: JSON.stringify({
                clients_to_activate,
                activate
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
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
    listDogs() {
        return fetch(`${this.url}/list-dogs`)
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

    markDogsActive(dogs_to_activate, activate) {
        return fetch(`${this.url}/activate-dogs`, {
            method: "POST",
            body: JSON.stringify({
                dogs_to_activate,
                activate
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
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

    listInstructors() {
        return fetch(`${this.url}/list-instructors`)
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

    markInstructorsActive(instructors_to_activate, activate) {
        return fetch(`${this.url}/activate-instructors`, {
            method: "POST",
            body: JSON.stringify({
                instructors_to_activate,
                activate
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
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

    // Sessions

    listSessions() {
        return fetch(`${this.url}/list-sessions`)
            .then(res => res.json());
    }

    listSessionDetails(id) {
        return fetch(`${this.url}/list-session-details?id=${id}`)
            .then(res => res.json());
    }

    saveSession(session) {
        return fetch(`${this.url}/save-session`, {
            method: "POST",
            body: JSON.stringify({
                session
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
    }

    deleteSession(id) {
        return fetch(`${this.url}/delete-session`, {
            method: "POST",
            body: JSON.stringify({
                id
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
    }
}



export default BackendAdapter
