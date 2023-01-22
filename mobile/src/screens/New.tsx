import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import colors from 'tailwindcss/colors';

import { api } from '../lib/axios';

import { BackButton } from "../components/BackButton";
import { Checkbox } from "../components/Checkbox";

const availableWeekDays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

export function New() {
    const [title, setTitle] = useState('');
    const [weekDays, setWeekDays] = useState<number[]>([]); // vetor de números
    // utilizado para saber quais dias da semana foram selecionados

    function handleToggleWeekDay(weekDayIndex: number) {
        if (weekDays.includes(weekDayIndex)) {
            // se existe, significa que o usuário deseja desmarcar
            setWeekDays(prevState => prevState.filter(weekDay => weekDay !== weekDayIndex));
            // pegar o estado anterior e fazer um filtro para retornar todos onde o weekDay é diferente do weekDayIndex
        } else {
            // se não existe, significa que o usuário deseja colocar na lista de dias checados
            setWeekDays(prevState => [...prevState, weekDayIndex]);
            // recuperar o estado anterior, pegar todo o restante e despejar utilizando o spread operator mais o novo 
        }
    }

    async function handleCreateNewHabit() {
        try {
            if (!title.trim() || weekDays.length === 0) { // trim() para desconsiderar os espaços
                Alert.alert('Novo Hábito', 'Informe o nome do hábito e escolha a periodicidade.')
            }

            await api.post('/habits', { title, weekDays });

            setTitle('');
            setWeekDays([]);

            Alert.alert('Novo hábito', 'Hábito criado com sucesso!');
        } catch (error) {
            console.log(error);
            Alert.alert('Ops', 'Não foi possível criar o novo hábito');
        }
    }

    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <BackButton />

                <Text className="mt-6 text-white font-extrabold text-3xl">
                    Criar hábito
                </Text>

                <Text className="mt-6 text-white font-semibold text-base">
                    Qual seu comprometimento?
                </Text>

                <TextInput 
                    className="h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600"
                    placeholder="Exercícios, dormir bem, etc..."
                    placeholderTextColor={colors.zinc[400]}
                    onChangeText={setTitle}
                    value={title}
                />

                <Text className="font-semibold mt-4 mb-3 text-white text-base">
                    Qual a recorrência?
                </Text>

                {
                    availableWeekDays.map((weekDay, index) => (
                        <Checkbox 
                            key={weekDay}
                            title={weekDay}
                            checked={weekDays.includes(index)} // verificar se o item está checado ou não
                            onPress={() => handleToggleWeekDay(index)}
                        />
                    ))
                }

                <TouchableOpacity
                    className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6"
                    activeOpacity={0.7}
                    onPress={handleCreateNewHabit}
                >
                    <Feather 
                        name="check"
                        size={20}
                        color={colors.white}
                    />

                    <Text className="font-semibold text-base text-white ml-2">
                        Confirmar
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}