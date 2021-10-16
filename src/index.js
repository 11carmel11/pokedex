// general variables:
const userInput = document.getElementById("search-query");
const nameElm = document.getElementById("pokéName");
const weightElm = document.getElementById("weight");
const heightElm = document.getElementById("height");
const photo = document.getElementById("photo");
const resultSection = document.getElementById("result-section");
const typesElm = document.getElementById("types");
const brotherSection = document.getElementById("brother");
//alert fail
const fail = () => {
  alert("Oops, something went wrong...");
};

// search the requested pokemon
async function searchHandler() {
  try {
    brotherSection.innerHTML = "";
    if (!resultSection.getAttribute("hidden")) {
      resultSection.setAttribute("hidden", true);
    }
    if (!userInput.value) fail();
    else {
      const jsonAns = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${userInput.value}`
      );
      const ans = await jsonAns.json();
      nameElm.innerHTML = `<b>name: </b>${ans.name}`;
      weightElm.innerHTML = `<b>weight: </b>${ans.weight}`;
      heightElm.innerHTML = `<b>height: </b>${ans.height}`;
      buildTypesRow(ans);
      photo.setAttribute(
        "src",
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${ans.id}.png`
      );
      resultSection.removeAttribute("hidden");
    }
  } catch (error) {
    fail();
  }
}

// shows the back of the pokemon
function flipPhotoToBack() {
  if (!photo.src) return;
  const pokéId = getIdFromSrc();
  photo.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${pokéId}.png`;
}

// takes url and extract the id
function getIdFromSrc() {
  const arr = photo.src.split("/");
  const lastPartOfSrc = arr[arr.length - 1].split(".");
  return lastPartOfSrc[0];
}

// shows the front of the pokemon
function flipPhotoToFront() {
  if (!photo.src) return;
  const pokéId = getIdFromSrc();
  photo.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokéId}.png`;
}

// extracts the types of the pokemon and append them in place
function buildTypesRow(obj) {
  typesElm.innerHTML = "";
  for (let type of obj.types) {
    typesElm.append(
      createElement("button", type.type.name, {
        onclick: "viewBrothers(event)",
        class: "point",
      })
    );
  }
}
// creates general element
function createElement(type, str, atrs = {}) {
  const element = document.createElement(type);
  element.innerHTML = str;
  for (let atr in atrs) {
    element.setAttribute(atr, atrs[atr]);
  }
  return element;
}

// appends the brothers of the pokemon
async function viewBrothers(event) {
  try {
    const text = event.target.innerHTML;
    const jsonResponse = await fetch(`https://pokeapi.co/api/v2/type/${text}`);
    const response = await jsonResponse.json();
    brotherSection.innerHTML = "";
    for (let pokemon of response.pokemon) {
      brotherSection.append(
        createElement("li", pokemon.pokemon.name, {
          onclick: "presentNewPokemon(event)",
          class: "point brother",
        })
      );
      brotherSection.append(createElement("br"));
    }
  } catch (error) {
    fail();
  }
}

// present the selected brother as main pokemon
function presentNewPokemon(event) {
  userInput.value = event.target.innerHTML;
  brotherSection.innerHTML = "";
  searchHandler().finally(() => {
    userInput.value = "";
  });
}
