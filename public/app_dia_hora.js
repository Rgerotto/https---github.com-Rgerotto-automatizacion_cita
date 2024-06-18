
// Función para generar los inputs para días de la semana escluyendo sabados y domingos
function generateWeekdayInputs() {
    const container = document.getElementById('inputContainer');
    container.innerHTML = '';  // Limpiar cualquier contenido previo
    console.log('limpio');
    // Recupero la fecha de hoy y la guardo en una variable
    const today = new Date();
    let currentDate = new Date(today);
    // Variable para inicializar el contador de inputs generados
    let inputsGenerated = 0;

    //Establecer la condición que mientras no se hayan generado 5 días, generar un input para cada día de la seemana
    while (inputsGenerated < 5) {
        // Incrementar la fecha en un día hasta llegar a los 5 días
        currentDate.setDate(currentDate.getDate() + 1);
        const dayOfWeek = currentDate.getDay();

        // Ignorar sábados que en el metodo date es la posición seis de una array de dias (6) y domingos que es el cero (0)
        if (dayOfWeek !== 6 && dayOfWeek !== 0) {
            // Crear un input para cada día de la semana
            const input = document.createElement('input');
            input.type = 'button';
            // Establecer el formato de visualización de la fecha
            input.value = currentDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' });
            // Asignar el evento click a cada input para generar los inputs de horas disponibles para cita cada día
            input.addEventListener('click', () => generateHourInputs(currentDate));
            container.appendChild(input);
            //Incrementar el contador
            inputsGenerated++;
        }
    }
}

function generateHourInputs(date) {
    const container = document.getElementById('hourInputsContainer');
    container.innerHTML = '';  // Limpiar cualquier contenido previo
    // Crear un array que guarde las horas disponibles para tomar citas
    const hours = [
        '09:00',
        '10:00',
        '11:00',
        '12:00',
        '13:00',
        '14:00'
    ];

    //Crear un input por cada hora en el array
    hours.forEach(hour => {
        const hourInput = document.createElement('input');
        hourInput.setAttribute("class", "hora")
        hourInput.type = 'button';
        hourInput.value = hour;
        container.appendChild(hourInput);
    });
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', generateWeekdayInputs);

// Actualizar los inputs de fecha cada 24 horas
setInterval(generateWeekdayInputs, 24 * 60 * 60 * 1000);