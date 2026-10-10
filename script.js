//grabbing my html 
const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");
const message = document.querySelector("#message");
const gallery = document.querySelector("#gallery");

//listen for the click
searchForm.addEventListener("submit", searchShows);

//making the function 
async function searchShows(event){
    event.preventDefault();

    const searchText = searchInput.value.trim();
    const apiUrl = `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(searchText)}`;

    //replacing the cards with every search
    gallery.replaceChildren();


    if(searchText === ""){
        message.textContent = "No result for empty text";
        gallery.replaceChildren();  //method that replaces all prevoius cards 
        return;
    }

    try{
        const response = await fetch(apiUrl);
    

        if(!response.ok){
            throw new Error(`HTTP ${response.status}`);
        }

        //rsponse -> json
        const shows = await response.json();

        //keep the first 10
        const firstTenShows = shows.slice(0,10);

        //if there are no matching shows 
        if(firstTenShows.length === 0){
            message.textContent = "Now Shows found with that search word. Please try another one."
            return;
        }

        //loop through all of the shows ()
        for(let i = 0; i < firstTenShows.length; i++){
            const matchingShow = firstTenShows[i].show;

            //making the card 
            const showCard = document.createElement("div");
            showCard.classList.add("show-card");

            //show title
            const showTitle = document.createElement("h2");
            showTitle.textContent = matchingShow.name;
            
            //title inside card 
            showCard.appendChild(showTitle);

            //put card into gallery 
            gallery.appendChild(showCard);
        }

    }

    catch(error){
        message.textContent = "Error loading shows";
        gallery.replaceChildren();
    }

    
    
}