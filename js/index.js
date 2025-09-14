// --- abrir/cerrar modal
const modal = document.querySelector("#modal");
const btnAbrir = document.querySelector("#btn-abrir-form");
const btnCerrar = document.querySelector("#btn-cerrar-form");

btnAbrir.onclick = () => modal.style.display = "flex";
btnCerrar.onclick = () => modal.style.display = "none";

//crear la structura de datos
const db = new Dexie("AgendaApp");
db.version(1).stores({
    contactos: '++id,nombre,telefono,correo'
});

const form = document.querySelector("#new-contacto-form");
const nombreInput = document.querySelector("#nombre");
const telefonoInput = document.querySelector("#telefono");
const correoInput = document.querySelector("#correo");
const lista = document.querySelector("#contactos tbody");
const searchInput = document.querySelector("#search");

//añadir contactos
form.onsubmit = async (e) => {
    e.preventDefault();
    const nombre = nombreInput.value.trim();
    const telefono = telefonoInput.value.trim();
    const correo = correoInput.value.trim();

    if (!nombre || !telefono || !correo) return;
    
    await db.contactos.add({ nombre, telefono, correo });
    await getContactos();
    form.reset();
    modal.style.display = "none";
};

//mostrar contactos
const getContactos = async () => {
    const allContactos = await db.contactos.reverse().toArray();
    const filtro = searchInput.value.toLowerCase();

    const filtrados = allContactos.filter(contacto =>
        contacto.nombre.toLowerCase().includes(filtro) ||
        contacto.telefono.includes(filtro) ||
        contacto.correo.toLowerCase().includes(filtro)
    );

    lista.innerHTML = filtrados.map(
        (contacto) => `
            <tr>
                <td>${contacto.nombre}</td>
                <td>${contacto.telefono}</td>
                <td>${contacto.correo}</td>
                <td><button onclick="deleteContacto(event, ${contacto.id})">X</button></td>
            </tr>
        `
    ).join("");
};
window.onload = getContactos;
searchInput.oninput = getContactos;

//eliminar contactos
const deleteContacto = async (event, id) => {
    await db.contactos.delete(id);
    await getContactos();
};