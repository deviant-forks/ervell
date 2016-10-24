_ = require 'underscore'
sd = require('sharify').data
{ Collection } = require 'backbone'

class Posts extends Collection
  url: -> "#{sd.BLOG_URL}/featured.json"

@index = (req, res, next) ->
  res.render 'index', posts: []
  posts = new Posts
  posts.fetch
    complete: ->
      res.locals.sd.POSTS

