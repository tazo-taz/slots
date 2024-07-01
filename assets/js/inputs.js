([...document.querySelectorAll("input[data-counter]")]).forEach((input) => {
  const div = document.createElement("div");
  div.classList.add("counter")

  const minusButton = document.createElement("button")
  minusButton.innerHTML = "-"
  minusButton.classList.add("minus-button", "icon")

  const plusButton = document.createElement("button")
  plusButton.innerHTML = "+"
  plusButton.classList.add("icon")

  const increment = +(input.getAttribute("data-counter-increment")) || 1

  let timeout;
  const temporarySetActive = () => {
    clearTimeout(timeout)
    input.classList.add("active")
    timeout = setTimeout(() => {
      input.classList.remove("active")
    }, 300)
  }

  minusButton.addEventListener("click", () => {
    temporarySetActive()
    if (input.value >= increment) {
      input.value = parseInt(input.value) - increment
    } else {
      input.value = 0
    }
  })

  plusButton.addEventListener("click", () => {
    temporarySetActive()
    input.value = (parseInt(input.value) || 0) + increment
  })

  input.parentElement.insertBefore(div, input)
  div.appendChild(minusButton)
  div.appendChild(input)
  div.appendChild(plusButton)
});

([...document.querySelectorAll("[with-dolar-sign]")]).forEach((input) => {
  const div = document.createElement("div");
  input.parentElement.insertBefore(div, input)
  const span = document.createElement("span")
  span.innerHTML = "$"
  span.classList.add("dollar-sign")
  div.appendChild(input)
  div.appendChild(span)
  div.classList.add("input-container")
});

const disableCounter = (selector) => {
  const input = document.querySelector(selector)
  input.disabled = true

  input.closest(".counter").querySelectorAll(".icon").forEach((icon) => {
    icon.disabled = true
  })
}

const enableCounter = (selector) => {
  const input = document.querySelector(selector)
  input.disabled = false

  input.closest(".counter").querySelectorAll(".icon").forEach((icon) => {
    icon.disabled = false
  })
}