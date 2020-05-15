var CargaMasivaCCPage = {
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
                    title: 'Carga Masiva de Centros de costo',
                    editable: true,
                    // description: 'Culpa sunt deserunt adipisicing cillum ex et ex non amet nulla officia veniam ullamco proident.',
                    fields: spo.getViewFields(context.lists.Excel, 'Todos los elementos')
                });

                $sendButton.removeClass('hide');
                $sendButton.on('click', function (e) {
                    var dialogTitle = 'Nueva carga masiva de cargos';
                    file = $container.find('.attachmentInput')[0]

                    //Convierte la fecha excel a fecha
                    function numeroAFecha(numeroDeDias, esExcel = true) {
                        var diasDesde1900 = esExcel ? 25567 + 1 : 25567;
                      
                        // 86400 es el número de segundos en un día, luego multiplicamos por 1000 para obtener milisegundos.
                        return new Date((numeroDeDias - diasDesde1900) * 86400 * 1000);
                    }
                    //Limpia un String permitiendo solo los char seleccionados
                    function limpiarString(string){
                        let allow = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ1234567890"
                        let salida = "";

                        for(var i = 0; i < string.length; i++){
                            if(allow.includes(string.charAt(i))){
                                salida += string.charAt(i);
                            }
                        }

                        return salida;
                    }

                    function callServiceCargaMasivaPlanta(body){
                        let url = 'https://prod-56.westus.logic.azure.com:443/workflows/15d2c973b072414fb67e56128b783d1e/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=O0C6bRAdZlpIuIWunwD1xSL21d72QCgPjcWH3nN9Uns';
                        fetch(url, {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(body)
                        })
                        .then(function(response) {
                            if (response.status >= 300) {
                                    app.dialog.create({
                                        title: 'Error al Iniciar Proceso',
                                        text: 'Error al iniciar proceso de Carga Masiva (Flow)',
                                        buttons: [{
                                            text: 'Aceptar'
                                        }],
                                        verticalButtons: false
                                    }).open();
                                
                            }
                        });
                    }

                    function prepareToSend(data){
                        return {
                            "codigoRG": data["Código payroll clase 2 / rg"] ? data["Código payroll clase 2 / rg"] : '',
                            "codigoRP": data["Codigo payroll Clase 1 /rp"] ? data["Codigo payroll Clase 1 /rp"] : '',
                            "CC": data["CC"],
                            "UB": data["UB"],
                            "CDR": data["CDR"],
                            "D_CC": data["D_CC"],
                            "Nivel_Org_1": data["Nivel_Org_1"],
                            "Nivel_Org_2": data["Nivel_Org_2"],
                            "Nivel_Org_3": data["Nivel_Org_3"],
                            "Area_UN": data["Area_UN"],
                            "D_UB": data["D_UB"],
                            "Region": data["Region"],
                            "Zona": data["Zona"],
                            "TipoDotacion": data["TipoDotacion"],
                            "GC": data["GC"]
                        }
                    }

                    function save() {
                        var dialog = app.dialog.progress(dialogTitle);

                        files = file.files
                        handleExcelFromInput(files, 
                            function(response){
                                console.log('Data', response)
                                console.log('Centros de costo', context.items.CC)

                                var data = [];

                                response[0].map(function(item){
                                    if(context.items.CC){
                                        var CentroCosto = context.items.CC.filter(CC => CC.CodigoCC+'' == item.CC+'')[0];
                                        if(!CentroCosto){
                                            data.push(prepareToSend(item));
                                        }
                                    }else{
                                        data.push(prepareToSend(item));
                                    }
                                })

                                console.log('Data', JSON.stringify(data));


                                callServiceCargaMasivaPlanta(data);

                                dialog.close();
                                app.dialog.create({
                                    title: 'Initializated',
                                    text: 'Acaba de iniciar la vaina, te avisara al correo, se agregaron '+data.length+' Centros de costo.',
                                    buttons: [{
                                        text: 'Aceptar'
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
                    }//Fin save()

                    save();
                });

                // remover loader
                mths.removePageLoader();
                

            }

            function getListInformation() {
                var loaded = {};

                context.lists = {};
                context.items = {};

                var shouldInitForms = function () {
                    if (loaded.lista && loaded.CC) {
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
                spo.getListInfo('CentroCosto',
                    function (response) {
                        context.items.CC = [];
                        context.lists.CC = response;
                        //loaded.listaItemVariable = true;
                        
                        // Si existe el id de algún item a obtener

                            var query = spo.encodeUrlListQuery(context.lists.CC, {
                                view: 'Todos los elementos',
                                odata: {
                                    'select': '*',
                                    'top': 5000
                                }
                            });

                            spo.getListItems(spo.getSiteUrl(), 'CentroCosto', query,
                                function (response) {
                                    context.items.CC = response.d.results.length > 0 ? response.d.results : null;
                                    loaded.CC = true;
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