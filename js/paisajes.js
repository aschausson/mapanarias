var lugares = {
    'tenerife': 1,
    'gomera': 2,
    'hierro': 3,
    'palma': 4,
    'grancanaria': 5,
    'lanzarote': 6,
    'fuerteventura': 7
}

var facil = 4
var medio = 7
var experto = 9
var dificultad = 0
var nombre = ''
var nimg = 0

introduceNombre()


$(document).ready(function () {
    $('#juego').hide()
    $('#dificultad').hide()
    $('#dialog-confirm').hide()
    $('#dialog-message').hide()
})


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
    var isla = 0
    var zona = 0
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
                Ok: function () {
                    $(this).dialog("close");
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
            "Jugar": function () {
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

    // There's the gallery and the trash
    var $gallery = $("#gallery"),
        $trash = $(".isla");

    // Let the gallery items be draggable
    $("li", $gallery).draggable({
        cancel: "a.ui-icon", // clicking an icon won't initiate dragging
        revert: "invalid", // when not dropped, the item will revert back to its initial position
        containment: "document",
        helper: "clone",
        cursor: "move",
        appendTo: "#mapa"
    });

    // Let the trash be droppable, accepting the gallery items
    $trash.each(function () {
        $(this).droppable({
            accept: "#gallery > li",
            classes: {

            },
            drop: function (event, ui) {
                deleteImage(ui.draggable, this);
                nimg--
                if (nimg == 0)
                    preguntaFin()
            }
        })
    })

    // Let the gallery be droppable as well, accepting items from the trash
    $gallery.droppable({
        accept: ".isla li",

        drop: function (event, ui) {
            recycleImage(ui.draggable);
        }
    });

    function deleteImage($item, isla) {
        $item.fadeOut(function () {
            var $list = $("ul", $trash).length;

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