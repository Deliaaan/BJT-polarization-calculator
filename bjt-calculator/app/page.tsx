"use client";

import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot, ReferenceLine, Label } from 'recharts';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export default function Home() {
  const [polarizacion, setPolarizacion] = useState("Fija");
  const [vcc, setVcc] = useState("12");
  const [vee, setVee] = useState("0"); 
  const [rb1, setRb1] = useState("240"); 
  const [rb2, setRb2] = useState("10");  
  const [resc, setResc] = useState("2.2"); 
  const [re, setRe] = useState("1");    
  const [beta, setBeta] = useState("50");
  const vbe = 0.7; // Valor constante interno

  const renderLatex = (formula: string) => {
    return {
      __html: katex.renderToString(formula, { throwOnError: false, displayMode: true })
    };
  };

  const resultados = useMemo(() => {
    const VCC_val = parseFloat(vcc) || 0;
    const VEE_input = parseFloat(vee) || 0;
    const VEE_val = VEE_input < 0 ? Math.abs(VEE_input) : VEE_input;
    
    const RC_val = (parseFloat(resc) || 0) * 1000;
    const RE_val = (parseFloat(re) || 0) * 1000;
    const B_val = parseFloat(beta) || 1;
    const R1_val = (parseFloat(rb1) || 0) * 1000;
    const R2_val = (parseFloat(rb2) || 0) * 1000;

    let icq = 0, vceq = 0, icSat = 0, vceCorte = VCC_val, vth = 0, rth = 0;

    if (polarizacion === "Fija") {
      const ib = (VCC_val - vbe) / (R1_val || 1);
      icq = B_val * ib;
      vceq = VCC_val - (icq * RC_val);
      icSat = VCC_val / (RC_val || 1);
      vceCorte = VCC_val;
    } 
    else if (polarizacion === "RE") {
      const ib = (VCC_val - vbe) / (R1_val + (B_val + 1) * RE_val || 1);
      icq = B_val * ib;
      vceq = VCC_val - icq * (RC_val + RE_val);
      icSat = VCC_val / ((RC_val + RE_val) || 1);
      vceCorte = VCC_val;
    } 
    else if (polarizacion === "Division") {
      vceCorte = VCC_val + VEE_val;
      rth = (R1_val * R2_val) / (R1_val + R2_val || 1);
      vth = (VCC_val * R2_val - VEE_val * R1_val) / (R1_val + R2_val || 1);
      const ib = (vth + VEE_val - vbe) / (rth + (B_val + 1) * RE_val || 1);
      icq = B_val * ib;
      vceq = VCC_val + VEE_val - icq * (RC_val + RE_val);
      icSat = vceCorte / ((RC_val + RE_val) || 1);
    } 
    else if (polarizacion === "Retroalimentacion") {
      const ib = (VCC_val - vbe) / (R1_val + B_val * (RC_val + RE_val) || 1);
      icq = B_val * ib;
      vceq = VCC_val - icq * (RC_val + RE_val);
      icSat = VCC_val / ((RC_val + RE_val) || 1);
      vceCorte = VCC_val;
    }

    const estado = vceq <= 0 ? "Saturación" : (icq <= 0 ? "Corte" : "Activo");
    return { 
      icq: (icq * 1000) || 0, 
      vceq: vceq || 0, 
      icSat: (icSat * 1000) || 0, 
      vceCorte: vceCorte || 0, 
      vth: vth || 0, 
      rth: rth || 0, 
      estado 
    };
  }, [vcc, vee, rb1, rb2, resc, re, beta, polarizacion]);

  const dataRectaCarga = useMemo(() => {
    const puntos = [];
    const corte = resultados.vceCorte || 1;
    const sat = resultados.icSat || 0;
    for (let i = 0; i <= 50; i++) {
      const vceVal = (corte / 50) * i;
      const icVal = sat - (sat / corte) * vceVal;
      puntos.push({ vce: parseFloat(vceVal.toFixed(2)), ic: parseFloat(icVal.toFixed(2)) });
    }
    return puntos;
  }, [resultados]);

  const inputStyle = { width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px', boxSizing: 'border-box' as const, marginTop: '4px' };
  const labelStyle = { fontWeight: 'bold' as const, fontSize: '12px', color: '#444' };
  const formulaCardStyle = { padding: '8px 12px', backgroundColor: '#fcfcfc', border: '1px solid #eee', borderRadius: '8px', marginBottom: '8px', minHeight: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85em' };

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f0f2f5', minHeight: '100vh', color: '#333' }}>
      <header style={{ padding: '10px 20px', backgroundColor: 'white', borderBottom: '2px solid #0056b3' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', gap: '20px' }}>
          <img src="/logo1.png" alt="IPN" style={{ height: '50px' }} />
          <div style={{ textAlign: 'center', flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: '18px', color: '#0056b3' }}>Calculadora BJT - Análisis Boylestad</h1>
            <div style={{ fontSize: '10px', color: '#888', marginTop: '5px' }}> Martínez Díaz Isaac Ramses | Nava Juárez Diego Elian | Lamas García Jamin Gael | Reyes Santana Héctor Daniel </div>
          </div>
          <img src="/logo2.png" alt="ESIME" style={{ height: '50px' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
          {["Fija", "RE", "Division", "Retroalimentacion"].map(id => (
            <button key={id} onClick={() => setPolarizacion(id)} 
              style={{ padding: '5px 12px', cursor: 'pointer', borderRadius: '5px', border: '1px solid #0056b3', backgroundColor: polarizacion === id ? '#0056b3' : 'white', color: polarizacion === id ? 'white' : '#0056b3', fontWeight: 'bold', fontSize: '11px' }}>
              {id === "Division" ? "División" : id === "RE" ? "Por RE" : id}
            </button>
          ))}
        </div>
      </header>

      <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '15px', padding: '15px', maxWidth: '1300px', margin: '0 auto' }}>
        <section style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.06)' }}>
            <h3 style={{ marginTop: 0, color: '#0056b3', fontSize: '16px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>Parámetros de Entrada</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div><label style={labelStyle}>VCC (V):</label><input type="number" style={inputStyle} value={vcc} onChange={e => setVcc(e.target.value)} /></div>
              {polarizacion === "Division" && <div><label style={labelStyle}>VEE (V):</label><input type="number" style={inputStyle} value={vee} onChange={e => setVee(e.target.value)} /></div>}
              <div><label style={labelStyle}>Beta (β):</label><input type="number" style={inputStyle} value={beta} onChange={e => setBeta(e.target.value)} /></div>
              <div><label style={labelStyle}>{polarizacion === "Division" ? "R1 (kΩ):" : "RB (kΩ):"}</label><input type="number" style={inputStyle} value={rb1} onChange={e => setRb1(e.target.value)} /></div>
              {polarizacion === "Division" ? (
                <div><label style={labelStyle}>R2 (kΩ):</label><input type="number" style={inputStyle} value={rb2} onChange={e => setRb2(e.target.value)} /></div>
              ) : (
                <div><label style={labelStyle}>RC (kΩ):</label><input type="number" style={inputStyle} value={resc} onChange={e => setResc(e.target.value)} /></div>
              )}
              {polarizacion === "Division" && <div><label style={labelStyle}>RC (kΩ):</label><input type="number" style={inputStyle} value={resc} onChange={e => setResc(e.target.value)} /></div>}
              {polarizacion !== "Fija" && <div><label style={labelStyle}>RE (kΩ):</label><input type="number" style={inputStyle} value={re} onChange={e => setRe(e.target.value)} /></div>}
            </div>
            <div style={{ marginTop: '15px', padding: '10px', textAlign: 'center', fontWeight: 'bold', borderRadius: '8px', backgroundColor: resultados.estado === "Activo" ? '#e6f4ea' : '#fce8e6', color: resultados.estado === "Activo" ? '#1e7e34' : '#d93025', border: '1px solid', fontSize: '13px' }}>
              Región Teórica: {resultados.estado}
            </div>
          </div>

          <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.06)' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#0056b3' }}>Análisis Matemático (Sustitución)</h4>
            <div style={{ overflowX: 'auto' }}>
              {polarizacion === "Division" ? (
                <>
                  <div style={formulaCardStyle} dangerouslySetInnerHTML={renderLatex(`V_{th} = \\frac{V_{CC}R_2 - (-V_{EE})R_1}{R_1+R_2} \\approx ${resultados.vth.toFixed(2)}V`)} />
                  <div style={formulaCardStyle} dangerouslySetInnerHTML={renderLatex(`I_{CQ} = \\beta \\frac{V_{th} + V_{EE} - V_{BE}}{R_{th} + (\\beta+1)R_E} \\approx ${resultados.icq.toFixed(2)}mA`)} />
                  <div style={formulaCardStyle} dangerouslySetInnerHTML={renderLatex(`V_{CEQ} = V_{CC} + V_{EE} - I_{CQ}(R_C + R_E) \\approx ${resultados.vceq.toFixed(2)}V`)} />
                </>
              ) : (
                <>
                  <div style={formulaCardStyle} dangerouslySetInnerHTML={renderLatex(`I_{CQ} = \\beta I_B \\approx ${resultados.icq.toFixed(2)}mA`)} />
                  <div style={formulaCardStyle} dangerouslySetInnerHTML={renderLatex(`V_{CEQ} = V_{CC} - I_{CQ}R_{total} \\approx ${resultados.vceq.toFixed(2)}V`)} />
                </>
              )}
              <div style={formulaCardStyle} dangerouslySetInnerHTML={renderLatex(`I_{C(sat)} \\approx ${resultados.icSat.toFixed(2)}mA \\quad V_{CE(off)} = ${resultados.vceCorte.toFixed(2)}V`)} />
            </div>
          </div>
        </section>

        <section style={{ backgroundColor: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '15px' }}>
            <div style={{ padding: '8px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #eee', fontSize: '12px' }}>
              <strong>IC Sat:</strong> {resultados.icSat.toFixed(2)} mA<br/>
              <strong>VCE Corte:</strong> {resultados.vceCorte.toFixed(2)} V
            </div>
            <div style={{ padding: '8px', background: '#eef4ff', borderRadius: '8px', borderLeft: '4px solid #0056b3', fontSize: '12px' }}>
              <span style={{color: '#ff4500'}}><strong>ICQ:</strong> {resultados.icq.toFixed(2)} mA</span><br/>
              <span style={{color: '#ff4500'}}><strong>VCEQ:</strong> {resultados.vceq.toFixed(2)} V</span>
            </div>
          </div>
          <div style={{ flex: 1, width: '100%', minHeight: '350px' }}>
            <ResponsiveContainer>
              <LineChart data={dataRectaCarga} margin={{ top: 15, right: 30, left: 10, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="vce" type="number" domain={[0, Math.ceil(resultados.vceCorte * 1.1) || 1]} stroke="#888" tick={{fontSize: 10}}>
                  <Label value="VCE (V)" offset={-25} position="insideBottom" style={{fontSize: '11px', fontWeight: 'bold'}} />
                </XAxis>
                <YAxis dataKey="ic" type="number" domain={[0, Math.ceil(resultados.icSat * 1.1) || 1]} stroke="#888" tick={{fontSize: 10}}>
                  <Label value="IC (mA)" angle={-90} position="insideLeft" offset={0} style={{fontSize: '11px', fontWeight: 'bold'}} />
                </YAxis>
                <Tooltip formatter={(val: any) => [val + " mA", "IC"]} labelFormatter={(label) => `VCE: ${label} V`} />
                <Line type="monotone" dataKey="ic" stroke="#0056b3" strokeWidth={3} dot={false} isAnimationActive={false} />
                <ReferenceDot x={0} y={resultados.icSat} r={4} fill="#0056b3" stroke="white" strokeWidth={1.5} />
                <ReferenceDot x={resultados.vceCorte} y={0} r={4} fill="#0056b3" stroke="white" strokeWidth={1.5} />
                <ReferenceLine x={resultados.vceq} stroke="#ff4500" strokeDasharray="4 4" />
                <ReferenceLine y={resultados.icq} stroke="#ff4500" strokeDasharray="4 4" />
                <ReferenceDot x={resultados.vceq} y={resultados.icq} r={6} fill="#ff4500" stroke="white" strokeWidth={1.5}>
                  <Label value="Q" position="top" offset={8} fill="#ff4500" fontWeight="bold" />
                </ReferenceDot>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </main>
    </div>
  );
}