

var facil = 4
var medio = 7
var experto = 9
var dificultad = 0
var nombre = ''
var nimg = 0
var minimoIslas = 4



$(document).ready(function () {
    comienzaJuego();
    introduceNombre()
})

function comienzaJuego(){
    $('#juego').hide()
    $('#dificultad').hide()
    $('#dialog-confirm').hide()
    $('#dialog-message').hide()
    
    $('#gallery').empty()
    $('div.isla li').remove()

    $('.bloq').removeClass('oculto')
    $('.isla').addClass('oculto')
}


$(function () {
    $("#inputNombre").on("invalid", function () {
        this.setCustomValidity("Introducir solamente letras y espacios. Máximo 100 caracteres.")
    })
    $('#inputNombre').on("input", function () {
        this.setCustomValidity("")
        nombre = this.value
    })

})


function setDificultad() {
    $(function () {
        $('#dificultad').dialog({
            resizable: false,
            height: 'auto',
            width: 400,
            modal: true,
            buttons: {
                'Fácil': function () {
                    dificultad = facil
                    $(this).dialog('close')
                    imagenesAleatorias()
                },
                'Medio': function () {
                    dificultad = medio
                    $(this).dialog('close')
                    imagenesAleatorias()
                },
                'Experto': function () {
                    dificultad = experto
                    $(this).dialog('close')
                    imagenesAleatorias()
                }
            }
        })
    })
}


function imagenesAleatorias() {
    var lista = []
    var islasUsadas = []
    var isla = 0
    var zona = 0
    var n = 0
    for (let i = 0; i < dificultad; i++) {
        var introduce = false
        while (!introduce){
            isla = Math.floor(Math.random() * 7) + 1
            zona = Math.floor(Math.random() * 7) + 1
            if (!lista.includes(isla + ' ' +zona)){
                lista.push(isla + ' ' + zona)
                introduce = true
            }
        }
        $('#gallery').append('<li class="ui-widget-content ui-corner-tr"><img id="'+ isla +'" src="images/'+ isla +'/'+ zona +'.jpg" height="200px"></li>')
        $('.bloqueo'+isla).addClass('oculto')
        $('.isla#'+isla).removeClass('oculto')
        if (!islasUsadas.includes(isla)){
            islasUsadas.push(isla)
            n++
        }
        
    }
    while (n < minimoIslas){
        var islasOcultas = $('.isla.oculto')
        var islasOcultasId = []
        $(islasOcultas).each(function(){
            islasOcultasId.push($(this).attr('id'))
        })
        isla = Math.floor(Math.random() * $(islasOcultasId).size())
        $('.bloqueo'+islasOcultasId[isla]).addClass('oculto')
        $('.isla#'+islasOcultasId[isla]).removeClass('oculto')
        n++
    }
    nimg = dificultad
    dragdrop()
    $('#juego').show()
}



function introduceNombre() {
    $('#inputNombre').resizable()
}


$('#formulario').submit(function (e) {
    e.preventDefault();
    $('#formulario').hide()
    $('#dificultad').show()
    setDificultad()
})


function calculaPuntos(){
    var puntos = 0
    $('.isla').each(function(){
        var islaActual = $(this).attr('id')
        var imagenes = $(this).find('img')
        $(imagenes).each(function(){
            if ($(this).attr('id') == islaActual)
                puntos++
        })
        
    })
    return puntos
}


function mensajeFin() {
    $("#dialog-message p").remove()
    calculaPuntos()
    $("#dialog-message").append("<p>" + nombre + " tienes " + calculaPuntos() + "/"+ dificultad +" puntos</p>");
    $(function () {
        $("#dialog-message").dialog({
            modal: true,
            buttons: {
                "Continuar aquí": function () {
                    $(this).dialog("close");
                },
                "Jugar de nuevo": function () {
                    $(this).dialog("close");
                    comienzaJuego()
                    setDificultad()
                }
            }
        });
    });
    $('#dialog-message').show()
}



function preguntaFin() {
    $("#dialog-confirm").dialog({
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
            "Seguir jugando": function () {
                $(this).dialog("close");
            },
            'Terminar': function () {
                $(this).dialog("close");
                mensajeFin()
            }
        }
    });
    $('#dialog-confirm').show()

}





function dragdrop() {


    var $gallery = $("#gallery"),
        $islaActual = $(".isla");

    $("li", $gallery).draggable({
        cancel: "a.ui-icon",
        revert: "invalid",
        containment: "document",
        helper: "clone",
        cursor: "move",
        appendTo: "#mapa"
    });

    $islaActual.each(function () {
        $(this).droppable({
            accept: "#gallery > li",
            classes: {

            },
            drop: function (event, ui) {
                deleteImage(ui.draggable, this);
                nimg--
                if($(ui.draggable).find('img').attr('id') == $(this).attr('id')){
                    toastr.success('', 'Isla Correcta: +1pt')
                }
                else{
                    toastr.error('', 'Isla Incorrecta: +0pts') 
                }
                if (nimg == 0)
                    preguntaFin()
            }
        })
    })


    $gallery.droppable({
        accept: ".isla li",

        drop: function (event, ui) {
            recycleImage(ui.draggable);
        }
    });

    function deleteImage($item, isla) {
        $item.fadeOut(function () {
            var $list = $("ul", $islaActual).length;

            $item.appendTo(isla).fadeIn(function () {
                $item
                    .animate({ height: "40px" })
                    .find("img")
                    .animate({ height: "40px" });
            });
        });
    }


    // Image recycle function
    function recycleImage($item) {
        $item.fadeOut(function () {
            $item
                .find("a.ui-icon-refresh")
                .remove()
                .end()
                .css("height", "200px")
                .find("img")
                .css("height", "200px")
                .end()
                .appendTo($gallery)
                .fadeIn();
        });
        nimg++

    }

}