Array.prototype.myFilter = function (cb){
    let output = []
    for ( let i =0; i<this.length; i++){
        if (cb(this[i],i,this)){
            output.push(this[i])
        }
    }
    return output
}
