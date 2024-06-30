const createModal = ({
  title,
  text
}) => {
  const modal = document.createElement("div")
  modal.style = "position: fixed"
  modal.innerHTML = `
    <div class="modal-overlay"></div>
    <div class="modal-content">
      <button class="close sm icon">&times;</button>
      <h2>${title}</h2>
      <p>${text}</p>
    </div>
  `
  document.body.appendChild(modal)

  const close = modal.querySelector(".close")
  close.addEventListener("click", () => {
    modal.remove()
  })

  const modalOverlay = modal.querySelector(".modal-overlay")
  modalOverlay.addEventListener("click", () => {
    modal.remove()
  })
}