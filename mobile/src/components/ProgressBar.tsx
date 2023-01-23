import { useEffect } from "react";
import { View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
// useAnimatedStyle para animar as propriedades de estilização
// O React Native roda animação na tred do usuário
// Necessário utilizar um estado utilizado pelo Reanimated para conseguir executar e utilizar o valor do progresso também na tred do usuário
// Para isso, utilizar o useSharedValue, que é um estado utilizado para animação

interface Props {
    progress?: number;
    // O progresso é opcional, caso não seja informado, começa com 0
}

export function ProgressBar({ progress = 0 }: Props) {
    const sharedProgress = useSharedValue(progress);
    // sharedProgress começa por padrão com o conteúdo que vem da propriedade progress, mas qualquer modificação realizada para refletir no carregamento de uma forma animada, será realizada no sharedProgress

    const style = useAnimatedStyle(() => {
        // Retorna um objeto com as estilizações que deseja usar
        return {
            width: `${sharedProgress.value}%`
        };
    });

    useEffect(() => {
        sharedProgress.value = withTiming(progress);
        // withTiming para levar de um ponto para o outro de forma gradual
    }, [progress]);
    // Executar o useEffect sempre que o progress mudar

    return (
        <View className="w-full h-3 rounded-xl bg-zinc-700 mt-4">
            <Animated.View 
                className="h-3 rounded-xl bg-violet-600"
                style={style}
            />
        </View>
    );
}