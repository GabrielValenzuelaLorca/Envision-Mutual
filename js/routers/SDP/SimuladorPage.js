class SimuladorRenta{
    constructor(){
        this.zona =[]
        this.sueldobase = []
        this.antiguedad =[]
        this.factores = []
        this.ipc = []
        this.ipc_actual = 0
        this.uf = []
    }

    async init(){
        var zonaPromise = getPromiseListItems(spo.getSiteUrl(),'Simulador_Zona','?$select=*')
        .then(c =>{
            this.zona = c.d.results
        })

        var sueldoPromise = getPromiseListItems(spo.getSiteUrl(),'Simulador_SueldoBase','?$select=*')
        .then(c =>{
            this.sueldobase = c.d.results
        })

        var antiguedadPromise = getPromiseListItems(spo.getSiteUrl(),'Simulador_Antiguedad','?$select=*')  
        .then(c =>{
            this.antiguedad = c.d.results
        })

        var factoresPromise = getPromiseListItems(spo.getSiteUrl(),'Simulador_Factores','?$select=*')  
        .then(c =>{
            this.factores = c.d.results
        })

        var ipcPromise = getPromiseListItems(spo.getSiteUrl(),'Simulador_Ipc','?$select=*')  
        .then(c =>{
            this.ipc = c.d.results
        })

        var ufPromise = getPromiseListItems(spo.getSiteUrl(),'Simulador_Uf','?$select=*')  
        .then(c =>{
            this.uf = c.d.results
        })

        return Promise.all([zonaPromise,sueldoPromise,antiguedadPromise,factoresPromise,ipcPromise,ufPromise])

    }

    calcular(obj){
        var sueldoBase = this.sueldobase.find(c => c.categoria === obj.categoria)
        var asignaciones_extra = this.factores.find(c => c.esc_esp === sueldoBase.esc)
        var asignacion_anios = this.antiguedad.find(c => c.anios === parseInt(obj.anios) )
        var asignacion_zona = this.zona.find(c => c.ubicacion === obj.zona)


        //var reajuste_base = (this.ipc[this.ipc.length-1].porc) + 1
        var reajuste_base = 1

        var haberes = []
        debugger

        haberes.push({
            nombre: "Cargo",
            valor: sueldoBase.cargo,
            haber: false
        })
        haberes.push({
            nombre: "Categoria",
            valor: sueldoBase.categoria,
            haber: false
        })

        var sueldo_base = sueldoBase.sbase
        if(sueldoBase.sbasehoras){
            haberes.push({
                nombre: "S.Base (horas)",
                valor: sueldo_base*reajuste_base*parseInt(obj.horas)*parseInt(obj.dias),
                haber: true
            })
        }
        else{
            haberes.push({
                nombre: "Sueldo Base",
                valor: sueldo_base*reajuste_base,
                haber: true
            })
            if(parseInt(obj.sbase2)> 0){
                haberes.push({
                    nombre: "Sueldo Base 2",
                    valor: sueldo_base*reajuste_base + parseInt(obj.sbase2) ,
                    haber: true
                })
                sueldo_base += parseInt(obj.sbase2)
            }
        }
        //---------------

        haberes.push({
            nombre: "Bono Compensatorio",
            valor: sueldoBase.bono_comp*reajuste_base,
            haber: true
        })
        haberes.push({
            nombre: "Trab. Terreno",
            valor: sueldoBase.trab_terreno*reajuste_base,
            haber: true
        })
        if(sueldoBase.esc === "M"){
            haberes.push({
                nombre: "Antiguedad/Permanencia (Medico)",
                valor: sueldo_base * asignacion_anios.medico*reajuste_base,
                haber: true
            })
        }
        else if(sueldoBase.esc === "L"){
            haberes.push({
                nombre: "Antiguedad/Permanencia (Medico)",
                valor: sueldo_base * asignacion_anios.medico_l*reajuste_base,
                haber: true
            })
        }
        else{
            haberes.push({
                nombre: "Antiguedad/Permanencia (General)",
                valor: sueldo_base * asignacion_anios.medico_l*reajuste_base,
                haber: true
            })
        }

        haberes.push({
            nombre: "Gratificacion",
            valor: sueldo_base * asignaciones_extra.grati*reajuste_base,
            haber: true
        })

        if(sueldoBase.esc === "E"){
            haberes.push({
                nombre: "Asig. Zona (EXP)",
                valor: sueldo_base * asignacion_zona.asig_z_exp*reajuste_base,
                haber: true
            })
        }
        else{
            haberes.push({
                nombre: "Asig. Zona (GRAL?)",
                valor: sueldo_base * asignacion_zona.asig_z_gral*reajuste_base,
                haber: true
            })
        }

        haberes.push({
            nombre: "Asig. Estimulo",
            valor: sueldo_base * asignaciones_extra.estimulo*reajuste_base,
            haber: true
        })

        if(obj.turnoLlamado){
            haberes.push({
                nombre: "Turno llamado",
                valor: sueldo_base * asignaciones_extra.llamado*reajuste_base,
                haber: true
            })
        }
        if(obj.respLugarTrab){
            haberes.push({
                nombre: "Asig. Resp. Lugar. Trab.",
                valor: sueldo_base * asignaciones_extra.resp_tl*reajuste_base,
                haber: true
            })
        }
        
        if(obj.bonoEntregaTurno && obj.jornada === "Media Jornada"){
            haberes.push({
                nombre: "Asig. Resp. Lugar. Trab.",
                valor: asignaciones_extra.bono_ent_t*reajuste_base,
                haber: true
            })
        }
        if(obj.asigTitulo){
            haberes.push({
                nombre: "Asig. Titulo",
                valor: sueldo_base * asignaciones_extra.titulo*reajuste_base,
                haber: true
            })
        }
        if(obj.asigCaja){
            haberes.push({
                nombre: "Asig. Caja",
                valor:asignaciones_extra.asigna_caja*reajuste_base,
                haber: true
            })
        }

        haberes.push({
            nombre: "Asig. Movilizacion",
            valor:asignaciones_extra.movilizacion*reajuste_base,
            haber: true
        })
        haberes.push({
            nombre: "Asig. Especialidad",
            valor:sueldo_base * sueldoBase.esp*reajuste_base,
            haber: true
        })
        haberes.push({
            nombre: "Asig. Sub Especialidad",
            valor:sueldo_base * sueldoBase.sub*reajuste_base,
            haber: true
        })
        if(obj.bonoCasa && remu<=asignaciones_extra.tope_bono_casa*reajuste_base){
            haberes.push({
                nombre: "Bono casa",
                valor:asignaciones_extra.bono_casa*reajuste_base,
                haber: true
            })
        }

        return haberes.filter(c => (c.valor > 0 && c.haber) || c.haber === false )
    }


}

