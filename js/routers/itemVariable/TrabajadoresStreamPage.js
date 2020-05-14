var TrabajadoresStreamPage = $.extend(true, {}, listStreamPage)

TrabajadoresStreamPage.methods.allowChangeTemplate = function(){
    return false;
}

TrabajadoresStreamPage.methods.getListView = function(){
    return "ListadoPlantaItemVariable"    
}

TrabajadoresStreamPage.methods.getTitle = function(){
    return "Listado completo de trabajadores"
}

TrabajadoresStreamPage.methods.getListTitle = function(){
    return "Planta"
}

TrabajadoresStreamPage.methods.onItemDblClick = function(item){
    return;
}

TrabajadoresStreamPage.methods.getNoItemsSelectedButtons = function(){
    return [localButtons.toUploadPlanta()];
}

TrabajadoresStreamPage.methods.getOneItemSelectedButtons = function(item){
    return false;
}

TrabajadoresStreamPage.methods.getMultiItemsSelectedButtons = function(items){
    return false;
}

TrabajadoresStreamPage.methods.getCamlQueryConditions = function(){
    return `
            <Eq>
                <FieldRef Name="EstadoContrato" /><Value Type="Choice">Activo</Value>
            </Eq>
        `
}