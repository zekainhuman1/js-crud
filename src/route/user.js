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
    return this.#list.find((product) => product.id === id)
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

  static update = (
    product,
    { id, name, price, description },
  ) => {
    product.name = name
    product.price = price
    product.description = description
    product.id = Number(id)
  }

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )
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
    return this.#list.find((user) => user.id === id)
  }
  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (user) => user.id === id,
    )
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
  res.render('user-index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'user-index',

    data: {
      users: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/user-create', function (req, res) {
  const { email, login, password } = req.body
  const user = new User(email, login, password)
  User.add(user)
  console.log(User.getList())
  res.render('user-info', {
    style: 'user-info',
    info: 'Користувач створений',
  })
})

router.get('/user-delete', function (req, res) {
  const { id } = req.query
  User.deleteById(Number(id))

  res.render('user-info', {
    style: 'user-info',
    info: 'Користувач видалений',
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
  res.render('user-info', {
    style: 'user-info',
    info: result ? 'Email оновлено' : 'Помилка',
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
  console.log(list)
  res.render('product-list', {
    style: 'product-list',

    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
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
    data: {
      message: 'Успішне виконання дії',
      info: 'Товар був успішно створений',
      link: '/product-list',
    },
  })
})

router.get('/product-edit', function (req, res) {
  const { id } = req.query
  Product.getById(Number(id))
  // let product = Product.getById(Number(id))
  // console.log(product)

  if (Product.getById(Number(id))) {
    res.render('product-edit', {
      style: 'product-edit',
      product: Product.getById(Number(id)),
    })
  } else {
    res.render('alert', {
      style: 'alert',
      data: {
        message: 'Товар не знайдено',
        link: '/product-list',
      },
    })
  }
})

router.get('/product-delete', function (req, res) {
  const { id } = req.query
  Product.deleteById(Number(id))

  res.render('alert', {
    style: 'alert',
    data: {
      message: 'Продукт видалений',
      link: '/product-list',
    },
  })
})

router.post('/product-update', function (req, res) {
  const { id, name, price, description } = req.body

  let result = false

  const product = Product.getById(Number(id))

  Product.update(product, { id, name, price, description })
  result = true

  // let result =false;
  // const result = User.updateById(Number(id), { email })
  res.render('alert', {
    style: 'alert',
    data: result
      ? {
          message: 'Продукт оновлено',
          link: '/product-list',
        }
      : {
          message: 'Помилка',
          link: '/product-list',
        },
  })
})

// Підключаємо роутер до бек-енду
module.exports = router
