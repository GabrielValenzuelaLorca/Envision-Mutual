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
                        app.dialog.create({
                            title: 'No se puede añadir un nuevo periodo',
                            text: "Hay otro periodo activo",
                            buttons: [{
                                text: 'Aceptar'
                            }],
                            verticalButtons: false
                        }).open();
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
                    dialog.close();

                    app.dialog.create({
                        title: dialogTitle,
                        text: 'Desactivado con éxito',
                        buttons: [{
                            text: 'Aceptar',
                            onClick: function () {
                                location.reload(true);
                            }
                        }],
                        verticalButtons: false
                    }).open();


                }, function (response) {
                    var responseText = JSON.parse(response.responseText);
                    console.log('responseText', responseText);

                    dialog.close();
                    app.dialog.create({
                        title: 'Error al guardar el periodo',
                        text: responseText.error.message.value,
                        buttons: [{
                            text: 'Aceptar'
                        }],
                        verticalButtons: false
                    }).open();
                });
            }
            app.dialog.create({
                title: dialogTitle,
                text: 'Se desactivará el periodo seleccionado.',
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
                        app.dialog.create({
                            title: 'No se puede activar este periodo',
                            text: "Hay otro periodo activo",
                            buttons: [{
                                text: 'Aceptar'
                            }],
                            verticalButtons: false
                        }).open();
                    } else {
                        var dialogTitle = 'Activando periodo';
                        function save() {
                            var dialog = app.dialog.progress(dialogTitle);

                            spo.updateListItem(spo.getSiteUrl(), "Periodo", item.ID, {"Activo":true}, function (response) {
                                dialog.close();

                                app.dialog.create({
                                    title: dialogTitle,
                                    text: 'Activado con éxito',
                                    buttons: [{
                                        text: 'Aceptar',
                                        onClick: function () {
                                            location.reload(true);
                                        }
                                    }],
                                    verticalButtons: false
                                }).open();


                            }, function (response) {
                                var responseText = JSON.parse(response.responseText);
                                console.log('responseText', responseText);

                                dialog.close();
                                app.dialog.create({
                                    title: 'Error al guardar el periodo',
                                    text: responseText.error.message.value,
                                    buttons: [{
                                        text: 'Aceptar'
                                    }],
                                    verticalButtons: false
                                }).open();
                            });
                        }
                        app.dialog.create({
                            title: dialogTitle,
                            text: 'Se activará el periodo seleccionado.',
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