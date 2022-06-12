var page = window.location.hash.substr( 1 );
if ( page == "" ) page = "home";
loadPage( page );

$( '.nav-item' ).removeClass( 'active' );
$( `.nav-item[href$='${page}'` ).addClass( 'active' );

function loadPage( page ) {
    var xhttp = new XMLHttpRequest;
    xhttp.onreadystatechange = function () {
        if ( this.readyState == 4 ) {
            var vContent = document.querySelector( '#vContent' );
            var eTitle = "";
            var vTitle = $( '#vTitle' );

            if ( this.status == 200 ) {
                vContent.innerHTML = xhttp.responseText;
                $.when( $.ready ).then( function () {
                    if ( page == "home" ) {
                        $( '.carousel' ).slick( {
                            dots: true,
                            infinite: true,
                            fade: true,
                            cssEase: 'linear',
                            autoplay: true,
                            autoplaySpeed: 2500,
                            arrows: false,
                        } );

                        getQuickCovidData();

                        $( '#close' ).click( function ( e ) {
                            // console.log( $( this ).parent() );
                            $( this ).parent().remove();
                            e.preventDefault();
                        } );

                        $( '.btn-link' ).each( function ( i ) {
                            $( this ).click( function () {
                                if ( $( this ).attr( "href" ) != null ) {
                                    page = $( this ).attr( "href" ).substr( 1 );
                                } else {
                                    page = "home";
                                }

                                loadPage( page );

                                $( '.nav-item' ).removeClass( 'active' );
                                $( `.nav-item[href$='${page}'` ).addClass( 'active' );
                            } );
                        } );

                        initMap();

                        eTitle = "Beranda #JagaJarak | COV.ID";
                    }
                    else if ( page == "data" ) {
                        getWorldCovidData();
                        eTitle = "Data Sebaran COVID-19 | COV.ID";

                    }
                    else if ( page == "about" ) {
                        eTitle = "Tentang COVID-19 | COV.ID";
                    }
                    else if ( page == "news" ) {
                        $( '.frame-subnews' ).slick( {
                            dots: false,
                            arrows: false,
                            slidesToShow: 3,
                            slidesToScroll: 1,
                            autoplay: true,
                            autoplaySpeed: 2500,
                        } );
                        eTitle = "Berita Seputar COVID-10 | COV.ID";
                    }
                    else if ( page == "contact" ) {
                        eTitle = "Informasi Kontak | COV.ID";
                    }
                    else if ( page == "gallery" ) {
                        eTitle = "Galeri Pejuang COVID-19 | COV.ID";
                    } else if ( page == "donate" ) {
                        $( '#donate' ).click( function () {
                            console.log( $( '.swal-button--confirm' ) );

                            $( '.swal-button--confirm' ).click( function () {
                                swal( {
                                    icon: "success",
                                } );
                            } );
                        } );
                        eTitle = "Gotong Royong Kemanusiaan | COV.ID";
                    }

                    vTitle.text( eTitle );
                } );
            } else if ( this.status == 404 ) {
                vContent.innerHTML = "<div class='container'><p>Halaman tidak ditemukan.</p></div>";
            } else {
                vContent.innerHTML = "<div class='container'><p>Ups.. halaman tidak dapat diakses.</p></div>";
            }
        }
    };
    xhttp.open( "GET", "pages/" + page + ".html", true );
    xhttp.send();
}

$.when( $.ready ).then( function () {
    const mainNav = $( '#mainNav' );
    $( window ).scroll( function () {
        let scroolPst = $( this ).scrollTop();
        if ( scroolPst > 0 ) {
            mainNav.addClass( "shadow" );
        } else {
            mainNav.removeClass( "shadow" );
        }
    } );

    $( window ).resize( function () {
        setNewsToShow();
        $( '.nav-item' ).removeClass( 'active' );
        $( `.nav-item[href$='${page}'` ).addClass( 'active' );

    } );

    $( '.nav-item' ).each( function ( i ) {
        $( this ).click( function () {
            if ( $( this ).attr( "href" ) != null ) {
                page = $( this ).attr( "href" ).substr( 1 );
            } else {
                page = "home";
            }

            loadPage( page );
            closeNav();

            $( '.nav-item' ).removeClass( 'active' );
            $( this ).addClass( 'active' );
        } );
    } );
} );

function openNav() {
    $( "#vSidebar" ).width( "250px" );
}

function closeNav() {
    $( "#vSidebar" ).width( "0" );
}

var map;

function initMap() {
    map = new google.maps.Map( document.getElementById( "vMap" ), {
        center: { lat: -2.6000285, lng: 118.015776 },
        zoom: 5
    } );

}

function setNewsToShow() {
    if ( $( window ).width() > 768 ) {
        $( '.frame-subnews' ).slick( 'unslick' );
        $( '.frame-subnews' ).slick( {
            dots: false,
            arrows: false,
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 2500,
        } );
    } else if ( $( window ).width() <= 768 && $( window ).width() > 576 ) {
        $( '.frame-subnews' ).slick( 'unslick' );
        $( '.frame-subnews' ).slick( {
            dots: false,
            arrows: false,
            slidesToShow: 2,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 2500,
        } );
    } else if ( $( window ).width() <= 576 ) {
        $( '.frame-subnews' ).slick( 'unslick' );
        $( '.frame-subnews' ).slick( {
            dots: false,
            arrows: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 2500,
        } );
    }
}
