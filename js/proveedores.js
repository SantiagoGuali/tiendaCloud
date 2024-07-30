const ip = "http://35.175.185.255:3001/api/";
const api = "proveedores"
document.addEventListener('DOMContentLoaded', () => {
    validacion();
    document.getElementById('customerForm').addEventListener('submit', handleFormSubmit);
});

let table = new DataTable('#customerTable');

function validacion() {
    $("#customerForm").validate({
        rules: {
            nombre: { required: true },
            contacto: { required: true },
            telefono: { required: true },
            direccion: { required: true },
            mail: { required: true, email: true }
        },
        messages: {
            nombre: "Por favor ingrese el nombre",
            contacto: "Por favor ingrese el contacto",
            telefono: "Por favor ingrese el teléfono",
            direccion: "Por favor ingrese la dirección",
            mail: "Por favor ingrese un correo electrónico válido"
        }
    });
}

async function customersTable() {
    try {
        const response = await fetch(ip+api);
        const customers = await response.json();
        const customerTableBody = document.getElementById('customerTable').querySelector('tbody');

        customerTableBody.innerHTML = '';

        customers.forEach(customer => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${customer.id_proveedor}</td>
                <td>${customer.nombre}</td>
                <td>${customer.contacto}</td>
                <td>${customer.telefono}</td>
                <td>${customer.direccion}</td>
                <td>${customer.mail}</td>
                <td>
                    <a href="#" class="btn btn-outline-primary"><i class="fas fa-pencil"></i></a>
                    <a href="#" onclick="return confirm('¿Estás seguro de eliminar a ${customer.nombre}?')" class="btn btn-outline-danger"><i class="fas fa-trash"></i></a>
                </td>
            `;
            customerTableBody.appendChild(row);
        });

        $('#customerTable').DataTable();
    } catch (error) {
        console.error('Error al obtener proveedores:', error);
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const contacto = document.getElementById('contacto').value;
    const telefono = document.getElementById('telefono').value;
    const direccion = document.getElementById('direccion').value;
    const mail = document.getElementById('mail').value;

    try {
        const response = await fetch(ip+api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, contacto, telefono, direccion, mail })
        });

        const result = await response.json();

        if (response.ok) {
            alert("Proveedor agregado");
            customersTable();
        } else {
            alert("Error al agregar Proveedor: " + result.error);
        }
    } catch (error) {
        document.getElementById('responseMessage').textContent = 'Error: ' + error.message;
    }
}

document.addEventListener('DOMContentLoaded', customersTable);