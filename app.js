const apiKey = `zqAH1xZnEZviNZHUaz6`;
const form = document.querySelector('form');

form.onsubmit = event => {
  const input = event.target.querySelector('input');
  searchBus(input.value);
  console.log(input.value);
  event.preventDefault();
}

function searchBus(query) {
  fetch(`https://api.winnipegtransit.com/v3/streets.json?api-key=${apiKey}&name=${query}`)
    .then(resp => {
      if (resp.ok) {
        return resp.json();
      } else {
        throw new Error("Error problem.");
      }
    })
}

