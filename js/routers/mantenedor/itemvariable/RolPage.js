var rolPage = {
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
                            '<span class="ios-only">Asignar</span>' +
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
            '</div>' +
            
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
            return 'Planta';
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
                listItemId = page.route.query.listItemId;

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
                    $sendButton = $navbar.find('.link.send');

                // formulario de registro
                let form = {
                    container: $container.find('.form-container'),
                    title: mths.getListTitle(),
                    editable: false,
                    fields: spo.getViewFields(context.lists.planta, "Rol Form")
                }

                context.forms.planta = new EFWForm(form);

                context.forms.planta.inputs['Rol'].setEditable(true);
                context.forms.planta.inputs['Rol'].setRequired(true);
                context.forms.planta.inputs['Usuario'].setEditable(true);
                context.forms.planta.inputs['Usuario'].setRequired(true);
                context.forms.planta.inputs['Aprobador'].hide();


                context.forms.planta.inputs['Rol'].params.onChange = function(comp, input, state, values){
                    if (values.length > 0){
                        if(values[0].key == "Coordinador"){
                            context.forms.planta.inputs['Aprobador'].show();
                            context.forms.planta.inputs['Aprobador'].setEditable(true);
                            context.forms.planta.inputs['Aprobador'].setRequired (true)
                        } else {
                            context.forms.planta.inputs['Aprobador'].hide();
                            context.forms.planta.inputs['Aprobador'].setEditable(false);
                            context.forms.planta.inputs['Aprobador'].resetValue();
                            context.forms.planta.inputs['Aprobador'].setRequired (false)
                        }
                    } else {
                        context.forms.planta.inputs['Aprobador'].hide();
                        context.forms.planta.inputs['Aprobador'].setEditable(false);
                        context.forms.planta.inputs['Aprobador'].resetValue();
                        context.forms.planta.inputs['Aprobador'].setRequired (false)
                    }
                }

                context.forms.planta.inputs['Aprobador'].params.source = function(dropdown, query, render){
                    let data = [];
                    if(context.items.aprobadores){
                        context.items.aprobadores.map(function(item){
                            data.push({
                                "key": item.ID,
                                "text": item.NombreCompleto +" - "+ item.d_cargo.NombreCargo,
                                "item": item
                            });
                        })
                    } else {
                        context.forms.planta.inputs['Aprobador'].input.placeholder = "No hay aprobadores disponibles"
                    }
                    render(data);
                }  

                context.forms.planta.inputs['Usuario'].params.beforeRenderSuggestions = function(suggestions){
                    let data = [];
                    suggestions.forEach(element => {
                        if(!context.adminIds.includes(element.ID)){
                            data.push(element)
                        }
                    });
                    return data;
                }

                if (listItemId) {
                    context.forms.planta.setValues(context.items.planta);
                    $sendButton.removeClass('hide');
                } 

                $sendButton.on('click', function (e) {
                    var dialogTitle = 'Asignación de rol';

                    function update() {
                        var dialog = app.dialog.progress(dialogTitle);
                        var metadata = context.forms.planta.getMetadata();
                        delete metadata.LinkTitle;

                        spo.updateListItem(spo.getSiteUrl(), mths.getListTitle(), listItemId, metadata, function (response) {
                            dialog.close();

                            dialogs.confirmDialog(
                                dialogTitle,
                                'Rol asignado con éxito',
                                function () {
                                    mainView.router.navigate('/rolStream');
                                },
                                false
                            );

                        }, function (response) {
                            var responseText = JSON.parse(response.responseText);
                            console.log('responseText', responseText);

                            dialog.close();
                            dialogs.infoDialog(
                                "Error",
                                'Hubo un problema al asignar el rol'
                            )
                        });
                    }
                    
                    context.forms.planta.checkFieldsRequired();
                    var validatePlanta =  context.forms.planta.getValidation();

                    if (validatePlanta){
                        dialogs.confirmDialog(
                            dialogTitle,
                            'Se asignará un rol a este usuario',
                            update
                        )
                    } else {
                        dialogs.infoDialog(
                            "Datos mal ingresados",
                            'Rellene todos los campos correctamente'
                        )
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
                    if (loaded.planta && loaded.aprobadores && loaded.admins) {
                        initForm();
                    }
                };

                spo.getListInfo(mths.getListTitle(),
                    function (response) {
                        context.lists.planta = response;
                        var query = spo.encodeUrlListQuery(context.lists.planta, {
                            view: 'Todos los elementos',
                            odata: {
                                'filter': '(Id eq ' + listItemId + ')'
                            }
                        });

                        spo.getListItems(spo.getSiteUrl(), mths.getListTitle(), query,
                            function (response) {
                                context.items.planta = response.d.results.length > 0 ? response.d.results[0] : null;
                                loaded.planta = true;
                                shouldInitForms();
                            },
                            function (response) {
                                var responseText = JSON.parse(response.responseText);
                                console.log(responseText.error.message.value);
                            }
                        );

                        var query2 = spo.encodeUrlListQuery(context.lists.planta, {
                            view: 'Todos los elementos',
                            odata: {
                                'filter': '(Rol eq \'Aprobador\' and EstadoContrato eq \'Activo\')'
                            }
                        });

                        spo.getListItems(spo.getSiteUrl(), mths.getListTitle(), query2,
                            function (response) {
                                context.items.aprobadores = response.d.results.length > 0 ? response.d.results : null;
                                loaded.aprobadores = true;
                                shouldInitForms();
                            },
                            function (response) {
                                var responseText = JSON.parse(response.responseText);
                                console.log(responseText.error.message.value);
                            }
                        );

                        var query3 = spo.encodeUrlListQuery(context.lists.planta, {
                            view: 'Todos los elementos',
                            odata: {
                                'filter': '(UsuarioId ne null)'
                            }
                        });

                        spo.getListItems(spo.getSiteUrl(), mths.getListTitle(), query3,
                            function (response) {
                                context.items.admins = response.d.results.length > 0 ? response.d.results : null;
                                context.adminIds = context.items.admins.map(function (admin) {
                                    return admin.UsuarioId
                                })
                                loaded.admins = true;
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