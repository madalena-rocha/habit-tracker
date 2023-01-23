import * as Checkbox from '@radix-ui/react-checkbox';
import dayjs from 'dayjs';
import { Check } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { api } from '../lib/axios';

interface HabitsListProps {
    date: Date;
    onCompletedChanged: (completed: number) => void // função que não tem retorno, porém, tem um parâmetro, o número de hábitos completos
}

interface HabitsInfo {
    possibleHabits: {
        id: string;
        title: string;
        created_at: string;
    }[], // array de objetos
    completedHabits: string[] // ids dos hábitos já completados, podendo estar vazio
}

export function HabitsList({ date, onCompletedChanged }: HabitsListProps) {
    const [habitsInfo, setHabitsInfo] = useState<HabitsInfo>()

    // Executa esse código somente quando o usuário abrir o popover, pois o componente não existe em tela antes, e o useEffect só executa quando o componente é exibido em tela
    useEffect(() => {
        api.get('day', {
            // tudo que passar dentro de params será convertido para query params
            params: {
                date: date.toISOString(), // converter a data para o formato usado no Insomnia
            }
        }).then(response => {
            setHabitsInfo(response.data)
        })
    }, [])

    async function handleToggleHabit(habitId: string) {
        await api.patch(`/habits/${habitId}/toggle`)
        // A API não precisa da informação se deseja completar ou remover o hábito como completo, porque ela tem essa informação no banco de dados

        // Verificar se o hábito já foi marcado previamente como completo
        const isHabitAlreadyCompleted = habitsInfo!.completedHabits.includes(habitId)

        let completedHabits: string[] = [] // array de strings

        // Se o hábito já havia sido previamente completo, removê-lo da lista dos hábitos completos, se não, adicionar à lista
        if (isHabitAlreadyCompleted) {
            completedHabits = habitsInfo!.completedHabits.filter(id => id !== habitId)
            // A chamada para a API demora um pouco, com isso, a informação do habitsInfo demora um pouco para preencher também
            // Então, o typescript acha que pode ser que a informação habitsInfo quando a função handleToggleHabit for chamada ainda não tenha sido definida
            // Porém, isso não é verdade, pois só exibe a lista de checkboxes caso a habitsInfo esteja preenchida
            // Para prever esse funcionamento, usar ! ao invés de ? para dizer para o typescript que essa informação vai existir nesse momento
        } else {
            completedHabits = [...habitsInfo!.completedHabits, habitId]
        }
                
        setHabitsInfo({
            // Essa função substitui o valor dentro de habitsInfo
            // Alterar somente o completedHabits, mantendo o possibleHabits
            possibleHabits: habitsInfo!.possibleHabits,
            completedHabits,
        })

        onCompletedChanged(completedHabits.length)
        // Toda vez que a lista completedHabits mudar dentro do handleToggleHabit, vai avisar o componente pai, que é o HabitDay, que a lista mudou
    }

    // Impedir que o usuário faça check de um hábito numa data passada
    // Validar que a data é anterior à data atual
    const isDateInPast = dayjs(date)
        .endOf('day')
        .isBefore(new Date())
    // Porém, no dia atual, a data que está sendo salva no banco de dados está com hora, minutos e segundos zerados
    // Ou seja, em qualquer horário do dia depois da meia-noite, a data já passou, não permitindo checar
    // método endOf('day) para colocar o horário no final do dia

    return (
        <div className="mt-6 flex flex-col gap-3">
            {habitsInfo?.possibleHabits.map(habit => {
                // No primeiro momento, isso está indefinido, somente após a chamada na API finalizar que vai preencher esses dados
                return (
                    <Checkbox.Root
                        key={habit.id}
                        onCheckedChange={() => handleToggleHabit(habit.id)}
                        checked={habitsInfo.completedHabits.includes(habit.id)}
                        // vai estar checado quando o id desse hábito tiver dentro da lista de hábitos completos
                        disabled={isDateInPast}
                        className="flex items-center gap-3 group focus:outline-none disabled:cursor-not-allowed"
                        // a classe group permite fazer estilizações baseadas em propriedades que o elemento <Checkbox.Root /> tem dentro de outros elementos internos a ele
                    >
                        <div 
                            className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors goup-focus:ring-2 goup-focus:ring-violet-600 goup-focus:ring-offset-2 group-focus:ring-offset-background"
                            // quando o grupo tiver um atributo data state com o valor checked, colocar a estilização indicada 
                        >
                            <Checkbox.Indicator>
                                <Check size={20} className="text-white" />
                            </Checkbox.Indicator>
                        </div>

                        <span 
                            className="font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400"
                            // riscar o texto quando tiver completo
                        >
                            {habit.title}
                        </span>
                    </Checkbox.Root>
                )
            })}
        </div>
    )
}