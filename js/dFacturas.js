const ip = "http://35.175.185.255:3001/api/";
const api = "detalle_facturas"


        document.addEventListener('DOMContentLoaded', () => {
            validacion();
      
            document.getElementById('detalleFacturaForm').addEventListener('submit', handleFormSubmit);
   
            loadOptions();
        });

        let table = new DataTable('#detalleFacturaTable');

        function validacion() {
            $("#detalleFacturaForm").validate({
                rules: {
                    cantidad: { required: true, number: true },
                    precio_unitario: { required: true, number: true },
                    subtotal: { required: true, number: true },
                    id_producto: { required: true, number: true },
                    id_factura: { required: true, number: true }
                },
            });
        }

        async function loadOptions() {
            try {
                // Cargar productos
                const productosResponse = await fetch(ip+"productos");
                const productos = await productosResponse.json();
                const productoSelect = document.getElementById('id_producto');
                productos.forEach(producto => {
                    const option = document.createElement('option');
                    option.value = producto.id_producto;
                    option.textContent = producto.nombre;
                    productoSelect.appendChild(option);
                });

                // Cargar facturas
                const facturasResponse = await fetch(ip+"facturas");
                const facturas = await facturasResponse.json();
                const facturaSelect = document.getElementById('id_factura');
                facturas.forEach(factura => {
                    const option = document.createElement('option');
                    option.value = factura.id_factura;
                    option.textContent = `Factura #${factura.codigo}`;
                    facturaSelect.appendChild(option);
                });

                // Cargar detalles de factura
                detalleFacturaTable();
            } catch (error) {
                console.error('Error al cargar opciones:', error);
            }
        }

        async function detalleFacturaTable() {
            try {
                const response = await fetch(ip+api);
                const detalles = await response.json();
                const detalleFacturaTableBody = document.getElementById('detalleFacturaTable').querySelector('tbody');

                // Limpiar tabla
                detalleFacturaTableBody.innerHTML = '';

                detalles.forEach(detalle => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${detalle.id}</td>
                        <td>${detalle.cantidad}</td>
                        <td>${detalle.precio_unitario}</td>
                        <td>${detalle.subtotal}</td>
                        <td>${detalle.id_producto}</td>
                        <td>${detalle.id_factura}</td>
                        <td>
                            <a style="border-radius: 100px;" href="#" class="btn btn-outline-primary"><i class="fas fa-pencil"></i></a>
                            <a style="border-radius: 100px;" href="#" onclick="return confirm('¿Estás seguro de eliminar el detalle de factura ${detalle.id}?')" class="btn btn-outline-danger"><i class="fas fa-trash"></i></a>
                        </td>
                    `;
                    detalleFacturaTableBody.appendChild(row);
                });
            } catch (error) {
                console.error('Error al obtener detalles de factura:', error);
            }
        }

        async function handleFormSubmit(event) {
            event.preventDefault();
            const cantidad = parseInt(document.getElementById('cantidad').value, 10);
            const precio_unitario = parseFloat(document.getElementById('precio_unitario').value);
            const subtotal = parseFloat(document.getElementById('subtotal').value);
            const id_producto = parseInt(document.getElementById('id_producto').value, 10);
            const id_factura = parseInt(document.getElementById('id_factura').value, 10);

            try {
                const response = await fetch(ip+api, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ cantidad, precio_unitario, subtotal, id_producto, id_factura })
                });

                const result = await response.json();

                if (response.ok) {
                    alert("Detalle de factura agregado");
                    // Refrescar tabla
                    detalleFacturaTable();
                } else {
                    alert("Error al agregar detalle de factura");
                }
            } catch (error) {
                document.getElementById('responseMessage').textContent = 'Error: ' + error.message;
            }
        }
