const request = require("request")
const util = require("util");

const get = util.promisify(request.get);
const post = util.promisify(request.post);

class Request {
  constructor(rootUrl){
    this._root = rootUrl;
  }

  get(path){
    return this._resolve(path, (url)=>get(url));
  }
  post(path, data){
    return this._resolve(path, (url)=>post(url, data));
  }

  _resolve(path, method){
    let url = this._root + path;
    return method(url);
  }
}

module.exports = Request;
