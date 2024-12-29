module.exports = {
    inputDir: './src/icons', // (required)
    outputDir: './build/icons', // (required)
    
    normalize: true,

    //NB .icon is used in insales styles
    selector: '.i',
    prefix: 'i',

    codepoints: {
        'x-btn': 0xe000, // in css => "\e000";
        'fav': 0xe100, 
        'fav-added': 0xe101
    }
}