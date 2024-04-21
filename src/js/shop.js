function startup() {
  const modalContainer = document.querySelector('.modal')
  const body = document.body

  const showProductModal = (productCode, shouldUpdateUrl = true) => {
    if (shouldUpdateUrl) {
      const url = new URL(window.location.href)
      const queryParams = new URLSearchParams(url.search)

      queryParams.set('product', productCode)
      url.search = queryParams.toString()

      window.history.pushState({}, '', url)
    }

    modalContainer.style.display = 'block'
    document.body.classList.add('no-scroll')
  }

  const initModal = (event) => {
    const urlParams = new URLSearchParams(window.location.search)
    const productCode = urlParams.get('product')

    if (!productCode) {
      modalContainer.style.display = 'none'
      document.body.classList.remove('no-scroll')
      return
    }

    showProductModal(productCode, false)
  }

  const addListenersToProductItems = () => {
    const productItems = document.querySelectorAll('shop-card')

    for (const productElement of productItems) {
      productElement.addEventListener('click', () => {
        showProductModal(productElement.dataset.code)
      })
    }
  }

  window.addEventListener('popstate', initModal)
  addListenersToProductItems()
  initModal()
}

document.addEventListener('DOMContentLoaded', startup)

// Веб компонент карточки товаров
import addShopCard from './components/shop-card.js'
addShopCard()

// Аккордеон для новигации
import acordion from './modules/shop-acordion.js'
acordion()

// Бургер для мобильной версии
import burger from './modules/shop-burger.js'
burger()
