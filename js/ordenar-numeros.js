var ordenarNumeros = (function(){
  var en_proceso = false;
  var proceso_completado = false;

  var dom = {};
  dom.canvas_aleatorios = $('.Canvas-aleatorios');
  dom.brain             = $('.Canvas-brain');
  dom.brain_img         = dom.brain.children('.image');
  dom.btn_ordenar       = $('.btn_ordenar');

  var lista_ordenada;
  var pos_lista_ordenada = 0;

  // Ordenamos los valores del array
  var ordenarLista = function( lista_desordenada ){
    lista_ordenada = lista_desordenada.sort(function(a,b){ return a - b; });

    // Mostramos la imagen del cerebrito
    dom.brain.slideDown(500, function(){
      procesarLista();
    });
  };

  // Recorremos la lista ordenada para ver que números tenemos que
  // cambiar de posición
  var procesarLista = function(){

    // Paramos el recorrido de la lista
    if( pos_lista_ordenada >= (lista_ordenada.length-1)){
      ordenarNumeros.proceso_completado = true;
      pos_lista_ordenada = 0;

      dom.brain.slideUp(500, function(){
        mensaje.show('¡Listo hemos terminado!', 'success');
        dom.btn_ordenar.removeAttr('disabled');
      });


      return false;
    }

    var numero_seleccionado       = dom.canvas_aleatorios.children('.item-numero[data-value="'+lista_ordenada[ pos_lista_ordenada ]+'"]');
    var index_numero_seleccionado = numero_seleccionado.index();
    var val_numero_seleccionado   = lista_ordenada[ pos_lista_ordenada ];

    // Si el primer valor de la lista ordenada tiene la posición cero,
    // aumentamos el valor en 1 del índice que hace el recorrido y volvemos a procesar
    // el siguiente número en la lista.
    if (index_numero_seleccionado === 0) {
      pos_lista_ordenada++;
      procesarLista();
      return false;
    }

    // Para todos aquellos valores que no se encuentran en la posición cero, pasamos
    // a compararlo con todos los números anteriores a el en el canvas
    for (var i = 0; i < index_numero_seleccionado; i++) {

      var numero_anterior     = dom.canvas_aleatorios.children('.item-numero:eq('+i+')');
      var val_numero_anterior = numero_anterior.data('value');

      if (val_numero_anterior > val_numero_seleccionado) {
        // Enviamos qué número será cambiado y dónde será insertado
        cambiarPosicion(numero_seleccionado, numero_anterior);
        return false;
      }

      if (i === index_numero_seleccionado-1) {
        pos_lista_ordenada++;
        procesarLista();
      }
    }

  };

  // Procedemos a cambiar la posición del número que acabamos de detectar
  var cambiarPosicion = function(numero_seleccionado, numero_anterior){

    // Retiramos el item de la lista aleatoria
    var pos_init_left = numero_seleccionado.position().left;
    var pos_init_top = numero_seleccionado.position().top;
    var brain_timer;
    var brain_timer_limit = 6;

    // Retirar número del canvas
    var retirarNumero = function(){
      if(numero_seleccionado.next().length){
        numero_seleccionado.next().css('margin-left','35px');
      }
      var pos_left_destino = Math.floor($('.Canvas').outerWidth() / 2 - 17.5);
      numero_seleccionado
        .css({
          'position':'absolute',
          'left': pos_init_left,
          'top': pos_init_top
        })
        .animate({ 'top':'86px' }, function(){
          numero_seleccionado.next().animate({'margin-left':'0'});
        })
        .animate({ 'left': pos_left_destino}, 400, function(){
          brain_timer = setInterval(function(){
            dom.brain_img.toggleClass('change_bg');
            brain_timer_limit--;
            if(brain_timer_limit === 0){
              window.clearInterval(brain_timer);
              setTimeout(function(){
                insertarNumero();
              },300);
            }
          }, 100);
        });
    };
    retirarNumero();

    // Insertar número en la nueva posición
    var insertarNumero = function(){
      numero_destino = numero_anterior;
      var posX_destino = numero_destino.index() * 35 + 15;

      numero_destino.animate({ 'margin-left':'35px' },400);
      numero_seleccionado
        .animate({'margin-left':'0','left': posX_destino}, 400)
        .animate({'top': pos_init_top}, 400, function(){
          $(this)
            .insertBefore(numero_destino)
            .css({
              'position':'relative',
              'left': 0,
              'top': 0
            });

          numero_destino.css('margin-left','0');
          pos_lista_ordenada++;
          procesarLista();
        });
    };
  };

  return {
    ordenar: ordenarLista,
    en_proceso: en_proceso,
    proceso_completado: proceso_completado
  };

})();
