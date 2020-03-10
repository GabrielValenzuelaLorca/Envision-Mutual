//Examples for use components

//Agregar input a formularios

//Se obtiene el array de datos para la obtencion de los datos
var inputs = spo.getViewFields(context.lists.ListadoItemVariable, 'Todos los elementos')

//Se genera el nuevo elemento y se agrega al arreglo de items
inputs.push({
    Id: generateUUID(),
    Title: 'Campo fecha',
    InternalName: 'CampoFecha',
    TypeAsString: 'DateTime'
});

// Se renderiza el form de datos con el array.
context.forms.item = new EFWForm({
    container: $container.find('.form-container'),
    title: 'Listado Items Variables',
    editable: true,
    fields: inputs
});



//Agregar input dinamicamente a forms

//Genera el form con un array de los elementos indicados en fields
context.forms.dateForms = new EFWForms({
    container: $container.find('.date-forms-container'),
    title: 'Listado Fechas',
    editable: true,
    // description: 'Culpa sunt deserunt adipisicing cillum ex et ex non amet nulla officia veniam ullamco proident.',
    fields: [{ 
        Id: generateUUID(),
        Title: 'Campo fecha',
        InternalName: 'CampoFecha',
        TypeAsString: 'DateTime'
    }]
});

//Generar una tabla para inputs dinamicamente, como el de arriba pero mas ordenado
context.forms.dateForms2 = new EFWListTable({
    container: $container.find('.date-forms2-container'),
    title: 'Listado Fechas',
    editable: true,
    // description: 'Culpa sunt deserunt adipisicing cillum ex et ex non amet nulla officia veniam ullamco proident.',
    fields: [{ 
        Id: generateUUID(),
        Title: 'Campo fecha',
        InternalName: 'CampoFecha',
        TypeAsString: 'DateTime'
    }]
});
