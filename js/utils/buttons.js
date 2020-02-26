localButtons = {}
function refresh(){
    mainView.router.refreshPage();
    leftView.router.refreshPage();
}

function buildInCaml(array, type){
    var query = '';
    array.forEach(function(element) {
        var value = '<Value Type="'+ type +'">'+ element +'</Value>'
        query = query + value;
    });
    return query;
}

function generateXLSX(sheetnames, filename, aoa, protected, colSizes, success, failure){
    var wb = XLSX.utils.book_new();

    if (sheetnames.length == aoa.length){
        aoa.forEach(element => {
            let ws = XLSX.utils.json_to_sheet(element);
            
            let sheetname = sheetnames[aoa.indexOf(element)];

            if (colSizes) {
                if(colSizes.length == aoa.length){
                    let colSize = colSizes[aoa.indexOf(element)];
                    ws["!cols"] = colSize;
                } else {
                    failure(JSON.stringify({"Error": "El numero de formato de hojas no es compatible"}));
                }
            }
            if (protected) ws['!protect'] = {objects:true, scenarios: true}            

            XLSX.utils.book_append_sheet(wb, ws, sheetname);
        });

        if (filename){
            XLSX.writeFile(wb, filename +'.xlsx');
        } else {
            XLSX.writeFile(wb, "Excel" +'.xlsx');
        }
        success();

    } else {
        failure(JSON.stringify({"Error": "El numero de hojas es diferente al entregado"}));
    }
}
// Planta buttons
localButtons.fileButton = function(){
    button = {
        text: 'Cargar Planta',
        class: 'uploadPlanta',
        icon: 'ExcelLogo',
        onClick: function(component, item){
            mainView.router.navigate(encodeURI('/uploadPlanta'));
        }
    }
    return button
}

// Periodo buttons
localButtons.addPeriodButton = function(context){
    button = {
        text: 'Añadir Periodo',
        class: 'addPeriodo',
        icon: 'Add',
        onClick: function(component, item){
            var query = spo.encodeUrlListQuery(context.list, {
                view: 'Todos los elementos',
                odata: {
                    'filter': '(Activo eq 1)'
                }
            });
            spo.getListItems(spo.getSiteUrl(), context.list.Title, query,
                function (response) {
                    if (response.d.results.length>0){
                        dialogs.infoDialog(
                            'No se puede añadir un nuevo periodo',
                            'Hay otro periodo activo'
                        )
                    } else {
                        mainView.router.navigate(encodeURI('/periodo'));        
                    }
                },
                function (response) {
                    var responseText = JSON.parse(response.responseText);
                    console.log(responseText.error.message.value);
                }
            );
        }
    }
    return button
}

