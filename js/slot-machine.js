const { Application, Assets, Sprite, Container, Graphics, Text } = PIXI

class SlotMachine {
  static primaryColor = 0x1099bb;
  static reelsCount = 5;
  static itemsInReel = 3;
  static rollSpeedDelta = 0.05;
  static reelMaxSpeed = 4;
  static reelCircleCount = 4;

  #_balance = +localStorage.getItem('balance') || 10000;
  #_maxWon = +localStorage.getItem('maxWon') || 0;
  #winning = false;
  #callbacks = {};
  #currentBet = 0;

  constructor(app) {
    this.app = app
  }

  get balance() {
    return this.#_balance
  }

  get maxWon() {
    return this.#_maxWon
  }

  get size() {
    return this.app.screen.width / SlotMachine.reelsCount
  }

  deposit() {
    this.updateBalance(10000)
  }

  loadAssets = async () => {
    const [
      t7Icon,
      appleIcon,
      bananaIcon,
      bellIcon,
      cherryIcon,
      coinsIcon,
      grapeIcon,
      rubyIcon,
      strawberryIcon
    ] =
      await Promise.all([
        Assets.load("./images/icons/777.png"),
        Assets.load("./images/icons/apple.png"),
        Assets.load("./images/icons/banana.png"),
        Assets.load("./images/icons/bell.png"),
        Assets.load("./images/icons/cherry.png"),
        Assets.load("./images/icons/coins.png"),
        Assets.load("./images/icons/grape.png"),
        Assets.load("./images/icons/ruby.png"),
        Assets.load("./images/icons/strawberry.png")
      ]);

    this.t7Icon = t7Icon
    this.appleIcon = appleIcon
    this.bananaIcon = bananaIcon
    this.bellIcon = bellIcon
    this.cherryIcon = cherryIcon
    this.coinsIcon = coinsIcon
    this.grapeIcon = grapeIcon
    this.rubyIcon = rubyIcon
    this.strawberryIcon = strawberryIcon
  }

  get icons() {
    return [
      this.t7Icon,
      this.appleIcon,
      this.bananaIcon,
      this.bellIcon,
      this.cherryIcon,
      this.coinsIcon,
      this.grapeIcon,
      this.rubyIcon,
      this.strawberryIcon
    ]
  }

  get margin() {
    return (this.app.screen.height - (this.size * SlotMachine.itemsInReel)) / 2
  }

  createReels = () => {
    let index = 0;
    return () => {
      const container = new Container()
      const shuffledIcons = shuffle(this.icons)
      const doubleShuffledIcons = [...shuffledIcons, ...shuffledIcons]

      for (let iconIndex in doubleShuffledIcons) {
        const icon = doubleShuffledIcons[iconIndex]
        const sprite = new Sprite(icon)

        sprite.width = this.size
        sprite.height = this.size

        sprite.y = iconIndex * this.size

        container.addChild(sprite)
      }

      container.x = index++ * this.size
      container.isChanged = false

      this.reelsContainer.addChild(container)
      return container
    }
  }

  async init() {
    await this.loadAssets()

    const reelsContainer = new Container()
    this.reelsContainer = reelsContainer
    // reelsContainer.y = this.margin

    const createReelContainer = this.createReels()

    for (let i = 0; i < SlotMachine.reelsCount; i++) {
      createReelContainer()
    }

    reelsContainer.x = this.app.screen.width / 2 - reelsContainer.width / 2

    this.app.stage.addChild(reelsContainer)


    for (let i = 1; i < SlotMachine.reelsCount; i++) {
      const line = new Graphics()

      line.moveTo(this.size * i, 0)
      line.lineTo(this.size * i, this.app.screen.height * 2)

      line.stroke({ width: 10, color: 0xc7b02f });
      this.app.stage.addChild(line)
    }

    for (let i = 1; i < SlotMachine.itemsInReel; i++) {
      const line = new Graphics()

      line.moveTo(0, this.size * i)
      line.lineTo(this.app.screen.width, this.size * i)

      line.stroke({ width: 10, color: 0xc7b02f });
      this.app.stage.addChild(line)
    }
  }

