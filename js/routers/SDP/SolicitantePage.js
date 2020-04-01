var solicitantePage = {
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
                        '<a href="#" class="link search ms-fadeIn100 hide">' +
                            '<i class="ms-Icon ms-Icon--Search"></i>' +
                            '<span class="ios-only">Buscar</span>' +
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
                        '<a href="#" class="link send ms-fadeIn100 hide">' +
                            '<i class="ms-Icon ms-Icon--Add"></i>' +
                            '<span class="ios-only">Crear solicitud</span>' +
                        '</a>' +
                        '<a href="#" class="link approve ms-fadeIn100 hide">' +
                            '<i class="ms-Icon ms-Icon--Accept"></i>' +
                            '<span class="ios-only">Aprobar Solicitud</span>' +
                        '</a>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="page-content">' +
                '<div class="list accordion-list">' +
                    '<ul>'+
                        '<li class="accordion-item accordion-item-opened"><a href="#" class="item-content item-link">'+
                            '<div class="item-inner">'+
                                '<div class="item-title"><strong>Identificación del jefe Solicitante</strong></div>'+
                            '</div></a>'+
                            '<div class="accordion-item-content">'+
                                '<div class="form-container form1"></div>' +
                            '</div>'+
                        '</li>'+
                        '<li class="accordion-item accordion-item-opened"><a href="#" class="item-content item-link">'+
                            '<div class="item-inner">'+
                                '<div class="item-title"><strong>Recepcion de la solicitud</strong></div>'+
                            '</div></a>'+
                            '<div class="accordion-item-content">'+
                                '<div class="form-container form2"></div>'+
                            '</div>'+
                        '</li>'+
                        '<li class="accordion-item accordion-item-opened"><a href="#" class="item-content item-link">'+
                            '<div class="item-inner">'+
                                '<div class="item-title"><strong>Antecedentes Posicion</strong></div>'+
                            '</div></a>'+
                            '<div class="accordion-item-content">'+
                                '<div class="form-container form3"></div>' +
                                '<div class="form-container form4"></div>' +
                                '<div class="form-container form5"></div>' +
                            '</div>'+
                        '</li>'+
                    '</ul>'+
                '</div>'+
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
            return 'SolicitudesSDP';
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
                listItemId = page.route.query.listItemId;

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
                    $navbar = $(page.navbarEl);
                    $search = $navbar.find('.link.search');
                    $send = $navbar.find('.link.send');
                    $approve = $navbar.find('.link.approve');


                // context.forms.busqueda.inputs['busqueda'].params.onChange = function(comp, input, state, values){
                //     if(values.length == 0){
                //         context.forms.jefe.reset();
                //     }else{
                //         var work = context.items.Planta.filter( x => x.BusquedaPlanta == values[0].key)[0];
                //         context.forms.jefe.inputs['Rut'].setValue([{key: work.ID, text: work.Rut, item: work}])
                //     }
                // }

                context.forms.jefe = new EFWForm({
                    container: $container.find('.form1'),
                    title: '',
                    editable: listItemId ? false : true,
                    fields: spo.getViewFields(context.lists.solicitudSDP, 'FormSolicitante')
                }); 
                
                if(listItemId){
                    
                }else{
                    context.forms.jefe.inputs['Rut'].setEditable(true);

                    context.forms.jefe.inputs['Rut'].params.onChange = function(comp, input, state, values){
                        if(values.length > 0){
                            
                            var cargo = context.items.Cargo.filter(x => x.ID == values[0].item.d_cargoId)[0];
                            context.forms.jefe.inputs['Nombre'].setValue(values[0].item.Nombre ? values[0].item.Nombre : '') 
                            context.forms.jefe.inputs['ApellidoPaterno'].setValue(values[0].item.ApellidoPaterno ? values[0].item.ApellidoPaterno : '')
                            context.forms.jefe.inputs['ApellidoMaterno'].setValue(values[0].item.ApellidoMaterno ? values[0].item.ApellidoMaterno : '')
                            context.forms.jefe.inputs['Cargo'].setValue(cargo.NombreCargo ? cargo.NombreCargo : '');
                            context.forms.jefe.inputs['Gerencia'].setValue(values[0].item.Nivel_Org_1 ? values[0].item.Nivel_Org_1 : '');
                        }
                    }
                }

                var input1 = [
                    spo.getViewFields(context.lists.solicitudSDP, 'FormRecepcionSolicitud')[0],
                    spo.getViewFields(context.lists.solicitudSDP, 'FormRecepcionSolicitud')[1],
                    spo.getViewFields(context.lists.solicitudSDP, 'FormRecepcionSolicitud')[2],
                    {
                        Id: generateUUID(),
                        Title: 'Cotización del mandante',
                        InternalName: 'CotizaciónMandante',
                        TypeAsString: 'Attachments',
                    },
                    spo.getViewFields(context.lists.solicitudSDP, 'FormRecepcionSolicitud')[3],
                    spo.getViewFields(context.lists.solicitudSDP, 'FormRecepcionSolicitud')[4]
                ]

                //Form Parte 2
                context.forms.recepcion = new EFWForm({
                    container: $container.find('.form2'),
                    title: '',
                    editable: listItemId ? false : true,
                    fields: input1
                });

                context.forms.recepcion.inputs['CPRFechaDesde'].hide();
                context.forms.recepcion.inputs['CPRFechaHasta'].hide();
                context.forms.recepcion.inputs['CotizaciónMandante'].hide();

                //Ocultar Botones
                context.forms.recepcion.inputs['ContratoMutualProyRecuperable'].params.onChange = function(comp, input, state, values){
                    if(values){
                        context.forms.recepcion.inputs['CPRFechaDesde'].show();
                        context.forms.recepcion.inputs['CPRFechaHasta'].show();
                        context.forms.recepcion.inputs['CotizaciónMandante'].show();

                        context.forms.recuperable.show();
                    }else{
                        context.forms.recepcion.inputs['CPRFechaDesde'].hide();
                        context.forms.recepcion.inputs['CPRFechaHasta'].hide();
                        context.forms.recepcion.inputs['CotizaciónMandante'].hide();

                        context.forms.recuperable.hide();
                    }
                }

                context.forms.recepcion.inputs['Posicion'].params.onChange = function(comp, input, state, values){
                    if(values.length > 0){
                        if(values[0].text == "Vacante"){
                            context.forms.vacante.show();
                        }else{
                            context.forms.vacante.hide();
                        }
                    }else{

                    }
                }

                var input2 = [
                    spo.getViewFields(context.lists.solicitudSDP, 'AntecedentesPosicion')[0],
                {
                    Id: generateUUID(),
                    Title: '¿Otro?',
                    InternalName: 'otroCargo',
                    TypeAsString: 'Boolean',
                },
                {
                    Id: generateUUID(),
                    Title: 'Nombre nuevo cargo',
                    InternalName: 'NombreNewCargo',
                    TypeAsString: 'Text',
                    required: true,
                },
                {
                    Id: generateUUID(),
                    Title: 'Descriptor de cargo',
                    InternalName: 'DocDescriptor de cargo',
                    TypeAsString: 'Attachments',
                    required: true,
                },
                spo.getViewFields(context.lists.solicitudSDP, 'AntecedentesPosicion')[1],
                spo.getViewFields(context.lists.solicitudSDP, 'AntecedentesPosicion')[2],];

                //Form Parte 3
                context.forms.posicion = new EFWForm({
                    container: $container.find('.form3'),
                    title: '',
                    editable: listItemId ? false : true,
                    fields: input2
                });
                context.forms.posicion.inputs['DocDescriptor de cargo'].hide()
                context.forms.posicion.inputs['NombreNewCargo'].hide()
                

                context.forms.posicion.inputs['otroCargo'].params.onChange = function(comp, input, state, values){
                    if(values){
                        context.forms.posicion.inputs['NombreCargoSolicitado'].setEditable(false);
                        context.forms.posicion.inputs['NombreCargoSolicitado'].setRequired(false);
                        context.forms.posicion.inputs['DocDescriptor de cargo'].show();
                        context.forms.posicion.inputs['NombreNewCargo'].show();
                        context.forms.posicion.inputs['NombreCargoSolicitado'].setValue([]);
                    }else{
                        !listItemId ? context.forms.posicion.inputs['NombreCargoSolicitado'].setEditable(true) : '';
                        context.forms.posicion.inputs['NombreCargoSolicitado'].setValue([]);
                        context.forms.posicion.inputs['NombreCargoSolicitado'].setRequired(true);
                        context.forms.posicion.inputs['DocDescriptor de cargo'].hide();
                        context.forms.posicion.inputs['NombreNewCargo'].hide();
                        context.forms.posicion.inputs['DocDescriptor de cargo'].setValue([]);
                        context.forms.posicion.inputs['NombreNewCargo'].setValue('');
                    }
                }

                //Form Parte 3
                context.forms.recuperable = new EFWForm({
                    container: $container.find('.form4'),
                    title: 'Datos contrato Mutual proy. recuperable',
                    editable: true,
                    fields: spo.getViewFields(context.lists.solicitudSDP, 'FormContratoRecuperable')
                });

                context.forms.recuperable.hide()

                //Form Parte 3
                context.forms.vacante = new EFWForm({
                    container: $container.find('.form5'),
                    title: 'Datos de posicion vacante',
                    editable: listItemId ? false : true,
                    fields:spo.getViewFields(context.lists.solicitudSDP, 'FormVacante')
                });

                //Ocultamos el formulario
                context.forms.vacante.hide();


                if(listItemId){
                    context.forms.jefe.setValues(context.items.solicitudSDP)
                    context.forms.recepcion.setValues(context.items.solicitudSDP)
                    context.forms.posicion.setValues(context.items.solicitudSDP);
                    context.forms.recuperable.setValues(context.items.solicitudSDP)
                    context.forms.vacante.setValues(context.items.solicitudSDP)

                    if(context.items.solicitudSDP.Adjuntos){
                        if(context.items.solicitudSDP.Adjuntos.results.length > 0){
                            context.forms.recepcion.inputs['CotizaciónMandante'].resetValue();
                            context.forms.posicion.inputs['DocDescriptor de cargo'].resetValue();
                            if(context.items.solicitudSDP.Adjuntos.results.includes('Cotizacion') && context.items.solicitudSDP.Adjuntos.results.includes('Cargo')){
                                context.forms.recepcion.inputs['CotizaciónMandante'].setValue([context.items.solicitudSDP.AttachmentFiles.results[0]]);
                                context.forms.posicion.inputs['DocDescriptor de cargo'].setValue([context.items.solicitudSDP.AttachmentFiles.results[0]]);
                            }else if(context.items.solicitudSDP.Adjuntos.results.includes('Cotizacion')){
                                context.forms.recepcion.inputs['CotizaciónMandante'].setValue([context.items.solicitudSDP.AttachmentFiles.results[0]]);
                            }else if(context.items.solicitudSDP.Adjuntos.results.includes('Cargo')){
                                context.forms.posicion.inputs['DocDescriptor de cargo'].setValue([context.items.solicitudSDP.AttachmentFiles.results[0]]);
                            }
                        }
                    }

                    $approve.removeClass('hide');
                }else{
                    $search.removeClass('hide');
                    $send.removeClass('hide');
                }




                $search.on('click', function (e) {
                    function abrirPopup(data){
                                                            
                                    // Inyectar HTML
                        var dynamicPopup = app.popup.create({
                            content: `
                                <div class="popup search-popup" style="overflow:auto">
                                    <div class="close-popup close-button"><i class="ms-Icon ms-Icon--ChromeClose" aria-hidden="true"></i></div>
                                    <div class="block">
                                        <div class="busqueda" style="margin-top: 10px !important;"></div>
                                            <div class="buttons-container ms-slideLeftIn10 hide">
                                                <button class="button button-fill send">Copiar al portapapeles</button>
                                            </div>
                                        </div>
                                    </div>
                                `,
                                // Events
                                on: {
                                    opened: function (popup) {
                                        var $container = $(popup.el),
                                            $sendButton = $container.find('.send'),
                                            $closeButton = $container.find('.close-popup'),
                                            $buttonsContainer = $container.find('.buttons-container');
                                                
                        
                                            var input = [{
                                                Id: generateUUID(),
                                                Title: 'Busqueda Planta',
                                                InternalName: 'busqueda',
                                                TypeAsString: 'Choice',
                                                Choices: data
                                            }]
                                            
                                            context.forms.busqueda = new EFWForm({
                                                container: $container.find('.busqueda'),
                                                title: 'Buscador de personas',
                                                editable: true,
                                                fields: input
                                            });
                                                
                                            $buttonsContainer.removeClass('hide');
                    
                                            // {event} cerrar popup
                                            $closeButton.on('click', function(e){
                                                popup.close();
                                            });
                    
                                            // {event} enviar correo
                                            $sendButton.on('click', function(e){
                                                clipboard = context.forms.busqueda.getMetadata();
                                                clipboard = context.items.Planta.filter(x => x.BusquedaPlanta == context.forms.busqueda.getMetadata()['busqueda'])[0]
                                                console.log('Portapapeles', clipboard)
                                                // cerrar popover
                                                popup.close();

                                                app.notification.create({
                                                    icon: '<i class="ms-Icon ms-Icon--ClipboardSolid"></i>',
                                                    title: 'Agregardo a portapapeles',
                                                    subtitle: 'Se ha copiado el trabajador en el portapapeles.',
                                                    closeOnClick: true,
                                                    closeTimeout: 2000,
                                                }).open();
                    
                                            })                                                   
                                    }
                                },
                                closed: function (popup) {
                                    if (form) form.destroy();
                                },
                        });

                        dynamicPopup.open();
                    }
                    var data =  context.items.Planta.map(function(x){
                                    return x.BusquedaPlanta
                                });
                    abrirPopup(data)
                });

                $send.on('click', function (e) {
                    var dialogTitle = 'Nueva solicitud';

                    function save() {
                        var dialog = app.dialog.progress(dialogTitle);

                        var metadataJefe = context.forms.jefe.getMetadata(),
                            metadataRecepcion = context.forms.recepcion.getMetadata(),
                            metadataPocicion = context.forms.posicion.getMetadata(),
                            metadataRecuperable = [],
                            metadataVacante = [];
                            
                        if(context.forms.recepcion.inputs['ContratoMutualProyRecuperable'].value){
                            metadataRecuperable = context.forms.recuperable.getMetadata()
                        }
                        if(context.forms.recepcion.inputs['Posicion'].values[0].key == 'Vacante'){
                            metadataVacante = context.forms.vacante.getMetadata()
                        }

                        var metadata = [];

                        var Attachments = [];
                        var Adjuntos = [];

                        if(metadataRecepcion.CotizaciónMandante){
                            Attachments[0] = metadataRecepcion.CotizaciónMandante[0];
                            Adjuntos.push("Cotizacion")
                        }else{
                            Attachments[0] = null
                        }

                        if(metadataPocicion['DocDescriptor de cargo']){
                            Attachments[1] = metadataPocicion['DocDescriptor de cargo'][0];
                            Adjuntos.push("Cargo")
                        }else{
                            Attachments[1] = null
                        }

                        metadata.RutId = metadataJefe.RutId;
                        metadata.Nombre = metadataJefe.Nombre;
                        metadata.ApellidoPaterno = metadataJefe.ApellidoPaterno;
                        metadata.ApellidoMaterno = metadataJefe.ApellidoMaterno;
                        metadata.Cargo = metadataJefe.Cargo;
                        metadata.Gerencia = metadataJefe.Gerencia;
                        metadata.Posicion = metadataRecepcion.Posicion;
                        metadata.AumentoPresupuesto = metadataRecepcion.ContratoMutualProyRecuperable;
                        metadata.ContratoMutualProyRecuperable = metadataRecepcion.ContratoMutualProyRecuperable;
                        metadata.CPRFechaDesde = metadataRecepcion.CPRFechaDesde;
                        metadata.CPRFechaHasta = metadataRecepcion.CPRFechaHasta;
                        metadata.NombreCargoSolicitadoId = metadataPocicion.NombreCargoSolicitadoId;
                        metadata.otroCargo = metadataPocicion.otroCargo
                        metadata.NombreNewCargo = metadataPocicion.NombreNewCargo;
                        metadata.PersonasAContratar = metadataPocicion.PersonasAContratar;
                        metadata.JefaturaDirectaId = metadataPocicion.JefaturaDirectaId;
                        metadata.NombreProyecto = metadataRecuperable.NombreProyecto
                        metadata.DependenciaDirectaId = metadataRecuperable.DependenciaDirectaId
                        metadata.Renta = metadataRecuperable.Renta;
                        metadata.ReemplazoId = metadataVacante.ReemplazoId;
                        metadata.CentroCostoId = metadataVacante.CentroCostoId;
                        metadata.Observacion = metadataVacante.Observacion;
                        metadata.Attachments = Attachments;
                        metadata.Adjuntos = {};
                        metadata.Adjuntos.results = Adjuntos;
                        metadata.Estado = 'Inicial';

                            
                        console.log('Metadata final', metadata)

                        console.log('Metadata', context.forms.vacante.getMetadata())

                        spo.saveListItem(spo.getSiteUrl(), 'SolicitudSDP', metadata, function (response) {
                                dialog.close();

                                app.dialog.create({
                                    title: dialogTitle,
                                    text: 'Solicitud creada con éxito',
                                    buttons: [{
                                        text: 'Aceptar',
                                        onClick: function () {
                                            mainView.router.navigate('/Solicitudes');
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

                    // Checkamos los campos requeridos
                    context.forms.jefe.checkFieldsRequired();
                    context.forms.recepcion.checkFieldsRequired();
                    context.forms.posicion.checkFieldsRequired();
                    if(context.forms.recepcion.inputs['ContratoMutualProyRecuperable'].value){
                        context.forms.recuperable.checkFieldsRequired();
                    }
                    if(context.forms.recepcion.inputs['Posicion'].values[0].key == 'Vacante'){
                        context.forms.vacante.checkFieldsRequired();
                    }
                    
                    var validate = false 

                    if(context.forms.jefe.getValidation() && context.forms.recepcion.getValidation() && context.forms.posicion.getValidation()){
                        validate = true;
                        if(context.forms.recepcion.inputs['ContratoMutualProyRecuperable'].value){
                            if(!context.forms.recuperable.getValidation()){
                                validate = false;
                            }
                        }
                        if(context.forms.recepcion.inputs['Posicion'].values[0].key == 'Vacante'){
                            if(!context.forms.vacante.getValidation()){
                                validate = false;
                            }
                        }
                    }
                    
                    if (validate) {
                        app.dialog.create({
                            title: dialogTitle,
                            text: 'Se creará una nueva solicitud.',
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
                            text: 'Para crear una nueva solicitud debe completar todos los campos obligatorios.',
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
                    if (loaded.Solicitud && loaded.Planta && loaded.Cargo) {
                        initForm();
                    }
                };

                spo.getListInfo("SolicitudSDP",
                    function (response) {
                        context.lists.solicitudSDP = response;

                        if(listItemId){
                            var query = spo.encodeUrlListQuery(context.lists.solicitudSDP, {
                                view: 'Todos los elementos',
                                odata: {
                                    'filter': '(ID eq '+listItemId+')',
                                    'select': '*',
                                    'top': 5000
                                }
                            });

                            spo.getListItems(spo.getSiteUrl(), 'SolicitudSDP', query,
                                function (response) {
                                    context.items.solicitudSDP = response.d.results.length > 0 ? response.d.results[0] : null;
                                    loaded.Solicitud = true;
                                    shouldInitForms();
                                },
                                function (response) {
                                    var responseText = JSON.parse(response.responseText);
                                    console.log(responseText.error.message.value);
                                }
                            );
                        }else{
                            loaded.Solicitud = true;
                            shouldInitForms();
                        }
                    },
                    function (response) {
                        var responseText = JSON.parse(response.responseText);
                        console.log(responseText.error.message.value);
                    }
                );

                // Obtengo los trabajadores asociados al coordinador
                spo.getListInfo('Planta',
                    function (response) {
                        context.items.Planta = [];
                        context.lists.Planta = response; 
                        
                        // Genera la query basado en los campos que se obtubieron en la SPO anterior
                         var query = spo.encodeUrlListQuery(context.lists.Planta, {
                            view: 'Todos los elementos',
                            odata: {
                                'filter': '(EstadoContrato ne \'Suspendido\')',
                                'select': '*',
                                'top': 5000
                            }
                        });

                        spo.getListItems(spo.getSiteUrl(), 'Planta', query,
                            function (response) {
                                context.items.Planta = response.d.results.length > 0 ? response.d.results : null;
                                loaded.Planta = true;
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

                // Obtengo los trabajadores asociados al coordinador
                spo.getListInfo('Cargo',
                    function (response) {
                        context.items.Cargo = [];
                        context.lists.Cargo = response; 
                        
                        // Genera la query basado en los campos que se obtubieron en la SPO anterior
                         var query = spo.encodeUrlListQuery(context.lists.Cargo, {
                            view: 'Todos los elementos',
                            odata: {
                                'select': '*',
                                'top': 5000
                            }
                        });

                        spo.getListItems(spo.getSiteUrl(), 'Cargo', query,
                            function (response) {
                                context.items.Cargo = response.d.results.length > 0 ? response.d.results : null;
                                loaded.Cargo = true;
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