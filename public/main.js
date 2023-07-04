let characters = [];
let currentCharacterIndex = 0;
let selectedImageId = null;

async function fetchCharacters() {
  const response = await fetch('/api/characters');
  const newCharacters = await response.json();

  // Update the characters array with the newly fetched characters
  characters = characters.concat(newCharacters);
}

function showNextCharacter() {
  const character = characters[currentCharacterIndex];
  const characterContainer = document.getElementById('character-container');

  // Clear the current content
  characterContainer.innerHTML = '';

  character.images.forEach((image, index) => {
    const imgElement = document.createElement('img');
    imgElement.src = image.cloudinaryLink;
    imgElement.style.width = '50%';
    imgElement.style.height = '50%';
    imgElement.onclick = () => {
      selectedImageId = image.id;
      document.getElementById('vote-button').style.display = 'block';
    };

    characterContainer.appendChild(imgElement);
  });

  currentCharacterIndex++;
}

async function voteForImage() {
  console.log('the selected image id is:', selectedImageId);
  const response = await fetch('/api/vote', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: selectedImageId }),
  });

  const updatedImage = await response.json();
  console.log('Voted for image: ', updatedImage);

  if (characters.length - currentCharacterIndex <= 5) {
    await fetchCharacters();
  }

  showNextCharacter();
}

document.getElementById('vote-button').onclick = voteForImage;

// On page load
(async () => {
  await fetchCharacters();
  showNextCharacter();
})();
