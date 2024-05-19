
const word = document.getElementById("word");
function convertButton () {
    console.log(getHashFunction())

    convertASCII(word.value);
}

const code = document.getElementById('result');
let ASCII = "";


function convertASCII(word) {
    ASCII = "";

    for(let i = 0; i < word.length; i++) {
        ASCII += word.charCodeAt(i);
    }
    ASCII = parseInt(ASCII)
    code.innerHTML = ASCII;

    myTable.setItem(ASCII, word);

    //Resets the input value
    resetInput();

    // Converts the ASCII which has a type of number to an array
    numberToArray(ASCII)
    addHashBox();
}
function resetInput () {
    word.value = "";
}

const hashFunctionOption = document.getElementById("hashFunctions");
const collisionOption = document.getElementById("collisions")
function getHashFunction() {
    return hashFunctionOption[hashFunctionOption.selectedIndex].value
}

function getCollisionsOption() {
    return collisionOption[collisionOption.selectedIndex].value
}

function hashFunction(key, hashFunc, tableSize) {
    switch (hashFunc) {
        case "0":
            console.log('Default Option');
            return defaultHash(key);
        case '1':
            console.log('Add and Fold');
            return addAndFold(key, tableSize)
        case '2':
            console.log('Digit Selection');
            return digitSelect(key)
        case '3':
            console.log('Mid-square Method');
            return midSquare(key)
        case '4':
            console.log('Modulo Arithmetic');
            return moduloArithmetic(key)
        default:
            return defaultHash(key)
    }
}

function collisionResolution(table, i, key, value, option) {
    switch (option) {
        case "0":
            console.log("Default Option");
            break;
        case "1":
            console.log("Bucket Chaining");
            return bucketChaining(key, value, i, table)
        case "2":
            console.log("Linear Probing")
            return linearProbing(key, value, i, table)
        case "3":
            console.log('Second Hash Function')
    }
}

// --- HASH FUNCTIONS ---
function defaultHash(key) {
    return key % 50
}

function digitSelect(key) {
    const keyArray = numberToArray(key);
    return keyArray[0];
}

function addAndFold(key, tableSize) {
    let sum = numberToArray(key).reduce((acc, num) => acc + num, 0)
    while (sum >= tableSize) {
        sum = numberToArray(sum).reduce((acc, num) => acc + num, 0)
    }
    console.log(sum)
    return sum
}

function midSquare(key) {
    // Converting the key to a string to find and extract the digits
    const keyStr = String(key);
    const midIndex = Math.floor(keyStr.length / 2);

    let middleTwoDigits;
    if (keyStr.length % 2 === 0) {
        middleTwoDigits = keyStr.substring(midIndex, midIndex + 1)
    } else {
        middleTwoDigits = keyStr[midIndex]
    }

    // Square the middle digit/s
    const squaredValue = Math.pow(parseInt(middleTwoDigits), 2).toString();

    const squaredMidIndex = Math.floor(squaredValue.length / 2);
    const middleLeftDigit = squaredValue.length % 2 === 0 ?
        squaredValue[squaredMidIndex - 1] : squaredValue[squaredMidIndex];

    return parseInt(middleLeftDigit);
}

function moduloArithmetic(key) {
    return key % 47;
}

// --- HASH FUNCTIONS ---

// --- COLLISION RESOLUTIONS ---

function bucketChaining(key, value, i, table) {
    if (table[i]) {
        return table[i].push([key, value]);
    } else {
        return table[i] = [[key, value]]
    }
}

function linearProbing(key, value, i, table) {
    let idx = i;
    if (table[idx] === undefined) {
        table[idx] = [key, value];
    } else {
        while (table[idx] !== undefined) {
            idx++;
        }
    }
    return table[idx] = [key, value];
}

// --- COLLISION RESOLUTIONS ---

class HashTable {
    // Capacity of array is n = 50;
    table = new Array(50);

    setItem = (key, value) => {
        const idx = hashFunction(key, getHashFunction(), this.table.length);
        if (this.table[idx]) {
            collisionResolution(this.table, idx, key, value, getCollisionsOption());
        } else {
            this.table[idx] = [key, value]
        }
        console.log(this.table)
    }

    getItem = key => {
        const idx = hashFunction(key);
        if (!this.table[idx]) {
            return null;
        }
        return this.table[idx].find(x => x[0] === key);
    }
}

function numberToArray(ASCII) {
    return String(ASCII).split("").map(Number);
}

const myTable = new HashTable();

HashTable.prototype.size = function () {
    let count = 0;
    for (let i = 0; i < myTable.table.length; i++) {
        if(this.table[i]) {
            count++;
        }
    }
    return count;
}

// myTable.setItem(2232, "Christian Dela TOrre");
// myTable.setItem(2233, "Will")

// --- Data Visualization ---
function addHashBox () {

    const programContainer = document.querySelector('.program-container');
    let boxHTML = '';

    for (let i = 0; i < myTable.table.length; i++) {
        if (myTable.table[i]) {
            boxHTML +=
                `
            <div class="box">
                <div class="key"><span>${i}</span></div>
                <div class="value"><span>${myTable.table[i][1]}</span></div>
            </div>
        `
        }
    }

    programContainer.innerHTML = boxHTML;
}





