var informePage = {
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
                        '<a href="#" class="link download-excel ms-fadeIn100 hide">' +
                            '<i class="ms-Icon ms-Icon--ExcelLogo"></i>' +
                            '<span class="ios-only">Descargar Informe</span>' +
                        '</a>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="page-content">' +
                '<div class="form-container"></div>' +
                '<div class="sent-haberes-container"></div>' +
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
            return 'Informe Haberes';
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
                viewName = "";

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
                    $dowloadButton = $navbar.find('.link.download-excel');

                // formulario de registro
                let form = {
                    container: $container.find('.form-container'),
                    title: mths.getListTitle(),
                    editable: false,
                }
                if (admin == "Coordinador"){
                    form.fields = spo.getViewFields(context.lists.Informe, "Informe Coord Page");
                } else if (admin == "Administrador"){
                    form.fields = spo.getViewFields(context.lists.Informe, "Informe Admin Page");
                }
                context.forms.item = new EFWForm(form);

                let tableForm = {
                    // listFields: spo.getViewFields(context.lists.Item, "Nombre vista"),
                    container: $container.find('.sent-haberes-container'),
                    title: 'Haberes',
                    editable: false,
                    items: JSON.parse(context.items.Informe.Haberes).d.results,
                    disabled: true
                }
                if (admin == "Coordinador"){
                    tableForm.listFields = spo.getViewFields(context.lists.Item, "Coordinador");
                } else if (admin == "Administrador"){
                    tableForm.listFields = spo.getViewFields(context.lists.Item, "Administrador");
                }
                context.forms.haberes = new EFWListTable(tableForm);

                if (listItemId) {
                    context.forms.item.setValues(context.items.Informe);
                    $dowloadButton.removeClass('hide');
                } 

                $dowloadButton.on('click', function (e) {
                    var dialogTitle = 'Descargando informe';
                    function coorSave() {
                        var dialog = app.dialog;
                            
                        let haberes = JSON.parse(context.items.Informe.Haberes);
                        let periodoName = "Periodo_"+context.items.Informe.Periodo.MesCalculado+"_"+context.items.Informe.Periodo.AnioCalculado;
                        let arrayHaberes = haberes.d.results.map(function(haber){
                            return {
                                "Item Variable": haber.Haber.NombreItem,
                                "Cantidad/Monto": haber.CantidadMonto,
                                "Nombre": haber.Nombre.NombreCompleto,
                                "Rut": haber.Rut,
                                "Contrato": haber.TipoContrato,
                                "Centro Costo": "Por Defecto",
                                "Justificación":haber.Justificacion
                            };
                        });
                        let colSizes = [[{"width":50},{"width":15},{"width":30},{"width":10},{"width":10},{"width":15},{"width":100}]];

                        // Bookname como el periodo
                        generateXLSX(["Items Variables"], periodoName, [arrayHaberes], false, colSizes,  
                            function(response){
                                dialog.close()
                                dialogs.infoDialog(
                                    dialogTitle,
                                    'Su informe se ha descargado exitosamente',
                                );
                            },
                            function(response){
                                var responseText = JSON.parse(response.Error);
                                console.log('responseText', responseText);

                                dialog.close();
                                dialogs.infoDialog(
                                    'Error al descargar el archivo',
                                    responseText
                                );
                            });
                    }
                    function adminSave(){
                        var dialogTitle = 'Descargando informe';
                        var dialog = app.dialog;

                        // Crear Book y sheets
                        var wb = XLSX.utils.book_new();
                        
                        let headersItems = [["COD_PAYROLL","RUT","ITEM VARIABLE","CANT_$MONTO","NOMBRE","CONTRATO","CARGO","CCOSTO","OBSERVACIÓN/JUSTIFICACIÓN"]]

                        // Se extrae la informacion
                        let haberes = JSON.parse(context.items.Informe.Haberes);
                        let periodoName = "Coordinador_"+context.items.Informe.Coordinador.Title+"_"
                        periodoName+="Periodo_"+context.items.Informe.Periodo.MesCalculado+"_"+context.items.Informe.Periodo.AnioCalculado;
                        let arrayHaberes = haberes.d.results.map(function(haber){
                            return [
                                haber.Haber.Title,
                                haber.Rut,
                                haber.Haber.NombreItem,
                                haber.CantidadMonto,
                                haber.Nombre.NombreCompleto,
                                haber.TipoContrato,
                                haber.Nombre.cargo,
                                haber.CentroCosto.CodigoCC,
                                haber.Justificacion
                            ];
                        });

                        // Se crea la hoja
                        let ws = XLSX.utils.aoa_to_sheet(headersItems.concat(arrayHaberes));
                        
                        // Se asigna tamaño a las columnas
                        let colSize = [{"width":13},{"width":10},{"width":35},{"width":14},{"width":35},{"width":15},{"width":20},{"width":8},{"width":100}];
                        ws["!cols"] = colSize;

                        // Se crea la primera hoja
                        XLSX.utils.book_append_sheet(wb, ws, "Items Variables");
                        let coorData = [
                            ["Información del Coordinador"],
                            ["Nombre del coordinador", context.items.Coord.Title],
                            ["Codigo payroll", context.items.Coord.Planta.Title],
                            ["Centro costo", context.items.Coord.CentroCosto.CodigoCC],
                            ["Jefe Aprobador", context.items.Coord.Aprobador.Nombre],
                            ["Correo Jefe Aprobador", context.items.Coord.Aprobador.Title],
                            ["Fecha de envío de informe",moment(context.items.Informe.Created).format("DD/MM/YYYY hh:mm")],
                            ["Fecha de aprobación",moment(context.items.Informe.FechaAprobacion).format("DD/MM/YYYY hh:mm")],
                            ["Número de items", context.items.Informe.Cantidad.toString()],
                        ]

                        ws = XLSX.utils.aoa_to_sheet(coorData);
                        colSize = [{"width":25},{"width":30}];
                        ws["!cols"] = colSize;
                        XLSX.utils.book_append_sheet(wb, ws, "Información Coordinador");

                        XLSX.writeFile(wb, periodoName +'.xlsx');
                        
                        dialog.close()
                        dialogs.infoDialog(
                            dialogTitle,
                            'Su informe se ha descargado exitosamente',
                        );
                        
                    }
                    if (admin=="Coordinador"){
                        dialogs.confirmDialog(
                            dialogTitle,
                            'Se descargará un documento Excel con la información en pantalla',
                            coorSave
                        )
                    } else if (admin=="Administrador"){
                        dialogs.confirmDialog(
                            dialogTitle,
                            'Se descargará un documento Excel con la información en pantalla',
                            adminSave
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
                    if (loaded.listaItem && loaded.listaCoord && loaded.Coord) {
                        initForm();
                    }
                };

                // Obtener información de lista
                spo.getListInfo(mths.getListTitle(),
                    function (response) {
                        context.items.Informe = [];
                        context.lists.Informe = response;
                        
                        // Si existe el id de algún item a obtener
                        if (listItemId) {

                            var query = spo.encodeUrlListQuery(context.lists.Informe, {
                                view: 'Todos los elementos',
                                odata: {
                                    'filter': '(Id eq ' + listItemId + ')'
                                }
                            });

                            spo.getListItems(spo.getSiteUrl(), mths.getListTitle(), query,
                                function (response) {
                                    context.items.Informe = response.d.results.length > 0 ? response.d.results[0] : null;
                                    spo.getListInfo("Coordinador",
                                        function (response) {
                                            context.items.Coord = [];
                                            context.lists.Coord = response;
                                            loaded.listaCoord = true;

                                            var query = spo.encodeUrlListQuery(context.lists.Coord, {
                                                view: 'Todos los elementos',
                                                odata: {
                                                    'filter': '(Id eq ' + context.items.Informe.CoordinadorId + ')'
                                                }
                                            });

                                            spo.getListItems(spo.getSiteUrl(), "Coordinador", query,
                                                function (response) {
                                                    context.items.Coord = response.d.results.length > 0 ? response.d.results[0] : null;
                                                    loaded.Coord = true;
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
                                }
                            );
                        } else {
                            loaded.Informe = true;
                            shouldInitForms();
                        }

                    },
                    function (response) {
                        var responseText = JSON.parse(response.responseText);
                        console.log(responseText.error.message.value);
                    }
                );

                spo.getListInfo("ItemVariable",
                    function (response) {
                        context.lists.Item = response;
                        loaded.listaItem = true;
                        shouldInitForms();
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