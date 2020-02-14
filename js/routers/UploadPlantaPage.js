var uploadPlantaPage = {
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
                '<div class="container" />' +
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
                // image: './assets/img/logo_envision_min1.png'
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

                // formulario de registro
                context.forms.item = new EFWForm({
                    container: $container.find('.form-container'),
                    title: 'Carga de Planta',
                    editable: listItemId ? false : true,
                    // description: 'Culpa sunt deserunt adipisicing cillum ex et ex non amet nulla officia veniam ullamco proident.',
                    fields: spo.getViewFields(context.lists.Excel, 'Todos los elementos')
                });

                $sendButton.removeClass('hide');
                $sendButton.on('click', function (e) {
                    var dialogTitle = 'Nueva carga de planta';
                    file = $container.find('.attachmentInput')[0]

                    //Convierte la fecha excel a fecha
                    function numeroAFecha(numeroDeDias, esExcel = true) {
                        var diasDesde1900 = esExcel ? 25567 + 1 : 25567;
                      
                        // 86400 es el número de segundos en un día, luego multiplicamos por 1000 para obtener milisegundos.
                        return new Date((numeroDeDias - diasDesde1900) * 86400 * 1000);
                      }
                      
                      var fecha = numeroAFecha(16218, true);
                      console.log(fecha);

                    function save() {
                        var dialog = app.dialog.progress(dialogTitle);

                        files = file.files
                        handleExcelFromInput(files, 
                            function(response){

                                response[0].map(function(x){
                                    x.fecha_nac = numeroAFecha(x.fecha_nac);
                                    x.fecha_ing = numeroAFecha(x.fecha_ing);
                                    x.fecha_ret = numeroAFecha(x.fecha_ret);
                                });

                                response[1] = [{'Email': spo.getCurrentUser()['EMail']}];
                                
                                fetch('https://prod-100.westus.logic.azure.com:443/workflows/f4f1efc2b0904335bdb56c045a116877/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=FzbpRC4_RIFJLIQkMJsarz3gVubRgyXSvOROor4B2lA', {
                                    method: 'POST',
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(response)
                                })
                                .then(function(response) {
                                    if (response.status === 401) {
                                        app.dialog.create({
                                            title: 'Error al Iniciar Proceso',
                                            text: 'Error al iniciar proceso de Carga Masiva (Flow)',
                                            buttons: [{
                                                text: 'Aceptar'
                                            }],
                                            verticalButtons: false
                                        }).open();
                                    }
                                })

                                dialog.close();

                                app.dialog.create({
                                    title: dialogTitle,
                                    text: 'Iniciando proceso de carga masiva de planta.',
                                    buttons: [{
                                        text: 'Aceptar',
                                        onClick: function () {
                                            mainView.router.navigate('/liststream?title=Planta&listtitle=Planta&listview=Todos los elementos&panel=filter-open&template=list-row&context=');
                                        }
                                    }],
                                    verticalButtons: false
                                }).open();
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

                        let metadata = context.items.globalState.filter(function(x){
                            return x.Title == 'ActualizandoPlanta'
                        });
                        
                        var formTemp = new EFWForm({
                            container: $container.find('.container'),
                            title: '',
                            editable: false,
                            // description: 'Culpa sunt deserunt adipisicing cillum ex et ex non amet nulla officia veniam ullamco proident.',
                            fields: spo.getViewFields(context.lists.globalState, 'Todos los elementos')
                        });
                        formTemp.hide();
                        
                        formTemp.inputs['LinkTitle'].setValue(metadata[0]['Title']);
                        formTemp.inputs['Value'].setValue([{key: 'SI', text: 'SI'}]);
    
                            spo.updateListItem(spo.getSiteUrl(), 'EstadosGlobales', 1, formTemp.getMetadata(), function (response) {    
                            }, function (response) {
                                var responseText = JSON.parse(response.responseText);
    
                                dialog.close();
                                app.dialog.create({
                                    title: 'Error al guardar en lista EstadoGlobal',
                                    text: responseText.error.message.value,
                                    buttons: [{
                                        text: 'Aceptar'
                                    }],
                                    verticalButtons: false
                                }).open();
                            });

                    }//Fin save()

                    switch(file.files.length) {
                        case 1:
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
                            break;
                        case 0:
                            app.dialog.create({
                                title: 'No ha adjuntado ningún documento',
                                text: 'Para hacer una actualización de planta, debe adjuntar un documento Excel con la información de la planta actual',
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

                // remover loader
                mths.removePageLoader();
                

            }

            function getListInformation() {
                var loaded = {};

                context.lists = {};
                context.items = {};

                var shouldInitForms = function () {
                    if (loaded.lista && loaded.globalState) {
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

                // Obtener información de lista
                spo.getListInfo('EstadosGlobales',
                function (response) {
                    context.items.globalState = [];
                    context.lists.globalState = response;
                    //loaded.listaItemVariable = true;
                    
                    // Si existe el id de algún item a obtener

                        var query = spo.encodeUrlListQuery(context.lists.globalState, {
                            view: 'Todos los elementos',
                            odata: {
                                'select': '*',
                                'top': 5000
                            }
                        });

                        spo.getListItems(spo.getSiteUrl(), 'EstadosGlobales', query,
                            function (response) {
                                context.items.globalState = response.d.results.length > 0 ? response.d.results : null;
                                loaded.globalState = true;
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