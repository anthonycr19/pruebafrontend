var app = (function(){
  var dom = {};
  dom.canvas_aleatorios = $('.Canvas-aleatorios');
  dom.btn_ordenar       = $('.btn_ordenar');
  dom.frm_ingreso       = $('.IngresoNumeros-form');
  dom.input_numero      = dom.frm_ingreso.children('.ipt_numero');

  var list_numeros_ingresados = [];

  var init = function(){
    events.validarCampoNumero();
    suscribeEvents();
  };

  // Eventos que tendran los elementos del DOM
  var suscribeEvents = function(){

    // Botón Ordenar
    dom.btn_ordenar.on('click', function(){
      if( ordenarNumeros.proceso_completado === true){
        mensaje.show('Se terminó de ordenar los números, por ahora debes recargar la página.', 'success');
        return false;
      }
      // Validamos que existan suficientes números para llamar al método ordenarNumeros.
      if (list_numeros_ingresados.length < 2) {
        mensaje.show('No existen suficientes números para ordenar.', 'alert');
      } else {

        dom.btn_ordenar.attr('disabled', true);
        // Enviamos como parámetro la lista desordenada
        ordenarNumeros.ordenar(list_numeros_ingresados);
      }
    });
  };

  var events = {};

  /**
   * Validamos el campo que sirve para ingresar los números aleatorios:
   * No se permite textos o signos, sólo se permite números enteros y positivos.
   */
  events.validarCampoNumero = function(){
    dom.input_numero.numeric();
    dom.frm_ingreso.validate({
      rules: {
        ipt_numero: {
          required: true,
          number: true,
          maxlength: 3,
          minlength: 1,
        }
      },
      messages: {
        ipt_numero: {
          required: "Ingrese un número.",
          digits: "Sólo números por favor.",
          maxlength: "3 dígitos como máximo."
        }
      },
      submitHandler: function(form){
        var numero = dom.input_numero.val();
        events.ingresarNumero(numero);
        dom.input_numero.val('');
      }
    });
  };

  /**
   * Ingresamos números aleatorios no repetidos al canvas
   * @param  {[number]} numero Valor que se ingresó desde el formulario
   */
  events.ingresarNumero = function(numero){
    var tpl_numero;
    var list_position;

    // Buscamos si el número ya se ha ingresado
    var number_exists = list_numeros_ingresados.indexOf(numero);
    if (number_exists ===  -1) {
      list_position = list_numeros_ingresados.push(numero) - 1;
      tpl_numero = '<span class="item-numero" data-value="'+numero+'">'+numero+'</span>';
      dom.canvas_aleatorios.append(tpl_numero);
    }
  };

  return {
    start: init
  };

})();

$(function(){
  app.start();
});
