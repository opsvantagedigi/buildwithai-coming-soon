export default {
server: {
host: '0.0.0.0',
port: 3000,
proxy: {
'/templates': 'http://127.0.0.1:8787',
'/generate-template': 'http://127.0.0.1:8787',
'/features': 'http://127.0.0.1:8787',
'/announcements': 'http://127.0.0.1:8787',
'/ui-config': 'http://127.0.0.1:8787',
'/version': 'http://127.0.0.1:8787'
}
}
}
