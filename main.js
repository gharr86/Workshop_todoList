/*
    Crear el modulo ToDoList
    El modulo debera tener los metodos necesarios para Agregar, Editar, Mostrar Todos, Buscar y Eliminar.
    Una tarea contiene las siguientes propiedades: id, titulo, descripcion y completado
    Se tiene que poder editar titulo y descripcion de una tarea
    Cambiar a estado completado y descompletado(?) una tarea
    Eliminar una tarea o todas las tareas
    Ordernar por A-Z y Z-A las tareas ya sea por titulo como por ID
    Las tareas Deberan quedar persistidas mediante localstorage y poder mostrarse en caso de recargar el browser
*/

function constructorTarea(_titulo, _descripcion, _id) {
    this.titulo = _titulo;
    this.descripcion = _descripcion;
    this.id = _id;
    this.completado = false;
}

function getTareas() {
    var tareasGuardadas = localStorage.getItem('arrayTareas');
    arrayTareas = JSON.parse(tareasGuardadas);
    return arrayTareas;
}

function guardarTareas(arrayTareas) {
    var tareasString = JSON.stringify(arrayTareas);
    localStorage.setItem('arrayTareas', tareasString);
}

function nuevaTarea() {
    var titulo = document.getElementById('inputTitulo').value;
    var descripcion = document.getElementById('inputDescripcion').value;
    if (localStorage.arrayTareas != undefined) {
        var arrayTareas = getTareas();
        var id = arrayTareas.length + 1;
        id = id.toString();
    } else {
        var id = 1;
        id = id.toString();
    }

    agregarTarea(titulo, descripcion, id);
}

function agregarTarea(titulo, descripcion, id) {
    var tarea = new constructorTarea(titulo, descripcion, id);

    if (localStorage.arrayTareas == undefined) {
        var arrayTareas = [];
        arrayTareas.push(tarea);
    } else {
        var arrayTareas = getTareas();
        arrayTareas.push(tarea);
    }
    guardarTareas(arrayTareas);
    document.getElementById('formIngreso').reset();
}

function buscarTarea(array, id) {
    for (i = 0; i < array.length; i++) {
        if (id == array[i].id) {
            var index = i;
        }
    }
    return index;
}

function toggleCompletar(tarea) {
    var arrayTareas = getTareas();
    var idSeleccionado = tarea.parentElement.nextSibling.innerText;
    var indexSeleccionado = buscarTarea(arrayTareas, idSeleccionado);
    if (arrayTareas[indexSeleccionado].completado == false) {
        arrayTareas[indexSeleccionado].completado = true;
    } else {
        arrayTareas[indexSeleccionado].completado = false;
    }
    guardarTareas(arrayTareas);
    mostrarTodo();
}

function mostrarTodo() {
    if (localStorage.arrayTareas != undefined) {
        var arrayTareas = getTareas();
        var listaPorCompletar = document.getElementById('tareasPorCompletar');
        listaPorCompletar.innerHTML = '';
        var listaCompletadas = document.getElementById('tareasCompletadas');
        listaCompletadas.innerHTML = '';

        for (i = 0; i < arrayTareas.length; i++) {
            if (arrayTareas[i].completado == false) {
                listaPorCompletar.innerHTML += '<div class="card text-center mb-3" data-id="' + arrayTareas[i].id + '">' +
                    '<div class="card-body">' +
                    '<button type="button" class="close" aria-label="Close" onclick="eliminarTarea(' + arrayTareas[i].id + ')">' +
                    '<span aria-hidden="true">&times;</span>' +
                    '</button>' +
                    '<h5 class="card-title">' +
                    arrayTareas[i].titulo +
                    '</h5>' +
                    '<p class="card-text">' +
                    arrayTareas[i].descripcion +
                    '</p>' +
                    '<button type="button" class="btn btn-outline-warning" onclick="toggleCompletar(this)">Completar</button>' +
                    '</div>' +
                    '<div class="card-footer text-muted">' +
                    arrayTareas[i].id +
                    '</div>' +
                    '</div>';
            } else {
                listaCompletadas.innerHTML += '<div class="card text-center mb-3" data-id="' + arrayTareas[i].id + '">' +
                    '<div class="card-body">' +
                    '<button type="button" class="close" aria-label="Close" onclick="eliminarTarea(' + arrayTareas[i].id + ')">' +
                    '<span aria-hidden="true">&times;</span>' +
                    '</button>' +
                    '<h5 class="card-title">' +
                    arrayTareas[i].titulo +
                    '</h5>' +
                    '<p class="card-text">' +
                    arrayTareas[i].descripcion +
                    '</p>' +
                    '<button type="button" class="btn btn-success" onclick="toggleCompletar(this)">Completado</button>' +
                    '</div>' +
                    '<div class="card-footer text-muted">' +
                    arrayTareas[i].id +
                    '</div>' +
                    '</div>';
            }
        }

        document.getElementById('ordenarPor').style.display = 'block';
    } else {        
        var listaPorCompletar = document.getElementById('tareasPorCompletar');
        listaPorCompletar.innerHTML = '';
    }
}

