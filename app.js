const apiKey = `zqAH1xZnEZviNZHUaz6`;
const form = document.querySelector("form");
const streetsEle = document.querySelector(".streets");
const titleBar = document.querySelector('main').firstElementChild;

form.onsubmit = (event) => {
  const input = event.target.querySelector("input");
  searchBus(input.value);
  event.preventDefault();
};

function searchBus(query) {
  fetch(
    `https://api.winnipegtransit.com/v3/streets.json?api-key=${apiKey}&name=${query}`
  )
    .then((resp) => resp.json())
    .then((json) => {
      insertIntoStreetEle(json.streets);
    });
}

function insertIntoStreetEle(data) {
  streetsEle.innerHTML = "";
  data.forEach(function (street) {
    streetsEle.insertAdjacentHTML(
      "afterbegin", `<a href="#" data-street-key=${street.key}>${street.name}</a> `
    );
  });
}
