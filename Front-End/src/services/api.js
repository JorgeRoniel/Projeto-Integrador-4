// URL base da API - pode ser configurada via variável de ambiente
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Função auxiliar para fazer requisições
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  // Adiciona token de autenticação se existir
  const token = localStorage.getItem("token");
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("library_user");
      
      // Criamos um evento customizado para o App perceber o logout
      window.dispatchEvent(new Event("auth-expired"));
      
      // Redireciona com um parâmetro para avisar o Login
      window.location.href = "/login?expired=true";
      return;
    }

    // Se a resposta não tiver conteúdo (204 No Content ou 201 Created sem body)
    if (response.status === 204 || response.status === 201) {
      return { success: true, status: response.status };
    }

    // Tenta parsear como JSON
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw {
        status: response.status,
        message: data?.message || "Erro na requisição",
        data,
      };
    }

    return data;
  } catch (error) {
    // Re-throw se já é um erro tratado
    if (error.status) {
      throw error;
    }
    // Erro de rede ou outro erro
    throw {
      status: 0,
      message: "Erro de conexão com o servidor",
      originalError: error,
    };
  }
}

// ==================== AUTENTICAÇÃO ====================

/**
 * Realiza login do usuário
 * @param {string} email - Email do usuário
 * @param {string} senha - Senha do usuário
 * @returns {Promise<{token, user_id, username, nome, email, foto, telefone, role}>}
 */
export async function login(email, senha) {
  return fetchAPI("/api/user/login", {
    method: "POST",
    body: JSON.stringify({ email, senha }),
  });
}

/**
 * Solicita o link de recuperação de senha
 * @param {string} email - Email do usuário
 * @returns {Promise<{success: boolean}>}
 */
