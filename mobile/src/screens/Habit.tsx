import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';
import clsx from 'clsx';

import { api } from '../lib/axios';
import { generateProgressPercentage } from '../utils/generate-progress-percentage';

import { BackButton } from '../components/BackButton';
import { ProgressBar } from '../components/ProgressBar';
import { Checkbox } from '../components/Checkbox';
import { Loading } from '../components/Loading';
import { HabitsEmpty } from '../components/HabitsEmpty';

// Recuperar a informação de data
interface Params {
    date: string;
}

interface DayInfoProps {
    completedHabits: string[];
    possibleHabits: {
        id: string;
        title: string;
    }[];
}

export function Habit() {
    const [loading, setLoading] = useState(true);
    const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null);
    const [completedHabits, setCompletedHabits] = useState<string[]>([]);

    const route = useRoute();
    const { date } = route.params as Params;

    // Converter a data que chega como string por parâmetro
    const parsedDate = dayjs(date);
    // Verificar se a data já passou
    const isDateInPast = parsedDate.endOf('day').isBefore(new Date());
    // Extrair do formato o dia da semana escrito por extenso
    const dayOfWeek = parsedDate.format('dddd');
    const dayAndMonth = parsedDate.format('DD/MM');

    // Calcular a barra de progresso
    // Verificar se existem hábitos dentro do estado que contém as informações dos hábitos, se sim, fazer o cálculo da porcentagem, caso contrário, retornar 0
    const habitsProgress = dayInfo?.possibleHabits.length 
    ? generateProgressPercentage(dayInfo.possibleHabits.length, completedHabits.length) 
    : 0;

    async function fetchHabits() {
        try {
            setLoading(true);

            const response = await api.get('/day', { params: { date }});
            setDayInfo(response.data);
            setCompletedHabits(response.data.completedHabits);
        } catch (error) {
            console.log(error);
            Alert.alert('Ops', 'Não foi possível carregar as informações dos hábitos')
        } finally { // executa o finally independente se deu certo ou errado
            setLoading(false);
        }
    }

    async function handleToggleHabit(habitId: string) {
        try {
            await api.patch(`/habits/${habitId}/toggle`);

            // Verificar se o hábito já está incluso no estado
            if (completedHabits.includes(habitId)) {
                setCompletedHabits(prevState => prevState.filter(habit => habit !== habitId));
                // Percorrer o conteúdo atual e retornar todos os hábitos menos o que o usuário deseja desabilitar
            } else {
                setCompletedHabits(prevState => [...prevState, habitId]);
                // Acessar o conteúdo atual e juntar o que já tem lá dentro com o novo hábito adicionado
            }
        } catch (error) {
            console.log(error);
            Alert.alert('Ops', 'Não foi possível atualizar o status do hábito.')
        }
    }

    useEffect(() => {
        fetchHabits();
    },[]);

    if (loading) {
        return (
            <Loading />
        );
    }

    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <BackButton />

                <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
                    {dayOfWeek}
                </Text>

                <Text className="text-white font-extrabold text-3xl">
                    {dayAndMonth}
                </Text>

                <ProgressBar progress={habitsProgress} />

                <View className={clsx("mt-6", {
                    ["opacity-50"]: isDateInPast
                })}>
                    {
                        dayInfo?.possibleHabits ?
                        dayInfo?.possibleHabits.map(habit => (
                            // Verificar se existem hábitos possíveis, se não for nulo, percorrer
                            <Checkbox 
                                key={habit.id}
                                title={habit.title}
                                // Verificar se está completado ou não
                                checked={completedHabits.includes(habit.id)}
                                disabled={isDateInPast}
                                onPress={() => handleToggleHabit(habit.id)}
                            />
                        ))
                        : <HabitsEmpty />
                    }
                </View>

                {
                    isDateInPast && (
                        <Text className="text-white mt-10 text-center">
                            Você não pode editar hábitos de uma data passada.
                        </Text>
                    )
                }
            </ScrollView>
        </View>
    );
}