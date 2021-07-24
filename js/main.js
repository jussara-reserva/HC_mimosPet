window.onload = () => {
  let localStorageClient = JSON.parse(localStorage.getItem('client'))
  let modal = document.getElementById('myModal')
  // let span = document.getElementsByClassName('close')[0]

  if (
    localStorageClient == null ||
    Object.keys(localStorageClient).length === 0
  ) {
    modal.style.display = 'block'

    // span.onclick = function () {
    //   modal.style.display = 'none'
    // }
  }
}

const options = {
  method: 'GET',
  mode: 'cors',
  cache: 'default'
}

function addClient() {
  let modal = document.getElementById('myModal')
  modal.style.display = 'none'

  nameClient = document.getElementById('input-name').value
  birthDateClient = document.getElementById('input-birth-date').value
  contactClient = document.getElementById('input-contact').value
  emailClient = document.getElementById('input-email').value

  cepClient = document.getElementById('input-cep').value
  stateClient = document.getElementById('input-state').value.toUpperCase()
  streetClient = document.getElementById('input-street').value
  districtClient = document.getElementById('input-district').value
  cityClient = document.getElementById('input-city').value
  numberClient = document.getElementById('input-number').value

  client = {
    name: nameClient,
    birthDate: birthDateClient,
    contact: contactClient,
    email: emailClient,
    address: {
      cep: cepClient,
      state: stateClient,
      street: streetClient,
      district: districtClient,
      city: cityClient,
      number: numberClient
    }
  }

  let jsonData = JSON.stringify(client)
  localStorage.setItem('client', jsonData)
}

let localStorageProducts = JSON.parse(localStorage.getItem('products'))
let products = localStorageProducts !== null ? localStorageProducts : []

const divCardsProducts = document.getElementById('cardsProducts')
divCardsProducts.innerHTML = ''

const quantityCart = document.getElementById('quantityCart')
quantityCart.innerHTML =
  localStorageProducts !== null ? Object.keys(localStorageProducts).length : 0

// API

fetch('../assets/products.json', options)
  .then(response => response.json())
  .then(data => {
    createProducts(data)
  })

function createProducts(products) {
  products.forEach(product => {
    let divProduct = document.createElement('div')
    divProduct.className = 'product'
    divCardsProducts.appendChild(divProduct)

    let idProduct = document.createElement('p')
    idProduct.innerHTML = product.id
    idProduct.style.display = 'none'

    let imgProduct = document.createElement('img')
    imgProduct.src = product.image

    let titleProduct = document.createElement('p')
    titleProduct.innerHTML = product.title

    let priceProduct = document.createElement('p')
    let formattedPrice = product.price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
    priceProduct.innerHTML = formattedPrice
    priceProduct.className = 'price'

    let portionProduct = document.createElement('p')
    formattedPrice = (product.price / 3).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
    portionProduct.innerHTML = `até 3x de ${formattedPrice}`
    portionProduct.className = 'portion'

    let addCartButton = document.createElement('button')
    addCartButton.type = 'submit'
    addCartButton.className = 'addCartButton'
    addCartButton.addEventListener('click', addToCart)
    addCartButton.innerHTML = 'Adicionar ao carrinho'

    divProduct.appendChild(idProduct)
    divProduct.appendChild(imgProduct)
    divProduct.appendChild(titleProduct)
    divProduct.appendChild(priceProduct)
    divProduct.appendChild(portionProduct)
    divProduct.appendChild(addCartButton)
  })
}

function addToCart() {
  // localStorageProducts !== null ? localStorageProducts['products'] : []

  const infosProduct = this.parentElement.getElementsByTagName('p')
  const productId = infosProduct[0].innerHTML
  const productTitle = infosProduct[1].innerHTML
  const productPrice = parseFloat(
    infosProduct[2].innerHTML.split(';')[1].replace(',', '.')
  )

  product = {
    id: productId,
    title: productTitle,
    price: productPrice
  }

  products.push(product)

  let jsonData = JSON.stringify(products)
  localStorage.setItem('products', jsonData)
  quantityCart.innerHTML = products.length

  this.disabled = true
}

function clearCart() {
  products = []
  localStorage.removeItem('products')

  quantityCart.innerHTML = products.length
  const allCartButtons = document.querySelectorAll('.addCartButton')
  allCartButtons.forEach(button => (button.disabled = false))
}

// VIACEP API

function searchCep(valor) {
  let cep = valor.replace(/\D/g, '')

  //Verifica se campo cep possui valor informado.
  if (cep != '') {
    let validacep = /^[0-9]{8}$/

    if (validacep.test(cep)) {
      fetch(`https://viacep.com.br/ws/${cep}/json`)
        .then(response => response.json())
        .then(data => {
          if (!data.erro) {
            setAddressData(data)
          }
        })
        .catch(error => console.log(error))
    }
  }
}

function setAddressData(data) {
  document.getElementById('input-street').value = data.logradouro
  document.getElementById('input-district').value = data.bairro
  document.getElementById('input-city').value = data.localidade
  document.getElementById('input-state').value = data.uf
}
