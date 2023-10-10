// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class Product {
  static #list = []
  static #count = 0

  constructor(
    img,
    title,
    description,
    category,
    price,
    amount = 0,
  ) {
    this.id = ++Product.#count
    this.img = img
    this.title = title
    this.description = description
    this.category = category
    this.price = price
    this.amount = amount
  }

  static add = (...data) => {
    const newProduct = new Product(...data)
    this.#list.push(newProduct)
  }

  static getList = () => {
    return this.#list
  }
  static getById = (id) => {
    return this.#list.find((product) => product.id === id)
  }

  static getRandomList = (id) => {
    const filteredList = this.#list.filter(
      (product) => product.id !== id,
    )
    const shuffledList = filteredList.sort(
      () => Math.random() - 0.5,
    )
    return shuffledList.slice(0, 3)
  }
}

class Purchase {
  static DELIVERY_PRICE = 150
  static #BONUS_FACTOR = 0.1

  static #count = 0
  static #list = []

  static #bonusAccount = new Map()

  static calcBonusAmount = (value) => {
    return value * Purchase.#BONUS_FACTOR
  }

  static getBonusBalance = (email) => {
    return Purchase.#bonusAccount.get(email) || 0
  }

  static updeteBonusBalance = (
    email,
    price,
    bonusUse = 0,
  ) => {
    const amount = this.calcBonusAmount(price)
    const currentBalance = Purchase.getBonusBalance(email)
    const updeteBalance = currentBalance + amount - bonusUse
    Purchase.#bonusAccount.set(email, updeteBalance)
    return amount
  }

  constructor(data, product) {
    this.id = ++Purchase.#count
    this.firstname = data.firstname
    this.lastname = data.lastname

    this.phone = data.phone
    this.email = data.email

    this.comment = data.comment || null
    this.bonus = data.bonus || 0
    this.promocode = data.promocode || null

    this.totalPrice = data.totalPrice
    this.productPrice = data.productPrice
    this.deliveryPrice = data.deliveryPrice
    this.product = product
    this.amount = data.amount
  }
  static add = (...arg) => {
    const newPurchase = new Purchase(...arg)
    this.#list.push(newPurchase)
    return newPurchase
  }

  static getList = () => {
    return Purchase.#list
      .reverse()
      .map(({ id, product: { title }, totalPrice }) => ({
        id,
        title,
        totalPrice,
        bonusAdd: this.calcBonusAmount(totalPrice),
      }))
  }

  static getById = (id) => {
    return Purchase.#list.find((item) => item.id === id)
  }

  static updateById = (id, data) => {
    const purchase = Purchase.getById(id)

    if (purchase) {
      if (data.firstname)
        purchase.firstname = data.firstname
      if (data.lastname) purchase.lastname = data.lastname
      if (data.phone) purchase.phone = data.phone
      if (data.email) purchase.email = data.email
      return true
    } else {
      return false
    }
  }
}

class Promocode {
  static #list = []

  constructor(name, factor) {
    this.name = name
    this.factor = factor
  }

  static add = (name, factor) => {
    const newPromoCode = new Promocode(name, factor)
    Promocode.#list.push(newPromoCode)
    return newPromoCode
  }

  static getByName = (name) => {
    return this.#list.find((promo) => promo.name === name)
  }

  static calc = (promo, price) => {
    return price * promo.factor
  }
}

Promocode.add('summer', 0.9)
Promocode.add('2023', 0.5)
Promocode.add('SALE', 0.2)

Product.add(
  `https://picsum.photos/200/300`,
  `Комп'ютер ARTLINE Gaming by ASUS TUF v119 (TUFv119)`,
  `Intel Core i9-13900KF (3.0 - 5.8 ГГц) / RAM 64 ГБ / SSD 2 ТБ (2 x 1 ТБ) / nVidia GeForce RTX 4070 Ti, 12 ГБ / без ОД / LAN / Wi-Fi / Bluetooth / без ОС`,
  [
    { id: 1, text: `Готовий до відправки` },
    { id: 2, text: `Топ продажів` },
  ],
  57310,
  12,
)

