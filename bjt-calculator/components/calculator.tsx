"use client";

import React, { useState } from "react";

export default function Calculator() {

  // switch para cambiar de polarizacion
	const [operation, setOperation] = useState("fija");

  // variables de entrada
	const [vcc, setVcc] = useState(0);
	const [resb, setResb]   = useState(0);
  const [resc, setResc]   = useState(0);
  const [beta, setBeta] = useState(0);
  const vbe: number = 0.7;

  // variables de salida
	const [icq, setIcq] = useState(0);
	const [vceq, setVceq] = useState(0);


  const checkValidNum = ( num: number ) => {
    if (isNaN(num)) {
    alert("Porfavor inserta valores validos")
   }else {
    setIcq(num)
   }
  }

  const calcIQC = (
    vcc: number, 
    resb: number,
    beta: number,
  ) => {
		resb * 1000
    const ib = (vcc - vbe)/ resb;
    const icq = beta * ib;
    return icq;
  }

	const calcVceq = (
		vcc: number,
		resc: number,
		icq: number
	) => {
		resc * 1000
		const vecq = vcc - (icq * resc)
		return vecq
	}
 

	const handleOperation = (e: React.SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (operation === "fija") {
			setIcq(calcIQC(vcc, resb, resc))
			setVceq(calcVceq(vcc, vceq, icq))
		} else if (operation === "resta"){
			alert("opcion 2")
		} else {
      alert("bad ending")
    }
	};

	return (
		<div>
			<form onSubmit={handleOperation}>
				<p>Vcc</p>
				<input
					type="number"
					name="Vcc"
          placeholder="Vcc"
					value={vcc}
					onChange={(e) => setVcc(e.target.valueAsNumber)}
				/>
				<p>ResB</p>
				<input
					type="number"
					name="resB"
          placeholder="Resistencia base"
					value={resb}
					onChange={(e) => setResb(e.target.valueAsNumber)}
				/>
				<p>ResC</p>
        <input
					type="number"
					name="resC"
          placeholder="Resistencia colector"
					value={resc}
					onChange={(e) => setResc(e.target.valueAsNumber)}
				/>
				<p>Beta</p>
        <input
					type="number"
					name="Beta"
          placeholder="Beta"
					value={beta}
					onChange={(e) => setBeta(e.target.valueAsNumber)}
				/>
				<button type="submit"> Calcular </button>
			</form>
			<div>
				<h1>Vbe: {vbe}</h1>
				<h1>Icq: {icq}</h1> <b/>
				<h1>Vceq: {vceq}</h1>
			</div>
      <div>
        <div>
          <h2>Operacion: {operation}</h2>
        </div>
        <button onClick={ () => setOperation("fija")}> Polarizacion Fija </button>
        <button onClick={ () => setOperation("resta")}>Resta</button>
      </div>
		</div>
	);
}
