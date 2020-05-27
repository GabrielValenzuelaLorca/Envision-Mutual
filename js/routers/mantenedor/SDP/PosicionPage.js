var posicionPage = {
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
                        '<a href="#" class="link create ms-fadeIn100 hide">' +
                            '<i class="ms-Icon ms-Icon--Add"></i>' +
                            '<span class="ios-only">Crear posición</span>' +
                        '</a>' +
                        '<a href="#" class="link gestion ms-fadeIn100 hide">' +
                            '<i class="ms-Icon ms-Icon--Add"></i>' +
                            '<span class="ios-only">Gestionar posición</span>' +
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
                '<div class="form table-compact-row"></div>' +
                '<div class="form2 table-compact-row"></div>' +
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
            return 'Posicion';
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
                gestion = page.route.query.gestion,
                type = page.route.query.type,
                UO = page.route.query.UO;

            var currentID = null;

            context.methods = mths;

            // definir entra de valores de página
            mths._getPage = function () {
                return page;
            };

            mths._getPageContext = function () {
                return context;
            };

            mths.generateID = function () {
                //Generar posicion cuando es nueva
                if(!listItemId){
                    //Generar ID desde cero
                    if(context.forms.posicion.getRowCount() > 1 && currentID){
                        let current = parseInt(currentID);
                        currentID = current+1+""
                    }else{
                        var ultima = context.items.Ultima ? parseInt(context.items.Ultima.NPosicion) : 0;
                        currentID = context.items.Ultima ? ultima+1+"" : "1";
                    }
                    return;
                }
            };

            function initForm() {

                // containers
                var $container = $(page.$el),
                    $navbar = $(page.navbarEl),
                    $createButton = !gestion ? $navbar.find('.link.create') : $navbar.find('.link.gestion') ,
                    $updateButton = $navbar.find('.link.update'),
                    $clearButton = $navbar.find('.link.clear');

                // formulario de registro
                context.forms.posicion = new EFWForms({
                    container: $container.find('.form'),
                    title: listItemId ? 'Edición de posiciones' : 'Formulario de posición',
                    editable: true,
                    fields: spo.getViewFields(context.lists.Posicion, 'Form'),
                    onAddRow: function(EFWForm, UUID, item){

                        //Generamos el ID Segun sea el caso
                        if(gestion && UO){
                            if(context.items.SolicitudSDP.Posicion){
                                EFWForm.setValues(context.items.SolicitudSDP.Posicion)
                            }else{
                                mths.generateID();
                                EFWForm.inputs.NPosicion.setValue(currentID);
                            }
                            // EFWForm.inputs.NPosicion.setValue();
                        }else{
                            mths.generateID();
                            EFWForm.inputs.NPosicion.setValue(currentID);
                        }
                        EFWForm.inputs.NPosicion.setEditable(false)

                        //Autocomplete data to gestionar

                        EFWForm.inputs.CentroCosto.params.onChange = function(comp, input, state, values){

                            if (values.length == 0){
                                EFWForm.inputs.CentroCosto_x003a_Area_UN.resetValue();
                                EFWForm.inputs.CentroCosto_x003a_Nivel_Org_1.resetValue();
                                EFWForm.inputs.CentroCosto_x003a_UB.resetValue();
                                EFWForm.inputs.CentroCosto_x003a_D_UB.resetValue();
                                return;
                            }

                            let CentroCosto = values[0].item;
                            EFWForm.inputs.CentroCosto_x003a_Area_UN.setValue([{key: CentroCosto.ID, text: CentroCosto.Area_UN}])
                            EFWForm.inputs.CentroCosto_x003a_Nivel_Org_1.setValue([{key: CentroCosto.ID, text: CentroCosto.Nivel_Org_1}])
                            EFWForm.inputs.CentroCosto_x003a_UB.setValue([{key: CentroCosto.ID, text: CentroCosto.UB}])
                            EFWForm.inputs.CentroCosto_x003a_D_UB.setValue([{key: CentroCosto.ID, text: CentroCosto.D_UB}])
                        }

                        if(gestion){
                            var solicitud = context.items.SolicitudSDP;
                            //Centro de costo y valores por defecto
                            EFWForm.inputs.CentroCosto.setValue([{key: solicitud.CentroCosto.ID, text: solicitud.CentroCosto.D_CC, item: solicitud.CentroCosto}])

                            if(solicitud.AumentoPresupuesto == "Aumento presupuesto"){
                                //Activar aumento presupuesto
                                EFWForm.inputs.ExtraPresupuesto.setValue(true);
                            }
                            //Nombre del cargo seleccionado
                            if(!solicitud.otroCargo){
                                EFWForm.inputs.Cargo.setValue([{key: solicitud.NombreCargoSolicitadoId, text:solicitud.NombreCargoSolicitado.NombreCargo }])
                            }else{
                                //Mostrar que solicito otro cargo
                                EFWForm.inputs.Cargo.setValue([{key: 0, text: solicitud.NombreNewCargo}])
                            }
                            //Fecha expiracion proyecto recuperable
                            if(solicitud.NombreProyecto){
                                EFWForm.inputs.FechaExpiracion.setValue(solicitud.CPRFechaHasta)
                            }
                        }

                        EFWForm.inputs.CentroCosto.params.beforeRenderSuggestions = function (items) {
                            return items.filter(x=> x.activo == true)
                        }

                        EFWForm.inputs.CentroCosto_x003a_Area_UN.setEditable(false);
                        EFWForm.inputs.CentroCosto_x003a_Nivel_Org_1.setEditable(false);
                        EFWForm.inputs.CentroCosto_x003a_UB.setEditable(false);
                        EFWForm.inputs.CentroCosto_x003a_D_UB.setEditable(false);                        
                    }
                });

                if(context.items.SolicitudSDP){
                    if(context.items.SolicitudSDP.Posicion && type == "Vacante" && UO){
                        console.log('Posicion Original', context.items.SolicitudSDP.Posicion)
                        context.forms.posicionOriginal = new EFWForms({
                            container: $container.find('.form2'),
                            title: 'Datos previos de la posicion',
                            disabled: true,
                            fields: spo.getViewFields(context.lists.Posicion, 'Form'),
                        });
    
                        context.forms.posicionOriginal.setValues([context.items.SolicitudSDP.Posicion]);
                        $('.ms-FormField.is-disabled.not-editable div div.ms-BooleanField-fieldGroup label.toggle').addClass('hide')
                    }
                }

                if (listItemId) {
                    context.forms.posicion.setValues(context.items.Posicion);                    
                    $updateButton.removeClass('hide');
                    $('.ms-Button.ms-Button--primary').addClass('hide');
                    $('.ms-Button.ms-Button--remove').addClass('hide');
                } else {
                    $createButton.removeClass('hide');
                    
                    if(gestion){
                        for(let i = 0; i < context.items.SolicitudSDP.PersonasAContratar; i++){
                            context.forms.posicion.addRow()
                        }
                        $('.ms-Button.ms-Button--primary').addClass('hide');
                        $('.ms-Button.ms-Button--remove').addClass('hide');
                    }else{
                        context.forms.posicion.addRow()
                        $clearButton.removeClass('hide');
                    }
                }

                $createButton.on('click', function (e) {
                    var dialogTitle = 'Nueva Posición';

                    function save() {
                        var dialog = app.dialog.progress(dialogTitle);

                        if(gestion && type == "Vacante" && UO){
                            var metadata = context.forms.posicion.getMetadata();
                            var metadataOriginal = context.forms.posicionOriginal.getMetadata();

                            metadata.forEach(item =>{
                                if(item.Presupuestada === false){
                                    item['Estado'] = "Validación Jefe CyE"
                                }
                                metadata.CambioTemporal = JSON.stringify(JSON.stringify(metadataOriginal));
                                metadata.SolicitudSDP = gestion;
                            });

                            spo.updateListItems(spo.getSiteUrl(), 'Posicion', metadata, function (response) {

                                console.log('REsponse', response)
                                var ids = response.map(x=>{
                                    return x.d.ID
                                });

                                spo.updateListItem(spo.getSiteUrl(), 'SolicitudSDP', gestion, ids, function (response) {

                                    dialog.close();
                                    app.dialog.create({
                                        title: dialogTitle,
                                        text: 'La posicion creada con exito.',
                                        buttons: [{
                                            text: 'Aceptar',
                                            onClick: function () {
                                                mainView.router.navigate('/PosicionStream');
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
                            //Guardar en temporal
                        }else{

                            var metadatas = context.forms.posicion.getMetadata();
                            //Buscar Presupuestados false y setearles el Estado "Validación Jefe CyE"
                            metadatas.forEach(item =>{
                                if(item.Presupuestada === false){
                                    item['Estado'] = "Validación Jefe CyE"
                                }
                                item.SolicitudSDPId = gestion;
                            })
                            //Crea la posicion nueva en estado en revision
                            spo.saveListItems(spo.getSiteUrl(), mths.getListTitle(), metadatas, function (response) {
                                console.log('REsponse', response)
                                var ids = {};
                                ids.Posicion0Id = {};
                                ids.Posicion0Id.results = response.map(x=>{
                                    return x.d.ID
                                });

                                console.log('ids', ids)

                                spo.updateListItem(spo.getSiteUrl(), 'SolicitudSDP', gestion, ids, function (response) {

                                    dialog.close();
                                    app.dialog.create({
                                        title: dialogTitle,
                                        text: 'La posicion creada con exito.',
                                        buttons: [{
                                            text: 'Aceptar',
                                            onClick: function () {
                                                mainView.router.navigate('/PosicionStream');
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
                    }

                    context.forms.posicion.checkFieldsRequired();
                    var validate =  context.forms.posicion.getValidation();

                    if (validate) {
                        app.dialog.create({
                            title: dialogTitle,
                            text: 'Se creará una nueva posición.',
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
                            text: 'Para crear una nueva posición debe completar todos los campos obligatorios.',
                            buttons: [{
                                text: 'Aceptar'
                            }],
                            verticalButtons: false
                        }).open();
                    }

                });

                $updateButton.on('click', function (e) {
                    var dialogTitle = 'Editando posición';

                    function save() {
                        var dialog = app.dialog.progress(dialogTitle);
                        let metadata = context.forms.posicion.getMetadata();
                        
                        //Buscar Presupuestados false y setearles el Estado "Validación Jefe CyE"
                        metadata.forEach(item =>{
                            if(item.Presupuestada === false){
                                item['Estado'] = "Validación Jefe CyE"
                            }
                        })

                        spo.updateListItems(spo.getSiteUrl(), mths.getListTitle(), metadata, function (response) {
                            dialog.close();

                            app.dialog.create({
                                title: dialogTitle,
                                text: 'Posición actualizada con éxito',
                                buttons: [{
                                    text: 'Aceptar',
                                    onClick: function () {
                                        mainView.router.navigate('/PosicionStream');
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
                    
                    context.forms.posicion.checkFieldsRequired();

                    var validate = context.forms.posicion.getValidation();

                    if (validate) {
                        app.dialog.create({
                            title: dialogTitle,
                            text: 'Se actualizará la posición.',
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
                            text: 'Para actualizar la posición debe completar todos los campos obligatorios.',
                            buttons: [{
                                text: 'Aceptar'
                            }],
                            verticalButtons: false
                        }).open();
                    }

                });

                $clearButton.on('click', function (e){
                    context.forms.posicion.setValues([]);
                });

                // remover loader
                mths.removePageLoader();
            }

            function getListInformation() {
                var loaded = {};

                context.lists = {};
                context.items = {};

                var shouldInitForms = function () {
                    if (loaded.Posicion && loaded.SolicitudSDP && loaded.Reemplazo) {
                        initForm();
                    }
                };


                if(!listItemId && !gestion && !UO){
                    //Mostrar solo la info para el form y la ultoma posicion para generar el ID
                    spo.getListInfo('Posicion',
                        function (response) {
                            context.lists.Posicion = response;

                            var query = spo.encodeUrlListQuery(context.lists.Posicion, {
                                view: 'Todos los elementos',
                                odata: {
                                    'orderby': 'NPosicion desc',
                                    'select': '*',
                                    'top': 1
                                }
                            });

                            spo.getListItems(spo.getSiteUrl(), mths.getListTitle(), query,
                                function (response) {
                                    context.items.Ultima = response.d.results.length > 0 ? response.d.results[0] : null;
                                    loaded.Posicion = true;
                                    loaded.SolicitudSDP = true;
                                    loaded.Reemplazo = true;
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
                }else if(listItemId && !gestion){
                    //Obtener solamente las posiciones a editar
                    spo.getListInfo('Posicion',
                        function (response) {
                            context.items.Posicion = [];
                            context.lists.Posicion = response;

                            var filter = '(Id eq ' + listItemId + ')';
                            if(listItemId.includes(',')){
                                filter = "";
                                var ids = listItemId.split(',');
                                ids.map(function(id, i){
                                    if(i+1 == ids.length){
                                        filter += 'Id eq ' + id +' )'
                                    }else if(i == 0){
                                        filter += '(Id eq ' + id +' or '
                                    }else{
                                        filter += 'Id eq ' + id +' or '
                                    }
                                });
                            }
                            var query = spo.encodeUrlListQuery(context.lists.Posicion, {
                                view: 'Todos los elementos',
                                odata: {
                                    'filter': filter,
                                    'select': '*'
                                }
                            });

                            spo.getListItems(spo.getSiteUrl(), 'Posicion', query,
                                function (response) {
                                    context.items.Posicion = response.d.results.length > 0 ? response.d.results : null;
                                    loaded.Posicion = true;
                                    loaded.SolicitudSDP = true;
                                    loaded.Reemplazo = true;
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

                }else if(!listItemId && gestion){
                    //Opcion para cuando se esta gestionando una solicitudSDP

                    //Obtener el ID de la solicitud, Centro de costo
                    spo.getListInfo('SolicitudSDP',
                        function (response) {
                            context.items.SolicitudSDP = [];
                            context.lists.SolicitudSDP = response;
                            // Si existe el id de algún item a obtener
                                var query = spo.encodeUrlListQuery(context.lists.SolicitudSDP, {
                                    view: 'Todos los elementos',
                                    odata: {
                                        'filter': 'Id eq ' + gestion,
                                        'select': '*'
                                    }
                                });

                                spo.getListItems(spo.getSiteUrl(), 'SolicitudSDP', query,
                                    function (response) {
                                        context.items.SolicitudSDP = response.d.results.length > 0 ? response.d.results[0] : null;

                                        //Obtenermos el centro de costo de la solicitud
                                        spo.getListInfo('CentroCosto',
                                            function (response) {
                                                context.lists.CentroCosto = response;
                                                // Si existe el id de algún item a obtener
                                                    var query = spo.encodeUrlListQuery(context.lists.CentroCosto, {
                                                        view: 'Todos los elementos',
                                                        odata: {
                                                            'filter': '( D_CC eq \''+ context.items.SolicitudSDP.CentroCosto +'\' )',
                                                            'select': '*'
                                                        }
                                                    });

                                                    spo.getListItems(spo.getSiteUrl(), 'CentroCosto', query,
                                                        function (response) {
                                                            context.items.SolicitudSDP.CentroCosto = response.d.results.length > 0 ? response.d.results[0] : null;
                                                            loaded.SolicitudSDP = true;
                                                            console.log('Cargo Solicitud SDP')
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
                                        
                                        if(type == "Vacante" && UO){
                                            spo.getListInfo('Posicion',
                                                function (response) {
                                                    context.lists.Posicion = response;

                                                        var query2 = spo.encodeUrlListQuery(context.lists.Posicion, {
                                                            view: 'Todos los elementos',
                                                            odata: {
                                                                'filter': '( RutOcupante eq \''+ context.items.SolicitudSDP.ReemplazoId +'\' )',
                                                                'select': '*'
                                                            }
                                                        });

                                                        spo.getListItems(spo.getSiteUrl(), 'Posicion', query2,
                                                            function (response) {
                                                                context.items.SolicitudSDP.Posicion = response.d.results.length > 0 ? response.d.results[0] : null;
                                                                loaded.Reemplazo = true;
                                                                loaded.posicion = true;
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
                                        }else{
                                            loaded.Reemplazo = true;
                                            console.log('No tenia Reemplazo')
                                            shouldInitForms();
                                        }
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

                    spo.getListInfo('Posicion',
                        function (response) {
                            context.lists.Posicion = response;

                            var query = spo.encodeUrlListQuery(context.lists.Posicion, {
                                view: 'Todos los elementos',
                                odata: {
                                    'orderby': 'NPosicion desc',
                                    'select': '*',
                                    'top': 1
                                }
                            });

                            spo.getListItems(spo.getSiteUrl(), mths.getListTitle(), query,
                                function (response) {
                                    context.items.Ultima = response.d.results.length > 0 ? response.d.results[0] : null;
                                    loaded.Posicion = true;
                                    console.log('Cargo la Creacion de posicion')
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