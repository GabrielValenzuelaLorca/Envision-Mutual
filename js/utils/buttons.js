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
            
            let letras = ['A','B','C','D','E','F','G','H','I','J','K','L','M'];

            for(var i = 0; i < letras.length; i++){
                if(ws[letras[i]+"1"] != null){
                    ws[letras[i]+"1"].s =   {   fgColor: { rgb: '9ED2E0' },
                                                bgColor: { rgb: '9ED2E0' } 
                                            }
                }
            }

            console.log('WS', ws);
            console.log('WS c1', ws["A1"].v)

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
                                Cantidad: response.d.results.length,
                                AprobadorId: context.AprobadorId
                            }
                            spo.saveListItem(spo.getSiteUrl(), "Informe Haberes", metadata, 
                                function (response){
                                    dialog.close();
                                    dialogs.confirmDialog(
                                        dialogTitle,
                                        'Informe enviado con éxito a ' + context.Aprobador,
                                        function(){
                                            mainView.router.navigate(encodeURI('/informeDesaprobado'));
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
            if(!item.ID){
                dialogs.confirmDialog(
                    'Informe Desaprobado',
                    'El informe seleccionado no se puede desaprobar.',
                    false
                )
                return;
            }
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
                                    <button class="button button-fill close-popup">Volver</button>
                                    <button class="button button-fill send">Desaprobar</button>
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

// Informe buttons
localButtons.disableItemSendedAdmin = function(context, item){
    button = {
        text: 'Desaprobar',
        class: 'desaprobarPeriodo',
        icon: 'Delete',
        onClick: function(component){
            if(!item.ID){
                app.dialog.create({
                    title: 'Operación inválida',
                    text:   'El informe seleccionado no se puede desaprobar.',
                    buttons: [{
                        text: 'Aceptar',
                        onClick: function onClick(){
                            return
                        }
                    }],
                    verticalButtons: false
                }).open();
                return;
            }
            if(item.Status == "Desaprobado"){
                app.dialog.create({
                    title: 'Operación inválida',
                    text:   'El informe ya se encuentra desaprobado',
                    buttons: [{
                        text: 'Aceptar',
                        onClick: function onClick(){
                            return
                        }
                    }],
                    verticalButtons: false
                }).open();
                return;
            }
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
                                    <button class="button button-fill close-popup">Volver</button>
                                    <button class="button button-fill send">Desaprobar</button>
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
                var metadata = {
                    "Estado": "Aprobado", 
                    "FechaAprobacion": new Date().toISOString()
                }

                spo.updateListItem(spo.getSiteUrl(), "Informe Haberes", item.ID, metadata, function (response) {
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
            if(!item.ID){
                app.dialog.create({
                    title: 'Operación inválida',
                    text:   'No se puede solicitar justificación a este informe',
                    buttons: [{
                        text: 'Aceptar',
                        onClick: function onClick(){
                            return
                        }
                    }],
                    verticalButtons: false
                }).open();
                return;
            }
            var dialogTitle = 'Solicitando Justificación';

            abrirPopup();
            function save(comment) {
                var dialog = app.dialog.progress(dialogTitle);
                var metadata = {
                    Estado: "En espera de justificación",
                    ComentarioJustificacion: comment
                };

                spo.updateListItem(spo.getSiteUrl(), "Informe Haberes", item.ID, metadata, function (response) {
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
                        'Error al solicitar justificación.',
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
                                    <button class="button button-fill close-popup">Volver</button>
                                    <button class="button button-fill send">Solicitar</button>
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
                                title: 'Solicitud de Justificación'.bold(),
                                editable: true,
                                description: 'Ingrese la razón para pedir justificación.',
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

                spo.updateListItem(spo.getSiteUrl(), "Informe Haberes", item.ID, { Estado: "Enviado para aprobar", Justificaci_x00f3_n: comment }, function (response) {
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
        text: 'Descargar en Excel',
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
                                                haber.Nombre.d_cargo,
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
        text: 'Descargar Excel Completo',
        class: 'informeDownload',
        icon: 'ExcelLogo',
        onClick: function(component, item){
            var dialogTitle = 'Descargando informe';
            function save() {
                var dialog = app.dialog.progress(dialogTitle);
                var query = spo.encodeUrlListQuery(context.list, {
                    view: 'Todos los elementos',
                    odata: {
                        'filter': '(Estado eq \'Aprobado\')'
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
                            let haberes = JSON.parse(informe.Haberes);
                            let arrayHaberes = haberes.d.results.map(function(haber){
                                return [
                                    haber.Haber.Title,
                                    haber.Haber.NombreItem,
                                    haber.CantidadMonto,
                                    haber.Nombre.NombreCompleto,
                                    haber.Rut,
                                    haber.TipoContrato,
                                    haber.Nombre.d_cargo,
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

localButtons.downloadInformePDF = function(context){
    button = {
        text: 'Descargar en PDF',
        class: 'informePDFDownload',
        icon: 'PDF',
        onClick: function(component, item){
            var dialogTitle = 'Descargando informe';
            var dialog = app.dialog
            var loaded = {};
            context.items = {};
            function createPDF(){
                // Crear PDF
                var doc = new jsPDF({
                    orientation: 'l',
                    format: "legal"
                  })

                // Formato Texto General
                doc.setFontStyle("bold");
                doc.setFont("helvetica");
                
                // Header
                doc.setFontSize(10);
                doc.setTextColor(100);
                doc.text("LISTADO ITEMS VARIABLES", 155, 15);
                
                // Logo
                doc.addImage(mutualLogo, "JPEG", 169, 20, 20, 13);
                
                // Barras verdes 
                doc.setDrawColor(0);
                doc.setFillColor(76, 147, 27);
                doc.rect(10, 35, 336, 4, "F");
                doc.rect(10, 62, 336, 4, "F");
                
                doc.setFontStyle("normal");
                doc.setTextColor(255,255,255);
                doc.setFontSize(10);
                doc.text("Información del coordinador", 11, 38);
                doc.text("Ítems Variables Registrados ("+ context.items.informe.Cantidad +" items)", 11, 65);
                
                // Lines
                doc.line(10, 41, 346, 41);
                doc.line(10, 47, 346, 47);
                doc.line(10, 53, 346, 53);
                doc.line(10, 59, 346, 59);
                
                // Green letters
                doc.setTextColor(76, 147, 27);
                doc.setFontSize(8);
                doc.text("Nombre del Coordinador", 11, 45);
                doc.text("Centro de costo a cargo", 11, 51);
                doc.text("Fecha de envío del informe", 11, 57);
                doc.text("Código Payroll Coordinador", 170, 45);
                doc.text("Jefe Aprobador", 170, 51);
                doc.text("Fecha de aprobación", 170, 57);
                
                // Answers to green letters
                doc.setTextColor(0);
                doc.text(context.items.coordinador.Title, 65, 45);
                doc.text(context.items.coordinador.CentroCosto.CodigoCC, 65, 51);
                doc.text(moment(context.items.informe.Created).format("DD/MM/YYYY hh:mm"), 65, 57);
                doc.text(context.items.coordinador.Planta.Title, 225, 45);
                doc.text(context.items.coordinador.Aprobador.Nombre, 225, 51);
                doc.text(moment(context.items.informe.FechaAprobacion).format("DD/MM/YYYY hh:mm"), 225, 57);
        
                // Table
                let haberes = JSON.parse(context.items.informe.Haberes);
                let n = 0;
                let arrayHaberes = haberes.d.results.map(function(haber){
                    n += 1;
                    return [
                        n,
                        haber.Haber.Title,
                        haber.Rut,
                        haber.Haber.NombreItem,
                        haber.CantidadMonto,
                        haber.Nombre.NombreCompleto,
                        haber.TipoContrato,
                        haber.Nombre.d_cargo,
                        haber.CentroCosto.CodigoCC,
                        haber.Justificacion
                    ];
                });

                doc.autoTable({
                    head: [["N°", "COD_PAYROLL", "RUT", "ITEM VARIABLE", "CANT_$MONTO", "NOMBRE", "CONTRATO", "CARGO", "CCOSTO", "JUSTIFICACIÓN"]],
                    body: arrayHaberes,
                    theme: "grid",
                    startY: 68,
                    margin: {left: 10, bottom: 55},
                    rowPageBreak: "avoid",
                    tableWidth: 336,
                    headStyles: {
                        fontStyle:"bold",
                        fillColor: null,
                        textColor: [76, 147, 27],
                        halign: 'center',
                        fontSize: 8,
                        lineColor: 1,
                        lineWidth: 0.1
                    },
                    bodyStyles:{
                        fontSize:7,
                        overflow: 'ellipsize'
                    },
                    columnStyles: {
                        0: {cellWidth: 10},// N°
                        1: {cellWidth: 25},// COD_PAYROLL
                        2: {cellWidth: 19},// RUT
                        3: {cellWidth: 50},// ITEM VARIABLE
                        4: {cellWidth: 20},// CANT_$MONTO
                        5: {cellWidth: 50},// NOMBRE
                        6: {cellWidth: 20},// CONTRATO
                        7: {cellWidth: 20},// CARGO
                        8: {cellWidth: 15},// CCOSTO
                        9: {cellWidth: 50},// JUSTIFICACIÓN
                    },
                })

                let pageCount = doc.internal.getNumberOfPages();
                for(i = 1; i < pageCount + 1; i++) { 
                    // Pagination
                    doc.setPage(i); 
                    doc.text("Página " + i + " de " + doc.internal.getNumberOfPages(), 180, 200, "center");

                    // Aprobado
                    doc.addImage(approved, "JPEG", 280, 160, 50, 40);
                    doc.setFontStyle("bold");
                    doc.setFontSize(10);
                    doc.text("RESPONSABLE", 225, 175, "center");
                    doc.setFontStyle("normal");
                    doc.text(context.items.coordinador.Aprobador.Nombre, 225, 180, "center");
                    doc.text(context.items.aprobador.Planta.d_cargo, 225, 185, "center");
                    doc.text("Mutual de Seguridad C.HC.C.", 225, 190, "center");
                }
        
                // Download
                let periodoName = "Coordinador_"+context.items.informe.Coordinador.Title+"_"
                periodoName+="Periodo_"+context.items.informe.Periodo.MesCalculado+"_"+context.items.informe.Periodo.AnioCalculado;
                doc.save(periodoName)
                
                dialog.close()
                dialogs.infoDialog(
                    dialogTitle,
                    'Su informe se ha descargado exitosamente',
                );
            }
            function shouldCreatePDF(){
                if (loaded.Coordinador && loaded.Aprobador){
                    createPDF();
                }
            }
            function save() {
                dialog.progress(dialogTitle);
                var query = spo.encodeUrlListQuery(context.list, {
                    view: 'Todos los elementos',
                    odata: {
                        'filter': '(ID eq '+ item.ID +')'
                    }
                });
                spo.getListItems(spo.getSiteUrl(), context.list.Title, query,
                    function (response) {
                        context.items.informe = response.d.results[0];
                        spo.getListInfo('Coordinador',
                            function (response) {
                                var query = spo.encodeUrlListQuery(response, {
                                    view: 'Todos los elementos',
                                    odata: {
                                        'filter': '(ID eq '+ context.items.informe.CoordinadorId +')'
                                    }
                                });
                                spo.getListItems(spo.getSiteUrl(), "Coordinador", query,
                                    function (response) {
                                        context.items.coordinador = response.d.results[0];
                                        loaded.Coordinador = true;
                                        shouldCreatePDF();
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
                        spo.getListInfo('Aprobador',
                            function (response) {
                                var query = spo.encodeUrlListQuery(response, {
                                    view: 'Todos los elementos',
                                    odata: {
                                        'filter': '(ID eq '+ context.items.informe.AprobadorId +')'
                                    }
                                });
                                spo.getListItems(spo.getSiteUrl(), "Aprobador", query,
                                    function (response) {
                                        context.items.aprobador = response.d.results[0];
                                        loaded.Aprobador = true;
                                        shouldCreatePDF();
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
                'Se descargará un PDF con la información del informe',
                save
            )
        }
    }
    return button
}

localButtons.openInforme = function(item){
    button = {
        text: 'Ver Informe',
        class: 'openInforme',
        icon: 'OpenInNewWindow',
        onClick: function(component){
            mainView.router.navigate('/informe?listItemId='+item.ID);
        }
    }
    return button
}
// Mantenedor Coordinador

localButtons.addTrabajadorButton = function(context, id){
    button = {
        text: 'Afiliar Trabajador',
        class: 'addTranbajador',
        icon: 'Add',
        onClick: function(component, item){
            mainView.router.navigate(encodeURI('/trabajadorTemporal?listItemId='+id));
           
        }
    }
    return button
}

localButtons.addListTrabajadoresButton = function(context,coordinador){
    button = {
        text:'Asignar Trabajadores',
        class:'addTrabajadores',
        icon:'AddGroup',
        onClick: function(component, item){

            var dialogTitle = 'Solicitando Justificación';

            //Ejecuta toda la funcion despues de la validacion de la alerta
            function save() {
                var dialog = app.dialog.progress(dialogTitle);

                console.log('Datos obtenidos', item)

                var data = [];

                item.map(function(x){
                    data.push({
                        "ID": x.ID,
                        "CoordinadorId": coordinador
                    });
                })

                spo.updateListItems(spo.getSiteUrl(), "Planta", data, function (response) {
                    dialog.close()
                    dialogs.confirmDialog(
                        dialogTitle,
                        'Trabajadores asignados con exito!! jujui!!!',
                        refresh,
                        false
                    )

                }, function (response) {
                    var responseText = JSON.parse(response.responseText);
                    console.log('responseText', responseText);

                    dialog.close();
                    dialogs.infoDialog(
                        'Pucha la cuestion, no funciono :C',
                        responseText.error.message.value,
                    )
                });
            }

            /* Alerta que se ejecuta al presionar el boton.
            -   Si se presiona OK o aceptar se ejecuta el metodo save
            -   Al cancelar no se ejecuta nada
            */

            dialogs.confirmDialog(
                dialogTitle,
                'Esta seguro que quiere hacer esta vaina?',
                save
            )

            
        }

    }
    return button
}

localButtons.addListTrabajadorButton = function(context, Javiera){
    button = {
        text:'Asignar Trabajador',
        class:'addTrabajador',
        icon:'AddFriend',
        onClick: function(component, item){
            console.log('Valor seleccionado', item)

            var dialogTitle = 'Solicitando Justificación';

            //Ejecuta toda la funcion despues de la validacion de la alerta
            function save() {
                var dialog = app.dialog.progress(dialogTitle);

                spo.updateListItem(spo.getSiteUrl(), "Planta", item.ID, {"CoordinadorId":Javiera}, function (response) {
                    dialog.close()
                    dialogs.confirmDialog(
                        dialogTitle,
                        'Trabajador asignado con exito!! jujui!!!',
                        refresh,
                        false
                    )

                }, function (response) {
                    var responseText = JSON.parse(response.responseText);
                    console.log('responseText', responseText);

                    dialog.close();
                    dialogs.infoDialog(
                        'Pucha la cuestion, no funciono :C',
                        responseText.error.message.value,
                    )
                });
            }

            /* Alerta que se ejecuta al presionar el boton.
            -   Si se presiona OK o aceptar se ejecuta el metodo save
            -   Al cancelar no se ejecuta nada
            */

            dialogs.confirmDialog(
                dialogTitle,
                'Esta seguro que quiere hacer esta vaina?',
                save
            )

            //mainView.router.navigate(encodeURI(''));
        }

    }
    return button
}


localButtons.addCapexView = function(item){
    button = {
        text: 'Asociar nuevo trabajador',
        class: 'addCapex',
        icon: 'AddFriend',
        onClick: function(component){
             mainView.router.navigate('/liststream?title=Asociar Trabajador a CAPEX&listtitle=Planta&listview=Capex&template=list-row&panel=filter-close');
        }
    }
    return button
}

localButtons.deleteCapex = function(context){
    button = {
        text: 'Eliminar convenio',
        class: 'deleteCapex',
        icon: 'Delete',
        onClick: function(component, item){
            var dialogTitle = 'Eliminar convenio CAPEX';
            function save() {
                var dialog = app.dialog.progress(dialogTitle);
                var metadata = {Capex: false};

                spo.updateListItem(spo.getSiteUrl(), "Planta", item.ID, metadata, function (response) {
                    dialog.close()
                    dialogs.confirmDialog(
                        `Convenio CAPEX eliminado`,
                        `El trabajador ${item.NombreCompleto} ha sido eliminado del convenio capex correctamente`,
                        refresh(),
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

            app.dialog.create({
                title: dialogTitle,
                text:   `¿Esta seguro que desea quitar a ${item.NombreCompleto} de convenio CAPEX?`,
                buttons: [
                {
                    text: 'Cancelar',
                    onClick: function onClick(){
                        return
                    }
                },{
                    text: 'Aceptar',
                    onClick: function onClick(){
                        save();
                    }
                }],
                verticalButtons: false
            }).open();

        }
    }
    return button
}

localButtons.multiDeleteCapex = function(context){
    button = {
        text: 'Eliminar convenios',
        class: 'deleteCapex',
        icon: 'Delete',
        onClick: function(component, item){
            var dialogTitle = 'Eliminar nuevos convenios CAPEX';
            function save() {
                var dialog = app.dialog.progress(dialogTitle);

                var metadata = [];

                item.map(function(x){
                    metadata.push({
                        "ID": x.ID,
                        "Capex": false
                    });
                })

                spo.updateListItems(spo.getSiteUrl(), "Planta", metadata, function (response) {
                    dialog.close()
                    app.dialog.create({
                        title: dialogTitle,
                        text:   `Los trabajadores seleccionados han sido eliminados correctamente al Convenio Capex`,
                        buttons: [{
                            text: 'Aceptar',
                            onClick: function onClick(){
                                refresh()
                           }
                        }],
                        verticalButtons: false
                    }).open();
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

            app.dialog.create({
                title: dialogTitle,
                text:   `¿Esta seguro que desea eliminar los trabajadores seleccionados del convenio CAPEX?`,
                buttons: [
                {
                    text: 'Cancelar',
                    onClick: function onClick(){
                        return
                    }
                },{
                    text: 'Aceptar',
                    onClick: function onClick(){
                        save();
                    }
                }],
                verticalButtons: false
            }).open();

        }
    }
    return button
}

localButtons.addCapex = function(context){
    button = {
        text: 'Crear convenio CAPEX',
        class: 'createCapex',
        icon: 'Add',
        onClick: function(component, item){
            var dialogTitle = 'Registrar nuevo convenio CAPEX';
            function save() {
                var dialog = app.dialog.progress(dialogTitle);

                var metadata = {Capex: true};

                spo.updateListItem(spo.getSiteUrl(), "Planta", item.ID, metadata, function (response) {
                    dialog.close()
                    app.dialog.create({
                        title: dialogTitle,
                        text:   `El trabajador ${item.NombreCompleto} ha sido agregado correctamente al Convenio Capex`,
                        buttons: [{
                            text: 'Aceptar',
                            onClick: function onClick(){
                                mainView.router.navigate('/liststream?title=Mantenedor Convenio Capex&listtitle=Planta&listview=Capex&template=list-row&panel=filter-close')
                            }
                        }],
                        verticalButtons: false
                    }).open();
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

            app.dialog.create({
                title: dialogTitle,
                text:   `¿Esta seguro que desea agregar a ${item.NombreCompleto} al convenio CAPEX?`,
                buttons: [
                {
                    text: 'Cancelar',
                    onClick: function onClick(){
                        return
                    }
                },{
                    text: 'Aceptar',
                    onClick: function onClick(){
                        save();
                    }
                }],
                verticalButtons: false
            }).open();

        }
    }
    return button
}

localButtons.multiAddCapex = function(context){
    button = {
        text: 'Crear convenios CAPEX',
        class: 'createCapex',
        icon: 'Add',
        onClick: function(component, item){
            var dialogTitle = 'Registrar nuevos convenios CAPEX';
            function save() {
                var dialog = app.dialog.progress(dialogTitle);

                var metadata = [];

                item.map(function(x){
                    metadata.push({
                        "ID": x.ID,
                        "Capex": true
                    });
                })

                spo.updateListItems(spo.getSiteUrl(), "Planta", metadata, function (response) {
                    dialog.close()
                    app.dialog.create({
                        title: 'dialogTitle',
                        text:   `Los trabajadores seleccionados han sido agregado correctamente al Convenio Capex`,
                        buttons: [{
                            text: 'Aceptar',
                            onClick: function onClick(){
                                mainView.router.navigate('/liststream?title=Mantenedor Convenio Capex&listtitle=Planta&listview=Capex&template=list-row&panel=filter-close')
                            }
                        }],
                        verticalButtons: false
                    }).open();
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

            app.dialog.create({
                title: dialogTitle,
                text:   `¿Esta seguro que desea agregar los trabajadores seleccionados al convenio CAPEX?`,
                buttons: [
                {
                    text: 'Cancelar',
                    onClick: function onClick(){
                        return
                    }
                },{
                    text: 'Aceptar',
                    onClick: function onClick(){
                        save();
                    }
                }],
                verticalButtons: false
            }).open();

        }
    }
    return button
}

localButtons.toItemVariablePage = function(){
    button = {
        text: 'Editar item variable',
        class: 'editItem',
        icon: 'Edit',
        onClick: function(component, item){
             mainView.router.navigate('/itemVariable?listItemId='+item.ID+'&editable=true');
        }
    }
    return button
}

localButtons.toSolicitudPage = function(){
    button = {
        text: 'Crear nueva solicitud',
        class: 'addSolicitud',
        icon: 'Add',
        onClick: function(component, item){
             mainView.router.navigate('/Solicitud');
        }
    }
    return button
}