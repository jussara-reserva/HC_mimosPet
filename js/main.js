const options = {
  method: 'GET',
  mode: 'cors',
  cache: 'default'
}

let modal = document.getElementById('myModal')
modal.style.display = 'none'

// CLIENT ======================================================
window.onload = () => {
  let localStorageClient = JSON.parse(localStorage.getItem('client'))

  if (
    localStorageClient == null ||
    Object.keys(localStorageClient).length === 0
  ) {
    modal.style.display = 'block'
  }
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
  publicAreaClient = document.getElementById('input-public-area').value
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
      publicArea: publicAreaClient,
      district: districtClient,
      city: cityClient,
      number: numberClient
    }
  }

  let jsonData = JSON.stringify(client)
  localStorage.setItem('client', jsonData)
}

// ViaCEP API
function searchCep(cep) {
  cep = cep.replace(/\D/g, '')

  if (cep != '') {
    let validacep = /^[0-9]{8}$/

    if (validacep.test(cep)) {
      fetch(`https://viacep.com.br/ws/${cep}/json`, options)
        .then(response => response.json())
        .then(data => {
          if (!data.erro) {
            displayAddress(data)
          }
        })
        .catch(error => console.log(error))
    }
  }
}

function displayAddress(address) {
  document.getElementById('input-public-area').value = address.logradouro
  document.getElementById('input-district').value = address.bairro
  document.getElementById('input-city').value = address.localidade
  document.getElementById('input-state').value = address.uf
}

// PRODUCTS ======================================================
let localStorageProducts = JSON.parse(localStorage.getItem('products'))
let products = localStorageProducts !== null ? localStorageProducts : []

const divCardsProducts = document.getElementById('cardsProducts')
divCardsProducts.innerHTML = ''

const quantityCart = document.getElementById('quantityCart')
quantityCart.innerHTML =
  localStorageProducts !== null ? Object.keys(localStorageProducts).length : 0

fetch(
  'https://my-json-server.typicode.com/jussararodrigues/hc-mimosPet/products',
  options
)
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

    let trancheQuantityProduct = document.createElement('p')
    formattedPrice = (product.price / 3).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
    trancheQuantityProduct.innerHTML = `até 3x de ${formattedPrice}`
    trancheQuantityProduct.className = 'trancheQuantity'

    let addCartButton = document.createElement('button')
    addCartButton.type = 'submit'
    addCartButton.className = 'addCartButton'
    addCartButton.addEventListener('click', addToCart)
    addCartButton.innerHTML = 'Adicionar ao carrinho'

    divProduct.appendChild(idProduct)
    divProduct.appendChild(imgProduct)
    divProduct.appendChild(titleProduct)
    divProduct.appendChild(priceProduct)
    divProduct.appendChild(trancheQuantityProduct)
    divProduct.appendChild(addCartButton)
  })
}

// CART
function addToCart() {
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
