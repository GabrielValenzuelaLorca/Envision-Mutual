var itemPage = {
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
                            '<span class="ios-only">Guardar</span>' +
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
            '<div id="tituloFormularioMuestra" class="ms-font-xl ms-slideRightIn10" style="padding: 20px 20px 0 20px;">Formulario Registro Items Variables</div>' +
            '<div class="list accordion-list">' +
                "<ul>" +
                    '<li class="accordion-item datos"><a href="#" class="item-content item-link">' +
                        '<div class="item-inner">' +
                          '<div class="item-title">1.- Datos del Trabajador </div><i class="ms-Icon ms-Icon--DrillDownSolid" ></i>' +
                        '</div></a>' +
                      '<div class="accordion-item-content">' +
                        '<div class="form-persona"></div>' +
                      '</div>' +
                    '</li>' +
                    '<li class="accordion-item datos"><a href="#" class="item-content item-link">' +
                        '<div class="item-inner">' +
                          '<div class="item-title">2.- Datos Ítem Variable</div><i class="ms-Icon ms-Icon--DrillDownSolid"></i>' +
                        '</div></a>' +
                      '<div class="accordion-item-content">' +
                        '<div class="form-item"></div>' +
                      '</div>' +
                    '</li>' +
                    '<li class="accordion-item datos"><a href="#" class="item-content item-link">' +
                        '<div class="item-inner">' +
                          '<div class="item-title">3.- Excepciones</div><i class="ms-Icon ms-Icon--DrillDownSolid" ></i>' +
                        '</div></a>' +
                      '<div class="accordion-item-content">' +
                        '<div class="form-ex"></div>' +
                      '</div>' +
                    '</li>' +
                '</ul>' +
            '</div>' +
            '</div>' +
            
            '<div class="content-loader">' +
                '<div class="content-loader-inner">' +
                    '<div class="image-logo lazy lazy-fadein" data-background="{{loader.image}}"></div>' +
                    '<div class="loading-message">{{loader.text}}</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '',
    style:  '.form-container .ms-FormField {width: 45%; float:left} '+
            `@media all and (max-width: 5000px){
                .ms-Icon.ms-Icon--DrillDownSolid {
                    margin-right: 85%; font-size: 20px !important;
                }
            }
            @media all and (max-width: 1024px){
                .ms-Icon.ms-Icon--DrillDownSolid {
                    margin-right: 80%; font-size: 20px !important;
                }
            }
            @media all and (max-width: 700px){
                .ms-Icon.ms-Icon--DrillDownSolid {
                    margin-right: 0; font-size: 20px;
                }
            }
            `,
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
            return 'ItemVariable';
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

                function ValidateItem(items){
                    let per = persona[0].item;

                    var dato = items.filter(function(item){
                        return plantaAdmin.HaberesId.results.includes(item.ID);
                    });

                    var resultado = [];

                    dato.map(function(haber){
                        if(haber['TipoItem'] != 'Haber'){
                            return;
                        }

                        //Contrato Indefinido
                        if(haber['ContratoIndefinido']){
                            //que tipo de contrato tiene?
                            if(per.TipoContrato != 'Indefinido'){
                                return;
                            }
                        }
                        
                        //Validacion Capex
                        if(haber['Capex']){
                            //que tipo de contrato tiene?
                            if(!per.Capex){
                                return;
                            }
                        }
                       
                        //Trabajadores Excepto Art 22
                        if(haber['AplicaArt22']){
                            if(per.Jornada == 'Art. 22'){
                                return;
                            }
                        }

                        //Validamos las fechas especificas
                        if(haber['FechasExcepcionales'] != null ){
                            context.pertenece = false;
                            let fechas = haber['FechasExcepcionales'].split(',');
                            fechas.map(function(x){

                                if(context.pertenece){
                                    return;
                                }                                
                                let nombreMes = moment(x, 'DD/MM/YYYY').format("MMMM");
                                nombreMes = nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1);
                                if(context.items.Periodo.Mes == nombreMes){
                                    context.pertenece = true;
                                    return;
                                }
                            });
                            if(!context.pertenece){
                                return;
                            }
                        }

                        if(haber['Pabellon']){
                            if(!per.Pabellon){
                                return;
                            }
                        }

                        //Validamos la GP y subGP correspondiente
                        if(haber['GP']){

                            //Valida si el campo no esta vacio.
                            if(haber['CategoriaId'] != null){
                                //Obtengo todos los valores de las categorias y las guardo en GPS
                                var gps = [];
                                haber['CategoriaId'].map(function(y){
                                    gps.push(context.items.Categorias.filter(function(x){
                                        return x.ID == y
                                    })[0]);
                                });

                                //Obtengo la categoria de la persona seleccionada y la guardo en categoria Actual
                                var categoriaActual = context.items.Categorias.filter(function(x){
                                    return x.ID == per.CategoriaId;
                                })[0];

                                context.aprobado = false;

                                //Recorrimos el listado de elementos para encontrar coincidencias en la categoria.
                                gps.map(function(x){

                                    if(x.Categoria.includes('P')){
                                    }
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
                                    return;
                                }
                            }else{
                                console.log('El campo GP esta vacío y tiene habilitada las GP');
                            }

                            
                        }

                        resultado.push(haber);
                    });

                    console.log('Cantidad Haberes disponibles', resultado.length);
                    console.log('Cantidad Total Haberes', items.length);

                    return resultado
                }

                var persona = null;
                var current = null;
                // containers
                var $container = $(page.$el),
                    $navbar = $(page.navbarEl),
                    $sendButton = $navbar.find('.link.send'),
                    $clearButton = $navbar.find('.link.clear');

                // formulario de registro Datos persona
                context.forms.person = new EFWForm({
                    container: $container.find('.form-persona'),
                    title: '',
                    editable: false,
                    fields: spo.getViewFields(context.lists.ItemVariable, 'FormularioPersona').concat({
                        Id: generateUUID(),
                        Title: 'Categoría',
                        InternalName: 'Categoria',
                        TypeAsString: 'Text'
                    },{
                        Id: generateUUID(),
                        Title: 'Centro de costo',
                        InternalName: 'CentroCostoId',
                        TypeAsString: 'Text'
                    })
                });
                context.forms.person.inputs['Nombre'].setEditable(true);
                context.forms.person.inputs['Cargo'].hide();
                context.forms.person.inputs['CentroCostoId'].hide();

                // formulario de registro Item Variable
                context.forms.item = new EFWForm({
                    container: $container.find('.form-item'),
                    title: '',
                    editable: false,
                    // description: 'Culpa sunt deserunt adipisicing cillum ex et ex non amet nulla officia veniam ullamco proident.',
                    fields: spo.getViewFields(context.lists.ItemVariable, 'FormularioItem')
                });
                //Ocultar campos que son personalizados.
                context.forms.item.inputs['Haber_x003a_Codigo'].setRequired(true);
                context.forms.item.inputs['Haber_x003a_Codigo'].hide();
                context.forms.item.inputs['CantidadMonto'].hide();
                context.forms.item.inputs['Justificacion'].hide();

                // formulario de registro de exepciones
                let inputs = [{
                    Id: generateUUID(),
                    Title: '¿Aplica excepción de Centro de costo?',
                    InternalName: 'ExceptionCC',
                    TypeAsString: 'Boolean'
                },{
                //     Id: generateUUID(),
                //     Title: '¿Aplica excepcion de Minimos y maximos?',
                //     InternalName: 'ExceptionMM',
                //     TypeAsString: 'Boolean'
                // },{
                    Id: generateUUID(),
                    Title: 'Solicitudes aprobadas',
                    InternalName: 'CentroCosto',
                    TypeAsString: 'Choice',
                    Choices: []
                }];
                context.forms.EX = new EFWForm({
                    container: $container.find('.form-ex'),
                    title: '',
                    editable: false,
                    // description: 'Culpa sunt deserunt adipisicing cillum ex et ex non amet nulla officia veniam ullamco proident.',
                    fields: inputs
                });
                context.forms.EX.inputs['CentroCosto'].hide();                

                // Filtrar trabajadores segun asignacion del coordinador
                context.forms.person.inputs['Nombre'].params.source = function(dropdown, query, render){
                    let data = [];
                    if(context.items.Planta){
                        context.items.Planta.map(function(array){
                            data.push({
                                "key": array.ID,
                                "text": array.NombreCompleto,
                                "item": array
                            });
                        })
                    }else{
                        data.push({
                            "key": 0,
                            "text": 'No dispone de trabajadores',
                            "item": null
                        });
                    }
                    render(data);
                }                

                //Establecer Valores de persona con el nombre
                context.forms.person.inputs['Nombre'].params.onChange = function(comp, input, state, values){
                    if(current != null){
                        return;
                    }
                    current = context.forms.item.inputs['Nombre'];
                    persona = values;
                    if (values.length == 0){
                        //Restaura los valores a vacio.
                        context.forms.person.inputs['Rut'].resetValue();
                        context.forms.person.inputs['CodigoPayroll'].resetValue();
                        context.forms.person.inputs['TipoContrato'].resetValue();
                        context.forms.person.inputs['Categoria'].resetValue();
                        context.forms.item.inputs['Haber'].resetValue();
                        context.forms.item.inputs['Haber_x003a_Codigo'].resetValue();
                        context.forms.person.inputs['CentroCostoId'].resetValue();
                        context.forms.item.inputs['Haber'].setEditable(false);
                        context.forms.item.inputs['Haber_x003a_Codigo'].setEditable(false);
                        context.forms.person.inputs['Cargo'].resetValue();

                        current = null;
                        return;
                    }

                    if(values[0].key == 0){
                        return;
                    }

                    let categoria = context.items.Categorias.filter(x => x.ID == values[0].item.CategoriaId)[0];
                    
                    //Carga los datos automaticaente Al alegir el Rut
                    context.forms.person.inputs['CodigoPayroll'].setValue(values[0].item.Title);
                    context.forms.person.inputs['Rut'].setValue(values[0].item.Rut);
                    context.forms.person.inputs['TipoContrato'].setValue(values[0].item.TipoContrato);
                    context.forms.person.inputs['Categoria'].setValue(categoria ? categoria.ESC : 'El trabajador seleccionado no tiene categoría');
                    context.forms.person.inputs['Cargo'].setValue(values[0].item.d_cargo.NombreCargo)

                    //Habilitamos el formulario siguiente
                    context.forms.person.inputs['CentroCostoId'].setValue(values[0].item.CentroCostoId);
                    context.forms.item.inputs['Haber'].setEditable(true);
                    context.forms.item.inputs['Haber_x003a_Codigo'].setEditable(true);
                    current = null;
                }

                context.forms.item.inputs['Haber'].params.beforeRenderSuggestions = function (items) {
                    return ValidateItem(items);
                }

                //Establecer Valores de Item segun el nombre del haber
                context.forms.item.inputs['Haber'].params.onChange = function(comp, input, state, values){
                    if(current != null){
                        return;
                    }
                    current = context.forms.item.inputs['Haber'];
                    if (values.length == 0){
                        context.forms.item.inputs['Haber_x003a_Codigo'].resetValue();
                        context.forms.item.inputs['CantidadMonto'].hide();
                        context.forms.item.inputs['Justificacion'].hide();
                        context.forms.EX.setEditable(false)
                        current = null;
                        return;
                    }

                    context.forms.item.inputs['Haber_x003a_Codigo'].setValue([{key: values[0].item.Title, text: values[0].item.Title}])
                    context.forms.item.inputs['CantidadMonto'].setLabel(values[0].item.TipoIngreso == 'Cantidad' ? 'Cantidad' : 'Monto');
                    context.forms.item.inputs['CantidadMonto'].setEditable(true);
                    context.forms.item.inputs['Justificacion'].setEditable(true);

                    if(values[0].item.ValorDefecto != null ){
                        context.forms.item.inputs['CantidadMonto'].setValue(values[0].item.ValorDefecto);
                        context.forms.item.inputs['CantidadMonto'].setEditable(false);                        
                    }

                    context.forms.item.inputs['CantidadMonto'].show();
                    context.forms.item.inputs['Justificacion'].show();

                    context.forms.EX.setEditable(true)
                    current = null;
                }

                context.forms.item.inputs['Haber_x003a_Codigo'].params.beforeRenderSuggestions = function (items) {
                    return ValidateItem(items);
                }
                
                context.forms.item.inputs['Haber_x003a_Codigo'].params.onChange = function(comp, input, state, values){
                    if(current != null){
                        return;
                    }
                    current = context.forms.item.inputs['Haber_x003a_Codigo'];
                    if (values.length == 0){
                        context.forms.item.inputs['Haber'].resetValue();
                        context.forms.item.inputs['CantidadMonto'].hide();
                        context.forms.item.inputs['Justificacion'].hide();
                        context.forms.EX.setEditable(false)
                        current = null;
                        return;
                    }

                    context.forms.item.inputs['Haber'].setValue([{key: values[0].item.NombreItem, text: values[0].item.NombreItem}])
                    context.forms.item.inputs['CantidadMonto'].setLabel(values[0].item.TipoIngreso == 'Cantidad' ? 'Cantidad' : 'Monto');
                    context.forms.item.inputs['CantidadMonto'].setEditable(true);
                    context.forms.item.inputs['Justificacion'].setEditable(true);

                    if(values[0].item.ValorDefecto != null ){
                        context.forms.item.inputs['CantidadMonto'].setValue(values[0].item.ValorDefecto);
                        context.forms.item.inputs['CantidadMonto'].setEditable(false);                        
                    }

                    context.forms.item.inputs['CantidadMonto'].show();
                    context.forms.item.inputs['Justificacion'].show();

                    context.forms.EX.setEditable(true)
                    current = null;
                }

                //Activadores de form
                context.forms.EX.inputs['ExceptionCC'].params.onChange = function(comp, input, state, values){
                    if(values){
                        context.forms.EX.inputs['CentroCosto'].show();
                        context.forms.EX.inputs['CentroCosto'].setRequired(true);

                    }else{
                        context.forms.EX.inputs['CentroCosto'].setRequired(false);
                        context.forms.EX.inputs['CentroCosto'].hide();
                        context.forms.EX.inputs['CentroCosto'].setValue([]);
                    }
                }

                context.forms.EX.inputs['CentroCosto'].params.source = function(dropdown, query, render){
                    var dataCC = []

                    if(context.items.Solicitudes){
                        context.items.Solicitudes.map(function(x){
                            if(x.TipoSolicitud == "Centro de costo diferente" && x.Estado == "Aprobado"){
                                if(x.Item.NombreItem == context.forms.item.inputs['Haber'].values[0].text && x.Trabajador.NombreCompleto == context.forms.person.inputs['Nombre'].values[0].text){
                                    dataCC.push({
                                        "key": x.Centro_x0020_de_x0020_costoId,
                                        "text": x.Item.NombreItem+' - '+x.Trabajador.NombreCompleto+' - '+x.Centro_x0020_de_x0020_costo.D_CC,
                                        "item": x
                                    });
                                } 
                            }
                        });
                    }

                    if(dataCC.length > 0){
                        render(dataCC)
                    }else{
                        render([{
                            "key": 0,
                            "text": 'No se encontraron solicitudes para el trabajador',
                            "item": null
                        }]);
                    }
                    
                }  
                  
                $sendButton.removeClass('hide');
                $clearButton.removeClass('hide');

                $sendButton.on('click', function (e) {
                    var dialogTitle = 'Nuevo Item';

                    function save() {
                        var dialog = app.dialog.progress(dialogTitle);
                        var metadataItem = context.forms.item.getMetadata();
                        var metadataPerson = context.forms.person.getMetadata();
                        var metadataEX = context.forms.EX.getMetadata();

                        metadata = metadataPerson;
                        metadata['HaberId'] = metadataItem.HaberId;
                        metadata['CantidadMonto'] = metadataItem.CantidadMonto;
                        metadata['Justificacion'] = metadataItem.Justificacion;
                        metadata['Cargo'] = persona[0].item.d_cargo.NombreCargo;
                        metadata['CentroCostoId'] = persona[0].item.CentroCostoId;

                        if(context.forms.EX.inputs['ExceptionCC'].value){
                            metadata['CentroCostoId'] = metadataEX.CentroCosto
                            metadata.Excepcion = 'Centro de costo diferente'
                        }

                        metadata.PeriodoId = context.items.Periodo.ID;
                        metadata.CoordinadorId = plantaAdmin.ID;

                        delete metadata.Categoria;

                        spo.saveListItem(spo.getSiteUrl(), 'ItemVariable', metadata, function (response) {
                            var formularioId = response.d.Id;
                            dialog.close();


                            app.dialog.create({
                                title: dialogTitle,
                                text: 'Ítem creado con éxito',
                                buttons: [{
                                    text: 'Aceptar',
                                    onClick: function () {
                                        refresh()
                                    }
                                }],
                                verticalButtons: false
                            }).open();

                        }, function (response) {
                            var responseText = JSON.parse(response.responseText);

                            dialog.close();
                            app.dialog.create({
                                title: 'Error al guardar en lista ' + mths.getListTitle(),
                                text: responseText.error.message.value,
                                buttons: [{
                                    text: 'Aceptar'
                                }],
                                verticalButtons: false
                            }).open();
                        });
                    }

                    function validateMINMAX(value){
                        let item = context.forms.item.inputs.Haber.values[0].item
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
                    
                    context.forms.person.checkFieldsRequired();
                    context.forms.item.checkFieldsRequired();
                    context.forms.EX.checkFieldsRequired();
                    
                    var validatePerson =  context.forms.person.getValidation();
                    var validateItem =  context.forms.item.getValidation();
                    var validateEX =  context.forms.EX.getValidation();

                    if(context.forms.item.inputs['Justificacion'].value.length< 10){
                        app.dialog.create({
                            title: 'Datos mal ingresados',
                            text: 'La justificación debe tener un largo de al menos 10 caracteres.',
                            buttons: [{
                                text: 'Aceptar'
                            }],
                            verticalButtons: false
                        }).open();
                    }else if(!validateMINMAX(context.forms.item.inputs['CantidadMonto'].value)){
                        app.dialog.create({
                            title: 'Datos mal ingresados',
                            text: 'El valor ingresado como cantidad o monto infringe el mínimo o máximo permitido.',
                            buttons: [{
                                text: 'Aceptar'
                            }],
                            verticalButtons: false
                        }).open();
                    }else if (validateItem && validatePerson && validateEX) {
                            app.dialog.create({
                                title: dialogTitle,
                                text: 'Se creará una nuevo ítem.',
                                buttons: [{
                                    text: 'Cancelar'
                                }, {
                                    text: 'Aceptar',
                                    onClick: function onClick() {
                                        save();
                                    }
                                }],
                                verticalButtons: false
                            }).open();
                    } else {
                        app.dialog.create({
                            title: 'Datos insuficientes',
                            text: 'Para crear un nuevo ítem debe completar todos los campos obligatorios.',
                            buttons: [{
                                text: 'Aceptar'
                            }],
                            verticalButtons: false
                        }).open();
                    }

                });

                $clearButton.on('click', function (e){
                    context.forms.item.setValues([]);
                    context.forms.person.setValues([]);
                    context.forms.EX.setValues([]);
                });

                // remover loader
                mths.removePageLoader();
            }

            function getListInformation() {
                var loaded = {};

                context.lists = {};
                context.items = {};

                var shouldInitForms = function () {
                    if (loaded.Solicitudes && loaded.ItemVariable && loaded.Categorias && loaded.Trabajadores && loaded.Periodo && loaded.CentroCosto) {
                        initForm();
                    }
                };             

                // Obtener información de lista
                spo.getListInfo('ItemVariable',
                    function (response) {
                        context.lists.ItemVariable = response;
                        loaded.ItemVariable = true;
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
                                loaded.Trabajadores = true;
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

                // Obtengo el listado de categorias completa
                spo.getListInfo('Categoria',
                    function (response) {
                        context.items.Categorias = [];
                        context.lists.Categorias = response;
                        //loaded.listaItemVariable = true;

                            var query = spo.encodeUrlListQuery(context.lists.Categorias, {
                                view: 'Todos los elementos',
                                odata: {
                                    'select': '*',
                                    'top' : 5000
                                }
                            });

                            spo.getListItems(spo.getSiteUrl(), 'Categoria', query,
                                function (response) {
                                    context.items.Categorias = response.d.results.length > 0 ? response.d.results : null;
                                    loaded.Categorias = true;
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
                                    context.items.Periodo = response.d.results.length > 0 ? response.d.results[0] : null;
                                    loaded.Periodo = true;
                                    //Obtengo las solicitudes del periodo actual
                                    if(context.items.Periodo){
                                        spo.getListInfo('Solicitudes',
                                            function (response) {
                                                context.items.Solicitudes = [];
                                                context.lists.Solicitudes = response;
                                                    var query = spo.encodeUrlListQuery(context.lists.Solicitudes, {
                                                        view: 'Todos los elementos',
                                                        odata: {
                                                            'select': '*',
                                                            'top': 5000,
                                                            'filter': '(PeriodoId eq ' + context.items.Periodo.ID + ' and CoordinadorId eq \'' + plantaAdmin.ID + '\')'
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
                                    }else{
                                        loaded.Solicitudes = true;
                                        shouldInitForms();
                                    }
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
                spo.getListInfo('CentroCosto',
                    function (response) {
                        context.items.Periodo = [];
                        context.lists.Periodo = response;
                        //loaded.listaItemVariable = true;

                            var query = spo.encodeUrlListQuery(context.lists.Periodo, {
                                view: 'Todos los elementos',
                                odata: {
                                    'select': '*',
                                    'filter': 'activo eq 1',
                                    'top': 5000
                                }
                            });

                            spo.getListItems(spo.getSiteUrl(), 'CentroCosto', query,
                                function (response) {
                                    context.items.CentroCosto = response.d.results.length > 0 ? response.d.results : null;
                                    loaded.CentroCosto = true;
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