export async function recoverPassword(email) {
  return fetchAPI("/api/user/recover-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

/**
 * Define uma nova senha para o usuário
 * @param {string} token - Token vindo da URL do e-mail
 * @param {string} senha - Nova senha digitada
 * @returns {Promise<{success: boolean}>}
 */
export async function resetPasswordFinal(token, senha) {
  return fetchAPI("/api/user/reset-password-final", {
    method: "PUT",
    body: JSON.stringify({ token, senha }),
  });
}

/**
 * Realiza cadastro de novo usuário
 * @param {Object} dados - Dados do usuário
 * @param {string} dados.username - Nome de usuário
 * @param {string} dados.nome - Nome completo
 * @param {string} dados.email - Email
 * @param {string} dados.senha - Senha
 * @param {string} dados.telefone - Telefone
 * @param {string} [dados.role="USER"] - Tipo de usuário (USER ou ADMIN)
 * @returns {Promise<{success: boolean}>}
 */
export async function register(dados) {
  return fetchAPI("/api/user/register", {
    method: "POST",
    body: JSON.stringify({
      username: dados.username,
      nome: dados.nome,
      email: dados.email,
      senha: dados.senha,
      telefone: dados.telefone,
      role: dados.role || "USER",
    }),
  });
}

/**
 * Atualiza dados do usuário
 * @param {number} userId - ID do usuário
 * @param {Object} dados - Dados a serem atualizados
 * @returns {Promise<{success: boolean}>}
 */
export async function updateUser(userId, dados) {
  return fetchAPI(`/api/user/${userId}/update`, {
    method: "PUT",
    body: JSON.stringify(dados),
  });
}

/**
 * Deleta um usuário
 * @param {number} userId - ID do usuário
 * @returns {Promise<{success: boolean}>}
 */
export async function deleteUser(userId) {
  return fetchAPI(`/api/user/${userId}/delete`, {
    method: "DELETE",
  });
}

// ==================== ADMIN ====================

/**
 * Lista usernames dos administradores
 * @returns {Promise<Array<string>>}
 */
export async function getAdminUsernames() {
  return fetchAPI("/api/user/admin/usernames", {
    method: "GET",
  });
}

/**
 * Atualiza a role de um usuário pelo username (ADMIN ou USER)
 * @param {string} username
 * @param {"ADMIN" | "USER"} role
 * @returns {Promise<{success: boolean}>}
 */
export async function updateUserRole(username, role) {
  return fetchAPI(`/api/user/role/${username}`, {
    method: "PUT",
    body: JSON.stringify({ role }),
  });
}

// ==================== LIVROS ====================

/**
 * Busca dados de um livro via ISBN através do nosso backend (que consulta o Google)
 * @param {string} isbn - O código ISBN do livro
 * @returns {Promise<Object>} - Dados do livro mapeados pelo DTO do Backend
 */
export async function getBookDetailsByIsbn(isbn) {
  return fetchAPI(`/api/book/external/isbn?isbn=${isbn}`, {
    method: "GET",
  });
}

/**
 * Lista livros para a home page
 * @param {number} [page=0] - Número da página
 * @param {number} [size=12] - Tamanho da página
 * @returns {Promise<Object>}
 */
export async function listBooks(search = "", page = 0, size = 20) {
  const searchQuery = search ? `&search=${encodeURIComponent(search)}` : "";
  return fetchAPI(`/api/book?page=${page}&size=${size}${searchQuery}`, { 
    method: "GET" 
  });
}

/**
 * Busca um livro pelo ID
 * @param {number} bookId - ID do livro
 * @param {number} userId - ID do usuário
 * @returns {Promise<Object>}
 */
export async function getBook(bookId, userId) {
  const url = userId ? `/api/book/${bookId}?userId=${userId}` : `/api/book/${bookId}`;
  return fetchAPI(url, { method: "GET" });
}

// Busca os destaques da semana (Lista fixa)
export async function getWeeklyHighlights() {
  return fetchAPI("/api/book/highlights", { method: "GET" });
}

/**
 * Lista avaliações de um livro de forma paginada
 * @param {number} userId - ID do usuário
 * @param {number} [page=0] - Página atual
 * @param {number} [size=5] - Quantidade por página
 * @returns {Promise<Object>} - Retorna o objeto Page do Spring
 */
export async function getRecommendations(userId, page = 0, size = 5) {
  return fetchAPI(`/api/book/recommendations/${userId}?page=${page}&size=${size}`, { 
    method: "GET" 
  });
}

/**
 * Busca livros relacionados baseados no autor e categorias do livro atual
 * @param {number} bookId - ID do livro de referência
 * @returns {Promise<Array>} - Lista de livros relacionados
 */
export async function getRelatedBooks(bookId) {
  return fetchAPI(`/api/book/${bookId}/related`, {
    method: "GET",
  });
}

export async function deleteBook(bookId) {
  return fetchAPI(`/api/book/${bookId}/delete`, { method: "DELETE" });
}

export async function updateBook(bookId, bookData) {
  return fetchAPI(`/api/book/${bookId}/update`, { 
    method: "PUT", 
    body: JSON.stringify(bookData) 
  });
}

/**
 * Adiciona um novo livro (somente admin)
 * @param {Object} bookData - Dados do livro
 * @param {string} bookData.titulo - Título do livro
 * @param {string} bookData.autor - Autor do livro
 * @param {string} [bookData.editora] - Editora
 * @param {number} [bookData.ano] - Ano de publicação
 * @param {string} bookData.categoria - Categoria do livro
 * @param {string} [bookData.descricao] - Descrição/sinopse
 * @param {string} [bookData.imagemUrl] - URL da imagem da capa
 * @param {string} [bookData.isbn] - ISBN
 * @param {number} [bookData.paginas] - Número de páginas
 * @returns {Promise<{success: boolean}>}
 */
export async function addBook(bookData) {
  return fetchAPI("/api/book", {
    method: "POST",
    body: JSON.stringify(bookData),
  });
}

// ==================== AVALIAÇÕES ====================

/**
 * Avalia um livro
 * @param {number} bookId - ID do livro
 * @param {number} userId - ID do usuário
 * @param {number} nota - Nota de 0 a 5
 * @returns {Promise<{success: boolean}>}
 */
export async function rateBook(bookId, userId, nota, comentario = "") {
  return fetchAPI(`/api/book/${bookId}/rating`, {
    method: "POST",
    body: JSON.stringify({ user_id: userId, nota, comentario }),
  });
}

/**
 * Lista avaliações de um livro de forma paginada
 * @param {number} bookId - ID do livro
 * @param {number} [page=0] - Página atual
 * @param {number} [size=10] - Quantidade por página
 * @returns {Promise<Object>} - Retorna o objeto Page do Spring
 */
export async function getBookRatings(bookId, page = 0, size = 10) {
  return fetchAPI(`/api/book/${bookId}/rating?page=${page}&size=${size}`, {
    method: "GET",
  });
}

/**
 * Lista livros avaliados por um usuário de forma paginada
 * @param {number} userId - ID do usuário
 * @param {boolean} apenasValidas - Se true, ignora notas -1
 * @param {number} page - Página atual
 * @param {number} size - Quantidade por página
 * @returns {Promise<Object>} - Retorna o objeto Page do Spring
 */
export async function getUserRatings(userId, apenasValidas = false, page = 0, size = 20, sort = "book.title,asc", search = "") {
  const queryParams = new URLSearchParams({
    apenasValidas: apenasValidas,
    page: page,
    size: size,
    sort: sort,
    search: search
  }).toString();

  return fetchAPI(`/api/user/ratings/${userId}?${queryParams}`, {
    method: "GET",
  });
}
// ==================== WISHLIST ====================

/**
 * Adiciona livro à lista de desejos
 * @param {number} userId - ID do usuário
 * @param {number} bookId - ID do livro
 * @returns {Promise<{success: boolean}>}
 */
export async function addToWishlist(userId, bookId) {
  return fetchAPI("/api/wishlist", {
    method: "POST",
    body: JSON.stringify({ user_id: userId, book_id: bookId }),
  });
}

/**
 * Remove livro da lista de desejos
 * @param {number} userId - ID do usuário
 * @param {number} bookId - ID do livro
 * @returns {Promise<{success: boolean}>}
 */
export async function removeFromWishlist(userId, bookId) {
  return fetchAPI("/api/wishlist", {
    method: "DELETE",
    body: JSON.stringify({ user_id: userId, book_id: bookId }),
  });
}

/**
 * Busca estatísticas para o dashboard para um usuário específico
 * @param {number} userId - ID do usuário
 * @returns {Promise<Object>}
 */
export async function getDashboardData(userId) {
  return fetchAPI(`/api/dashboard/user/${userId}`, {
    method: "GET",
  });
}

/**
 * Lista a wishlist de um usuário de forma paginada
 * @param {number} userId - ID do usuário
 * @param {number} page - Página atual
 * @param {number} size - Quantidade por página
 * @returns {Promise<Object>} - Retorna o objeto Page do Spring
 */
export async function getUserWishlist(userId, page = 0, size = 20, search = "") {
  const queryParams = new URLSearchParams({
    page: page,
    size: size,
    sort: "book.title,asc",
    search: search
  }).toString();

  return fetchAPI(`/api/user/${userId}/wishlist?${queryParams}`, {
    method: "GET",
  });
}

// ==================== NOTIFICAÇÕES ====================

/**
 * Busca notificações de livros da wishlist que já foram adquiridos
 * @param {number} userId - ID do usuário
 * @returns {Promise<Array<{bookId: number, title: string}>>}
 */
export async function checkNotifications(userId) {
  return fetchAPI(`/api/wishlist/check/${userId}`, {
    method: "GET",
  });
}

/**
 * Atualiza o status de notificação de um item da wishlist
 * @param {Object} data - { user_id, book_id, notification }
 */
export async function updateNotificationStatus(data) {
  return fetchAPI("/api/wishlist/notification", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export default {
  login,
  register,
  updateUser,
  deleteUser,
  listBooks,
  getBook,
  addBook,
  rateBook,
  getBookRatings,
  getUserRatings,
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
  getDashboardData,
  getAdminUsernames,
  updateUserRole,
  checkNotifications,
  updateNotificationStatus,
  recoverPassword,
  resetPasswordFinal,
  getWeeklyHighlights,
  getRecommendations,
  getRelatedBooks,
  deleteBook
};
