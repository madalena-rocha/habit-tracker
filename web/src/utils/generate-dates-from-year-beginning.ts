// Completar a tabela do primeiro dia do ano até o dia atual, até o último dia do ano

import dayjs from "dayjs";

// Gerar todas as datas desde o começo do ano
export function generateDatesFromYearBeginning() {
    const firstDayOfTheYear = dayjs().startOf('year') // data no começo do ano
    const today = new Date()

    const dates = []
    let compareDate = firstDayOfTheYear

    // Enquanto a data utilizada como comparação for anterior a hoje, adicionar o dia
    while (compareDate.isBefore(today)) {
        dates.push(compareDate.toDate()) // converter a data do dayjs numa data do JS
        // adicionar um dia no compareDate a cada iterção do while
        compareDate = compareDate.add(1, 'day')
    }

    return dates
}