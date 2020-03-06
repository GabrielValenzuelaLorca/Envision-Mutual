var coordinadorStreamPage = $.extend(true, {}, listStreamPage)

coordinadorStreamPage.methods.allowChangeTemplate = function(){
    return false;
}

coordinadorStreamPage.methods.getListView = function(){
    return "Mantenedor Coordinador"
}

coordinadorStreamPage.methods.getTitle = function(){
    return "Coordinadores"
}

coordinadorStreamPage.methods.getListTitle = function(){
    return "Coordinador"
}

coordinadorStreamPage.methods.onItemDblClick = function(item){
     mainView.router.navigate('/trabajadorPorCoordinador?listItemId='+item.ID);
}

coordinadorStreamPage.methods.getListView = function(){   
        return "Mantenedor Coordinador"    
}

coordinadorStreamPage.methods.beforeStartComponent = function(success,failure){
    var context = this._getPageContext();
    if (admin=="Coordinador"){
        spo.getListInfo('Coordinador',
            function (response) {
                var query = spo.encodeUrlListQuery(response, {
                    view: 'Todos los elementos',
                    odata: {
                        'filter': '(UsuarioId eq '+ spo.getCurrentUserId() +')'
                    }
                });
                spo.getListItems(spo.getSiteUrl(), "Coordinador", query,
                    function (response) {
                        context.coorId = response.d.results.length>0 ? response.d.results[0].ID : null;
                        if (success) success();
                    },
                    function (response) {
                        var responseText = JSON.parse(response.responseText);
                        console.log(responseText.error.message.value);
                        if (failure) failure();
                    }
                );
            },
            function(response){
                var responseText = JSON.parse(response.responseText);
                console.log(responseText.error.message.value);
                resolve(failCond);
                if (failure) failure();
            }
        );
    } else if (admin == "Administrador"){
        spo.getListInfo('Coordinador',
            function (response) {
                var query = spo.encodeUrlListQuery(response, {
                    view: 'Todos los elementos',
                    odata: {
                        'filter': '(UsuarioId eq '+ spo.getCurrentUserId() +')'
                    }
                });
                spo.getListItems(spo.getSiteUrl(), "Coordinador", query,
                    function (response) {
                        context.lastInforme = response.d.results.length>0 ? response.d.results[0] : null;
                        if (success) success();
                    },
                    function (response) {
                        var responseText = JSON.parse(response.responseText);
                        console.log(responseText.error.message.value);
                        if (failure) failure();
                    }
                );
            },
            function(response){
                var responseText = JSON.parse(response.responseText);
                console.log(responseText.error.message.value);
                resolve(failCond);
                if (failure) failure();
            }
        );
    }
}

coordinadorStreamPage.methods.getOneItemSelectedButtons = function(){
    return false;
}
//console para saber que metodos puedo usar
console.log('metodos', coordinadorStreamPage.methods)
coordinadorStreamPage.methods.getMultiItemsSelectedButtons = function(){
    return false;
}
