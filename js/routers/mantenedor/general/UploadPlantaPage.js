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

                    function activarCargaPendiente(){

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
                    }

                    function PrepareToSend(item){
                        return {
                            "ID": item.ID ? ''+item.ID : '0',
                            "Title": item.codigo.trim(),
                            "Rut": item.rut1.trim(),
                            "Nombre": item.nombre.trim(),
                            "ApellidoPaterno": item.paterno.trim(),
                            "ApellidoMaterno": item.materno.trim(),
                            "Email": item['Correo Mutual'] ? item['Correo Mutual'] : "",
                            "FechaNacimiento": numeroAFecha(item.fecha_nac),
                            "Sexo": item.sexo.trim().toUpperCase(),
                            "Direccion": item.direccion,
                            "Telefono": item.celular.replace(' ', ''),
                            "EstadoContrato": "Activo",
                            "InicioContrato": numeroAFecha(item.fecha_ing),
                            "FinContrato": numeroAFecha(item.fecha_ret),
                            "MotivoRetiro": item.d_moti_ret.trim(),
                            "HorasContrato": item.horas,
                            "EstadoCivil": item.est_civil,
                            "AFPId": item.cod_afp,
                            "IsapreId": item.cod_isa,
                            "TipoContrato": item.tipcon.toUpperCase() == 'I' ? 'Indefinido' : 'Reemplazo',
                            "Nacionalidad": item.sa,
                            "CategoriaId": item.catego,
                            "Jornada": item.Jornada,
                            "Sindicato": item.d_cod_sin,
                            "ClaseRol": item.d_rol,
                            "Nivel_Org_1": item.Nivel_Org_1,
                            "Nivel_Org_2": item.Nivel_Org_2,
                            "Nivel_Org_3": item.Nivel_Org_3,
                            "AreaUnidad": item.area_unida,
                            "LPago": item.lpago,
                            "d_subdivis": item.d_subdivis,
                            "unidad": item.unidad,
                            "d_unidad": item.d_unidad,
                            "cencos": item.cencos,
                            "cencos1": item.cencos1,
                            "d_centro_d": item.d_centro_d,
                            "posicion": item.posicion,
                            "cargo": item.cargo,
                            "d_cargo": item.d_cargo,
                            "seccion": item.seccion,
                            "d_seccion": item.d_seccion,
                            "grado": item.grado,
                            "d_bienesta": item.d_bienesta,
                            "gradoc": item.gradoc,
                            "d_serv_med": item.d_serv_med,
                            "codocupa": item.codocupa,
                            "d_btc": item.d_btc,
                            "d_seg_cesa": item.d_seg_cesa,
                            "ames": item.ames,
                            "peri": item.peri,
                            "rentao_i": item.rentao_i,
                            "subase_i": item.subase_i,
                            "Aprobador1": item['Aprobador 1'],
                            "Aprobador2": item['Aprobador 2'],
                            "Aprobador3": item['Aprobador 3'],
                            "Aprobador4": item['Aprobador 4'],
                            "Aprobador5": item['Aprobador 5'],
                            "Aprobador6": item['Aprobador 6'],
                            "Aprobador7": item['Aprobador 7'],
                            "Aprobador8": item['Aprobador 8'],
                            "CentroCostoId": item.d_nro_cenc
                        }
                    }

                    function callServiceCargaMasivaPlanta(body){
                        console.log('Body', JSON.stringify(body))
                        fetch(global.uris[global.env].planta, {
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

                    function save() {
                        var dialog = app.dialog.progress(dialogTitle);

                        files = file.files
                        handleExcelFromInput(files, 
                            function(response){
                                //contadores y linea actual del prosesamiento
                                var linea = 2;

                                //Arreglos donde quedaran los datos
                                var Agregar = [];
                                var Actualizar = [];
                                var Quitar = [];
                                var SinCambios = [];

                                //Variable donde se guardan los errores
                                var errores = [];

                                //     --------- Inicio de proceso de filtrado----------- // 

                                //Filtramos los que no existen en sharepoint y si en Excel
                                response[0].map(function(fila){
                                    let existe = context.items.Planta.filter(planta => planta.Title.trim() == fila.codigo.trim());
                                    
                                    //Validamos si se encontro la fila en la planta segun el codigo ingresado
                                    if(existe.length > 0){
                                        //Valida si existen cambios en el contrato. Si hay cambios actualiza los datos de la fila.
                                        
                                        if(existe[0].TipoContrato.charAt(0).toLowerCase() != fila.tipcon.trim().charAt(0).toLowerCase() ||  existe[0].cargo == null ){
                                            //Validacion del bug de Reemplazo que en excel se trata como F
                                            if((existe[0].TipoContrato.charAt(0).toLowerCase() == 'r') && (fila.tipcon.trim().charAt(0).toLowerCase() == 'f') ){
                                                SinCambios.push(existe[0]);
                                                return;
                                            }
                                            fila.ID = existe[0].ID;

                                            //Si no existe se procede a crear el nuevo trabajador

                                            //Obtenemos el ID de la categoria con el nombre completo de esta.
                                            var categoria = context.items.Categoria.filter(function(c){
                                                return c.Categoria.replace(' ','').replace('-','') == limpiarString(fila.d_catego);                                            
                                            });

                                            //Obtenemos el ID interno de la afp.
                                            var AFP = context.items.AFP.filter(function(c){
                                                return c.Title == fila.cod_afp;                                            
                                            });

                                            //Obtenemos el ID interno de Isapre
                                            var Isapre = context.items.Isapre.filter(function(c){
                                                return c.Title == fila.cod_isa;                                            
                                            });

                                            //Obtenemos el ID interno de Centro Costo
                                            var CC = context.items.CentroCosto.filter(function(c){
                                                return c.CodigoCC == fila.d_nro_cenc;                                            
                                            });

                                            //Obtenemos el ID interno de Centro Costo
                                            var Cargo = context.items.Cargo.filter(function(c){
                                                return c.CodigoPayroll == fila.cargo;                                            
                                            });

                                            //Validamos si se encontro. Si no se encontro se almacena la linea del error y el detalle

                                            //Validacion Para Categoria
                                            if(categoria.length == 0){
                                                errores.push([{
                                                    "Linea" : linea++, 
                                                    "error": "No se encontro la categoria en los registros de sharepoint. Categoria" + fila.d_catego
                                                }]);
                                                return;
                                            }else{
                                                fila.catego = categoria[0].ID;
                                            }

                                            //Validacion PAra AFP
                                            if(AFP.length == 0){
                                                errores.push([{
                                                    "Linea" : linea++, 
                                                    "error": "No se encontro la AFP en los registros de sharepoint"
                                                }]);
                                                return;
                                            }else{
                                                fila.cod_afp = AFP[0].ID;
                                            }

                                            //Validacion PAra Isapre
                                            if(Isapre.length == 0){
                                                errores.push([{
                                                    "Linea" : linea,
                                                    "error": "No se encontro la Isapre en los registros de sharepoint"
                                                }]);
                                                return;
                                            }else{
                                                fila.cod_isa = Isapre[0].ID;
                                            }

                                            if(CC.length == 0){
                                                errores.push([{
                                                    "Linea" : linea,
                                                    "error": "No se encontro el Centro de en los registros de sharepoint" + fila.d_nro_cenc
                                                }]);
                                                return;
                                            }else{
                                                fila.d_nro_cenc = CC[0].ID;
                                            }

                                            if(Cargo.length == 0){
                                                errores.push([{
                                                    "Linea" : linea,
                                                    "error": "No se encontro el Centro de en los registros de sharepoint" + fila.d_cargo
                                                }]);
                                                return;
                                            }else{
                                                fila.d_cargo = Cargo[0].ID;
                                            }

                                            Actualizar.push(PrepareToSend(fila));
                                        }else{
                                            SinCambios.push(existe[0]);
                                            return;
                                        }
                                    }else{
                                        //Si no existe se procede a crear el nuevo trabajador

                                        //Obtenemos el ID de la categoria con el nombre completo de esta.
                                        var categoria = context.items.Categoria.filter(function(c){
                                            return c.Categoria.replace(' ','').replace('-','') == limpiarString(fila.d_catego);                                            
                                        });

                                        //Obtenemos el ID interno de la afp.
                                        var AFP = context.items.AFP.filter(function(c){
                                            return c.Title == fila.cod_afp;                                            
                                        });

                                        //Obtenemos el ID interno de Isapre
                                        var Isapre = context.items.Isapre.filter(function(c){
                                            return c.Title == fila.cod_isa;                                            
                                        });

                                        //Obtenemos el ID interno de Centro Costo
                                        var CC = context.items.CentroCosto.filter(function(c){
                                            return c.CodigoCC == fila.d_nro_cenc;                                            
                                        });
                                        
                                        //Obtenemos el ID interno de Centro Costo
                                        var Cargo = context.items.Cargo.filter(function(c){
                                            return c.CodigoPayroll == fila.cargo;                                            
                                        });

                                        //Validamos si se encontro. Si no se encontro se almacena la linea del error y el detalle

                                        //Validacion Para Categoria
                                        if(categoria.length == 0){
                                            errores.push([{
                                                "Linea" : linea++, 
                                                "error": "No se encontro la categoria en los registros de sharepoint. Categoria " + fila.d_catego
                                            }]);
                                            return;
                                        }else{
                                            fila.catego = categoria[0].ID;
                                        }

                                        //Validacion PAra AFP
                                        if(AFP.length == 0){
                                            errores.push([{
                                                "Linea" : linea++, 
                                                "error": "No se encontro la AFP en los registros de sharepoint"
                                            }]);
                                            return;
                                        }else{
                                            fila.cod_afp = AFP[0].ID;
                                        }

                                         //Validacion PAra Isapre
                                        if(Isapre.length == 0){
                                            errores.push([{
                                                "Linea" : linea,
                                                "error": "No se encontro la Isapre en los registros de sharepoint"
                                            }]);
                                            return;
                                        }else{
                                            fila.cod_isa = Isapre[0].ID;
                                        }

                                        if(CC.length == 0){
                                            errores.push([{
                                                "Linea" : linea,
                                                "error": "No se encontro el Centro de en los registros de sharepoint. Numero CC: " + fila.d_nro_cenc
                                            }]);
                                            return;
                                        }else{
                                            fila.d_nro_cenc = CC[0].ID;
                                        }

                                        if(Cargo.length == 0){
                                            errores.push([{
                                                "Linea Excel" : linea,
                                                "error": "No se encontro el Centro de en los registros de sharepoint. Nombre Cargo Planta: " + fila.d_cargo
                                            }]);
                                            return;
                                        }else{
                                            fila.d_cargo = Cargo[0].ID;
                                        }

                                
                                        //Agregamos la fila al arreglo de creacion
                                        Agregar.push(PrepareToSend(fila));
                                        linea++;
                                    }
                                });


                                //Filtramos los que no estan en excel y si en sharepoint
                                context.items.Planta.map(function(item){
                                    let existe = response[0].filter(fila => item.Title == fila.codigo.trim());

                                    //Si no hay coincidencias se agrega el ID para actualizar el registro a suspendido.0
                                    if(existe.length == 0 && item.EstadoContrato == 'Activo'){        
                                        Quitar.push(item.ID);
                                    }
                                });

                                let resultado = [];

                                resultado[0] = Agregar;
                                resultado[1] = Quitar;
                                resultado[2] = Actualizar;
                                resultado[3] = {'Email': spo.getCurrentUser()['EMail']};

                                if(resultado[0].length == 0 && resultado[1].length == 0 && resultado[2].length == 0){
                                    dialog.close();
                                    app.dialog.create({
                                        title: 'Completado',
                                        text: 'No se encontraron cambios entre la planta actual y la cargada via Excel.',
                                        buttons: [{
                                            text: 'Aceptar',
                                            onClick: function () {
                                                mainView.router.navigate('/liststream?title=Planta&listtitle=Planta&listview=Todos los elementos&panel=filter-open&template=list-row&context=');
                                                return;
                                            }
                                        }],
                                        verticalButtons: false
                                    }).open();
                                }else{
                                    //Si hay errores se muestra Alert
                                    if( errores.length > 0){
                                        dialog.close();
                                        app.dialog.create({
                                            title: 'Error',
                                            text: 'Se Encontraron errores',
                                            buttons: [{
                                                text: 'Aceptar',
                                                onClick: function () {
                                                    console.log('Errores', JSON.stringify(errores))
                                                    return;
                                                }
                                            }],
                                            verticalButtons: false
                                        }).open();
                                    }else{
                                        callServiceCargaMasivaPlanta(resultado);
                                        //Activamos el estado global de carga de planta
                                        activarCargaPendiente();
                                        dialog.close();
                                        app.dialog.create({
                                            title: dialogTitle,
                                            text: 'En estos momentos se esta procesando su planta. Cuando finalice el proceso sera notificado via email',
                                            buttons: [{
                                                text: 'Aceptar',
                                                onClick: function () {
                                                    mainView.router.navigate('/plantaStream');
                                                }
                                            }],
                                            verticalButtons: false
                                        }).open();
                                    }
                                }
    
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

                    switch(file.files.length) {
                        case 1:
                            let type = file.files[0].name.split('.').pop();
                            if(type == 'xlsx'){
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
                            }else{
                                app.dialog.create({
                                    title: 'Atención',
                                    text: `Formato invalido, asegure que su archivo sea de tipo excel(.xlsx)`,
                                    buttons: [{
                                        text: 'Ok'
                                    }],
                                    verticalButtons: false
                                }).open();
                            }
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
                    if (loaded.Cargo = true && loaded.lista && loaded.globalState && loaded.Planta && loaded.Isapre && loaded.AFP && loaded.Categoria && loaded.CentroCosto) {
                        initForm();
                    }
                };

                // Obtener información de lista
                spo.getListInfo('Cargo',
                function (response) {
                    context.items.Cargo = [];
                    context.lists.Cargo = response;
                    //loaded.listaItemVariable = true;
                    
                    // Si existe el id de algún item a obtener

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

                // Obtener información de lista
                spo.getListInfo('Planta',
                function (response) {
                    context.items.Planta = [];
                    context.lists.Planta = response;
                    //loaded.listaItemVariable = true;
                    
                    // Si existe el id de algún item a obtener

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

                // Obtener información de lista
                spo.getListInfo('Categoria',
                function (response) {
                    context.items.Categoria = [];
                    context.lists.Categoria = response;
                    //loaded.listaItemVariable = true;
                    
                    // Si existe el id de algún item a obtener

                        var query = spo.encodeUrlListQuery(context.lists.Categoria, {
                            view: 'Todos los elementos',
                            odata: {
                                'select': '*',
                                'top': 5000
                            }
                        });

                        spo.getListItems(spo.getSiteUrl(), 'Categoria', query,
                            function (response) {
                                context.items.Categoria = response.d.results.length > 0 ? response.d.results : null;
                                loaded.Categoria = true;
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

                // Obtener información de lista
                spo.getListInfo('CentroCosto',
                function (response) {
                    context.items.CentroCosto = [];
                    context.lists.CentroCosto = response;
                    //loaded.listaItemVariable = true;
                    
                    // Si existe el id de algún item a obtener

                        var query = spo.encodeUrlListQuery(context.lists.CentroCosto, {
                            view: 'Todos los elementos',
                            odata: {
                                'select': '*',
                                'top': 5000
                            }
                        });

                        spo.getListItems(spo.getSiteUrl(), 'CentroCosto', query,
                            function (response) {
                                context.items.CentroCosto = response.d.results.length > 0 ? response.d.results : null;
                                loaded.CentroCosto = true;
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

                // Obtener información de lista
                spo.getListInfo('AFP',
                function (response) {
                    context.items.AFP = [];
                    context.lists.AFP = response;
                    //loaded.listaItemVariable = true;
                    
                    // Si existe el id de algún item a obtener

                        var query = spo.encodeUrlListQuery(context.lists.AFP, {
                            view: 'Todos los elementos',
                            odata: {
                                'select': '*',
                                'top': 5000
                            }
                        });

                        spo.getListItems(spo.getSiteUrl(), 'AFP', query,
                            function (response) {
                                context.items.AFP = response.d.results.length > 0 ? response.d.results : null;
                                loaded.AFP = true;
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

                // Obtener información de lista
                spo.getListInfo('Isapre',
                function (response) {
                    context.items.Isapre = [];
                    context.lists.Isapre = response;
                    //loaded.listaItemVariable = true;
                    
                    // Si existe el id de algún item a obtener

                        var query = spo.encodeUrlListQuery(context.lists.Isapre, {
                            view: 'Todos los elementos',
                            odata: {
                                'select': '*',
                                'top': 5000
                            }
                        });

                        spo.getListItems(spo.getSiteUrl(), 'Isapre', query,
                            function (response) {
                                context.items.Isapre = response.d.results.length > 0 ? response.d.results : null;
                                loaded.Isapre = true;
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