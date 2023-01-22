import { View } from "react-native";

interface Props {
    progress?: number;
    // O progresso é opcional, caso não seja informado, começa com 0
}

export function ProgressBar({ progress = 0 }: Props) {
    return (
        <View className="w-full h-3 rounded-xl bg-zinc-700 mt-4">
            <View 
                className="h-3 rounded-xl bg-violet-600"
                style={{ width: `${progress}%` }}
            />
        </View>
    );
}