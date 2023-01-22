import { Plus, X } from 'phosphor-react';
import * as Dialog from '@radix-ui/react-dialog';

import logoImage from '../assets/logo.svg'
import { NewHabitForm } from './NewHabitForm';

export function Header() {
    // No HTML/JS, usa programação imperativa, onde indica para o sistema cada passo que precisa executar para chegar no resultado esperado
    // No React, usa programação declarativa, onde cria uma condição e reage a esta condição
    // Cria a informação isModalOpen, verifica a informação e isere o modal em tela caso a condição seja verdadeira

    // Estado são variáveis monitoradas pelo React, ou seja, toda vez que um estado mudar o seu valor, o React vai recalcular o HTML

    /*
    const [isModalOpen, setIsModalOpen] = useState(false)
    // O useState retorna duas informações no formato de array com duas posições, uma variável em cada posição
    // A primeira informação é o valor da variável, a segunda é uma função para atualizar o valor dessa variável

    function buttonClicked() {
        setIsModalOpen(true);
        // Ao invés de modificar diretamente o valor da variável, chamar a função de atualização
    }

    // O Radix controla automaticamente o estado de aberto ou fechado
    */

    return (
        <div className="w-full max-w-3xl mx-auto flex items-center justify-between">
            <img src={logoImage} alt="Habits" />

            <Dialog.Root>
                <Dialog.Trigger 
                    type="button"
                    className="border border-violet-500 font-semibold rounded-lg px-6 py-4 flex items-center gap-3 hover:border-violet-300"
                >
                    <Plus size={20} className="text-violet-500" />
                    Novo hábito
                </Dialog.Trigger>

                <Dialog.Portal>
                    <Dialog.Overlay className="w-screen h-screen bg-black/80 fixed inset-0" />

                    <Dialog.Content className="absolute p-10 bg-zinc-900 rounded-2xl w-full max-w-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Dialog.Close className="absolute right-6 top-6 text-zinc-400 hover:text-zinc-200" >
                            <X size={24} aria-label="Fechar" />
                        </Dialog.Close>
                        
                        <Dialog.Title className="text-3xl leading-tight font-extrabold">
                            Criar hábito
                        </Dialog.Title>

                        <NewHabitForm />
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
        /* <Dialog.Portal> é uma feature do React que permite mostrar HTML em outro lugar da aplicação e não dentro do Header, jogando o conteúdo do modal para fora da aplicação */
        /* <Dialog.Overlay /> é a nuvem opaca atrás do modal para que o usuário não veja a tela atrás do modal */
        /* <Dialog.Close> é o botão para fechar */
        /* <Dialog.Title> usa o texto dentro do <Dialog.Title> para anunciar para o leitor de tela quando o modal abrir */
    )
}
