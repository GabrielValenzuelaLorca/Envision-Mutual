var solicitudesPage = {
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
                        '<a href="#" class="link justify ms-fadeIn100 hide">' +
                            '<i class="ms-Icon ms-Icon--Send"></i>' +
                            '<span class="ios-only">Responder justificación</span>' +
                        '</a>' +
                        '<a href="#" class="link requestJustify ms-fadeIn100 hide">' +
                            '<i class="ms-Icon ms-Icon--CannedChat"></i>' +
                            '<span class="ios-only">Solicitar justificación</span>' +
                        '</a>' +
                        '<a href="#" class="link doc-approve ms-fadeIn100 hide">' +
                            '<i class="ms-Icon ms-Icon--Accept"></i>' +
                            '<span class="ios-only">Aprobar</span>' +
                        '</a>' +
                        '<a href="#" class="link doc-disapprove ms-fadeIn100 hide">' +
                            '<i class="ms-Icon ms-Icon--Cancel"></i>' +
                            '<span class="ios-only">Desaprobar</span>' +
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
                            '<i class="ms-Icon ms-Icon--Accept"></i>' +
                            '<span class="ios-only">Crear solicitud</span>' +
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
                '<div class="form1"></div>' +
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
            return 'Solicitudes';
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

                // containers
                var $container = $(page.$el),
                    $navbar = $(page.navbarEl),
                    $createButton = $navbar.find('.send'),
                    $aproveButton = $navbar.find('.doc-approve'),
                    $disapproveButton = $navbar.find('.doc-disapprove'),
                    $reSendButton = $navbar.find('.justify');
                    $justifyButton = $navbar.find('.requestJustify');

                let inputs = spo.getViewFields(context.lists.Solicitudes, 'Form centro de costo');

                inputs.push({
                    Id: generateUUID(),
                    Title: 'Seleccione un tipo de solicitud',
                    InternalName: 'Argumento',
                    TypeAsString: 'Note'
                });

                context.forms.solicitud = new EFWForm({
                    container: $container.find('.form1'),
                    title: 'Solicitud de centro de costo',
                    editable: listItemId ? false : true,
                    // description: 'Culpa sunt deserunt adipisicing cillum ex et ex non amet nulla officia veniam ullamco proident.',
                    fields: inputs,
                });

                context.forms.solicitud.inputs['TipoSolicitud'].setValue([{ key:'Centro de costo diferente', text: 'Centro de costo diferente'}])

                // context.forms.solicitud.inputs['Item'].params.source = function(dropdown, query, render){
                //     let data = [];
                //     if(plantaAdmin.HaberesId.results){
                //         plantaAdmin.HaberesId.results.map(function(array){
                //             let value = context.items.ListadoItemVariable.filter(x => x.ID == array)[0];
                //             data.push({
                //                 "key": value.ID,
                //                 "text": value.NombreItem,
                //                 "item": value
                //             });
                //         })
                //     }else{
                //         data.push({
                //             "key": 0,
                //             "text": 'No dispone de items para imputar',
                //             "item": null
                //         });
                //     }
                //     render(data);   
                // }

                context.forms.solicitud.inputs['Item'].params.beforeRenderSuggestions = function (items) {
                    return ValidateItem(items);
                }

                // Filtrar trabajadores segun asignacion del coordinador
                context.forms.solicitud.inputs['Trabajador'].params.source = function(dropdown, query, render){
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

                // Filtrar trabajadores segun asignacion del coordinador
                context.forms.solicitud.inputs['Trabajador'].params.onChange = function(comp, input, state, values){
                    persona = values
                }

                if(listItemId){
                    context.forms.solicitud.setValues(context.items.Solicitudes);
                    context.forms.solicitud.inputs['Argumento'].hide();
                    context.forms.solicitud.inputs['Centro_x0020_de_x0020_costo'].hide();

                    context.forms.solicitud.inputs['Historial'].setEditable(true);
                    context.forms.solicitud.inputs['Historial'].setReadOnly(true);

                    if(plantaAdmin.Rol == "Administrador" && (context.items.Solicitudes.Estado == "Espera de revisión" || context.items.Solicitudes.Estado == "Justificado")){
                        $aproveButton.removeClass('hide');
                        $disapproveButton.removeClass('hide');
                        $justifyButton.removeClass('hide');
                    }
                    if(context.items.Solicitudes.Estado == "Aprobado"){
                        context.forms.solicitud.inputs['Centro_x0020_de_x0020_costo'].show();
                    }
                    if(plantaAdmin.Rol == "Coordinador" && context.items.Solicitudes.Estado == "Requiere justificación"){
                        $reSendButton.removeClass('hide');
                    }
                }else{
                    context.forms.solicitud.inputs['Historial'].hide();
                    context.forms.solicitud.inputs['Estado'].hide();
                    context.forms.solicitud.inputs['Estado'].setRequired(false);
                    context.forms.solicitud.inputs['Centro_x0020_de_x0020_costo'].hide();
                    context.forms.solicitud.inputs['Argumento'].setRequired(true);
                    context.forms.solicitud.inputs['Argumento'].setLabel('Justificación');

                    $createButton.removeClass('hide');
                }

                $createButton.on('click', function (e) {
                    var dialogTitle = 'Nueva solicitud';

                    function save() {
                        var dialog = app.dialog.progress(dialogTitle);
                        
                        let metadata = context.forms.solicitud.getMetadata();

                        metadata['Estado'] = 'Espera de revisión';
                        metadata['PeriodoId'] = context.items.Periodo.ID;
                        metadata['CoordinadorId'] = plantaAdmin.ID;

                        //Generando texto de historial
                        let texto = "";

                        texto += `Coordinador: ${plantaAdmin.NombreCompleto}, Fecha ${moment(new Date()).format("DD/MM/YYYY hh:mm:ss")}\n`;
                        texto += `Estado actual solicitud: ${metadata['Estado']}\n`
                        texto += `Mensaje: ${metadata['Argumento']}`

                        metadata['Historial'] = texto;
                        

                        delete  metadata['Argumento']

                        spo.saveListItem(spo.getSiteUrl(), 'Solicitudes', metadata, function (response) {
                            dialog.close();

                            app.dialog.create({
                                title: dialogTitle,
                                text: 'Solicitud creada con éxito',
                                buttons: [{
                                    text: 'Aceptar',
                                    onClick: function () {
                                        mainView.router.navigate('/Solicitudes');
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

                    context.forms.solicitud.checkFieldsRequired();
                    
                    var validate = context.forms.solicitud.getValidation();

                    if (validate) {
                        if(context.forms.solicitud.inputs['Argumento'].value.length< 10){
                            app.dialog.create({
                                title: 'Datos mal ingresados',
                                text: 'La justificación debe tener un largo de al menos 10 caracteres.',
                                buttons: [{
                                    text: 'Aceptar'
                                }],
                                verticalButtons: false
                            }).open();
                        } else {
                            app.dialog.create({
                                title: dialogTitle,
                                text: 'Se creará una nueva solicitud.',
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
                        }
                    } else {
                        app.dialog.create({
                            title: 'Datos insuficientes',
                            text: 'Para crear una nueva solicitud debe completar todos los campos obligatorios.',
                            buttons: [{
                                text: 'Aceptar'
                            }],
                            verticalButtons: false
                        }).open();
                    }

                });

                $aproveButton.on('click', function (e) { 
                    var dialogTitle = 'Aprobar solicitud';
                    function save(ComentarioVirtual) {
                        var cc = context.items.CentroCosto.filter(x => x.D_CC == ComentarioVirtual)[0];
                        var dialog = app.dialog.progress(dialogTitle);
                        
                        let metadata = context.forms.solicitud.getMetadata();

                        metadata['Estado'] = 'Aprobado';
                        //Generando texto de historial
                        let texto = `Administrador: ${plantaAdmin.NombreCompleto}, Fecha ${moment(new Date()).format("DD/MM/YYYY hh:mm:ss")}\n`;
                        texto += `Estado actual solicitud: ${metadata['Estado']}\n`
                        texto += `Centro de costo asociado: ${cc.CodigoCC}\n`
                        texto += `Mensaje: Se aprueba la solicitud, asignando los siguientes valores:\nel centro de costo: ${ComentarioVirtual}.\n\n`
                        
                        texto += metadata['Historial'];

                        metadata['Historial'] = texto;
                        metadata['Centro_x0020_de_x0020_costoId'] = cc.ID
                       

                        delete  metadata['Argumento'];

                        spo.updateListItem(spo.getSiteUrl(), 'Solicitudes', listItemId, metadata, function (response) {
                            dialog.close();

                            app.dialog.create({
                                title: dialogTitle,
                                text: 'Solicitud aprobada con éxito',
                                buttons: [{
                                    text: 'Aceptar',
                                    onClick: function () {
                                        mainView.router.navigate('/Solicitudes');
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
                    // Inyectar HTML
                    app.popup.create({
                        content: `
                                <div class="popup send-email-popup2" style="overflow:auto">
                                    <div class="close-popup close-button"><i class="ms-Icon ms-Icon--ChromeClose" aria-hidden="true"></i></div>
                                    <div class="block">
                                        <div class="update-form" style="margin-top: 10px !important;"></div>
                                        <div class="buttons-container ms-slideLeftIn10 hide">
                                            <button class="button button-fill close-popup">Volver</button>
                                            <button class="button button-fill send">Aprobar Justificación</button>
                                        </div>
                                    </div>
                                </div>
                            `,
                        // Events
                        on: {
                                opened: function (popup) {
                                    var $container = $(popup.el),
                                        $sendButton = $container.find('.send'),
                                        $closeButton = $container.find('.close-popup'),
                                        $buttonsContainer = $container.find('.buttons-container');
                                    
                                    var centroCosto = context.items.CentroCosto ?  context.items.CentroCosto.map(function(x){
                                        centroCosto.push( x.D_CC != null ? x.D_CC : 'No tenia Nombre');
                                    }) : ['No hay centros de costo disponibles.'];
                                    
                                    var campos = [{
                                        Id: generateUUID(),
                                        Title: 'Centro de costo',
                                        InternalName: 'CentroCosto',
                                        TypeAsString: 'Choice',
                                        Choices: centroCosto
                                    }];
                                    // formulario de actualización
                                    form = new EFWForm({
                                        container: $container.find('.update-form'),
                                        title: 'Aprobación de solicitud'.bold(),
                                        editable: true,
                                        description: 'Seleccione el centro de costo a a asignar.',
                                        fields: campos
                                    });
                                    
                                    $buttonsContainer.removeClass('hide');

                                    // {event} cerrar popup
                                    $closeButton.on('click', function(e){
                                        popup.close();
                                    });

                                    // {event} enviar correo
                                    $sendButton.on('click', function(e){
                                        form.checkFieldsRequired();
                                        if(form.getValidation()){
                                            var comentarioRechazo = form.getMetadata();                                                                    
                                            // cerrar popover
                                            popup.close();

                                            var validate = context.forms.solicitud.getValidation();

                                            if (validate) {
                                                save(comentarioRechazo.CentroCosto);
                                            } else {
                                                app.dialog.create({
                                                    title: 'Datos insuficientes',
                                                    text: 'Para crear una nueva solicitud debe completar todos los campos obligatorios.',
                                                    buttons: [{
                                                        text: 'Aceptar'
                                                    }],
                                                    verticalButtons: false
                                                }).open();
                                            }
                                        }
                                        
                                    })
                                },
                                closed: function (popup) {
                                    if (form) form.destroy();
                                },
                        },
                    }).open();
                });

                $disapproveButton.on('click', function (e) {
                    var dialogTitle = 'Desaprobar solicitud';

                    abrirPopup();
                    function save(ComentarioVirtual) {
                        var dialog = app.dialog.progress(dialogTitle);
                        
                        let metadata = context.forms.solicitud.getMetadata();

                        metadata['Estado'] = 'Desaprobado';
                        //Generando texto de historial
                        texto = `Administrador: ${plantaAdmin.NombreCompleto}, Fecha ${moment(new Date()).format("DD/MM/YYYY hh:mm:ss")}\n`;
                        texto += `Estado actual solicitud: ${metadata['Estado']}\n`
                        texto += `Mensaje: ${ComentarioVirtual}.\n\n`

                        texto += metadata['Historial'];

                        metadata['Historial'] = texto;
                       
                        delete  metadata['Argumento']

                        spo.updateListItem(spo.getSiteUrl(), 'Solicitudes', listItemId, metadata, function (response) {
                            dialog.close();

                            app.dialog.create({
                                title: dialogTitle,
                                text: 'Solicitud desaprobada con éxito',
                                buttons: [{
                                    text: 'Aceptar',
                                    onClick: function () {
                                        mainView.router.navigate('/Solicitudes');
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

                    //Abrir formulario de correo
                    function abrirPopup(){
    
                        // Inyectar HTML
                        var dynamicPopup = app.popup.create({
                            content: `
                                <div class="popup send-email-popup" style="overflow:auto">
                                    <div class="close-popup close-button"><i class="ms-Icon ms-Icon--ChromeClose" aria-hidden="true"></i></div>
                                    <div class="block">
                                        <div class="update-form" style="margin-top: 10px !important;"></div>
                                        <div class="buttons-container ms-slideLeftIn10 hide">
                                            <button class="button button-fill close-popup">Volver</button>
                                            <button class="button button-fill send">Desaprobar</button>
                                        </div>
                                    </div>
                                </div>
                            `,
                            // Events
                            on: {
                                opened: function (popup) {
                                    var $container = $(popup.el),
                                        $sendButton = $container.find('.send'),
                                        $closeButton = $container.find('.close-popup'),
                                        $buttonsContainer = $container.find('.buttons-container');
                                    
                                    var campos = []
                                    campos.push({
                                        Title: 'Motivo',
                                        Id: generateUUID(),
                                        TypeAsString: 'Note',
                                        InternalName: 'ComentarioVirtual',
                                        Required: true,
                                    });
                                    // formulario de actualización
                                    form = new EFWForm({
                                        container: $container.find('.update-form'),
                                        title: 'Desaprobación de solicitud'.bold(),
                                        editable: true,
                                        description: 'Ingrese el motivo de desaprobación.',
                                        fields: campos
                                    });
                                    
                                    $buttonsContainer.removeClass('hide');

                                    // {event} cerrar popup
                                    $closeButton.on('click', function(e){
                                        popup.close();
                                    });

                                    // {event} enviar correo
                                    $sendButton.on('click', function(e){
                                        form.checkFieldsRequired();
                                        if(form.getValidation()){
                                            var comentarioRechazo = form.getMetadata();                                                                    
                                            // cerrar popover
                                            popup.close();
            
                                            save(comentarioRechazo.ComentarioVirtual);
                                        }
                                        
                                    })
                                },
                                closed: function (popup) {
                                    if (form) form.destroy();
                                },
                            },
                        });

                        dynamicPopup.open();
                    }
                });

                $reSendButton.on('click', function (e) {
                    var dialogTitle = 'Envío de justificación';

                    abrirPopup();
                    function save(ComentarioVirtual) {
                        var dialog = app.dialog.progress(dialogTitle);
                        
                        let metadata = context.forms.solicitud.getMetadata();

                        metadata['Estado'] = 'Justificado';
                        //Generando texto de historial

                        let texto = `Coordinador: ${plantaAdmin.NombreCompleto}, Fecha ${moment(new Date()).format("DD/MM/YYYY hh:mm:ss")}\n`;
                        texto += `Estado actual solicitud: ${metadata['Estado']}\n`
                        texto += `Mensaje: ${ComentarioVirtual}.\n\n`

                        texto += metadata['Historial'];

                        metadata['Historial'] = texto;

                        delete  metadata['Argumento']

                        spo.updateListItem(spo.getSiteUrl(), 'Solicitudes', listItemId, metadata, function (response) {
                            dialog.close();

                            app.dialog.create({
                                title: dialogTitle,
                                text: 'Solicitud reenviada con éxito',
                                buttons: [{
                                    text: 'Aceptar',
                                    onClick: function () {
                                        mainView.router.navigate('/Solicitudes');
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

                    //Abrir formulario de correo
                    function abrirPopup(){
    
                        // Inyectar HTML
                        var dynamicPopup = app.popup.create({
                            content: `
                                <div class="popup send-email-popup" style="overflow:auto">
                                    <div class="close-popup close-button"><i class="ms-Icon ms-Icon--ChromeClose" aria-hidden="true"></i></div>
                                    <div class="block">
                                        <div class="update-form" style="margin-top: 10px !important;"></div>
                                        <div class="buttons-container ms-slideLeftIn10 hide">
                                            <button class="button button-fill close-popup">Volver</button>
                                            <button class="button button-fill send">Enviar justificación</button>
                                        </div>
                                    </div>
                                </div>
                            `,
                            // Events
                            on: {
                                opened: function (popup) {
                                    var $container = $(popup.el),
                                        $sendButton = $container.find('.send'),
                                        $closeButton = $container.find('.close-popup'),
                                        $buttonsContainer = $container.find('.buttons-container');
                                    
                                    var campos = []
                                    campos.push({
                                        Title: 'Justificacion',
                                        Id: generateUUID(),
                                        TypeAsString: 'Note',
                                        InternalName: 'ComentarioVirtual',
                                        Required: true,
                                    });
                                    // formulario de actualización
                                    form = new EFWForm({
                                        container: $container.find('.update-form'),
                                        title: 'Justificación'.bold(),
                                        editable: true,
                                        description: 'Ingrese su justificación.',
                                        fields: campos
                                    });
                                    
                                    $buttonsContainer.removeClass('hide');

                                    // {event} cerrar popup
                                    $closeButton.on('click', function(e){
                                        popup.close();
                                    });

                                    // {event} enviar correo
                                    $sendButton.on('click', function(e){
                                        form.checkFieldsRequired();
                                        if(form.getValidation()){
                                            var comentarioRechazo = form.getMetadata();                                                                    
                                            // cerrar popover
                                            popup.close();
            
                                            save(comentarioRechazo.ComentarioVirtual);
                                        }
                                        
                                    })
                                },
                                closed: function (popup) {
                                    if (form) form.destroy();
                                },
                            },
                        });

                        dynamicPopup.open();
                    }
                });

                $justifyButton.on('click', function (e) {
                    var dialogTitle = 'Solicitud de justificación';

                    abrirPopup();
                    function save(ComentarioVirtual) {
                        var dialog = app.dialog.progress(dialogTitle);
                        
                        let metadata = context.forms.solicitud.getMetadata();

                        metadata['Estado'] = 'Requiere justificación';
                        //Generando texto de historial
                        

                        let texto = `Administrador: ${plantaAdmin.NombreCompleto}, Fecha ${moment(new Date()).format("DD/MM/YYYY hh:mm:ss")}\n`;
                        texto += `Estado actual solicitud: ${metadata['Estado']}\n`
                        texto += `Mensaje: ${ComentarioVirtual}.\n\n`
                        texto += metadata['Historial'];

                        metadata['Historial'] = texto;
                       

                        delete  metadata['Argumento']

                        spo.updateListItem(spo.getSiteUrl(), 'Solicitudes', listItemId, metadata, function (response) {
                            dialog.close();

                            app.dialog.create({
                                title: dialogTitle,
                                text: 'Justificación solicitada con éxito',
                                buttons: [{
                                    text: 'Aceptar',
                                    onClick: function () {
                                        mainView.router.navigate('/Solicitudes');
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

                    //Abrir formulario de correo
                    function abrirPopup(){
    
                        // Inyectar HTML
                        var dynamicPopup = app.popup.create({
                            content: `
                                <div class="popup send-email-popup" style="overflow:auto">
                                    <div class="close-popup close-button"><i class="ms-Icon ms-Icon--ChromeClose" aria-hidden="true"></i></div>
                                    <div class="block">
                                        <div class="update-form" style="margin-top: 10px !important;"></div>
                                        <div class="buttons-container ms-slideLeftIn10 hide">
                                            <button class="button button-fill close-popup">Volver</button>
                                            <button class="button button-fill send">Solicitar justificación</button>
                                        </div>
                                    </div>
                                </div>
                            `,
                            // Events
                            on: {
                                opened: function (popup) {
                                    var $container = $(popup.el),
                                        $sendButton = $container.find('.send'),
                                        $closeButton = $container.find('.close-popup'),
                                        $buttonsContainer = $container.find('.buttons-container');
                                    
                                    var campos = []
                                    campos.push({
                                        Title: 'Motivo',
                                        Id: generateUUID(),
                                        TypeAsString: 'Note',
                                        InternalName: 'ComentarioVirtual',
                                        Required: true,
                                    });
                                    // formulario de actualización
                                    form = new EFWForm({
                                        container: $container.find('.update-form'),
                                        title: 'Solicitud de justificación'.bold(),
                                        editable: true,
                                        description: 'Ingrese el motivo de la justificación.',
                                        fields: campos
                                    });
                                    
                                    $buttonsContainer.removeClass('hide');

                                    // {event} cerrar popup
                                    $closeButton.on('click', function(e){
                                        popup.close();
                                    });

                                    // {event} enviar correo
                                    $sendButton.on('click', function(e){
                                        form.checkFieldsRequired();
                                        if(form.getValidation()){
                                            var comentarioRechazo = form.getMetadata();                                                                    
                                            // cerrar popover
                                            popup.close();
            
                                            save(comentarioRechazo.ComentarioVirtual);
                                        }
                                        
                                    })
                                },
                                closed: function (popup) {
                                    if (form) form.destroy();
                                },
                            },
                        });
                        

                        dynamicPopup.open();
                    }
                });

                // remover loader
                mths.removePageLoader();
            }

            function getListInformation() {
                var loaded = {};

                context.lists = {};
                context.items = {};

                var shouldInitForms = function () {
                    if(plantaAdmin.Rol == "Administrador"){
                        if (loaded.Solicitudes && loaded.Periodo && loaded.CentroCosto) {
                            initForm();
                            return;
                        }
                    }
                    if(plantaAdmin.Rol == "Coordinador"){
                        if (loaded.Categorias && loaded.Planta && loaded.Solicitudes && loaded.Periodo && loaded.ListadoItemVariable) {
                            initForm();
                            return;
                        }
                    }
                };

                // Obtener información de lista
                spo.getListInfo('Solicitudes',
                    function (response) {
                        context.items,Solicitudes = {};
                        context.lists.Solicitudes = response;               
                        // Si existe el id de algún item a obtener
                        if(listItemId){
                            var query = spo.encodeUrlListQuery(context.lists.Solicitudes, {
                                view: 'Todos los elementos',
                                odata: {
                                    'filter': '(ID eq '+listItemId+')',
                                    'select': '*'
                                }
                            });
    
                                spo.getListItems(spo.getSiteUrl(), 'Solicitudes', query,
                                    function (response) {
                                        context.items.Solicitudes = response.d.results.length > 0 ? response.d.results[0] : null;
                                        loaded.Solicitudes = true;
                                        shouldInitForms();
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
                
                

                if(plantaAdmin.Rol == "Coordinador"){
                    //Obtengo el listado de haberes para ser filtrados
                    spo.getListInfo('Planta',
                        function (response) {
                            context.items.Planta = [];
                            context.lists.Planta = response;

                                var query = spo.encodeUrlListQuery(context.lists.Planta, {
                                    view: 'Todos los elementos',
                                    odata: {
                                        'select': '*',
                                        'filter': 'CoordinadorId eq '+ plantaAdmin.ID
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

                    //Obtengo el listado de haberes para ser filtrados
                    spo.getListInfo('ListadoItemVariable',
                        function (response) {
                            context.items.ListadoItemVariable = [];
                            context.lists.ListadoItemVariable = response;
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
                
                if(plantaAdmin.Rol == "Administrador"){
                    // Obtener información de lista
                    spo.getListInfo('CentroCosto',
                        function (response) {
                            context.items.CentroCosto = [];
                            context.lists.CentroCosto = response;                            
                            // Si existe el id de algún item a obtener
                            var query = spo.encodeUrlListQuery(context.lists.CentroCosto, {
                                view: 'Todos los elementos',
                                odata: {
                                    'select': '*',
                                    'top': 5000,
                                    'filter': 'activo eq 1',
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

                // Obtener información de lista
                spo.getListInfo('Periodo',
                    function (response) {
                        context.items.Periodo = [];
                        context.lists.Periodo = response;
                        
                        // Si existe el id de algún item a obtener

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