function ordenarTareas() {
    var arrayTareas = getTareas();
    var criterio = document.getElementById('inputGroupSelect01').value;

    if (criterio !== '') {
        if (criterio == '1' || criterio == '2') {
            arrayTareas.sort(function (a, b) {
                var x = a.titulo.toLowerCase();
                var y = b.titulo.toLowerCase();
                if (x < y) { return -1; }
                if (x > y) { return 1; }
                return 0;
            });
        } else if (criterio == '3') {
            arrayTareas.sort(function (a, b) {
                var x = a.id.toLowerCase();
                var y = b.id.toLowerCase();
                if (x < y) { return -1; }
                if (x > y) { return 1; }
                return 0;
            });
        }
        if (criterio == '2') {
            arrayTareas.reverse();
        }

        guardarTareas(arrayTareas);
        mostrarTodo();
    }
}

//Edicion--------------------------------------------------------

function mostrarTarea() {
    if (localStorage.arrayTareas != undefined) {
        var arrayTareas = getTareas();
        var id = document.getElementById('inputId').value;
        var indexBuscado = buscarTarea(arrayTareas, id);
        document.getElementById('inputTituloBuscado').value = arrayTareas[indexBuscado].titulo;
        document.getElementById('inputDescripcionBuscado').value = arrayTareas[indexBuscado].descripcion;

        document.getElementById('inputId').disabled = true;
        document.getElementById('editarBtn').disabled = false;
    }
}

function activarEdicion() {
    document.getElementById('inputTituloBuscado').disabled = false;
    document.getElementById('inputDescripcionBuscado').disabled = false;
    document.getElementById('modificarBtn').disabled = false;
    document.getElementById('inputId').disabled = true;
}

function modificarTarea() {
    var arrayTareas = getTareas();
    var id = document.getElementById('inputId').value;
    var indexBuscado = buscarTarea(arrayTareas, id);
    var nuevoTitulo = document.getElementById('inputTituloBuscado').value;
    var nuevaDescripcion = document.getElementById('inputDescripcionBuscado').value;

    arrayTareas[indexBuscado].titulo = nuevoTitulo;
    arrayTareas[indexBuscado].descripcion = nuevaDescripcion;

    guardarTareas(arrayTareas);
    if (document.getElementById('tareasPorCompletar').innerHTML !== '' || document.getElementById('tareasCompletadas').innerHTML !== '') {
        mostrarTodo()
    }

    resetearFormBusqueda();
}

function eliminarTarea(id) {
    var arrayTareas = getTareas();
    var indexBuscado = buscarTarea(arrayTareas, id);
    arrayTareas.splice(indexBuscado, 1);
    if (arrayTareas.length == 0) {
        localStorage.removeItem('arrayTareas');
    } else {
        guardarTareas(arrayTareas);
    }

    if (document.getElementById('tareasPorCompletar').innerHTML !== '' || document.getElementById('tareasCompletadas').innerHTML !== '') {
        mostrarTodo()
    }

    resetearFormBusqueda();
}

function eliminarTodo() {
    if (localStorage.arrayTareas != undefined) {
        localStorage.removeItem('arrayTareas');
    }

    if (document.getElementById('tareasPorCompletar').innerHTML !== '' || document.getElementById('tareasCompletadas').innerHTML !== '') {
        mostrarTodo()
    }
    
    resetearFormBusqueda();
}

function resetearFormBusqueda() {
    document.getElementById('formBusqueda').reset();
    document.getElementById('inputId').disabled = false;
    document.getElementById('inputTituloBuscado').disabled = true;
    document.getElementById('inputDescripcionBuscado').disabled = true;
    document.getElementById('editarBtn').disabled = true;
    document.getElementById('modificarBtn').disabled = true;
}