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
                            '<i class="ms-Icon ms-Icon--Accept"></i>' +
                            '<span class="ios-only">Registrar</span>' +
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
                // containers
                var $container = $(page.$el),
                    $navbar = $(page.navbarEl),
                    $sendButton = $navbar.find('.send');

                    $sendButton.removeClass('hide');

                context.forms.solicitud = new EFWForm({
                    container: $container.find('.form-container'),
                    title: 'Solicitud de centro de costo',
                    editable: true,
                    // description: 'Culpa sunt deserunt adipisicing cillum ex et ex non amet nulla officia veniam ullamco proident.',
                    fields: spo.getViewFields(context.lists.Solicitudes, 'Form centro de costo'),
                });
                context.forms.solicitud.inputs['TipoSolicitud'].setValue([{ key:'Espera de revisión', text: 'Espera de revisión'}])

                context.forms.solicitud.inputs['Item'].params.beforeRenderSuggestions = function (items) {
                    let data = [];

                    context.coorId.HaberesId.results.map(function(y){
                        data.push(items.filter(x => x.ID == y)[0]);
                    })

                    return data;
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

                $sendButton.on('click', function (e) {
                    var dialogTitle = 'Nueva solicitud';

                    function save() {
                        var dialog = app.dialog.progress(dialogTitle);
                        
                        let metadata = context.forms.solicitud.getMetadata();

                        metadata['Estado'] = 'Espera de revisión';
                        metadata['PeriodoId'] = context.items.Periodo.ID;
                        metadata['CoordinadorId'] = context.coorId.ID;

                        spo.saveListItem(spo.getSiteUrl(), 'Solicitudes', metadata, function (response) {
                            dialog.close();

                            app.dialog.create({
                                title: dialogTitle,
                                text: 'Solicitud creada con éxito',
                                buttons: [{
                                    text: 'Aceptar',
                                    onClick: function () {
                                        mainView.router.refreshPage();
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

                    if(context.forms.solicitud.inputs['Justificacion'].value.length< 10){
                        app.dialog.create({
                            title: 'Datos mal ingresados',
                            text: 'La justificación debe tener un largo de al menos 10 caracteres.',
                            buttons: [{
                                text: 'Aceptar'
                            }],
                            verticalButtons: false
                        }).open();
                    }else if (validate) {
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

                // remover loader
                mths.removePageLoader();
            }

            function getListInformation() {
                var loaded = {};

                context.lists = {};
                context.items = {};

                var shouldInitForms = function () {
                    if (loaded.Planta && loaded.lista && loaded.Periodo && loaded.ListadoItemVariable ) {
                        initForm();
                    }
                };

                // Obtener información de lista
                spo.getListInfo('Solicitudes',
                    function (response) {
                        context.lists.Solicitudes = response;
                        loaded.lista = true;
                        shouldInitForms();

                    },
                    function (response) {
                        var responseText = JSON.parse(response.responseText);
                        console.log(responseText.error.message.value);
                    }
                );

                spo.getListInfo('Coordinador',
                    function (response) {
                        var query = spo.encodeUrlListQuery(response, {
                            view: 'Todos los elementos',
                            odata: {
                                'filter': '(UsuarioId eq '+ spo.getCurrentUserId() +')',
                                'select': '*'
                            }
                        });
                        spo.getListItems(spo.getSiteUrl(), "Coordinador", query,
                            function (response) {
                                context.coorId = response.d.results.length>0 ? response.d.results[0] : null;

                                //Obtengo el listado de haberes para ser filtrados
                                spo.getListInfo('Planta',
                                function (response) {
                                    context.items.Planta = [];
                                    context.lists.Planta = response;

                                        var query = spo.encodeUrlListQuery(context.lists.Planta, {
                                            view: 'Todos los elementos',
                                            odata: {
                                                'select': '*',
                                                'filter': 'CoordinadorId eq '+context.coorId.ID
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
                                
                            },
                            function (response) {
                                var responseText = JSON.parse(response.responseText);
                                console.log(responseText.error.message.value);
                                if (failure) failure();
                            }
                        );
                    },
                    function(response){
                        var responseText = JSON.parse(response.responseText);
                        console.log(responseText.error.message.value);
                        resolve(failCond);
                        if (failure) failure();
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

                // Obtener información de lista
                spo.getListInfo('Periodo',
                    function (response) {
                        context.items.Periodo = [];
                        context.lists.Periodo = response;
                        loaded.Periodo = true;
                        
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