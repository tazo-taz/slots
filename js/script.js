const spinBtn = document.querySelector(".spin");
const balanceSpan = document.querySelector(".balance span");
const betInput = document.querySelector("#bet");
const depositBtn = document.querySelector(".deposit");
const maxWon = document.querySelector("#max-won");

(async () => {
  const { Application } = PIXI
  const app = new Application()

  const ratio = 5 / 3
  const initialWidth = 1000
  const width = initialWidth > window.innerWidth ? window.innerWidth : initialWidth

  await app.init({
    width: width,
    height: width / ratio,
  })

  if (initialWidth > window.innerWidth) {
    app.view.style.width = window.innerWidth + 'px';
    app.view.style.height = window.innerWidth / ratio + 'px';
  }

  document.querySelector("#app").appendChild(app.view)

  const game = new SlotMachine(app)

  balanceSpan.innerHTML = game.balance
  maxWon.innerHTML = game.maxWon
  await game.init()

  addEventListener('resize', () => {
    if (initialWidth > window.innerWidth) {
      app.view.style.width = window.innerWidth + 'px';
      app.view.style.height = window.innerWidth / ratio + 'px';
    }
  })

  spinBtn.addEventListener('click', () => {
    const spinned = game.spin(betInput.value)
    if (spinned) {
      spinBtn.disabled = true
      disableCounter("#bet")
    }
  })

  depositBtn.addEventListener('click', () => {
    game.deposit()
  })

  game.on('gameEnd', (meta) => {
    spinBtn.disabled = false
    enableCounter("#bet")
    if (meta) {
      const { money, winners } = meta
      createModal({
        title: "Congratulations!",
        text: `You won $${money} <br />
        <div class="modal-slot-icons">
        ${winners.map(winner => `<img src="./images/icons/${winner}.png" alt="${winner}" />`).join('')}
        </div>
        `,
      })
    }
  })

  game.on('balanceChange', () => {
    balanceSpan.innerHTML = game.balance
  })

  game.on('maxWinReached', (value) => {
    maxWon.innerHTML = value
  })

  app.ticker.add(() => {
    game.tickerEvent()
  })

})();
