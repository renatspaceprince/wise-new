function acordion() {
  const btns = document.querySelectorAll('.nav-links__parent-btn')

  btns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      const content = btn.nextElementSibling

      const isOpen = btn.classList.toggle('active')

      if (isOpen) {
        content.style.maxHeight = content.scrollHeight + 'px'
      } else {
        content.style.maxHeight = '0px'
      }
    })
  })
}

export default acordion
