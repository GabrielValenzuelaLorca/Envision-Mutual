dialogs = {}

dialogs.infoDialog = function(title,text){
    app.dialog.create({
        title: title,
        text: text,
        buttons: [{
            text: 'Aceptar'
        }],
        verticalButtons: false
    }).open();
}

dialogs.confirmDialog = function(title, text, fun, cancel=true){
    var buttons = cancel ? [{text: 'Cancelar'}] : [];
    buttons.push(
        {
            text: 'Aceptar',
            onClick: function onClick(){
                if (fun == 'refresh'){
                    location.reload(true)
                }else{
                    fun()
                }
            }
        }
    ) 
    app.dialog.create({
        title: title,
        text: text,
        buttons: buttons,
        verticalButtons: false
    }).open();
}
