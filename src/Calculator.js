import React from "react";
import { useState, useEffect } from "react";
import { create, all } from "mathjs";
const config = {};
const math = create(all, config);

const Calculator = () => {
  const [result, setResult] = useState("0");
  const [expression, setExpression] = useState("0");
  const [isResult, setIsResult] = useState(false);
  const [isPrevNum, setIsPrevNum] = useState(true);
  const [secondMinus, setSecondMinus] = useState(1);
  const [Calculated, setCalculated] = useState(false);
  const [repeatOperator, setRepeatOperator] = useState(false);

  const enter = () => {
    setSecondMinus(1);
    setExpression(removeExtraDecimals(expression));
    setResult(String(math.evaluate(expression)));
    setIsResult(!isResult);
    setCalculated(!Calculated);
    setRepeatOperator(false);
  };

  const clear = () => {
    setSecondMinus(1);
    setExpression("0");
    setResult("0");
    setRepeatOperator(false);
  };

  const num = (currentNum) => {
    setSecondMinus(1);
    if (isResult) {
      setResult(currentNum);
      setExpression(currentNum);
      setIsResult(!isResult);
      setRepeatOperator(false);
    } else {
      if (isPrevNum) {
        setResult(result.replace(/^0+/, "") + currentNum);
        setExpression(expression.replace(/^0+/, "") + currentNum);
        setIsPrevNum(true);
        setRepeatOperator(false);
      } else {
        setExpression(expression + currentNum);
        setResult(currentNum);
        setIsPrevNum(true);
        setRepeatOperator(false);
      }
    }
  };

  const oper = (currentOper) => {
    if (isResult) {
      setIsResult(!isResult);
      setIsPrevNum(false);
      setRepeatOperator(true);
    }
    if (repeatOperator) {
      if (secondMinus > 3) {
        setExpression(
          expression
            .replace(expression[expression.length - 2], currentOper)
            .split("  ")
            .join(" ")
        );
      } else if (secondMinus === 3) {
        setExpression(
          expression
            .replace(expression[expression.length - 2], currentOper)
            .replace(expression[expression.length - 5], "")
            .split("  ")
            .join(" ")
        );
      }
      setResult(currentOper);
      setIsPrevNum(false);
    } else {
      setSecondMinus(2);
      setExpression(expression + currentOper);
      setIsPrevNum(false);
      setResult(currentOper);
      setRepeatOperator(true);
    }
  };

  const subtractHandler = (subtract) => {
    if (secondMinus == 1) {
      oper(subtract);
    } else if (secondMinus == 2) {
      setExpression(expression + subtract.replace(/s/g, ""));
      setResult(subtract.replace(/s/g, ""));
      setIsPrevNum(true);
      setSecondMinus(3);
    } else if (secondMinus == 3 && repeatOperator == true) {
      oper(subtract);
    } else if (secondMinus == 3) {
      console.log(result);
      setExpression(expression);
      setResult(subtract);
    }
  };
  const removeExtraDecimals = (string) => {
    if (string.match(/([-+*/])/g)) {
      let tempList = string.split(/([-+*/])/g);
      tempList.map((num) => {
        let temp = num.replace(" ", "").split(".");
        return temp[0] + "." + temp.slice(1, temp.length).join("");
      });
      return tempList.join(" ");
    } else {
      let temp = string.split(".");
      return (
        temp[0].replace(/\s/, "") +
        "." +
        temp.slice(1, temp.length).join("").replaceAll(/\s/g, "")
      );
    }
  };
  console.log(removeExtraDecimals("5 . 5 . 5"));
  const clickVals = (val) => {
    const newExpression = removeExtraDecimals(expression + val).replace(
      /[.]{2,}|[-]{2,}/,
      "."
    );
    const newResult = removeExtraDecimals(result + val).replace(/[.]{2,}/, ".");
    setExpression(newExpression);
    setResult(newResult);
  };

  useEffect(() => {
    setExpression(String(result));
  }, [Calculated]);

  const nums = [
    { one: "1" },
    { two: "2" },
    { three: "3" },
    { four: "4" },
    { five: "5" },
    { six: "6" },
    { seven: "7" },
    { eight: "8" },
    { nine: "9" },
    { zero: "0" },
  ];

  const operators = [{ add: " + " }, { multiply: " * " }, { divide: " / " }];

  return (
    <div className="app">
      <div className="title">
        <h1>Calculator App</h1>
      </div>
      <div className="calculator">
        <div id="screen">
          <div id="expression">{expression}</div>
          <div id="display">{result}</div>
        </div>
        {nums.map((number) => {
          return (
            <button
              id={String(Object.keys(number))}
              onClick={() => num(String(Object.values(number)))}
            >
              {Object.values(number)}
            </button>
          );
        })}
        {operators.map((ops) => {
          return (
            <button
              id={String(Object.keys(ops))}
              onClick={() => oper(Object.values(ops))}
            >
              {Object.values(ops)}
            </button>
          );
        })}
        <button id="subtract" onClick={() => subtractHandler(" - ")}>
          -
        </button>
        <button id="decimal" onClick={() => clickVals(".")}>
          .
        </button>
        <button id="equals" onClick={() => enter()}>
          =
        </button>
        <button id="clear" onClick={() => clear()}>
          EC
        </button>
      </div>
    </div>
  );
};

export default Calculator;
