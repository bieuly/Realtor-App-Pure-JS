(function(){

var url = "http://www.mocky.io/v2/5b2c9e292f00002a00ebd2d7";
var apiResponse;
var displayedListings = document.querySelector("#results>tbody");

var numberOfFavorites = document.getElementById("numberOfFavorites");
numberOfFavorites.innerHTML = 0;
var favorites = new Set();
var favoritesDiv = document.getElementById("favorites");

// Set up filter event listener
var filterInput = document.getElementById("filter-input");
filterInput.addEventListener("keyup", function(){
    filter(filterInput.value);
});

// Set up filter options
var filterLabel = document.getElementById("filter-button");
var filterOptionNodes = document.querySelectorAll("#filter-dropdown>li>a");
var currentFilterOption = "id";
filterOptionNodes.forEach(function(option){
    option.addEventListener("click", function(){
        filterLabel.innerHTML = `${option.innerHTML} <span class="caret">`;
        currentFilterOption = option.innerHTML.toLowerCase();
    })
});

function filter(filterTerm) {
    if(filterTerm == "") {
        renderListings(apiResponse);
        return;
    }
    var matchingListingsJson = findMatchingListings(currentFilterOption, filterTerm);
    if(matchingListingsJson.length !== 0) {
        renderListings(matchingListingsJson);
    } else {
         renderListings({});
    }
}

function renderListings(json = {}) {
    displayedListings.innerHTML = createListingsHTML(json);
    attachFavoritesToggles();
}

function findMatchingListings(filterOption, filterTerm) {
    filterOption = filterOption.toString().toLowerCase();
    return apiResponse.filter((listing)=> listing[filterOption].toString().includes(filterTerm))
}

function toggleFavorites(checked, id) {
    if(!checked, favorites.has(id)) {
        removeFavorite(id);
    } else if(checked) {
        addFavorite(id);
    }
    numberOfFavorites.innerHTML = favorites.size;
}

function addFavorite(id) {
    favorites.add(id);
        var favorite = findFavorite(id);
        var newFavoritesEntry = document.createElement("tr");
        newFavoritesEntry.id = id;
        newFavoritesEntry.innerHTML = `
        <td>${id}</td>
        <td>${favorite.price}</td>
        <td>${favorite.bedrooms}</td>
        <td>${favorite.bathrooms}</td>
        <td>${favorite.stories}</td>
        <td>${favorite.type}</td>
        <td>${favorite.year}</td>
        <td><a><span value="${id}" class="glyphicon glyphicon-remove"></span></a></td>
        `;
        favoritesDiv.firstElementChild.appendChild(newFavoritesEntry);
        var removeButton = document.querySelector(`span[value='${id}']`);
        attachRemoveListener(removeButton);
}

function removeFavorite(id) {
    var favoritesEntry = document.getElementById(id);
    if(favoritesEntry !== null) {
        favoritesEntry.parentNode.removeChild(favoritesEntry);
    }
    favorites.delete(id);
    var favoriteCheckbox = document.querySelector(`input[value=${id}]`);
    if(favoriteCheckbox !== null){
        favoriteCheckbox.checked = false;
    }
}

function findFavorite(id) {
    var favorite = null; 
    apiResponse.forEach(function(entry){
        if(entry.id == id) {
           favorite = entry; 
           return;
        }
    });
    return favorite;
}

function createListingsHTML(json) {
    if(Object.keys(json).length === 0) {
        return "";
    } else {
        var result = json.map(entry => {
            var result =  `
            <tr id=R${entry.id} class="table-listing">
            <td>${entry.id}</td>
            <td>${entry.price}</td>
            <td>${entry.bedrooms}</td>
            <td>${entry.bathrooms}</td>
            <td>${entry.stories}</td>
            <td>${entry.type}</td>
            <td>${entry.year}</td>`;
            if(favorites.has(entry.id)) {
                result += `<td><input type="checkbox" value="${entry.id}" checked=true"></input></td></tr>`
            } else {
                result += `<td><input type="checkbox" value="${entry.id}"></input></td></tr>`
            }
            return result;
        }).reduce(function(acc, curr){
            return acc + curr
        });
        return result;
    }
}

fetch(url).then(function(response) {
    return response.json();
}).then(function(json){
    apiResponse = json;
    renderListings(apiResponse);
});

function attachFavoritesToggles() {
    var inputs = document.querySelectorAll("#results>tbody tr input");
    inputs.forEach(function(input){
        input.onclick = () => toggleFavorites(input.checked, input.value);
    });
}

function attachRemoveListener(button) {
    button.onclick = () => removeFavorite(button.getAttribute("value"));
}

})();
