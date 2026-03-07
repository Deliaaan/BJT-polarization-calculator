"use client";

import React, { useState } from "react";

export default function Calculator() {
	const [operation, setOperation] = useState("");
	const [num1, setNum1] = useState("");
	const [num2, setNum2] = useState("");
	const [result, setResult] = useState("0");


  const checkValidNum = ( num: number ) => {
    if (isNaN(num)) {
    setResult("enter valid numbers")
   }else {
    setResult(num.toString())
   }
  }
	const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
    console.log(operation)

		if (operation === "suma") {
			const suma = parseFloat(num1) + parseFloat(num2);
			return checkValidNum(suma);
		} else if (operation === "resta"){
			const resta = parseFloat(num1) - parseFloat(num2);
			return checkValidNum(resta);
		} else {

    }
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<input
					type="number"
					name="num1"
					value={num1}
					onChange={(e) => setNum1(e.target.value)}
				/>
				<input
					type="number"
					name="num2"
					value={num2}
					onChange={(e) => setNum2(e.target.value)}
				/>
				<button type="submit">hola</button>
			</form>
			<div>
				<h1>Result: {result}</h1>
			</div>

      <div>
        <div>
          <h2>Operacion: {operation}</h2>
        </div>
        <button onClick={ () => setOperation("suma")}>Suma</button>
        <button onClick={ () => setOperation("resta")}>Resta</button>
      </div>
		</div>
	);
}
