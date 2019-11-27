const NodeRSA = require('node-rsa');


const genKey = async () => {
    const key = new NodeRSA({b: 512});
    const prikey = key.exportKey('pkcs8-private')
    const pubkey = key.exportKey('pkcs8-public')
    return {prikey, pubkey}
}

const sign = async(data, prikey) => {
    try {    
        const key = new NodeRSA(String(prikey))
        const signature = await key.sign(data, 'base64')
        return signature 
    } catch(err) {
        console.log(err)
    }
}

const verify = async(data, signature, pubkey) => {
    try {    
		console.log(data, signature, pubkey)	
        const key = new NodeRSA(String(pubkey))    
        const res = await key.verify(data, signature, 'utf-8', 'base64')    
        return res;    
    } catch(err) {
        console.log(err)
    }
}

const delay = async (time) => {
    return new Promise(resolve => {
      setTimeout(resolve, time)
  })
}

module.exports = {
    delay,
    genKey,
    sign,
    verify    
}

const test = async () => {
    const keyPair = await genKey()    
    const data = JSON.stringify({data: 1})
    console.log(keyPair)    
    const signature = await sign(data, keyPair.prikey)
    const res = await verify(data, signature, keyPair.pubkey) 
    console.log(res)    
}
