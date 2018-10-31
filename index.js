const express = require('express')
const app = express();
var router = express.Router();
var path = __dirname + '/views/';
const WavesAPI = require('waves-api');

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.get("issueLimes",function(req,res) {
  console.log("/issueLimes");
  const seed = Waves.Seed.fromExistingPhrase('auto filter denial blame lunar become album december lady flock net fly song guard draft');
  const Waves = WavesAPI.create(WavesAPI.TESTNET_CONFIG);
  const issueData = {

    name: 'LIMES',
    description: 'A Limelocker points',

    // With given options you'll have 100000.00000 tokens
    quantity: 10000000,
    precision: 0,

    // This flag defines whether additional emission is possible
    reissuable: true,
    fee: 100000,
    timestamp: Date.now()
  };
  Waves.API.Node.v1.assets.issue(issueData, seed.keyPair).then((responseData) => {
    res.send(responseData);
  });
});

router.get("/create",function(req,res){
  const Waves = WavesAPI.create(WavesAPI.TESTNET_CONFIG);
  const seed = Waves.Seed.create();

  console.log(seed.phrase); // 'hole law front bottom then mobile fabric under horse drink other member work twenty boss'
  console.log(seed.address); // '3Mr5af3Y7r7gQej3tRtugYbKaPr5qYps2ei'
  console.log(seed.keyPair); // { privateKey: 'HkFCbtBHX1ZUF42aNE4av52JvdDPWth2jbP88HPTDyp4', publicKey: 'AF9HLq2Rsv2fVfLPtsWxT7Y3S9ZTv6Mw4ZTp8K8LNdEp' }

  res.send(seed);
});

router.get("/encrypt/:p/:phrase",function(req,res){
  var password = req.params.p;
  var phrase = req.params.phrase;
  const Waves = WavesAPI.create(WavesAPI.TESTNET_CONFIG);
  const seed = Waves.Seed.fromExistingPhrase(phrase);
  console.log(seed.phrase); // 'hole law front bottom then mobile fabric under horse drink other member work twenty boss'
  console.log(seed.address); // '3Mr5af3Y7r7gQej3tRtugYbKaPr5qYps2ei'
  console.log(seed.keyPair); // { privateKey: 'HkFCbtBHX1ZUF42aNE4av52JvdDPWth2jbP88HPTDyp4', publicKey: 'AF9HLq2Rsv2fVfLPtsWxT7Y3S9ZTv6Mw4ZTp8K8LNdEp' }
  //const password = '0123456789';
  const encrypted = seed.encrypt(password);

  res.send('{"encryted":"'+encrypted+'"}'); // 'U2FsdGVkX1+5TpaxcK/eJyjht7bSpjLYlSU8gVXNapU3MG8xgWm3uavW37aPz/KTcROK7OjOA3dpCLXfZ4YjCV3OW2r1CCaUhOMPBCX64QA/iAlgPJNtfMvjLKTHZko/JDgrxBHgQkz76apORWdKEQ=='

  //const restoredPhrase = Waves.Seed.decryptSeedPhrase(encrypted, password);
  //console.log(restoredPhrase); // 'hole law front bottom then mobile fabric under horse drink other member work twenty boss '
});

router.get("/fromExistingPhrase/:p/:phrase",function(req,res){
  var password = req.params.p;
  var phrase = req.params.phrase;
  const Waves = WavesAPI.create(WavesAPI.TESTNET_CONFIG);
  const seed = Waves.Seed.fromExistingPhrase(phrase);
  console.log(seed.phrase); // 'hole law front bottom then mobile fabric under horse drink other member work twenty boss'
  console.log(seed.address); // '3Mr5af3Y7r7gQej3tRtugYbKaPr5qYps2ei'
  console.log(seed.keyPair); // { privateKey: 'HkFCbtBHX1ZUF42aNE4av52JvdDPWth2jbP88HPTDyp4', publicKey: 'AF9HLq2Rsv2fVfLPtsWxT7Y3S9ZTv6Mw4ZTp8K8LNdEp' }
  res.send(seed);
});

router.get("/balance",function(req,res){
  const Waves = WavesAPI.create(WavesAPI.TESTNET_CONFIG);
  Waves.API.Node.v1.addresses.balance('3N3EWXQTMU2HUv67GVxqFemgCyJEKwoqUyj').then((balance) => {
      res.send(balance);
  });
});

router.get("/balance2/:p/:addr",function(req,res){
  var p = req.params.p;
  if (p == "1") {
    var ad = req.params.addr;
    const Waves = WavesAPI.create(WavesAPI.TESTNET_CONFIG);
    Waves.API.Node.v1.assets.balance(ad, 'CeNAju9EtKveEHutRqCjvy1xkhuSgxu8vn6qidQa62s6').then((balance) => {
    //Waves.API.Node.v1.addresses.balance(ad).then((balance) => { // Waves Balance
      res.send(balance);
    });
  } else {
    res.send('{ Error P.}');
  }
});

