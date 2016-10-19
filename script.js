
var albumLimit = 8;
var albums = [];

// the search bar

$("#search").submit(function(event){
  event.preventDefault();
  var artist = $("#searchBox").val(); // gets the artist's name & runs the search
  searchAlbums(artist, albumLimit);
});

function enableForm() { // clears the search bar for a new search
  $("#searchBox").val("");
  $("#searchButton").prop("disabled", false);
}

function fetchDetails() { // get the albums deets
  $.each(albums, function(index, item){
    var url = item.url;
    $.getJSON(url)
      .done(function(response){
        albums[index].details = response;
      });
  });
}

function searchAlbums(artist, limit) { // searches for an artist/albums
  var url = "https://api.spotify.com/v1/search";
  var data = {
    "type" : "album",
    "q" : artist,
    "limit" : limit
  };

  $.getJSON(url, data)
    .done(function(response){
      albums = []; // add the results to the array
      $.each(response.albums.items, function(index, item){
        if (item.images.length > 0) {
          var album = {
            "id" : item.id,
            "name" : item.name,
            "thumbnail" : item.images[0].url,
            "url" : item.href,
            linktofile : item.external_urls.spotify
          };
          albums.push(album);
        }
      });
      updateGallery();
      enableForm();
      fetchDetails();
    })
    .fail(function(){
      albums = [];
      updateGallery();
    });
} // end searchAlbums

// gallery

function buildAlbum(item, index) { // build an item
  var html = "";
  html += '<div class="album" album-id="' + index + '">';
  html += '<a href="#">';
  html += '<img src="' + item.thumbnail + '" alt="' + item.name + '">';
  html += '</a>';
  html += '</div>';
  return html;
}

function updateGallery() { // updates the page with array content
  $("#results").fadeOut(400, function(){ // clear
    $("#results").empty();
    if (albums.length > 0) {
      $.each(albums, function(index, item) { // get each item and append to the gallery
        var albumHTML = buildAlbum(item, index);
        $("#results").append(albumHTML);
      });
      $("#results").fadeIn(200);
    }

// when album is clicked..
$(".album").click(function(event){
  event.preventDefault();
  updateOverlay(parseInt($(this).attr("album-id")));
  var albumImage = $(this).attr("href");
  for (var i = 0; i < albums.length; i++) {
    if (albums[i].id == albumImage) {
      counter = i;
    }
  }
      updateOverlay();
      $overlay.fadeIn(400);
});
  });
}

// lightbox

var $overlay = $('<div id="overlay"></div>');
var $image = $(".albumImage");
var counter = 0;
var currentAlbum;

function updateOverlay(id) { // update the overlay
  currentAlbum = id;
  var info = albums[id].details;
  var date = new Date(info.release_date);

    $(".albumImage").attr("src", info.images[0].url);
    $(".albumArtist").text(info.artists[0].name);
    $(".albumName").text(info.name);
    $(".albumReleased").text("Released: " + date.getFullYear());
    $(".albumLink").attr("href", albums[id].linktofile);
	  $(".albumLink").text('View in Spotify');
    $(".lightbox").show();

    $overlay.show();
    $overlay.fadeIn();
} // end updateOverlay

// append everything to the overlay

$overlay.append($image);
$overlay.append($(".albumInfo"));
$overlay.append($(".albumArtist"));
$overlay.append($(".albumName"));
$overlay.append($(".albumReleased"));
$overlay.append($(".albumLink"));
$("body").append($overlay);

$overlay.click(function(){ //hide overlay when clicked
  $overlay.fadeOut(400);
});
