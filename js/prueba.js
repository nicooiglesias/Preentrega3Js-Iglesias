
let carrito = [];
let subTotal = [];
let total;
let filtrados = "";
let filtroCheck = [];
let cuerpo = document.getElementById("mainHtml");
let botonBuscarJs = document.getElementById("botonBuscar");
let inputBuscarHtml = document.getElementById("inputBuscar");
let contenedorCarritoJs = document.getElementById("contenedorCarrito");
let mostrarCarro = document.getElementById("mostrar");

inputBuscarHtml.onchange = realizarBusqueda;
botonBuscarJs.onclick = realizarBusqueda;
mostrarCarro.onclick = visualizacionCarrito

let checkCategorias = document.getElementsByClassName("categorias");
for (const checkCategoria of checkCategorias) {
    checkCategoria.onclick = filtradoCheck;
};

//funcion para crear caja contenedores de productos
function mostrarProducto(producto) {
    contenedorPrincipal.innerHTML = "";
    producto.forEach((e) => {
        let contenedorProducto = document.createElement("article");
        contenedorProducto.className = "articulo";
        contenedorProducto.innerHTML = `
        
        <div>
            <h3 class="productos">${e.categoria}</h3>
            <p > 
                ${e.nombre}
            </p>
            <img src="${e.img}">
            <div>
                <h4> $${e.precio}
                </h4>
                <button class="boton_agregar" id=elimnar${e.id}> agregar</button>
            </div>
        </div>
    `
        contenedorPrincipal.appendChild(contenedorProducto);
    });

    let botonAgregarCarrito = document.querySelectorAll(`.boton_agregar`);
    botonAgregarCarrito.forEach((e) => e.onclick = agregarCarrito);
    if (localStorage.getItem("productoUsuario") != null) {
        carrito = JSON.parse(localStorage.getItem("productoUsuario"));
        renderisadoCarrito();
        mostrarCarro.innerHTML = `carrito${carrito.length}`;
    } else {
        localStorage.clear();
        renderisadoCarrito();
    }
    if (contenedorPrincipal.innerHTML == "") {
        contenedorPrincipal.innerHTML = `<p> Producto no encontrado</p>`;
    }
}
console.log(productos)
mostrarProducto(productos)


//muestra  el contenido en carrito
function visualizacionCarrito() {
    contenedorPrincipal.classList.toggle("ocultar");
    contenedorCarritoJs.classList.toggle("ocultar");
    if (mostrarCarro.innerText.includes("ocultar") == false) {
        mostrarCarro.innerText = "ocultar";
    } else {
        if (carrito.length != 0) {
            mostrarCarro.innerText = `carrito${carrito.length}`;
        } else {
            mostrarCarro.innerText = "carrito";
        }
    }
};

//Busqueda
let busqueda = "";
function realizarBusqueda() {
    filtrados = "";
    busqueda = inputBuscarHtml.value.toLowerCase()
    filtrados = productos.filter((el) =>
        el.categoria.toLowerCase().includes(busqueda)
        || el.nombre.toLowerCase().includes(busqueda))
    if (filtroCheck == "") {
        mostrarProducto(filtrados);
    } else {
        filtradoCheck();
    };
}


function renderisadoCarrito() {
    subTotal = []
    carrito.forEach((el) => subTotal.push(el.cantidad * el.precio));
    total = subTotal.reduce((a, el) => a + el, 0);
    carrito.forEach((el) => contenedorCarritoJs.innerHTML += `
            <div>
                <p> ${el.id}) Nombre:${el.nombre} </p>
                <button  class ="class_boton_restar" id=restar${el.id}>- </button>   
                <span> ${el.cantidad} </span>
                <button  class ="class_boton_agregar" id=sumar${el.id}> + </button>   
                <button class="botones_quitar"  id=quitar${el.id}>quitar</button>
                <span> ${el.cantidad * el.precio} </span>
            </div>
        `
    );
    if (carrito != "") {
        contenedorCarritoJs.innerHTML += `
                <div>
                    <span> Total: $${total} </span>
                    <button  id=finalizar_compra>Finalizar comprar</button>
                </div>
            `;
        let botonesSumar = document.querySelectorAll(`.class_boton_agregar`);
        let botonesRestar = document.querySelectorAll(`.class_boton_restar`);
        let botonesEliminarArticulos = document.querySelectorAll(`.botones_quitar`);

        botonesEliminarArticulos.forEach((el) => el.onclick = elminar_articulo);
        botonesRestar.forEach((el) => el.onclick = restar_cantidad);
        botonesSumar.forEach((el) => el.onclick = sumar_cantidad);
        localStorage.setItem("productoUsuario", JSON.stringify(carrito));

        let finalizadoCompra = document.getElementById("finalizar_compra");
        finalizadoCompra.onclick = envio_info
    } else {
        contenedorCarritoJs.innerHTML = `
                    <div>
                        <span>No tiene articulos en su carrito </span>
                    </div>
                `;
    }
};

