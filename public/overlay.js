/* eslint-disable*/
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
  container.classList.add('toggle-panel-side');
});

signInButton.addEventListener('click', () => {
  container.classList.remove('toggle-panel-side');
});
