const searchHandler = async (e) => {
    e.preventDefault();

    // search input is comma separated. remove spaces
    const tags = document.querySelector('#search').value.replace(/\s/g, '');
    document.location.replace(`/search?tags=${tags}`);
}

document.querySelector('.search-form').addEventListener('submit', searchHandler);