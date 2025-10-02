// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()


// Example: Smooth scroll to reviews section
document.querySelectorAll('.scroll-to-reviews').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('#reviews-section')?.scrollIntoView({ behavior: 'smooth' });
  });
});

// Example: Toggle tax display
let taxToggle = document.getElementById('switchCheckDefault');
if (taxToggle) {
  taxToggle.addEventListener('click', ()=> {
    let taxInfo= document.getElementsByClassName('tax-info');
    for(info of taxInfo){
      if(info.style.display != "inline"){
        info.style.display = "inline";
      } else {
        info.style.display = "none";
      }
  }

});
}
//Search bar js
  document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('searchForm');
    const input = document.querySelector('.search-inp');
    const cards = document.querySelectorAll('.listing-card');
    const noResultsMsg = document.getElementById('noResultsMsg');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const query = input.value.trim().toLowerCase();
      let matchCount = 0;

      cards.forEach(card => {
        const location = card.dataset.location;
        const country = card.dataset.country;
        const title = card.dataset.title;
        const col = card.closest('.col');
        if (location.includes(query) || country.includes(query) || title.includes(query)) {
          col.style.display = 'block';
          matchCount++;
        } else {
          col.style.display = 'none';
        }
      });
      noResultsMsg.style.display = matchCount === 0 ? 'block' : 'none';
    });
  });
