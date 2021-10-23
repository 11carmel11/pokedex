// general variables:
const userInput = document.getElementById("search-query");
const nameElm = document.getElementById("pokéName");
const weightElm = document.getElementById("weight");
const heightElm = document.getElementById("height");
const photo = document.getElementById("front-photo");
const resultSection = document.getElementById("result-section");
const typesElm = document.getElementById("types");
const brotherSection = document.getElementById("brother");
const mineSection = document.getElementById("mine");
const catchButton = document.getElementById("catch");
const releaseButton = document.getElementById("release");
const server = "http://localhost:8080/";
let backPhoto = "";
let frontPhoto = "";
let pokemon;
let username;
getUsername();
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
      const parsed = parseInt(userInput.value);
      let jsonAns;
      if (parsed === "NaN") {
        jsonAns = await axios.get(`${server}pokemon/query?query=${userInput}`);
      } else {
        jsonAns = await axios.get(`${server}pokemon/get/${userInput.value}`);
      }
      pokemon = jsonAns.data;
      catchButton.innerText = "catch";
      releaseButton.innerText = "release";
      nameElm.innerHTML = `<b>name: </b>${pokemon.name}`;
      weightElm.innerHTML = `<b>weight: </b>${pokemon.weight}`;
      heightElm.innerHTML = `<b>height: </b>${pokemon.height}`;
      buildTypesRow(pokemon);
      frontPhoto = pokemon.front_pic;
      backPhoto = pokemon.back_pic;
      photo.setAttribute("src", frontPhoto);
      resultSection.removeAttribute("hidden");
    }
  } catch (error) {
    fail();
  }
}

// shows the back of the pokemon
function flipPhotoToBack() {
  if (!photo.src) return;
  photo.src = backPhoto;
}

// shows the front of the pokemon
function flipPhotoToFront() {
  if (!photo.src) return;
  photo.src = frontPhoto;
}

// extracts the types of the pokemon and append them in place
function buildTypesRow(obj) {
  typesElm.innerHTML = "";
  for (let type of obj.types) {
    typesElm.append(
      createElement("button", type, {
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
    brotherSection.innerHTML = "";
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
  mineSection.innerHTML = "";
  brotherSection.innerHTML = "";
  searchHandler().finally(() => {
    userInput.value = "";
  });
}
function errorShower(error) {
  brotherSection.innerHTML = error.response.data.error;
  brotherSection.classList.add("error");
  setTimeout(() => {
    brotherSection.innerHTML = "";
    brotherSection.classList.remove("error");
  }, 1500);
}
async function getUsername() {
  username = prompt("please enter username");
  const ans = await axios.post(`${server}info/`, JSON.stringify({ username }));
}

async function catchPoke() {
  try {
    const headers = { username: username };
    const ans = await axios.put(
      `${server}pokemon/catch/${pokemon.id}`,
      { pokemon },
      { headers }
    );
    catchButton.innerText = ans.data;
  } catch (error) {
    errorShower(error);
  }
}

async function releasePoke() {
  try {
    const headers = { username: username };
    const ans = await axios.delete(`${server}pokemon/release/${pokemon.id}`, {
      headers,
    });
    catchButton.innerText = "catch";
  } catch (error) {
    errorShower(error);
  }
}

async function showList() {
  try {
    mineSection.innerHTML = "";
    const headers = { username: username };
    const ans = await axios.get(`${server}pokemon/`, { headers });
    for (let poke of ans.data) {
      mineSection.append(
        createElement("li", poke.name, {
          onclick: "presentNewPokemon(event)",
          class: "point mine",
        })
      );
      mineSection.append(createElement("br"));
    }
  } catch (error) {}
}