localButtons.editPeriodButton = function(){
    button = {
        text: 'Editar',
        class: 'editPeriodo',
        icon: 'Edit',
        onClick: function(component, item){
            mainView.router.navigate('/periodo?listItemId='+item.ID);        
        }
    }
    return button
}
localButtons.desactivatePeriodoButton = function(){
    button = {
        text: 'Desactivar Periodo',
        class: 'desactivatePeriodo',
        icon: 'PowerButton',
        onClick: function(component, item){
            var dialogTitle = 'Desactivando periodo';
            function save() {
                var dialog = app.dialog.progress(dialogTitle);

                spo.updateListItem(spo.getSiteUrl(), "Periodo", item.ID, {"Activo":false}, function (response) {
                    dialog.close()
                    dialogs.confirmDialog(
                        dialogTitle,
                        'Desactivado con éxito',
                        refresh,
                        false
                    )

                }, function (response) {
                    var responseText = JSON.parse(response.responseText);
                    console.log('responseText', responseText);

                    dialog.close();
                    dialogs.infoDialog(
                        'Error al guardar el periodo',
                        responseText.error.message.value,
                    )
                });
            }
            dialogs.confirmDialog(
                dialogTitle,
                'Se desactivará el periodo seleccionado.',
                save
            )
        }
    }
    return button
}
localButtons.activatePeriodoButton = function(context){
    button = {
        text: 'Activar Periodo',
        class: 'activatePeriodo',
        icon: 'PowerButton',
        onClick: function(component, item){
            var query = spo.encodeUrlListQuery(context.list, {
                view: 'Todos los elementos',
                odata: {
                    'filter': '(Activo eq 1)'
                }
            });

            spo.getListItems(spo.getSiteUrl(), context.list.Title, query,
                function (response) {
                    if (response.d.results.length>0){
                        dialogs.infoDialog(
                            'No se puede activar este periodo',
                            "Hay otro periodo activo"
                        )
                    } else {
                        var dialogTitle = 'Activando periodo';
                        function save() {
                            var dialog = app.dialog.progress(dialogTitle);

                            spo.updateListItem(spo.getSiteUrl(), "Periodo", item.ID, {"Activo":true}, function (response) {
                                dialog.close();
                                dialogs.confirmDialog(
                                    dialogTitle,
                                    'Activado con éxito',
                                    refresh,
                                    false
                                )

                            }, function (response) {
                                var responseText = JSON.parse(response.responseText);
                                console.log('responseText', responseText);

                                dialog.close();
                                dialogs.infoDialog(
                                    'Error al guardar el periodo',
                                    responseText.error.message.value
                                )
                            });
                        }
                        dialogs.confirmDialog(
                            dialogTitle,
                            'Se activará el periodo seleccionado.',
                            save
                        )
                    }
                },
                function (response) {
                    var responseText = JSON.parse(response.responseText);
                    console.log(responseText.error.message.value);
                }
            );
        }
    }
    return button
}

// Item Variable buttons
localButtons.sendButton = function(context){
    button = {
        text: 'Enviar Items',
        class: 'sendItems',
        icon: 'MailForward',
        onClick: function(component, item){
            var dialogTitle = 'Enviando informe de items';
            function save(){
                var dialog = app.dialog.progress(dialogTitle);
                var query = spo.encodeUrlListQuery(context.list, {
                    view: 'Todos los elementos',
                    odata: {
                        'filter': '(CoordinadorId eq '+ context.coorId +' and PeriodoId eq '+ context.periodId +')',
                        'top': 5000
                    }
                });
                // Se seleccionan los items asociado al coordinador en el periodo
                spo.getListItems(spo.getSiteUrl(), context.list.Title, query,
                    function (response) {
                        if (response.d.results.length > 0){
                            // Creación Json de haberes
                            JsonHaberes = JSON.stringify(response);
                            // Se crea un nuevo informe
                            metadata = {
                                PeriodoId: context.periodId,
                                CoordinadorId: context.coorId,
                                Estado: "Enviado para aprobar",
                                Haberes: JsonHaberes,
                                Cantidad: response.d.results.length
                            }
                            spo.saveListItem(spo.getSiteUrl(), "Informe Haberes", metadata, 
                                function (response){
                                    dialog.close();
                                    dialogs.confirmDialog(
                                        dialogTitle,
                                        'Informe enviado con éxito a ' + context.Aprobador,
                                        function(){
                                            mainView.router.navigate(encodeURI('/liststream?title=Informes Desaprobados&listtitle=Informe Haberes&listview=Pendientes&panel=filter-close&template=list-row&context='));
                                            leftView.router.refreshPage();
                                        },
                                        false
                                    );
                                },
                                function(){
                                    var responseText = JSON.parse(response.responseText);
                                    console.log(responseText.error.message.value);
                                    dialog.close();
                                    dialogs.infoDialog(
                                        'Hubo un error al enviar el informe',
                                        responseText.error.message.value,
                                    )
                                }
                            );
                        } else {
                            dialog.close();
                            dialogs.infoDialog(
                                'Hubo un error al enviar el informe',
                                'No tienes items variables para enviar',
                            )
                        }
                    },
                    function (response) {
                        var responseText = JSON.parse(response.responseText);
                        console.log(responseText.error.message.value);
                        dialog.close();
                        dialogs.infoDialog(
                            'Hubo un error al enviar el informe',
                            responseText.error.message.value,
                        )
                    }
                );
            }
            dialogs.confirmDialog(
                dialogTitle,
                '¿Está seguro de enviar el informe de items? Luego no podrá editar este informe',
                save
            )
        }
    }
    return button
}

