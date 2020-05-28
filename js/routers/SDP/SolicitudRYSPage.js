var SolicitudRySPage = {
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
                        '<a href="#" class="link save ms-fadeIn100 hide">' +
                            '<i class="ms-Icon ms-Icon--Save"></i>' +
                            '<span class="ios-only">Guardar</span>' +
                        '</a>' +
                        '<a href="#" class="link create ms-fadeIn100 hide">' +
                            '<i class="ms-Icon ms-Icon--Send"></i>' +
                            '<span class="ios-only">Enviar a RyS</span>' +
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
                '<div>' +
                    '<div class="form-container cargo"></div>' +
                    '<div class="form-container jornada"></div>' +
                    '<div class="form-container recuperable"></div>' +
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
    style:  '.form-container .ms-FormField {width: 45%; float:left} ' + 
    '.ms-Button.ms-Button--primary {background-color: #4caf50 !important; border-color: #4caf50 !important;} ',            
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
            return 'CentroCosto';
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
                    $createButton = $navbar.find('.link.create'),
                    $clearButton = $navbar.find('.link.clear');
                    $saveButton = $navbar.find('.link.save');

                // formulario de registro
                context.forms.cargo = new EFWForm({
                    container: $container.find('.cargo'),
                    title: 'Información del cargo',
                    editable: false,
                    fields: [{
                        Id: generateUUID(),
                        Title: 'Cargo',
                        InternalName: 'Cargo',
                        TypeAsString: 'Text'
                    },{
                        Id: generateUUID(),
                        Title: 'Cantidad de horas',
                        InternalName: 'CantHoras',
                        TypeAsString: 'Text'
                    }]
                });

                context.forms.jornada = new EFWForm({
                    container: $container.find('.jornada'),
                    title: 'Información de la jornada',
                    editable: true,
                    fields: [
                        spo.getViewFields(context.lists.SolicitudRyS, 'FormRyS')[0],
                        spo.getViewFields(context.lists.SolicitudRyS, 'FormRyS')[1]
                    ]
                });

                context.forms.jornada.inputs.Attachments.hide();
                context.forms.jornada.inputs.Attachments.setLabel('Archivo jornada');

                context.forms.jornada.inputs.Attachments.params.onChange = function(comp, input, state, values){
                    $('div.item-after div.ms-Button-AttachEdit i.ms-Icon.ms-Icon--Cancel').hide()
                    context.forms.jornada.inputs.Attachments.setEditable(false)
                }

                context.forms.jornada.inputs.Jornada.params.onChange = function(comp, input, state, values){
                    if (values.length == 0){
                        context.forms.jornada.inputs.Attachments.hide();
                        return;
                    }
                    if(values[0].text == "Otro"){
                        context.forms.jornada.inputs.Attachments.show();
                    }
                }

                context.forms.recuperable = new EFWForm({
                    container: $container.find('.recuperable'),
                    title: '¿Que incluye el cargo?',
                    editable: true,
                    fields: [
                        spo.getViewFields(context.lists.SolicitudRyS, 'FormRyS')[2],{
                        Id: generateUUID(),
                        Title: 'Describa otros',
                        InternalName: 'Libre',
                        TypeAsString: 'Text'
                    }]
                });
                context.forms.recuperable.inputs.Libre.hide();

                context.forms.recuperable.inputs.ConfigRecuperable.params.onChange = function(comp, input, state, values){
                    if (values.length == 0){
                        context.forms.recuperable.inputs.Libre.hide();
                        context.forms.recuperable.inputs.Libre.setRequired(false)
                        return;
                    }

                    var allow = values.filter(x=> x.text == 'otros')[0];
                    if(allow){
                        context.forms.recuperable.inputs.Libre.show();
                        context.forms.recuperable.inputs.Libre.setRequired(true)
                    }else{
                        context.forms.recuperable.inputs.Libre.hide();
                        context.forms.recuperable.inputs.Libre.setRequired(false)
                    }
                }
                context.forms.recuperable.hide();

                if (listItemId) {
                    context.forms.cargo.setValues(context.items.Posicion);
                    context.forms.cargo.inputs.Cargo.setValue(context.items.Posicion.Cargo.NombreCargo)

                    if(context.items.DataRyS){
                        context.forms.jornada.setValues(context.items.DataRyS);
                        context.forms.recuperable.setValues(context.items.DataRyS)
                    }

                    if(context.items.solicitudSDP){
                        if(context.items.solicitudSDP.CPRFechaDesde){
                            context.forms.recuperable.show();
                        }
                    }

                    $createButton.removeClass('hide');
                    $saveButton.removeClass('hide');
                    $clearButton.removeClass('hide');                     
                }

                $createButton.on('click', function (e){
                    var dialogTitle = 'Enviar Solicitud a RyS'

                    function save(){
                        var dialog = app.dialog.progress(dialogTitle);
                        let metadata = context.forms.jornada.getMetadata();
                        metadata.PosicionesId = context.items.Posicion.ID;
                        metadata.SolicitudSDPId = context.items.solicitudSDP.ID

                        if(context.items.solicitudSDP){
                            if(context.items.solicitudSDP.CPRFechaDesde){
                                if(!context.forms.recuperable.getMetadata().ConfigRecuperable.results.includes('otros')){
                                    metadata.ConfigRecuperable = context.forms.recuperable.getMetadata().ConfigRecuperable;
                                }else{
                                    metadata.ConfigRecuperable = {}
                                    metadata.ConfigRecuperable.results = context.forms.recuperable.getMetadata().ConfigRecuperable.results.map(function(x){
                                        if(x == 'otros'){
                                            return context.forms.recuperable.getMetadata().Libre
                                        }else{
                                            return x
                                        }
                                    })
                                }
                            }
                        }

                        if(context.items.Posicion.SolicitudRyEId){
                            spo.updateListItem(spo.getSiteUrl(), 'SolicitudRyS', context.items.Posicion.SolicitudRyEId, metadata, function (response) {
                                var data = {};

                                    data.Estado = "En RyS";
                                    data.FechaInicioProceso = new Date().toISOString();

                                spo.updateListItem(spo.getSiteUrl(), 'Posicion', context.items.Posicion.ID, data, function (response) {

                                    dialog.close();
                                    app.dialog.create({
                                        title: dialogTitle,
                                        text: 'Solicitud RyS enviada con éxito',
                                        buttons: [{
                                            text: 'Aceptar',
                                            onClick: function () {
                                                mainView.router.navigate('/misPosiciones');
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
                        }else{
                            spo.saveListItem(spo.getSiteUrl(), 'SolicitudRyS', metadata, function (response) {
                                var data = {};

                                    data.Estado = "En RyS";
                                    data.FechaInicioProceso = new Date().toISOString();
                                    data.SolicitudRyEId = response.ID

                                spo.updateListItem(spo.getSiteUrl(), 'Posicion', context.items.Posicion.ID, data, function (response) {

                                    dialog.close();
                                    app.dialog.create({
                                        title: dialogTitle,
                                        text: 'Solicitud RyS enviada con éxito',
                                        buttons: [{
                                            text: 'Aceptar',
                                            onClick: function () {
                                                mainView.router.navigate('/misPosiciones');
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
                    }

                    context.forms.jornada.checkFieldsRequired();
                    if(context.items.solicitudSDP){
                        if(context.items.solicitudSDP.CPRFechaDesde){
                            context.forms.recuperable.checkFieldsRequired();
                            recRequired = true;
                        }
                    }
                    var validateJornada = context.forms.jornada.getValidation();
                    var validateRecuperable = recRequired ? context.forms.jornada.getValidation() : true;

                    if(validateJornada && validateRecuperable){
                        //Mostrar alert
                        dialogs.confirmDialog(
                            dialogTitle,
                            '¿Desea enviar la solicitud a RyS?',
                            save
                        )
                    }else{
                        dialogs.infoDialog(
                            "Datos mal ingresados",
                            'Rellene todos los campos correctamente'
                        )
                    }

                    
                });

                $saveButton.on('click', function (e){
                    var dialogTitle = 'Guardando datos'

                    var dialog = app.dialog.progress(dialogTitle);
                        let metadata = context.forms.jornada.getMetadata();
                        metadata.PosicionesId = context.items.Posicion.ID;
                        metadata.SolicitudSDPId = context.items.solicitudSDP.ID

                        if(context.items.solicitudSDP){
                            if(context.items.solicitudSDP.CPRFechaDesde){
                                if(!context.forms.recuperable.getMetadata().ConfigRecuperable.results.includes('otros')){
                                    metadata.ConfigRecuperable = context.forms.recuperable.getMetadata().ConfigRecuperable;
                                }else{
                                    metadata.ConfigRecuperable = {}
                                    metadata.ConfigRecuperable.results = context.forms.recuperable.getMetadata().ConfigRecuperable.results.map(function(x){
                                        if(x == 'otros'){
                                            return context.forms.recuperable.getMetadata().Libre
                                        }else{
                                            return x
                                        }
                                    })
                                }
                            }
                        }

                    spo.saveListItem(spo.getSiteUrl(), 'SolicitudRyS', metadata, function (response) {
                        var data = {};
                            data.SolicitudRyEId = response.d.ID

                        spo.updateListItem(spo.getSiteUrl(), 'Posicion', context.items.Posicion.ID, data, function (response) {

                            dialog.close();
                            app.dialog.create({
                                title: dialogTitle,
                                text: 'Guardado de la información completado.',
                                buttons: [{
                                    text: 'Aceptar',
                                    onClick: function () {
                                        return;
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
                });

                $clearButton.on('click', function (e){
                    context.forms.recuperable.setValues([]);
                    context.forms.jornada.setValues([]);
                });

                // remover loader
                mths.removePageLoader();
            }

            function getListInformation() {
                var loaded = {};

                context.lists = {};
                context.items = {};

                var shouldInitForms = function () {
                    if (loaded.Posicion && loaded.SolicitudRyS && loaded.solicitudSDP & loaded.DataRyS) {
                        initForm();
                    }
                };             

                spo.getListInfo('SolicitudRyS',
                    function (response) {
                        context.items.SolicitudRyS = [];
                        context.lists.SolicitudRyS = response
                        loaded.SolicitudRyS = true;
                        shouldInitForms();
                    },
                    function (response) {
                        var responseText = JSON.parse(response.responseText);
                        console.log(responseText.error.message.value);
                    }
                );
                
                //Obtengo el listado de centro de costos para ser filtrados
                spo.getListInfo('Posicion',
                    function (response) {
                        context.items.Posicion = [];
                        context.lists.Posicion = response;
                        if(listItemId){
                            var query = spo.encodeUrlListQuery(context.lists.Posicion, {
                                view: 'Todos los elementos',
                                odata: {
                                    'select': '*',
                                    'filter' : '(Id eq '+listItemId+')'
                                }
                            });

                            spo.getListItems(spo.getSiteUrl(), 'Posicion', query,
                                function (response) {
                                    context.items.Posicion = response.d.results.length > 0 ? response.d.results[0] : null;
                                    loaded.Posicion= true;
                                    
                                    if(context.items.Posicion.SolicitudSDPId != "" || context.items.Posicion.FechaExpiracion != null){
                                        spo.getListInfo('SolicitudSDP',
                                            function (response) {
                                                context.items.solicitudSDP = [];
                                                context.lists.solicitudSDP = response;
                                                    var query1 = spo.encodeUrlListQuery(context.lists.solicitudSDP, {
                                                        view: 'Todos los elementos',
                                                        odata: {
                                                            'select': '*',
                                                            'filter' : '(Id eq '+context.items.Posicion.SolicitudSDPId+')'
                                                        }
                                                    });

                                                    spo.getListItems(spo.getSiteUrl(), 'SolicitudSDP', query1,
                                                        function (response) {
                                                            context.items.solicitudSDP = response.d.results.length > 0 ? response.d.results[0] : null;
                                                            loaded.solicitudSDP= true;
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
                                        loaded.solicitudSDP = true
                                        shouldInitForms();
                                    }

                                    if(context.items.Posicion.SolicitudRyEId){
                                        spo.getListInfo('SolicitudRyS',
                                            function (response) {
                                                context.items.DataRyS = [];
                                                context.lists.DataRyS = response;
                                                    var query2 = spo.encodeUrlListQuery(context.lists.DataRyS, {
                                                        view: 'Todos los elementos',
                                                        odata: {
                                                            'select': '*',
                                                            'filter' : '(Id eq '+context.items.Posicion.SolicitudRyEId+')'
                                                        }
                                                    });
                                                    spo.getListItems(spo.getSiteUrl(), 'SolicitudRyS', query2,
                                                        function (response) {
                                                            context.items.DataRyS = response.d.results.length > 0 ? response.d.results[0] : null;
                                                            loaded.DataRyS= true;
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
                                        loaded.DataRyS = true;
                                        shouldInitForms();
                                    }
                                },
                                function (response) {
                                    var responseText = JSON.parse(response.responseText);
                                    console.log(responseText.error.message.value);
                                }
                            );

                        }else{
                            loaded.Posicion= true;
                            shouldInitForms();
                        }
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