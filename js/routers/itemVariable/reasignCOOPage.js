var reasignCooPage = {
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
                            '<span class="ios-only">Traspasar Coordinación</span>' +
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
                            '<span class="ios-only">Descargar Excel</span>' +
                        '</a>' +
                        '<a href="#" class="link download-pdf ms-fadeIn100 hide">' +
                            '<i class="ms-Icon ms-Icon--PDF"></i>' +
                            '<span class="ios-only">Descargar PDF</span>' +
                        '</a>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="page-content">' +
                `
                
                <div class="block">
                <div class="ms-Form-Title" style="padding: 8px 12px; font-size: 20px; font-weight: 200;">Traspaso de coordinación</div>
                    <div class="row">
                        <div class="col-50">
                            <div class="card">
                                <div class="card-header">Coordinador a reemplazar</div>
                                <div class="card-content">
                                    <div class="form1"></div>
                                    <div class="items origen"></div>
                                    <div class="trabajadores origen"></div>
                                </div>
                            </div>
                        </div>
                        <div class="col-50">
                            <div class="card">
                                <div class="card-header">Coordinador de reemplazo</div>
                                <div class="card-content">
                                    <div class="form2"></div>
                                    <div class="items destino"></div>
                                    <div class="trabajadores destino"></div>
                                </div>
                            </div>
                        </div>
                </div>`+
            '</div>' +
            
            '<div class="content-loader">' +
                '<div class="content-loader-inner">' +
                    '<div class="image-logo lazy lazy-fadein" data-background="{{loader.image}}"></div>' +
                    '<div class="loading-message">{{loader.text}}</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '',
    style:  '.block {margin: 10px !important;}',
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
                origin = page.route.query.origin,
                reem = page.route.query.reem

            context.methods = mths;

            // definir entra de valores de página
            mths._getPage = function () {
                return page;
            };

            mths._getPageContext = function () {
                return context;
            };

            function initForm() {

                function getCurrentData(coo, side){

                    var origen = context.forms.Original.getMetadata();
                    var destino = context.forms.Reemplazo.getMetadata();

                    console.log('Origen', destino)

                    function setData(NTrabajadores, NItems){

                        var htmlListItems  = ` <li class="list-group-title">`+'Items Asociados'+` <span class="badge color-green">${NItems}</span></li>`;

                        if(coo.Haberes.results.length > 0){
                            coo.Haberes.results.map(function(x){
                                htmlListItems +=  `
                                    <li>
                                        <div class="item-content">
                                            <div class="item-inner">
                                                <div class="item-title">${x.NombreItem}</div>
                                            </div>
                                        </div>
                                    </li>`
                            })
                        }else{
                            htmlListItems +=  `
                                    <li>
                                        <div class="item-content">
                                            <div class="item-inner">
                                                <div class="item-title">No tiene items asignados</div>
                                            </div>
                                        </div>
                                    </li>`
                        }

                        var htmlListTrabajadores = ` <li class="list-group-title">`+'Trabajadores asociados'+` <span class="badge color-green">${NTrabajadores}</span></li>`;

                        if(context.items.trabajadoresOrigen){
                            context.items.trabajadoresOrigen.map(function(x){
                                htmlListTrabajadores +=  `
                                    <li>
                                        <div class="item-content">
                                            <div class="item-inner">
                                                <div class="item-title">`+x.Rut+' - '+x.ApellidoPaterno+' '+x.ApellidoMaterno+' '+x.Nombre+`</div>
                                            </div>
                                        </div>
                                    </li>`
                            });
                        }else{
                            htmlListTrabajadores +=  `
                                    <li>
                                        <div class="item-content">
                                            <div class="item-inner">
                                                <div class="item-title">No tiene trabajadores asignados</div>
                                            </div>
                                        </div>
                                    </li>`
                        }

                        //Set HTML to card
                        $container.find(".trabajadores."+side).html(
                            `<div class="list" style="max-height: 30vh;overflow-y: auto;">
                                <div class="list-group">
                                    <ul>
                                        `+htmlListTrabajadores+`
                                    </ul>
                                </div>
                            </div>`)
                        //Set HTML to card
                        $container.find(".items."+side).html(
                            `<div class="list" style="max-height: 30vh;overflow-y: auto;">
                                <div class="list-group">
                                    <ul>
                                        `+htmlListItems+`
                                    </ul>
                                </div>
                            </div>`)

                        if(side == 'origen'){
                            dialogLeft.close()
                            console.log('Cerro el Izquierdo')
                        }else if(side == 'destino'){
                            dialogRight.close();
                            console.log('Cerro el Derecho')
                        }
                    }

                    function getInfo(){
                        loaded = {};
                        function shouldStart(){
                            if(loaded.trabajadores && loaded.items){
                                let trabajadores = context.items.trabajadoresOrigen ? context.items.trabajadoresOrigen.length : [].length;
                                let items = coo.Haberes.results.length;
                                setData(trabajadores, items);
                            }
                        }
                        //Obtengo los trabajadores del coordinador
                        spo.getListInfo('Planta',
                            function (response) {
                                var query = spo.encodeUrlListQuery(response, {
                                    view: 'Todos los elementos',
                                    odata: {
                                        'filter': '(CoordinadorId eq ' + coo.ID + ')',
                                        'top': 5000
                                    }
                                });
                                spo.getListItems(spo.getSiteUrl(), "Planta", query,
                                    function (response) {
                                        context.items.trabajadoresOrigen = response.d.results.length > 0 ? response.d.results : null;

                                        if(response.d.results.length > 0 && side == 'origen'){
                                            context.OrigenTrabajadores = response.d.results
                                        }

                                        loaded.trabajadores = true;
                                        shouldStart();
                                    },
                                    function (response) {
                                        var responseText = JSON.parse(response.responseText);
                                        console.log(responseText.error.message.value);
                                    }
                                );
                            },
                            function(response){
                                var responseText = JSON.parse(response.responseText);
                                console.log(responseText.error.message.value);
                            }
                        );
                        //Obtengo los items del trabajador
                        spo.getListInfo('ListadoItemVariable',
                            function (response) {
                                var query = spo.encodeUrlListQuery(response, {
                                    view: 'Todos los elementos',
                                    odata: {
                                        'select' : '*',
                                        'top': 5000
                                    }
                                });
                                spo.getListItems(spo.getSiteUrl(), "ListadoItemVariable", query,
                                    function (response) {
                                        context.items.itemsOrigen = response.d.results.length > 0 ? response.d.results : null;
                                        loaded.items = true;
                                        shouldStart();
                                    },
                                    function (response) {
                                        var responseText = JSON.parse(response.responseText);
                                        console.log(responseText.error.message.value);
                                    }
                                );
                            },
                            function(response){
                                var responseText = JSON.parse(response.responseText);
                                console.log(responseText.error.message.value);
                            }
                        );
                    }

                    if(coo){
                        getInfo();
                    }else{
                        $container.find(".trabajadores."+side).html(`<div></div>`)
                        $container.find(".items."+side).html(`<div></div>`)
                    }
                    
                }

                // containers
                var $container = $(page.$el),
                    $navbar = $(page.navbarEl),
                    $send = $navbar.find('.link.send');

                $send.removeClass('hide');

                var dialog;
                var dialogLeft;
                var dialogRight;

                var opc = [];
                if(context.items.Coordinadores){
                    opc = context.items.Coordinadores.map(function(x){
                        return x.ApellidoPaterno+' '+x.ApellidoMaterno+' '+x.Nombre
                    });
                }

                //Se genera el nuevo elemento y se agrega al arreglo de items
                var inputs1 = [{
                    Id: generateUUID(),
                    Title: 'Coordinador a reemplazar',
                    InternalName: 'Origen',
                    TypeAsString: 'Choice',
                    Required: true,
                    Choices: opc
                }]
                var inputs2 = [{
                    Id: generateUUID(),
                    Title: 'Coordinador de remplazo',
                    InternalName: 'Reemplazo',
                    TypeAsString: 'Choice',
                    Required: true,
                    Choices: opc
                }];

                // Se renderiza el form de datos con el array.
                context.forms.Original = new EFWForm({
                    container: $container.find('.form1'),
                    title: '',
                    editable: true,
                    fields: inputs1
                });

                context.forms.Reemplazo = new EFWForm({
                    container: $container.find('.form2'),
                    title: '',
                    editable: true,
                    fields: inputs2
                });

                context.forms.Original.inputs['Origen'].params.onChange = function(comp, input, state, values){
                    if(values.length > 0){
                        dialogLeft = app.dialog.progress('Obteniendo datos...');
                        var selected = context.items.Coordinadores.filter(x => x.ApellidoPaterno+' '+x.ApellidoMaterno+' '+x.Nombre == values[0].key)[0];
                        getCurrentData(selected, 'origen')
                    }else{
                        getCurrentData(null, 'origen')
                    }
                }

                context.forms.Reemplazo.inputs['Reemplazo'].params.onChange = function(comp, input, state, values){
                    if(values.length > 0){
                        dialogRight = app.dialog.progress('Obteniendo datos...');
                        var selected = context.items.Coordinadores.filter(x => x.ApellidoPaterno+' '+x.ApellidoMaterno+' '+x.Nombre == values[0].key)[0];
                        getCurrentData(selected, 'destino')
                    }else{
                        getCurrentData(null, 'destino')
                    }
                }

                $send.on('click', function (e) {
                    var saved = {};

                    var saveTrabajadores = () => {
                        return new Promise((resolve, reject)=>{
                            var metadata = context.forms.Reemplazo.getMetadata();
                            var nuevoCoordinador = context.items.Coordinadores.filter(x => x.ApellidoPaterno+' '+x.ApellidoMaterno+' '+x.Nombre == metadata.Reemplazo)[0];
                            if(context.OrigenTrabajadores){
                                var trabajadores = context.OrigenTrabajadores.map(function(x){
                                    return {
                                        Id: x.ID,
                                        ID: x.ID,
                                        CoordinadorId: nuevoCoordinador.ID
                                    }
                                })
    
                                console.log('Array Trabajadores', trabajadores)
                                
                                spo.updateListItems(spo.getSiteUrl(), 'Planta', trabajadores, function (response) {
                                    resolve(true)
                                }, function (response) {
                                    var responseText = JSON.parse(response.responseText);
                                    reject({
                                        title: 'Error al guardar en lista Planta',
                                        msg: responseText.error.message.value
                                    })
                                });
                            }else{
                                resolve(true)
                            }
                        } )

                    }

                    var saveItems = () => {
                        return new Promise((resolve, reject) => {
                            var selectedOriginal = context.forms.Original.getMetadata();
                            var selectedReemplazo = context.forms.Reemplazo.getMetadata();

                            var Original = context.items.Coordinadores.filter(x => x.ApellidoPaterno + ' ' + x.ApellidoMaterno + ' ' + x.Nombre == selectedOriginal.Origen)[0];
                            var Reemplazante = context.items.Coordinadores.filter(x => x.ApellidoPaterno + ' ' + x.ApellidoMaterno + ' ' + x.Nombre == selectedReemplazo.Reemplazo)[0];

                            if (Original.HaberesId.results.length > 0) {

                                var agregar = [];

                                Original.HaberesId.results.map(function (x) {
                                    if (!Reemplazante.HaberesId.results.includes(x)) {
                                        agregar.push(x)
                                    }
                                });

                                var metadataOriginal = {};
                                metadataOriginal.HaberesId = {};
                                metadataOriginal.HaberesId.results = [];

                                spo.updateListItem(spo.getSiteUrl(), 'Planta', Original.ID, metadataOriginal, function (response) {
                                    if (Reemplazante.Haberes.results.length > 0) {
                                        agregar.map(function (x) {
                                            Reemplazante.HaberesId.results.push(x)
                                        })
                                    } else {
                                        Reemplazante.HaberesId.results = agregar
                                    }

                                    var save = {};
                                    save.HaberesId = {};
                                    save.HaberesId.results = Reemplazante.HaberesId.results

                                    spo.updateListItem(spo.getSiteUrl(), 'Planta', Reemplazante.ID, save, function (response) {
                                        resolve(true)
                                    }, function (response) {
                                        var responseText = JSON.parse(response.responseText);
                                        reject({
                                            title: 'Error al guardar en lista Planta',
                                            msg: responseText.error.message.value
                                        })
                                    });
                                }, function (response) {
                                    var responseText = JSON.parse(response.responseText);
                                    reject({
                                        title: 'Error al guardar en lista Planta',
                                        msg: responseText.error.message.value
                                    })
                                });
                            } else {
                                //El original no tenia haberes
                                resolve(true)
                            }
                        })


                    }

                    context.forms.Original.checkFieldsRequired();
                    context.forms.Reemplazo.checkFieldsRequired();
                    var validateO = context.forms.Original.getValidation();
                    var validateR = context.forms.Reemplazo.getValidation();

                    if(validateO && validateR){
                        let original = context.forms.Original.getMetadata();
                        let reemplazo = context.forms.Reemplazo.getMetadata();
                        if(original.Origen == reemplazo.Reemplazo){
                            app.dialog.create({
                                title: 'Error',
                                text: 'El coordinador reemplazante y de reemplazo deben ser diferentes.',
                                buttons: [{
                                    text: 'Aceptar'
                                }],
                                verticalButtons: false
                            }).open();
                        }else{
                            dialog = app.dialog.progress('Realizando cambios...');
                            saveTrabajadores().then(c =>{
                                return saveItems()
                            }).then(c =>{
                                dialog.close();
                                app.dialog.create({
                                    title: 'Realizado',
                                    text: 'Transferencia de coordinacion finalizada',
                                    buttons: [{
                                        text: 'Aceptar',
                                        onClick: function () {
                                            mainView.router.refreshPage();
                                        }
                                        
                                    }],
                                    verticalButtons: false
                                }).open();
                            })
                            .catch(error =>{
                                dialog.close();
                                app.dialog.create({
                                    title: error.title,
                                    text: error.msg,
                                    buttons: [{
                                        text: 'Aceptar',
                                    }],
                                    verticalButtons: false
                                }).open();
                                
                            })
                        }
                    }else{
                        app.dialog.create({
                            title: 'Datos insuficientes',
                            text: 'Para realizar la transferencia de coordinacion es necesario seleccionar 2 coordinadores.',
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
                    if (loaded.Coordinadores) {
                        initForm();
                    }
                };

                // Obtener información de lista
                spo.getListInfo('Planta',
                    function (response) {
                        context.items.Coordinadores = [];
                        context.lists.Planta = response;

                            var query = spo.encodeUrlListQuery(context.lists.Planta, {
                                view: 'Todos los elementos',
                                odata: {
                                    'filter': '(Rol eq \'Coordinador\')',
                                    'orderby': 'ApellidoPaterno asc'
                                }
                            });

                            spo.getListItems(spo.getSiteUrl(), 'Planta', query,
                                function (response) {
                                    context.items.Coordinadores = response.d.results.length > 0 ? response.d.results : null;
                                    loaded.Coordinadores = true;
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