// Informe buttons
localButtons.disableItemSended = function(context){
    button = {
        text: 'Desaprobar',
        class: 'desaprobarPeriodo',
        icon: 'Delete',
        onClick: function(component, item){
            var dialogTitle = 'Desaprobando informe';
            abrirPopup();
            function save(comment) {
                var dialog = app.dialog.progress(dialogTitle);
                var metadata = {Estado: "Desaprobado"};
                if (admin == "Aprobador"){
                    metadata.Comentario = comment;
                } else if (admin == "Administrador"){
                    metadata.ComentarioAdmin = comment;
                }

                spo.updateListItem(spo.getSiteUrl(), "Informe Haberes", item.ID, metadata, function (response) {
                    dialog.close()
                    dialogs.confirmDialog(
                        'Informe Desaprobado',
                        'Informe desaprobado con éxito',
                        refresh,
                        false
                    )

                }, function (response) {
                    var responseText = JSON.parse(response.responseText);
                    console.log('responseText', responseText);

                    dialog.close();
                    dialogs.infoDialog(
                        'Error al desaprobar el informe.',
                        responseText.error.message.value,
                    )
                });
            }

            //Abrir formulario de correo
            function abrirPopup(){
                                        
                // Inyectar HTML
                var dynamicPopup = app.popup.create({
                    content: `
                        <div class="popup send-email-popup" style="overflow:auto">
                            <div class="close-popup close-button"><i class="ms-Icon ms-Icon--ChromeClose" aria-hidden="true"></i></div>
                            <div class="block">
                                <div class="update-form" style="margin-top: 10px !important;"></div>
                                <div class="buttons-container ms-slideLeftIn10 hide">
                                    <button class="button button-fill close-popup">Cancelar</button>
                                    <button class="button button-fill send">Rechazar</button>
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
                                title: 'Justificación de desaprobación'.bold(),
                                editable: true,
                                description: 'Ingrese la razón de desaprobación.',
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
                                if(form.getValidation()){
                                    var comentarioRechazo = form.getMetadata();

                                    console.log(form.getMetadata().ComentarioVirtual);
                                                                    
                                    // cerrar popover
                                    popup.close();
    
                                    save(comentarioRechazo.ComentarioVirtual);
                                }
                                
                            })
                        },
                        closed: function (popup) {
                            if (form) form.destroy();
                        },
                    },
                });

                dynamicPopup.open();
            }
        }
    }
    return button
}

localButtons.approveItemSended = function(context){
    button = {
        text: 'Aprobar',
        class: 'aprobarPeriodo',
        icon: 'Accept',
        onClick: function(component, item){
            var dialogTitle = 'Aprobando informe';
            function save() {
                var dialog = app.dialog.progress(dialogTitle);

                spo.updateListItem(spo.getSiteUrl(), "Informe Haberes", item.ID, {"Estado":"Aprobado y enviado a administración", "FechaAprobacion":"lafecha"}, function (response) {
                    dialog.close()
                    dialogs.confirmDialog(
                        dialogTitle,
                        'Informe aprobado con éxito',
                        refresh,
                        false
                    )

                }, function (response) {
                    var responseText = JSON.parse(response.responseText);
                    console.log('responseText', responseText);

                    dialog.close();
                    dialogs.infoDialog(
                        'Error al aprobar el informe.',
                        responseText.error.message.value,
                    )
                });
            }
            dialogs.confirmDialog(
                dialogTitle,
                'Se aprobará el informe seleccionado.',
                save
            )
        }
    }
    return button
}

localButtons.approveAdminItemSended = function(context){
    button = {
        text: 'Aprobar',
        class: 'aprobarPeriodo',
        icon: 'Accept',
        onClick: function(component, item){
            var dialogTitle = 'Aprobando informe';
            function save() {
                var dialog = app.dialog.progress(dialogTitle);

                spo.updateListItem(spo.getSiteUrl(), "Informe Haberes", item.ID, {"Estado":"Aprobado por administración"}, function (response) {
                    dialog.close()
                    dialogs.confirmDialog(
                        dialogTitle,
                        'Informe aprobado con éxito',
                        refresh,
                        false
                    )

                }, function (response) {
                    var responseText = JSON.parse(response.responseText);
                    console.log('responseText', responseText);

                    dialog.close();
                    dialogs.infoDialog(
                        'Error al aprobar el informe.',
                        responseText.error.message.value,
                    )
                });
            }
            dialogs.confirmDialog(
                dialogTitle,
                'Se aprobará el informe seleccionado.',
                save
            )
        }
    }
    return button
}

localButtons.requireJustificationItem = function(context){ 
    button = {
        text: 'Solicitar Justificación',
        class: 'requireJustification',
        icon: 'CannedChat',
        onClick: function(component, item){
            var dialogTitle = 'Solicitando Justificación';
            function save() {
                var dialog = app.dialog.progress(dialogTitle);

                spo.updateListItem(spo.getSiteUrl(), "Informe Haberes", item.ID, {"Estado":"En espera de justificación"}, function (response) {
                    dialog.close()
                    dialogs.confirmDialog(
                        dialogTitle,
                        'Solicitud enviada con éxito',
                        refresh,
                        false
                    )

                }, function (response) {
                    var responseText = JSON.parse(response.responseText);
                    console.log('responseText', responseText);

                    dialog.close();
                    dialogs.infoDialog(
                        'Error al solicitar justificación',
                        responseText.error.message.value,
                    )
                });
            }
            dialogs.confirmDialog(
                dialogTitle,
                'Se solicitará una justificación al informe',
                save
            )
        }
    }
    return button
}

localButtons.sendJustification = function(context){
    button = {
        text: 'Enviar Justificación',
        class: 'sendJustification',
        icon: 'ActivityFeed',
        onClick: function(component, item){
            var dialogTitle = 'Enviando Justificación';
            abrirPopup();
            function save(comment) {
                var dialog = app.dialog.progress(dialogTitle);

                spo.updateListItem(spo.getSiteUrl(), "Informe Haberes", item.ID, { Estado: "Aprobado y enviado a administración", Justificaci_x00f3_n: comment }, function (response) {
                    dialog.close()
                    dialogs.confirmDialog(
                        dialogTitle,
                        'Justificación enviada con éxito',
                        refresh,
                        false
                    )

                }, function (response) {
                    var responseText = JSON.parse(response.responseText);
                    console.log('responseText', responseText);

                    dialog.close();
                    dialogs.infoDialog(
                        'Error al enviar justificación',
                        responseText.error.message.value,
                    )
                });
            }

            //Abrir formulario de correo
            function abrirPopup(){
                                        
                // Inyectar HTML
                var dynamicPopup = app.popup.create({
                    content: `
                        <div class="popup send-email-popup" style="overflow:auto">
                            <div class="close-popup close-button"><i class="ms-Icon ms-Icon--ChromeClose" aria-hidden="true"></i></div>
                            <div class="block">
                                <div class="update-form" style="margin-top: 10px !important;"></div>
                                <div class="buttons-container ms-slideLeftIn10 hide">
                                    <button class="button button-fill close-popup">Cancelar</button>
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
                                title: 'Justificación'.bold(),
                                editable: true,
                                description: 'Ingrese su justificación.',
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
                                if(form.getValidation()){
                                    var justificacion = form.getMetadata();

                                    console.log(form.getMetadata().ComentarioVirtual);
                                                                    
                                    // cerrar popover
                                    popup.close();
    
                                    save(justificacion.ComentarioVirtual);
                                }
                                
                            })
                        },
                        closed: function (popup) {
                            if (form) form.destroy();
                        },
                    },
                });

                dynamicPopup.open();
            }
        }
    }
    return button
}

