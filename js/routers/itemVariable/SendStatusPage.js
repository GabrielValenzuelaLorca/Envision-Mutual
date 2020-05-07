var sendStatusPage = {
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
                        '<a href="#" class="link informeFinalDownload ms-fadeIn100 hide">' +
                            '<i class="ms-Icon ms-Icon--ExcelLogo"></i>' +
                            '<span class="ios-only">Descargar Excel Periodo</span>' +
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
                            '<i class="ms-Icon ms-Icon--Mail"></i>' +
                            '<span class="ios-only">Notificar no enviados </span>' +
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
                '<div class="error-container" />' +
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
                    $sendEmail = $navbar.find('.send');
                    $downloadExcel = $navbar.find('.link.informeFinalDownload');
                    $sendEmail.removeClass('hide');

                if (context.items.Periodo){
                    $downloadExcel.removeClass('hide');
                }

                context.forms.sendStatus = new EFWListTable({
                    container: $container.find('.error-container'),
                    title: 'Estado de Envio por coordinador',
                    editable: false,
                    description: '',
                    sortable: false,
                    editable: false,
                    disabled: true,
                    formCssClass: 'tablaCoordinadores',
                    emptyTableText: 'No se encuenta ningun envio para el periodo vigente.',
                    fields: [{ 
                        Id: generateUUID(),
                        Title: 'Nombre Coordinador',
                        InternalName: 'Coordinador',
                        TypeAsString: 'Text'
                    },
                    { 
                        Id: generateUUID(),
                        Title: 'Correo',
                        InternalName: 'Correo',
                        TypeAsString: 'Text'
                    },
                    { 
                        Id: generateUUID(),
                        Title: 'Jefe Aprobador',
                        InternalName: 'Jefe',
                        TypeAsString: 'Text'
                    },
                    { 
                        Id: generateUUID(),
                        Title: 'Estado de envio',
                        InternalName: 'Status',
                        TypeAsString: 'Text'
                    },
                    { 
                        Id: generateUUID(),
                        Title: 'Fecha Última actualización',
                        InternalName: 'FUA',
                        TypeAsString: 'Text'
                    }],
                    noItemsSelectedButtons: function(table){return []},
                    oneItemSelectedButtons: function(table, item){
                        let btn = [];
                        if (item.Status != "No enviado"){
                            btn.push(localButtons.toOpenInforme(item));
                        }
                        if (item.Status == "Aprobado") {
                            btn.push(localButtons.disableItemSendedAdmin(context, item));
                        }
                        return btn;
                    },
                    multiItemsSelectedButtons: function(table, item){return []}

                });

                var data = [];

                if(!context.items.InformeHaberes){
                    context.items.Coordinador.map(function(x){
                        data.push({
                            "Coordinador": x.NombreCompleto,
                            "Correo": x.Email,
                            "Jefe": x.Aprobador.NombreCompleto,
                            "Status": 'No enviado',
                            "FUA": moment(new Date()).format("DD/MM/YYYY hh:mm:ss")
                        });
                    });
                    context.forms.sendStatus.setValues(data);
                    return;
                }else{
                    context.items.Coordinador.map(function(x){
                        let coo = context.items.InformeHaberes.filter(i => i.CoordinadorId == x.ID)[0];
                        let apr = context.items.Aprobador.filter(a => a.ID == x.AprobadorId)[0];
                        if(coo){
                            data.push({
                                "Coordinador": x.NombreCompleto,
                                "Correo": x.Email,
                                "Jefe": apr.NombreCompleto ? apr.NombreCompleto : 'No posee Aprobador',
                                "Status": coo.Estado,
                                "FUA": moment(coo.Modified).format("DD/MM/YYYY hh:mm:ss"),
                                "ID": coo.ID
                            });
                        }else{
                            data.unshift({
                                "Coordinador": x.NombreCompleto,
                                "Correo": x.Email,
                                "Jefe": x.Aprobador.NombreCompleto,
                                "Status": 'No enviado',
                                "FUA": moment(new Date()).format("DD/MM/YYYY hh:mm:ss")
                            });
                        }
                    });
                    context.forms.sendStatus.setValues(data);
                }

                $downloadExcel.on('click', function(e){
                    var dialogTitle = 'Descargando informe';
                    console.log('Iniciando Descarga');
                    function download() {
                        spo.getListItems(spo.getSiteUrl(), 'ListadoItemVariable', "?$select=*&$top=5000",
                            function (response) {
                                let infoExcelGeneral = {}
                                let infoExcelPrivado = {}
                                var aprobados = [];
                                if(context.items.InformeHaberes){
                                    aprobados = context.items.InformeHaberes.filter(function (informe) {
                                        return informe.Estado == "Aprobado"
                                    });
                                }

                                aprobados.forEach(informe => {
                                    let haberes = JSON.parse(informe.Haberes).d.results;
                                    haberes.forEach(haber => {
                                        if (haber.Nombre.ClaseVal == "Clase Rol General"){
                                            if (!(haber.CodigoPayroll in infoExcelGeneral)){
                                                infoExcelGeneral[haber.CodigoPayroll] = {}
                                            } 
                                            if (!(haber.Haber.Title in infoExcelGeneral[haber.CodigoPayroll])){
                                                infoExcelGeneral[haber.CodigoPayroll][haber.Haber.Title] = []
                                            } 
                                            infoExcelGeneral[haber.CodigoPayroll][haber.Haber.Title].push(
                                                {
                                                    Cantidad: haber.CantidadMonto,
                                                    CC: haber.CentroCosto.IdRG
                                                }
                                            )
                                        } else if (haber.Nombre.ClaseVal == "Clase Rol Privado"){
                                            if (!(haber.CodigoPayroll in infoExcelPrivado)){
                                                infoExcelPrivado[haber.CodigoPayroll] = {}
                                            } 
                                            if (!(haber.Haber.Title in infoExcelPrivado[haber.CodigoPayroll])){
                                                infoExcelPrivado[haber.CodigoPayroll][haber.Haber.Title] = []
                                            } 
                                            infoExcelPrivado[haber.CodigoPayroll][haber.Haber.Title].push(
                                                {
                                                    Cantidad: haber.CantidadMonto,
                                                    CC: haber.CentroCosto.IdRP
                                                }
                                            )
                                        }
                                    })
                                });

                                let itemsI = ["Código Colaborador"]
                                let itemPos = {}
                                         
                                let headersTitulos = [
                                    "Atención Médica Abierta",
                                    "Bono Dias Especiales 1.5UF",
                                    "Bono Por Llamadas",
                                    "Asig. Variable Perdida Caja",
                                    "Horas Extras 50% Sobrecar ****",
                                    "Horas Extras 50%  R.Vacac****",
                                    "Horas Extras 50%  Rr.Licme****",
                                    "Horas Extras 50%  R.Permi*****",
                                    "Horas Extras 50%  Tllamad*****",
                                    "Horas Extras 50%  Pendien*****",
                                    "Compensac Horas Festivos",   
                                    "Horas Bonificadas",
                                    "Horas Extras 100%",   
                                    "Hrs Reemp. Medico (Extra)",
                                    "Hrs Reemp. Medico (Sueld)",	    
                                    "Almuerzo - Cena",            
                                    "Once-Desayuno",           
                                    "Bono por Evento Hasta 4hrs",
                                    "Bono Por Eventos hasta 7hrs",	    
                                    "Bono Por Eventos hasta 12hrs",    
                                    "Bono Pernoctar",
                                    "Horas Pasivas",    
                                    "Valor Hora Clase",
                                    "Bono Aseo",
                                    "Asignacion Investigacion PRP",
                                    "Bono Incentivo Minero",
                                    "Extension Turno Llamada",
                                    "Horas Pasivas Permanencia",
                                    "Bono Asistencia Cuatrimestral",
                                    "Bono Cumplimiento de Meta",
                                    "Bono Dias Especiales 2UF",    
                                    "Turno de Llamada", 
                                    "Colacion",      
                                    "Bonifición Especial",
                                    "Comisiones",
                                    "Comision Decreto 67",
                                    "Horas Extras 100% Pabellon",
                                    "Diferencia Horas Pasivas",
                                    "Diferencia Hrs. Bonificadas", 
                                    "Diferencia Hrs. Extras",
                                    "Dif. Horas Pasivas Permanencia",
                                    "Referidos",
                                ];  

                                var posicionFija = response.d.results.filter(c => c.Posicion != null).sort(function(a,b){return a.Posicion - b.Posicion})
                                var posicionNuevos = response.d.results.filter(c => c.Posicion == null).sort(function(a,b){return a.ID - b.ID})

                                for (let i = 0; i < posicionFija.length; i++) {
                                    const element = posicionFija[i];
                                    itemsI.push(`((`+element.Title+`)) `+headersTitulos[i+1])
                                    itemsI.push(`Centro de costo (`+element.Title+`)`)
                                    itemPos[element.Title] = ((i*2)+1)
                                }
                                for (let i = 0; i < posicionNuevos.length; i++) {
                                    const element = posicionNuevos[i];
                                    itemsI.push(`((`+element.Title+`)) `+element.NombreItem)
                                    itemsI.push(`Centro de costo (`+element.Title+`)`)
                                    itemPos[element.Title] = ((i*2)+1)
                                }


                                let headersItems = [itemsI];     
                                let headersPos = itemPos  
                                
                                let sheetItemsG = headersItems;
                                let sheetItemsP = headersItems;

                                // Excel para general
                                // Crear Book y sheets
                                var wbGeneral = XLSX.utils.book_new();

                                // // Se extrae la informacion
                                let periodoNameG = "Informe_General_Periodo_"+ context.items.Periodo.MesCalculado+"_"+context.items.Periodo.AnioCalculado;

                                for (persona in infoExcelGeneral){
                                    let forDelete = [];
                                    let first = true;
                                    while (Object.keys(infoExcelGeneral[persona]).length > 0){
                                        let line = [headersItems[0].map(function(){return ""})]
                                        if (first){
                                            line[0][0] = persona;
                                            first = false;
                                        }
                                        for (haber in infoExcelGeneral[persona]){
                                            let imput = infoExcelGeneral[persona][haber].pop()
                                            line[0][headersPos[haber]] = imput.Cantidad
                                            line[0][headersPos[haber]+1] = imput.CC
                                            if (infoExcelGeneral[persona][haber].length == 0){
                                                forDelete.push(haber)
                                            }
                                        }
                                        forDelete.forEach(function(name){
                                            delete infoExcelGeneral[persona][name]
                                        })
                                        sheetItemsG = sheetItemsG.concat(line)
                                    }
                                }

                                // Se crea la hoja
                                let wsG = XLSX.utils.aoa_to_sheet(sheetItemsG);

                                // Se crea la primera hoja
                                XLSX.utils.book_append_sheet(wbGeneral, wsG, "Hoja1");

                                XLSX.writeFile(wbGeneral, periodoNameG +'.xlsx');

                                // Excel para privado
                                // Crear Book y sheets
                                var wbPrivado = XLSX.utils.book_new();

                                // // Se extrae la informacion
                                let periodoNameP = "Informe_Privado_Periodo_"+ context.items.Periodo.MesCalculado+"_"+context.items.Periodo.AnioCalculado;

                                for (persona in infoExcelPrivado){
                                    let forDelete = [];
                                    let first = true;
                                    while (Object.keys(infoExcelPrivado[persona]).length > 0){
                                        let line = [headersItems[0].map(function(){return ""})]
                                        if (first){
                                            line[0][0] = persona;
                                            first = false;
                                        }
                                        for (haber in infoExcelPrivado[persona]){
                                            let imput = infoExcelPrivado[persona][haber].pop()
                                            line[0][headersPos[haber]] = imput.Cantidad
                                            line[0][headersPos[haber]+1] = imput.CC
                                            if (infoExcelPrivado[persona][haber].length == 0){
                                                forDelete.push(haber)
                                            }
                                        }
                                        forDelete.forEach(function(name){
                                            delete infoExcelPrivado[persona][name]
                                        })
                                        sheetItemsP = sheetItemsP.concat(line)
                                    }
                                }

                                // Se crea la hoja
                                let wsP = XLSX.utils.aoa_to_sheet(sheetItemsP);

                                // Se crea la primera hoja
                                XLSX.utils.book_append_sheet(wbPrivado, wsP, "Hoja1");

                                XLSX.writeFile(wbPrivado, periodoNameP +'.xlsx');
                            },
                            function (response) {
                                var responseText = JSON.parse(response.responseText);
                                console.log(responseText.error.message.value);
                            }
                        );
 
                    }

                    app.dialog.create({
                        title: dialogTitle,
                        text: 'Se descargará un documento Excel con la información de todos los informes',
                        buttons: [{
                            text: 'Aceptar',
                            onClick: function () {
                                download()
                            }
                        }],
                        verticalButtons: false
                    }).open();
                });


                $sendEmail.on('click', function (e) {
                    let data = context.forms.sendStatus.values.filter( item => item.Status == "No enviado" || item.Status == "Desaprobado");

                    if(data.length == 0){
                        app.dialog.create({
                            title: 'Error al notificar a coordinadores',
                            text: 'No se encontraron coordinadores sin envio de items',
                            buttons: [{
                                text: 'OK'
                            }],
                            verticalButtons: false
                        }).open();
                    }else{
                        fetch(global.uris[global.env].status, {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(data)
                        })
                        .then(function(response) {
                            if (response.status >= 300) {
                                app.dialog.create({
                                    title: 'Error al Iniciar Proceso',
                                    text: 'Error al enviar los emails (Flow)',
                                    buttons: [{
                                        text: 'Aceptar'
                                    }],
                                    verticalButtons: false
                                }).open();
                            }else{
                                app.dialog.create({
                                    title: 'Notificación enviada exitosamente',
                                    text: 'Se han enviado notificaciones a '+data.length+' coordinadores.',
                                    buttons: [{
                                        text: 'Aceptar'
                                    }],
                                    verticalButtons: false
                                }).open();
                            }
                        });                        
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
                    if (loaded.Coordinador && loaded.InformeHaberes && loaded.Periodo && loaded.Aprobador) {
                        initForm();
                    }
                };

                // Obtener información de la planta asociada al coordinador
                spo.getListInfo('Planta',
                    function (response) {
                        context.items.Coordinador = [];
                        context.lists.Coordinador = response;                        

                        var query = spo.encodeUrlListQuery(context.lists.Coordinador, {
                            view: 'Todos los elementos',
                            odata: {
                                'select': '*',
                                'filter': '(Rol eq \'Coordinador\')',
                                'top': 5000,
                            }
                        });

                        spo.getListItems(spo.getSiteUrl(), 'Planta', query,
                            function (response) {
                                context.items.Coordinador = response.d.results.length > 0 ? response.d.results : null;
                                loaded.Coordinador = true;
                                shouldInitForms()
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

                //Obtener información de la planta asociada al coordinador
                spo.getListInfo('Planta',
                    function (response) {
                        context.items.Aprobador = [];
                        context.lists.Aprobador = response;                        

                        var query = spo.encodeUrlListQuery(context.lists.Aprobador, {
                            view: 'Todos los elementos',
                            odata: {
                                'select': '*',
                                'filter': '(Rol eq \'Aprobador\')',
                                'top': 5000,
                            }
                        });

                        spo.getListItems(spo.getSiteUrl(), 'Planta', query,
                            function (response) {
                                context.items.Aprobador = response.d.results.length > 0 ? response.d.results : null;
                                loaded.Aprobador = true;
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

                //Obtengo el periodo actual para imputar
                spo.getListInfo('Periodo',
                 function (response) {
                    context.items.Periodo = [];
                    context.lists.Periodo = response;
                    //loaded.listaItemVariable = true;

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
                                
                                //Obtenemos todos los informes del periodo
                                spo.getListInfo('Informe Haberes',
                                    function (response) {
                                        context.items.InformeHaberes = [];
                                        context.lists.InformeHaberes = response;                        
                
                                        var query = spo.encodeUrlListQuery(context.lists.InformeHaberes, {
                                            view: 'Todos los elementos',
                                            odata: {
                                                'filter': 'PeriodoId eq '+context.items.Periodo.ID,
                                                'select': '*',
                                                'top': 5000,
                                            }
                                        });
                
                                        spo.getListItems(spo.getSiteUrl(), 'Informe Haberes', query,
                                            function (response) {
                                                context.items.InformeHaberes = response.d.results.length > 0 ? response.d.results : null;
                                                loaded.InformeHaberes = true;
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