import React, { useState } from 'react';

function App() {
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
Цель: ${goal}, возраст: ${age}, вес: ${weight} кг, рост: ${height} см, тренируется ${days} дней в неделю, тренировки: ${location === 'gym' ? 'в зале' : 'дома'}.
    `;

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          'HTTP-Referer': 'http://localhost:3000',  // или твой домен на проде
          'X-Title': 'GymMind'
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-7b-instruct',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7
        })
      });

      const data = await res.json();
      console.log("API response:", data);

      if (data.choices && data.choices.length > 0) {
        setResult(data.choices[0].message.content);
      } else {
        setResult('Ошибка: AI не вернул ответ. Проверь лог в консоли.');
      }
    } catch (error) {
      console.error('Ошибка при запросе:', error);
      setResult('Ошибка при запросе к AI.');
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>GymMind 🧠💪</h1>

      <input
        type="text"
        placeholder="Твоя цель (например: набор массы)"
        value={goal}
        onChange={e => setGoal(e.target.value)}
      /><br /><br />

      <input
        type="number"
        placeholder="Возраст"
        value={age}
        onChange={e => setAge(e.target.value)}
      /><br /><br />

      <input
        type="number"
        placeholder="Вес (кг)"
        value={weight}
        onChange={e => setWeight(e.target.value)}
      /><br /><br />

      <input
        type="number"
        placeholder="Рост (см)"
        value={height}
        onChange={e => setHeight(e.target.value)}
      /><br /><br />

      <input
        type="number"
        placeholder="Сколько дней в неделю ты тренируешься?"
        value={days}
        onChange={e => setDays(e.target.value)}
      /><br /><br />

      <select value={location} onChange={e => setLocation(e.target.value)}>
        <option value="gym">Зал</option>
        <option value="home">Дом</option>
      </select><br /><br />

      <button onClick={generatePlan} disabled={loading}>
        {loading ? 'Генерируем...' : 'Сгенерировать план'}
      </button><br /><br />

      <pre style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f4f4f4', padding: '10px' }}>
        {result}
      </pre>
    </div>
  );
}

export default App;
