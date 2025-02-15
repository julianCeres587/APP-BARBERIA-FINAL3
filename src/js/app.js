let paso = 1; //"paso"inicial

const pasoInicial=1;
const pasoFinal=3;

const cita = {
    id: '',
    nombre:'',
    fecha:'',
    hora:'',
    servicios: []

}


document.addEventListener('DOMContentLoaded', function(){
     iniciarApp();

});

function iniciarApp(){   //se lleman cuando carga la app
    mostrarSeccion(); //muestra y oculta las secciones luego de iniciar sesion
   tabs();//cambiar seccion cuandos e hace click
   botonesPaginador();
   paginaSiguiente();
   paginaAnterior(); //agrega o quita botones paginador(sigueinte, anterior)
  
   consultarAPI(); //consulta la API en PHP
   idCliente();
   nombreCliente(); //agrega el nombre del cliente ya proporcionado al objeto cita
   seleccionarFecha(); //agrega la fecha a cita
   seleccionarHora(); //agrega la hora de la cita en el objeto

   mostrarResumen();
}

function mostrarSeccion(){

    //ocultar la seccion anterior, la que ya se le pasó 'mostrar'

    const seccionAnterior=document.querySelector('.mostrar');
    if(seccionAnterior){
        seccionAnterior.classList.remove('mostrar');
    }

    //quita la clase 'asctual' a la seccion  anterior
    const tabAnterior = document.querySelector('.actual');
    if(tabAnterior){

        tabAnterior.classList.remove('actual');
    }
    
    //seleccionar seccion con el paso
    const pasoSelector = `#paso-${paso}`;  //busca el paso activo
    const seccion = document.querySelector(pasoSelector);
    seccion.classList.add('mostrar');

    //resalta las seccion en la qeue se encu4entra
    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add('actual');
}

function tabs(){
    const botones = document.querySelectorAll('.tabs button');

      botones.forEach( boton => {

            boton.addEventListener('click' , function(e){
                paso = parseInt(e.target.dataset.paso);

                mostrarSeccion();

                botonesPaginador(); 

                
            });
      } )

      

}

function botonesPaginador(){
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if(paso === 1){

        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if(paso === 3){

        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');

        mostrarResumen();
    }  else{
        paginaSiguiente.classList.remove('ocultar');
        paginaAnterior.classList.remove('ocultar');
    }
     mostrarSeccion();
}

function paginaSiguiente(){
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', function(){
        if(paso >= pasoFinal)return;
        paso++;
        
       botonesPaginador();
        
    } )
 

}
function paginaAnterior(){
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', function(){
        if(paso <= pasoInicial)return;
        paso--;
        
       botonesPaginador();
        
    } )

   
}

 
 async function consultarAPI(){
      
    try {
        const url = '/api/servicios';
        const resultado = await fetch(url);
        const servicios = await resultado.json();
        mostrarServicios(servicios);
        
    } catch (error) {
        console.log(error);
    }

}


function mostrarServicios(servicios){
   
      servicios.forEach( servicio => {
        const {id, nombre, precio} = servicio;

       

        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent = nombre;

    
        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `$${precio}`;

        
        const servicioDiv = document.createElement('DIV');
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio = id;
        servicioDiv.onclick = function() {
              seleccionarServicio(servicio);
        }

        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);

        
        document.querySelector('#servicios').appendChild(servicioDiv);

      })

}

function seleccionarServicio(servicio){
    const { id } = servicio;
    const {servicios} = cita;
     //identificar elemlento al que se da click
    const divServicio=document.querySelector(`[data-id-servicio="${id}"]`);

    //comrpobar si el servicioo ya está agregado y quitarlo
    if( servicios.some(agregado => agregado.id === servicio.id ) ) {    //.some retorna true o false depenmdiendo si ya exiuste el elemnto en el arreglo
         //eliminar servicio
         cita.servicios = servicios.filter( agregado => agregado.id !== id );
         divServicio.classList.remove('seleccionado');
    }
    else{
       //agregarlo
       cita.servicios = [...servicios, servicio]; //copia el arreglo de servicios y le agrega el nuevo seleccionado
       divServicio.classList.add('seleccionado');   //hace que cuando seleccionen un servicio, se resalte
    }


   
    
    
    console.log(cita);


}

function idCliente(){
     const id = document.querySelector('#id').value;
      cita.id = id;

}

function nombreCliente(){ //queda el nombre en el arreglo
     const nombre = document.querySelector('#nombre').value;

     cita.nombre = nombre;

}

