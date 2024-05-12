let clickCount = 0;

const countryInput = document.getElementById('country');
const myForm = document.getElementById('form');
const modal = document.getElementById('form-feedback-modal');
const clicksInfo = document.getElementById('click-count');

function handleClick() {
    clickCount++;
    clicksInfo.innerText = clickCount;
}

async function fetchAndFillCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
            throw new Error('Błąd pobierania danych');
        }
        const data = await response.json();
        const countries = data.map(country => country.name.common);
        countryInput.innerHTML = countries.map(country => `<option value="${country}">${country}</option>`).join('');
    } catch (error) {
        console.error('Wystąpił błąd:', error);
    }
}

function getCountryByIP() {
    fetch('https://get.geojs.io/v1/ip/geo.json')
        .then(response => response.json())
        .then(data => {
            const country = data.country;
            // Inject country to form
            countryInput.value = country;
            getCountryCode(country); // This will fetch the country code
        })
        .catch(error => {
            console.error('Error fetching data from GeoJS:', error);
        });
}

function getCountryCode(countryName) {
    const apiUrl = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;

    fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Error fetching data');
        }
        return response.json();
    })
    .then(data => {        
        const countryCode = data[0].idd.root + data[0].idd.suffixes[0]; // Assuming suffixes array is not empty
        const countryCodeSelect = document.getElementById('countryCode');
        // Check if the country code already exists in the options, if not add it
        if (!Array.from(countryCodeSelect.options).some(option => option.value === countryCode)) {
            const option = new Option(`${countryCode} (${countryName})`, countryCode, false, true);
            countryCodeSelect.add(option);
        } else {
            countryCodeSelect.value = countryCode;
        }
        countryCodeSelect.value = countryCode; // Select the country code in the form
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    getCountryByIP(); // Fetch country and code on page load
    document.addEventListener('click', handleClick);
    fetchAndFillCountries();
});


function validateForm() {
    let email = document.getElementById('emailAddress').value;
    if (!email.match(/\S+@\S+\.\S+/)) {
        alert('Proszę wprowadzić prawidłowy adres email.');
        return false;
    }
    return true;
}