localButtons.downloadInformeCoord = function(context){
    button = {
        text: 'Descargar Informe',
        class: 'informeDownload',
        icon: 'ExcelLogo',
        onClick: function(component, item){
            var dialogTitle = 'Descargando informe';
            function save() {
                var dialog = app.dialog.progress(dialogTitle);
                var query = spo.encodeUrlListQuery(context.list, {
                    view: 'Todos los elementos',
                    odata: {
                        'filter': '(ID eq '+ item.ID +')'
                    }
                });
                spo.getListItems(spo.getSiteUrl(), context.list.Title, query,
                    function (response) {
                        let haberes = JSON.parse(response.d.results[0].Haberes);
                        let periodoName = "Periodo_"+response.d.results[0].Periodo.MesCalculado+"_"+response.d.results[0].Periodo.AnioCalculado;
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
                    },
                    function (response) {
                        var responseText = JSON.parse(response.responseText);
                        console.log(responseText.error.message.value);
                    }
                );
            }
            dialogs.confirmDialog(
                dialogTitle,
                'Se descargará un documento Excel con la información del informe seleccionado',
                save
            )
        }
    }
    return button
}

localButtons.downloadInformeAdmin = function(context){
    button = {
        text: 'Descargar Informe',
        class: 'informeDownload',
        icon: 'ExcelLogo',
        onClick: function(component, item){
            var dialogTitle = 'Descargando informe';
            function save() {
                var dialog = app.dialog.progress(dialogTitle);
                var query = spo.encodeUrlListQuery(context.list, {
                    view: 'Todos los elementos',
                    odata: {
                        'filter': '(ID eq '+ item.ID +')'
                    }
                });
                spo.getListItems(spo.getSiteUrl(), context.list.Title, query,
                    function (response) {
                        var informe = response.d.results[0];
                        spo.getListInfo('Coordinador',
                            function (response) {
                                var query = spo.encodeUrlListQuery(response, {
                                    view: 'Todos los elementos',
                                    odata: {
                                        'filter': '(ID eq '+ informe.CoordinadorId +')'
                                    }
                                });
                                spo.getListItems(spo.getSiteUrl(), "Coordinador", query,
                                    function (response) {
                                        // Crear Book y sheets
                                        var wb = XLSX.utils.book_new();
                                        var coordinador = response.d.results[0];
                                        
                                        let headersItems = [["COD_PAYROLL","RUT","ITEM VARIABLE","CANT_$MONTO","NOMBRE","CONTRATO","CARGO","CCOSTO","OBSERVACIÓN/JUSTIFICACIÓN"]]
                
                                        // Se extrae la informacion
                                        let haberes = JSON.parse(informe.Haberes);
                                        let periodoName = "Coordinador_"+informe.Coordinador.Title+"_"
                                        periodoName+="Periodo_"+informe.Periodo.MesCalculado+"_"+informe.Periodo.AnioCalculado;
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
                                            ["Nombre del coordinador", coordinador.Title],
                                            ["Codigo payroll", coordinador.Planta.Title],
                                            ["Centro costo", coordinador.CentroCosto.CodigoCC],
                                            ["Jefe Aprobador", coordinador.Aprobador.Nombre],
                                            ["Correo Jefe Aprobador", coordinador.Aprobador.Title],
                                            ["Fecha de envío de informe",moment(informe.Created).format("DD/MM/YYYY hh:mm")],
                                            ["Fecha de aprobación",moment(informe.FechaAprobacion).format("DD/MM/YYYY hh:mm")],
                                            ["Número de items", informe.Cantidad.toString()],
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
                    },
                    function (response) {
                        var responseText = JSON.parse(response.responseText);
                        console.log(responseText.error.message.value);
                    }
                );
            }
            dialogs.confirmDialog(
                dialogTitle,
                'Se descargará un documento Excel con la información del informe seleccionado',
                save
            )
        }
    }
    return button
}

localButtons.downloadInformeComplete = function(context){
    button = {
        text: 'Descargar Informe Completo',
        class: 'informeDownload',
        icon: 'ExcelLogo',
        onClick: function(component, item){
            var dialogTitle = 'Descargando informe';
            function save() {
                var dialog = app.dialog.progress(dialogTitle);
                var query = spo.encodeUrlListQuery(context.list, {
                    view: 'Todos los elementos',
                    odata: {
                        'filter': '(Estado eq \'Aprobado por administración\')'
                    }
                });
                spo.getListItems(spo.getSiteUrl(), context.list.Title, query,
                    function (response) {
                        var informes = response.d.results;
                       
                        // Crear Book y sheets
                        var wb = XLSX.utils.book_new();
                        // var coordinador = response.d.results[0];
                        
                        let items = [["COD_PAYROLL","ITEM VARIABLE","CANT_$MONTO","NOMBRE","RUT","CONTRATO","CARGO","CCOSTO","OBSERVACIÓN/JUSTIFICACIÓN","AÑO PERIODO","MES PERIODO","COORDINADOR","FECHA ENVÍO","FECHA APROBACIÓN","JEFE APROBADOR","CORREO JEFE APROBADOR"]]

                        // Se extrae la informacion
                        informes.forEach(informe => {
                            console.log("El informe", informe)
                            let haberes = JSON.parse(informe.Haberes);
                            let arrayHaberes = haberes.d.results.map(function(haber){
                                return [
                                    haber.Haber.Title,
                                    haber.Haber.NombreItem,
                                    haber.CantidadMonto,
                                    haber.Nombre.NombreCompleto,
                                    haber.Rut,
                                    haber.TipoContrato,
                                    haber.Nombre.cargo,
                                    haber.CentroCosto.CodigoCC,
                                    haber.Justificacion,
                                    informe.Periodo.AnioCalculado,
                                    informe.Periodo.MesCalculado,
                                    informe.Coordinador.Title,
                                    moment(informe.Created).format("DD/MM/YYYY hh:mm"),
                                    moment(informe.FechaAprobacion).format("DD/MM/YYYY hh:mm"),
                                    informe.Aprobador.Nombre,
                                    informe.Aprobador.Title,
                                ];
                            });
                            items = items.concat(arrayHaberes)
                        })

                        // Se crea la hoja
                        let ws = XLSX.utils.aoa_to_sheet(items);
                        
                        // Se asigna tamaño a las columnas
                        let colSize = [{"width":13},{"width":35},{"width":14},{"width":35},{"width":10},{"width":15},{"width":20},{"width":8},{"width":100},{"width":13},{"width":13},{"width":25},{"width":16},{"width":18},{"width":25},{"width":30}];
                        ws["!cols"] = colSize;

                        // Se crea la primera hoja
                        XLSX.utils.book_append_sheet(wb, ws, "Items Variables");
                        XLSX.writeFile(wb, 'Items Variables Completo.xlsx');
                        
                        dialog.close()
                        dialogs.infoDialog(
                            dialogTitle,
                            'Su informe se ha descargado exitosamente',
                        );
                    },
                    function (response) {
                        var responseText = JSON.parse(response.responseText);
                        console.log(responseText.error.message.value);
                    }
                );
            }
            dialogs.confirmDialog(
                dialogTitle,
                'Se descargará un documento Excel con la información de todos los informes',
                save
            )
        }
    }
    return button
}
