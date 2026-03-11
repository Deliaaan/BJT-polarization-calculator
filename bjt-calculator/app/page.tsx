"use client";

import { useState } from "react";
// Importaciones de Recharts
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot, ReferenceLine, Label } from 'recharts';
import Calculator from "@/components/calculator";

export default function Home() {
  const [polarizacion, setPolarizacion] = useState("Fija");

  // --- DATOS DE EJEMPLO PARA LA GRÁFICA (Diego conectará esto después) ---
  const mockCalculos = {
    vceCorte: 12, // V
    icMax: 10,    // mA
    vceq: 6,      // V
    icq: 5        // mA
  };

  // Generamos puntos suavizados para la recta de carga
  const dataRectaCarga = [];
  const NUM_PUNTOS = 50;
  for (let i = 0; i <= NUM_PUNTOS; i++) {
    const vceVal = (mockCalculos.vceCorte / NUM_PUNTOS) * i;
    const icVal = (-mockCalculos.icMax / mockCalculos.vceCorte) * vceVal + mockCalculos.icMax;
    dataRectaCarga.push({ vce: parseFloat(vceVal.toFixed(2)), ic: parseFloat(icVal.toFixed(2)) });
  }

  // ESTILOS ULTRA COMPACTOS (Para laptops 1366x768)
  const inputStyle = { width: '100%', padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' as const, fontSize: '13px' };
  const labelStyle = { fontWeight: 'bold', fontSize: '12px', marginBottom: '2px', display: 'block' };
  const formRowStyle = { marginBottom: '6px' };
  const btnStyle = { padding: '6px 15px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%', fontWeight: 'bold', marginTop: '5px', fontSize: '14px' };

  // Estilo para el separador sutil entre nombres
  const separatorStyle = { color: '#bbb', margin: '0 8px' };

  return (
    <div style={{ fontFamily: 'sans-serif', color: '#333', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      
      {/* --- CARÁTULA COMPACTA --- */}
      <header style={{ padding: '10px 20px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #eee' }}>
        
        {/* Logos y Títulos */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', gap: '15px' }}>
          
          {/* LOGO IZQUIERDO (IPN) - Escalado compacto */}
          <div style={{ width: '120px', height: '100px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/logo1.png" alt="Logo IPN" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<div style="font-size:10px;color:#999">Añade<br/>logo1.png</div>'; }} />
          </div>

          {/* TÍTULOS CENTRALES */}
          <div style={{ textAlign: 'center', flex: 1 }}>
            <h1 style={{ margin: '0 0 5px 0', fontSize: '24px', color: '#0056b3' }}>Calculadora de Polarización BJT</h1>
            <h2 style={{ margin: '0 0 5px 0', fontSize: '16px', color: '#555', fontWeight: 'normal' }}>Proyecto Final - Electrónica Analógica</h2>
            
            {/* --- ZONA DE INTEGRANTES ESTILIZADA --- */}
            <div style={{ fontSize: '12px', lineHeight: '1.5', color: '#333', borderTop: '1px solid #eee', paddingTop: '5px', display: 'inline-block' }}>
              <strong>Integrantes del Equipo:</strong><br />
              <div style={{ marginTop: '3px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                <span>Martínez Díaz Isaac Ramses</span>
                <span style={separatorStyle}>|</span>
                <span>Nava Juárez Diego Elian</span>
                <span style={separatorStyle}>|</span>
                <span>Lamas García Jamin Gael</span>
                <span style={separatorStyle}>|</span>
                <span>Reyes Santana Héctor Daniel</span>
              </div>
            </div>
          </div>

          {/* LOGO DERECHO (ESIME) - Escalado compacto */}
          <div style={{ width: '90px', height: '90px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/logo2.png" alt="Logo ESIME" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<div style="font-size:10px;color:#999">Añade<br/>logo2.png</div>'; }} />
          </div>
        </div>

        {/* BOTONES DE MENÚ */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '10px' }}>
          {[
            { id: "Fija", name: "Polarización Fija" },
            { id: "RE", name: "Por RE" },
            { id: "Division", name: "División de Tensión" },
            { id: "Retroalimentacion", name: "Retroalimentación" },
          ].map(btn => (
            <button key={btn.id} onClick={() => setPolarizacion(btn.id)} style={{ padding: '6px 16px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: polarizacion === btn.id ? '#0056b3' : 'white', color: polarizacion === btn.id ? 'white' : 'black', fontWeight: polarizacion === btn.id ? 'bold' : 'normal', fontSize: '13px', transition: 'all 0.1s' }}>
              {btn.name}
            </button>
          ))}
        </div>
      </header>

      {/* --- CONTENEDOR PRINCIPAL (Cuerpo de la página sin scroll) --- */}
      <main style={{ display: 'flex', flexWrap: 'wrap', padding: '10px 20px', gap: '15px', maxWidth: '1200px', margin: '0 auto', flex: 1, width: '100%', boxSizing: 'border-box' }}>
        
        {/* COLUMNA IZQUIERDA: CALCULADORAS (Inputs) */}
        <section style={{ flex: '1 1 280px', backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', border: '1px solid #eaeaea', maxHeight: '100%', overflowY: 'auto' }}>
          
          {polarizacion === "Fija" && (
            <div>
              <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '5px', margin: '0 0 10px 0', fontSize: '16px', color: '#0056b3' }}>Polarización Fija</h3>
              <Calculator /> {/* Componente de Diego */}
            </div>
          )}

          {polarizacion === "RE" && (
            <div>
              <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '5px', margin: '0 0 10px 0', fontSize: '16px', color: '#0056b3' }}>Polarización por RE</h3>
              <div style={formRowStyle}><label style={labelStyle}>VCC (V):</label><input type="number" style={inputStyle} /></div>
              <div style={formRowStyle}><label style={labelStyle}>RB (Ω):</label><input type="number" style={inputStyle} /></div>
              <div style={formRowStyle}><label style={labelStyle}>RC (Ω):</label><input type="number" style={inputStyle} /></div>
              <div style={formRowStyle}><label style={labelStyle}>RE (Ω):</label><input type="number" style={inputStyle} /></div>
              <div style={formRowStyle}><label style={labelStyle}>Beta (β):</label><input type="number" style={inputStyle} /></div>
              <button style={btnStyle}>Calcular</button>
            </div>
          )}

          {polarizacion === "Division" && (
             <div>
               <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '5px', margin: '0 0 10px 0', fontSize: '16px', color: '#0056b3' }}>División de Tensión</h3>
               <div style={formRowStyle}><label style={labelStyle}>VCC (V):</label><input type="number" style={inputStyle} /></div>
               <div style={formRowStyle}><label style={labelStyle}>VEE (V):</label><input type="number" style={inputStyle} defaultValue="0" /></div>
               <div style={formRowStyle}><label style={labelStyle}>RB1 (Ω):</label><input type="number" style={inputStyle} /></div>
               <div style={formRowStyle}><label style={labelStyle}>RB2 (Ω):</label><input type="number" style={inputStyle} /></div>
               <div style={formRowStyle}><label style={labelStyle}>RC (Ω):</label><input type="number" style={inputStyle} /></div>
               <div style={formRowStyle}><label style={labelStyle}>RE (Ω):</label><input type="number" style={inputStyle} /></div>
               <div style={formRowStyle}><label style={labelStyle}>Beta (β):</label><input type="number" style={inputStyle} /></div>
               <button style={btnStyle}>Calcular</button>
             </div>
          )}

          {polarizacion === "Retroalimentacion" && (
             <div>
               <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '5px', margin: '0 0 10px 0', fontSize: '16px', color: '#0056b3' }}>Retroalimentación</h3>
               <div style={formRowStyle}><label style={labelStyle}>VCC (V):</label><input type="number" style={inputStyle} /></div>
               <div style={formRowStyle}><label style={labelStyle}>RB (Ω):</label><input type="number" style={inputStyle} /></div>
               <div style={formRowStyle}><label style={labelStyle}>RC (Ω):</label><input type="number" style={inputStyle} /></div>
               <div style={formRowStyle}><label style={labelStyle}>RE (Ω):</label><input type="number" style={inputStyle} defaultValue="0" /></div>
               <div style={formRowStyle}><label style={labelStyle}>Beta (β):</label><input type="number" style={inputStyle} /></div>
               <button style={btnStyle}>Calcular</button>
             </div>
          )}

        </section>

        {/* COLUMNA DERECHA: GRÁFICA INTERACTIVA COMPACTA */}
        <section style={{ flex: '2 1 500px', backgroundColor: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #eaeaea', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', position: 'relative', display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '10px' }}>
             <h2 style={{ color: '#0056b3', margin: 0, fontSize: '18px' }}>📊 Recta de Carga y Punto de Operación</h2>
          </div>

          {/* CUADRO FLOTANTE CON RESULTADOS MÁS PEQUEÑO */}
          <div style={{ position: 'absolute', top: '40px', right: '20px', backgroundColor: 'rgba(255,255,255,0.95)', border: '2px solid #0056b3', borderRadius: '6px', padding: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', zIndex: 10 }}>
            <h4 style={{ margin: '0 0 4px 0', borderBottom: '1px solid #ccc', paddingBottom: '2px', color: '#0056b3', fontSize: '13px' }}>Resultados</h4>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, fontSize: '12px', lineHeight: '1.3' }}>
              <li><strong>IC MAX:</strong> {mockCalculos.icMax} mA</li>
              <li><strong>VCE CORTE:</strong> {mockCalculos.vceCorte} V</li>
              <li style={{ color: '#ff4500' }}><strong>ICQ:</strong> {mockCalculos.icq} mA</li>
              <li style={{ color: '#ff4500' }}><strong>VCEQ:</strong> {mockCalculos.vceq} V</li>
            </ul>
          </div>

          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={dataRectaCarga} margin={{ top: 15, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="vce" type="number" domain={[0, mockCalculos.vceCorte + 2]} stroke="#555">
                  <Label value="VCE (V)" offset={-15} position="insideBottom" style={{fontWeight: 'bold', fill: '#333', fontSize: '12px'}} />
                </XAxis>
                <YAxis dataKey="ic" type="number" domain={[0, mockCalculos.icMax + 2]} stroke="#555">
                   <Label value="IC (mA)" angle={-90} position="insideLeft" style={{fontWeight: 'bold', fill: '#333', fontSize: '12px'}} />
                </YAxis>
                <Tooltip cursor={{ stroke: '#0056b3', strokeWidth: 1, strokeDasharray: '3 3' }} formatter={(value: any, name: any) => [`${value} ${name === 'vce' ? 'V' : 'mA'}`, name === 'vce' ? 'VCE' : 'IC']} contentStyle={{border: '2px solid #0056b3', borderRadius: '6px', padding: '5px', fontSize: '12px', backgroundColor: 'rgba(255,255,255,0.9)'}} />
                <ReferenceLine segment={[{ x: mockCalculos.vceq, y: 0 }, { x: mockCalculos.vceq, y: mockCalculos.icq }]} stroke="#ff4500" strokeDasharray="5 5" />
                <ReferenceLine segment={[{ x: 0, y: mockCalculos.icq }, { x: mockCalculos.vceq, y: mockCalculos.icq }]} stroke="#ff4500" strokeDasharray="5 5" />
                <Line name="Recta de Carga" type="monotone" dataKey="ic" stroke="#0056b3" strokeWidth={2} dot={false} activeDot={{ r: 5, fill: '#0056b3' }} />
                <ReferenceDot x={mockCalculos.vceq} y={mockCalculos.icq} r={6} fill="#ff4500" stroke="white" strokeWidth={2}>
                   <Label value={`Q`} position="top" offset={8} style={{fill: '#ff4500', fontWeight: 'bold', fontSize: '12px'}} />
                </ReferenceDot>
              </LineChart>
            </ResponsiveContainer>
          </div>

        </section>

      </main>
    </div>
  );
}