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
    var tareasGuardadas = localStorage.getItem('arrayTareas2');
    arrayTareas = JSON.parse(tareasGuardadas);
    return arrayTareas;
}

function guardarTareas(arrayTareas) {
    var tareasString = JSON.stringify(arrayTareas);
    localStorage.setItem('arrayTareas2', tareasString);
}

function nuevaTarea() {
    var titulo = $('#inputTitulo').val(); 
    var descripcion = $('#inputDescripcion').val();
    if (localStorage.arrayTareas2 != undefined) {
        var arrayTareas = getTareas();
        var id = $('div.card').length + 1;
        id = id.toString();
    } else {
        var id = 1;
        id = id.toString();
    }

    agregarTarea(titulo, descripcion, id);

    mostrarTodo();
}

function agregarTarea(titulo, descripcion, id) {
    var tarea = new constructorTarea(titulo, descripcion, id);

    if (localStorage.arrayTareas2 == undefined) {
        var arrayTareas = [];
        arrayTareas.push(tarea);
    } else {
        var arrayTareas = getTareas();
        arrayTareas.push(tarea);
    }
    guardarTareas(arrayTareas);
    $('#formIngreso')[0].reset();
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
    var idSeleccionado = $(tarea).parent().next().text();
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
    if (localStorage.arrayTareas2 != undefined) {
        var arrayTareas = getTareas();
        var listaPorCompletar = $('#tareasPorCompletar');
        listaPorCompletar.text('');
        var listaCompletadas = $('#tareasCompletadas');
        listaCompletadas.text('');

        for (i = 0; i < arrayTareas.length; i++) {
            if (arrayTareas[i].completado == false) {
                listaPorCompletar.append('<div class="card text-center mb-3" data-id="' + arrayTareas[i].id + '">' + 
                                            '<div class="card-body">' + 
                                                '<button type="button" class="close" aria-label="Close" onclick="eliminarTarea(' + arrayTareas[i].id +')">' +
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
                                        '</div>');
            } else {
                listaCompletadas.append('<div class="card text-center mb-3" data-id="' + arrayTareas[i].id + '">' + 
                                            '<div class="card-body">' + 
                                                '<button type="button" class="close" aria-label="Close" onclick="eliminarTarea(' + arrayTareas[i].id +')">' +
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
                                        '</div>');
            }
        }
        
        $('#ordenarPor').show()
    } else {
        var listaPorCompletar = $('#tareasPorCompletar');
        listaPorCompletar.text('');
    }
}

function ordenarTareas() {
    var arrayTareas = getTareas();
    var criterio = $('#inputGroupSelect01').val();
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
    if (localStorage.arrayTareas2 != undefined) {
        var arrayTareas = getTareas();
        var id = $('#inputId').val();
        var indexBuscado = buscarTarea(arrayTareas, id);
        $('#inputTituloBuscado').val(arrayTareas[indexBuscado].titulo);
        $('#inputDescripcionBuscado').val(arrayTareas[indexBuscado].descripcion);

        $('#inputId').prop('disabled', true);
        $('#editarBtn').prop('disabled', false);
        $('#eliminarBtn').prop('disabled', false);
    }
}

function activarEdicion() {
    $('#inputTituloBuscado').prop('disabled', false);
    $('#inputDescripcionBuscado').prop('disabled', false);
    $('#modificarBtn').prop('disabled', false);
    $('#inputId').prop('disabled', true);
}

function modificarTarea() {
    var arrayTareas = getTareas();
    var id = $('#inputId').val();
    var indexBuscado = buscarTarea(arrayTareas, id);
    var nuevoTitulo = $('#inputTituloBuscado').val();
    var nuevaDescripcion = $('#inputDescripcionBuscado').val();

    arrayTareas[indexBuscado].titulo = nuevoTitulo;
    arrayTareas[indexBuscado].descripcion = nuevaDescripcion;

    guardarTareas(arrayTareas);
    if ($('#tareasPorCompletar').text() !== '' || $('#tareasCompletadas').text() !== '') {
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

    if ($('#tareasPorCompletar').text() !== '' || $('#tareasCompletadas').text() !== '') {
        mostrarTodo()
    }

    resetearFormBusqueda();
}

function eliminarTodo() {
    if (localStorage.arrayTareas2 != undefined) {
        localStorage.removeItem('arrayTareas2');
    }

    if ($('#tareasPorCompletar').text() !== '' || $('#tareasCompletadas').text() !== '') {
        mostrarTodo()
    }

    $('#ordenarPor').hide();
    resetearFormBusqueda();
}

function resetearFormBusqueda() {
    $('#formBusqueda')[0].reset();
    $('#inputId').prop('disabled', false);
    $('#inputTituloBuscado').prop('disabled', true);
    $('#inputDescripcionBuscado').prop('disabled', true);
    $('#editarBtn').prop('disabled', true);
    $('#modificarBtn').prop('disabled', true);
    $('#eliminarBtn').prop('disabled', true);
}