Product.add(
  `https://picsum.photos/200/300`,
  `Комп'ютер COBRA Advanced (I11F.8.H1S2.15T.13356) Intel`,
  `Intel Core i3-10100F (3.6 - 4.3 ГГц) / RAM 8 ГБ / HDD 1 ТБ + SSD 240 ГБ / GeForce GTX 1050 Ti, 4 ГБ / без ОД / LAN / Linux`,
  [{ id: 1, text: `Готовий до відправки` }],
  17000,
  13,
)

Product.add(
  `https://picsum.photos/200/300`,
  `Комп'ютер Artline Gaming (X43v31) AMD Ryzen 5 3600/`,
  `AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС`,
  [{ id: 2, text: `Топ продажів` }],
  27000,
  13,
)

Product.add(
  `https://picsum.photos/200/300`,
  `Комп'ютер ARTLINE Gaming by ASUS TUF v119 (TUFv119)`,
  `Intel Core i9-13900KF (3.0 - 5.8 ГГц) / RAM 64 ГБ / SSD 2 ТБ (2 x 1 ТБ) / nVidia GeForce RTX 4070 Ti, 12 ГБ / без ОД / LAN / Wi-Fi / Bluetooth / без ОС`,
  [
    { id: 1, text: `Готовий до відправки` },
    { id: 2, text: `Топ продажів` },
  ],
  37400,
  11,
)

Product.add(
  `https://picsum.photos/200/300`,
  `Комп'ютер COBRA Advanced (I11F.8.H1S2.15T.13356) Intel`,
  `Intel Core i3-10100F (3.6 - 4.3 ГГц) / RAM 8 ГБ / HDD 1 ТБ + SSD 240 ГБ / GeForce GTX 1050 Ti, 4 ГБ / без ОД / LAN / Linux`,
  [
    { id: 1, text: `Готовий до відправки` },
    { id: 2, text: `Топ продажів` },
  ],
  43600,
  12,
)

Product.add(
  `https://picsum.photos/200/300`,
  `Комп'ютер Artline Gaming (X43v31) AMD Ryzen 5 3600/`,
  `AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС`,
  [{ id: 1, text: `Готовий до відправки` }],
  69300,
  11,
)

// ================================================================
// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-index',
    data: {
      list: Product.getList(),
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.get('/purchase-product', function (req, res) {
  const id = Number(req.query.id)

  res.render('purchase-product', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-product',
    data: {
      list: Product.getRandomList(id),
      product: Product.getById(id),
    },
  })

  // ↑↑ сюди вводимо JSON дані
})

router.get('/purchase-list', function (req, res) {
  console.log(Purchase.getList())

  res.render('purchase-list', {
    style: 'purchase-list',
    data: {
      list: Purchase.getList(),
    },
  })
})

router.get('/purchase-info', function (req, res) {
  const id = Number(req.query.id)
  const purchase = Purchase.getById(id)
  const bonus = Purchase.calcBonusAmount(
    purchase.totalPrice,
  )

  if (!purchase) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Замовлення не знайдено',
        link: `/purchase-list`,
      },
    })
  }

  res.render('purchase-info', {
    style: 'purchase-info',
    data: {
      id: purchase.id,
      firstname: purchase.firstname,
      lastname: purchase.lastname,
      phone: purchase.phone,
      email: purchase.email,
      title: purchase.product.title,
      comment: purchase.comment,
      productPrice: purchase.productPrice,
      deliveryPrice: purchase.deliveryPrice,
      totalPrice: purchase.totalPrice,
      bonus,
    },
  })
})

router.get('/purchase-edit', function (req, res) {
  const id = Number(req.query.id)
  const purchase = Purchase.getById(id)

  if (!purchase) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Замовлення не знайдено',
        link: `/purchase-list`,
      },
    })
  }

  res.render('purchase-edit', {
    style: 'purchase-edit',
    data: {
      id: purchase.id,
      firstname: purchase.firstname,
      lastname: purchase.lastname,
      phone: purchase.phone,
      email: purchase.email,
    },
  })
})

