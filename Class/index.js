// ---------------MAP-------------
Array.prototype.myMap = function (cb){
    const array = []
    for (let i=0; i <this.length; i++){
        array.push(cb(this[i],i,this))
    }
    return array
}
array = [1,2,3,4]
const multiply = array.myMap((num,idx)=>(num*3))
console.log(multiply)
// ---------------FILTER-------------
Array.prototype.myFilter = function (cb){
    let array = []
    for ( let i=0; i<this.length; i++){
        if (cb(this[i],i,this)){
            array.push(this[i])
        }
    }
    return array
}
let array2 = [1,2,3,4]
const ans = array2.myFilter((num,idx)=>(num%2==0))
console.log(ans)
// --------------reduce-------------
Array.prototype.myReduce = function (cb,initial){
    let accumulator = initial
    startIndex = 0 
    if (initial===undefined){
        accumulator = this[0]
        startIndex = 1

    }
    for ( let i = startIndex; i<this.length; i++){
        accumulator = cb(accumulator,this[i],i,this)
    }
    return accumulator
}
let a = [1,2,3,4]
let b = a.myReduce((i,curr)=>(i+curr),2)
console.log(b)
// -------------------------------DEEP COPY-----------------------
function deepcopy (obj){
    if (obj===null || typeof(obj)!=="object"){
        return obj
    }
    const copy = Array.isArray(obj)? []:{}
    for ( let i in obj){
        if (obj.hasOwnProperty(i)){
            copy[i] = deepcopy(obj[i])
        }
    }
    return copy
}
const original = { a: 1, b: { c: 2 } };
const clone = deepcopy(original);
clone.b.c = 100;

console.log(original.b.c); // 2 (Unaffected!)