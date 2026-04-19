import { useState } from "react";
import Window from "./Window";

interface CalculatorProps {
  onClose: () => void;
}

function Calculator({ onClose }: CalculatorProps) {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case "+":
        return firstValue + secondValue;
      case "-":
        return firstValue - secondValue;
      case "*":
        return firstValue * secondValue;
      case "/":
        return firstValue / secondValue;
      case "=":
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };

  return (
    <Window title="Calculator" onClose={onClose} width={300} height={400}>
      <div className="calculator">
        <div className="calculator-display">{display}</div>
        <div className="calculator-keypad">
          <button className="key-clear" onClick={clear}>C</button>
          <button className="key-operation" onClick={() => inputOperation("/")}>÷</button>
          <button className="key-operation" onClick={() => inputOperation("*")}>×</button>
          <button className="key-backspace" onClick={() => setDisplay(display.slice(0, -1) || "0")}>⌫</button>

          <button className="key-number" onClick={() => inputNumber("7")}>7</button>
          <button className="key-number" onClick={() => inputNumber("8")}>8</button>
          <button className="key-number" onClick={() => inputNumber("9")}>9</button>
          <button className="key-operation" onClick={() => inputOperation("-")}>-</button>

          <button className="key-number" onClick={() => inputNumber("4")}>4</button>
          <button className="key-number" onClick={() => inputNumber("5")}>5</button>
          <button className="key-number" onClick={() => inputNumber("6")}>6</button>
          <button className="key-operation" onClick={() => inputOperation("+")}>+</button>

          <button className="key-number" onClick={() => inputNumber("1")}>1</button>
          <button className="key-number" onClick={() => inputNumber("2")}>2</button>
          <button className="key-number" onClick={() => inputNumber("3")}>3</button>
          <button className="key-equals" onClick={performCalculation}>=</button>

          <button className="key-zero" onClick={() => inputNumber("0")}>0</button>
          <button className="key-decimal" onClick={inputDecimal}>.</button>
        </div>
      </div>
    </Window>
  );
}

export default Calculator;
