const spinBtn = document.querySelector(".spin");
const balanceSpan = document.querySelector(".balance span");
const betInput = document.querySelector("#bet");
const depositBtn = document.querySelector(".deposit");
const maxWon = document.querySelector("#max-won");
const menuEl = document.querySelector(".menu")
const drawerEl = document.querySelector(".drawer");
const drawerCloseEl = document.querySelector(".drawer-content .content-close")
const drawerOverlayEl = document.querySelector(".drawer .overlay")

const insertHistoryElements = (selector) => {
  const html = `
    <h2 class="history-title">YOUR HISTORY</h2>
      <div class="history-item history-item-header">
        <span>Bet</span>
        <span>Winners</span>
        <span>Result</span>
        <span>Balance</span>
        <span>Date</span>
      </div>
      <div class="history-items">
      </div>
  `

  document.querySelector(selector).innerHTML = html
}

insertHistoryElements(".drawer-items")
insertHistoryElements(".history-mobile-items")

menuEl.onclick = () => {
  drawerEl.classList.toggle("drawer-hidden")
};

drawerCloseEl.onclick = () => {
  drawerEl.classList.toggle("drawer-hidden")
};

drawerOverlayEl.onclick = () => {
  drawerEl.classList.toggle("drawer-hidden")
};

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



  const updateDrawerHistory = () => {
    let html = ""
    console.log(game.history);
    game.history.forEach((item) => {
      console.log(item);
      html += `<div class="history-item ${item.moneyWon > 0 ? "history-item-won" : ""}">
    <div>$${item.bet}</div>
    <div>
    ${item.winners?.map(winner => `<img src="./assets/images/icons/${winner}.png" alt="${winner}" />`).join('') || ""}
    </div>
    <div>$${item.moneyWon}</div>
    <div>$${item.balance}</div>
    <div>${item.date}</div>
    </div>`
    });
    [...document.querySelectorAll(".history-items")].forEach(el => el.innerHTML = html)
  }

  updateDrawerHistory()

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
    createModal({
      title: "Deposit",
      text: `You have successfully deposited <span class="color-primary">$${SlotMachine.depositAmount}</span>`
    })
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
        ${winners.map(winner => `<img src="./assets/images/icons/${winner}.png" alt="${winner}" />`).join('')}
        </div>
        `,
      })
    }
    updateDrawerHistory()
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
