'use strict'

function getRandomNum(min, max) {
    // min = Math.ceil(min);
    // max = Math.floor(max);
    return (Math.random() * (max - min) + min).toFixed(2);
}

function makeId(length=5){
    const possible = '0123456789'
    var strId = ''
    for(var i=0; i < length; i++) {
        strId += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return strId
}

function makeLorem(wordCount = 100) {
    const words = ['The sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', '.', 'All', 'this happened', 'more or less', '.', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', '.', 'It', 'was', 'a pleasure', 'to', 'burn']
    var txt = ''
    while (wordCount > 0) {
        wordCount--
        txt += words[Math.floor(Math.random() * words.length)] + ' '
    }
    return txt
}
