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
                          '<div class="item-title">Datos del Trabajador</div>' +
                        '</div></a>' +
                      '<div class="accordion-item-content">' +
                        '<div class="form-persona"></div>' +
                      '</div>' +
                    '</li>' +
                    '<li class="accordion-item datos"><a href="#" class="item-content item-link">' +
                        '<div class="item-inner">' +
                          '<div class="item-title">Datos Item Variable</div>' +
                        '</div></a>' +
                      '<div class="accordion-item-content">' +
                      '<div class="form-item"></div>' +
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
    style:  '.form-container .ms-FormField {width: 45%; float:left} ',
    data: function () {
        var self = this;
        return {
            title: '',
            forms: {},
            tables: {},
            loader: {
                text: 'Espere un momento por favor',
                //image: './assets/img/logo_envision_min1.png'
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

                var current = null;
                // containers
                var $container = $(page.$el),
                    $navbar = $(page.navbarEl),
                    $sendButton = $navbar.find('.link.send'),
                    $generatePDFButton = $navbar.find('.link.generate-PDF'),
                    $clearButton = $navbar.find('.link.clear');

                // formulario de registro Datos persona
                context.forms.person = new EFWForm({
                    container: $container.find('.form-persona'),
                    title: '',
                    editable: false,
                    // description: 'Culpa sunt deserunt adipisicing cillum ex et ex non amet nulla officia veniam ullamco proident.',
                    fields: spo.getViewFields(context.lists.ItemVariable, 'FormularioPersona'),
                });
                context.forms.person.inputs['Nombre'].setEditable(true);

                // formulario de registro Item Variable
                context.forms.item = new EFWForm({
                    container: $container.find('.form-item'),
                    title: '',
                    editable: false,
                    // description: 'Culpa sunt deserunt adipisicing cillum ex et ex non amet nulla officia veniam ullamco proident.',
                    fields: spo.getViewFields(context.lists.ItemVariable, 'FormularioItem')
                });
                //Ocultar campos que son personalizados.
                context.forms.item.inputs['CantidadMonto'].hide();
                context.forms.item.inputs['Justificacion'].hide();

                //Establecer Valores de persona con el nombre
                context.forms.person.inputs['Nombre'].params.onChange = function(comp, input, state, values){
                    if(current != null){
                        return;
                    }
                    current = context.forms.item.inputs['Nombre'];
                    if (values.length == 0){
                        //Restaura los valores a vacio.
                        context.forms.person.inputs['Rut'].resetValue();
                        context.forms.person.inputs['CodigoPayroll'].resetValue();
                        context.forms.person.inputs['TipoContrato'].resetValue();
                        context.forms.person.inputs['Categoria'].resetValue();
                        context.forms.item.inputs['Haber'].resetValue();
                        context.forms.item.inputs['Haber_x003a_Codigo'].resetValue();
                        current = null;
                        return;
                    }

                    context.forms.person.inputs['CodigoPayroll'].setValue(values[0].item.Title);
                    context.forms.person.inputs['Rut'].setValue(values[0].item.Rut);
                    context.forms.person.inputs['TipoContrato'].setValue(values[0].item.TipoContrato);

                    var categoriaActual = context.items.Categorias.filter(function(x){
                        return x.ID == values[0].item.CategoriaId;
                    })[0];

                    context.forms.person.inputs['Categoria'].setValue([{key: values[0].item.CategoriaId, text: categoriaActual.Sigla}]);

                    context.forms.item.inputs['Haber'].setEditable(true);
                    context.forms.item.inputs['Haber_x003a_Codigo'].setEditable(true);
                    context.forms.item.inputs['CantidadMonto'].hide();
                    context.forms.item.inputs['Justificacion'].hide();
                    current = null;
                }

                //Establecer Valores de Item segun el nombre del haber
                context.forms.item.inputs['Haber'].params.onChange = function(comp, input, state, values){
                    if(current != null){
                        return;
                    }
                    current = context.forms.item.inputs['Haber'];

                    console.log('Values', values);
                    if (values.length == 0){
                        context.forms.item.inputs['Haber_x003a_Codigo'].resetValue();
                        context.forms.item.inputs['CantidadMonto'].hide();
                        context.forms.item.inputs['Justificacion'].hide();
                        current = null;
                        return;
                    }

                    context.forms.item.inputs['Haber_x003a_Codigo'].setValue([{key: values[0].item.Title, text: values[0].item.Title}])
                    context.forms.item.inputs['CantidadMonto'].setLabel(values[0].item.TipoIngreso == 'Cantidad' ? 'Cantidad' : 'Monto');
                    context.forms.item.inputs['CantidadMonto'].setEditable(true);
                    context.forms.item.inputs['Justificacion'].setEditable(true);

                    context.forms.item.inputs['CantidadMonto'].show();
                    context.forms.item.inputs['Justificacion'].show();
                    current = null;
                }

                context.forms.item.inputs['Haber_x003a_Codigo'].params.onChange = function(comp, input, state, values){
                    if(current != null){
                        return;
                    }
                    console.log('Values', values);
                    current = context.forms.item.inputs['Haber_x003a_Codigo'];
                    if (values.length == 0){
                        context.forms.item.inputs['Haber'].resetValue();
                        context.forms.item.inputs['CantidadMonto'].hide();
                        context.forms.item.inputs['Justificacion'].hide();
                        current = null;
                        return;
                    }

                    context.forms.item.inputs['Haber'].setValue([{key: values[0].item.ID, text: values[0].item.NombreItem}])
                    context.forms.item.inputs['CantidadMonto'].setLabel(values[0].item.TipoIngreso == 'Cantidad' ? 'Cantidad' : 'Monto');
                    context.forms.item.inputs['CantidadMonto'].setEditable(true);
                    context.forms.item.inputs['Justificacion'].setEditable(true);

                    context.forms.item.inputs['CantidadMonto'].show();
                    context.forms.item.inputs['Justificacion'].show();
                    current = null;
                }
                    
                $sendButton.removeClass('hide');
                $clearButton.removeClass('hide');

                $sendButton.on('click', function (e) {
                    var dialogTitle = 'Nuevo Item';

                    function save() {
                        var dialog = app.dialog.progress(dialogTitle);
                        var metadataItem = context.forms.item.getMetadata();
                        var metadataPerson = context.forms.person.getMetadata();

                        var myJSON = JSON.stringify(metadataPerson);

                        myJSON = myJSON.replace('}',JSON.stringify(metadataItem).replace('{',','));
                        var metadata = JSON.parse(myJSON);

                        spo.saveListItem(spo.getSiteUrl(), 'ItemVariable', metadata, function (response) {
                            var formularioId = response.d.Id;
                            dialog.close();

                            app.dialog.create({
                                title: dialogTitle,
                                text: 'Item creado con éxito',
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

                    context.forms.person.checkFieldsRequired();
                    context.forms.item.checkFieldsRequired();
                    
                    var validatePerson =  context.forms.person.getValidation();
                    var validateItem =  context.forms.item.getValidation();

                    if(context.forms.item.inputs['Justificacion'].value.length< 10){
                        app.dialog.create({
                            title: 'Datos mal ingresados',
                            text: 'La justificación debe tener un largo de al menos 10 caracteres.',
                            buttons: [{
                                text: 'Aceptar'
                            }],
                            verticalButtons: false
                        }).open();
                    }else if (validateItem && validatePerson) {
                        app.dialog.create({
                            title: dialogTitle,
                            text: 'Se creará una nuevo item.',
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
                            text: 'Para crear un nuevo item debe completar todos los campos obligatorios.',
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
                });

                // remover loader
                mths.removePageLoader();
            }

            function getListInformation() {
                var loaded = {};

                context.lists = {};
                context.items = {};

                var shouldInitForms = function () {
                    if (loaded.ItemVariable && loaded.Categorias && loaded.ListadoItemVariable) {
                        console.log('Context', context);
                        initForm();
                    }
                };

                // Obtener información de lista
                spo.getListInfo('ItemVariable',
                    function (response) {
                        context.items.ItemVariable = [];
                        context.lists.ItemVariable = response;
                        //loaded.listaItemVariable = true;
                        
                        // Si existe el id de algún item a obtener
                        if (listItemId) {

                            var query = spo.encodeUrlListQuery(context.lists.ItemVariable, {
                                view: 'Todos los elementos',
                                odata: {
                                    'filter': '(Id eq ' + listItemId + ')',
                                    'select': '*,AttachmentFiles',
                                    'expand': 'AttachmentFiles'
                                }
                            });

                            spo.getListItems(spo.getSiteUrl(), 'ItemVariable', query,
                                function (response) {
                                    context.items.ItemVariable = response.d.results.length > 0 ? response.d.results : null;
                                    loaded.ItemVariable = true;
                                    shouldInitForms();


                                },
                                function (response) {
                                    var responseText = JSON.parse(response.responseText);
                                    console.log(responseText.error.message.value);
                                }
                            );
                        } else {
                            loaded.ItemVariable = true;
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
                                    'select': '*'
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