  updateBalance = (value) => {
    this.#_balance += value
    this.#callbacks['balanceChange']?.forEach(cb => cb())
    localStorage.setItem('balance', this.#_balance)
  }

  updateMaxWon = (value) => {
    this.#_maxWon = value
    this.#callbacks['maxWinReached']?.forEach(cb => cb(value))
    localStorage.setItem('maxWon', this.#_maxWon)
  }

  spin(bet) {
    bet = +bet

    if (Number.isNaN(bet) || bet <= 0) {
      return
    }

    if (bet > this.balance) {
      return
    }

    if (this.isPlaying) return

    this.reelsContainer.combination = null
    this.#winning = false
    this.updateBalance(-bet)
    this.#currentBet = bet

    for (let index in this.reelsContainer.children) {
      const reel = this.reelsContainer.children[index]
      setTimeout(() => {
        reel.max_speed = SlotMachine.reelMaxSpeed
        reel.speed = 0
        reel.playing = true
        reel.circle = 0
        reel.isChanged = false
      }, 140 * index)
    }

    fetchCombinationFromBackend().then(([combination, winning]) => {
      this.reelsContainer.combination = combination
      this.#winning = winning
    })


    return true
  }

  stopPlaying = () => {
    for (const reel of this.reelsContainer.children) {
      reel.playing = false
    }
  }

  getTextureByName = (icon) => {
    let texture;
    switch (icon) {
      case "apple":
        texture = this.appleIcon;
        break;
      case "banana":
        texture = this.bananaIcon;
        break;
      case "bell":
        texture = this.bellIcon;
        break;
      case "cherry":
        texture = this.cherryIcon;
        break;
      case "coins":
        texture = this.coinsIcon;
        break;
      case "grape":
        texture = this.grapeIcon;
        break;
      case "ruby":
        texture = this.rubyIcon;
        break;
      case "strawberry":
        texture = this.strawberryIcon;
        break;
      case "triple7":
        texture = this.t7Icon;
        break;
      default:
        texture = null
        break;
    }
    return texture;
  }

  tickerEvent() {
    let playingReels = 0
    for (let index in this.reelsContainer.children) {
      const reel = this.reelsContainer.children[index]
      if (!reel.playing || reel.circle > (SlotMachine.reelCircleCount + +index)) {
        continue
      }
      playingReels++

      if (reel.speed < reel.max_speed) {
        reel.speed += SlotMachine.rollSpeedDelta
        if (reel.speed > reel.max_speed) {
          reel.speed = reel.max_speed
        }
      }

      if (reel.speed == reel.max_speed && !reel.isChanged && reel.y <= this.size * SlotMachine.itemsInReel * -1 && reel.y >= this.size * SlotMachine.itemsInReel * -2 && this.reelsContainer.combination) {
        reel.isChanged = true
        let x = +index
        for (let y = 0; y < this.reelsContainer.combination.filter(a => typeof a !== "function").length; y++) {
          const icon = this.reelsContainer.combination[y][x];
          let texture = this.getTextureByName(icon)
          const sprite1 = this.reelsContainer.children[x].children[y]
          const sprite2 = this.reelsContainer.children[x].children[y + this.icons.length]

          sprite1.texture = texture;
          sprite2.texture = texture;
        }
      }
      reel.y -= reel.speed

      if (reel.y <= -reel.height / 2) {
        if (this.reelsContainer.combination) {
          reel.circle++
          reel.y = Math.round(reel.y % (reel.height / 2))
        }
      }
    }
    if (playingReels === 0 && this.isPlaying) {
      if (!this.reelsContainer.combination) return;
      this.stopPlaying()
      if (this.#winning) {
        let won = 0
        const func = this.reelsContainer.combination.at(-1)
        if (typeof func === 'function') {
          won = func(this.#currentBet)
        }
        this.#callbacks['gameEnd']?.forEach(cb => cb({
          money: won
        }))
        if (this.maxWon < won) {
          this.updateMaxWon(won)
        }
        this.updateBalance(won)
      } else {
        this.#callbacks['gameEnd']?.forEach(cb => cb())
      }

      console.log();
    }
  }

  get isPlaying() {
    for (const reel of this.reelsContainer.children) {
      if (reel.playing) return true
    }
    return false
  }

  on(event, cb) {
    this.#callbacks[event] ||= []
    this.#callbacks[event].push(cb)
  }

}