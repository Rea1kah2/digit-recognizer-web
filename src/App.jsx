import {useRef, useState} from 'react';
import Canvas from './components/Canvas';
import { API_URL } from './config';
import ResultPanel from './components/ResultPanel';
import './styles/App.css';

function App(){
  // Untuk akses fungsi dari komponen Canvas
  const canvasRef = useRef(null);

  // status => idle | loading | result
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);

  // Handler => Tombol Hapus
  const handleClear = () => {
    canvasRef.current.clear();
    setStatus('idle');
    setResult(null);
  }

  // Handler => Tombol Prediksi
  const handlePredict = async () => {
    if(!canvasRef.current.hasDrawn()){
      alert('Gambar Angka terlebih dahulu!');
      return;
    }

    setStatus('loading');

    const imageBase64 = canvasRef.current.getImageData();

    try{
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ image: imageBase64 }),
      });

      const data = await response.json();

      if(data.success){
        setResult(data);
        setStatus('result');
      } else{
        alert("error dari server: " + data.error);
        setStatus('idle');
      }
    } catch (error){
      alert("Tidak bisa terhubung ke server: " + error.message);
      setStatus('idle');
      console.error(error);
    }
  };

  return (
    <div className='app-wrapper'>
      {/* Header */}
      <header className='header'>
        <div className='header-badge'>ML Project</div>
        <h1 className='header-title'>Digit Recognizer</h1>
        <p className='header-subtitle'>
          Gambar angka 0-9 di kanvas, lalu tekan <strong>Prediksi</strong>
        </p>
      </header>

      {/* Main Content */}
      <main className='main-grid'>
        {/* Kolom kiri -> Canvas */}
        <section className='card canvas-card'>
          <div className='card-label'>Kanvas Gambar</div>
          <Canvas ref={canvasRef} />
          <div className='canvas-actions'>
            <button className='btn btn-secondary' onClick={handleClear}>Hapus</button>
            <button className='btn btn-primary' onClick={handlePredict}>Prediksi</button>
          </div>
        </section>

        {/* Kolom kanan -> Hasil Prediksi */}
        <ResultPanel status={status} result={result} />
      </main>

      {/* Footer */}
      <footer className='footer'>
        <span>Dibangun dengan</span>
        <span className="tech-tag">React</span>
        <span className="tech-tag">Vite</span>
        <span className="tech-tag">Flask</span>
        <span className="tech-tag">TensorFlow</span>
      </footer>
    </div>
  );
}

export default App;