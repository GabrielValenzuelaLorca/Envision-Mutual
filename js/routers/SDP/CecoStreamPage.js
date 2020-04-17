var cecoStreamPage = $.extend(true, {}, listStreamPage)

cecoStreamPage.methods.allowChangeTemplate = function(){
    return false;
}

cecoStreamPage.methods.getListView = function(){
    return "Mantenedor Ceco"
}

cecoStreamPage.methods.getTitle = function(){
    return "Seleccióne un centro de costo para ver las opciónes"
}

cecoStreamPage.methods.getListTitle = function(){
    return "CentroCosto"
}

// cecoStreamPage.methods.onItemDblClick = function(item){
//     mainView.router.navigate('/cecoTemporal?listItemId='+item.ID+'&editable=true');
// }

cecoStreamPage.methods.getOneItemSelectedButtons = function(){
    var self = this,
        page = self._getPage(),
        context = self._getPageContext(),
        buttons = [];

    buttons.push(localButtons.editCecoButton(context));
    buttons.push(localButtons.deleteCeco());

    return buttons;
}
//console para saber que metodos puedo usar
cecoStreamPage.methods.getMultiItemsSelectedButtons = function(){
    return false;
}

cecoStreamPage.methods.getNoItemsSelectedButtons = function(){
    var self = this,
        page = self._getPage(),
        context = self._getPageContext(),
        buttons = [];

    buttons.push(localButtons.addCecoButton(context));

    return buttons;
}

cecoStreamPage.methods.getCamlQueryConditions = function(){
    return `<Eq><FieldRef Name="activo" /><Value Type="Boolean">1</Value></Eq>`
}