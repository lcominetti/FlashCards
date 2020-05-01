//  Variable that memorizes the JSON avaible for all functions
var spinner = `<div class="d-flex justify-content-center w-100"><div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div></div>`;

$(document).ready(function() {
  //  Enter shortcut for search bar
  $(function () {
    $("#searchBar").keypress(function (e) {
      if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
        $('#searchBtn').click();
        return false;
      } else {
        return true;
      }
    });
  });
});

// Search
function search() {
  //  Get the query
  var query = document.getElementById("searchBar").value;

  // If the user doesn't type something returns
  if (query == "") { return; }

  //  Charging text
  let row = document.getElementById("row");
  row.innerHTML = spinner;

  //Get the research type
  var scope = $("#dropdownBtn").attr('name');

  //  Ajax request
  $.ajax({
    type: "POST",
    url: "PHP/searchQuery.php",
    data: { 'query': query, 'scope': scope },
    success: function (data) {

      try { user = JSON.parse(data);
        row.innerHTML = ""; }
      catch (error) { console.error(data);
        row.innerHTML = "<div class='mb-3 col'> Errore nella ricerca.</div>" }

      //  Change the reult title
      $("#searchTitle").html("Risultati:");
      
      //  Print every album
      if (scope == "user") {
        //  Zero results
        if (user.users.length == 0)
          row.innerHTML = "<div class='mb-3 col nouser'> Nessun utente trovato :(</div>"

        //  Prints Users
        user.users.forEach(utente => {
          if (utente.imgProfilo == null) {
            utente.imgProfilo = "images\\profilesCovers\\dog.svg";
          }
          row.innerHTML += "" + getUserCard(utente.nome, utente.motto, utente.imgProfilo);
        });
      }
      else {
        //  Zero results
        if (user.albums.length == 0)
          row.innerHTML = "<div class='mb-3 col nouser'> Nessun album trovato :(</div>"

        //  Prints Albums
        user.albums.forEach(album => {
          if (album.imgLink == null) {
            album.imgLink = "images\\albumCovers\\000-icon.svg";
          }
          row.innerHTML += "" + getCard(album.id, album.nome, album.descrizione,
            album.imgLink, album.nomeutente);
        });
        $.ajax({
          type: "POST",
          url: "PHP/json.php",
          data: "",
          success: function (data) {
              try {
                  user = JSON.parse(data);
                  markBtns(user.salvati);
                } 
                catch (error) {
                  console.error(data);
                }
          }
        }); 
      }
    }
  });
}

//  Card formatter
function getCard(id, name, description, imgLink, author) {

  //  Truncate strings that exceeds the max length
  var descMaxLength = 32;
  if (description.length > descMaxLength) {
    description = description.substring(0, descMaxLength) + "...";
  }
  let localAuth = author != sessionUsername ?  author : "te";

  //  Returns the formatted HTML
  return `<div class="card mb-3 ml-3" id="singleCard"> <div class="row no-gutters"> <div class="col-md-4">` +
    `<img src="${imgLink}" id="cardImg"> </div> <div class="col-md-8"> <div class="card-body"> <h5 class="card-title">${name}</h5> ` +
    `<p class="card-text">${description}</p><p class="card-text">` +
    `<button id="btn${id}" onclick='saveAlbum(${id},"${sessionUsername}")' class='btn btn-primary'><i class="fas fa-plus"></i> Aggiungi album</button>` +
    `<button id="nbtn${id}" class='btn btn-outline-primary' onclick="removeAlbum(${id})" style="display:none;"><i class="fas fa-minus"></i> Rimuovi album</button>` +
    `<button data-toggle="modal" data-target="#exampleModal" id="prevBtn${id}" onclick='albumPreview(${id}, user.albums)' class='btn btn-outline-secondary ml-1 prevBtn'><i class="fas fa-search"></i> Anteprima</button>` +
    `</p> <p class="card-text"><a href="profile.html?user=${author}" class="text-secondary"">Creato da ${localAuth}</a></p> </div> </div> </div> </div>`;
}

function getUserCard(name, motto, imgLink) {

  //  Truncate strings that exceeds the max length
  var descMaxLength = 32;
  if (motto.length > descMaxLength) {
    motto = motto.substring(0, descMaxLength) + "...";
  }

  //  Returns the formatted HTML
  return `<div class="card mb-3 ml-3" id="singleCard"> <div class="row no-gutters"> <div class="col-md-4">` +
    `<img src="${imgLink}" id="cardImg"> </div> <div class="col-md-8"> <div class="card-body"> <h5 class="card-title">${name}</h5> ` +
    `<p class="card-text"><em class="text-secondary">"${motto}"</em></p><p class="card-text">` +
    `<a href="profile.html?user=${name}" class='btn btn-primary btn-lg'><i class="fa fa-arrow-right"></i> Visita</a>` +
    `</p> </div> </div> </div> </div>`;
}


//  Save Preview
function saveAlbum(id, email = user.richiedente) {
  //  Ajax request
  $.ajax({
    type: "POST",
    url: "PHP/saveAlbum.php",
    data: { 'id_album': id, 'email': email },
    success: function (data) {
      switch (data) {
        case "success":
          $("#btn" + id).hide();
          $("#nbtn" + id).show();
          break;
      
        case "saveExisting":
          alert("L'album è già presente nella tua libreria!");
          break;

        default:
          console.error(data) 
          break;
      }
    }
  })
}

//  DROPDOWN HANDLER

function dropClick(str) {
  $(".dropdown-item.active").removeClass("active");
  $("#dropdownBtn").attr('name', str);

  switch (str) {   
    case "album":
      $("#albumDrop").addClass("active"); 
      $("#dropdownBtn").html(`<i class="fas fa-book"></i> Album`); 
      $("#searchBar").attr('placeholder', "Cerca un album");    
      break;

    case "user":
      $("#userDrop").addClass("active");   
      $("#dropdownBtn").html(`<i class="fas fa-users"></i> Utenti`);   
      $("#searchBar").attr('placeholder', "Cerca un utente");  
      break;
  }
}