const ip = "http://35.175.185.255:3001/api/";
const api = "productos"
document.addEventListener('DOMContentLoaded', () => {
    validacion();
    document.getElementById('productForm').addEventListener('submit', handleFormSubmit);
    loadOptions();
});

let table = new DataTable('#productTable');

function validacion() {
    $("#productForm").validate({
        rules: {
            nombre: { required: true },
            precio: { required: true, number: true },
            id_proveedor: { required: true, number: true }
        },
    });
}

async function loadOptions() {
    try {
        // Cargar proveedores
        const proveedoresResponse = await fetch(ip+"proveedores");
        const proveedores = await proveedoresResponse.json();
        const proveedorSelect = document.getElementById('id_proveedor');
        proveedores.forEach(proveedor => {
            const option = document.createElement('option');
            option.value = proveedor.id_proveedor;
            option.textContent = `Proveedor #${proveedor.nombre}`;
            proveedorSelect.appendChild(option);
        });
        
        productTable();

    } catch (error) {
        console.error('Error al cargar opciones:', error);
    }
}

async function productTable() {
    try {
        const response = await fetch(ip+api);
        const productos = await response.json();
        const productTableBody = document.getElementById('productTable').querySelector('tbody');

        // Limpiar tabla
        productTableBody.innerHTML = '';

        productos.forEach(producto => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${producto.id_producto}</td>
                <td>${producto.nombre}</td>
                <td>${producto.descripcion}</td>
                <td>${producto.categoria}</td>
                <td>${producto.precio}</td>
                <td>${producto.cantidad_nventario}</td>
                <td>${producto.fecha_adquisicion}</td>
                <td>${producto.id_proveedor}</td>
                <td>
                    <a style="border-radius: 100px;" href="#" class="btn btn-outline-primary"><i class="fas fa-pencil"></i></a>
                    <a style="border-radius: 100px;" href="#" onclick="return confirm('¿Estás seguro de eliminar el producto ${producto.nombre}?')" class="btn btn-outline-danger"><i class="fas fa-trash"></i></a>
                </td>
            `;
            productTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const categoria = document.getElementById('categoria').value;
    const precio = parseFloat(document.getElementById('precio').value);
    const cantidad_nventario = parseInt(document.getElementById('cantidad_nventario').value, 10);
    const fecha_adquisicion = document.getElementById('fecha_adquisicion').value;
    const id_proveedor = parseInt(document.getElementById('id_proveedor').value, 10);

    try {
        const response = await fetch(ip+api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, descripcion, categoria, precio, cantidad_nventario, fecha_adquisicion, id_proveedor })
        });

        const result = await response.json();

        if (response.ok) {
            alert("Producto agregado");
            productTable();
        } else {
            alert("Error al agregar producto");
        }
    } catch (error) {
        document.getElementById('responseMessage').textContent = 'Error: ' + error.message;
    }
}


document.addEventListener('DOMContentLoaded', productTable);