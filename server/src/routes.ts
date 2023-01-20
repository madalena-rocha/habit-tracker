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
        })
        
        return {
            possibleHabits,
            completedHabits,
        }
    })
}
