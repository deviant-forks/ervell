{ parse } = require 'url'
validator = require 'validator'

@save = (req, res, next) ->
  next() unless req.user

  res.locals.sd.SAVE = true
  res.locals.sd.CONTENT = content = req.params.content
  res.locals.sd.QUERY = query = req.query
  res.locals.sd.IS_URL = isURL = validator.isURL content

  res.render 'index',
    content: content
    isURL: isURL
    tab: req.params.tab || 'url'
    query: query
