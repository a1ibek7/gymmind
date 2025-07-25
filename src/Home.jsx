import React, { useState } from 'react';

function Home() {
  const [goal, setGoal] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [days, setDays] = useState('');
  const [location, setLocation] = useState('gym');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const generatePlan = async () => {
    setLoading(true);
    setResult('');
    const prompt = `
Создай индивидуальный план тренировок на неделю.
Цель: ${goal}, возраст: ${age}, вес: ${weight} кг, рост: ${height} см, тренируется ${days} дней в неделю, тренировки: ${location === 'home' ? 'дома' : 'в зале'}.
    `;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    });

    const data = await res.json();
    setResult(data.choices[0].message.content);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2>🎯 Введите параметры</h2>
      <input placeholder="Цель (набор, сушка...)" value={goal} onChange={e => setGoal(e.target.value)} />
      <input placeholder="Возраст" value={age} onChange={e => setAge(e.target.value)} />
      <input placeholder="Вес (кг)" value={weight} onChange={e => setWeight(e.target.value)} />
      <input placeholder="Рост (см)" value={height} onChange={e => setHeight(e.target.value)} />
      <input placeholder="Дней в неделю" value={days} onChange={e => setDays(e.target.value)} />
      <select value={location} onChange={e => setLocation(e.target.value)}>
        <option value="gym">Зал</option>
        <option value="home">Дом</option>
      </select>
      <button onClick={generatePlan}>Сгенерировать план</button>

      {loading && <p>⏳ Генерация...</p>}
      {result && (
        <div>
          <h3>📝 План тренировок</h3>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
}

export default Home;
