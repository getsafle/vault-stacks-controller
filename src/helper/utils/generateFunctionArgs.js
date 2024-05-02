const {
    bufferCVFromString,
    noneCV,
    someCV,
    standardPrincipalCV,
    uintCV,
  } = require('@stacks/transactions');


function generateFunctionArgs(from, to, amount, memo) {

    memo = memo && memo !== ''
          ? someCV(bufferCVFromString(memo || ''))
          : noneCV();

    return functionArgs = [
        uintCV(amount),
        standardPrincipalCV(from),
        standardPrincipalCV(to),
        memo,
      ]
}

module.exports = { generateFunctionArgs }