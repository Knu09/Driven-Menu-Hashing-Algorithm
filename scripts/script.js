
const word = document.getElementById("word");
function convertButton () {
    errorTrapping();
    if (isFull()) {
        displayFullCapacity();
    }

    if (!errorMessage.classList.contains('active') && !errorMessage2.classList.contains('active')
        && !errorMessage3.classList.contains('active')) {
        hideDescriptionGuide();
        convertASCII(word.value);
    }
}

const code = document.getElementById('result');
let ASCII = "";


function convertASCII(word) {
    ASCII = "";

    for(let i = 0; i < word.length; i++) {
        ASCII += word.charCodeAt(i);
    }
    ASCII = Number(ASCII);
    console.log(ASCII)
    code.innerHTML = BigInt(ASCII);

    if (!isFull()) {
        myTable.setItem(ASCII, word);
        capacitySize++;
    }
    //Resets the input value
    resetInput();

    // Converts the ASCII which has a type of number to an array
    numberToArray(ASCII)
    addHashBox();
}
function resetInput () {
    word.value = "";
}

const errorMessage = document.querySelector('.error-message1')
const errorMessage2 = document.querySelector('.error-message2')
const errorMessage3 = document.querySelector(".error-message3")

function errorTrapping() {
    if (word.value === "") {
        errorMessage.classList.add('active')
    } else {
        errorMessage.classList.remove('active')
    }

    if (getCollisionsOption() === "0") {
        errorMessage2.classList.add('active')
    } else {
        errorMessage2.classList.remove('active')
    }

    if (getHashFunction() === "0") {
        errorMessage3.classList.add('active')
    } else {
        errorMessage3.classList.remove('active')
    }

    if (isFull()) {
        console.log("is full")
    }
}

const hashFunctionOption = document.getElementById("hashFunctions");
const collisionOption = document.getElementById("collisions")
function getHashFunction() {
    return hashFunctionOption[hashFunctionOption.selectedIndex].value
}

function getCollisionsOption() {
    return collisionOption[collisionOption.selectedIndex].value
}

function hashFunction(key, hashFunc, tableSize, prime) {
    switch (hashFunc) {
        case "0":
            return defaultHash(key);
        case '1':
            return addAndFold(key, 50)
        case '2':
            return digitSelect(key)
        case '3':
            return midSquare(key)
        case '4':
            return moduloArithmetic(key, prime)
        default:
            return defaultHash(key)
    }
}

function collisionResolution(table, i, key, value, option, prime) {
    switch (option) {
        case "0":
            console.log("Please choose an option")
            break;
        case "1":
            return bucketChaining(key, value, i, table)
        case "2":
            return linearProbing(key, value, i, table)
        case "3":
            console.log("secondHash")
            return secondHashFunction(key, value, i, table, prime);
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
    key = BigInt(key);
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
        middleTwoDigits = keyStr.substring(midIndex - 1, midIndex + 1)
    } else {
        middleTwoDigits = keyStr[midIndex]
    }
    // Square the middle digit/s
    const squaredValue = Math.pow(parseInt(middleTwoDigits), 2).toString();

    const squaredMidIndex = Math.floor(squaredValue.length / 2);
    const middleSquared = Number(squaredValue.substring(squaredMidIndex - 1, squaredMidIndex + 1))
    const dividedValue = Math.floor(middleSquared / 10);

    return middleSquared < 50 ? middleSquared : dividedValue
}

function moduloArithmetic(key, prime) {
    return key % prime;
}

// --- HASH FUNCTIONS ---

// --- COLLISION RESOLUTIONS ---

function bucketChaining(key, value, i, table) {
    if (table[i]) {
        capacitySize--;
        return table[i].push([key, value]);
    } else {
        return table[i] = [[key, value]]
    }
}

function linearProbing(key, value, i, table) {
    let idx = i;
    idx %= 49;
    if (table[idx] === undefined) {
        table[idx] = [key, value];
    } else {
        while (table[idx] !== undefined) {
            idx++;
        }
    }

    table[idx] = [key, value];
    return idx;
}

function secondHashFunction(key, value, i, table, prime) {
    let secondHashKey = secondHash(i, prime)
    let hash = i;
    let idx = 1;
    while (table[hash] !== undefined) {
        idx++
        hash = (firstHash(i, 50) + idx * secondHashKey) % table.length;
        if (idx === 4) {
            hash = linearProbing(key, value, i, table);
            break;
        }
    }
    table[hash] = [key, value];
    return hash;
}

function firstHash(i, tableSize) {
    return i % tableSize;
}

function secondHash(key, prime) {
    let hash = prime - (key % prime);
    return hash === 0 ? 1 : hash;
}

// --- COLLISION RESOLUTIONS ---

const clearButton = document.querySelector('.clear');
const programContainer = document.querySelector('.hash-table')

const capacityValue = document.querySelector('.capacity-value')
let capacitySize = 1;
clearButton.addEventListener('click',() => {
    activeDescriptionGuide()
    capacityValue.style.color = "#fff"
    capacityValue.innerText = `0/50`
    capacitySize = 1;
    myTable.table = [];
    programContainer.innerHTML = ``;
})

function isFull() {
    if (capacitySize > 50) {
        return true;
    }
}

function displayFullCapacity () {
    capacityValue.style.color = "red";
}


class HashTable {
    // Capacity of array is n = 50;
    table = new Array(50);

    setItem = (key, value) => {
        const prime = 47;
        const idx = hashFunction(key, getHashFunction(), this.table.length, prime);
        console.log(idx)
        let hash;
        hashKeyValue.innerText = idx;
        // Conduct a resolution if a collision occurs
        if (this.table[idx]) {
            hash = collisionResolution(this.table, idx, key, value, getCollisionsOption(), prime);
            hashKeyValue.innerText = hash;
        } else {
            this.table[idx] = [key, value]
        }


        capacityValue.innerText = `${capacitySize}/50`
        console.log(this.table)
    }

    // getItem = key => {
    //     const idx = hashFunction(key);
    //     if (!this.table[idx]) {
    //         return null;
    //     }
    //     return this.table[idx].find(x => x[0] === key);
    // }
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

const hashKeyValue =  document.querySelector('.hash-key');

// --- Data Visualization ---
function addHashBox () {

    const programContainer = document.querySelector('.hash-table');
    let boxHTML = '';

    for (let i = 0; i < myTable.table.length; i++) {
        if (myTable.table[i]) {
            let hashTable = myTable.table;
            let bucketChain = "";

            let containsArray = hashTable[i].some(elem => Array.isArray(elem))
            if(containsArray) {
                let translateXValue = 0;

                for (let j = 2; j < hashTable[i].length; j++) {
                    const value = myTable.table[i][j][1];
                    let translateXValue = 210 * (j - 1);

                    bucketChain +=
                        `
                    <div class="box bucket-chain" style="transform: translateX(${translateXValue}px)">
                        <div class="key"><span>${i}</span></div>
                        <div class="value"><span>${value}</span></div>
                    </div>
                    `
                }

            }

            boxHTML +=
            `
            <div class="box">
                <div class="key"><span>${i}</span></div>
                <div class="value"><span>${myTable.table[i][1]}</span></div>
                ${bucketChain}
            </div>
            `
        }
    }

    programContainer.innerHTML = boxHTML;
}






