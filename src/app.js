'use strict'

require('express-async-errors')

const cors = require('cors')
const express = require('express')
const logger = require('morgan')
const queryParser = require('express-query-int')
const timeout = require('connect-timeout')

const { conf } = require('./utils/conf')
const { DOC_URL } = require('./utils/constants')
const errorHandler = require('./middlewares/error-handler')
const monitor = require('./monitor')

const ehAmbienteDeTestes = process.env.NODE_ENV === 'serverest-test'

const app = express()

app.set('json spaces', 4)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(queryParser())
app.use(timeout())
app.use(cors())

/* istanbul ignore else */
if (!conf.semHeaderDeSeguranca) {
  app.disable('x-powered-by')
  app.use((req, res, next) => {
    res.set('x-dns-prefetch-control', 'off')
    res.set('x-frame-options', 'SAMEORIGIN')
    res.set('strict-transport-security', 'max-age=15552000; includeSubDomains')
    res.set('x-download-options', 'noopen')
    res.set('x-content-type-options', 'nosniff')
    res.set('x-xss-protection', '1; mode=block')
    next()
  })
}

app.get('/favicon.ico', (req, res) => { res.sendStatus(204) })

monitor(app)

/* istanbul ignore if */
if (!ehAmbienteDeTestes) {
  app.use(logger('dev'))
}

app.use('/login', require('./routes/login-route'))
app.use('/usuarios', require('./routes/usuarios-route'))
app.use('/produtos', require('./routes/produtos-route'))
app.use('/carrinhos', require('./routes/carrinhos-route'))

app.use(errorHandler)
app.use((req, res) => {
  res.status(405).send({
    message: `Não é possível realizar ${req.method} em ${req.url}. Acesse ${DOC_URL} para ver as rotas disponíveis e como utilizá-las.`
  })
})

module.exports = app
