"use client";

import { useState } from "react";

export default function Calculator() {
  const [num1, setNum1] = useState(""); 
  const [num2, setNum2] = useState("");
  const [result, setResult] = useState("0");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const suma = parseFloat(num1) + parseFloat(num2);

    if (isNaN(suma)) {
        console.log("DEBUG: num1:", num1, "num2:", num2);
      setResult("Please enter valid numbers");
    } else {
      setResult(suma.toString());
    }
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col w-48 gap-2">
        <input 
          type="number" 
          placeholder="Número 1"
          className="border p-1"
          value={num1}
          onChange={(e) => setNum1(e.target.value)}
        />
        <input 
          type="number" 
          value={num2} 
          onChange={(e) => setNum2(e.target.value)} 
          placeholder="Número 2"
          className="border p-1"
        />
        <button type="submit" className="bg-blue-500 text-white rounded p-2">
          Calculate
        </button>
      </form>

      {result && <div className="font-bold">Result: {result}</div>}
    </div>
  );
}