var haberesPage = {
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
                '<div class="form-container form1"></div>' +
                '<div class="form-container form2 table-compact-row"></div>' +
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
                listItemId = page.route.query.listItemId,
                editable = page.route.query.editable;

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
                    $sendButton = $navbar.find('.link.send'),
                    $updateButton = $navbar.find('.link.update'),
                    $clearButton = $navbar.find('.link.clear');

                // context.forms.haberes = new EFWForm({
                //     container: $container.find('.form-container'),
                //     title: 'Haberes Coordinador',
                //     editable: editable ? true : false,
                //     fields: spo.getViewFields(context.lists.Planta, 'FormHaberes')
                // })


                context.forms.coo = new EFWForm({
                    container: $container.find('.form1'),
                    title: 'Haberes Coordinador',
                    editable: editable ? true : false,
                    fields: spo.getViewFields(context.lists.Planta, 'FormHaberes')
                })


                //Obtenemos los items para generar el input

                var listadoItem = [];

                context.items.ListadoItemVariable.map(function(item){
                    listadoItem.push(item.NombreItem)
                });

                //Formulario Fechas excepcionales
                var inputs = [{
                    Id: generateUUID(),
                    Title: 'Item Variable permitido',
                    InternalName: 'item',
                    TypeAsString: 'Choice',
                    Choices: listadoItem
                }]

                context.forms.haberes = new EFWForms({
                    container: $container.find('.form2'),
                    title: '',
                    editable: editable ? true : false,
                    disable: editable ? true : false,
                    // description: 'Culpa sunt deserunt adipisicing cillum ex et ex non amet nulla officia veniam ullamco proident.',
                    fields: inputs,
                });
                context.forms.haberes.addRow();

                if(listItemId){
                    context.forms.coo.setValues(context.items.Planta);
                    context.forms.coo.inputs['Rut'].setEditable(false);
                    context.forms.coo.inputs['NombreCompleto'].setEditable(false);
                    context.forms.coo.inputs['Haberes'].setEditable(false);
                    context.forms.coo.inputs['Haberes'].hide();

                    if(editable){
                        context.forms.coo.inputs['Haberes'].setEditable(true);
                        $updateButton.removeClass('hide');
                    }
                }
                  

                $updateButton.on('click', function (e) {
                    var dialogTitle = 'Editando elemento';

                    function save() {
                        var dialog = app.dialog.progress(dialogTitle);
                        var metadata = context.forms.haberes.getMetadata();
                        

                        spo.updateListItem(spo.getSiteUrl(), mths.getListTitle(), listItemId, metadata, function (response) {
                            dialog.close();

                            app.dialog.create({
                                title: dialogTitle,
                                text: 'Elemento actualizado con éxito',
                                buttons: [{
                                    text: 'Aceptar',
                                    onClick: function () {
                                        mainView.router.navigate('/haberTemporal?listItemId='+listItemId);
                                    }
                                }],
                                verticalButtons: false
                            }).open();


                        }, function (response) {
                            var responseText = JSON.parse(response.responseText);
                            console.log('responseText', responseText);

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
                    
                    context.forms.haberes.checkFieldsRequired();

                    var validate = context.forms.haberes.getValidation();

                    if (validate) {
                        app.dialog.create({
                            title: dialogTitle,
                            text: 'Se actualizará el elemento.',
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
                            text: 'Para crear un nuevo elemento debe completar todos los campos obligatorios.',
                            buttons: [{
                                text: 'Aceptar'
                            }],
                            verticalButtons: false
                        }).open();
                    }

                });

                $clearButton.on('click', function (e){
                });

                // remover loader
                mths.removePageLoader();
            }

            function getListInformation() {
                var loaded = {};

                context.lists = {};
                context.items = {};

                var shouldInitForms = function () {
                    if (loaded.ListadoItemVariable && loaded.Trabajadores) {
                        initForm();
                    }
                };             

                // Obtengo los trabajadores asociados al coordinador
                spo.getListInfo('Planta',
                    function (response) {
                        context.items.Planta = [];
                        //Guarda los valores de los campos de la lista. Solamente los campos
                        context.lists.Planta = response; 
                        
                        if(listItemId){
                            // Genera la query basado en los campos que se obtubieron en la SPO anterior
                            var query = spo.encodeUrlListQuery(context.lists.Planta, {
                                view: 'Todos los elementos',
                                odata: {
                                    'filter': '(ID eq ' + listItemId + ')',
                                }
                            });

                            spo.getListItems(spo.getSiteUrl(), 'Planta', query,
                                function (response) {
                                    context.items.Planta = response.d.results.length > 0 ? response.d.results[0] : null;
                                    loaded.Trabajadores = true;
                                    shouldInitForms();
                                },
                                function (response) {
                                    var responseText = JSON.parse(response.responseText);
                                    console.log(responseText.error.message.value);
                                }
                            );
                        }else{
                            loaded.Trabajadores = true;
                            shouldInitForms();
                        }
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