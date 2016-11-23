var fibonacci = function(n) {
    if(n > 1) {
        return fibonacci(n-1) + fibonacci(n-2);
    } else if(n == 1){
        return 1;
    } else if(n == 0){
        return 0;
    } else {
        throw new Error('Invalid n!');
    }
}

if(require.main === module) {
    var n = Number(process.argv[2]);
    console.log('fibonacci('+n+') is', fibonacci(n));
}

exports.fibonacci = fibonacci;
