import React, { useState, useEffect } from 'react';

const Products = () => {
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);
  const [formData, setFormData] = useState({
    nomeProduto: '',
    ncm: '',
    unidade: '',
    valorUnitario: '',
    categoria: '',
    descricao: ''
  });

  // Load products from Google Sheets
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5002/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error('Error loading products:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.nomeProduto || !formData.ncm || !formData.unidade || !formData.valorUnitario) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const url = editingProductId 
        ? `http://localhost:5002/api/products/${editingProductId}`
        : 'http://localhost:5002/api/products';
      
      const response = await fetch(url, {
        method: editingProductId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      const result = await response.json();
      
      if (result.success) {
        alert(editingProductId ? 'Produto atualizado com sucesso!' : 'Produto cadastrado com sucesso!');
        setFormData({
          nomeProduto: '',
          ncm: '',
          unidade: '',
          valorUnitario: '',
          categoria: '',
          descricao: ''
        });
        setShowForm(false);
        setEditingProductId(null);
        loadProducts(); // Reload products list
      } else {
        alert(result.message || (editingProductId ? 'Erro ao atualizar produto' : 'Erro ao cadastrar produto'));
      }
    } catch (err) {
      console.error('Error creating product:', err);
      alert('Erro ao cadastrar produto: ' + err.message);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5002/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      const result = await response.json();
      
      if (result.success) {
        alert('Produto excluído com sucesso!');
        loadProducts(); // Reload products list
      } else {
        alert(result.message || 'Erro ao excluir produto');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Erro ao excluir produto: ' + err.message);
    }
  };

  const formatCurrency = (value) => {
    if (!value) return 'R$ 0,00';
    const numValue = parseFloat(value);
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numValue);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        <h3 className="font-bold">Erro ao carregar produtos</h3>
        <p>{error}</p>
        <button 
          onClick={loadProducts}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Cadastro de Produtos</h2>
        <button
          onClick={() => {
            setEditingProductId(null);
            setFormData({
              nomeProduto: '',
              ncm: '',
              unidade: '',
              valorUnitario: '',
              categoria: '',
              descricao: ''
            });
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Novo Produto
        </button>
      </div>

      {showForm && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">{editingProductId ? 'Editar Produto' : 'Novo Produto'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  name="nomeProduto"
                  value={formData.nomeProduto}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Nome do produto"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  NCM *
                </label>
                <input
                  type="text"
                  name="ncm"
                  value={formData.ncm}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Código NCM"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Unidade *
                </label>
                <select
                  name="unidade"
                  value={formData.unidade}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecione uma unidade</option>
                  <option value="UN">Unidade (UN)</option>
                  <option value="M2">Metro Quadrado (M²)</option>
                  <option value="M">Metro (M)</option>
                  <option value="KG">Quilograma (KG)</option>
                  <option value="PC">Peça (PC)</option>
                  <option value="CX">Caixa (CX)</option>
                  <option value="L">Litro (L)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Valor Unitário *
                </label>
                <input
                  type="number"
                  name="valorUnitario"
                  value={formData.valorUnitario}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Categoria
                </label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="Isotelha">Isotelha</option>
                  <option value="Colonial">Colonial</option>
                  <option value="Telha Simples">Telha Simples</option>
                  <option value="Telhas EPS">Telhas EPS</option>
                  <option value="Acessórios">Acessórios</option>
                  <option value="BenchMark">BenchMark</option>
                  <option value="Isolamentos">Isolamentos</option>
                  <option value="Coberturas">Coberturas</option>
                  <option value="Painéis">Painéis</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Descrição
                </label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Descrição do produto"
                ></textarea>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome do Produto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                NCM
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unidade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor Unitário
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoria
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  Nenhum produto cadastrado
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.nomeProduto}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.ncm}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.unidade}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(product.valorUnitario)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.categoria || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-4">
                    <button 
                      onClick={() => {
                        setFormData({
                          nomeProduto: product.nomeProduto,
                          ncm: product.ncm,
                          unidade: product.unidade,
                          valorUnitario: product.valorUnitario,
                          categoria: product.categoria || '',
                          descricao: product.descricao || ''
                        });
                        setEditingProductId(product.id);
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
