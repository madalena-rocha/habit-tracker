import * as Popover from '@radix-ui/react-popover';
import clsx from 'clsx';
import { ProgressBar } from './ProgressBar';
import dayjs from 'dayjs';
import { HabitsList } from './HabitsList';
import { useState } from 'react';

interface HabitDayProps {
    date: Date
    defaultCompleted?: number
    amount?: number
}

export function HabitDay({ defaultCompleted = 0, amount = 0, date }: HabitDayProps) {
    // Quando completed e amount não forem definidos, iniciar como 0

    // O completed está fixo, é um número que vem do SummaryTable, para que não seja fixo, criar um estado
    const [completed, setCompleted] = useState(defaultCompleted)
    // O valor padrão é o defaultCompleted

    // Gerar o percentual de progresso
    const completedPercentage = amount > 0 ? Math.round((completed / amount) * 100) : 0
    // Se o amount for maior que 0, calcular o percentual, se não, o percentual é 0

    const dayAndMonth = dayjs(date).format('DD/MM')
    // o método format permite retornar mais de uma informação
    const datOfWeek = dayjs(date).format('dddd')
    // get('day') retorna o dia da semana numérico

    // Atualizar a barra de progresso e a cor do quadradinho ao desmarcar os hábitos
    // O único componente que sabe quantos hábitos estão completos em tempo real é o HabitsList
    // Porém, a barra de progresso está no componente HabitDay
    // Como o componente HabitDay vai conseguir obter a informação de que a lista de hábitos completos mudou?
    // Comunicação entre componentes

    function handleCompletedChanged(completed: number) {
        setCompleted(completed)
    }

    return (
        <Popover.Root>
            <Popover.Trigger 
                // Mudar a cor de fundo com base no progresso
                className={clsx('w-10 h-10 border-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-background', {
                    'bg-zinc-900 border-zinc-800': completedPercentage === 0,
                    'bg-violet-900 border-violet-700': completedPercentage > 0 && completedPercentage < 20,
                    'bg-violet-800 border-violet-600': completedPercentage >= 20 && completedPercentage < 40,
                    'bg-violet-700 border-violet-500': completedPercentage >= 40 && completedPercentage < 60,
                    'bg-violet-600 border-violet-500': completedPercentage >= 60 && completedPercentage < 80,
                    'bg-violet-500 border-violet-400': completedPercentage >= 80,

                })}
                // A clsx pode receber quantos parâmetros desejar, com as classes que o elemento vai ter
                // Se enviar um texto como parâmetro, vai entender como classes que sempre serão aplicadas
                // Se enviar um objeto como parâmetro, vai entender que deve aplicar no elemento a classe que é a chave do objeto somente se o valor dessa propriedade for verdadeiro
            />
        
            <Popover.Portal>
                <Popover.Content className="min-w-[320px] p-6 rounded-2xl bg-zinc-900 flex flex-col">
                    <span className="font-semibold text-zinc-400">{datOfWeek}</span>
                    <span className="mt-1 font-extrabold leading-tight text-3xl">{dayAndMonth}</span>

                    <ProgressBar progress={completedPercentage} />

                    <HabitsList 
                        date={date} 
                        onCompletedChanged={handleCompletedChanged}
                        // Enviar a função para o componente como propriedade
                    />

                    <Popover.Arrow height={8} width={16} className="fill-zinc-900" />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
        // No tailwind, todas as medidas são múltiplas de 4
        // <Popover.Arrow /> é a setinha do balão indicando de qual quadradinho veio
        // <Checkbox.Indicator /> faz tudo que tiver dentro dele aparecer somente se o usuário der check
    )
}