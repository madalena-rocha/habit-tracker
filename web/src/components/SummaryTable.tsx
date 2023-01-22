import { generateDatesFromYearBeginning  } from "../utils/generate-dates-from-year-beginning";
import { HabitDay } from "./HabitDay"

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

export function SummaryTable() {
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
                {summaryDates.map(date => {
                    // para cada data, mostrar um habitDay
                    // a key precisa ser uma string, portanto, não pode ser um objeto date
                    return (
                        <HabitDay 
                            key={date.toString()} 
                            amount={5} 
                            completed={Math.round(Math.random() * 5)} 
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