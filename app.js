const apiKey = `zqAH1xZnEZviNZHUaz6`;
const form = document.querySelector('form');
const streets = document.querySelector('.streets');

form.onsubmit = event => {
  const input = event.target.querySelector('input');
  searchBus(input.value);
  console.log(input.value);
  event.preventDefault();

  streets.insertAdjacentHTML('afterbegin', `
    <a href="#" data-street-key="4499">${input.value}</a> 
  `)
}

function searchBus(query) {
  fetch(`https://api.winnipegtransit.com/v3/streets.json?api-key=${apiKey}&name=${query}?usage=long`)
    .then(resp => {
      if (resp.ok) {
        return resp.json();
      } else {
        throw new Error("Error problem.");
      }
    })
}




//  <a href="#" data-street-key="4499">Kenaston Common Drive</a> 

