const createModal = ({
  title,
  text
}) => {
  const modal = document.createElement("div")
  modal.style = "position: fixed"
  modal.innerHTML = `
    <div class="overlay"></div>
    <div class="modal-content">
      <button class="content-close sm icon">&times;</button>
      <h2>${title}</h2>
      <p>${text}</p>
    </div>
  `
  document.body.appendChild(modal)

  const close = modal.querySelector(".content-close")
  close.addEventListener("click", () => {
    modal.remove()
  })

  const modalOverlay = modal.querySelector(".overlay")
  modalOverlay.addEventListener("click", () => {
    modal.remove()
  })
}