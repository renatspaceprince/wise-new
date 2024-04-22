function addShopCard() {
  customElements.define(
    'shop-card',
    class extends HTMLElement {
      constructor() {
        super()
        this.attachShadow({ mode: 'open' })
      }

      connectedCallback() {
        this.render()
      }

      attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue != newValue) {
          this.render
        }
      }

      static get observedAttributes() {
        return ['name', 'price', 'image']
      }

      render() {
        this.shadowRoot.innerHTML = `
              <style>
                @import url('../css/shop-card.css');
              </style>
              <img
                src="${this.getAttribute('image') || ''}"
                alt=""
                class="shop__gallery-card-img"
              />
              <span class="shop__gallery-card-name">
                ${this.getAttribute('name') || ''}
              </span>
              <br/>
              <span class="shop__gallery-card-price">
                ${this.getAttribute('price') || ''}
              </span>
            `
      }
    }
  )
}

export default addShopCard
