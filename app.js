const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Homepage!");
});

app.get("/sum", (req, res) => {
  const a = req.query.a;
  const b = req.query.b;
  const c = parseInt(a) + parseInt(b);
  res.send(`The sum of ${a} and ${b} is ${c}`);
});

app.get("/cipher", (req, res) => {
  const text = req.query.text;
  const shift = req.query.shift;
  const numShift = parseInt(shift);
  const base = "A".charCodeAt(0);
  const cipher = text
    .toUpperCase()
    .split("")
    .map(char => {
      let code = char.charCodeAt(0);
      if (code < base || code > base + 26) {
        return char;
      } else {
        let diff = code - base + numShift;
        diff = diff % 26;
        const shiftedChar = String.fromCharCode(base + diff);
        return shiftedChar;
      }
    })
    .join("");
  res.send(cipher);
});

app.get("/lotto", (req, res) => {
  const { numbers } = req.query;
  const guesses = numbers
    .map(n => parseInt(n))
    .filter(n => !Number.isNaN(n) && n >= 1 && n <= 20);
  if (guesses.length < 6) {
    return res
      .status(400)
      .send("Please input 6 guesses between the numbers 1 and 20.");
  }
  const stockNumbers = Array(20)
    .fill(1)
    .map((_, i) => i + 1);
  let winningNumbers = [];
  for (let i = 0; i < 6; i++) {
    const ran = Math.floor(Math.random() * stockNumbers.length);
    winningNumbers.push(stockNumbers[ran]);
    stockNumbers.splice(ran, 1);
  }
  let diff = winningNumbers.filter(n => !guesses.includes(n));
  let responseText;
  switch (diff.length) {
    case 0:
      responseText = "Wow! Unbelievable! You could have won the mega millions!";
      break;
    case 1:
      responseText = "Congratulations! You win $100!";
      break;
    case 2:
      responseText = "Congratulation, you win a free ticket!";
      break;
    default:
      responseText = "Sorry, you lose";
  }
  // res.json({
  //   guesses,
  //   winningNumbers,
  //   diff,
  //   responseText
  // });

  res.send(responseText);
});

app.listen(8000, () => {
  console.log("Express server is listening on port 8000!");
});
