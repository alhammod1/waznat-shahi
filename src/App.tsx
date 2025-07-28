import React, { useState, useEffect } from 'react';
import './App.css';

type CalcMode = 'water' | 'sugar' | 'tea';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [calcMode, setCalcMode] = useState<CalcMode>('water');
  const [sweetnessAdjustment, setSweetnessAdjustment] = useState(0);
  const [strengthMultiplier, setStrengthMultiplier] = useState(12);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [results, setResults] = useState({ water: 0, sugar: 0, tea: 0 });

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.body.classList.toggle('dark-mode', newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  // Calculate results
  useEffect(() => {
    const value = parseFloat(inputValue.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[^\d\.]/g, ''));
    
    if (isNaN(value) || value <= 0) {
      setResults({ water: 0, sugar: 0, tea: 0 });
      return;
    }

    let waterMl: number, sugarGrams: number, teaGrams: number;
    const baseSugarPerLiter = 84;

    switch (calcMode) {
      case 'sugar':
        const targetSugar = value;
        const baseSugar = targetSugar - sweetnessAdjustment;
        waterMl = (baseSugar * 1000) / baseSugarPerLiter;
        teaGrams = (strengthMultiplier * waterMl) / 1000;
        sugarGrams = targetSugar;
        break;
      case 'tea':
        teaGrams = value;
        waterMl = (teaGrams * 1000) / strengthMultiplier;
        sugarGrams = ((baseSugarPerLiter * waterMl) / 1000) + sweetnessAdjustment;
        break;
      default: // 'water'
        waterMl = value;
        sugarGrams = ((baseSugarPerLiter * waterMl) / 1000) + sweetnessAdjustment;
        teaGrams = (strengthMultiplier * waterMl) / 1000;
        break;
    }

    setResults({
      water: Math.max(0, waterMl),
      sugar: Math.max(0, sugarGrams),
      tea: Math.max(0, teaGrams)
    });
  }, [inputValue, calcMode, sweetnessAdjustment, strengthMultiplier]);

  const formatNumber = (num: number) => {
    if (typeof num !== 'number') return num;
    let numStr = num.toFixed(2).replace(/\.00$/, '').replace(/\.0$/, '');
    const useArabicNumbers = /[٠-٩]/.test(inputValue);
    return useArabicNumbers ? numStr.replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]) : numStr;
  };

  const getInputLabel = () => {
    const labels = {
      water: "أدخل كمية الماء بالمليلتر:",
      sugar: "أدخل كمية السكر بالجرام:",
      tea: "أدخل كمية الشاي بالجرام:"
    };
    return labels[calcMode];
  };

  const calculateGlassDisplay = (grams: number, maxGrams: number) => {
    const fullCups = Math.floor(grams / maxGrams);
    const remainder = grams % maxGrams;
    const fillPercentage = grams > 0 && remainder === 0 ? 1 : remainder / maxGrams;
    return { fullCups, remainder, fillPercentage };
  };

  const sugarDisplay = calculateGlassDisplay(results.sugar, 84);
  const teaDisplay = calculateGlassDisplay(results.tea, 21);

  return (
    <div className="app">
      <div className="container">
        <button className="theme-toggle" onClick={toggleTheme}>
          {isDarkMode ? '☀️' : '🌙'}
        </button>
        
        <h1>وزنة شاهي ربيع</h1>
        
        <div className="input-section">
          <div className="calc-mode">
            <p><strong>طريقة الحساب:</strong></p>
            <select 
              value={calcMode} 
              onChange={(e) => setCalcMode(e.target.value as CalcMode)}
              className="mode-select"
            >
              <option value="water">الحساب بالماء</option>
              <option value="sugar">الحساب بالسكر</option>
              <option value="tea">الحساب بالشاي</option>
            </select>
          </div>

          <div className="input-group">
            <label>{getInputLabel()}</label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="أدخل القيمة هنا"
              className="main-input"
            />
          </div>

          <div className="controls">
            <div className="control-group">
              <p className="control-label">مستوى السكر</p>
              <div className="button-group">
                <button 
                  className={sweetnessAdjustment === -10 ? 'active' : ''}
                  onClick={() => setSweetnessAdjustment(-10)}
                >
                  خفيف
                </button>
                <button 
                  className={sweetnessAdjustment === 0 ? 'active' : ''}
                  onClick={() => setSweetnessAdjustment(0)}
                >
                  معتدل
                </button>
                <button 
                  className={sweetnessAdjustment === 10 ? 'active' : ''}
                  onClick={() => setSweetnessAdjustment(10)}
                >
                  حالي زيادة
                </button>
              </div>
            </div>

            <div className="control-group">
              <p className="control-label">مستوى الشاهي</p>
              <div className="button-group">
                <button 
                  className={strengthMultiplier === 11 ? 'active' : ''}
                  onClick={() => setStrengthMultiplier(11)}
                >
                  خفيف
                </button>
                <button 
                  className={strengthMultiplier === 12 ? 'active' : ''}
                  onClick={() => setStrengthMultiplier(12)}
                >
                  وسط
                </button>
                <button 
                  className={strengthMultiplier === 13 ? 'active' : ''}
                  onClick={() => setStrengthMultiplier(13)}
                >
                  ثقيل
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="warning">
          <span className="underlined-red">اذا لم يتوفر الميزان يمكنك استخدام القياس بالنظر مستخدما البيالة كمقياس حيث ان المقاييس تم اختبارها مسبقا</span>
        </p>

        {(results.water > 0 || results.sugar > 0 || results.tea > 0) && (
          <div className="result">
            النتيجة: <span>{formatNumber(results.water)}</span> مل ماء | <span>{formatNumber(results.sugar)}</span> جم سكر | <span>{formatNumber(results.tea)}</span> جم شاي
          </div>
        )}

        <div className="visual-container">
          <div className="glass-container">
            <p className="glass-title">السكر</p>
            <div className="glass">
              <div 
                className="level sugar-level" 
                style={{ height: `${sugarDisplay.fillPercentage * 225}px` }}
              ></div>
              <div className="scale gram-scale">
                <div style={{ bottom: '100%' }}>84</div>
                <div style={{ bottom: '87.5%' }}>73.5</div>
                <div style={{ bottom: '75%' }}>63</div>
                <div style={{ bottom: '62.5%' }}>52.5</div>
                <div style={{ bottom: '50%' }}>42</div>
                <div style={{ bottom: '37.5%' }}>31.5</div>
                <div style={{ bottom: '25%' }}>21</div>
                <div style={{ bottom: '12.5%' }}>10.5</div>
                <div style={{ bottom: '6.25%' }}>5.25</div>
              </div>
              <div className="scale percentage-scale">
                <div style={{ bottom: '100%' }}>100%</div>
                <div style={{ bottom: '75%' }}>75%</div>
                <div style={{ bottom: '50%' }}>50%</div>
                <div style={{ bottom: '25%' }}>25%</div>
                <div style={{ bottom: '10%' }}>10%</div>
              </div>
            </div>
            {results.sugar > 0 && (
              <p className="note">
                <span className="value">{formatNumber(sugarDisplay.fullCups)}</span> بيالة 
                <span className="plus"> + </span>
                <span className="value">{formatNumber(sugarDisplay.remainder)}</span> جم
              </p>
            )}
          </div>

          <div className="glass-container">
            <p className="glass-title">الشاي</p>
            <div className="glass">
              <div 
                className="level tea-level" 
                style={{ height: `${teaDisplay.fillPercentage * 225}px` }}
              ></div>
              <div className="scale gram-scale">
                <div style={{ bottom: '100%' }}>21</div>
                <div style={{ bottom: '90%' }}>18.9</div>
                <div style={{ bottom: '75%' }}>15.75</div>
                <div style={{ bottom: '65%' }}>13.65</div>
                <div style={{ bottom: '50%' }}>10.5</div>
                <div style={{ bottom: '40%' }}>8.4</div>
                <div style={{ bottom: '25%' }}>5.25</div>
                <div style={{ bottom: '15%' }}>3.15</div>
                <div style={{ bottom: '10%' }}>2.1</div>
              </div>
              <div className="scale percentage-scale">
                <div style={{ bottom: '100%' }}>100%</div>
                <div style={{ bottom: '75%' }}>75%</div>
                <div style={{ bottom: '50%' }}>50%</div>
                <div style={{ bottom: '25%' }}>25%</div>
                <div style={{ bottom: '10%' }}>10%</div>
              </div>
            </div>
            {results.tea > 0 && (
              <p className="note">
                <span className="value">{formatNumber(teaDisplay.fullCups)}</span> بيالة 
                <span className="plus"> + </span>
                <span className="value">{formatNumber(teaDisplay.remainder)}</span> جم
              </p>
            )}
          </div>
        </div>

        <div className="footer-notes">
          <p><span className="underlined-red">البيالة المستخدمة في القياس هي بيالة "بادريق"</span></p>
          <p>البيالة العادية من الماء إلى المستوى الطبيعي المتعارف عليه تساوي تقريبا <span className="red-text">66.2</span> مل، أي أن <span className="red-text">1</span> لتر يساوي <span className="red-text">15</span> بيالة.</p>
          <p><span style={{ color: 'red' }}>(لجميع انواع الشاهي)</span> تقريبا هذه الوزنة مناسبة للجميع مع التعديل حسب الحاجة لواحد لتر</p>
          <p><span className="red-text">السكر: 50 إلى 55 جم</span><br />
          <span className="red-text">الشاي: 12 إلى 12.5 جم</span></p>
          <p><strong className="red-text">طريقة الحساب:</strong> لحساب كمية <span className="red-text">السكر</span> و<span className="red-text">الشاي</span> بناءً على كمية الماء:<br />
          <span className="red-text">السكر (جم)</span> = (كمية الماء بالمللتر ÷ 1000) × <span className="blue-text">50 إلى 55</span><br />
          <span className="red-text">الشاي (جم)</span> = (كمية الماء بالمللتر ÷ 1000) × <span className="blue-text">12 إلى 12.5</span></p>
          <p><strong className="red-text">ملاحظة:</strong> قد تختلف النتيجة حسب نوع الشاي، يفضل التجربة والضبط حسب الذوق.</p>
        </div>
      </div>
    </div>
  );
}

export default App;