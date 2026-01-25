import React from 'react';

// Componente de Card
const Card = ({ children, className = '' }) => (
  <div className={`bg-[#0a1628] border border-[#1e3a5f] rounded-xl p-5 ${className}`}>
    {children}
  </div>
);

// Componente de Barra Horizontal de Progresso
const HorizontalBar = ({ label, value, maxValue = 5, showValue = true }) => {
  const percentage = (value / maxValue) * 100;
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="text-white text-sm w-32 uppercase tracking-wide">{label}</span>
      <div className="flex-1 bg-[#1e3a5f] rounded-full h-4 overflow-hidden">
        <div
          className="bg-[#4fc3f7] h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showValue && <span className="text-[#4fc3f7] text-sm w-10">({value})</span>}
    </div>
  );
};

// Componente de Gráfico Circular (Donut)
const DonutChart = ({ percentage }) => {
  const radius = 70;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          stroke="#1e3a5f"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Progress circle */}
        <circle
          stroke="#4fc3f7"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute text-center">
        <span className="text-4xl font-bold text-[#4fc3f7]">{percentage}%</span>
      </div>
    </div>
  );
};

// Componente de Gráfico de Barras Vertical
const BarChart = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="flex items-end justify-center gap-12 h-48">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center">
          <span className="text-[#4fc3f7] text-lg font-bold mb-2">{item.value}</span>
          <div
            className="w-16 bg-[#4fc3f7] rounded-t-lg transition-all duration-500"
            style={{ height: `${(item.value / maxValue) * 120}px` }}
          />
          <span className="text-white text-xs mt-3 text-center uppercase tracking-wide">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

// Componente de Lista de Autores
const AuthorList = ({ authors }) => (
  <div className="space-y-2">
    {authors.map((author, index) => (
      <div key={index} className="flex items-center gap-3">
        <span className="text-white text-sm">{index + 1}.</span>
        <span className="bg-[#4fc3f7] text-[#0a1628] px-3 py-1 rounded text-sm font-medium flex-1">
          {author.name}
        </span>
        <span className="text-white text-sm">{author.rating}</span>
      </div>
    ))}
  </div>
);

// Componente de Mapa Mundi Simplificado
const WorldMap = ({ countries }) => (
  <div className="relative w-full h-48 flex items-center justify-center">
    <svg viewBox="0 0 800 400" className="w-full h-full opacity-30">
      {/* Continentes simplificados */}
      {/* América do Norte */}
      <path d="M50,80 Q100,60 150,70 L180,120 Q160,180 100,200 L60,160 Z" fill="#4fc3f7" />
      {/* América do Sul */}
      <path d="M120,220 Q160,210 180,250 L170,350 Q130,380 100,340 L90,280 Z" fill="#4fc3f7" />
      {/* Europa */}
      <path d="M350,60 Q420,50 450,80 L460,130 Q420,150 360,140 L340,100 Z" fill="#4fc3f7" />
      {/* África */}
      <path d="M360,160 Q420,150 460,180 L470,300 Q420,340 370,320 L350,240 Z" fill="#4fc3f7" />
      {/* Ásia */}
      <path d="M480,40 Q600,30 700,80 L720,180 Q650,220 520,200 L460,120 Z" fill="#4fc3f7" />
      {/* Oceania */}
      <path d="M620,280 Q680,260 720,290 L710,340 Q660,360 620,340 Z" fill="#4fc3f7" />
    </svg>
    {/* Marcadores de países */}
    {countries.map((country, index) => (
      <div
        key={index}
        className="absolute flex flex-col items-center"
        style={{ left: country.x, top: country.y }}
      >
        <div className="w-3 h-3 bg-[#4fc3f7] rounded-full animate-pulse" />
        <span className="text-white text-xs mt-1 whitespace-nowrap">{country.name}</span>
      </div>
    ))}
  </div>
);

