// Para configurar o Formspree:
// 1. Acesse https://formspree.io/
// 2. Clique em "Get Started" e crie uma conta
// 3. Após fazer login, clique em "New Form"
// 4. Dê um nome para seu formulário (ex: "Catálogo Venus")
// 5. Copie o ID do formulário que aparece na URL (será algo como "xrgkpozv")
// 6. Substitua 'seu-form-id' abaixo pelo ID copiado

export const submitEmail = async (email) => {
  try {
    // Substitua 'seu-form-id' pelo ID do seu formulário do Formspree
    // Exemplo: se sua URL é https://formspree.io/f/xrgkpozv
    // Você deve substituir 'seu-form-id' por 'xrgkpozv'
    const response = await fetch('https://formspree.io/f/mnndnbnr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email,
        subject: 'Novo download do catálogo',
        message: `Cliente ${email} baixou o catálogo.`
      }),
    });

    if (!response.ok) {
      throw new Error('Falha ao enviar e-mail');
    }

    return true;
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    throw error;
  }
};
