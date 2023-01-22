import * as Popover from '@radix-ui/react-popover';
import * as Checkbox from '@radix-ui/react-checkbox';
import clsx from 'clsx';
import { ProgressBar } from './ProgressBar';
import { Check } from 'phosphor-react';
import dayjs from 'dayjs';

interface HabitDayProps {
    date: Date
    completed?: number
    amount?: number
}

export function HabitDay({ completed = 0, amount = 0, date }: HabitDayProps) {
    // Quando completed e amount não forem definidos, iniciar como 0

    // Gerar o percentual de progresso
    const completedPercentage = amount > 0 ? Math.round((completed / amount) * 100) : 0
    // Se o amount for maior que 0, calcular o percentual, se não, o percentual é 0

    const dayAndMonth = dayjs(date).format('DD/MM')
    // o método format permite retornar mais de uma informação
    const datOfWeek = dayjs(date).format('dddd')
    // get('day') retorna o dia da semana numérico

    return (
        <Popover.Root>
            <Popover.Trigger 
                // Mudar a cor de fundo com base no progresso
                className={clsx('w-10 h-10 border-2 rounded-lg', {
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

                    <div className="mt-6 flex flex-col gap-3">
                        <Checkbox.Root
                            className="flex items-center gap-3 group"
                            // a classe group permite fazer estilizações baseadas em propriedades que o elemento <Checkbox.Root /> tem dentro de outros elementos internos a ele
                        >
                            <div 
                                className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500"
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
                                Beber 2L de água
                            </span>
                        </Checkbox.Root>
                    </div>

                    <Popover.Arrow height={8} width={16} className="fill-zinc-900" />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
        // No tailwind, todas as medidas são múltiplas de 4
        // <Popover.Arrow /> é a setinha do balão indicando de qual quadradinho veio
        // <Checkbox.Indicator /> faz tudo que tiver dentro dele aparecer somente se o usuário der check
    )
}