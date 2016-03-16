var crypto = require('crypto');
var ed25519 = require('ed25519');

/*
	1.生成密钥对
*/

// Bob认为美国国家安全局会在随机数生成器背后留后门，于是决定用一个密码
// 查理告诉鲍勃说SHA256很安全。于是，他决定使用哈希生成密钥对而不只是随机字节
var bobsPassword = 'I like the cute monkeys!';
var hash = crypto.createHash('sha256').update(bobsPassword).digest(); //returns a buffer
var bobKeypair = ed25519.MakeKeypair(hash);

/*
	2.给信息加密和签名
*/
var message = 'Hi Alice, I love you!';
var msgCiphered = cipher('aes192', bobKeypair.privateKey, message);
var signature = ed25519.Sign(new Buffer(msgCiphered, 'utf8'), bobKeypair.privateKey);

/**
  3.给Alice发送留言和签名。
*/

// 作为Bob的好朋友，Alice有它的公约，可以验证。
if (ed25519.Verify(new Buffer(msgCiphered, 'utf8'), signature, bobKeypair.publicKey)) {
	// Bob相信该信息，因为验证函数返回了true.
  var msg = decipher('aes192', bobKeypair.privateKey, msgCiphered);

	console.log('签名合法！');
  console.log('Bob said: ', msg);
} else {
	// Bob不相信，验证函数返回了false.
	console.log('签名不合法！');
}

// provite methods
//加密
function cipher(algorithm, key, buf){
    var encrypted = "";
    var cip = crypto.createCipher(algorithm, key);
    encrypted += cip.update(buf, 'utf8', 'hex');
    encrypted += cip.final('hex');
    return encrypted;
}

//解密
function decipher(algorithm, key, encrypted){
    var decrypted = "";
    var decipher = crypto.createDecipher(algorithm, key);
    decrypted += decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
