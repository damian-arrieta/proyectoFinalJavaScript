const card = document.querySelector('#card');
const btnOpenForm = document.querySelector('#btn-open-form');
const form = document.querySelector('#form-card');
const cardNumber = document.querySelector('#card .number');
const cardName = document.querySelector('#card .name');
const logoBrand = document.querySelector('#logo-brand');
const signature = document.querySelector('#card .signature p');
const monthExpiration = document.querySelector('#card .month');
const yearExpiration = document.querySelector('#card .year');
const ccv = document.querySelector('#card .ccv');
const button = document.querySelector('.btn-send');
const cuotas = document.querySelector('#card .cuotas');

// Rotacion de la tarjeta
const showFront = () => {
	if(card.classList.contains('active')){
		card.classList.remove('active');
	}
}

card.addEventListener('click', () => {
	card.classList.toggle('active');
});

// Abrir formulario
btnOpenForm.addEventListener('click', () => {
	btnOpenForm.classList.toggle('active');
	form.classList.toggle('active');
});

// Numero de tarjeta
form.inputNumber.addEventListener('keyup', (e) => {
	let inputValue = e.target.value;

	form.inputNumber.value = inputValue
	.replace(/\s/g, '')
	.replace(/\D/g, '')
	.replace(/([0-9]{4})/g, '$1 ')
	.trim();

	cardNumber.textContent = inputValue;

	if(inputValue == ''){
		cardNumber.textContent = '#### #### #### ####';

		logoBrand.innerHTML = '';
	}

	if(inputValue[0] == 4){
		logoBrand.innerHTML = '';
		const img = document.createElement('img');
		img.src = './img/datos-de-pago/visa.png';
		logoBrand.appendChild(img);
	} else if(inputValue[0] == 5){
		logoBrand.innerHTML = '';
		const img = document.createElement('img');
		img.src = './img/datos-de-pago/mastercard.png';
		logoBrand.appendChild(img);
	}
	showFront();
});

// Nombre de tarjeta
form.inputName.addEventListener('keyup', (e) => {
	let inputValue = e.target.value;

	form.inputName.value = inputValue.replace(/[0-9]/g, '');
	cardName.textContent = inputValue;
	signature.textContent = inputValue;

	if(inputValue == ''){
		cardName.textContent = 'Nombre Apellido';
	}

	showFront();
});

// Mes
for(let i = 1; i <= 12; i++){
	let option = document.createElement('option');
	option.value = i;
	option.innerText = i;
	form.selectMonth.appendChild(option);
}

form.selectMonth.addEventListener('change', (e) => {
	monthExpiration.textContent = e.target.value;
	showFront();
});

// Año
const currentYear = new Date().getFullYear();
for(let i = currentYear; i <= currentYear + 8; i++){
	let option = document.createElement('option');
	option.value = i;
	option.innerText = i;
	form.selectYear.appendChild(option);
}

form.selectYear.addEventListener('change', (e) => {
	yearExpiration.textContent = e.target.value.slice(2);
	showFront();
});

// Cuotas
for(let i = 1; i <= 12; i++){
	let option = document.createElement('option');
	const total = JSON.parse(localStorage.getItem('total'));
	if (i / 1 == 1 || i / 3 == 1 || i / 6 == 1 || i / 12 == 1 ){
		let mostrar = `${i} cuotas de ${(total/i).toFixed(3)}`
		option.value = i;
		option.innerText = mostrar;
		form.selectCuotas.appendChild(option);
	}
}

// CCV
form.inputCCV.addEventListener('keyup', () => {
	if(!card.classList.contains('active')){
		card.classList.toggle('active');
		}

	form.inputCCV.value = form.inputCCV.value
	.replace(/\s/g, '')
	.replace(/\D/g, '');
	ccv.textContent = form.inputCCV.value;
	
	button.classList.toggle('active');
});

// Boton enviar
let send = () => {
	let timerInterval
	Swal.fire({
	icon: 'success',
 	title: 'Muchas gracias por su compra',
  	html: 'Redirigiendo al inicio en <b></b> milisegundos.',
  	timer: 3000,
  	timerProgressBar: true,
  	didOpen: () => {
    Swal.showLoading()
    const b = Swal.getHtmlContainer().querySelector('b')
    timerInterval = setInterval(() => {
      b.textContent = Swal.getTimerLeft()
    }, 100)
  },
  willClose: () => {
    clearInterval(timerInterval)
  }
}).then((result) => {
  if (result.dismiss === Swal.DismissReason.timer) {
    location.href='./index.html';
	localStorage.removeItem('total');
  }
});
};