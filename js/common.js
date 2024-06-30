const shuffle = (array) => {
  return array.toSorted(() => Math.random() - 0.5)
}

const winningSituations = [
  // 3 apples in a row - win $10
  [
    ["apple", "apple", "apple", "ruby", "triple7"],
    ["banana", "bell", "grape", "apple", "ruby"],
    ["apple", "apple", "apple", "ruby", "triple7"],
    (bet) => bet * 10
  ],
  // 3 triple7s in a row - win $20, 3 bells in a row - win $5
  [
    ["triple7", "triple7", "triple7", "grape", "apple"],
    ["bell", "coins", "coins", "coins", "cherry"],
    ["bell", "bell", "bell", "ruby", "cherry"],
    (bet) => bet * 20 + bet * 5
  ],
  // 3 apples in a row - win $10
  [
    ["grape", "ruby", "grape", "triple7", "strawberry"],
    ["banana", "apple", "apple", "apple", "cherry"],
    ["grape", "banana", "banana", "bell", "bell"],
    (bet) => bet * 10
  ],
  // 3 cherries in a row - win $7
  [
    ["cherry", "cherry", "cherry", "grape", "coins"],
    ["banana", "bell", "grape", "apple", "ruby"],
    ["apple", "banana", "grape", "triple7", "apple"],
    (bet) => bet * 7
  ],
  // 3 rubies in a row - win $15, 3 bells in a row - win $5
  [
    ["ruby", "ruby", "ruby", "banana", "coins"],
    ["bell", "bell", "bell", "apple", "ruby"],
    ["apple", "grape", "banana", "cherry", "strawberry"],
    (bet) => bet * 15 + bet * 5
  ]
];

const losingSituations = [
  // Losing scenario 1
  [
    ["apple", "grape", "ruby", "triple7", "strawberry"],
    ["banana", "bell", "grape", "apple", "ruby"],
    ["apple", "banana", "grape", "triple7", "ruby"]
  ],
  // Losing scenario 2
  [
    ["triple7", "apple", "grape", "cherry", "apple"],
    ["bell", "coins", "grape", "coins", "cherry"],
    ["bell", "apple", "bell", "ruby", "cherry"]
  ],
  // Losing scenario 3
  [
    ["grape", "ruby", "grape", "triple7", "strawberry"],
    ["banana", "apple", "cherry", "apple", "cherry"],
    ["grape", "bell", "banana", "bell", "bell"]
  ],
  // Losing scenario 4
  [
    ["cherry", "strawberry", "cherry", "grape", "coins"],
    ["banana", "bell", "grape", "apple", "ruby"],
    ["apple", "banana", "grape", "triple7", "apple"]
  ],
  // Losing scenario 5
  [
    ["ruby", "banana", "ruby", "banana", "coins"],
    ["bell", "apple", "bell", "apple", "ruby"],
    ["apple", "grape", "banana", "cherry", "strawberry"]
  ]
];

let spinCount = 0;

const fetchCombinationFromBackend = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const winning = spinCount % 2 === 0
      const arr = winning ? winningSituations : losingSituations
      spinCount++
      resolve([arr[Math.floor(Math.random() * arr.length)], winning])
    }, 2000)
  })
}