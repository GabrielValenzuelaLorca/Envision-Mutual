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

        var mansaje = ""
        mansaje += "Cargo --> " + sueldoBase.cargo + "<br>"
        mansaje += "Categoria --> " + sueldoBase.categoria + "<br>"

        var remu = 0
        var sueldo_base = sueldoBase.sbase

        if(sueldoBase.sbasehoras){
            mansaje +="S.Base (horas) --> " + sueldo_base*reajuste_base*parseInt(obj.horas)*parseInt(obj.dias)+ "<br>"
            remu += sueldo_base*reajuste_base*parseInt(obj.horas)*parseInt(obj.dias)
        }
        else{
            mansaje +="S.Base --> " + sueldo_base*reajuste_base+ "<br>"
            if(parseInt(obj.sbase2)> 0){
                mansaje +="S.Base 2 --> " + (sueldo_base*reajuste_base + parseInt(obj.sbase2) )+ "<br>"
                sueldo_base += parseInt(obj.sbase2)
            }
            remu += sueldo_base*reajuste_base
        }

       
        mansaje +=sueldoBase.bono_comp>0?"Bono Compensatorio --> " + sueldoBase.bono_comp*reajuste_base+ "<br>":""
        remu += sueldoBase.bono_comp*reajuste_base
        mansaje += sueldoBase.trab_terreno>0?"Trab. Terreno--> " + sueldoBase.trab_terreno*reajuste_base+ "<br>":""
        remu += sueldoBase.trab_terreno*reajuste_base

        if(sueldoBase.esc === "M"){
            mansaje +=asignacion_anios.medico>0?"Antiguedad/Permanencia (Medico)--> " + sueldo_base * asignacion_anios.medico*reajuste_base+ "<br>":""
            remu += sueldo_base * asignacion_anios.medico*reajuste_base
        }
        else if(sueldoBase.esc === "L"){
            mansaje +=asignacion_anios.medico>0?"Antiguedad/Permanencia (Medico L)--> " + sueldo_base * asignacion_anios.medico_l*reajuste_base+ "<br>":""
            remu += sueldo_base * asignacion_anios.medico_l*reajuste_base
        }
        else{
            mansaje +=asignacion_anios.general>0?"Antiguedad/Permanencia (General)--> " + sueldo_base * asignacion_anios.general*reajuste_base+ "<br>":""
            remu += sueldo_base * asignacion_anios.general*reajuste_base
        }

        mansaje +=asignaciones_extra.grati>0?"Gratificacion-->" + sueldo_base * asignaciones_extra.grati*reajuste_base+ "<br>":""
        remu += sueldo_base * asignaciones_extra.grati*reajuste_base

        if(sueldoBase.esc === "E"){
            mansaje +=asignacion_zona.asig_z_exp>0?"Asig. Zona (Exp?)-->" + sueldo_base * asignacion_zona.asig_z_exp*reajuste_base+ "<br>":""
            remu += sueldo_base * asignacion_zona.asig_z_gral*reajuste_base
        }
        else{
            mansaje +=asignacion_zona.asig_z_gral>0?"Asig. Zona (Gral?)-->" + sueldo_base * asignacion_zona.asig_z_gral*reajuste_base+ "<br>":""
            remu += sueldo_base * asignacion_zona.asig_z_gral*reajuste_base
        }

        mansaje += asignaciones_extra.estimulo>0?"Asig. Estimulo-->" + sueldo_base * asignaciones_extra.estimulo*reajuste_base+ "<br>":""
        remu += sueldo_base * asignaciones_extra.estimulo*reajuste_base

        if(obj.turnoLlamado){
            mansaje +=asignaciones_extra.llamado>0?"Turno llamado-->" + sueldo_base * asignaciones_extra.llamado*reajuste_base+ "<br>":""
            remu += sueldo_base * asignaciones_extra.llamado*reajuste_base
        }
        if(obj.respLugarTrab){
            mansaje +=asignaciones_extra.resp_tl>0?"Asig. Resp. Lugar. Trab.-->" + sueldo_base * asignaciones_extra.resp_tl*reajuste_base+ "<br>":""
            remu += sueldo_base * asignaciones_extra.resp_tl*reajuste_base
        }
        if(obj.bonoEntregaTurno && obj.jornada != "no"){
            mansaje +=asignaciones_extra.bono_ent_t>0?"Bono Entr. Turno-->" + asignaciones_extra.bono_ent_t*reajuste_base+ "<br>":""
            remu += asignaciones_extra.bono_ent_t*reajuste_base
        }
        if(obj.asigTitulo){
            mansaje +=asignaciones_extra.titulo>0?"Asig. Titulo--> " + sueldo_base * asignaciones_extra.titulo*reajuste_base+ "<br>":""
            remu +=   sueldo_base * asignaciones_extra.titulo*reajuste_base
        }
        if(obj.asigCaja){
            mansaje +=asignaciones_extra.asigna_caja>0?"Asig. Caja-->" + asignaciones_extra.asigna_caja*reajuste_base+ "<br>":""
            remu += asignaciones_extra.asigna_caja*reajuste_base
        }

        mansaje +=asignaciones_extra.movilizacion>0?"Asig. Movilizacion-->" + asignaciones_extra.movilizacion*reajuste_base+ "<br>":""
        remu += asignaciones_extra.movilizacion*reajuste_base
        mansaje +=sueldoBase.esp>0?"Asig. Especialidad-->" + sueldo_base * sueldoBase.esp*reajuste_base+ "<br>":""
        remu += sueldo_base * sueldoBase.esp*reajuste_base
        mansaje +=sueldoBase.sub>0?"Asig. Sub Especialidad-->" + sueldo_base * sueldoBase.sub*reajuste_base+ "<br>":""
        remu += sueldo_base * sueldoBase.sub*reajuste_base

        if(obj.bonoCasa && remu<=asignaciones_extra.tope_bono_casa*reajuste_base){
            mansaje += asignaciones_extra.bono_casa>0?"Bono casa-->" + asignaciones_extra.bono_casa*reajuste_base+ "<br>":""
            remu += asignaciones_extra.bono_casa*reajuste_base
        }

        mansaje +="--------------"+ "<br>"

        mansaje +="Remuneracion Bruta Mensual: " + remu+ "<br>"

        return mansaje
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
            <div class="list inline-labels no-hairlines-md mainForm">
                <div class="row">
                    <div class="col-50">
                        <div class="item-media"><i class="icon demo-list-icon"></i></div>
                        <div class="item-inner">
                            <div class="item-title item-label">Jornada</div>
                            <div class="item-input-wrap">
                                <select name="categoria"></select>
                            </div>
                        </div>
                    </div>
                    <div class="col-50">
                        <div class="item-media"><i class="icon demo-list-icon"></i></div>
                        <div class="item-inner">
                            <div class="item-title item-label">Jornada</div>
                            <div class="item-input-wrap">
                                <select name="zona"></select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-50">
                        <div class="item-media"><i class="icon demo-list-icon"></i></div>
                        <div class="item-inner">
                            <div class="item-title item-label">Horas</div>
                            <div class="item-input-wrap">
                                <input type="text"  name="horas" placeholder="0">
                                <span class="input-clear-button"></span>
                            </div>
                        </div>
                    </div>
                    <div class="col-50">
                        <div class="item-media"><i class="icon demo-list-icon"></i></div>
                        <div class="item-inner">
                            <div class="item-title item-label">Dias</div>
                            <div class="item-input-wrap">
                                <input type="text"  name="dias" placeholder="0">
                                <span class="input-clear-button"></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-50">
                        <div class="item-media"><i class="icon demo-list-icon"></i></div>
                        <div class="item-inner">
                            <div class="item-title item-label">Años</div>
                            <div class="item-input-wrap">
                                <input type="text"  name="anios" value=0>
                                <span class="input-clear-button"></span>
                            </div>
                        </div>
                    </div>
                    <div class="col-50">
                        <div class="item-media"><i class="icon demo-list-icon"></i></div>
                        <div class="item-inner">
                            <div class="item-title item-label">Sueldo Base 2</div>
                            <div class="item-input-wrap">
                                <input type="text"  name="sbase2" placeholder="0">
                                <span class="input-clear-button"></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-50">
                        <div class="item-media"><i class="icon demo-list-icon"></i></div>
                        <div class="item-inner">
                            <div class="item-title item-label">Jornada</div>
                            <div class="item-input-wrap">
                                <select name="jornada">
                                    <option value="no">Administrativo</option>
                                    <option value="si">Turno 1</option>
                                    <option value="si">Turno 2</option>
                                    <option value="si">Turno 3</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="col-50"></div>
                </div>
                <div class="row">
                    <div class="col-33">
                        <span>Turno Llamado</span>
                        <label class="toggle toggle-init color-black">
                            <input type="checkbox"  name="turnoLlamado">
                            <span class="toggle-icon"></span>
                        </label>
                    </div>
                    <div class="col-33">
                        <span>Resp. Lugar trab.</span>
                        <label class="toggle toggle-init color-black">
                            <input type="checkbox" name="respLugarTrab">
                            <span class="toggle-icon"></span>
                        </label>
                    </div>
                    <div class="col-33">
                        <span>Bono entrega turno</span>
                        <label class="toggle toggle-init color-black">
                            <input type="checkbox" name="bonoEntregaTurno">
                            <span class="toggle-icon"></span>
                        </label>
                    </div>
                </div>
                <div class="row">
                    <div class="col-33">
                        <span>Asif. Titulo</span>
                        <label class="toggle toggle-init color-black">
                            <input type="checkbox" name="asigTitulo">
                            <span class="toggle-icon"></span>
                        </label>
                    </div>
                    <div class="col-33">
                        <span>Asig caja</span>
                        <label class="toggle toggle-init color-black">
                            <input type="checkbox" name="asigCaja">
                            <span class="toggle-icon"></span>
                        </label>
                    </div>
                    <div class="col-33">
                        <span>Bono Casa</span>
                        <label class="toggle toggle-init color-black">
                            <input type="checkbox" name="bonoCasa">
                            <span class="toggle-icon"></span>
                        </label>
                    </div>
                </div>
            </div>

            <button class="col button button-fill ejecutar">Calcular</button>

            <div class="Resultados"></div>
                
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

                page.$el.find("select[name=categoria]").html(context.simuladorRenta.sueldobase.map(c =>{return "<option value='"+c.categoria+"'>"+c.categoria+"</option>"}))
                page.$el.find("select[name=zona]").html(context.simuladorRenta.zona.map(c =>{return "<option value='"+c.ubicacion+"'>"+c.ubicacion+"</option>"}))
                /*
                    <option value="no">Administrativo</option>
                                    <option value="si">Turno 1</option>
                                    <option value="si">Turno 2</option>
                                    <option value="si">Turno 3</option>
                */
            }
            initClass()

            page.$el.find(".ejecutar").on('click', function(){
                var form = page.$el.find(".mainForm").find("input").toArray().reduce(function(obj, item,i) {
                    if(i >=4){
                        obj[item.name] = item.checked;
                        return obj;  
                    }
                    else{
                        obj[item.name] = item.value;
                        return obj;  
                    }
                 
                }, {});

                form["categoria"] = page.$el.find("select[name=categoria]").val()
                form["zona"] = page.$el.find("select[name=zona]").val()
                form["jornada"] = page.$el.find("select[name=jornada]").val()
               
                page.$el.find(".Resultados").html( context.simuladorRenta.calcular(form))

            })

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