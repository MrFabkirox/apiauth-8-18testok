const app = require('./server/app');

const port = process.env.PORT || 3000;
app.listen(port);
console.log(`apiauth-8 listening at ${port}\n`);
