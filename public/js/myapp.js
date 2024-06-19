/* Menú hamburguesa */
const nav = document.querySelector('#nav');
const abrir = document.querySelector('#abrir');
const cerrar = document.querySelector('#cerrar');

abrir.addEventListener('click', () => {
    nav.classList.add('visible');
});

cerrar.addEventListener('click', () => {
    nav.classList.remove('visible');
});


//Configuración del datatable
/* const datable = new simpleDatatables.DataTable('#tabla', {
    searcheble: true,
    sortable: true,
    filterable: true,
    pageable: true,
    pageSize: 5,
    fixedHeight: true,
}) */