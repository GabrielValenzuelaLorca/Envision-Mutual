class SuperTabla {
    constructor(){
        this.columns = [""]
        for (let index = 1; index <= 20; index++) {
            this.columns.push("Detalle"+index)
        }
    }

    pushColumns(){
        var final = [];
        this.columns.forEach(column =>{
            final.push(this.createColumn(column))
        });
        return final;
    }

    pushSchema(){
        var final = [];
        this.columns.forEach(column =>{
            final.push(this.createSchema(column))
        });
        return final;
    }

    createColumn(nombre){
        return {
            AutoIndexed: false,
            CanBeDeleted: true,
            ClientSideComponentId: "00000000-0000-0000-0000-000000000000",
            ClientSideComponentProperties: null,
            ClientValidationFormula: null,
            ClientValidationMessage: null,
            CustomFormatter: null,
            DefaultFormula: null,
            DefaultValue: null,
            Description: "",
            Direction: "none",
            EnforceUniqueValues: false,
            EntityPropertyName: nombre,
            FieldTypeKind: 2,
            Filterable: false,
            FromBaseType: false,
            Group: "Custom Columns",
            Hidden: false,
            Id: "ID" + nombre,
            Indexed: false,
            InternalName: nombre,
            JSLink: "clienttemplates.js",
            MaxLength: 1000,
            PinnedToFiltersPane: false,
            ReadOnlyField: false,
            Required: false,
            SchemaXml: "<Field DisplayName='"+nombre+"' Format='Dropdown' MaxLength='255' Name='"+nombre+"' Title='"+nombre+"' Type='Text' ID='{"+"ID" + nombre+"}' SourceID='{ed02824d-2710-41ac-be62-42016a52658b}' StaticName='"+nombre+"' ColName='nvarchar4' RowOrdinal='0' />",
            Scope: "",
            Sealed: false,
            ShowInFiltersPane: 0,
            Sortable: false,
            StaticName: nombre,
            Title: "",
            TypeAsString: "Text",
            TypeDisplayName: "Single line of text",
            TypeShortDescription: "Single line of text",
            ValidationFormula: null,
            ValidationMessage: null,
            odata:{
                editLink: "Web/Lists(guid'ed02824d-2710-41ac-be62-42016a52658b')/Fields(guid'd984623f-b59c-411b-8f43-cb04d45efb4d')",
                id: "https://grupoenvision.sharepoint.com/sites/PruebaTest/_api/Web/Lists(guid'ed02824d-2710-41ac-be62-42016a52658b')/Fields(guid'd984623f-b59c-411b-8f43-cb04d45efb4d')",
                type: "SP.FieldText"
            }
        }
    }

    createSchema(nombre){
        return {
            AllowGridEditing: "TRUE",
            AutoHyperLink: "TRUE",
            ClientSideComponentId: "00000000-0000-0000-0000-000000000000",
            DisplayName: "",
            FieldType: "Text",
            ID: "d",
            Name: nombre,
            PinnedToFiltersPane: "FALSE",
            RealFieldName: nombre,
            ShowInFiltersPane: "Auto",
            StaticName: nombre,
            Type: "Text",
            ariaLabel: nombre,
            role: "Text"
        }
    }

    buildCaml(items){
        var query = '';
        var el = items.shift();
        query +=`<Eq>
                    <FieldRef Name='ID' />
                    <Value Type='Counter'>`+el+`</Value>
                </Eq>`
        if(items.length > 0){
            items.forEach((item) =>{
                query = `<Or>
                            `+query+`
                            <Eq>
                                <FieldRef Name='ID' />
                                <Value Type='Counter'>`+item+`</Value>
                            </Eq>
                        </Or>`
            })
        }

        return query;
    }

    processResponse(list){
        return new Promise((resolve) =>{
            var ids = list.ListData.Row.map(c => c.ID);
        
            var definicionesPromise = getPromiseListItems(spo.getSiteUrl(), 'sodimacTitulosTecnicos', '?$select=*');
            var columnasPromise =getListItemsAsStreamPromise(spo.getSiteUrl(), 'sodimacFilasTecnicas', '', '', this.buildCaml(ids));
    
            Promise.all([definicionesPromise,columnasPromise]).then(response =>{
                list.ListSchema.Field = list.ListSchema.Field.concat(this.pushSchema());
                for (let i = 0; i < list.ListData.Row.length; i++) {
                    var valoresExtra = response[1].ListData.Row.find((inner) => inner.Producto[0].lookupId == list.ListData.Row[i].ID)
                    if(valoresExtra != null){
                        var definicionesExtra = response[0].d.results.find((inner) => inner.Id == valoresExtra.Columnas[0].lookupId)
                        this.columns.forEach((column, index) =>{
                            if(valoresExtra["Columna"+(index+1)] != "") list.ListData.Row[i][column] = "<span class='badge' style='font-size: 11px;'>" + definicionesExtra["Titulo"+(index+1)] +"</span><span class='superEdit'>"+ valoresExtra["Columna"+(index+1)] + "</span>";
                        })
                    }
                    else{
                        this.columns.forEach((column) =>{
                            list.ListData.Row[i][column] = "";
                        })
                    }
                }
                resolve(list);
            })
        })
  

    }

}

