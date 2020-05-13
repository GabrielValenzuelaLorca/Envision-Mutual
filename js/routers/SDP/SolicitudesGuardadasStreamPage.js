var SolicitudesGuardadasStreamPage = $.extend(true, {}, listStreamPage)

SolicitudesGuardadasStreamPage.methods.allowChangeTemplate = function(){
    return false;
}

SolicitudesGuardadasStreamPage.methods.getListView = function(){
    return "Todos los elementos"
}

SolicitudesGuardadasStreamPage.methods.getTitle = function(){
    return "Posiciones"
}

SolicitudesGuardadasStreamPage.methods.getListTitle = function(){
    return "Posicion"
}

SolicitudesGuardadasStreamPage.methods.onItemDblClick = function(item){
     mainView.router.navigate('/Posicion?listItemId='+item.ID);
}

// SolicitudesGuardadasStreamPage.methods.getOneItemSelectedButtons = function(){
//     return [localButtons.toSeeDetailsSolicitud()]
// }

SolicitudesGuardadasStreamPage.methods.getMultiItemsSelectedButtons = function(){
    return false;
}

SolicitudesGuardadasStreamPage.methods.getCamlQueryConditions = function(){
    return `               
                <Contains><FieldRef Name="Estado" /><Value Type="Choice">Validación Jefe CyE</Value></Contains>
            `
}

SolicitudesGuardadasStreamPage.methods.renderHeader = function($header){
    // core vars
    var self = this,
        page = this._getPage(),
        url = page.route.url

    // use vars
    var title = self.getTitle() || page.route.query.title,
        description = '',
        tabChoices = [
            {id : 1, text: 'En validación', segment: 'En Validación'},
            {id : 2, text: 'Enviada/No Validada', segment: 'Enviada/No Validada'}
        ];

    // tempalte con titulo, descripción opcional y un tabs
    var templateHtml = `
        <div class="form-header">
            <div class="Title" style="margin-left: 42%; margin-right: 42%; margin-top: 8px; font-size: 20px; font-weight: 600;">` + title +  `</div>
            <div class="ms-Form-Description">` + description + `</div>
            <div class="segmented" style="margin:20px auto; max-width:600px">
                <a class="button" segment-id="` + tabChoices[0].id + `" segment-text="` + tabChoices[0].segment + `">` + tabChoices[0].text + `</a>
                <a class="button" segment-id="` + tabChoices[1].id + `" segment-text="` + tabChoices[1].segment + `">` + tabChoices[1].text + `</a>
            </div>
        </div>
    `;

    // agregar html
    $header.html(templateHtml);

    // agregar al hacer click sobre botón
    $header.find('.segmented .button').on('click', function(e){
        var choice = this.getAttribute('segment-text');
            query = "";
        switch(choice){
            case 'En Validación':{
                query = `
                    <And>
                        <And>
                            <Neq><FieldRef Name="Estado" /><Value Type="Choice">No Validada</Value></Neq>
                            <Neq><FieldRef Name="Estado" /><Value Type="Choice">Enviada a Compensación</Value></Neq>
                        </And>
                        <Or>
                            <Eq><FieldRef Name="Rut" LookupId="TRUE"/><Value Type="Lookup">${plantaAdmin.ID}</Value></Eq>
                            <Contains><FieldRef Name="RutSolicitante" /><Value Type="Text">${plantaAdmin.Rut}</Value></Contains>
                        </Or>
                    </And>`;
                break;
            }
            case 'Enviada/No Validada':{
                query = `
                    <And>
                        <Or>
                            <Eq><FieldRef Name="Estado" /><Value Type="Choice">No Validada</Value></Eq>
                            <Eq><FieldRef Name="Estado" /><Value Type="Choice">Enviada a Compensación</Value></Eq>
                        </Or> 
                        <Or>
                            <Eq><FieldRef Name="Rut" LookupId="TRUE"/><Value Type="Lookup">${plantaAdmin.ID}</Value></Eq>
                            <Contains><FieldRef Name="RutSolicitante" /><Value Type="Text">${plantaAdmin.Rut}</Value></Contains>
                        </Or>
                    </And>`;
                break;
            }
        }
        // manejar lógica para ver botón seleccionado
        $header.find('.segmented .button').removeClass('button-active');
        $(this).addClass('button-active');
        

        // self.requestItems() acepta como parametro una consulta CAML
        self.requestItems(query);
    });
}