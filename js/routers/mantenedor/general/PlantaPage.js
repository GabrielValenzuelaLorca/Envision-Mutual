var plantaPage = {
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
                        '<a href="#" class="link hide associate-proyect ms-fadeIn100">' +
                            '<i class="ms-Icon ms-Icon--IDBadge"></i>' +
                            '<span class="ios-only">Cargar Datos</span>' +
                        '</a>' +
                        '<a href="#" class="link close-ticket ms-fadeIn100 hide">' +
                            '<i class="ms-Icon ms-Icon--CheckMark"></i>' +
                            '<span class="ios-only">Cerrar ticket</span>' +
                        '</a>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="page-content">' +
            '<div class="header-content">' +
            '<div id="tituloFormularioMuestra" class="ms-font-xl ms-slideRightIn10" style="padding: 20px 20px 0 20px;">Formulario registro de trabajadores</div>' +
            '</div>' +
                '<div class="list accordion-list">' +
                    '<ul>'+
                        '<li class="accordion-item accordion-item-opened person"><a href="#" class="item-content item-link">'+
                            '<div class="item-inner">'+
                                '<div class="item-title">Información trabajador</div>'+
                            '</div></a>'+
                            '<div class="accordion-item-content">'+
                                '<div class="form-container form1"></div>'+
                            '</div>'+
                        '</li>'+
                        '<li class="accordion-item accordion-item-opened job"><a href="#" class="item-content item-link">'+
                            '<div class="item-inner">'+
                                '<div class="item-title">Información contrato</div>'+
                            '</div></a>'+
                        '<div class="accordion-item-content">'+
                            '<div class="form-container form2"></div>'+
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
            return 'Planta';
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
                    $sendButton = $navbar.find('.link.send'),
                    $clearButton = $navbar.find('.link.clear');
                    $Cargar = $navbar.find('.link.associate-proyect');

                // formulario de registro
                context.forms.person = new EFWForm({
                    container: $container.find('.form1'),
                    title: '',
                    editable: true,
                    fields: spo.getViewFields(context.lists.Planta, 'FormularioPlantaPersona')
                });

                // formulario de registro
                context.forms.contrato = new EFWForm({
                    container: $container.find('.form2'),
                    title: '',
                    editable: true,
                    fields: spo.getViewFields(context.lists.Planta, 'FormularioPlantaContrato')
                });

                $sendButton.removeClass('hide');
                $clearButton.removeClass('hide');

                $Cargar.on('click', function (e) {
                    context.forms.person.inputs['Rut'].setValue('11111111');
                    context.forms.person.inputs['Nombre'].setValue('Nombre');
                    context.forms.person.inputs['ApellidoPaterno'].setValue('Paterno');
                    context.forms.person.inputs['ApellidoMaterno'].setValue('Materno');
                    context.forms.person.inputs['Email'].setValue('correo@correo.cl');
                    context.forms.person.inputs['FechaNacimiento'].setValue('14/06/1999');
                    context.forms.person.inputs['Direccion'].setValue('direccion');
                    context.forms.person.inputs['Telefono'].setValue('12345678');
                    context.forms.person.inputs['EstadoCivil'].setValue([{key: 'Soltero(a)', text: 'Soltero(a)'}]);
                    context.forms.person.inputs['Nacionalidad'].setValue([{key: 'Chilena', text: 'Chilena'}]);
                    context.forms.person.inputs['AFP'].setValue([{ key: 1, text: 'CUPRUM'}]);
                    context.forms.person.inputs['Isapre'].setValue([{ key: 10, text: 'FONASA'}]);
                    context.forms.contrato.inputs['TipoContrato'].setValue([{ key: 'Indefinido', text: 'Indefinido'}]);
                    context.forms.contrato.inputs['Categoria'].setValue([{ key: 227, text: 'A-01'}]);
                    context.forms.contrato.inputs['InicioContrato'].setValue('14/06/2000');
                    context.forms.contrato.inputs['Jornada'].setValue([{key: 'Art. 22', text: 'Art. 22'}]);
                    context.forms.contrato.inputs['CentroCosto'].setValue([{key: 1031, text: '100110'}]);
                    context.forms.contrato.inputs['ClaseRol'].setValue([{key: 'Clase Rol General', text: 'Clase Rol General'}]);
                    context.forms.contrato.inputs['HorasContrato'].setValue('45');
                    context.forms.contrato.inputs['rentao_i'].setValue('fhghfh');
                    context.forms.contrato.inputs['subase_i'].setValue('ergert');
                    context.forms.contrato.inputs['AreaUnidad'].setValue('fdgsdfg');
                    context.forms.contrato.inputs['cargo'].setValue('tgfhdfh');
                    context.forms.contrato.inputs['cencos'].setValue('sgfdsgdsf');
                    context.forms.contrato.inputs['codocupa'].setValue('esrtert');
                    context.forms.contrato.inputs['cencos1'].setValue('sdfgsdfgsdf');
                    context.forms.contrato.inputs['codocupa'].setValue('sdfgsdfg');
                    context.forms.contrato.inputs['d_bienesta'].setValue('dfgsdfg');
                    context.forms.contrato.inputs['d_btc'].setValue('sdfgsdfg');
                    context.forms.contrato.inputs['d_cargo'].setValue('gdhdfghd');
                    context.forms.contrato.inputs['d_centro_d'].setValue('gfhdfh');
                    context.forms.contrato.inputs['d_seg_cesa'].setValue('dfghgh');
                    context.forms.contrato.inputs['d_seccion'].setValue('sdfgsdfg');
                    context.forms.contrato.inputs['d_serv_med'].setValue('sdf sg sdg');
                    context.forms.contrato.inputs['d_subdivis'].setValue('szfasdf asg sdg');
                    context.forms.contrato.inputs['d_unidad'].setValue('fghdfh');
                    context.forms.contrato.inputs['grado'].setValue('fgsdfgs');
                    context.forms.contrato.inputs['gradoc'].setValue('te h fd');
                    context.forms.contrato.inputs['LPago'].setValue('dsfgsdgsdfg');
                    context.forms.contrato.inputs['Nivel_Org_1'].setValue('dsfgsdfgsdf');
                    context.forms.contrato.inputs['Nivel_Org_2'].setValue('fdgsdfgsd');
                    context.forms.contrato.inputs['Nivel_Org_3'].setValue('dfsgsdfg');
                    context.forms.contrato.inputs['seccion'].setValue('fsdfgsdf');
                    context.forms.contrato.inputs['unidad'].setValue('sdfgsdfg');

                });


                $sendButton.on('click', function (e) {
                    var dialogTitle = 'Nuevo elemento';

                    function save() {
                        var dialog = app.dialog.progress(dialogTitle);
                        var person = context.forms.person.getMetadata();
                        var contrato = context.forms.contrato.getMetadata();

                        

                        var myJSON = JSON.stringify(person);

                        myJSON = myJSON.replace('}',JSON.stringify(contrato).replace('{',','));
                        var metadata = JSON.parse(myJSON);
                        metadata['EstadoContrato'] = 'Activo';

                        //General codigo payroll y eso seria

                        console.log('MEtadata', metadata)
                        spo.saveListItem(spo.getSiteUrl(), mths.getListTitle(), metadata, function (response) {
                            dialog.close();
                            
                            dialogs.confirmDialog(
                                dialogTitle,
                                'Creado con éxito',
                                function(component, item){
                                    leftView.router.refreshPage();
                                    mainView.router.navigate('/plantaStream');
                                },
                                false
                            )
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

                    context.forms.person.checkFieldsRequired();
                    context.forms.contrato.checkFieldsRequired();
                    var validate = context.forms.person.getValidation();
                    var validata2 = context.forms.contrato.getValidation();

                    if (validate && validata2) {
                        app.dialog.create({
                            title: dialogTitle,
                            text: 'Se creará una nuevo trabajador.',
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
                            text: 'Para crear un nuevo trabajador debe completar todos los campos obligatorios.',
                            buttons: [{
                                text: 'Aceptar'
                            }],
                            verticalButtons: false
                        }).open();
                    }

                });

                $clearButton.on('click', function (e){
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
                    if (loaded.Planta) {
                        initForm();
                    }
                };

                // Obtener información de lista
                spo.getListInfo(mths.getListTitle(),
                    function (response) {
                        context.items.Planta = [];
                        context.lists.Planta = response;
                        loaded.Planta = true;
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