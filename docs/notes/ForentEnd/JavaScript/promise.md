# 理解

## Promise 对象的特点

- pending: 初始状态，既不是成功，也不是失败状态。
- fulfilled: 意味着操作成功完成。
- rejected: 意味着操作失败。

## 代码实现

最开始基础版

```js
    class Promise(){
        constructor(executor){
            this.status="pending";//初始状态
            this.value=null;//resolve的实参
            this.reason=null;//reject的实参
            try{
               //防止发生隐式绑定 executor(this.resolve.bind(this),this.reject.bind(this));
            }catch(e){
                this.reject(e);
            }
        }

        resolve(value){
            let status=this.status;
            if(status=="pending"){
                this.status="resolve";
                this.value=value;
            }
        }
        reject(reason){
            let status=this.status;
            if(status=="pending"){
                this.status="reject";
                this.reason=reason;
            }
        }
    }
    Promise.then=(onfullFilled,onRejected)=>{
        if(this.status=="resolve"){
            onfullFilled(this.value);
        }
        if(this.status=="reject"){
            onfullFilled(this.reason);
        }
    }
```

进阶版 1 考虑异步情况

```js
    class Promise(executor){
        constructor(executor){
            if(typeof executor !=="function"){
                throw new Error("executor必须是一个函数");
            }
            this.status="pending";//初始状态
            this.value=null;//resolve的实参
            this.reason=null;//reject的实参
            this.fullFilledArray=[];
            that.rejectedArray=[];
             try{
               //防止发生隐式绑定

               executor(this.resolve.bind(this),this.reject.bind(this));
            }catch(e){
                this.reject(e);
            }
        }
        resolve(value){
            let status=this.status;
            if(status=="pending"){
                this.status="resolve";
                this.value=value;
                let cb;
                while (cb =  this.fullFilledArray.shift()) {
                  cb(this.value)
                }

            }
        }
        reject(reason){
            let status=this.status;
            if(status=="pending"){
                this.status="reject";
                this.reason=reason;
                let cb;
                while (cb =  this.rejectedArray.shift()) {
                  cb(this.reason)
                }

            }
        }
    }
    Promise.then=(onfullFilled,onRejected){
        let status=this.status;
        switch(status){
            case "pending":
                 //因为异步的原因，在Promise的构造函数中的resolve和reject方法并不会马上执行，等到调用this.then之后才会去执行（`根据js的执行机制可知`）
                this.fullfilledArray.push(onfullFilled);
                this.rejectedArray.push(onRejected)
                break;
            case "resolve":
                this.onfullFilled(this.value);
                break;
            case "reject":
                this.onRejected(this.reason)
                break;

        }
    }

```

进阶版 2 考虑链式调用

```js
    class Promise(){
        constructor(executor){
            if(typeof executor !=="function"){
                throw new Error("executor必须是一个函数");
            }
            this.status="pending";//初始状态
            this.value=null;//resolve的实参
            this.reason=null;//reject的实参
            this.fullFilledArray=[];
            this.rejectedArray=[];
             try{
               //防止发生隐式绑定 executor(this.resolve.bind(this),this.reject.bind(this));
            }catch(e){
                this.reject(e);
            }
        };
        resolve(value){
            let status=this.status;
            if(status==="pending"){
                this.status="resolve";
                this.value=value;
                let cb;
                while (cb =  this.fullFilledArray.shift()) {
                  cb(this.value)
                }
            }
        };
        reject(reason){
            let status=this.status;
            if(status==="pending"){
                this.status="rejected";
                this.reason=reason;
                let cb;
                while (cb =  this.rejectedArray.shift()) {
                  cb(this.reason)
                }
            }
        }

   }
   Promise.then=function(onFullFilled,onRejected){
       let {status,value,reason}=this;
       return new Promise((resolve,reject)=>{
           let fullfilled=value=>{
               try{
                   if(typeof onFullFilled !=="function"){
                        resolve(value);
                   }else{
                       let res=onFullFilled(value);
                       if(res instanceof Promise){
                           res.then(resolve,reject)
                       }else{
                           resolve(res);
                       }
                   }
               }catch(e){
                   reject(e);
               }
           };
           let rejected=reason=>{
               try{
                    if(typeof onRejected !=="function"){
                        reject(value);
                    }else{
                        let res=onRejected(value);
                        if(res instanceof Promise){
                            res.then(resolve,reject);
                        }else{
                            resolve(res);
                        }
                    }
               }catch(e){
                   reject(e);
               }

           };
            swich(status){
                case "panding":
                    this.fullFilledArray.push(fullfilled);
                    this.rejectedArray.push(rejected);
                    break;
                case "resolve":
                    fullfilled(value);
                    break;
                case "reject":
                    rejected(reason);
           }
       })
   }

```

## async promise

```js
let num = 1;
async function pro() {
  console.log(`${num}-1`);
  const rr = await new Promise((resolve, reject) => {
    setTimeout(async () => {
      console.log(`${num}-2`);
      try {
        await new Promise((resolve1) => {
          resolve1(`${num}-3`);
        }).then(async (res) => {
          if (num === 1) {
            num++;

            await pro()
              .then(resolve)
              .catch(reject);
          }
          console.log(res);
          reject(`${num}-error`);
        });
        resolve(`${num}-4`);
      } catch (error) {
        reject(error);
      }
    }, 1000);
  });

  console.log(rr);
}
pro()
  .then(() => {
    console.log(5);
  })
  .catch((err) => {
    console.log(err);
  });
```
