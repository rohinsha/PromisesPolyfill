//Promise.myAll
let prom1 = new Promise(function (resolve, reject) {
  resolve("hello prom1");
});
let prom2 = new Promise(function (resolve, reject) {
  resolve("hello prom2");
});
let prom3 = new Promise(function (resolve, reject) {
  setTimeout(reject, 2000, "hello prom3");
});
let prom4 = 10;
// Promise.all([prom1, prom2, prom3, prom4])
//   .then((res) => console.log(`res ${res}`))
//   .catch((e) => console.log(e + "error"));
let promArr = [prom1, prom2, prom3, prom4];
Promise.myAll = (promArr) => {
  return new Promise((resolve, reject) => {
    let resultsArr = [];
    let counter = 0;
    for (let [i, elem] of promArr.entries()) {
      Promise.resolve(elem)
        .then((res) => {
          resultsArr[i] = res;
          counter++;
          if (counter == promArr.length) {
            resolve(resultsArr);
          }
        })
        .catch((e) => console.log(e + "error"));
    }
  });
};

Promise.myAll([prom1, prom2, prom3, prom4])
  .then((res) => console.log(`res ${res}`))
  .catch((e) => console.log(e + "error"));

// Promise.any([prom1, prom2,prom3])
//   .then((res) => console.log(`res ${res}`))
//   .catch((e) => console.log(e + "error"));

Promise.myAny = (promArr) => {
  return new Promise((resolve, reject) => {
    let counter = 0;
    let errMsgObj = {};
    for (let [i, elem] of promArr.entries()) {
      Promise.resolve(elem)
        .then((res) => resolve(res))
        .catch((e) => {
          counter++;
          if (counter == promArr.length) {
            errMsgObj = new AggregateError(e, "all promises failed");
            reject(errMsgObj);
          }
        });
    }
    return errMsgObj;
  });
};

Promise.myAny([prom1, prom2, prom3])
  .then((res) => console.log(`respone is from promise.any ${res}`))
  .catch((e) => console.log(e + "error"));

//Polyfill for Promise.race
Promise.myRace = (...args) => {
  console.log(typeof args);
  return new Promise((resolve, reject) => {
    for (let [i, elem] of args.entries()) {
      Promise.resolve(elem)
        .then((res) => resolve(res))
        .catch((e) => reject(e));
    }
  });
};
Promise.myRace(prom1, prom2, prom3)
  .then((res) => console.log(`res ${res}`))
  .catch((e) => console.log(e + "error"));

//aLLsETTLED POLYFILL
function allSettled(promises) {
  let wrappedPromises = promises.map((p) =>
    Promise.resolve(p).then(
      (val) => ({ status: "fulfilled", value: val }),
      (err) => ({ status: "rejected", reason: err })
    )
  );
  return Promise.all(wrappedPromises);
}

Promise.allSettled([prom1, prom2, prom3, prom4])
  .then((res) => console.log(res))
  .catch((e) => console.log(e));
