import { useState, useCallback } from 'react';
// useCallback para garantir melhor performance do useFocusEffect
import { View, Text, ScrollView, Alert } from 'react-native';
// No mobile, quando os elementos não cabem na tela, não ativa a rolagem por padrão, sendo necessário envolver a estrutura pela ScrollView 
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import dayjs from 'dayjs';

import { api } from '../lib/axios';
import {generateRangeDatesFromYearStart} from '../utils/generate-range-between-dates';

import { HabitDay, DAY_SIZE } from '../components/HabitDay';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const datesFromYearStart = generateRangeDatesFromYearStart();
// Gerar placeholder para preencher o espaço vazio com quadradinhos restantes na tela
const minimumSummaryDatesSizes = 18 * 5;
const amountOfDaysToFill = minimumSummaryDatesSizes - datesFromYearStart.length;

type SummaryProps = Array<{
    id: string;
    date: string;
    amount: number;
    completed: number;
}>

export function Home() {
    // Estado para anotar se as informações estão sendo carregadas
    const [loading, setLoading] = useState(true);
    // Começa como verdadeiro porque, quando a tela abrir vai estar buscando as informações do back-end
    const [summary, setSummary] = useState<SummaryProps | null>(null);

    const { navigate } = useNavigation();

    async function fetchData() {
        try {
            // Garantir que sempre que a função for chamada o setLoading vai ser verdadeiro
            setLoading(true);
            const response = await api.get('/summary');
            setSummary(response.data);
        } catch (error) {
            Alert.alert('Ops', 'Não foi possível carregar o sumário de hábitos.');
            // O primeiro parâmeto é o título da mensagem e o segundo parâmetro é a mensagem 
            console.log(error);
        } finally {
            // Se der algo errado, retornar o setLoading para falso
            setLoading(false);
        }
    }

    // Chamar a função fetchData quando o componente é montado em tela
    useFocusEffect(useCallback(() => {
        // Quando vai para a tela de marcar/desmarcar hábitos completos, modifica algo e retorna para a Home, esta tela não é renderizada novamente, não atualizando a cor do quadradinho 
        // o useFocusEffect vai chamar a função fetchData quando a interface receber o foco nela novamente
        fetchData();
    }, []));
    // [] é o array de dependências caso queira vincular algum estado que dispare o useEffect novamente se ele mudar

    // Se está buscando as informações do back-end, ao invés de mostrar o conteúdo da tela, exibir o componente de loading
    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <Header />

            <View className="flex-row mt-6 mb-2">
                {
                    weekDays.map((weekDay, i) => (
                        <Text 
                            key={`${weekDay}-${i}`}
                            className="text-zinc-400 text-xl font-bold text-center mx-1"
                            style={{ width: DAY_SIZE }}
                        >
                            {weekDay}
                        </Text>
                    ))
                }
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                // desativando a barra de rolagem que aparece por padrão
                contentContainerStyle={{ paddingBottom: 100 }}
                // desgrudar os quadradinhos do final da tela
            >
                {
                    summary && (
                        // Só renderizar se tiver o summary
                        <View className="flex-row flex-wrap">
                            {
                                datesFromYearStart.map(date => {
                                    const dayWithHabits = summary.find(day => {
                                        return dayjs(date).isSame(day.date, 'day')
                                    })

                                    return (
                                        <HabitDay 
                                            key={date.toISOString()}
                                            date={date}
                                            amountOfHabits={dayWithHabits?.amount}
                                            amountCompleted={dayWithHabits?.completed}
                                            onPress={() => navigate('habit', { date: date.toISOString() })}
                                        />
                                    )
                                })
                            }

                            {
                                amountOfDaysToFill > 0 && Array
                                .from({ length: amountOfDaysToFill })
                                .map((_, index) => (
                                    <View 
                                        key={index}
                                        className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                                        style={{ width: DAY_SIZE, height: DAY_SIZE }}
                                    />
                                ))
                            }
                        </View>
                    )
                }
            </ScrollView>
        </View>
    ) 
}