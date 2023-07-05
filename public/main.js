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

    imgElement.style.backgroundColor = '#000000'; // black placeholder
    imgElement.onload = function () {
      // when image is loaded, remove placeholder
      this.style.backgroundColor = '';
    };
    imgElement.src = image.cloudinaryLink;

    imgElement.onclick = () => {
      // clear previous selection
      const selectedImage = document.querySelector('.selected');
      if (selectedImage) {
        selectedImage.classList.remove('selected');
      }

      // select new image
      imgElement.classList.add('selected');

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

  // Remove the current character from the array
  characters.splice(currentCharacterIndex, 1);

  // If the array is getting short, fetch more characters
  if (characters.length - currentCharacterIndex <= 5) {
    await fetchCharacters();
  }

  // As we have removed the current character, don't increment the index
  showNextCharacter();
}

document.getElementById('vote-button').onclick = voteForImage;

// On page load
(async () => {
  await fetchCharacters();
  showNextCharacter();
})();