function seleccionarFecha(){
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input', function(e){

        const dia = new Date(e.target.value).getUTCDay();


        if([0].includes(dia)){  //comprueba si un valor existe
            e.target.value = '';
            mostrarAlerta('No abrimos Domingos Ni Festivos', 'error', '.formulario');
        }
        else{

            cita.fecha = e.target.value;
        }
    })

}

function seleccionarHora () {
   const inputHora = document.querySelector('#hora');//seleccion id hora
   inputHora.addEventListener('input', function(e){
        
       const horaCita = e.target.value;
       const hora = horaCita.split(":")[0];

       if(hora < 10 || hora >18){
        e.target.value = '';
           mostrarAlerta('Hora Invalida, No está abierto' , 'error', '.formulario');

       }else{

          cita.hora = e.target.value;

          console.log(cita);
       }
    
    
   })
}

function mostrarAlerta(mensaje, tipo, elemento, desaparece=true) {
    //evita mas de una alerta
    const alertaPrevia = document.querySelector('.alerta');
     if(alertaPrevia) {
         alertaPrevia.remove();
     } 

     //scripting crear alerta
      const alerta = document.createElement('DIV');
      alerta.textContent = mensaje;
      alerta.classList.add('alerta');
      alerta.classList.add(tipo);

      const referencia = document.querySelector(elemento);
      referencia.appendChild(alerta);
       if(desaparece){
        setTimeout(() => {
            alerta.remove(); //depues de un tiempo se quita la alerta
        }, 3000);
  

       }
      
 
}

function mostrarResumen(){
     const resumen = document.querySelector('.contenido-resumen');

      //limpiar contenido resumen

      while(resumen.firstChild){
          resumen.removeChild(resumen.firstChild);

      }
     

     if(Object.values(cita).includes('') || cita.servicios.length ===0){
        mostrarAlerta('Hacen falta Fecha, Horas o Servicios', 'error', '.contenido-resumen', false );
     return;
     }

     // Formatear el div de resumen
     const {nombre, fecha, hora, servicios} = cita;

     

     const nombreCliente = document.createElement('P');
     nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;


     //formatear fecha en español

     const fechaobj = new Date(fecha);
     const mes = fechaobj.getMonth();
     const dia = fechaobj.getDate() +2;
     const year = fechaobj.getFullYear();

     const fechaUTC = new Date(Date.UTC(year, mes, dia));

     const opciones = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}

     const fechaFormateada = fechaUTC.toLocaleDateString('es-CO', opciones); //c0 es el de colombia, si lo quiere en otro pasis busca su prefijo
     


     const fechaCita = document.createElement('P');
     fechaCita.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`;

     const horaCita = document.createElement('P');
     horaCita.innerHTML = `<span>Hora:</span> ${hora} Horas`;


     //Heading para servicios en Resumen
     const headingServicios = document.createElement('H3');
     headingServicios.textContent = 'Resumen de Servicios';
     resumen.appendChild(headingServicios);


     servicios.forEach(servicio => {

        const {id, precio, nombre} = servicio;  //aplica dstructure, extrae esas propiedades de servicio
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        resumen.appendChild(contenedorServicio);

        
     


     })

     const headingCita = document.createElement('H3');
     headingCita.textContent = 'Datos De Su Cita';
     resumen.appendChild(headingCita);

     const botonReservar = document.createElement('BUTTON');
     botonReservar.classList.add('boton');
     botonReservar.textContent = 'Reservar Cita';
     botonReservar.onclick = reservarCita;

         resumen.appendChild(nombreCliente);
        resumen.appendChild(fechaCita);
        resumen.appendChild(horaCita);

        resumen.appendChild(botonReservar);
     }

     async function reservarCita(){
        const {nombre, fecha, hora, servicios, id} = cita; //extrrae datos de cita
        const idServicios = servicios.map(servicio => servicio.id);
        
        
        const datos = new FormData();
        
        datos.append('fecha', fecha);
        datos.append('hora', hora);
        datos.append('usuarioId', id);
        datos.append('servicios', idServicios);

        //console.log([...datos]);

        try {

            //peticion hacia la api
        const url = '/api/citas'

        const respuesta = await fetch(url, {
            method: 'POST',
            body: datos
        });
        
        const resultado = await respuesta.json();

        console.log(resultado.resultado);

        if(resultado.resultado){   //agrega alerta con sweetalert
            Swal.fire({
                icon: "success",
                title: "Reservación Exitosa",
                text: "Su cita ha sido creada correctamente",
                button: 'OK'
              }).then( () => {
                   setTimeout(() => {
                    window.location.reload();
                   }, 1000);
                   
              })


              

        }
            
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Ha ocurrido un error al guardar su reservación"
                
              });
        
        
        }

 
     }

     


     

