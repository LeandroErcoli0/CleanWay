document.getElementById("btn_registrarse").addEventListener("click", registro);
document.getElementById("btn_iniciar_sesion").addEventListener("click",InicioSesion);
window.addEventListener("resize", anchoPagina);
// Declaracion de variables
var formulario_log = document.querySelector('.formulario_log');
var formulario_reg = document.querySelector('.formulario_reg');
var contenedor_form = document.querySelector('.contenedor_formularios');
var caja_trasera_login = document.querySelector('.caja_trasera_login');
var caja_trasera_registro = document.querySelector('.caja_trasera_registro');

function anchoPagina(){
    if (window.innerWidth >850){
        caja_trasera_login.style.display='block';
        caja_trasera_registro.style.display='block';
    }else {
        caja_trasera_login.style.display='none';
        caja_trasera_registro.style.opacity='1';
        caja_trasera_registro.style.display='block';
        formulario_log.style.display='block';
        formulario_reg.style.display='none';
        contenedor_form.style.left='0px';
    }
}
anchoPagina()


function registro() {
    if(window.innerWidth>850){
        formulario_reg.style.display = 'block';
        contenedor_form.style.left = '410px';
        formulario_log.style.display = 'none';
        caja_trasera_registro.style.opacity = "0";
        caja_trasera_login.style.opacity = "1";
    }else{
        formulario_reg.style.display = 'block';
        contenedor_form.style.left = '0px';
        formulario_log.style.display = 'none';
        caja_trasera_registro.style.display = "none";
        caja_trasera_login.style.display = "block";
        caja_trasera_login.style.opacity = "1";
    }
};
function InicioSesion() {
    if (window.innerWidth > 850){
        formulario_reg.style.display = 'none';
        contenedor_form.style.left = '10px';
        formulario_log.style.display = 'block';
        caja_trasera_registro.style.opacity = "1";
        caja_trasera_login.style.opacity = "0";
    }else {
        formulario_reg.style.display = 'none';
        contenedor_form.style.left = '0px';
        formulario_log.style.display = 'block';
        caja_trasera_registro.style.display = "block";
        caja_trasera_login.style.display = "none";
    }
}

