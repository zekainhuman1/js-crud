// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class Product {
  static #list = []
  constructor(name, price, description) {
    this.id = Math.floor(Math.random() * 100000)
    this.createDate = new Date().toISOString()
    this.name = name
    this.price = price
    this.description = description
  }
  static getList = (user) => {
    return this.#list
  }

  static add = (product) => {
    this.#list.push(product)
  }

  static getById = (id) => {
    return this.#list.find(product => product.id === id)
  }

  static updateById = (id, data) => {
    const product = this.getById(id)
    if (product) {
      this.update(product, data)
      return true
    } else {
      return false
    }
  }

  static update = (product, { name, price, description }) => {
    if (name) {
      product.name = name
    } else if (price) {
      product.price = price
    } else if (description) {
      product.description = description
    }
  }

  static deleteById = (id) => {
    const index = this.#list.findIndex(product => product.id === id)
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

}

// ================================================================

class User {
  static #list = []
  constructor(email, login, password) {
    this.email = email
    this.login = login
    this.password = password
    this.id = new Date().getTime()
  }

  verifyPassword = (password) => this.password === password

  static add = (user) => {
    this.#list.push(user)
  }
  static getList = (user) => {
    return this.#list
  }
  static getById = (id) => {
    return this.#list.find(user => user.id === id)
  }
  static deleteById = (id) => {
    const index = this.#list.findIndex(user => user.id === id)
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateById = (id, data) => {
    const user = this.getById(id)
    if (user) {
      this.update(user, data)
      return true
    } else {
      return false
    }
  }

  static update = (user, { email }) => {
    if (email) {
      user.email = email
    }
  }
}

// ================================================================
// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку
  const list = User.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',

    data: {
      users: {
        list,
        isEmpty: list.length === 0
      }
    }
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/user-create', function (req, res) {
  const { email, login, password } = req.body
  const user = new User(email, login, password)
  User.add(user)
  console.log(User.getList())
  res.render('info', {
    style: 'info',
    info: "Користувач створений"
  })
})

router.get('/user-delete', function (req, res) {
  const { id } = req.query
  User.deleteById(Number(id))

  res.render('info', {
    style: 'info',
    info: "Користувач видалений"

  })
})

router.post('/user-update', function (req, res) {
  const { email, password, id } = req.body

  let result = false

  const user = User.getById(Number(id))
  if (user.verifyPassword(password)) {
    User.update(user, { email })
    result = true
  }
  // let result =false;
  // const result = User.updateById(Number(id), { email })
  res.render('info', {
    style: 'info',
    info: result ? "Email оновлено" : "Помилка"

  })
})
// ================================================================
router.get('/product-create', function (req, res) {
  const { id } = req.query
  User.deleteById(Number(id))

  res.render('product-create', {
    style: 'product-create',
  })
})

router.get('/product-list', function (req, res) {
  const list = Product.getList()

  res.render('product-list', {
    style: 'product-list',

    data: {
      users: {
        list,
        isEmpty: list.length === 0
      }
    }
  })
})

router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body
  console.log(req.body)

  const product = new Product(name, price, description)
  Product.add(product)
  console.log(Product.getList())
  res.render('alert', {
    style: 'alert',
    alert: "Успішне виконання дії",
    alert_msg: "Товар був успішно створений"
  })
})

// Підключаємо роутер до бек-енду
module.exports = router
