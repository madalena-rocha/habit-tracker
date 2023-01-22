import { TouchableOpacity, Dimensions, TouchableOpacityProps } from "react-native";
// Dimensions para acessar as dimensões da tela do dispositivo
import clsx from "clsx";
import dayjs from "dayjs";

import { generateProgressPercentage } from "../utils/generate-progress-percentage";

// calcular a altura dos quadradinhos baseado no espaço disponível de tela
const WEEK_DAYS = 7; // 7 quadradinhos por linha
const SCREEN_HORIZONTAL_PADDING = (32 * 2) / 5 // calcular o espaçamento dos lados da tela
// por dentro, entre cada quadradinho, haverá um espaçamento

export const DAY_MARGIN_BETWEEN = 8; // parâmetro como espaçamento entre os quadradinhos
export const DAY_SIZE = (Dimensions.get('screen').width / WEEK_DAYS) - (SCREEN_HORIZONTAL_PADDING + 5) // tamanho de cada quadradinho
// dividir a largura da tela por quantos dias tem na semana

interface Props extends TouchableOpacityProps {
    amountOfHabits?: number;
    amountCompleted?: number;
    date: Date;
};

export function HabitDay({ amountOfHabits = 0, amountCompleted = 0, date, ...rest }: Props) {
    const amountAccomplishedPercentage = amountOfHabits > 0 ? generateProgressPercentage(amountOfHabits, amountCompleted) : 0; 
    const today = dayjs().startOf('day').toDate();
    const isCurrentDay = dayjs(date).isSame(today);

    return (
        <TouchableOpacity
            className={clsx("rounded-lg border-2 m-1", {
                ["bg-zinc-900 border-zinc-800"]: amountAccomplishedPercentage === 0,
                ["bg-violet-900 border-violet-700"]: amountAccomplishedPercentage > 0 && amountAccomplishedPercentage < 20,
                ["bg-violet-800 border-violet-600"]: amountAccomplishedPercentage >= 20 && amountAccomplishedPercentage < 40,
                ["bg-violet-700 border-violet-500"]: amountAccomplishedPercentage >= 40 && amountAccomplishedPercentage < 60,
                ["bg-violet-600 border-violet-500"]: amountAccomplishedPercentage >= 60 && amountAccomplishedPercentage < 80,
                ["bg-violet-500 border-violet-400"]: amountAccomplishedPercentage >= 80,
                ["border-white border-4"]: isCurrentDay // borda destacando o dia atual
            })}
            style={{ width: DAY_SIZE, height: DAY_SIZE }}
            activeOpacity={0.7}
            {...rest}
        />
    )
}