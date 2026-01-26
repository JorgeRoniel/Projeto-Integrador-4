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

// ==================== LIVROS ====================

/**
 * Lista livros para a home page
 * @param {number} [page=0] - Número da página
 * @param {number} [size=12] - Tamanho da página
 * @returns {Promise<Object>}
 */
export async function listBooks(page = 0, size = 12) {
  return fetchAPI(`/api/book?page=${page}&size=${size}`, {
    method: "GET",
  });
}

/**
 * Busca um livro pelo ID
 * @param {number} bookId - ID do livro
 * @returns {Promise<Object>}
 */
export async function getBook(bookId) {
  return fetchAPI(`/api/book/${bookId}`, {
    method: "GET",
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
export async function rateBook(bookId, userId, nota) {
  return fetchAPI(`/api/book/${bookId}/rating`, {
    method: "POST",
    body: JSON.stringify({ user_id: userId, nota, comentario: "" }),
  });
}

/**
 * Lista avaliações de um livro
 * @param {number} bookId - ID do livro
 * @returns {Promise<Array>}
 */
export async function getBookRatings(bookId) {
  return fetchAPI(`/api/book/${bookId}/rating`, {
    method: "GET",
  });
}

/**
 * Lista livros avaliados por um usuário
 * @param {number} userId - ID do usuário
 * @returns {Promise<Array>}
 */
export async function getUserRatings(userId) {
  return fetchAPI(`/api/user/ratings/${userId}`, {
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
 * Lista a wishlist de um usuário
 * @param {number} userId - ID do usuário
 * @returns {Promise<Array>}
 */
export async function getUserWishlist(userId) {
  return fetchAPI(`/api/user/${userId}/wishlist`, {
    method: "GET",
  });
}

export default {
  login,
  register,
  updateUser,
  deleteUser,
  listBooks,
  getBook,
  rateBook,
  getBookRatings,
  getUserRatings,
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
};
