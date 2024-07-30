const ip = "http://35.175.185.255:3001/api/";
const api = "facturas"
document.addEventListener('DOMContentLoaded', () => {
    validacion();
    document.getElementById('facturaForm').addEventListener('submit', handleFormSubmit);
});

let table = new DataTable('#facturaTable');

function validacion() {
    $("#facturaForm").validate({
        rules: {
            codigo: { required: true },
            fecha_emision: { required: true, date: true },
            monto_total: { required: true, number: true }
        },
    });
}

async function facturaTable() {
    try {
        const response = await fetch(ip+api);
        const facturas = await response.json();
        const facturaTableBody = document.getElementById('facturaTable').querySelector('tbody');

        // Limpiar tabla
        facturaTableBody.innerHTML = '';

        facturas.forEach(factura => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${factura.id_factura}</td>
                <td>${factura.codigo}</td>
                <td>${factura.fecha_emision}</td>
                <td>${factura.nota || 'N/A'}</td>
                <td>${factura.impuesto || '0.00'}</td>
                <td>${factura.monto_total}</td>
                <td>
                    <a style="border-radius: 100px;" href="#" class="btn btn-outline-primary"><i class="fas fa-pencil"></i></a>
                    <a style="border-radius: 100px;" href="#" onclick="return confirm('¿Estás seguro de eliminar la factura con código ${factura.codigo}?')" class="btn btn-outline-danger"><i class="fas fa-trash"></i></a>
                </td>
            `;
            facturaTableBody.appendChild(row);
        });

        // Inicializar DataTable
        $('#facturaTable').DataTable();

    } catch (error) {
        console.error('Error al obtener facturas:', error);
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();
    const codigo = document.getElementById('codigo').value;
    const fecha_emision = document.getElementById('fecha_emision').value;
    const nota = document.getElementById('nota').value;
    const impuesto = parseFloat(document.getElementById('impuesto').value) || 0;
    const monto_total = parseFloat(document.getElementById('monto_total').value);

    try {
        const response = await fetch(ip+api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ codigo, fecha_emision, nota, impuesto, monto_total })
        });

        const result = await response.json();

        if (response.ok) {
            alert("Factura agregada");
            // Refrescar tabla
            facturaTable();
        } else {
            alert("Error al agregar factura");
        }
    } catch (error) {
        document.getElementById('responseMessage').textContent = 'Error: ' + error.message;
    }
}

// Refrescar tabla al cargar la página
document.addEventListener('DOMContentLoaded', facturaTable);