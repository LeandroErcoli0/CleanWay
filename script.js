document.addEventListener("DOMContentLoaded", function () {
    
    // VARIABLES GLOBALES
    const menu = document.querySelector(".nav__menu");
    const navLink = document.querySelector(".nav__link");
    const closeMenu = document.querySelector(".nav__close");
    const body = document.body;
    const filtros = document.querySelectorAll(".filtro");
    const productos = document.querySelectorAll(".producto");
    const botonCompra = document.getElementById("botonCompra");
    const buscador = document.getElementById("buscador");
    
    // Variables del modal (definidas globalmente)
    let nombre, imagen, precio;
    // MENÚ RESPONSIVO
    menu.addEventListener("click", () => {
        navLink.classList.add("nav__active");
        body.classList.add("no-scroll");
    });

    closeMenu.addEventListener("click", () => {
        navLink.classList.remove("nav__active");
        body.classList.remove("no-scroll");
    });
    

    // FILTRO POR CATEGORÍA
    filtros.forEach(filtro => {
        filtro.addEventListener("click", function () {
            filtros.forEach(btn => btn.classList.remove("activo"));
            this.classList.add("activo");

            const categoria = this.getAttribute("data-categoria");
            productos.forEach(producto => {
                producto.style.display = (categoria === "todos" || producto.getAttribute("data-categoria") === categoria)
                    ? "flex"
                    : "none";
            });
        });
    });
    // FILTRO POR BÚSQUEDA
    if (document.getElementById("buscador")){
    buscador.addEventListener("input", () => {
        const texto = buscador.value.toLowerCase();

        productos.forEach(producto => {
            const nombre = producto.querySelector(".nombre_prod").textContent.toLowerCase();
            if (nombre.includes(texto)) {
                producto.style.display = "block";
            } else {
                producto.style.display = "none";
            }
        });
    });};

    // MOSTRAR DETALLES DEL PRODUCTO
    productos.forEach(producto => {
        producto.addEventListener("click", function () {
            console.log("producto");
            // Obtener los elementos del modal
            const modal = document.getElementById("modal-producto");
            const modalNombre = document.getElementById("modal-nombre");
            const modalImagen = document.getElementById("modal-imagen");
            const modalPrecio = document.getElementById("modal-precio");
            const modalCantidad = document.getElementById("cantidad");

            // Obtener los detalles del producto
            nombre = producto.querySelector(".nombre_prod").textContent;
            imagen = producto.querySelector(".imagen").src;
            precio = producto.querySelector(".precio").textContent;
            // Actualizar los valores en el modal
            modalNombre.textContent = nombre;
            modalImagen.src = imagen;
            modalPrecio.textContent = precio;

            // Mostrar el modal
            modal.classList.remove("oculto");
            modal.classList.add("visible");

            // Cerrar el modal cuando se hace clic en la 'X'
            const cerrarModal = document.getElementById("cerrar-modal");
            cerrarModal.addEventListener("click", function () {
                modal.classList.remove("visible");
                modal.classList.add("oculto");
            });

            // Cerrar el modal si se hace clic fuera del contenido del modal
            window.addEventListener("click", function (event) {
                if (event.target === modal) {
                    modal.classList.remove("visible");
                    modal.classList.add("oculto");
                }
            });
        });
    });

    // AGREGAR AL CARRITO
    if (document.getElementById("agregar-carrito")){
    const agregarCarrito = document.getElementById("agregar-carrito");
    agregarCarrito.addEventListener("click", function () {
        const modalCantidad = document.getElementById("cantidad");
        const cantidad = parseInt(modalCantidad.value, 10);

        if (cantidad > 0) {
            let carrito = obtenerCarrito();

            let productoExistente = carrito.find(item => item.nombre === nombre);

            if (productoExistente) {
                productoExistente.cantidad += cantidad;
            } else {
                carrito.push({ nombre, cantidad, precio, imagen });
            }

            localStorage.setItem("carrito", JSON.stringify(carrito));
            console.log("Carrito actualizado:", carrito);
            console.log(carrito)
            const modal = document.getElementById("modal-producto");
            modal.classList.remove("visible");
            modal.classList.add("oculto");
        } else {
            alert("Por favor, ingrese una cantidad válida.");
        }
    });};

    // CARGAR CARRITO EN LA PÁGINA DEL CARRITO
    if (document.getElementById("carrito-items")) {
        console.log("Carrito cargado");
        mostrarCarrito();
        const comprarBtn = document.querySelector("#comprar");
        if (comprarBtn) {
            comprarBtn.addEventListener("click", function () {
                window.location.href = "datos.html";
            });
        }
    }

    // Validar formulario antes de confirmar compra
    if (botonCompra) {
        botonCompra.addEventListener("click", function (event) {
            event.preventDefault();
            console.log("Verificando datos antes de enviar...");

            const direccion = document.getElementById("direccion").value.trim();
            const telefono = document.getElementById("telefono").value.trim();
            const nombre = document.getElementById("nombre").value.trim();
            const mail = document.getElementById("mail").value.trim();

            const telefonoValido = /^[+\d\s-]+$/.test(telefono);
            const mailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);

            if (direccion && telefonoValido && nombre && mailValido) {
                console.log("Datos válidos, procediendo a enviar...");
                enviarPedidoWhatsApp();
            } else {
                console.log("Los datos son incorrectos. Verifica dirección, teléfono, nombre o correo.");
                alert("Por favor, ingresa datos válidos.");
            }
        });
    }

    // Función para obtener el carrito con manejo de errores
    function obtenerCarrito() {
        try {
            return JSON.parse(localStorage.getItem("carrito")) || [];
        } catch (error) {
            console.error("Error al obtener carrito:", error);
            return [];
        }
    }

    // Función para enviar los datos del pedido a WhatsApp
    function enviarPedidoWhatsApp() {
        let telefono = "543416161411"; // Número en formato internacional sin "+"
        
        let direccion = document.getElementById("direccion").value.trim();
        let telefonoCliente = document.getElementById("telefono").value.trim();
        let nombre = document.getElementById("nombre").value.trim();
        let mail = document.getElementById("mail").value.trim();
        
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        
        let mensaje = `📦 *Pedido Enviado* %0A`;
        mensaje += `🛑 *Nombre:* ${nombre} %0A`;
        mensaje += `📍 *Dirección:* ${direccion} %0A`;
        mensaje += `📞 *Teléfono:* ${telefonoCliente} %0A`;
        mensaje += `📧 *Email:* ${mail} %0A`;
        mensaje += `%0A🛒 *Productos:* %0A`;
        let TotalPrecio = 0; // Inicializar el total fuera del bucle
        carrito.forEach(item => {
            let precioNumerico = parseFloat(item.precio.replace(/[^\d.]/g, "")); // Convertir precio a número
            
            if (!isNaN(precioNumerico)) {
                let subtotal = precioNumerico * item.cantidad;
                TotalPrecio += subtotal; // Sumar al total
                
                let productoInfo = `- ${item.nombre} (x${item.cantidad}) - $${subtotal.toFixed(2)}%0A`;
                mensaje += productoInfo;
            }
        });
        
        // Agregar el total fuera del bucle para evitar repeticiones
        mensaje += `%0A💰 *Total: $${TotalPrecio.toFixed(2)}* %0A`;
    
        if (carrito.length === 0) {
            mensaje += 'No hay productos en el carrito. %0A';
        }
    
        let url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
        window.location.href = url;
    }

    // Función para mostrar el carrito
    function mostrarCarrito() {
        const carritoContainer = document.getElementById("carrito-items");
        console.log("hola")
        console.log(carritoContainer);
    
        carritoContainer.innerHTML = "";

        let carrito = obtenerCarrito();
        console.log("carrito obtenido");
        console.log(carrito);

        if (carrito.length === 0) { 
            carritoContainer.innerHTML = "<p>El carrito está vacío.</p>";
            document.getElementById("total").textContent = "0.0";
            console.log("no hay nada");
            return;
        }

        let total = 0;

        carrito.forEach((producto, index) => {
            const div = document.createElement("div");
            div.classList.add("carrito-item");
            let precioNumerico = parseFloat(producto.precio.replace(/[^0-9.]/g, ""));
            if (!isNaN(precioNumerico)) {
                total += precioNumerico * producto.cantidad;
                div.innerHTML = `   
                <img src="${producto.imagen}" alt="${producto.nombre}" class="carrito-img">
                <span><strong>Nombre:</strong> ${producto.nombre}</span>
                <span><strong>Precio:</strong> $${precioNumerico.toFixed(2)}</span>
                <span><strong>Cantidad:</strong> ${producto.cantidad}</span>
                <span><strong>Subtotal:</strong> $${(precioNumerico * producto.cantidad).toFixed(2)}</span>
                <button class="eliminar-producto" data-index="${index}">
                    <img src="./Imagenes/BorrarItem.svg" alt="Eliminar" class="btn-eliminar">
                </button>
                `;
                } else {
                    console.error("Error: el precio no es un número válido", producto);
                    console.log("Precio en el carrito:", producto.precio);
                }   

            carritoContainer.appendChild(div);
        });

        if (total < 30000) {
            total += 500;
            document.getElementById("total").textContent = `Total: $${total.toFixed(2)} (Envío incluido)`;
        } else {
            document.getElementById("total").textContent = `Total: $${total.toFixed(2)} (Envío gratis)`;
        }

        // Asignar eventos a los botones de eliminar
        document.querySelectorAll(".eliminar-producto").forEach(boton => {
            boton.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                let carrito = obtenerCarrito();
                carrito.splice(index, 1);
                localStorage.setItem("carrito", JSON.stringify(carrito));
                mostrarCarrito();
            });
        });
    }
});
