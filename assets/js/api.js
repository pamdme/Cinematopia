const api_key="c2f4c89b537808c194cac27dae3a091e";

let generos = {}
fetch(`https://api.themoviedb.org/3/genre/movie/list?language=pt-BR&api_key=${api_key}`)
    .then(r => r.json())
    .then(obj => {
        const genres = obj.genres;
        for(const i of genres) {
            generos[i.id] = i.name;
        }
    });
function mapearGeneros(listaGenerosId) {
    const output = [];
    for(const i of listaGenerosId) {
        if (i in generos) {
            output.push(generos[i]);
        }
    }
    return output;
}

async function buscarFilme(filmeId) {
    
    const url = `https://api.themoviedb.org/3/movie/${filmeId}`;

    const response = await fetch(`${url}?` + new URLSearchParams({
        language: 'pt-BR',
        api_key,
    }))
    const resultadoBuscaFilmes = await response.json();
    return resultadoBuscaFilmes;
}


async function pesquisarFilmes(termoBusca) {
    const url = "https://api.themoviedb.org/3/search/movie";

    const response = await fetch(`${url}?` + new URLSearchParams({
        language: 'pt-BR',
        api_key,
        query: termoBusca,
    }))
    const resultadoBuscaFilmes = await response.json();

    return resultadoBuscaFilmes;
}

async function buscarFilmesPopulares() {
    const url = "https://api.themoviedb.org/3/movie/popular";

    const response = await fetch(`${url}?` + new URLSearchParams({
        language: 'pt-BR',
        api_key,
    }))
    const resultadoBuscaFilmes = await response.json();

    return resultadoBuscaFilmes;
}


async function renderizarFilmes(termoBusca, destinoHtmlId, funcao='pesquisar') {
    let resultadoBusca;
    
    if(funcao === 'pesquisar') {
        resultadoBusca = await pesquisarFilmes(termoBusca);
    } else if(funcao === 'populares') {
        resultadoBusca = await buscarFilmesPopulares();
    }

    
    let html = '';
    for(const filme of resultadoBusca.results) {
        let generosHtml = '<b>Gêneros: </b>' + mapearGeneros(filme.genre_ids).join(', ')
        html += `
        <div class="col-lg-4">
            <div class="box" data-aos="zoom-in" data-aos-delay="100" id="acao">
                <a href="detalhes.html?id=${filme.id}" target="_blank">
                    <img src="https://image.tmdb.org/t/p/w500/${filme.poster_path}" alt="" class="img-fluid" width="300px" height="300px">
                    <h4>${filme.title}</h4>
                    <p>${String(filme.overview).substring(0, 250)}${String(filme.overview).length >  250 ? '...' : ''}</p>
                    <p><b>${filme.vote_average}⭐</b></p>
                    ${generosHtml}
                </a>
            </div>
        </div>
        `;
    }

    document.getElementById(destinoHtmlId).innerHTML = html;
}


/*
    <a href="https://www.themoviedb.org/movie/${filme.id}-${filme.title}" target="_blank" class="btn btn-primary">
    </a>
*/