function getNthFibonacci( count )
{
    if ( count <= 1 ){
        return 1;
    } else {
        var num1 = 1, num2 = 1, t;
        for ( var i = 0; i < count-1; i++ ) {
            t = num1 + num2;
            num1 = num2;
            num2 = t;
        }
        return num2;
    }
}


console.log(getNthFibonacci(4));


