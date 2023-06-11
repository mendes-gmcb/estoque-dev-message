import { useState, useEffect } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { MdShoppingCart, MdLocalMall } from 'react-icons/md';

type MessageType = {
    id: number,
    title: string,
    content: string,
    publiched: boolean,
    likesAmount: number,
}

const Mensagem = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    // Exemplo de requisição GET utilizando fetch:
    fetch('http://localhost:3333/message')
      .then((response) => response.json())
      .then((data) => setMessages(data))
      .catch((error) => {
        alert(error);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Exemplo de requisição POST utilizando fetch:
    const newMessage = await fetch('http://localhost:3333/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content }),
    })
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        alert(error);
      });

    setMessages((prevMessage) => [...prevMessage, newMessage]); // cria uma cópia
    setTitle('');
    setContent('');
  };

  const handleRemoveMessage = async (id: number) => {
    // Exemplo de requisição DELETE utilizando fetch:
    await fetch(`http://localhost:3333/message/${id}`, {
      method: 'DELETE',
    });

    setMessages((prevMessageList) =>
      prevMessageList.filter((message) => message.id !== id)
    );
  };

  const handleLike = async (id: number) => {
    const message = messages.find((message) => message.id === id);
    if (!message || message.likesAmount === 0) {
        return alert('não é possível colocar a quantidade de likes em valor negativo');
    }

    const likesAmount = await fetch(`http://localhost:3333/message/${id}/add-like`, 
    {
        method: 'PATCH'
    })
    .then((response) => {
        return response.json();
      })
      .catch((error) => {
        alert(error);
      });

    const index = messages.findIndex((message) => message.id === id);
    if (true) {
        setMessages((prevMessageList) => {
          const newMessageList = [...prevMessageList];
          newMessageList[index].likesAmount = likesAmount;
          return newMessageList;
        });
    }

}   

  const handleBuyMessage = async (id: number) => {
    const quantity = Number(prompt('Informe a quantidade da compra'));
    const price = Number(prompt('Informe o valor da compra'));
    const buyData = {
      id,
      quantity,
      price,
    };

    // Exemplo de requisição PATCH utilizando fetch:
    const newMessage = await fetch(`http://localhost:3333/message/compra`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(buyData),
    })
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        alert(error);
      });

    const index = messages.findIndex((message) => message.id === newMessage.id);
    if (index !== -1) {
      setMessages((prevMessageList) => {
        const newMessageList = [...prevMessageList];
        newMessageList[index] = newMessage;
        return newMessageList;
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      <div className="max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-4">
          <div>
            <label htmlFor="title" className="block font-semibold">
              Título:
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="content" className="block font-semibold">
              Conteúdo:
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Adicionar Mensagem
          </button>
        </form>

        <div>
          <table className="w-full border border-gray-300">
            <thead>
              <tr>
                <th className="border-b border-gray-300 py-2 px-4">Nome</th>
                <th className="border-b border-gray-300 py-2 px-4">Descrição</th>
                <th className="border-b border-gray-300 py-2 px-4">Quantidade</th>
                <th className="border-b border-gray-300 py-2 px-4">Preço</th>
                <th className="border-b border-gray-300 py-2 px-4">Remover</th>
                <th className="border-b border-gray-300 py-2 px-4">Compra</th>
                <th className="border-b border-gray-300 py-2 px-4">Venda</th>
              </tr>
            </thead>
            <tbody>
              {/* percorre a lista de mensagens */}
              {messages.map((message) => (
                <tr key={message.id}>
                  <td className="border-b border-gray-300 py-2 px-4">
                    {message.title}
                  </td>
                  <td className="border-b border-gray-300 py-2 px-4">
                    {message.content}
                  </td>
                  <td className="border-b border-gray-300 py-2 px-4">
                    {message.likesAmount}
                  </td>
                  <td className="border-b border-gray-300 py-2 px-4">
                    {message.publiched}
                  </td>
                  <td className="border-b border-gray-300 py-2 px-4">
                    <button
                      onClick={() => handleRemoveMessage(message.id)}
                      className="flex items-center justify-center p-2 text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </td>
                  <td className="border-b border-gray-300 py-2 px-4">
                    <button
                      onClick={() => handleLike(message.id)}
                      className="flex items-center justify-center p-2 text-green-500 hover:text-green-700"
                    >
                      <MdShoppingCart size={20} />
                    </button>
                  </td>
                  <td className="border-b border-gray-300 py-2 px-4">
                    <button className="flex items-center justify-center p-2 text-green-500 hover:text-green-700">
                      <MdLocalMall size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Mensagem;