router.post('/purchase-edit-submit', function (req, res) {
  const id = Number(req.query.id)
  const purchase = Purchase.getById(id)
  let {
    totalPrice,
    productPrice,
    deliveryPrice,
    amount,

    firstname,
    lastname,
    phone,
    email,
    promocode,
    bonus,
    comment,
  } = req.body

  if (!purchase) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Замовлення не знайдено',
        link: `/purchase-list`,
      },
    })
  }

  if (!firstname || !lastname || !email || !phone) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Заповніть обовязкові поля',
        info: 'Некоректні данні',
        link: `/purchase-list`,
      },
    })
  }

  const newInfo = Purchase.updateById(id, {
    firstname,
    lastname,
    phone,
    email,
  })

  res.render('alert', {
    style: 'alert',
    data: {
      message: 'Успішно',
      info: 'Данні змінено',
      link: `/purchase-list`,
    },
  })
})

router.post('/purchase-create', function (req, res) {
  const id = Number(req.query.id)
  const amount = Number(req.body.amount)

  if (amount < 1) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Некоректна кількість товару',
        link: `/purchase-product?id=${id}`,
      },
    })
  }

  const product = Product.getById(id)
  if (product.amount < amount) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Такої кількості товару немає в наявності',
        link: `/purchase-product?id=${id}`,
      },
    })
  }

  const productPrice = product.price * amount
  const totalPrice = productPrice + Purchase.DELIVERY_PRICE
  const bonus = Purchase.calcBonusAmount(totalPrice)

  res.render('purchase-create', {
    style: 'purchase-create',
    data: {
      id: product.id,
      cart: [
        {
          text: `${product.title} (${amount} шт.)`,
          price: productPrice,
        },
        {
          text: 'Доставка',
          price: Purchase.DELIVERY_PRICE,
        },
      ],
      totalPrice,
      productPrice,
      deliveryPrice: Purchase.DELIVERY_PRICE,
      amount,
      bonus,
    },
  })

  // ↑↑ сюди вводимо JSON дані
})

router.post('/purchase-submit', function (req, res) {
  const id = Number(req.query.id)
  let {
    totalPrice,
    productPrice,
    deliveryPrice,
    amount,

    firstname,
    lastname,
    phone,
    email,
    promocode,
    bonus,
    comment,
  } = req.body

  const product = Product.getById(id)

  if (!product) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Товар не знайдено',
        link: `/purchase-list`,
      },
    })
  }

  if (product.amount < amount) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Товару немає в потрібній кількості',
        link: `/purchase-list`,
      },
    })
  }

  totalPrice = Number(totalPrice)
  productPrice = Number(productPrice)
  deliveryPrice = Number(deliveryPrice)
  amount = Number(amount)
  bonus = Number(bonus)

  if (
    isNaN(totalPrice) ||
    isNaN(productPrice) ||
    isNaN(deliveryPrice) ||
    isNaN(amount) ||
    isNaN(bonus)
  ) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Некоректні данні',
        link: `/purchase-list`,
      },
    })
  }

  if (!firstname || !lastname || !email || !phone) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Заповніть обовязкові поля',
        info: 'Некоректні данні',
        link: `/purchase-list`,
      },
    })
  }

  if (bonus || bonus > 0) {
    const bonusAmount = Purchase.getBonusBalance(email)
    if (bonus > bonusAmount) {
      bonus = bonusAmount
    }

    Purchase.updeteBonusBalance(email, totalPrice, bonus)

    totalPrice -= bonus
  } else {
    Purchase.updeteBonusBalance(email, totalPrice, 0)
  }

  if (promocode) {
    promocode = Promocode.getByName(promocode)
    if (promocode) {
      totalPrice = Promocode.calc(promocode, totalPrice)
    }
  }

  const purchase = Purchase.add(
    {
      totalPrice,
      productPrice,
      deliveryPrice,
      amount,

      firstname,
      lastname,
      phone,
      email,
      promocode,
      bonus,
      comment,
    },
    product,
  )

  res.render('alert', {
    style: 'alert',
    data: {
      message: 'Успішно',
      info: 'Замовлення створено',
      link: `/purchase-list`,
    },
  })
})

// router.get('/', function (req, res) {
//   // res.render генерує нам HTML сторінку

//   // ↙️ cюди вводимо назву файлу з сontainer
//   res.render('alert', {
//     style: 'alert',
//     alert: 'Успішне виконання дії',
//     alert_msg: 'Замовлення успышно створено',
//   })
//   // ↑↑ сюди вводимо JSON дані
// })
// // Підключаємо роутер до бек-енду
module.exports = router
