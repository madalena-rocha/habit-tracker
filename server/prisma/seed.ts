import { PrismaClient } from '@prisma/client'
// conexão com o banco de dados

const prisma = new PrismaClient()

const firstHabitId = '0730ffac-d039-4194-9571-01aa2aa0efbd'
const firstHabitCreationDate = new Date('2022-12-31T03:00:00.000')

const secondHabitId = '00880d75-a933-4fef-94ab-e05744435297'
const secondHabitCreationDate = new Date('2023-01-03T03:00:00.000')

const thirdHabitId = 'fa1a1bcf-3d87-4626-8c0d-d7fd1255ac00'
const thirdHabitCreationDate = new Date('2023-01-08T03:00:00.000')

async function run() {
  // como o seed será executado várias vezes durante a aplicação, deletar todos os hábitos antigos e criar somente os que estão no seed, para não ocorrer registros duplicados
  await prisma.habit.deleteMany()
  await prisma.day.deleteMany()

  /**
   * Create habits
   * Deixar previamente criados alguns hábitos da aplicação
  */
  await Promise.all([
    prisma.habit.create({
      data: {
        id: firstHabitId,
        title: 'Beber 2L água',
        created_at: firstHabitCreationDate,
        weekDays: {
          create: [
            // hábito disponível segunda, terça e quarta-feira
            { week_day: 1 },
            { week_day: 2 },
            { week_day: 3 },
          ]
        }
      }
    }),

    prisma.habit.create({
      data: {
        id: secondHabitId,
        title: 'Exercitar',
        created_at: secondHabitCreationDate,
        weekDays: {
          create: [
            { week_day: 3 },
            { week_day: 4 },
            { week_day: 5 },
          ]
        }
      }
    }),

    prisma.habit.create({
      data: {
        id: thirdHabitId,
        title: 'Dormir 8h',
        created_at: thirdHabitCreationDate,
        weekDays: {
          create: [
            { week_day: 1 },
            { week_day: 2 },
            { week_day: 3 },
            { week_day: 4 },
            { week_day: 5 },
          ]
        }
      }
    })
  ])

  await Promise.all([
    /**
     * Habits (Complete/Available): 1/1
     * Informações que o usuário da aplicação completou pelo menos algum hábito naquela data
     * No dia 02/01, por ser uma segunda-feira, só havia um hábito disponível, que foi completado
     * O hábito Dormir 8h também está disponível na segunda-feira, porém, sua data de criação é 08/01
     * Se o hábito foi criado depois da data proposta que ele poderia existir, ele não estava disponível ainda nessa data
    */
    prisma.day.create({
      data: {
        /** Monday 
         * No dia 02/01, completou o hábito com o id do primeiro hábito criado, ou seja, beber 2L d água
        */
        date: new Date('2023-01-02T03:00:00.000z'),
        dayHabits: {
          create: {
            habit_id: firstHabitId,
          }
        }
      }
    }),

    /**
     * Habits (Complete/Available): 1/1
    */
    prisma.day.create({
      data: {
        /** Friday */
        date: new Date('2023-01-06T03:00:00.000z'),
        dayHabits: {
          create: {
            habit_id: firstHabitId,
          }
        }
      }
    }),

    /**
     * Habits (Complete/Available): 2/2
    */
    prisma.day.create({
      data: {
        /** Wednesday */
        date: new Date('2023-01-04T03:00:00.000z'),
        dayHabits: {
          create: [
            { habit_id: firstHabitId },
            { habit_id: secondHabitId },
          ]
        }
      }
    }),
  ])
}

// Função que vai executar os scripts do banco
run()
  .then(async () => {
    // quando terminar de executar, desconectar do banco de dados
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    // se houver erro, mostrar o erro e desconectar do banco de dados
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })