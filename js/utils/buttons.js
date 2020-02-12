localButtons = {}
function refresh(){
    mainView.router.refreshPage();
    leftView.router.refreshPage();
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
                spo.getListItems(spo.getSiteUrl(), 'ItemVariable', query,
                    function (response) {
                        if (response.d.results.length > 0){
                            // Creación Json de haberes
                            JsonHaberes = JSON.stringify(response);
                            // Se crea un nuevo informe
                            metadata = {
                                PeriodoId: context.periodId,
                                CoordinadorId: context.coorId,
                                Estado: "Enviado para aprobar",
                                Haberes: JsonHaberes
                            }
                            spo.saveListItem(spo.getSiteUrl(), "Informe Haberes", metadata, 
                                function (response){
                                    dialog.close();
                                    dialogs.confirmDialog(
                                        dialogTitle,
                                        'Informe enviado con éxito a ' + context.Aprobador,
                                        refresh,
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

                spo.updateListItem(spo.getSiteUrl(), "Informe Haberes", item.ID, {"Estado":"Aprobado y enviado a administración"}, function (response) {
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