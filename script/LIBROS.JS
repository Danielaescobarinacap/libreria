$(document).ready(function() {
    $('#masvistos').click(function() {
        $.ajax({
            url: 'https://www.etnassoft.com/api/v1/get/?criteria=most_viewed',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                let html = '';
                for (let i = 0; i < data.length; i++) {
                    html += '<div class="item-button">';
                    html += '<img src="' + data[i].cover + '" alt="" class="item-img">';
                    html += '<p>Autor: ' + data[i].author + '</p>';
                    html += '<p>Idioma: ' + data[i].language + '</p>';
                    html += '<p><button class="btn-detalle" data-id="' + data[i].ID + '">Detalle</button></p>';
                    html += '</div>';
                }
                $('#contenedor').html(html);
            },
            error: function() {
                console.log('Error en la solicitud AJAX');
            }
        });
    });

    $('#categoria').click(function() {
        $.ajax({
            url: 'https://www.etnassoft.com/api/v1/get/?get_categories=all',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                let html = '<div class="head-menu">';
                for (let i = 0; i < data.length; i++) {
                    html += '<ul id="categories_list"><a id="' + data[i].category_id + '" onclick="busqueda(' + data[i].category_id + ')">' + data[i].name + '</a></ul>';
                }
                html += '</div>';
                $('#categories_list').html(html);
            }
        });
    });

   
    });

    function busqueda(id) {
        $.ajax({
            url: 'https://www.etnassoft.com/api/v1/get/?category_id=' + id,
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                let html = '';
                for (let i = 0; i < data.length; i++) {
                    html += '<div class="item">';
                    html += '<img src="' + data[i].cover + '" alt="" class="item-img">';
                    html += '<p>ID:' + data[i].ID + '</p>';
                    html += '<p>Autor: ' + (data[i].author ? data[i].author : 'Autor no disponible') + '</p>';
                    html += '<p>Idioma: ' + data[i].language + '</p>';
                    html += '<p><button class="btn-detalle" data-id="' + data[i].ID + '">Detalle</button></p>';
                    html += '<p><button class="btn-fav" data-id="' + data[i].ID + '">Agregar a favoritos</button></p>';
                    html += '</div>';
                }
                $('#contenedor').html(html);
            }
        });
    }
    

    $("#contenedor").on("click", ".btn-detalle", function() {
        const libroId = $(this).data("id");
        obtenerDetalleLibro(libroId);
    });
  
    
    function obtenerDetalleLibro(libroId) {
        $.ajax({
            url: `https://www.etnassoft.com/api/v1/get/?id=${libroId}`,
            method: "GET",
            dataType: "json",
            success: function(data) {
                if (data.length > 0) {
                    $("#titulo").text(data[0].title);
                    $("#autor").text(data[0].author ? data[0].author : 'Autor no disponible');
                    $("#sinopsis").text(data[0].content ? data[0].content : 'Sinopsis no disponible');
                    $("#descarga").text(data[0].url_descarga ? data[0].url_descarga : 'URL de descarga no disponible');
                    $("#publicacion").text(data[0].publisher_date ? data[0].publisher_date : 'Fecha de publicación no disponible');
                    $("#editorial").text(data[0].publisher ? data[0].publisher : 'Editorial no disponible');
                    mostrarPopup();
                } else {
                    alert("No se encontró información para este libro.");
                }
            },
            error: function() {
                alert("Error al obtener el detalle del libro.");
            }
        });
    }

    function mostrarPopup() {
        $("#popup").fadeIn();
    }

    function cerrarPopup() {
        $("#popup").fadeOut();
    }

    

    $("#contenedor").on("click", ".btn-fav", function() {
        const libroId = $(this).data("id");
        
        if ($(this).hasClass('favorito')) {
            eliminarFavoritoDeLocalStorage(libroId);
        } else {
            guardarFavoritosEnLocalStorage(libroId);
        }
    });

    $('#misfavoritos').click(function() {
        // Obtener la lista de favoritos almacenada en las cookies
        const favoritos = obtenerFavoritosDeLocalStorage();
    
      
        if (favoritos.length === 0) {
            alert("No tienes libros marcados como favoritos.");
            return;
        }
    
        
        obtenerDetalleLibro('favoritos');
    });


    function guardarFavoritoEnLocalStorage(libroId) {
        
        let favoritos = obtenerFavoritosDeLocalStorage();
    
        
        if (favoritos.includes(libroId)) {
            alert("El libro ya está en la lista de favoritos.");
            return;
        }
    
       
        favoritos.push(libroId);
    
        
        guardarFavoritosEnLocalStorage(favoritos);
    
      
        $(`.btn-fav[data-id="${libroId}"]`).addClass('favorito');
    }
    
    function eliminarFavoritoDeLocalStorage(libroId) {
        
        let favoritos = obtenerFavoritosDeLocalStorage();
    
        
        const index = favoritos.indexOf(libroId);
        if (index !== -1) {
            
            favoritos.splice(index, 1);
    
            
            guardarFavoritosEnLocalStorage(favoritos);
    
            
            $(`.btn-fav[data-id="${libroId}"]`).removeClass('favorito');
        } else {
            alert("El libro no está en la lista de favoritos.");
        }
    }

    function obtenerFavoritosDeLocalStorage() {
        const favoritosString = localStorage.getItem('favoritos');
        if (favoritosString) {
            return JSON.parse(favoritosString);
        } else {
            return [];
        }
    }
    
    function guardarFavoritosEnLocalStorage(favoritos) {
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
    }
    

    

