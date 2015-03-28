local server:
foreman start -f Procfile.dev -e devel.env
redis-server

MIGRATE DB on heroku

heroku run bash
sequelize -m -e production