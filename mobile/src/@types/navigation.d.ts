export declare global {
    namespace ReactNavigation {
        interface RootParamList {
            home: undefined;
            // undefined porque home não terá nenhum parâmetro
            new: undefined;
            // na tela de hábito, passar por parâmetro a data selecionada
            habit: {
                // parâmetros que deseja levar de uma tela para outra
                date: string;
            }
        }
    }
}
