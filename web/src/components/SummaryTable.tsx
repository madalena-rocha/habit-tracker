import { generateDatesFromYearBeginning  } from "../utils/generate-dates-from-year-beginning";
import { HabitDay } from "./HabitDay"
import { useEffect, useState } from "react"
import { api } from "../lib/axios";
import dayjs from "dayjs";

const weekDays = [
    'D', 
    'S', 
    'T', 
    'Q', 
    'Q', 
    'S', 
    'S'
]

const summaryDates = generateDatesFromYearBeginning()

// Gerar um mínimo de dias apresentados em tela de 18 semanas
const minimumSummaryDatesSize = 18 * 7
// Quantidade de quadradinhos que precisa mostrar em tela para preencher a tabela de dias quando tiver uma quatidade de dias menor do que o desejado
const amountOfDaysToFill = minimumSummaryDatesSize - summaryDates.length

// Informar o formato do summary, que é um array de objetos
type Summary = {
    id: string;
    date: string;
    amount: number;
    completed: number;
}[]

export function SummaryTable() {
    // Fazer a barra de progresso aumentar ou diminuir de acordo com a quatidade de hábitos chacados
    // Tudo que é colocado fora do componente em React não vai conseguir enxergar informações que estão dentro do componente
    // Por isso, geralmente chamadas HTTP devem ser feitas dentro do componente
    // Porém, o React tem o comportamento de ser reativo a mudanças de estados
    // Tudo que está diretamente dentro da função do componente executa toda vez que o React entrar nesse fluxo de atualização
    // Não é desejável que a API fique executando várias vezes, sendo necessário usar o useEffect
    // O useEffect é uma função do React que lida com efeitos colaterais
    // O primeiro parâmetro é a função que vai executar, e o segundo parâmetro é quando, que é um array onde pode colocar variáveis
    // Toda vez que o valor da variável mudar, o React vai executar o código dessa função
    // Se deixar o array vazio, o código da função será executado uma única vez quando o componente for exibido em tela pela primeira vez

    const [summary, setSummary] = useState<Summary>([])

    useEffect(() => {
        api.get('summary').then(response => {
            setSummary(response.data)
        })
    }, [])

    return (
        <div className="w-full flex">
            <div className="grid grid-rows-7 grid-flow-row gap-3">
                {weekDays.map((weekDay, i) => {
                    // percorrer o array de dias da semana, e para cada dia da semana, retornar a div mostrando o dia da semana
                    return (
                        // quando é criada uma estrutura de repetição dentro do React, o primeiro item dentro do return deve apresentar uma key
                        // passar dentro da key a informação única para cada dia da semana
                        // nesse caso, dia da demana - índice
                        <div 
                            key={`${weekDay}-${i}`} 
                            className="text-zinc-400 text-xl h-10 w-10 font-bold flex items-center justify-center"
                        >
                            {weekDay}
                        </div>
                    )
                })}
            </div>

            <div className="grid grid-rows-7 grid-flow-col gap-3">
                {summary.length && summaryDates.map(date => {
                    // carregar a lista de datas somente quando a variável no estado summary já tiver sido carregado
                    // verificar se o dia que está sendo percorrido é igual a alguma data presente dentro do resumo
                    const dayInSummary = summary.find(day => {
                        return dayjs(date).isSame(day.date, 'day')
                        // isSmae checa ano, mês, dia, minuto, segundo, milésimo... 'day' para checar somente até o dia
                    })

                    // para cada data, mostrar um habitDay
                    // a key precisa ser uma string, portanto, não pode ser um objeto date
                    return (
                        <HabitDay 
                            key={date.toString()} 
                            date={date}
                            // dayInSummary pode existir ou não, procurar o amount somente se o dayInSummary não for nulo
                            amount={dayInSummary?.amount} 
                            defaultCompleted={dayInSummary?.completed} 
                        />
                    )
                })}

                {amountOfDaysToFill > 0 && Array.from({ length: amountOfDaysToFill }).map((_, i) => {
                    // Array.from para criar um array a partir de um tamanho pré-determinado
                    return (
                        // Existe uma recomendação na comunidade React de não usar índice como chave dentro de html
                        // Nesse caso não é problema, o índice não pode ser usado como chave quando ele muda durante a execução da aplicação
                        <div 
                            key={i} 
                            className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed"
                        />
                    )
                })}
            </div>
        </div>
    )
}