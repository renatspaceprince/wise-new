function burger() {
  const btn = document.querySelectorAll('.burger-btn')

  btn.forEach(function(btn) {
    btn.addEventListener('click', function() {
      const content = document.querySelector('.shop-nav')
      const body = document.body

      const isOpen = content.classList.toggle('shop-nav--open')
      document.body.classList.toggle('no-scroll', isOpen)

      if (isOpen) {
        content.style.maxHeight = content.scrollHeight + 'px'
      } else {
        content.style.maxHeight = '0px'
      }
    })
  })
}

export default burger
