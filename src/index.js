const userInput = document.getElementById("search-query");
const nameElm = document.getElementById("pokéName");
const weightElm = document.getElementById("weight");
const heightElm = document.getElementById("height");
const photo = document.getElementById("photo");
const resultSection = document.getElementById("result-section");
const typesElm = document.getElementById("types");
const brotherSection = document.getElementById("brother");
const fail = () => {
  alert("Oops, something went wrong...");
};

async function searchHandler() {
  try {
    if (!resultSection.getAttribute("hidden")) {
      resultSection.setAttribute("hidden", true);
    }
    const jsonAns = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${userInput.value}`
    );
    if (!userInput.value) fail();
    else {
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

function flipPhotoToBack() {
  if (!photo.src) return;
  const pokéId = getIdFromSrc();
  photo.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${pokéId}.png`;
}

function getIdFromSrc() {
  const arr = photo.src.split("/");
  const lastPartOfSrc = arr[arr.length - 1].split(".");
  return lastPartOfSrc[0];
}

function flipPhotoToFront() {
  if (!photo.src) return;
  const pokéId = getIdFromSrc();
  photo.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokéId}.png`;
}

function buildTypesRow(obj) {
  typesElm.innerHTML = "";
  for (let type of obj.types) {
    typesElm.append(
      createElement("button", type.type.name, {
        onclick: "viewBrothers(event)",
      })
    );
  }
}

function createElement(type, str, events = {}) {
  const element = document.createElement(type);
  element.innerHTML = str;
  for (let event in events) {
    element.setAttribute(event, events[event]);
  }
  return element;
}

async function viewBrothers(event) {
  try {
    const arr = [];
    const text = event.target.innerHTML;
    const jsonResponse = await fetch(`https://pokeapi.co/api/v2/type/${text}`);
    const response = await jsonResponse.json();
    for (let pokemon of response.pokemon) {
      arr.push(
        `<li onclick="presentNewPokemon(event)">${pokemon.pokemon.name}</li>`
      );
    }
    brotherSection.innerHTML = arr.join("<br>");
  } catch (error) {
    fail();
  }
}

function presentNewPokemon(event) {
  userInput.value = event.target.innerHTML;
  brotherSection.innerHTML = "";
  searchHandler();
}
