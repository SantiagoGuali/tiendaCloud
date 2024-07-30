
const ip = "http://localhost:3001/api/";
const api = "customers"
document.addEventListener('DOMContentLoaded', () => {
    validacion();

    document.getElementById('customerForm').addEventListener('submit', handleFormSubmit);
});

let table = new DataTable('#customerTable');

function validacion() {
    $("#customerForm").validate({
        rules: {
            fisrtname: { required: true },
            lastname: { required: true },
            email: { required: true, email: true },
            phone: { required: true },
            address: { required: true },
            age: { required: true, number: true }
        },
    });
}

async function customersTable() {
    try {
        const response = await fetch(ip+api);
        const customers = await response.json();
        const customerTableBody = document.getElementById('customerTable').querySelector('tbody');

        // Limpiar tabla
        customerTableBody.innerHTML = '';

        customers.forEach(customer => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${customer.id}</td>
                <td>${customer.fisrtname}</td>
                <td>${customer.lastname}</td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
                <td>${customer.address}</td>
                <td>${customer.age}</td>
                <td>
                    <a style="border-radius: 100px;" href="#" class="btn btn-outline-primary"><i class="fas fa-pencil"></i></a>
                    <a style="border-radius: 100px;" href="#" onclick="return confirm('¿Estás seguro de eliminar a ${customer.firstname} ${customer.lastname}?')" class="btn btn-outline-danger"><i class="fas fa-trash"></i></a>
                </td>
            `;
            customerTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al obtener proveedores:', error);
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();
    const fisrtname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const age = parseInt(document.getElementById('age').value, 10);


    try {
        const response = await fetch(ip+api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fisrtname, lastname, email, phone, address, age })
        });

        const result = await response.json();

        if (response.ok) {
            alert("Proveedor agregado");
            // Refrescar tabla
            customersTable();
        } else {
            alert("Error al agregar proveedor");
        }
    } catch (error) {
        document.getElementById('responseMessage').textContent = 'Error: ' + error.message;
    }
}

document.addEventListener('DOMContentLoaded', customersTable);