function Dashboard() {
  // Dados mockados
  const estatisticasAno = {
    livrosLidos: 125,
    meta: 150
  };

  const interessesPendentes = {
    livrosNaoLidos: 87,
    tipo: 'Lista de Desejos'
  };

  const nivelSatisfacao = 85;

  const comparativoMensal = [
    { label: 'Mês Passado', value: 18 },
    { label: 'Este Mês', value: 25 }
  ];

  const topAutores = [
    { name: 'Isaac Asimov', rating: 4.9 },
    { name: 'Neil Gaiman', rating: 4.9 },
    { name: 'Neil Gaiman', rating: 4.5 },
    { name: 'Agatha Christie', rating: 4.5 },
    { name: 'Jane Austen', rating: 4.5 },
    { name: 'Gabriel Garcia Marquez', rating: 4.1 }
  ];

  const generosMaisLidos = [
    { label: 'Científica', value: 4.8 },
    { label: 'Biografia', value: 4.2 },
    { label: 'Fantasia', value: 4.0 },
    { label: 'Poesia', value: 3.9 }
  ];

  const generosBemAvaliados = [
    { label: 'Ficção Científica', value: 5.0 },
    { label: 'Fantasia', value: 4.0 },
    { label: 'Fantasia', value: 4.1 },
    { label: 'Mistério', value: 4.1 },
    { label: 'Poesia', value: 3.1 }
  ];

  const paisesDestaque = [
    { name: 'Reino Unido', x: '38%', y: '25%' },
    { name: 'França', x: '42%', y: '35%' },
    { name: 'Brasil', x: '28%', y: '60%' },
    { name: 'EUA', x: '18%', y: '30%' }
  ];

  return (
    <div className="min-h-screen bg-[#0d1b2a] p-6 -m-10 animate-in fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Linha 1: Stats cards principais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Estatísticas do Ano */}
          <Card>
            <h3 className="text-white text-center text-lg font-semibold uppercase tracking-wider mb-4">
              Estatísticas do Ano
            </h3>
            <div className="text-center">
              <span className="text-6xl font-bold text-[#4fc3f7]">{estatisticasAno.livrosLidos}</span>
              <span className="text-white text-xl ml-2">LIVROS</span>
            </div>
            <p className="text-white text-center mt-2 uppercase tracking-wide">Lidos Este Ano</p>
            <p className="text-[#4fc3f7] text-center mt-1 uppercase tracking-wide">
              Meta: {estatisticasAno.meta} Livros
            </p>
          </Card>

          {/* Interesses Pendentes */}
          <Card>
            <h3 className="text-white text-center text-lg font-semibold uppercase tracking-wider mb-4">
              Interesses Pendentes
            </h3>
            <div className="text-center">
              <span className="text-6xl font-bold text-[#4fc3f7]">{interessesPendentes.livrosNaoLidos}</span>
              <span className="text-white text-xl ml-2">LIVROS</span>
            </div>
            <p className="text-white text-center mt-2 uppercase tracking-wide">Não Lidos</p>
            <p className="text-[#4fc3f7] text-center mt-1 uppercase tracking-wide">
              {interessesPendentes.tipo}
            </p>
          </Card>

          {/* Nível de Satisfação */}
          <Card>
            <h3 className="text-white text-center text-lg font-semibold uppercase tracking-wider mb-4">
              Nível de Satisfação
            </h3>
            <div className="flex justify-center">
              <DonutChart percentage={nivelSatisfacao} />
            </div>
            <p className="text-white text-center mt-4 uppercase tracking-wide">Muito Satisfeito</p>
          </Card>
        </div>

        {/* Linha 2: Gráficos médios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Comparativo Mensal */}
          <Card>
            <h3 className="text-white text-center text-sm font-semibold uppercase tracking-wider mb-4">
              Livros Lidos: Este Mês vs Mês Passado
            </h3>
            <BarChart data={comparativoMensal} />
          </Card>

          {/* Top 5 Autores */}
          <Card>
            <h3 className="text-white text-center text-sm font-semibold uppercase tracking-wider mb-4">
              Top 5 Autores (Avaliações)
            </h3>
            <AuthorList authors={topAutores} />
          </Card>

          {/* Gêneros Mais Lidos */}
          <Card>
            <h3 className="text-white text-center text-sm font-semibold uppercase tracking-wider mb-4">
              Gêneros Mais Lidos
            </h3>
            <div className="space-y-1">
              {generosMaisLidos.map((genero, index) => (
                <HorizontalBar key={index} label={genero.label} value={genero.value} />
              ))}
            </div>
          </Card>
        </div>

        {/* Linha 3: Mapa e mais gêneros */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Países de Origem */}
          <Card className="md:col-span-1">
            <h3 className="text-white text-center text-sm font-semibold uppercase tracking-wider mb-4">
              Países de Origem (Maior Interesse)
            </h3>
            <WorldMap countries={paisesDestaque} />
          </Card>

          {/* Gêneros Mais Bem Avaliados */}
          <Card className="md:col-span-1">
            <h3 className="text-white text-center text-sm font-semibold uppercase tracking-wider mb-4">
              Gêneros Mais Bem Avaliados
            </h3>
            <div className="space-y-1">
              {generosBemAvaliados.map((genero, index) => (
                <HorizontalBar key={index} label={genero.label} value={genero.value} />
              ))}
            </div>
          </Card>
        </div>

        {/* Paginação */}
        <div className="flex justify-center items-center mt-6 gap-4">
          <button className="text-white hover:text-[#4fc3f7] transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-white text-sm">9 / 11</span>
          <button className="text-white hover:text-[#4fc3f7] transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
