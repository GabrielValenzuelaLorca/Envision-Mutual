var ItemVariablePage = {
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
                '<div class="form-container main"></div>' +
                '<div class="list accordion-list">' +
                    '<ul>'+
                        '<li class="accordion-item accordion-item-opened categoria hide"><a href="#" class="item-content item-link">'+
                            '<div class="item-inner">'+
                                '<div class="item-title">Categorias permitidas</div>'+
                            '</div></a>'+
                            '<div class="accordion-item-content">'+
                                '<div class="form-container form1"></div>'+
                            '</div>'+
                        '</li>'+
                        '<li class="accordion-item accordion-item-opened minmax hide"><a href="#" class="item-content item-link">'+
                            '<div class="item-inner">'+
                                '<div class="item-title">Valores minimos y maximos</div>'+
                            '</div></a>'+
                        '<div class="accordion-item-content">'+
                            '<div class="form-container form2"></div>'+
                        '</div>'+
                        '</li>'+
                        '<li class="accordion-item accordion-item-opened fechas hide"><a href="#" class="item-content item-link">'+
                            '<div class="item-inner">'+
                            '<div class="item-title">Fechas Excepcionales</div>'+
                            '</div></a>'+
                        '<div class="accordion-item-content">'+
                            '<div class="form-container table-compact-row form3">'+
                            '</div>'+
                        '</div>'+
                        '</li>'+
                    '</ul>'+
                '</div>'+
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
                listItemId = page.route.query.listItemId,
                editable = page.route.query.editable

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


                //prepare custom inputs
                var inputs = spo.getViewFields(context.lists.ListadoItems, 'Vista general')

                //Se genera el nuevo elemento y se agrega al arreglo de items
                inputs.push({
                    Id: generateUUID(),
                    Title: '¿Requiere aplicar para fechas especiales?',
                    InternalName: 'FechasEspeciales',
                    TypeAsString: 'Boolean'
                },{
                    Id: generateUUID(),
                    Title: '¿Tiene valores minimos y maximos?',
                    InternalName: 'MinMax',
                    TypeAsString: 'Boolean'
                });

                // formulario de datos generales
                context.forms.main = new EFWForm({
                    container: $container.find('.main'),
                    title: 'Formulario item Variable',
                    editable: editable ? true : false,
                    // description: 'Culpa sunt deserunt adipisicing cillum ex et ex non amet nulla officia veniam ullamco proident.',
                    fields: inputs,
                });

                //Formulario de categorias custom
                context.forms.categoria = new EFWForm({
                    container: $container.find('.form1'),
                    title: '',
                    editable: editable ? true : false,
                    // description: 'Culpa sunt deserunt adipisicing cillum ex et ex non amet nulla officia veniam ullamco proident.',
                    fields: spo.getViewFields(context.lists.ListadoItems, 'Categoria'),
                });

                //Formulario de minimo y maximo
                context.forms.MinMax = new EFWForm({
                    container: $container.find('.form2'),
                    title: '',
                    editable: editable ? true : false,
                    // description: 'Culpa sunt deserunt adipisicing cillum ex et ex non amet nulla officia veniam ullamco proident.',
                    fields: spo.getViewFields(context.lists.ListadoItems, 'MinimoMaximo'),
                });

                let data = [];

                listasharepoint.map(function(x){
                    data.push({
                        key: x.nombrehaber,
                        text: x.haber,
                        item: x
                    })
                })

                //Formulario Fechas excepcionales
                var inputs2 = [{
                    Id: generateUUID(),
                    Title: 'Día',
                    InternalName: 'Day',
                    TypeAsString: 'Choice',
                    Choices: data
                },{
                    Id: generateUUID(),
                    Title: 'Mes',
                    InternalName: 'Month',
                    TypeAsString: 'Choice',
                    Choices: [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]

                }]

                context.forms.fechas = new EFWForms({
                    container: $container.find('.form3'),
                    title: '',
                    editable: editable ? true : false,
                    disable: editable ? true : false,
                    // description: 'Culpa sunt deserunt adipisicing cillum ex et ex non amet nulla officia veniam ullamco proident.',
                    fields: inputs2,
                });

                if (listItemId) {
                    context.forms.main.setValues(context.items.ListadoItems);

                    if(context.items.ListadoItems.GP){
                        context.forms.categoria.setValues(context.items.ListadoItems);
                        $('.accordion-item.categoria').removeClass('hide')
                        if(editable){
                            $('.accordion-item.categoria').removeClass('accordion-item-opened')
                        }
                    }
                    if(context.items.ListadoItems.Maximo && context.items.ListadoItems.Minimo){
                        context.forms.main.inputs.MinMax.setValue(true);
                        context.forms.MinMax.setValues(context.items.ListadoItems);
                        $('.accordion-item.minmax').removeClass('hide')
                        if(editable){
                            $('.accordion-item.minmax').removeClass('accordion-item-opened')
                        }
                    }
                    if(context.items.ListadoItems.FechasExcepcionales){
                        context.forms.main.inputs.FechasEspeciales.setValue(true);

                        let fechas = context.items.ListadoItems.FechasExcepcionales.split(',')

                        data = [];

                        
                        fechas.map(function(x){
                            let d = x.split('/');
                            data.push({
                                Day: d[0],
                                Month: d[1]
                            });
                        })
                        console.log('Data', data);
                        context.forms.fechas.setValues(data);

                        $('.accordion-item.fechas').removeClass('hide')
                        if(editable){
                            $('.accordion-item.fechas').removeClass('accordion-item-opened')                            
                        }
                        if(!editable){
                            $('.table-compact-row .ms-EnvisionSerializeForm-row:nth-of-type(1) .ms-Form-header').addClass('hide');
                            $('.ms-EnvisionSerializeForm-wrapper .ms-Form-header').addClass('hide');
                        }
                    }

                    if(editable){
                        $updateButton.removeClass('hide');
                    }
                }

                context.forms.main.inputs.GP.params.onChange = function (self, input, state, value) {
                    if(value){
                        $('.accordion-item.categoria').removeClass('hide');
                    }else{
                        $('.accordion-item.categoria').addClass('hide');
                        context.forms.categoria.setValues([]);
                    }
                }

                context.forms.main.inputs.MinMax.params.onChange = function (self, input, state, value) {
                    if(value){
                        $('.accordion-item.minmax').removeClass('hide');
                    }else{
                        $('.accordion-item.minmax').addClass('hide');
                        context.forms.MinMax.setValues([]);
                    }
                }

                context.forms.main.inputs.FechasEspeciales.params.onChange = function (self, input, state, value) {
                    if(value){
                        $('.accordion-item.fechas').removeClass('hide');
                    }else{
                        $('.accordion-item.fechas').addClass('hide');
                        context.forms.fechas.setValues([]);
                    }
                }

                $updateButton.on('click', function (e){
                    var dialogTitle = 'Editando elemento';

                    function save() {
                        var dialog = app.dialog.progress(dialogTitle);

                        var metadata = context.forms.main.getMetadata(),
                        categoria = context.forms.categoria.getMetadata(),
                        MinMax = context.forms.MinMax.getMetadata(),
                        fechas = context.forms.fechas.getMetadata();

                        if(metadata.GP){
                            //Concatenamos el metadata de categorias
                            metadata['CategoriaId'] = categoria.CategoriaId;
                        }
                        if(metadata.MinMax){
                            //Concatenamos minmax
                            metadata['Minimo'] = MinMax.Minimo;
                            metadata['Maximo'] = MinMax.Maximo;
                        }
                        if(metadata.FechasEspeciales){
                            //Concatenamos fechas especiales
                            var valor = "";

                            for(var i = 0; i< fechas.length; i++){
                                if(i == (fechas.length-1)){
                                    valor+= fechas[i].Day+'/'+fechas[i].Month+'/2000';
                                }else{
                                    valor+= fechas[i].Day+'/'+fechas[i].Month+'/2000,';
                                }
                            }
                            metadata['FechasExcepcionales'] = valor;
                        }

                        delete metadata['FechasEspeciales'];
                        delete metadata['MinMax'];

                        spo.updateListItem(spo.getSiteUrl(), 'ListadoItemVariable', listItemId, metadata, function (response) {
                            dialog.close();

                            app.dialog.create({
                                title: dialogTitle,
                                text: 'Elemento actualizado con éxito',
                                buttons: [{
                                    text: 'Aceptar',
                                    onClick: function () {
                                        mainView.router.navigate('/liststream?title=Mantenedor%20Items%20Variables&listtitle=ListadoItemVariable&listview=Todos%20los%20elementos&template=list-row&panel=filter-close');
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
                });


                $clearButton.on('click', function (e){
                    context.forms.main.setValues([]);
                    context.forms.categoria.setValues([]);
                    context.forms.MinMax.setValues([]);
                    context.forms.fechas.setValues([]);
                });

                // remover loader
                mths.removePageLoader();
            }

            function getListInformation() {
                var loaded = {};

                context.lists = {};
                context.items = {};

                var shouldInitForms = function () {
                    if (loaded.ListadoItems) {
                        initForm();
                    }
                };

                // Obtener información de lista
                spo.getListInfo(mths.getListTitle(),
                    function (response) {
                        context.items.ListadoItems = [];
                        context.lists.ListadoItems = response;
                        
                        // Si existe el id de algún item a obtener
                        if (listItemId) {

                            var query = spo.encodeUrlListQuery(context.lists.ListadoItems, {
                                view: 'Todos los elementos',
                                odata: {
                                    'filter': '(Id eq ' + listItemId + ')',
                                    'select': '*,AttachmentFiles',
                                    'expand': 'AttachmentFiles'
                                }
                            });

                            spo.getListItems(spo.getSiteUrl(), mths.getListTitle(), query,
                                function (response) {
                                    context.items.ListadoItems = response.d.results.length > 0 ? response.d.results[0] : null;
                                    loaded.ListadoItems = true;
                                    shouldInitForms();


                                },
                                function (response) {
                                    var responseText = JSON.parse(response.responseText);
                                    console.log(responseText.error.message.value);
                                }
                            );
                        } else {
                            loaded.Periodo = true;
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