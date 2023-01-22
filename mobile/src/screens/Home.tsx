import { View, Text, ScrollView } from 'react-native';
// No mobile, quando os elementos não cabem na tela, não ativa a rolagem por padrão, sendo necessário envolver a estrutura pela ScrollView 
import { useNavigation } from '@react-navigation/native';

import {generateRangeDatesFromYearStart} from '../utils/generate-range-between-dates';

import { HabitDay, DAY_SIZE } from '../components/HabitDay';
import { Header } from '../components/Header';

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const datesFromYearStart = generateRangeDatesFromYearStart();
// Gerar placeholder para preencher o espaço vazio com quadradinhos restantes na tela
const minimumSummaryDatesSizes = 18 * 5;
const amountOfDaysToFill = minimumSummaryDatesSizes - datesFromYearStart.length;

export function Home() {
    const { navigate } = useNavigation();

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
                <View className="flex-row flex-wrap">
                    {
                        datesFromYearStart.map(date => (
                            <HabitDay 
                                key={date.toISOString()}
                                onPress={() => navigate('habit', { date: date.toISOString() })}
                            />
                        ))
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
            </ScrollView>
        </View>
    ) 
}