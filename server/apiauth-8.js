// const app = require('./server/app');
const app = require('./app');

const port = process.env.PORT || 5000;
app.listen(port);
console.log(`apiauth-8 listening at ${port}\n`);
