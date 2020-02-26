var itemVariablePage = {
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


            '<div id="tituloFormularioMuestra" class="ms-font-xl ms-slideRightIn10" style="padding: 20px 20px 0 20px;">Detalle Item Variable</div>' +
            '<div class="list accordion-list">' +
                '<ul>' +
                    '<li class="accordion-item datos"><a href="#" class="item-content item-link">' +
                        '<div class="item-inner">' +
                          '<div class="item-title">Datos principales item variable</div>' +
                        '</div></a>' +
                      '<div class="accordion-item-content">' +
                        '<div class="form-container"></div>' +
                      '</div>' +
                    '</li>' +
                    '<li class="accordion-item check"><a href="#" class="item-content item-link">' +
                        '<div class="item-inner">' +
                          '<div class="item-title">Tipo de análisis a realizar</div>' +
                        '</div></a>' +
                      '<div class="accordion-item-content">' +
                        '<div class="form2"></div>' +
                      '</div>' +
                    '</li>' +
                    '<li class="accordion-item germinacion"><a href="#" class="item-content item-link">' +
                        '<div class="item-inner">' +
                          '<div class="item-title">Análisis: Germinación</div>' +
                        '</div></a>' +
                      '<div class="accordion-item-content">' +
                        '<div class="block form-germinacion">' +
                        '</div>' +
                      '</div>' +
                    '</li>' +
                '</ul>' +
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
            return 'ListadoItemVariable';
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
                    $sendButton = $navbar.find('.link.send'),
                    $updateButton = $navbar.find('.link.update'),
                    $clearButton = $navbar.find('.link.clear');

                // formulario de registro
                context.forms.item = new EFWForm({
                    container: $container.find('.form-container'),
                    title: 'Listado Items Variables',
                    editable: true,
                    // description: 'Culpa sunt deserunt adipisicing cillum ex et ex non amet nulla officia veniam ullamco proident.',
                    fields: spo.getViewFields(context.lists.ListadoItemVariable, 'Todos los elementos')
                });

                context.forms.dateForms = new EFWForms({
                    container: $container.find('.form2'),
                    title: '',
                    editable: true,
                    fields: [{ 
                        Id: generateUUID(),
                        Title: 'Campo fecha',
                        InternalName: 'CampoFecha',
                        TypeAsString: 'Text'
                    }]
                });

                context.forms.item.inputs['GP'].params.onChange = function(comp, input, state, values){
                    values ? '' : context.forms.item.inputs['Categoria'].setValue([]);
                    values ? context.forms.item.inputs['Categoria'].show() : context.forms.item.inputs['Categoria'].hide()
                }


                if (listItemId) {
                    context.forms.item.setValues(context.items.ListadoItemVariable);

                    $updateButton.removeClass('hide');

                } else {
                    $sendButton.removeClass('hide');
                    $clearButton.removeClass('hide');

                }
                console.log('context form', context)
                $sendButton.on('click', function (e) {
                    var dialogTitle = 'Nuevo elemento';

                    function save() {
                        var dialog = app.dialog.progress(dialogTitle);
                        var metadata = context.forms.item.getMetadata();
                        metadata.Activo = true;

                        spo.saveListItem(spo.getSiteUrl(), mths.getListTitle(), metadata, function (response) {
                            dialog.close();

                            app.dialog.create({
                                title: dialogTitle,
                                text: 'Creado con éxito',
                                buttons: [{
                                    text: 'Aceptar',
                                    onClick: function () {
                                        mainView.router.navigate('/liststream?title=ListadoItemVariable&listtitle=ListadoItemVariable&listview=Todos los elementos&panel=filter-close&template=list-row&context=');
                                        location.reload(true);
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

                    context.forms.item.checkFieldsRequired();
                    var validate =  context.forms.item.getValidation();

                    if (validate) {
                        app.dialog.create({
                            title: dialogTitle,
                            text: 'Se creará una nuevo registro.',
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

                $updateButton.on('click', function (e) {
                    var dialogTitle = 'Editando elemento';

                    function save() {
                        var dialog = app.dialog.progress(dialogTitle);
                        var metadata = context.forms.item.getMetadata();

                        spo.updateListItem(spo.getSiteUrl(), mths.getListTitle(), listItemId, metadata, function (response) {
                            dialog.close();

                            app.dialog.create({
                                title: dialogTitle,
                                text: 'Elemento actualizado con éxito',
                                buttons: [{
                                    text: 'Aceptar',
                                    onClick: function () {
                                        //mainView.router.navigate('/liststream?title=Periodos&listtitle=Periodo&listview=Todos los elementos&panel=filter-open&template=list-row&context=');
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
                    
                    context.forms.item.checkFieldsRequired();

                    var validate = context.forms.item.getValidation();

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
                    context.forms.item.setValues([]);
                });

                // remover loader
                mths.removePageLoader();
            }

            function getListInformation() {
                var loaded = {};

                context.lists = {};
                context.items = {};

                var shouldInitForms = function () {
                    if (loaded.ListadoItemVariable) {
                        initForm();
                    }
                };

                // Obtener información de lista
                spo.getListInfo('ListadoItemVariable',
                    function (response) {
                        console.log('Valor de mths.getListTitle()', mths.getListTitle());
                        context.items.ListadoItemVariable = [];
                        context.lists.ListadoItemVariable = response;
                        loaded.ListadoItemVariable = true;
                        
                        // Si existe el id de algún item a obtener
                        if (listItemId) {

                            var query = spo.encodeUrlListQuery(context.lists.ListadoItemVariable, {
                                view: 'Todos los elementos',
                                odata: {
                                    'filter': '(Id eq ' + listItemId + ')',
                                    'select': '*',
                                }
                            });

                            spo.getListItems(spo.getSiteUrl(), 'ListadoItemVariable', query,
                                function (response) {
                                    context.items.ListadoItemVariable = response.d.results.length > 0 ? response.d.results[0] : null;
                                    loaded.ListadoItemVariable = true;
                                    shouldInitForms();


                                },
                                function (response) {
                                    var responseText = JSON.parse(response.responseText);
                                    console.log(responseText.error.message.value);
                                }
                            );
                        } else {
                            loaded.ListadoItemVariable = true;
                            shouldInitForms();
                        }

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