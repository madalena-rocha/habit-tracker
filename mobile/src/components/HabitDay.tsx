import { TouchableOpacity, Dimensions } from "react-native";
// Dimensions para acessar as dimensões da tela do dispositivo

// calcular a altura dos quadradinhos baseado no espaço disponível de tela
const WEEK_DAYS = 7; // 7 quadradinhos por linha
const SCREEN_HORIZONTAL_PADDING = (32 * 2) / 5 // calcular o espaçamento dos lados da tela
// por dentro, entre cada quadradinho, haverá um espaçamento

export const DAY_MARGIN_BETWEEN = 8; // parâmetro como espaçamento entre os quadradinhos
export const DAY_SIZE = (Dimensions.get('screen').width / WEEK_DAYS) - (SCREEN_HORIZONTAL_PADDING + 5) // tamanho de cada quadradinho
// dividir a largura da tela por quantos dias tem na semana

export function HabitDay() {
    return (
        <TouchableOpacity
            className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800"
            style={{ width: DAY_SIZE, height: DAY_SIZE }}
            activeOpacity={0.7}
        />
    )
}