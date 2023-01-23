import dayjs from 'dayjs'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from "./lib/prisma"

export async function appRoutes(app: FastifyInstance) {
    /*
    app.get('/hello', async () =>  {
        // Buscar vários hábitos no banco de dados
        const habits = await prisma.habit.findMany()
        
        const habits = await prisma.habit.findMany({
            // Buscar todos hábitos onde o título começa com 'Beber'
            where: {
                title: {
                    startsWith: 'Beber'
                }
            }
        })
        
        return habits
    })
    */

    // Rota de criação de um hábito
    // A rota precisa receber dois parâmetros, o título do hábito e os dias da semana que o hábito estará disponível
    // Buscar da requisição que está sendo feita do front para o back-end 
    app.post('/habits', async (request) => {
        // Validar que os parâmetros title e weekDays chegaram na rota
        // O corpo da requisição para criar um novo hábito é um objeto que tem dois campos, o título, que é uma string obrigatória, e os dias da semana, um array com todos os dias da semana disponíveis
        const createHabitBody = z.object({
            title: z.string(),
            weekDays: z.array(
                z.number().min(0).max(6) // array de números de 0 a 6 
            ) 
        })

        // request.body para obter o corpo da requisição, de onde geralmente busca informações ao criar ou atualizar um recurso
        // request.params são parâmetros na rota, geralmente para identificar algum recurso
        // request.query são parâmetros com ? usados para paginação, filtro...
        const { title, weekDays } = createHabitBody.parse(request.body)
    
        // para que o hábito fique disponível no mesmo dia em que foi criado
        // dayjs() retorna a data atual, toDate() transforma num objeto date do JS, startOf('day') zera as horas, minutos e segundos
        const today = dayjs().startOf('day').toDate()
        
        await prisma.habit.create({
            data: {
                title,
                created_at: today,
                weekDays: {
                    // criar automaticamente os registros da tabela habitWeekDays enquanto cria o hábito no banco de dados
                    // criar um array de registros, um por dia da semana
                    // percorrer os dias da semana, para cada dia da semana, retornar um objeto com as informações que deseja inserir
                    create: weekDays.map(weekDay => {
                        return {
                            // o dia da semana na tabela é igual ao dia da semana recebido como parâmetro
                            week_day: weekDay,
                        }
                    })
                }
            }
        })
    })

    // Rota para retornar o detalhe do dia quando o usuário clicar em um dia específico
    // Retornar todos os hábitos disponíveis naquele dia e quais hábitos foram completados
    app.get('/day', async (request) =>  {
        const getDayParams = z.object({
            // a rota recebe como parâmetro o dia que deseja buscar as informações
            // date() será enviado como uma string do front-end e não como o objeto date
            // coerce para converter o parâmetro recebido dentro do date em uma data
            date: z.coerce.date()
        })

        // Buscar essa informação de request.query, ou seja, vai receber essa informação como query param
        const { date } = getDayParams.parse(request.query)
    
        const parsedDate = dayjs(date).startOf('day')
        const weekDay = parsedDate.get('day')
        // day retorna o dia da semana, e date retorna a dia

        // Carregar duas informações, todos os hábitos possíveis naquele dia, e os hábitos que já foram completados
        // Buscar os hábitos possíveis no dia
        const possibleHabits = await prisma.habit.findMany({
            // Encontrar vários hábitos onde a data de criação do hábito é menor ou igual a data atual
            where: {
                created_at: {
                    lte: date,
                },
                // verificar o dia da semana
                // procurar hábitos onde tenha pelo menos um dia da semana cadastrado onde o weekDay seja igual ao dia da semana que está recebendo nessa data
                weekDays: {
                    some: {
                        week_day: weekDay,
                    }
                }
            }
        })

        // Retornar quais hábitos foram completados naquele dia
        // Buscar o dia na tabela de dias do banco de dados onde a data seja igual à data enviada 
        const day = await prisma.day.findUnique({
            where: {
                date: parsedDate.toDate(), // converter para um objeto date do JS
            },
            // mostrar todos os hábitos completados relacionados com esse dia
            include: {
                dayHabits: true,
            }
        })
        
        // o day pode não existir, pois se o usuário não completar nenhum hábito naquele dia, o day estará vazio
        // verificar se o dia não está nulo, então buscar a informação dayHabits, percorrer todos os hábitos completados naquele dia, e para cada registro na tabela dayHbit, retornar o id dos hábitos completados
        const completedHabits = day?.dayHabits.map(dayHabit => {
            return dayHabit.habit_id
        }) ?? []
        // retornar um array vazio caso o valor esteja indefinido
        
        return {
            possibleHabits,
            completedHabits,
        }
    })

    // Rota para completar / remover o status de completo de um hábito
    app.patch('/habits/:id/toggle', async (request) => {
        // o id passado no parâmetro da rota é um route param, um parâmetro de identificação
        
        const toggleHabitParams = z.object({
            id: z.string().uuid(), // validar que está no formato uuid
        })

        const { id } = toggleHabitParams.parse(request.params)

        // Quando o usuário for fazer o toggle em um hábito, sempre precisa ser da data atual
        // Se desejar permitir completar hábitos retroativo, receber uma data para utilizar para completar o hábito naquela data
        const today = dayjs().startOf('day').toDate()
    
        // Procurar no prisma um dia onde a data seja igual à data de hoje
        let day = await prisma.day.findUnique({
            where: {
                date: today,
            }
        })

        // Se o dia não está cadastrado no banco de dados, se o usuário ainda não havia completado nenhum hábito antes, criar a informação no banco de dados
        if (!day) {
            day = await prisma.day.create({
                data: {
                    date: today,
                }
            })
        }

        // Verificar se o usuário já havia marcado esse hábito como completo nesse dia
        const dayHabit = await prisma.dayHabit.findUnique({
            where: {
                day_id_habit_id: {
                    day_id: day.id,
                    habit_id: id,
                }
            }
        })

        // Se já havia marcado como completo, remover a marcação de completo
        if (dayHabit) {
            await prisma.dayHabit.delete({
                where: {
                    id: dayHabit.id,
                }
            })
        } else {
            // Certificar que a variável day existe, ou encontrou ela ou criou um registro novo no banco de dados
            // Completar o hábito nesse dia
            await prisma.dayHabit.create({
                data: {
                    day_id: day.id,
                    habit_id: id,
                }
            })
        }
    })

    // Rota de resumo de dias
    app.get('/summary', async () => {
        // No resumo, retornar um array com várias informações, cada informação sendo um objeto do JS
        // Cada um dos objetos precisa ter 3 informações: a data, quantos hábitos eram possíveis completar nessa data, e quantos hábitos foram completados nessa data
    
        // Em queries mais complexas, com mais condições, relacionamentos, geralmente é necessário escrever o SQL na mão (RAW)
        const summary = await prisma.$queryRaw`
            SELECT 
                D.id, 
                D.date, 
                /* Sub Query */
                (
                    /* Trazendo todos os registros da tabela day_habits onde o dia armazenado na tabela day_habits seja igual ao dia listado da query principal */
                    SELECT 
                        cast(count(*) as float)
                        /* o count retorna o formato BigInt, sendo necessário convertê-lo em JSON para o front-end */
                    FROM day_habits DH
                    WHERE DH.day_id = D.id
                ) as completed,
                /* O retorno dessa query será mostrado para o front-end como completed */
                (
                    /* Retornar o total de hábitos disponíveis naquela data */
                    SELECT
                        cast(count(*) as float)
                        /* Trazer todos os hábitos que estavam disponíveis nesse dia da semana */
                    FROM habit_week_days HWD
                    JOIN habits H
                        ON H.id = HWD.habit_id
                        /* Buscando o hábito relacionado com cada habit_week_days */
                    WHERE
                        HWD.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int)
                        /* No SQLite, os campos de datetime são salvos no formato Epoch Timestamp, um número que representa a data atual, correspondendo ao nº de segundos que se passaram desde 1/1/1970 */
                        /* No SQLite, o campo do tipo Unix Epoch Timestamp é salvo por milisegundos */ 
                        /* strftime é uma função para formatar a data, onde %w retorna o dia da semana, com o domingo começando em 0, D.date é o time-value, e unixepoch é o formato que a data está */
                        /* strftime retorna uma string, cast para converter em inteiro */
                        AND H.created_at <= D.date
                        /* Validando que o hábito no qual está fazendo a verificação tenha sendo criado antes ou no mesmo dia que a data específica */
                ) as amount
            FROM days D
            /* D é o alias para days */
        `

        return summary
    })
}
