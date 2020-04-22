var uploadItemsPage = {
    template: '' +
        '<div class="page" data-page="FormPage">' +
            '<div class="navbar">' +
                '<div class="navbar-inner">' +
                    '<div class="left">' +
                        '<a href="#" data-panel="left" class="link panel-open panel-index">' +
                            '<i class="ms-Icon ms-Icon--GlobalNavButton"></i>' +
                            '<span class="ios-only"></span>' +
                        '</a>' +
                        '<a href="#" class="link back">' +
                            '<i class="ms-Icon ms-Icon--Back"></i>' +
                            '<span class="ios-only">Volver</span>' +
                        '</a>' +
                    '</div>' +
                    '<div class="title">{{#if $route.query.listItemCode}}{{$route.query.listItemCode}}{{else}}{{title}}{{/if}}</div>' +
                    '<div class="right">' +
                        '<a href="#" class="link update ms-fadeIn100 hide">' +
                            '<i class="ms-Icon ms-Icon--Save"></i>' +
                            '<span class="ios-only">Actualizar</span>' +
                        '</a>' +
                        '<a href="#" class="link generate-PDF ms-fadeIn100 hide">' +
                            '<i class="ms-Icon ms-Icon--PDF"></i>' +
                            '<span class="ios-only">Generar PDF</span>' +
                        '</a>' +
                        '<a href="#" class="link doc-approve ms-fadeIn100 hide">' +
                            '<i class="ms-Icon ms-Icon--DocumentApproval"></i>' +
                            '<span class="ios-only">Aprobar</span>' +
                        '</a>' +
                        '<a href="#" class="link doc-reject ms-fadeIn100 hide">' +
                            '<i class="ms-Icon ms-Icon--PageRemove"></i>' +
                            '<span class="ios-only">Rechazar</span>' +
                        '</a>' +
                        '<a href="#" class="link clear ms-fadeIn100 hide">' +
                            '<i class="ms-Icon ms-Icon--Cancel"></i>' +
                            '<span class="ios-only">Limpiar</span>' +
                        '</a>' +
                        '<a href="#" class="link send ms-fadeIn100 hide">' +
                            '<i class="ms-Icon ms-Icon--Send"></i>' +
                            '<span class="ios-only">Enviar</span>' +
                        '</a>' +
                        '<a href="#" class="link associate-proyect ms-fadeIn100 hide">' +
                            '<i class="ms-Icon ms-Icon--IDBadge"></i>' +
                            '<span class="ios-only">Asociar ticket</span>' +
                        '</a>' +
                        '<a href="#" class="link close-ticket ms-fadeIn100 hide">' +
                            '<i class="ms-Icon ms-Icon--CheckMark"></i>' +
                            '<span class="ios-only">Cerrar ticket</span>' +
                        '</a>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="page-content">' +
                '<div class="form-container"></div>' +
                '<div class="error-container" />' +
            '<div class="content-loader">' +
                '<div class="content-loader-inner">' +
                    '<div class="image-logo lazy lazy-fadein" data-background="{{loader.image}}"></div>' +
                    '<div class="loading-message">{{loader.text}}</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '',
    style:  '.form-container .ms-FormField {width: 45%; float:left} ',
    data: function () {
        var self = this;
        return {
            title: '',
            forms: {},
            tables: {},
            loader: {
                text: 'Espere un momento por favor',
                image: './assets/img/mutual.png'
            }
        };
    },
    methods: {
        _getPage: function () {
            return {};
        },

        _getContext: function () {
            return {};
        },

        // genera un código único para el formulario del tipo prefix-year-(month)uuid
        generateUUID: function (prefix) {
            function guid() {
                var date = new Date(),
                    year = date.getFullYear() - 2000,
                    month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
                return prefix ? prefix + year + month + s4() : year + month + s4();
            }

            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }

            return guid().toUpperCase();
        },

        // obtener título de la lista de inspección
        getListTitle: function () {
            return 'ExcelPlanta';
        },

        // {fn} desaparecer DOM de cargar
        removePageLoader: function () {
            var page = this._getPage(),
                $loader = page.$el.find('.content-loader');

            if (!$loader.hasClass('ms-fadeOut100'))
                page.$el.find('.content-loader').removeClass('ms-fadeIn100').addClass('ms-fadeOut100');
        },

        // {fn} hacer visible el DOM de cargar
        addPageLoader: function () {
            var page = this._getPage(),
                $loader = page.$el.find('.content-loader');

            if ($loader.hasClass('ms-fadeOut100'))
                page.$el.find('.content-loader').removeClass('ms-fadeOut100').addClass('ms-fadeIn100');
        },


        formUUID: function (prefix) {
            function guid() {
                var day = moment().format('D'),
                    month = moment().format('M'),
                    year = moment().format('YYYY');

                day = +day < 10 ? '0' + day : day;
                month = +month < 10 ? '0' + month : month;
                return prefix ? prefix + '-' + year + month + day + '-' + s4() : year + '-' + month + s4();
            }

            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            }

            return guid().toUpperCase();
        },

        // {string} formato en KB, MB, etc
        getReadableFileSizeString: function (fileSizeInBytes) {
            var i = -1;
            var byteUnits = [' KB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
            fileSizeInBytes = fileSizeInBytes || 0;
            do {
                fileSizeInBytes = fileSizeInBytes / 1024;
                i++;
            } while (fileSizeInBytes > 1024);

            return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
        },

    },
    on: {
        pageInit: function (e, page) {
            // variables
            var context = this.$options.data(),
                mths = this.$options.methods,
                listItemId = page.route.query.listItemId

            context.methods = mths;

            // definir entra de valores de página
            mths._getPage = function () {
                return page;
            };

            mths._getPageContext = function () {
                return context;
            };

            function initForm() {

                // containers
                var $container = $(page.$el),
                    $navbar = $(page.navbarEl),
                    $sendButton = $navbar.find('.link.send')
                    $clearButton = $navbar.find('.link.clear')

                // formulario de registro
                context.forms.item = new EFWForm({
                    container: $container.find('.form-container'),
                    title: 'Carga masiva de haberes',
                    editable: listItemId ? false : true,
                    // description: 'Culpa sunt deserunt adipisicing cillum ex et ex non amet nulla officia veniam ullamco proident.',
                    fields: spo.getViewFields(context.lists.Excel, 'Todos los elementos')
                });

                context.forms.errorsList = new EFWListTable({
                    container: $container.find('.error-container'),
                    title: 'Listado de errores',
                    editable: false,
                    description: '',
                    tableLayout: 'fixed',
                    fields: [{ 
                        Id: generateUUID(),
                        Title: 'Linea',
                        InternalName: 'Linea',
                        TypeAsString: 'Number'
                    },
                    { 
                        Id: generateUUID(),
                        Title: 'Mensaje de error',
                        InternalName: 'Message',
                        TypeAsString: 'Note'
                    }]
                });                

                context.forms.errorsList.hide();
                $clearButton.removeClass('hide');
                $sendButton.removeClass('hide');
                $sendButton.on('click', function (e) {
                    var dialogTitle = 'Nueva carga Masiva de items';
                    file = $container.find('.attachmentInput')[0]

                    function save() {
                        var dialog = app.dialog.progress(dialogTitle);

                        files = file.files
                        handleExcelFromInput(files, 
                            function(response){
                                //Reseteamos los errores
                                context.forms.errorsList.setValues([]);
                                //Funcion que valida si el item puede ser imputado por el trabajador
                                function validateItem(trabajador, item){
                                    //Valida si es un Haber o descuento
                                    if(item.TipoItem != 'Haber'){
                                        return {
                                            "Error": true,
                                            "Message": "El tipo de Item no es un haber"
                                        }
                                    }
            
                                    //Contrato Indefinido
                                    if(item.ContratoIndefinido){
                                        //que tipo de contrato tiene?
                                        if(trabajador.TipoContrato != 'Indefinido'){
                                            return {
                                                "Error": true,
                                                "Message": "No corresponde personal a plazo fijo."
                                            }
                                        }
                                    }

                                    //Sindicalizado
                                    if(item.Sindicalizado){
                                        //que tipo de contrato tiene?
                                        if(trabajador.Sindicato == 'NO SINDICALIZADOS'){
                                            return {
                                                "Error": true,
                                                "Message": "Personal no sindicalizado."
                                            }
                                        }
                                    }

                                    //Validacion Capex
                                    if(item.Capex){
                                        //que tipo de contrato tiene?
                                        if(!trabajador.Capex){
                                            return {
                                                "Error": true,
                                                "Message": "El item requiere que el trabajador pertenezca a convenio CAPEX."
                                            }
                                        }
                                    }
                                   
                                    //Trabajadores Excepto Art 22
                                    if(item.AplicaArt22){
                                        if(trabajador.Jornada == 'Art. 22'){
                                            return {
                                                "Error": true,
                                                "Message": "Personal cuenta con ART.22."
                                            }
                                        }
                                    }
            
                                    //Validamos las fechas especificas
                                    if(item.FechasExcepcionales != null ){
                                        context.pertenece = false;
                                        let fechas = item.FechasExcepcionales.split(',');
                                        fechas.map(function(x){
            
                                            if(context.pertenece){
                                                return;
                                            }                                
                                            let nombreMes = moment(x, 'DD/MM/YYYY').format("MMMM");
                                            nombreMes = nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1);
                                            if(context.items.Periodo[0].Mes == nombreMes){
                                                context.pertenece = true;
                                                return;
                                            }
                                        });
                                        if(!context.pertenece){
                                            return {
                                                "Error": true,
                                                "Message": "El periodo actual no permite la imputacion de este item."
                                            }
                                        }
                                    }
            
                                    if(item.Pabellon){
                                        if(trabajador.Pabellon){
                                            return {
                                                "Error": true,
                                                "Message": "El trabajador no pertenece a listado de pabellon."
                                            }
                                        }
                                    }
            
                                    //Validamos la GP y subGP correspondiente
                                    if(item.GP){
            
                                        //Valida si el campo no esta vacio.
                                        if(item.CategoriaId != null){
            
                                            //Obtengo todos los valores de las categorias y las guardo en GPS
                                            var gps = [];
                                            item.CategoriaId.results.map(function(y){
                                                gps.push(context.items.Categoria.filter(function(x){
                                                    return x.ID == y
                                                })[0]);
                                            });
            
                                            //Obtengo la categoria de la persona seleccionada y la guardo en categoria Actual
                                            var categoriaActual = context.items.Categoria.filter(function(x){
                                                return x.ID == trabajador.CategoriaId;
                                            })[0];
            
                                            context.aprobado = false;
            
                                            //Recorrimos el listado de elementos para encontrar coincidencias en la categoria.
                                            gps.map(function(x){
                                                if(context.aprobado){
                                                    return;
                                                }
                                                if(x.Categoria.trim().length > 1){
                                                    if(x.Categoria.trim() === categoriaActual.Categoria.trim()){
                                                        context.aprobado = true;
                                                    }
                                                }else if(x.Categoria.trim().length == 1){
                                                    if(categoriaActual.Categoria.charAt(0) == x.Categoria.charAt(0)){
                                                        context.aprobado = true;
                                                    }
                                                }
                                            });
                                            //Si la categoria no aparece en el listado no se considerara para agregarla al listado
                                            if(!context.aprobado){
                                                return {
                                                    "Error": true,
                                                    "Message": "La categoria del trabajador no corresponde."
                                                }
                                            }
                                        }else{
                                            console.log('El campoGP esta vacio y tiene habilitada las GP');
                                        }
            
                                    }

                                    return {"Error": false}
                                }

                                function callServiceCargaMasivaItems(body){
                                    console.log('Body', JSON.stringify(body))
                                    fetch(global.uris[global.env].items, {
                                        method: 'POST',
                                        headers: {
                                            'Accept': 'application/json',
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(body)
                                    })
                                    .then(function(response) {
                                        if (response.status >= 300) {
                                                app.dialog.create({
                                                    title: 'Error al Iniciar Proceso',
                                                    text: 'Error al iniciar proceso de Carga Masiva (Flow)',
                                                    buttons: [{
                                                        text: 'Aceptar'
                                                    }],
                                                    verticalButtons: false
                                                }).open();
                                        }
                                    });
                                }

                                function PrepareToSend(fila, trabajador, item){
                                    return {
                                        "CantidadMonto": fila.CANT_$MONTO,
                                        "Rut": trabajador.ID,
                                        "TipoContrato": trabajador.TipoContrato,
                                        "Justificacion": fila.JUSTIFICACIÓN,
                                        "Codigo": fila.COD_PAYROLL,
                                        "Item": item.ID,
                                        "Nombre": trabajador.Rut,
                                        "CentroCosto": fila.CCOSTO ? fila.CCOSTO : trabajador.CentroCostoId,
                                        "Excepcion" : fila.CCOSTO ? 'Centro de costo diferente' : ''
                                    }
                                }

                                function validateMINMAX(value, codItem){
                                    let item = context.items.ListadoItemVariable.filter(x => x.Title == codItem)[0];
                                    value = parseInt(value);
            
                                    if(item.Minino && item.Maximo){
                                        if(item.Minimo > value && item.Maximo < value){
                                            return false;
                                        }
                                    }
                                    if(item.Minimo){
                                        if(item.Minimo > value){
                                            return false;
                                        }
                                    }
                                    if(item.Maximo){
                                        if (item.Maximo < value){
                                            return false;
                                        }
                                    }
            
                                    return true;
                                }

                                function validateCC(cc, trabajador, item){
                                    if(context.items.Solicitudes.length > 0){

                                        var filtrado = context.items.Solicitudes.filter(function(x){
                                            return x.Trabajador.NombreCompleto == trabajador.NombreCompleto 
                                            && x.Item.NombreItem == item.NombreItem
                                        });

                                        if(filtrado.length > 0){
                                            console.log('filtrado', filtrado)

                                            var encontrado =filtrado.filter(function(x){
                                                return (x.Centro_x0020_de_x0020_costo.D_CC.split(' '))[0] == cc
                                            });
                                            console.log('Encontrados', encontrado)

                                            if(encontrado.length > 0){
                                                return {
                                                    "Error": false,
                                                    "value": encontrado[0].Centro_x0020_de_x0020_costoId
                                                }
                                            }else{
                                                return {
                                                    "Error": true,
                                                    "Message": "El centro de costo ingresado es incorrecto."
                                                }
                                            }
                                        }else{
                                            return {
                                                "Error": true,
                                                "Message": "No se encontraron coincidencias con el trabajador o item ingresado."
                                            }
                                        }

                                    }else{
                                        return {
                                            "Error": true,
                                            "Message": "No posee solicitudes aprobadas para el periodo."
                                        }
                                    }
                                }

                                //Obtenemos todos los datos de los item que puede acceder el coordinador
                                var ItemPorCoo = context.items.ListadoItemVariable.filter( x => 
                                    plantaAdmin.HaberesId.results.includes(x.ID)
                                );

                                //Arreglos donde quedaran los datos
                                var Errores = [];
                                var OK = [];

                                //contadores y linea actual del prosesamiento
                                var linea = 2;

                                //     --------- Inicio de proceso de filtrado----------- // 
                                response[0].map(function(fila){

                                    let jobs = context.items.Planta.filter( x => x.Title == fila.COD_PAYROLL);
                                    if(jobs.length == 0){
                                        Errores.push({
                                            "Linea": linea,
                                            "Message": `El codigo Payroll del trabajador ingresado no corresponde a su planta.`
                                        });
                                        linea++
                                        return;
                                    }

                                    let cat = ItemPorCoo.filter( x => 
                                        x.NombreItem.toLowerCase().trim() == fila.NOM_HABER.toLowerCase().trim()
                                        || x.Title.toLowerCase().trim() == fila.COD_HABER.toLowerCase().trim()
                                    )

                                    if(cat.length == 0){
                                        Errores.push({
                                            "Linea": linea,
                                            "Message": `El item ingresado contiene datos erroneos, Revise que el código y el nombre del item sean los correctos..`
                                        });
                                        linea++
                                        return;
                                    }else{
                                        if(cat.NombreItem == fila.NOM_HABER
                                            && cat.Title == fila.COD_HABER){
                                                Errores.push({
                                                    "Linea": linea,
                                                    "Message": `El item ingresado contiene datos erroneos en el nombre o codigo del haber.`
                                                });
                                        }
                                    }
                                    
                                    //Errores de Cantidad y monto
                                    if(!fila.CANT_$MONTO){
                                        Errores.push({
                                            "Linea": linea,
                                            "Message": `El ingreso de Cantidad o monto es obligatorio.`
                                        });
                                        linea++
                                        return;
                                    }else{
                                        if(!Number.isInteger(fila.CANT_$MONTO)){
                                            Errores.push({
                                                "Linea": linea,
                                                "Message": `En el campo cantidad o monto solo se permiten numeros.`
                                            });
                                            linea++
                                            return;
                                        }
                                        if(!validateMINMAX(fila.CANT_$MONTO, fila.COD_HABER)){
                                            Errores.push({
                                                "Linea": linea,
                                                "Message": `La cantidad o monto ingresado excede los limites establecidos para el item.`
                                            });
                                            linea++
                                            return;
                                        }
                                    }

                                    //Errores de justificacion
                                    if(!fila.JUSTIFICACIÓN){
                                        Errores.push({
                                            "Linea": linea,
                                            "Message": `La justificacion es obligatoria y no puede ir vacia.`
                                        });
                                        linea++
                                        return;
                                    }else{
                                        if(fila.JUSTIFICACIÓN.length <= 10){
                                            Errores.push({
                                                "Linea": linea,
                                                "Message": `La justificacion debe contener al menos 10 caracteres.`
                                            });
                                            linea++
                                            return;
                                        }
                                    }

                                    let res = validateItem(jobs[0], cat[0]);

                                    if(res.Error){
                                        Errores.push({
                                            "Linea": linea,
                                            "Message": res.Message
                                        });
                                        linea++
                                        return;
                                    }

                                    if(fila.CCOSTO){
                                        let res = validateCC(fila.CCOSTO, jobs[0], cat[0]);
                                        if(res.Error == true){
                                            Errores.push({
                                                "Linea": linea,
                                                "Message": res.Message
                                            });
                                            linea++
                                            return;
                                        }else{
                                            console.log('Valor de REs', res.value)
                                            fila.CCOSTO = res.value
                                        }
                                    }else{
                                        console.log('No aplica CC')
                                    }
                                    
                                    OK.push(PrepareToSend(fila, jobs[0], cat[0]));
                                    linea++
                                });

                                //Si hay errores se muestra Alert
                                if( Errores.length > 0){
                                    context.forms.errorsList.setValues(Errores);
                                    dialog.close();
                                    app.dialog.create({
                                        title: 'Error',
                                        text: 'Se han encontrado '+Errores.length+' errores.\n Su carga de planta no ha podido ser procesada debido a que presenta los siguientes errores en su excel',
                                        buttons: [{
                                            text: 'Ver',
                                            onClick: function () {
                                                $container.find('.card-header').addClass('hide');
                                                $container.find('.card-content thead tr th:nth-child(1)').addClass('hide');
                                                $container.find('.card-content tbody tr td.checkbox-cell').addClass('hide');
                                                context.forms.errorsList.show()
                                                return;
                                            }
                                        }],
                                        verticalButtons: false
                                    }).open();
                                }else{
                                    var body = [];
                                    body[0] = plantaAdmin.ID;
                                    body[1] = context.items.Periodo[0].ID;
                                    body[2] = plantaAdmin.Email;
                                    body[3] = OK;
                                    callServiceCargaMasivaItems(body);
                                    dialog.close();
                                    app.dialog.create({
                                        title: dialogTitle,
                                        text: 'En estos momentos se esta procesando los items. Cuando finalice el proceso sera notificado via email',
                                        buttons: [{
                                            text: 'Aceptar',
                                            onClick: function () {
                                                mainView.router.navigate('/itemVariableStream');
                                            }
                                        }],
                                        verticalButtons: false
                                    }).open();
                                
                                }

                                $container.find('.card-header').addClass('hide');
    
                            }, 
                            function (response) {
                                var responseText = JSON.parse(response.responseText);
                                console.log(responseText.error.message.value);
                                dialog.close();
                                app.dialog.create({
                                    title: 'Error al cargar el documento ' + file.files[0].name,
                                    text: responseText.error.message.value,
                                    buttons: [{
                                        text: 'Aceptar'
                                    }],
                                    verticalButtons: false
                                }).open();
                            }
                        );
                    }//Fin save()

                    switch(file.files.length) {
                        case 1:
                            let type = file.files[0].name.split('.').pop();
                            if(type == 'xlsx'){
                                app.dialog.create({
                                    title: dialogTitle,
                                    text: '¿Está seguro de cargar el archivo? '+ file.files[0].name,
                                    buttons: [{
                                        text: 'No'
                                    }, {
                                        text: 'Sí',
                                        onClick: function onClick() {
                                            save();
                                        }
                                    }],
                                    verticalButtons: false
                                }).open();
                            }else{
                                app.dialog.create({
                                    title: 'Atención',
                                    text: `Formato invalido, asegure que su archivo sea de tipo excel(.xlsx)`,
                                    buttons: [{
                                        text: 'Ok'
                                    }],
                                    verticalButtons: false
                                }).open();
                            }
                            break;
                        case 0:
                            app.dialog.create({
                                title: 'No ha adjuntado ningún documento',
                                text: 'Para realizar la carga masiva de items variables, debe adjuntar un documento Excel con la información de la los items del periodo actual',
                                buttons: [{
                                    text: 'Aceptar'
                                }],
                                verticalButtons: false
                            }).open();
                            break;
                        default:
                            app.dialog.create({
                                title: 'Se han adjuntado muchos documentos',
                                text: 'Recuerde que para hacer una actualización de planta, solo debe adjuntar un documento Excel con la información de la planta actual',
                                buttons: [{
                                    text: 'Aceptar'
                                }],
                                verticalButtons: false
                            }).open();
                    }
                });

                $clearButton.on('click', function (e){
                    context.forms.errorsList.removeAllRows();
                    context.forms.errorsList.hide();
                    context.forms.item.inputs.Attachments.resetValue();
                });

                // remover loader
                mths.removePageLoader();
            }

            function getListInformation() {
                var loaded = {};

                context.lists = {};
                context.items = {};

                var shouldInitForms = function () {
                    if (loaded.lista && loaded.Planta && loaded.Categoria && loaded.ListadoItemVariable && loaded.Solicitudes) {
                        initForm();
                    }
                };

                // Obtener información de lista
                spo.getListInfo('ExcelPlanta',
                    function (response) {
                        context.lists.Excel = response;
                        loaded.lista = true;
                        shouldInitForms();

                    },
                    function (response) {
                        var responseText = JSON.parse(response.responseText);
                        console.log(responseText.error.message.value);
                    }
                );

                // Obtengo los trabajadores asociados al coordinador
                spo.getListInfo('Planta',
                    function (response) {
                        context.items.Planta = [];
                        context.lists.Planta = response;                        

                        var query = spo.encodeUrlListQuery(context.lists.Planta, {
                            view: 'Todos los elementos',
                            odata: {
                                'filter': '(EstadoContrato ne \'Suspendido\' and CoordinadorId eq \'' + plantaAdmin.ID + '\')',
                                'top': 5000,
                            }
                        });

                        spo.getListItems(spo.getSiteUrl(), 'Planta', query,
                            function (response) {
                                context.items.Planta = response.d.results.length > 0 ? response.d.results : null;
                                loaded.Planta = true;
                                shouldInitForms();
                            },
                            function (response) {
                                var responseText = JSON.parse(response.responseText);
                                console.log(responseText.error.message.value);
                            }
                        );
                    },
                    function (response) {
                        var responseText = JSON.parse(response.responseText);
                        console.log(responseText.error.message.value);
                    }
                );

                // Obtener información de lista
                spo.getListInfo('Categoria',
                    function (response) {
                        context.items.Categoria = [];
                        context.lists.Categoria = response;
                        //loaded.listaItemVariable = true;
                        
                        // Si existe el id de algún item a obtener

                            var query = spo.encodeUrlListQuery(context.lists.Categoria, {
                                view: 'Todos los elementos',
                                odata: {
                                    'select': '*',
                                    'top': 5000
                                }
                            });

                            spo.getListItems(spo.getSiteUrl(), 'Categoria', query,
                                function (response) {
                                    context.items.Categoria = response.d.results.length > 0 ? response.d.results : null;
                                    loaded.Categoria = true;
                                    shouldInitForms();
                                },
                                function (response) {
                                    var responseText = JSON.parse(response.responseText);
                                    console.log(responseText.error.message.value);
                                }
                            );

                    },
                    function (response) {
                        var responseText = JSON.parse(response.responseText);
                        console.log(responseText.error.message.value);
                    }
                );

                 //Obtengo el periodo actual para imputar
                 spo.getListInfo('Periodo',
                 function (response) {
                     context.items.Periodo = [];
                     context.lists.Periodo = response;
                     //loaded.listaItemVariable = true;

                         var query = spo.encodeUrlListQuery(context.lists.Periodo, {
                             view: 'Todos los elementos',
                             odata: {
                                 'filter': '(Activo eq 1)',
                                 'select': '*'
                             }
                         });

                         spo.getListItems(spo.getSiteUrl(), 'Periodo', query,
                             function (response) {
                                 context.items.Periodo = response.d.results.length > 0 ? response.d.results : null;
                                 loaded.Periodo = true;
                                 spo.getListInfo('Solicitudes',
                                        function (response) {
                                            context.items.Solicitudes = [];
                                            context.lists.Solicitudes = response;
                                                var query = spo.encodeUrlListQuery(context.lists.Solicitudes, {
                                                    view: 'Todos los elementos',
                                                    odata: {
                                                        'select': '*',
                                                        'top': 5000,
                                                        'filter': '(PeriodoId eq ' + context.items.Periodo[0].ID + ' and CoordinadorId eq \'' + plantaAdmin.ID + '\' and Estado eq \'Aprobado\')'
                                                    }
                                                });

                                                spo.getListItems(spo.getSiteUrl(), 'Solicitudes', query,
                                                    function (response) {
                                                        context.items.Solicitudes = response.d.results.length > 0 ? response.d.results : null;
                                                        loaded.Solicitudes = true;
                                                        shouldInitForms();
                                                    },
                                                    function (response) {
                                                        var responseText = JSON.parse(response.responseText);
                                                        console.log(responseText.error.message.value);
                                                    }
                                                );

                                        },
                                        function (response) {
                                            var responseText = JSON.parse(response.responseText);
                                            console.log(responseText.error.message.value);
                                        }
                                    );
                             },
                             function (response) {
                                 var responseText = JSON.parse(response.responseText);
                                 console.log(responseText.error.message.value);
                             }
                         );

                 },
                 function (response) {
                     var responseText = JSON.parse(response.responseText);
                     console.log(responseText.error.message.value);
                 }
             );

                //Obtengo el listado de haberes para ser filtrados
                spo.getListInfo('ListadoItemVariable',
                    function (response) {
                        context.items.ListadoItemVariable = [];
                        context.lists.ListadoItemVariable = response;
                        //loaded.listaItemVariable = true;

                            var query = spo.encodeUrlListQuery(context.lists.ListadoItemVariable, {
                                view: 'Todos los elementos',
                                odata: {
                                    'select': '*'
                                }
                            });

                            spo.getListItems(spo.getSiteUrl(), 'ListadoItemVariable', query,
                                function (response) {
                                    context.items.ListadoItemVariable = response.d.results.length > 0 ? response.d.results : null;
                                    loaded.ListadoItemVariable = true;
                                    shouldInitForms();
                                },
                                function (response) {
                                    var responseText = JSON.parse(response.responseText);
                                    console.log(responseText.error.message.value);
                                }
                            );

                    },
                    function (response) {
                        var responseText = JSON.parse(response.responseText);
                        console.log(responseText.error.message.value);
                    }
                );

            }

            getListInformation();

        },
        pageMounted: function (e, page) {
            // console.log('pageInit', page);
        },
        pageBeforeIn: function (e, page) {
            // console.log('pageBeforeIn', page);
        },
        pageAfterIn: function (e, page) {
            // console.log('pageAfterIn', page);
        },
        pageBeforeOut: function (e, page) {
            // console.log('pageBeforeOut', page);
        },
        pageAfterOut: function (e, page) {
            // console.log('pageAfterOut', page);
        },
        pageBeforeRemove: function (e, page) {
            var data = this.$options.data();

            for (var key in data.forms) {
                data.forms[key].destroy();
            }
            for (var key in data.tables) {
                data.tables[key].destroy();
            }
        }
    }
};