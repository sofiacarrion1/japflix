// cargo el json 
let movies = [];

fetch("https://japceibal.github.io/japflix_api/movies-data.json")
        .then(response => response.json())
        .then(data => {
            movies = data; 
            console.log("Películas cargadas:", movies);
        })
        .catch(error => {
            console.error("Error al cargar los datos:", error);
        });

document.getElementById('btnBuscar').addEventListener('click', () => {

    let search = document.getElementById('inputBuscar').value.toLowerCase().trim();
    if (search) {
        let results = new Set ();

        for (let i=0 ; i< movies.length; i++) {
            let movie = movies[i];
            let titleMatches = movie.title.toLowerCase().includes(search);
            let genreMatches = false ; 

            if (movie.genres) {
                for (let h = 0 ; h < movie.genres.length; h++){
                    if (movie.genres[h].name.toLowerCase().includes(search)){
                        genreMatches = true;
                        break;
                    }
                }

            }

            let overviewMatches = movie.overview && movie.overview.toLowerCase().includes(search);
            let taglineMatches = movie.tagline && movie.tagline.toLowerCase().includes(search);
            if (titleMatches || genreMatches || taglineMatches || overviewMatches) {
                results.add(movie);
            }
        }
            
        showResults(Array.from(results));
    } else {
        showResults([]);
    }
});

function showResults(results){
    let moviesList = document.getElementById("lista");
    moviesList.innerHTML = "";
    if (results.length === 0) {
        moviesList.innerHTML = "<li class='list-group-item'>No se encontraron resultados.</li>";
    } else {
        for (let i = 0; i < results.length; i++) {
            let movie = results[i];
            let rating = convertRatingToStars(movie.vote_average);
            let element = document.createElement("li");
            element.className = "list-group-item";
            element.innerHTML = `
                <h5>${movie.title}</h5>
                <p>${movie.tagline || 'No hay descripción disponible'}</p>
                <p>${rating}</p>
                <div class="detalles" style="display:none;"></div>
            `;

            element.addEventListener("click", function(event) {
                if (event.target.tagName !== "BUTTON") {
                    showMovieDetails(movie, element.querySelector(".detalles"));
                }
            });

            moviesList.appendChild(element);
        }
    }
}

function convertRatingToStars(rating) {
    let stars = Math.round(rating / 2);
    let starsHtml = "";

    for (let i = 0; i < 5; i++) {
        if (i < stars) {
            starsHtml += '<i class="fa fa-star text-warning"></i>';
        } else {
            starsHtml += '<i class="fa fa-star-o text-secondary"></i>';
        }
    }
    return starsHtml;
}


function showMovieDetails (movie, detailsContainer) {
    if (detailsContainer.style.display === "none" || detailsContainer.style.display === "") {
        detailsContainer.innerHTML = `
            <div class="alert alert-light">
                <h6>Sinopsis:</h6>
                <p>${movie.overview || 'No hay descripción disponible'}</p>
                <h6>Géneros:</h6>
                <ul>${movie.genres.map(g => `<li>${g.name}</li>`).join('')}</ul>
                <button class="btn btn-info" id="toggleDetalles">Más información</button>
                <div id="detallesExtra" class="d-none">
                    <p><strong>Año de lanzamiento:</strong> ${new Date(movie.release_date).getFullYear()}</p>
                    <p><strong>Duración:</strong> ${movie.runtime} minutos</p>
                    <p><strong>Presupuesto:</strong> $${movie.budget.toLocaleString() || 'N/A'}</p>
                    <p><strong>Ganancias:</strong> $${movie.revenue.toLocaleString() || 'N/A'}</p>
                </div>
            </div>
        `;
        detailsContainer.style.display = "block";

        detailsContainer.querySelector("#toggleDetalles").addEventListener("click", function() {
            const detallesExtra = detailsContainer.querySelector("#detallesExtra");
            detallesExtra.classList.toggle("d-none"); 
        });
    } else {
        detailsContainer.style.display = "none"; 
    }
};