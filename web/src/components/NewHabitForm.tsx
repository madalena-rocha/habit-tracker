import { Check } from "phosphor-react";
import * as Checkbox from '@radix-ui/react-checkbox';
import { FormEvent, useState } from 'react';
import { api } from "../lib/axios";

const availableWeekDays = [
    'Domingo', 
    'Segunda-feira', 
    'Terça-feira', 
    'Quarta-feira', 
    'Quinta-feira', 
    'Sexta-feira', 
    'Sábado'
]

export function NewHabitForm() {
    // Buscar os dados do input
    // Estado para cada campo do formulário
    const [title, setTitle] = useState('') // o título da hábito começa como uma string vazia

    // Buscar o valor dos checkboxes
    // Estado para os checkboxes
    // array numérico dos dias da semana que o usuário quer que o hábito esteja disponível
    const [weekDays, setWeekDays] = useState<number[]>([])
    // a função setWeekDays serve para sobrepor o valor da variável no estado weekDays, não serve para editar o valor
    // o React segue o cenceito de imutabilidade, onde nunca faz modificações em variáveis, sempre substitui a variável por completo com uma nova variável

    async function createNewHabit(event: FormEvent) {
        // Evitar o comportamento padrão de formulários no HTML de redirecionamento do usuário para outra página
        event.preventDefault()

        // Verificar se o usuário não preencheu um título ou não preencheu um dia da semana
        if (!title || weekDays.length == 0) {
            return
        }

        await api.post('habits', {
            title,
            weekDays,
        })

        // Limpando o formulário após o cadastro
        setTitle('')
        setWeekDays([])

        alert('Hábito criado com sucesso!')
    }

    // Adicionar ao array ou remover do array caso já esteja lá
    function handleToggleWeekDay(weekDay: number) {
        // Percorrer a lista e verificar se o dia da semana já está lá
        if (weekDays.includes(weekDay)) {
            const weekDaysWithRemovedOne = weekDays.filter(day => day !== weekDay)
            // cria um novo array, edita o array e retorna o novo array a partir dele

            setWeekDays(weekDaysWithRemovedOne)
        } else {
            // copiar todos os itens que já haviam no array anteriormente e adicionar o novo item
            const weekDaysWithAddedOne = [...weekDays, weekDay]

            setWeekDays(weekDaysWithAddedOne)
        }
    }

    return (
        <form onSubmit={createNewHabit} className="w-full flex flex-col mt-6">
            <label htmlFor="title" className="font-semibold leading-tight">
                Qual seu comprometimento?
            </label>

            <input 
                type="text"
                id="title"
                placeholder="ex.: Exercícios, dormir bem, etc..."
                className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-zinc-900"
                autoFocus
                value={title}
                onChange={event => setTitle(event.target.value)}
                // Toda vez que o valor do input mudar, armazenar na variável title do estado 
            />

            <label htmlFor="" className="font-semibold leading-tight mt-4">
                Qual a recorrência?
            </label>

            <div className="flex flex-col gap-2 mt-3">
                {availableWeekDays.map((weekDay, index) => {
                    return (
                        <Checkbox.Root 
                            key={weekDay} 
                            className="flex items-center gap-3 group focus:outline-none"
                            checked={weekDays.includes(index)}
                            // o checkbox estará checado caso a variável weekDays inclua este índice
                            onCheckedChange={() => handleToggleWeekDay(index)}
                        >
                            <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors group-focus:ring-2 group-focus:ring-green-600 group-focus:ring-offset-2 group-focus:ring-offset-background">
                                <Checkbox.Indicator>
                                    <Check size={20} className="text-white" />
                                </Checkbox.Indicator>
                            </div>

                            <span className="text-white leading-tight">
                                {weekDay}
                            </span>
                        </Checkbox.Root>
                    )
                })}
            </div>

            <button 
                type="submit" 
                className="mt-6 rounded-lg p-4 flex items-center justify-center gap-3 font-semibold bg-green-600 hover:bg-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-zinc-900"
            >
                <Check size={20} weight="bold" />
                Confirmar
            </button>
        </form>
    )
}