// Load artist data
let artistsData = [];

fetch('artists.json')
  .then(response => response.json())
  .then(data => {
    artistsData = data;
    attachClickHandlers();
  })
  .catch(error => console.error('Error loading artists data:', error));

function attachClickHandlers() {
  // Get all artist links
  const artistLinks = document.querySelectorAll('.list-grid li a');

  artistLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const artistName = link.textContent;
      showArtistBio(artistName);
    });
  });
}

function showArtistBio(artistName) {
  // Find the artist in the data
  const artist = artistsData.find(a => a.name === artistName);

  if (!artist) {
    console.error('Artist not found:', artistName);
    return;
  }

  // Get modal elements
  const modal = document.getElementById('artistModal');
  const imageElement = document.getElementById('artistImage');
  const photoCreditElement = document.getElementById('photoCredit');
  const nameElement = document.getElementById('artistName');
  const bioElement = document.getElementById('artistBio');
  const websiteElement = document.getElementById('artistWebsite');

  // Set content
  nameElement.textContent = artist.name;
  bioElement.textContent = artist.bio || 'Bio coming soon...';

  // Show/hide image
  if (artist.image) {
    imageElement.src = artist.image;
    imageElement.alt = artist.name;
    imageElement.style.display = 'block';
  } else {
    imageElement.style.display = 'none';
  }

  // Show/hide photo credit
  if (artist.photoCredit) {
    photoCreditElement.textContent = artist.photoCredit;
    photoCreditElement.style.display = 'block';
  } else {
    photoCreditElement.style.display = 'none';
  }

  // Show/hide website link
  if (artist.website) {
    websiteElement.href = artist.website;
    websiteElement.style.display = 'inline-block';
  } else {
    websiteElement.style.display = 'none';
  }

  // Show modal
  modal.style.display = 'block';
}

// Close modal functionality
const modal = document.getElementById('artistModal');
const closeBtn = document.querySelector('.close');

closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Close when clicking outside the modal
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

// Close on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.style.display === 'block') {
    modal.style.display = 'none';
  }
});