var SimuladorPage ={
    template: `
    <div class="page">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left">
                    <a href="#" class="link back">
                        <i class="ms-Icon ms-Icon--Back"></i>
                        <span class="ios-only">Volver</span>
                    </a>
                </div>
                <div class="title"></div>
  
            </div>
        </div>
        <div class="page-content">
            <div class="data-table card elevation-2">
                <div class="card-content card-content-padding">
                    <div class="card elevation-2">
                        <div class="card-content">

                            <div class="list">
                                <ul>
                                    <li class="accordion-item acordion-default">
                                        <a href="#" class="item-content item-link">
                                            <div class="item-inner">Categoria <i class="ms-Icon ms-Icon--TemporaryUser"></i></div>
                                        </a>
                                        <div class="accordion-item-content">
                                            <div class="block">
                                                <div class="list no-hairlines-md mainForm"></div>
                                            </div>
                                        </div>
                                    </li>
                                    <li class="accordion-item">
                                        <a href="#" class="item-content item-link">
                                            <div class="item-inner">Bonos <i class="ms-Icon ms-Icon--CheckMark"></i></div>
                                        </a>
                                        <div class="accordion-item-content">
                                            <div class="block">
                                                <div class="list no-hairlines-md bonosForm"></div>
                                            </div>
                                        </div>
                                    </li>
                                    <li class="accordion-item">
                                        <a href="#" class="item-content item-link">
                                            <div class="item-inner">Extras <i class="ms-Icon ms-Icon--Filters"></i></div>
                                        </a>
                                        <div class="accordion-item-content">
                                            <div class="block">
                                                <div class="list no-hairlines-md extraForm"></div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            
                        </div>
                    </div>

                    <div class="row">
                        <div class="col resizable">
                            <div class="card elevation-2">
                                <div class="card-header">Haberes</div>
                                <div class="card-content Resultados"></div>
                            </div>
                            <span class="resize-handler"></span>
                        </div>
                        <div class="col resizable">
                            <div class="card elevation-2">
                                <div class="card-header">Remuneración Bruta Mensual</div>
                                <div class="card-content ResultadoSueldo"></div>
                            </div>
                            <span class="resize-handler"></span>
                        </div>
                    </div>
                    
     
                </div>
            </div>
     
            <div class="content-loader">
                <div class="content-loader-inner">
                    <div class="image-logo lazy lazy-fadein" data-background="{{loader.image}}"></div>
                    <div class="loading-message">{{loader.text}}</div>
                </div>
            </div>
        </div>
    </div>
    `,
    style: `
    `,
    data: function() {
        var self = this;
        return {
            title: '',
            forms: {},
            tables: {},
            loader: {
                text: 'Espere un momento por favor',
                image: ''
            }
        }
    },
    methods: {
        _getPage() {
            return {}
        },
  
        generateUUID: function(prefix){
            function guid() {
                var date = new Date(),
                    year = date.getFullYear(),
                    month = date.getMonth() > 9 ? ('0' + date.getMonth()) : date.getMonth();
                return prefix ? prefix + '-' + year + '-' + month + s4() : year + '-' + month + s4();
            }
              
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
            }
              
            return guid().toUpperCase();
        },
  
        getTitle: function() {
            var page = this._getPage();
            return page.route.query.title || 'Componente';
        },
        // {fn} desaparecer DOM de cargar
        removePageLoader: function () {
            var page = this._getPage(),
                $loader = page.$el.find('.content-loader');

            if (!$loader.hasClass('ms-fadeOut100'))
                page.$el.find('.content-loader').removeClass('ms-fadeIn100').addClass('ms-fadeOut100');
        },

        getCategorias: function(){
            
        }
    
    },
    on: {
        pageInit: function (e, page) {
            // variables
            var context = this.$options.data(),
                mths = this.$options.methods,
                listItemId = page.route.query.listItemId
                console.log('itemid',listItemId);

            context.methods = mths;
            context.simuladorRenta = new SimuladorRenta()

            // definir entra de valores de página
            mths._getPage = function () {
                return page;
            };

            mths._getPageContext = function () {
                return context;
            };

            var initClass = async function() {
                await context.simuladorRenta.init()

                var inputs = 
                [{
                    name: "categoria",
                    type: "selector",
                    title: "Categoria",
                    icon: "WebAppBuilderModule",
                    options: context.simuladorRenta.sueldobase.map(c => c.categoria)
                },
                {
                    name: "zona",
                    type: "selector",
                    title: "Zona",
                    icon: "WebAppBuilderModule",
                    options: context.simuladorRenta.zona.map(c => c.ubicacion)
                },
                {
                    name: "horas",
                    type: "number",
                    title: "Horas",
                    icon: "WebAppBuilderModule",
                    default: 0,
                    min: 0,
                    max: 24
                },
                {
                    name: "dias",
                    type: "number",
                    title: "Dias",
                    icon: "WebAppBuilderModule",
                    default: 30,
                    min: 0,
                    max: 30
                },
                {
                    name: "anios",
                    type: "number",
                    title: "Años",
                    icon: "WebAppBuilderModule",
                    default: 0,
                    min: 0,
                    max: 50
                },
                {
                    name: "jornada",
                    type: "selector",
                    title: "Jornada",
                    icon: "WebAppBuilderModule",
                    options: ["Administrativo", "Media Jornada"]
                },{},{}
                ]

                var bonosCheck = 
                [{
                    name: "turnoLlamado",
                    title: "Turno Llamado",
                    type: "checkbox",
                    icon: "WebAppBuilderModule",
                },
                {
                    name: "respLugarTrab",
                    title: "Resp. Lugar Trab.",
                    type: "checkbox",
                    icon: "WebAppBuilderModule",
                },{
                    name: "bonoEntregaTurno",
                    title: "Bono entrega turno",
                    type: "checkbox",
                    icon: "WebAppBuilderModule",
                },
                {
                    name: "asigTitulo",
                    title: "Asif. Titulo",
                    type: "checkbox",
                    icon: "WebAppBuilderModule",
                },
                {
                    name: "asigCaja",
                    title: "Asig. caja",
                    type: "checkbox",
                    icon: "WebAppBuilderModule",
                },
                {
                    name: "bonoCasa",
                    title: "Bono Casa",
                    type: "checkbox",
                    icon: "WebAppBuilderModule",
                } ,{},{}
                ]

                var extra = 
                [{
                    name: "sbase2",
                    type: "number",
                    title: "Sueldo Base 2",
                    icon: "WebAppBuilderModule",
                    default: 0,
                    min: 0,
                    max: Number.MAX_SAFE_INTEGER
                },
                {
                    name: "ajuste",
                    type: "number",
                    title: "Ajuste",
                    icon: "WebAppBuilderModule",
                    default: 0,
                    min: 0,
                    max: Number.MAX_SAFE_INTEGER
                },
                {
                    name: "asigturllammedico",
                    type: "number",
                    title: "Asig. Tur. Llam. Medico",
                    icon: "WebAppBuilderModule",
                    default: 0,
                    min: 0,
                    max: Number.MAX_SAFE_INTEGER
                },
                {
                    name: "trasnoimp1",
                    type: "number",
                    title: "Tras. no imp 1",
                    icon: "WebAppBuilderModule",
                    default: 0,
                    min: 0,
                    max: Number.MAX_SAFE_INTEGER
                },
                {
                    name: "trasnoimp2",
                    type: "number",
                    title: "Tras. no imp 2",
                    icon: "WebAppBuilderModule",
                    default: 0,
                    min: 0,
                    max: Number.MAX_SAFE_INTEGER
                },
                {
                    name: "asigurgenciadiurna",
                    type: "number",
                    title: "Asig urgencia diurna",
                    icon: "WebAppBuilderModule",
                    default: 0,
                    min: 0,
                    max: Number.MAX_SAFE_INTEGER
                },
                {
                    name: "asignacionuci",
                    type: "number",
                    title: "asignacion UCI",
                    icon: "WebAppBuilderModule",
                    default: 0,
                    min: 0,
                    max: Number.MAX_SAFE_INTEGER
                },
                {
                    name: "comphorarionohabil",
                    type: "number",
                    title: "Comp horario no habil",
                    icon: "WebAppBuilderModule",
                    default: 0,
                    min: 0,
                    max: Number.MAX_SAFE_INTEGER
                },
                {
                    name: "tresidencia",
                    type: "number",
                    title: "T. Residencia",
                    icon: "WebAppBuilderModule",
                    default: 0,
                    min: 0,
                    max: Number.MAX_SAFE_INTEGER
                },
                {
                    name: "tllamadomedico",
                    type: "number",
                    title: "T. llamado Medico",
                    icon: "WebAppBuilderModule",
                    default: 0,
                    min: 0,
                    max: Number.MAX_SAFE_INTEGER
                },
                {
                    name: "bonocronicos",
                    type: "number",
                    title: "Bono Cronicos",
                    icon: "WebAppBuilderModule",
                    default: 0,
                    min: 0,
                    max: Number.MAX_SAFE_INTEGER
                },
                {
                    name: "sernageomin",
                    type: "number",
                    title: "Sernageomin",
                    icon: "WebAppBuilderModule",
                    default: 0,
                    min: 0,
                    max: Number.MAX_SAFE_INTEGER
                },
                {
                    name: "sergiominminero",
                    type: "number",
                    title: "Sergiomin Minero",
                    icon: "WebAppBuilderModule",
                    default: 0,
                    min: 0,
                    max: Number.MAX_SAFE_INTEGER
                },
                {
                    name: "subidaanticipada",
                    type: "number",
                    title: "Subida Anticipada",
                    icon: "WebAppBuilderModule",
                    default: 0,
                    min: 0,
                    max: Number.MAX_SAFE_INTEGER
                },
                {
                    name: "asigjefatura",
                    type: "number",
                    title: "Asig. Jefatura",
                    icon: "WebAppBuilderModule",
                    default: 0,
                    min: 0,
                    max: Number.MAX_SAFE_INTEGER
                },
                {
                    name: "asignacionmejovalor",
                    type: "number",
                    title: "Asignacion Mejo Valor",
                    icon: "WebAppBuilderModule",
                    default: 0,
                    min: 0,
                    max: Number.MAX_SAFE_INTEGER
                },
                {
                    name: "fondofijo",
                    type: "number",
                    title: "Fondo Fijo",
                    icon: "WebAppBuilderModule",
                    default: 0,
                    min: 0,
                    max: Number.MAX_SAFE_INTEGER
                },
                {
                    name: "asignacioncompcambio",
                    type: "number",
                    title: "Asignacion Comp por Cambio",
                    icon: "WebAppBuilderModule",
                    default: 0,
                    min: 0,
                    max: Number.MAX_SAFE_INTEGER
                },
                {
                    name: "otros1",
                    type: "number",
                    title: "Otros 1",
                    icon: "WebAppBuilderModule",
                    default: 0,
                    min: 0,
                    max: Number.MAX_SAFE_INTEGER
                },
                {
                    name: "otros2",
                    type: "number",
                    title: "Otros 2",
                    icon: "WebAppBuilderModule",
                    default: 0,
                    min: 0,
                    max: Number.MAX_SAFE_INTEGER
                },
                {
                    name: "otros3",
                    type: "number",
                    title: "Otros 3",
                    icon: "WebAppBuilderModule",
                    default: 0,
                    min: 0,
                    max: Number.MAX_SAFE_INTEGER
                },
                {
                    name: "otros4",
                    type: "number",
                    title: "Otros 4",
                    icon: "WebAppBuilderModule",
                    default: 0,
                    min: 0,
                    max: Number.MAX_SAFE_INTEGER
                },{},{}
                ]
                
                var indexCol = 4
                var colW = 100/indexCol
                var nRows = Math.ceil(inputs.length/indexCol)
                //Mainform
                for (let i = 0; i < nRows; i++) {
                    page.$el.find(".mainForm").append(`<div class="row row-`+i+`"></div>`)
                }
                //Haberes
                var nRows = Math.ceil(bonosCheck.length/indexCol)
                for (let i = 0; i < nRows; i++) {
                    page.$el.find(".bonosForm").append(`<div class="row bonorow-`+i+`"></div>`)
                }
                //Extras
                var nRows = Math.ceil(extra.length/indexCol)
                for (let i = 0; i < nRows; i++) {
                    page.$el.find(".extraForm").append(`<div class="row extrarow-`+i+`"></div>`)
                }


                for (let i = 0; i < inputs.length; i++) {
                    var rowIndex =  Math.floor(i/indexCol)
                    const element = inputs[i];
                    if(element.type === "selector"){
                        page.$el.find(".row-" + rowIndex).append(`
                            <div class="col-`+colW+`">
                                <div class="item-content item-input">
                                    <div class="item-inner">
                                        <div class="item-title item-label">`+element.title+`</div>
                                        <div class="item-input-wrap">
                                            <input name="`+element.name+`" type="text">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `)
                    }
                    else if(element.type === "number"){
                        page.$el.find(".row-" + rowIndex).append(`
                            <div class="col-`+colW+`">
                                <div class="item-content item-input">
                                    <div class="item-inner">
                                        <div class="item-title item-label">`+element.title+`</div>
                                        <div class="item-input-wrap">
                                            <input type="number" name="`+element.name+`" value="`+element.default+`" min="`+element.min+`" max="`+element.max+`" validate>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `)
                    }
                    else{
                        page.$el.find(".row-" + rowIndex).append(`<div class="col-`+colW+`"></div>`)
                    }
                }

                for (let i = 0; i < bonosCheck.length; i++) {
                    var rowIndex =  Math.floor(i/indexCol)
                    const element = bonosCheck[i];
                    if(element.type === "checkbox"){
                        page.$el.find(".bonorow-" + rowIndex).append(`
                            <div class="col-`+colW+`">
                                <div class="item-content item-input">
                                    <div class="item-inner">
                                        <div class="item-title">`+element.title+`</div>
                                        <div class="item-after">
                                            <label class="toggle">
                                                <input  name="`+element.name+`" type="checkbox">
                                                <span class="toggle-icon"></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `)
                    }
                    else{
                        page.$el.find(".bonorow-" + rowIndex).append(`<div class="col-`+colW+`"></div>`)
                    }
                }

                for (let i = 0; i < extra.length; i++) {
                    var rowIndex =  Math.floor(i/indexCol)
                    const element = extra[i];
                    if(element.type === "number"){
                        page.$el.find(".extrarow-" + rowIndex).append(`
                            <div class="col-`+colW+`">
                                <div class="item-content item-input">
                                    <div class="item-inner">
                                        <div class="item-title item-label">`+element.title+`</div>
                                        <div class="item-input-wrap">
                                            <input type="number" name="`+element.name+`" value="`+element.default+`" min="`+element.min+`" max="`+element.max+`" validate>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `)
                    }
                    else{
                        page.$el.find(".extrarow-" + rowIndex).append(`<div class="col-`+colW+`"></div>`)
                    }
                }

                var initSelectors = inputs.filter(c => c.type === "selector")
                for (let i = 0; i < initSelectors.length; i++) {
                    const element = initSelectors[i];

                    app.autocomplete.create({
                        inputEl: 'input[name='+element.name+']',
                        openIn: 'dropdown',
                        typeahead: true,
                        source: function (query, render) {
                          var results = [];
                          if (query.length === 0) {
                            render(results);
                            return;
                          }
                          // Find matched items
                          for (var i = 0; i < element.options.length; i++) {
                            if (element.options[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(element.options[i]);
                          }
                          // Render items by passing array with result items
                          render(results);
                        }
                      });
                }

                app.accordion.open(".acordion-default")

                page.$el.find("input").on("change", function(){
                    var form = page.$el.find("input").toArray().reduce(function(obj, item) {
                        if($(item).attr("type") === "checkbox"){
                            obj[item.name] = item.checked;
                            return obj;  
                        }
                        else{
                            obj[item.name] =  $(item).val()
                            return obj;  
                        }
                     
                    }, {});

                    var haberes = context.simuladorRenta.calcular(form)
                    var html = ""
                    var remu = 0
                    haberes.forEach(e => {
                        if(e.haber){
                            remu+=e.valor
                        }
                        
                        html += `
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title">`+e.nombre+`</div>
                                    <div class="item-after">`+e.valor+`</div>
                                </div>
                            </div>
                        </li>
                        `
                    });

    
                    page.$el.find(".Resultados").html(`
                        <div class="list">
                            <ul>
                            `+html+`
                            </ul>
                        </div>
                    `)
                    page.$el.find(".ResultadoSueldo").html(remu)

                    

                })

            }
            initClass()
            mths.removePageLoader()
        

        },
        pageMounted: function(e, page) {
        },
        pageBeforeIn: function(e, page) {
        },
        pageAfterIn: function(e, page) {
        },
        pageBeforeOut: function(e, page) {
        },
        pageAfterOut: function(e, page) {
        },
        pageBeforeRemove: function(e, page) {
            
            var data = this.$options.data();
            console.log(data)
            for (var key in data.forms) {
                data.forms[key].destroy();
            }
            for (var key in data.tables) {
                data.tables[key].destroy();
            }
        }
    }
  };