//funcion para ver si checkbox esta on

function filtradoCheck() {
    filtroCheck = [];
    for (const checkCategoria of checkCategorias) {
        if (checkCategoria.checked) {
            filtroCheck.push(checkCategoria.id);
        };
    };
    if (busqueda == "") {
        filtrados = productos.filter((el) => filtroCheck.includes(cambioEspacios(el.categoria)));
        if (filtroCheck == "") {
            mostrarProducto(productos);
        } else {
            mostrarProducto(filtrados);
        };
    }
};


function extractorNumero(cadena) {
    let idObtenido = "";
    for (i = 0; i < cadena.length; i++) {
        if (isNaN(cadena[i]) == false) {
            idObtenido = idObtenido + cadena[i]
        };
    };
    return idObtenido;
};


function cambioEspacios(cadena) {
    let resultado = "";
    for (i = 0; i < cadena.length; i++) {
        if (cadena[i] == " ") {
            resultado += "_";
        } else {
            resultado += cadena[i];
        }
    }
    return resultado;
}


function agregarCarrito(e) {
    contenedorCarritoJs.innerText = "";
    let id_extraido = Number(extractorNumero(e.target.id));
    if (carrito.find((el) => el.id == id_extraido)) {
        let indice = carrito.indexOf(carrito.find((el) => el.id == id_extraido));
        carrito[indice].cantidad++;
    } else {
        carrito.push(productos.find((el) => el.id == id_extraido));
        carrito[carrito.length - 1].cantidad = 1;
    }
    renderisadoCarrito();
    mostrarCarro.innerHTML = `carrito${carrito.length}`;
}

function elminar_articulo(e) {
    contenedorCarritoJs.innerText = "";
    let id_extraido = Number(extractorNumero(e.target.id));
    let a_eliminar = carrito.indexOf(carrito.find((el) => id_extraido == el.id));
    carrito.splice(a_eliminar, 1);
    if (carrito.length == 0) {
        localStorage.clear();
        contenedorCarritoJs.innerText = "";
    }
    renderisadoCarrito();
}

function restar_cantidad(e) {
    contenedorCarritoJs.innerText = "";
    let id_extraido = Number(extractorNumero(e.target.id));
    if (carrito.find((el) => el.id == id_extraido)) {
        let indice = carrito.indexOf(carrito.find((el) => el.id == id_extraido));
        if (carrito[indice].cantidad > 1) {
            carrito[indice].cantidad--;
        }
    }
    renderisadoCarrito();
}

function sumar_cantidad(e) {
    contenedorCarritoJs.innerText = "";
    let id_extraido = Number(extractorNumero(e.target.id));
    if (carrito.find((el) => el.id == id_extraido)) {
        let indice = carrito.indexOf(carrito.find((el) => el.id == id_extraido));
        carrito[indice].cantidad++;
    }
    renderisadoCarrito();
}


function envio_info() {
    let ventana_envio = document.createElement("div")
    ventana_envio.className = "ventana_finalizado_comprar"

    carrito.forEach((el) => ventana_envio.innerHTML += `
            <div >
                <p> ${el.id} nombre:${el.nombre} </p>
                <span> ${el.cantidad} </span>
                <span> ${el.cantidad * el.precio} </span>
            </div>
        `
    );
    ventana_envio.innerHTML = `
        <div id= envio_productos>
            ${ventana_envio.innerHTML}
            <div>
                <span> Total: $ ${total} </span>
                <button  id=boton_volver> Volver a la tienda</button>
                <button  id=boton_confirmar> Confirmar compra</button>
            </div>
        </div>
    `;
    cuerpo.appendChild(ventana_envio);

    let boton_confirmar = document.getElementById("boton_confirmar")
    boton_confirmar.onclick = realizar_comprar

    let boton_volver = document.getElementById("boton_volver")
    boton_volver.onclick = volver_tienda

    function realizar_comprar() {
        ventana_envio.innerHTML = `
        <div id=envio_productos>
            <p>
                    Gracias por comprar en rage!
                </p>
                <button  id=boton_aceptar>aceptar</button>
            </div>   
        `
        localStorage.clear();
        contenedorCarritoJs.innerText = "";
        carrito = []
        visualizacionCarrito()
        let boton_aceptar = document.getElementById("boton_aceptar");
        boton_aceptar.onclick = cerra_ventana;
    }

    function volver_tienda() {
        ventana_envio.innerHTML = ""
        ventana_envio.classList.remove("ventana_finalizado_comprar")
    }

    function cerra_ventana() {
        ventana_envio.innerHTML = ""
        ventana_envio.classList.remove("ventana_finalizado_comprar")
        contenedorCarritoJs.innerHTML = `
        <div >
            <span> No tiene articulos en su carrito </span>
        </div>
    `;
    }
}