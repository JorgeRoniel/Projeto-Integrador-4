import React, { useState, useEffect } from 'react';
import { getDashboardData } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

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
      <span className="text-white text-sm w-32 uppercase tracking-wide truncate">{label}</span>
      <div className="flex-1 bg-[#1e3a5f] rounded-full h-4 overflow-hidden">
        <div
          className="bg-[#4fc3f7] h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      {showValue && <span className="text-[#4fc3f7] text-sm w-10">({Number(value).toFixed(1)})</span>}
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
        <span className="text-4xl font-bold text-[#4fc3f7]">{Math.round(percentage)}%</span>
      </div>
    </div>
  );
};

// Componente de Gráfico de Barras Vertical
const BarChart = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);

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
    {authors.length === 0 && <p className="text-gray-500 text-center py-4">Nenhum autor avaliado</p>}
    {authors.map((author, index) => (
      <div key={index} className="flex items-center gap-3">
        <span className="text-white text-sm">{index + 1}.</span>
        <span className="bg-[#4fc3f7] text-[#0a1628] px-3 py-1 rounded text-sm font-medium flex-1 truncate">
          {author.name || author.author}
        </span>
        <span className="text-white text-sm">{(author.rating || author.averageRating || 0).toFixed(1)}</span>
      </div>
    ))}
  </div>
);



function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (!user?.id) return;

      try {
        setLoading(true);
        const response = await getDashboardData(user.id);
        setData(response);
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
        toast.error("Não foi possível carregar as estatísticas.");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-[#4fc3f7] mb-4" size={48} />
        <p className="text-[#4fc3f7] font-medium">Carregando estatísticas...</p>
      </div>
    );
  }

  // Se não carregou nada
  if (!data) return null;

  // Mapeamento dos dados da API para o formato do Dashboard
  const estatisticasAno = {
    livrosLidos: data.booksReadThisYear || 0,
    meta: 50 // Meta fixa ou vinda do perfil (pode ser mock por enquanto)
  };

  const interessesPendentes = {
    livrosNaoLidos: data.wishlistCount || 0,
    tipo: 'Lista de Desejos'
  };

  const nivelSatisfacao = data.satisfactionPercentage || 0;

  const comparativoMensal = [
    { label: 'Mês Passado', value: data.booksReadLastMonth || 0 },
    { label: 'Este Mês', value: data.booksReadThisMonth || 0 }
  ];

  // Top 5 Autores vindo do DTO TopAuthorDTO(author, averageRating)
  const topAutores = (data.topAuthors || []).slice(0, 6);

  // Top categorias melhor avaliadas
  const generosBemAvaliados = (data.topRatedCategories || []).map(cat => ({
    label: cat.category,
    value: cat.averageRating || 0
  }));

  // Generos mais lidos
  const generosMaisLidos = (data.mostReadCategories || []).map(cat => ({
    label: cat.category,
    value: cat.count || 0
  }));



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

        {/* Linha 3: Gêneros Mais Bem Avaliados (Full Width) */}
        <div className="grid grid-cols-1 gap-6">
          <Card>
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


      </div>
    </div>
  );
}

export default Dashboard;
