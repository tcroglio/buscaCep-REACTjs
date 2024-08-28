import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import './styles.css';
import api from './services/api';


function App() {

  const [input, setInput] = useState('');
  const [cep, setCep] = useState('');

  // Função para remover os caracteres especiais e letras
  function limpaStr(str) {
    return str.replace(/[^0-9]/g, '');
  }

  // EventListenner para fazer a busca ao clicar "ENTER" com o input selecionado
  function ativaBusca(event) {
    if (event.key === 'Enter') { // Verifica se a tecla clicada foi o Enter
      event.preventDefault();
      enviaBusca();
    }
  }

  // Função que realiza a busca na API.
  // Ela é asíncrona pois esta busca pode demorar
  // dependendo da estabilidade dos servidores da API.
  async function enviaBusca() {
    const cepLimpo = limpaStr(input); // Limpa os caracteres especiais antes de realizar a busca para evitar erros

    if (cepLimpo === '') {
      alert('Por favor, preencha algum CEP no campo para realizar a busca.'); // não faz a busca caso o usuário não tenha informado o CEP
      return;
    }

    try {
      const response = await api.get(`${cepLimpo}/json`); // Faz a requisição await para o objeto "api", criado em ./src/services/api.js
      const data = response.data; // Instancia o retorno para que seja possível verificar 
      
      if (data.erro == 'true') { // Verifica se houve erro no retorno
        alert("Este CEP não existe ou não pode ser encontrado");
        return
      } else {
        setCep(data); // Envia para o objeto "CEP" o retorno da API (data) que já foi filtrada e não possui erros
        setInput(''); // Limpa o Input
        
      }

    } catch {  // Ocorreu algum erro na requisição da API que não foi tratado
      alert('Houve algum erro. Este CEP não existe ou não pode ser encontrado');

    }
  }
  

  // Retorno do FrontEnd, isso aparecerá para o usuário  
  return (
    <div className="searchContainer">
      <h1>BUSCA DE CEP</h1>

      <div className="inputContainer">
        <input type="text" placeholder="Digite seu cep..."
          value={input}
          onKeyDown={ativaBusca}
          onChange={(digitado) => setInput(digitado.target.value)}
          maxLength={9}
        />

        <button className='searchButton' onClick={enviaBusca}>
          <FiSearch size={25} color='white' />
        </button>
      </div>

      {/* Verifica se o objeto "CEP" foi preenchido.
          Ele só será preenchido caso tenha dado tudo
          certo com a busca na API e ela tenha
          retornado um valor válido. */}
      {Object.keys(cep).length > 0 && (
        <main className='main'>
          <h2>CEP: {cep.cep}</h2>
          <span>{cep.logradouro}</span>
          <span>Complemento: {cep.complemento}</span>
          <span>{cep.bairro}</span>
          <span>{cep.localidade} - {cep.uf}</span>
        </main>
      )}
    </div>
  );
}

export default App;