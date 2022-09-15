const resultado = document.querySelector("#resultado");
const formulario = document.querySelector("#formulario");
const paginacionDiv = document.querySelector("#paginacion");

const registroPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

document.addEventListener("DOMContentLoaded", () => {
  formulario.addEventListener("submit", validarFomulario);
});

function validarFomulario(e) {
  e.preventDefault();
  const inputTermino = document.querySelector("#termino").value;

  if (inputTermino === "") {
    mostrarMensaje("Debe llenar el campo de busqueda");
    return;
  }

  busquedaImagenes();
}

function mostrarMensaje(mensaje) {
  const existeAlerta = document.querySelector(".error");
  if (!existeAlerta) {
    const alerta = document.createElement("p");
    alerta.classList.add(
      "bg-red-100",
      "border-red-400",
      "text-red-700",
      "px-4",
      "py-3",
      "rounded",
      "max-w-lg",
      "mx-auto",
      "mt-6",
      "text-center",
      "error"
    );
    alerta.textContent = mensaje;

    setTimeout(() => {
      alerta.remove();
    }, 2000);
    formulario.appendChild(alerta);
  }
}

function busquedaImagenes() {
  const termino = document.querySelector("#termino").value;

  const key = "29886526-b0eecdd265798c69f67a0612c";
  const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registroPorPagina}&page=${paginaActual}`;

  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((resultado) => {
      totalPaginas = calcularPaginas(resultado.totalHits);
      // console.log(totalPaginas);
      mostrarImagenes(resultado.hits);
    });
}

//Generador que va a registrar la cantidad de elementos de acuerdo a las paginas
function* crearPaginador(total) {
  // console.log(total);
  for (let i = 1; i <= total; i++) {
    yield i;
  }
}

function calcularPaginas(total) {
  return parseInt(Math.ceil(total / registroPorPagina));
}

function mostrarImagenes(imagenes) {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }

  //Iterar sobre el arreglo de imagenes y construir el HTML
  imagenes.forEach((imagen) => {
    const { previewURL, likes, views, largeImageURL } = imagen;

    resultado.innerHTML += `
    <div class=" py-1 px-1 pb-0 w-1/2 md:w-1/3 lg:w-1/4 mb-4">
      <div class="bg-white">
        <img class="w-full py-1 px-1 pb-0 " src="${previewURL}">

        <div class="py-0 px-1">
          <p class="font-bold text-white bg-gray-900 pl-1">${likes} <span class="font-light text-white "> Me Gusta</span></p>
          <p class="font-bold text-white bg-gray-900 pl-1">${views} <span class="font-light text-white "> Veces Vista</span></p>
      
          <a class="block w-full bg-white-800 uppercase font-serif text-center rounded  p-1 text-black"
             href="${largeImageURL}" target="_blank" rel="noopener noreferrer">
            Ver Imagen
          </a>
        </div>
      </div>
    </div>
      `;
  });
  // Lmpiar el paginador previo
  while (paginacionDiv.firstChild) {
    paginacionDiv.removeChild(paginacionDiv.firstChild);
  }
  imprimirPaginador();
}

function imprimirPaginador() {
  iterador = crearPaginador(totalPaginas);

  while (true) {
    const { value, done } = iterador.next();
    if (done) return;

    //Caso contrario, genera un boton por cada elemento en el generador\
    const boton = document.createElement("a");
    boton.href = "#";
    boton.dataset.pagina = value;
    boton.textContent = value;
    boton.classList.add(
      "siguiente",
      "bg-yellow-400",
      "px-4",
      "py-1",
      "mr-2",
      "font-bold",
      "mb-4",
      "rounded"
    );
    boton.onclick = () => {
      paginaActual = value;
      busquedaImagenes();
    };
    paginacionDiv.appendChild(boton);
  }
}
