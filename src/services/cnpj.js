const CNPJ_API_URL = 'https://brasilapi.com.br/api/cnpj/v1/';

export async function consultarCNPJ(cnpj) {
  try {
    const cleanCNPJ = cnpj.replace(/\D/g, '');
    const response = await fetch(`${CNPJ_API_URL}${cleanCNPJ}`);

    if (!response.ok) {
      throw new Error('Erro ao consultar CNPJ');
    }

    const data = await response.json();

    return {
      nome: data.razao_social,
      logradouro: data.logradouro,
      numero: data.numero,
      complemento: data.complemento,
      bairro: data.bairro,
      cidade: data.municipio,
      estado: data.uf,
      cep: data.cep ? data.cep.replace(/\D/g, '') : '',
      telefone: data.ddd_telefone_1 ? data.ddd_telefone_1.replace(/\D/g, '') : '',
      email: data.email
    };
  } catch (error) {
    console.error('Erro ao consultar CNPJ:', error);
    throw new Error('Erro ao buscar dados do CNPJ. Verifique se o CNPJ é válido.');
  }
}

export function validarCPFCNPJ(documento, tipo) {
  const cleanDoc = documento.replace(/\D/g, '');
  
  if (tipo === 'Pessoa Física' && cleanDoc.length === 11) {
    return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(
      cleanDoc
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    );
  } 
  
  if (tipo === 'Pessoa Jurídica' && cleanDoc.length === 14) {
    return /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(
      cleanDoc
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
    );
  }
  
  return false;
}
