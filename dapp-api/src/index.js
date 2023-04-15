const express = require('express');
const port = parseInt(process.env.PORT || '5340');
const app = express();
const router = express.Router();
const dexListing = require('./listing');

router.get('/dex/listing/:chainId', (req, res) => {
  try {
    const { params } = req;
    const chainId = parseInt(params.chainId);
    const result = dexListing[chainId].sort((a, b) => (a.symbol < b.symbol ? -1 : a.symbol > b.symbol ? 1 : 0));
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.use(require('morgan')('combined'));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  next();
});

app.get('/', (req, res) => {
  res.status(200).json({ status: 'HEALTHY' });
});
app.use('/api', router);

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