router.get("/transfer/:p/:encr/:rec/:amount",function(req,res){
  const Waves = WavesAPI.create(WavesAPI.TESTNET_CONFIG);
  const password = req.params.p;
  const encrypted = req.params.encr;
  const restoredPhrase = Waves.Seed.decryptSeedPhrase(encrypted, password);
  const seed = Waves.Seed.fromExistingPhrase(restoredPhrase);
  //const seed = Waves.Seed.fromExistingPhrase('auto filter denial blame lunar become album december lady flock net fly song guard draft');

  const transferData = {
    // An arbitrary address; mine, in this example
    //recipient: '3PJY1y5uAcN1P8nFJqdSLCeHwDGWfMrytaS',
    recipient: req.params.rec,
    // ID of a token, or WAVES
    assetId: 'CeNAju9EtKveEHutRqCjvy1xkhuSgxu8vn6qidQa62s6',
    // The real amount is the given number divided by 10^(precision of the token)
    amount: req.params.amount,
    // The same rules for these two fields
    feeAssetId: 'CeNAju9EtKveEHutRqCjvy1xkhuSgxu8vn6qidQa62s6',
    fee: 1,
    // 140 bytes of data (it's allowed to use Uint8Array here)
    attachment: '',
    timestamp: Date.now()
  };
  Waves.API.Node.v1.assets.transfer(transferData, seed.keyPair).then((responseData) => {
    console.log(responseData);
    res.send(responseData);
  });
});

router.post('/transfers', function(req, res) {
  const Waves = WavesAPI.create(WavesAPI.TESTNET_CONFIG);
  const password = req.body.p;
  const encrypted = req.body.encr;
  const restoredPhrase = Waves.Seed.decryptSeedPhrase(encrypted, password);
  const seed = Waves.Seed.fromExistingPhrase(restoredPhrase);
  //const seed = Waves.Seed.fromExistingPhrase('auto filter denial blame lunar become album december lady flock net fly song guard draft');

  const transferData = {
    // An arbitrary address; mine, in this example
    //recipient: '3PJY1y5uAcN1P8nFJqdSLCeHwDGWfMrytaS',
    recipient: req.body.rec,
    // ID of a token, or WAVES
    assetId: 'CeNAju9EtKveEHutRqCjvy1xkhuSgxu8vn6qidQa62s6',
    // The real amount is the given number divided by 10^(precision of the token)
    amount: req.body.amount,
    // The same rules for these two fields
    feeAssetId: 'CeNAju9EtKveEHutRqCjvy1xkhuSgxu8vn6qidQa62s6',
    fee: 1,
    // 140 bytes of data (it's allowed to use Uint8Array here)
    attachment: req.body.attach,
    timestamp: Date.now()
  };
  Waves.API.Node.v1.assets.transfer(transferData, seed.keyPair).then((responseData) => {
    console.log(responseData);
    res.send(responseData);
  });
});

router.get("/getlist/:p/:addr",function(req,res){
  var p = req.params.p;
  if (p == "1") {
    var ad = req.params.addr;
    const Waves = WavesAPI.create(WavesAPI.TESTNET_CONFIG);
    Waves.API.Node.v1.transactions.getList(ad).then((txList) => {
      res.send(txList);
    });
  } else {
    res.send('{"Error":"P."}');
  }
});

router.get("/getrate/:p/:currency",function(req,res){
  var p = req.params.p;
  if (p == "1") {
    var c = req.params.currency;
    if (c == 'BRL')
      res.send('{"rate":"30"}');
    else if (c == 'USD')
      res.send('{"rate":"115"}');
    else if (c == 'EUR')
      res.send('{"rate":"128"}');
    else if (c == 'BTC')
      res.send('{"rate":"690000"}');
    else if (c == 'ETH')
      res.send('{"rate":"23588"}');
    else if (c == 'WAVES')
      res.send('{"rate":"230"}');
    else
      res.send('{"rate":"0"}');
  } else {
    res.send('{"Error":"P."}');
  }
});

router.get("/neworder/:p/:address/:email/:amount1/:rate/:amount2",function(req,res){
  // Add order do Parse and return the order number.
});

router.get("/confirmorder/:p/:order/:address/:amount",function(req,res){
  // Mark order as payed and save the payment
  // Transfer the Limes to Address
});

app.use("/",router);

app.use("*",function(req,res){
  res.sendFile(path + "404.html");
});

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.listen(8000, () => {
  console.log('Example app listening on port 8000!');
});
