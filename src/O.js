const array_num=[]
array_num.push(3,2,7,1,0)
console.log (array_num[array_num.length-1])

function ordernar(numeros){
    let n= numeros.length

    for (let i=0; i<n - 1; i++)

    for (let j=0; j<n -1 - i; j++) {

        if (numeros[j] > numeros[j + 1]) {
            let temporal = numeros[j];
            numeros[j] = numeros[j + 1];
            numeros[j + 1] = temporal;
        }
    }
    return numeros;
}

let ventas = [5,3,8,1,2];

console.log(ordernar(ventas))