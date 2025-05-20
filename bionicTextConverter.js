const fs = require('fs')

const outputType = {
  html: {
    name: 'html',
    open: '<b>',
    close: '</b>',
    file: '.html'
  },
  markdown: {
    name: 'markdown',
    open: '**',
    close: '**',
    file: '.md'
  }
}

const inputPath = './inputText.txt'
const outputPath = './Output/'
const text = fs.readFileSync(inputPath, 'utf8')

exports.convertToBionicText = (text, type = outputType.markdown) => { convertText(text , type) }

function convertText (text, type, returnsText = false) {
  const words = text.split(/\n| /)
  const newWords = []

  words.forEach(word => {
    // filter only alphanumeric characters when getting length
    const hyphenated = word.includes('-')

    let nextWord = undefined
    let nextLen = undefined

    if (hyphenated) {
      nextWord = word.split('-')[1]
      nextLen = nextWord.replace(/[^a-zA-Z0-9]/g, '').length

      word = word.split('-')[0]
    }

    const len = word.replace(/[^a-zA-Z0-9]/g, '').length

    let boldText = `${type.open}`
    let normalText = `${type.close}`

    // if first char is special i.e ",',etc.. then add it before bold tag
    const first = (isFirstCharSpecial(word)) ? 1 : 0
    if (first !== 0) { boldText = word[0] + `${type.open}` }

    const divNum = ((isEven(len)) ? len / 2 : (len / 2) + 1) + first

    if (len <= 3) {
      boldText += word[first]
      normalText += word.slice(first + 1)
      newWords.push(boldText + normalText)

      return
    }

    boldText += word.slice(first, divNum)
    normalText += word.slice(divNum)

    let newWord = boldText + normalText

    if (hyphenated) {
      const nextDivNum = (isEven(nextLen)) ? nextLen / 2 : (nextLen / 2) + 1

      boldText = `${type.open}${nextWord.slice(0, nextDivNum)}`
      normalText = `${type.close}${nextWord.slice(nextDivNum)}`

      newWord += '-' + boldText + normalText
    }

    newWords.push(newWord)
  })

  const newText = newWords.join(' ')

  if (!returnsText) {
    if (!fs.existsSync(outputPath)) { fs.mkdirSync(outputPath) }

    const outPath = outputPath + 'output' + type.file

    console.log(`Text converted and written to ${__dirname.replace(/\\/g, '/') + outPath.slice(1)}`)
    fs.writeFileSync(outPath, newText)
    return
  }

  console.log(`Text converted and output in ${type.name} format`)
  return newText
}

function isEven (num) {
  return num % 2 === 0;
}

function isFirstCharSpecial(str) {
  if (str.length === 0) {
    return false
  }

  // Regular expression to match any alphanumeric character
  const alphanumericRegex = /^[a-zA-Z0-9]/

  return !alphanumericRegex.test(str.charAt(0))
}

convertText(text, outputType.html)

// Took a break from solving world hunger for this
// Brought to you by Owen
