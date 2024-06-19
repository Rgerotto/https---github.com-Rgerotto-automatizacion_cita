function generateWeekdayInputs() {
    const container = document.getElementById('inputContainer');
    container.innerHTML = '';  
    const today = new Date();
    let currentDate = new Date(today);
    let inputsGenerated = 0;

    for (let i = 0; inputsGenerated < 5; i++) {
        currentDate.setDate(today.getDate() + i);
        const dayOfWeek = currentDate.getDay();

        if (dayOfWeek !== 6 && dayOfWeek !== 0) { // Exclude Saturday (6) and Sunday (0)
            const formattedDate = currentDate.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'numeric',
                day: 'numeric'
            });

            const input = document.createElement('input');
            input.type = 'button';
            input.value = formattedDate;
            input.addEventListener('click', (event) => {
                console.log("Button value:", event.target.value);
                loadAvailableHours(currentDate, formattedDate);
            });
            container.appendChild(input);
            inputsGenerated++;
        }
    }
}

function loadAvailableHours(date, formattedDate) {
  
    console.log("Selected Date in loadAvailableHours:", formattedDate); // Log the selected date
    console.log("Formatted Date:", formattedDate); // Log the formatted date
    const container = document.getElementById('hourInputsContainer');
    container.innerHTML = '';  
    //const formattedDateISO = date.toISOString().split('T')[0];

    $.ajax({
        url: '/available-hours',
        type: 'GET',
        data: { date: formattedDate },
        success: function(hours) {
            console.log("Available Hours for", formattedDate, ":", hours); // Log the available hours
            hours.forEach(hour => {
                const hourInput = document.createElement('input');
                hourInput.setAttribute("class", "hora");
                hourInput.type = 'button';
                hourInput.value = hour;
                hourInput.addEventListener('click', () => {
                    console.log("Hour button clicked:", hour, "for date:", formattedDate); // Log the hour and formatted date
                    createSubmitButton(date, hour, formattedDate);
                });
                container.appendChild(hourInput);
            });
        },
        error: function(err) {
            console.error('Error fetching available hours:', err);
        }
    });
}

function createSubmitButton(date, hour, formattedDate) {
    console.log("to check date parameter: ", date)
    console.log("Creating Submit Button for Date:", formattedDate, "and Hour:", hour); // Log the date and hour
    console.log("Formatted Date for submit:", formattedDate); // Log the formatted date for submit
    const teste = formattedDate
    const splitOne = teste.split(',')
    const testeo = splitOne[1].split('/')
// Extract day, month, and year from the parts
const day = testeo[0].trim(); // trim to remove leading/trailing whitespace
const month = testeo[1].trim().padStart(2, '0'); // padStart to ensure two digits
const year = testeo[2].trim();
    const dateDb = `${year}/${month}/${day}`;
    console.log("teste",dateDb)
    const container = document.getElementById('hourInputsContainer');
    const existingButton = container.querySelector('button[type="submit"]');
    if (existingButton) {
        existingButton.remove();
    }

    const form = document.createElement('form');
    form.action = '/reserve_cita';
    form.method = 'post';

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Reservar Cita';

    const dateInput = document.createElement('input');
    dateInput.type = 'hidden';
    dateInput.name = 'date'; // Ensure this name matches the server-side expected name
    dateInput.value = dateDb; // Use formatted date for submission

    const hourInput = document.createElement('input');
    hourInput.type = 'hidden';
    hourInput.name = 'hour'; // Ensure this name matches the server-side expected name
    hourInput.value = hour;

    form.appendChild(dateInput);
    form.appendChild(hourInput);
    form.appendChild(submitButton);
    container.appendChild(form);
}

document.addEventListener('DOMContentLoaded', generateWeekdayInputs);
setInterval(generateWeekdayInputs, 24 * 60 * 60 * 1000); // Refresh the input generation every day

/*
$(document).ready(function () {
    const dayButtonsContainer = $("#dayButtonsContainer");
    const hourButtonsContainer = $("#hourButtonsContainer");
    const hourSelectionSection = $("#hourSelectionSection");
    const submitButton = $("#submitButton");

    let selectedDate = null;
    let selectedHour = null;

    function getNextWeekdays() {
        const weekdays = [];
        const daysNeeded = 5;
        let currentDate = new Date();

        for (let i = 0; weekdays.length < daysNeeded; i++) {
            currentDate.setDate(currentDate.getDate() + 1);
            const day = currentDate.getDay();

            if (day !== 0 && day !== 6) { // Ignore Sunday (0) and Saturday (6)
                weekdays.push(new Date(currentDate)); // Clone date object
            }
        }

        return weekdays;
    }

    function formatDate(date) {
        const options = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' };
        return date.toLocaleDateString('es-ES', options);
    }

    function createDayButton(date) {
        const formattedDate = formatDate(date);
        //const dayName = date.toLocaleDateString('es-ES', { weekday: 'long' });

        // Displaying day of the week twice
        return `<button type="button" class="dayButton" data-date="${formattedDate}">${formattedDate}</button>`;
    }

    function createHourButton(hour) {
        return `<button type="button" class="hourButton" data-hour="${hour}">${hour}</button>`;
    }

    function populateDays() {
        const weekdays = getNextWeekdays();
        weekdays.forEach(day => {
            dayButtonsContainer.append(createDayButton(day));
        });
    }

    function populateHours() {
        const hours = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00'];
        hourButtonsContainer.empty(); // Clear previous hours
        hours.forEach(hour => {
            hourButtonsContainer.append(createHourButton(hour));
        });
    }

    dayButtonsContainer.on("click", ".dayButton", function () {
        selectedDate = $(this).data("date");
        console.log("Fecha seleccionada: " + selectedDate);

        // Update hidden input value
        $("#selectedDateInput").val(selectedDate);

        // Show hour selection section and populate hours
        hourSelectionSection.show();
        populateHours();
    });

    hourButtonsContainer.on("click", ".hourButton", function () {
        selectedHour = $(this).data("hour");
        console.log("Horario seleccionado: " + selectedHour);

        // Update hidden input value
        $("#selectedHourInput").val(selectedHour);

        // Enable submit button
        submitButton.prop("disabled", false);
    });

    // Submit form event
    $("#hourForm").submit(function (event) {
        event.preventDefault(); // Prevent default form submission
        // You can perform AJAX submit here or let it submit normally
        console.log("Enviando datos al servidor:", selectedDate, selectedHour);
        alert("Datos enviados al servidor!");
        // Optionally reset form or perform other actions
    });

    populateDays();
}); */