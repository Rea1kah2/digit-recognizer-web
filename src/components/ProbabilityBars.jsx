function ProbabilityBars({probabilities, topDigit}) {
    const digit = Array.from({length:10}, (_, i) => i);

    return (
        <div className='prob-section'>
            <div className='prob-title'>
                Distribusi Probabilitas
            </div>
            <div className='prob-bars'>
                {digit.map((digit) => {
                    const value = probabilities[String(digit)] || 0;
                    const isTop = digit === topDigit;

                    return (
                        <div className='prob-row' key={digit}>
                            <span className='prob-label'>{digit}</span>
                            <div className='prob-track'>
                                <div className={`prob-fill ${isTop ? 'is-top' : ''}`} style={{width: `${value}%`}} />
                            </div>
                            <span className='prob-value'>{value.toFixed(2)}%</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ProbabilityBars;