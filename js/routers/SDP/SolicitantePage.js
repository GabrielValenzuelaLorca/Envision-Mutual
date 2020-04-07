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
                            '<span class="ios-only">Validar</span>' +
                        '</a>' +
                        '<a href="#" class="link doc-reject ms-fadeIn100 hide">' +
                            '<i class="ms-Icon ms-Icon--PageRemove"></i>' +
                            '<span class="ios-only">No Validar</span>' +
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
                        '<a href="#" class="link final-approve ms-fadeIn100 hide">' +
                            '<i class="ms-Icon ms-Icon--Accept"></i>' +
                            '<span class="ios-only">Enviar Solicitud a Compensación</span>' +
                        '</a>' +
                        '<a href="#" class="link force-close ms-fadeIn100 hide">' +
                        '<i class="ms-Icon ms-Icon--Commitments"></i>' +
                        '<span class="ios-only">Forzar Cierre</span>' +
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
                    '<div class="history"></div>' +
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
        
        addComment (fn){
            var commentPopup = app.popup.create({
                content: `
                    <div class="popup send-email-popup" style="overflow:auto">
                        <div class="close-popup close-button"><i class="ms-Icon ms-Icon--ChromeClose" aria-hidden="true"></i></div>
                        <div class="block">
                            <div class="update-form" style="margin-top: 10px !important;"></div>
                            <div class="buttons-container ms-slideLeftIn10 hide">
                                <button class="button button-fill close-popup">Volver</button>
                                <button class="button button-fill send">Enviar</button>
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
                        
                        var campos = []
                        campos.push({
                            Title: 'Justificación',
                            Id: generateUUID(),
                            TypeAsString: 'Note',
                            InternalName: 'ComentarioVirtual',
                            Required: true,
                        });
                        // formulario de actualización
                        form = new EFWForm({
                            container: $container.find('.update-form'),
                            title: 'Observaciones'.bold(),
                            editable: true,
                            description: 'Ingrese su observación.',
                            fields: campos
                        });
                        
                        $buttonsContainer.removeClass('hide');

                        // {event} cerrar popup
                        $closeButton.on('click', function(e){
                            popup.close();
                        });

                        // {event} enviar correo
                        $sendButton.on('click', function(e){
                            form.checkFieldsRequired();
                            if(form.getValidation() && form.getMetadata().ComentarioVirtual.length >= 10){
                                var comentarioRechazo = form.getMetadata();                                                                    
                                // cerrar popover
                                popup.close();
                                
                                fn(comentarioRechazo.ComentarioVirtual);
                            } else if (form.getMetadata().ComentarioVirtual.length < 10){
                                dialogs.infoDialog(
                                    "Hubo un error",
                                    "Su observación tiene menos de 10 caracteres"
                                )
                            }
                            
                        })
                    },
                    closed: function (popup) {
                        if (form) form.destroy();
                    },
                },
            });
            commentPopup.open();
        }
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
                    $refuse = $navbar.find('.link.doc-reject')
                    $finalApprove = $navbar.find('.link.final-approve');
                    $forceClose = $navbar.find('.link.force-close');

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
                    editable: false,
                    fields: spo.getViewFields(context.lists.solicitudSDP, 'FormSolicitante')
                }); 
                
                
                if(!listItemId){
                    context.forms.jefe.inputs['Rut'].setEditable(true);
                    context.forms.jefe.inputs['Aprobadores'].hide();
                    context.forms.jefe.inputs['NextVal'].hide();

                    context.forms.jefe.inputs['Rut'].params.onChange = function(comp, input, state, values){
                        if(values.length > 0){
                            let aprobadores = []
                            for (let i = 1; i < 9; i++) {
                                let apr = values[0].item["Aprobador"+i.toString()];
                                if (apr){
                                    aprobadores.push(apr)
                                }
                            }
                            var cargo = context.items.Cargo.filter(x => x.ID == values[0].item.d_cargoId)[0];
                            context.forms.jefe.inputs['Nombre'].setValue(values[0].item.Nombre ? values[0].item.Nombre : '') 
                            context.forms.jefe.inputs['ApellidoPaterno'].setValue(values[0].item.ApellidoPaterno ? values[0].item.ApellidoPaterno : '')
                            context.forms.jefe.inputs['ApellidoMaterno'].setValue(values[0].item.ApellidoMaterno ? values[0].item.ApellidoMaterno : '')
                            context.forms.jefe.inputs['Cargo'].setValue(cargo.NombreCargo ? cargo.NombreCargo : '');
                            context.forms.jefe.inputs['Gerencia'].setValue(values[0].item.Nivel_Org_1 ? values[0].item.Nivel_Org_1 : '');
                            context.forms.jefe.inputs['CentroCosto'].setValue(values[0].item.d_centro_d ? values[0].item.d_centro_d : '')
                            context.forms.jefe.inputs['Aprobadores'].setValue(aprobadores.length ? JSON.stringify(aprobadores) : '');
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
                            context.forms.posicion.inputs['PersonasAContratar'].setEditable(false);
                            context.forms.posicion.inputs['PersonasAContratar'].setValue(1);
                            context.forms.vacante.show();
                        }else{
                            context.forms.vacante.hide();
                            context.forms.posicion.inputs['PersonasAContratar'].setEditable(true);
                            context.forms.posicion.inputs['PersonasAContratar'].setValue('');
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
                    spo.getViewFields(context.lists.solicitudSDP, 'AntecedentesPosicion')[1],
                    {
                        Id: generateUUID(),
                        Title: 'Descriptor de cargo',
                        InternalName: 'DocDescriptor de cargo',
                        TypeAsString: 'Attachments',
                        required: true,
                    },
                    spo.getViewFields(context.lists.solicitudSDP, 'AntecedentesPosicion')[2],
                    spo.getViewFields(context.lists.solicitudSDP, 'AntecedentesPosicion')[3]
                ];

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
                        context.forms.posicion.inputs['NombreNewCargo'].setRequired(true);
                        context.forms.posicion.inputs['NombreCargoSolicitado'].setValue([]);
                        context.forms.posicion.inputs['DocDescriptor de cargo'].setRequired(true);
                        context.forms.posicion.inputs['DocDescriptor de cargo'].show();
                        context.forms.posicion.inputs['NombreNewCargo'].show();
                    }else{
                        context.forms.posicion.inputs['NombreCargoSolicitado'].setValue([]);
                        !listItemId ? context.forms.posicion.inputs['NombreCargoSolicitado'].setEditable(true) : '';
                        context.forms.posicion.inputs['NombreCargoSolicitado'].setRequired(true);
                        context.forms.posicion.inputs['DocDescriptor de cargo'].hide();
                        context.forms.posicion.inputs['NombreNewCargo'].hide();
                        context.forms.posicion.inputs['DocDescriptor de cargo'].resetValue();
                        context.forms.posicion.inputs['NombreNewCargo'].setValue('');
                        context.forms.posicion.inputs['NombreNewCargo'].setRequired(false);
                        context.forms.posicion.inputs['DocDescriptor de cargo'].setRequired(false);
                    }
                }

                //Form Parte 3
                context.forms.recuperable = new EFWForm({
                    container: $container.find('.form4'),
                    title: 'Datos contrato Mutual proy. recuperable',
                    editable: listItemId ? false : true,
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


                //Form Parte 3
                context.forms.history = new EFWForm({
                    container: $container.find('.history'),
                    title: 'Historial de la solicitud',
                    editable: false,
                    fields: [
                        spo.getViewFields(context.lists.solicitudSDP, 'History')[0],
                        {
                            Id: generateUUID(),
                            Title: 'Siguiente Aprobador',
                            InternalName: 'NextApprove',
                            TypeAsString: 'Text',
                        },
                        spo.getViewFields(context.lists.solicitudSDP, 'History')[1]
                    ]
                });
                context.forms.history.hide();

                if(listItemId){
                    context.forms.jefe.setValues(context.items.solicitudSDP)
                    context.forms.recepcion.setValues(context.items.solicitudSDP)
                    context.forms.posicion.setValues(context.items.solicitudSDP);
                    context.forms.recuperable.setValues(context.items.solicitudSDP)
                    context.forms.vacante.setValues(context.items.solicitudSDP)
                    context.forms.history.setValues(context.items.solicitudSDP)
                    context.forms.jefe.inputs["Aprobadores"].hide()
                    context.forms.jefe.inputs["NextVal"].hide()

                    //Mostramos el historial
                    context.forms.history.show();
                    context.forms.history.inputs['HistorialAprobacion'].setEditable(true);
                    context.forms.history.inputs['HistorialAprobacion'].setReadOnly(true);
                    context.forms.history.inputs['NextApprove'].setValue(context.items.solicitudSDP.NextVal);

                    if(context.items.solicitudSDP.Adjuntos){
                        console.log('Adjuntos', context.items.solicitudSDP)
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


                    if (plantaAdmin.RolSDP.results.includes("Validador")){
                        if (context.items.solicitudSDP.NextVal == plantaAdmin.Email){
                            if (context.items.solicitudSDP.Estado == "Última Validación")
                                $finalApprove.removeClass('hide');
                            else     
                                $approve.removeClass('hide');

                            $refuse.removeClass('hide');
                        } else if (plantaAdmin.Confianza && context.items.solicitudSDP.Estado == "Última Validación"){
                            $forceClose.removeClass('hide');
                        }
                    }

                }else{
                    // $search.removeClass('hide');
                    $send.removeClass('hide');
                }

                // $search.on('click', function (e) {
                //     function abrirPopup(data){
                                                            
                //                     // Inyectar HTML
                //         var dynamicPopup = app.popup.create({
                //             content: `
                //                 <div class="popup search-popup" style="overflow:auto">
                //                     <div class="close-popup close-button"><i class="ms-Icon ms-Icon--ChromeClose" aria-hidden="true"></i></div>
                //                     <div class="block">
                //                         <div class="busqueda" style="margin-top: 10px !important;"></div>
                //                             <div class="buttons-container ms-slideLeftIn10 hide">
                //                                 <button class="button button-fill send">Copiar al portapapeles</button>
                //                             </div>
                //                         </div>
                //                     </div>
                //                 `,
                //                 // Events
                //                 on: {
                //                     opened: function (popup) {
                //                         var $container = $(popup.el),
                //                             $sendButton = $container.find('.send'),
                //                             $closeButton = $container.find('.close-popup'),
                //                             $buttonsContainer = $container.find('.buttons-container');
                                                
                        
                //                             var input = [{
                //                                 Id: generateUUID(),
                //                                 Title: 'Busqueda Planta',
                //                                 InternalName: 'busqueda',
                //                                 TypeAsString: 'Choice',
                //                                 Choices: data
                //                             }]
                                            
                //                             context.forms.busqueda = new EFWForm({
                //                                 container: $container.find('.busqueda'),
                //                                 title: 'Buscador de personas',
                //                                 editable: true,
                //                                 fields: input
                //                             });
                                                
                //                             $buttonsContainer.removeClass('hide');
                    
                //                             // {event} cerrar popup
                //                             $closeButton.on('click', function(e){
                //                                 popup.close();
                //                             });
                    
                //                             // {event} enviar correo
                //                             $sendButton.on('click', function(e){
                //                                 clipboard = context.forms.busqueda.getMetadata();
                //                                 clipboard = context.items.Planta.filter(x => x.BusquedaPlanta == context.forms.busqueda.getMetadata()['busqueda'])[0]
                //                                 console.log('Portapapeles', clipboard)
                //                                 // cerrar popover
                //                                 popup.close();

                //                                 app.notification.create({
                //                                     icon: '<i class="ms-Icon ms-Icon--ClipboardSolid"></i>',
                //                                     title: 'Agregardo a portapapeles',
                //                                     subtitle: 'Se ha copiado el trabajador en el portapapeles.',
                //                                     closeOnClick: true,
                //                                     closeTimeout: 2000,
                //                                 }).open();
                    
                //                             })                                                   
                //                     }
                //                 },
                //                 closed: function (popup) {
                //                     if (form) form.destroy();
                //                 },
                //         });

                //         dynamicPopup.open();
                //     }
                //     var data =  context.items.Planta.map(function(x){
                //                     return x.BusquedaPlanta
                //                 });
                //     abrirPopup(data)
                // });

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
                            Attachments.push(metadataRecepcion.CotizaciónMandante[0]);
                            Adjuntos.push("Cotizacion")
                        }

                        if(metadataPocicion['DocDescriptor de cargo']){
                            Attachments.push(metadataPocicion['DocDescriptor de cargo'][0]);
                            Adjuntos.push("Cargo")
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
                        metadata.CentroCosto = metadataJefe.CentroCosto
                        metadata.Observacion = metadataVacante.Observacion;
                        metadata.Attachments = Attachments;
                        metadata.Adjuntos = {};
                        metadata.Adjuntos.results = Adjuntos;
                        metadata.Estado = '1ra Validación';
                        metadata.Aprobadores = context.forms.jefe.inputs["Aprobadores"].value;
                        metadata.NextVal = JSON.parse(metadata.Aprobadores)[0]

                        spo.saveListItem(spo.getSiteUrl(), 'SolicitudSDP', metadata, function (response) {
                                dialog.close();

                                app.dialog.create({
                                    title: dialogTitle,
                                    text: 'Solicitud creada con éxito',
                                    buttons: [{
                                        text: 'Aceptar',
                                        onClick: function () {
                                            mainView.router.navigate('/SolicitudStream');
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

                $approve.on('click', function (e) {
                    var dialogTitle = 'Aprobación de solicitud'
                    var estados = [
                        "1ra Validación",
                        "2da Validación",
                        "3ra Validación",
                        "4ta Validación",
                        "5ta Validación",
                        "6ta Validación",
                        "7ma Validación",
                    ]

                    function save(comentario){
                        var dialog = app.dialog.progress(dialogTitle);
                        let pos = parseInt(context.items.solicitudSDP.Estado[0]);
                        let metadata = {
                            NextVal: JSON.parse(context.items.solicitudSDP.Aprobadores)[pos]
                        }
                        if (pos + 1 == JSON.parse(context.items.solicitudSDP.Aprobadores).length){
                            metadata.Estado = "Última Validación";
                        } else {
                            metadata.Estado = estados[pos];
                        }

                        metadata["V_x00b0_B_x00b0__x0028_"+pos.toString()+"_x0029_"] = true
                        metadata["FechadeV_x00b0_B_x00b0__x0028_"+ pos.toString() +"_"] = new Date().toISOString()
                        metadata["Observacion_x0028_"+ pos.toString() +"_x0029_"] = comentario;

                        let registro = ""
                        registro += "Fecha de validación: " + moment(new Date()).format("DD/MM/YYYY hh:mm") + "\n"
                        registro += "Estado de validación previo: " + context.items.solicitudSDP.Estado + "\n"
                        registro += "Estado de validación actual: " + metadata.Estado + "\n"
                        registro += "Nombre del Validador: " + plantaAdmin.NombreCompleto + "\n"
                        registro += "Cargo del Validador: " + plantaAdmin.d_cargo.NombreCargo + "\n"
                        if (comentario) registro += "Observaciones: " + comentario + "\n\n"
                        else registro += "Observaciones: Sin Observaciones\n\n"
                        registro += context.items.solicitudSDP.HistorialAprobacion ? context.items.solicitudSDP.HistorialAprobacion : ""

                        metadata.HistorialAprobacion = registro

                        spo.updateListItem(spo.getSiteUrl(), "SolicitudSDP", context.items.solicitudSDP.ID, metadata, function (response) {
                            dialog.close();
        
                            dialogs.confirmDialog(
                                dialogTitle,
                                'Validación de solicitud exitosa',
                                function(){
                                    mainView.router.navigate('/SolicitudesPorValidar')
                                },
                                false
                            );
        
                        }, function (response) {
                            var responseText = JSON.parse(response.responseText);
                            console.log('responseText', responseText);
        
                            dialog.close();
                            dialogs.infoDialog(
                                "Error",
                                'Hubo un problema al validar la solicitud'
                            )
                        });

                    }

                    app.dialog.create({
                        title: dialogTitle,
                        text: '¿Desea añadir una observación a su aprobación?',
                        buttons: [{
                            text: 'No',
                            onClick: function(){
                                dialogs.confirmDialog(
                                    dialogTitle,
                                    "Se validará la solicitud seleccionada",
                                    save
                                )
                            }
                        },{
                            text: 'Sí',
                            onClick: function(){
                                mths.addComment(save)
                            }
                        }],
                        verticalButtons: false
                    }).open();
                });

                $forceClose.on('click', function (e) {
                    var dialogTitle = 'Forzar Cierre de Solicitud'

                    function save(comentario){
                        var dialog = app.dialog.progress(dialogTitle);
                        let lastApr = null;

                        var query = spo.encodeUrlListQuery(context.lists.Planta, {
                            view: 'Todos los elementos',
                            odata: {
                                'filter': '(Email eq \''+ context.items.solicitudSDP.NextVal +'\' and EstadoContrato eq \'Activo\')'
                            }
                        });
                        spo.getListItems(spo.getSiteUrl(), "Planta", query,
                            function (response) {
                                if (response.d.results.length>0){
                                    lastApr = response.d.results[0]
                                    let metadata = {
                                        NextVal: null,
                                        Estado: "Enviada a Compensación"
                                    }

                                    let pos = JSON.parse(context.items.solicitudSDP.Aprobadores).length.toString()
            
                                    metadata["V_x00b0_B_x00b0__x0028_"+pos+"_x0029_"] = true
                                    metadata["FechadeV_x00b0_B_x00b0__x0028_"+ pos +"_"] = new Date().toISOString()
                                    metadata["Observacion_x0028_"+ pos +"_x0029_"] = comentario;

                                    let registro = ""
                                    registro += "Fecha de validación: " + moment(new Date()).format("DD/MM/YYYY hh:mm") + "\n"
                                    registro += "Estado de validación previo: " + context.items.solicitudSDP.Estado + "\n"
                                    registro += "Estado de validación actual: " + metadata.Estado + "\n"
                                    registro += "Nombre del Validador: " + lastApr.NombreCompleto + "\n"
                                    registro += "Cargo del Validador: " + lastApr.d_cargo.NombreCargo + "\n"
                                    if (comentario) registro += "Observaciones: " + comentario + "\n\n"
                                    else registro += "Observaciones: Sin Observaciones\n\n"
                                    registro += context.items.solicitudSDP.HistorialAprobacion ? context.items.solicitudSDP.HistorialAprobacion : ""
            
                                    metadata.HistorialAprobacion = registro
            
                                    spo.updateListItem(spo.getSiteUrl(), "SolicitudSDP", context.items.solicitudSDP.ID, metadata, function (response) {
                                        dialog.close();
                    
                                        dialogs.confirmDialog(
                                            dialogTitle,
                                            'Envío de solicitud exitoso',
                                            function(){
                                                mainView.router.navigate('/SolicitudesPorValidar')
                                            },
                                            false
                                        );
                    
                                    }, function (response) {
                                        var responseText = JSON.parse(response.responseText);
                                        console.log('responseText', responseText);
                    
                                        dialog.close();
                                        dialogs.infoDialog(
                                            "Error",
                                            'Hubo un problema al enviar la solicitud'
                                        )
                                    });
                                }
                            },
                            function (response) {
                                var responseText = JSON.parse(response.responseText);
                                console.log(responseText.error.message.value);
                            }
                        );
                    }

                    app.dialog.create({
                        title: dialogTitle,
                        text: '¿Desea añadir una observación a su cierre?',
                        buttons: [{
                            text: 'No',
                            onClick: function(){
                                dialogs.confirmDialog(
                                    dialogTitle,
                                    "Se validará la solicitud seleccionada",
                                    save
                                )
                            }
                        },{
                            text: 'Sí',
                            onClick: function(){
                                mths.addComment(save)
                            }
                        }],
                        verticalButtons: false
                    }).open();
                });


                $finalApprove.on('click', function (e) {
                    var dialogTitle = 'Envío a compensación'

                    function save(comentario){
                        var dialog = app.dialog.progress(dialogTitle);
                        let metadata = {
                            Estado: "Enviada a Compensación",
                            NextVal: null,
                        }

                        let pos = JSON.parse(context.items.solicitudSDP.Aprobadores).length.toString()

                        metadata["V_x00b0_B_x00b0__x0028_"+pos+"_x0029_"] = true
                        metadata["FechadeV_x00b0_B_x00b0__x0028_"+ pos +"_"] = new Date().toISOString()
                        metadata["Observacion_x0028_"+ pos +"_x0029_"] = comentario;
                        
                        let registro = ""
                        registro += "Fecha de envío: " + moment(new Date()).format("DD/MM/YYYY hh:mm") + "\n"
                        registro += "Estado de validación previo: " + context.items.solicitudSDP.Estado + "\n"
                        registro += "Estado de validación actual: " + metadata.Estado + "\n"
                        registro += "Nombre del Validador: " + plantaAdmin.NombreCompleto + "\n"
                        registro += "Cargo del Validador: " + plantaAdmin.d_cargo.NombreCargo + "\n"
                        if (comentario) registro += "Observaciones: " + comentario + "\n\n"
                        else registro += "Observaciones: Sin Observaciones\n\n"
                        registro += context.items.solicitudSDP.HistorialAprobacion ? context.items.solicitudSDP.HistorialAprobacion : ""

                        metadata.HistorialAprobacion = registro

                        spo.updateListItem(spo.getSiteUrl(), "SolicitudSDP", context.items.solicitudSDP.ID, metadata, function (response) {
                            dialog.close();
        
                            dialogs.confirmDialog(
                                dialogTitle,
                                'Envío de solicitud exitoso',
                                function(){
                                    mainView.router.navigate('/SolicitudesPorValidar')
                                },
                                false
                            );
        
                        }, function (response) {
                            var responseText = JSON.parse(response.responseText);
                            console.log('responseText', responseText);
        
                            dialog.close();
                            dialogs.infoDialog(
                                "Error",
                                'Hubo un problema al enviar la solicitud'
                            )
                        });

                    }

                    app.dialog.create({
                        title: dialogTitle,
                        text: '¿Desea añadir una observación a su envío?',
                        buttons: [{
                            text: 'No',
                            onClick: function(){
                                dialogs.confirmDialog(
                                    dialogTitle,
                                    "Se enviará la solicitud seleccionada",
                                    save
                                )
                            }
                        },{
                            text: 'Sí',
                            onClick: function(){
                                mths.addComment(save)
                            }
                        }],
                        verticalButtons: false
                    }).open();
                });

                $refuse.on('click', function (e) {
                    var dialogTitle = 'No validación de solicitud'

                    function save(comentario){
                        var dialog = app.dialog.progress(dialogTitle);
                        let metadata = {
                            Estado: "No Validada",
                            NextVal: null,
                        }

                        let pos = ''

                        if (context.items.solicitudSDP.Estado == "Última Validación"){
                            pos = JSON.parse(context.items.solicitudSDP.Aprobadores).length.toString()
                        } else {
                            pos = context.items.solicitudSDP.Estado[0]
                        }

                        metadata["V_x00b0_B_x00b0__x0028_"+pos+"_x0029_"] = false
                        metadata["FechadeV_x00b0_B_x00b0__x0028_"+ pos +"_"] = new Date().toISOString()
                        metadata["Observacion_x0028_"+ pos +"_x0029_"] = comentario ;
                        
                        let registro = ""
                        registro += "Fecha de no validación: " + moment(new Date()).format("DD/MM/YYYY hh:mm") + "\n"
                        registro += "Estado de validación previo: " + context.items.solicitudSDP.Estado + "\n"
                        registro += "Estado de validación actual: " + metadata.Estado + "\n"
                        registro += "Nombre del Validador: " + plantaAdmin.NombreCompleto + "\n"
                        registro += "Cargo del Validador: " + plantaAdmin.d_cargo.NombreCargo + "\n"
                        if (comentario) registro += "Observaciones: " + comentario + "\n\n"
                        else registro += "Observaciones: Sin Observaciones\n\n"
                        registro += context.items.solicitudSDP.HistorialAprobacion ? context.items.solicitudSDP.HistorialAprobacion : ""

                        metadata.HistorialAprobacion = registro

                        spo.updateListItem(spo.getSiteUrl(), "SolicitudSDP", context.items.solicitudSDP.ID, metadata, function (response) {
                            dialog.close();
        
                            dialogs.confirmDialog(
                                dialogTitle,
                                'No validación de solicitud exitosa',
                                function(){
                                    mainView.router.navigate('/SolicitudesPorValidar')
                                },
                                false
                            );
        
                        }, function (response) {
                            var responseText = JSON.parse(response.responseText);
                            console.log('responseText', responseText);
        
                            dialog.close();
                            dialogs.infoDialog(
                                "Error",
                                'Hubo un problema al no validar la solicitud'
                            )
                        });

                    }

                    app.dialog.create({
                        title: dialogTitle,
                        text: '¿Desea añadir una observación a su no validación?',
                        buttons: [{
                            text: 'No',
                            onClick: function(){
                                dialogs.confirmDialog(
                                    dialogTitle,
                                    "Se invalidará la solicitud seleccionada",
                                    save
                                )
                            }
                        },{
                            text: 'Sí',
                            onClick: function(){
                                mths.addComment(save)
                            }
                        }],
                        verticalButtons: false
                    }).open();
                });

                
                // remover loader
                mths.removePageLoader();
            }

            function getListInformation() {
                var loaded = {};

                context.lists = {};
                context.items = {};

                var shouldInitForms = function () {
                    if (loaded.Solicitud && loaded.Cargo && loaded.ListPlanta) {
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
                                    'select': '*, Attachments',
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

                // // Obtengo los trabajadores asociados al coordinador
                spo.getListInfo('Planta',
                    function (response) {
                //         context.items.Planta = [];
                        context.lists.Planta = response; 
                        loaded.ListPlanta = true
                        shouldInitForms();
                        
                //         // Genera la query basado en los campos que se obtubieron en la SPO anterior
                //          var query = spo.encodeUrlListQuery(context.lists.Planta, {
                //             view: 'Todos los elementos',
                //             odata: {
                //                 'filter': '(EstadoContrato ne \'Suspendido\')',
                //                 'select': '*',
                //                 'top': 5000
                //             }
                //         });

                //         spo.getListItems(spo.getSiteUrl(), 'Planta', query,
                //             function (response) {
                //                 context.items.Planta = response.d.results.length > 0 ? response.d.results : null;
                //                 loaded.Planta = true;
                //                 shouldInitForms();
                //             },
                //             function (response) {
                //                 var responseText = JSON.parse(response.responseText);
                //                 console.log(responseText.error.message.value);
                //             }
                //         );
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