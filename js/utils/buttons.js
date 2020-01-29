localButtons = {}

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
                        'refresh',
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
                                    'refresh',
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