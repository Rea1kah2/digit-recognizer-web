import ProbabilityBars from './ProbabilityBars';

function ResultPanel({status, result}){
    return (
        <section className='card result-card'>
            <div className='card-label'>Hasil Prediksi</div>

            {status === 'idle' && (
                <div className='result-idle'>
                    <p>Gambar angka terlebih dahulu, lalu tekan "Prediksi"</p>
                </div>
            )}

            {status === 'loading' && (
                <div className='result-loading'>
                    <div className='spinner'></div>
                    <p>Menganalisis Gambar...</p>
                </div>
            )}

            {status === 'result' && result && (
                <div className='result-output'>
                    <div className='predicted-digit'>{result.digit}</div>
                    <div className='confidence-badge'>{result.confidence.toFixed(2)}%</div>
                    <p className='confidence-label'>Tingkat Keyakinan</p>

                    <ProbabilityBars probabilities={result.all_probabilities} topDigit={result.digit}/>
                </div>
            )}
        </section>
    );
}

export default ResultPanel;